/**
 * Client-side vault: encrypt API keys with a passphrase before writing to localStorage.
 * Intended for convenience only — use a dedicated secrets manager for production systems.
 */

const te = new TextEncoder()

function u8ToB64(u8: Uint8Array): string {
  let s = ''
  for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]!)
  return btoa(s)
}

function b64ToU8(b64: string): Uint8Array {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  /** Copy so PBKDF2 `salt` is a plain ArrayBuffer-backed Uint8Array (TS DOM typings). */
  const saltCopy = new Uint8Array(salt)
  const material = await crypto.subtle.importKey('raw', te.encode(passphrase), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltCopy,
      iterations: 210_000,
      hash: 'SHA-256',
    },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export type VaultKeyEntry = {
  id: string
  name: string
  value: string
  lastRotated?: string
}

export type VaultPayload = {
  version: 1
  keys: VaultKeyEntry[]
}

export type PackedVault = {
  v: 1
  salt: string
  iv: string
  data: string
}

export async function encryptVault(passphrase: string, payload: VaultPayload): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(passphrase, salt)
  const pt = te.encode(JSON.stringify(payload))
  const ivCopy = new Uint8Array(iv)
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: ivCopy }, key, pt))
  const packed: PackedVault = {
    v: 1,
    salt: u8ToB64(salt),
    iv: u8ToB64(iv),
    data: u8ToB64(ct),
  }
  return JSON.stringify(packed)
}

export async function decryptVault(passphrase: string, packedJson: string): Promise<VaultPayload> {
  const packed = JSON.parse(packedJson) as PackedVault
  if (packed.v !== 1 || !packed.salt || !packed.iv || !packed.data) {
    throw new Error('Invalid vault file')
  }
  const salt = b64ToU8(packed.salt)
  const iv = new Uint8Array(b64ToU8(packed.iv))
  const data = new Uint8Array(b64ToU8(packed.data))
  const key = await deriveKey(passphrase, new Uint8Array(salt))
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
  const json = new TextDecoder().decode(pt)
  const payload = JSON.parse(json) as VaultPayload
  if (payload.version !== 1 || !Array.isArray(payload.keys)) {
    throw new Error('Invalid vault payload')
  }
  return payload
}

export function maskSecret(value: string): string {
  const v = value.trim()
  if (v.length <= 6) return '•'.repeat(Math.min(8, Math.max(4, v.length)))
  return `${v.slice(0, 3)}…${v.slice(-3)}`
}
