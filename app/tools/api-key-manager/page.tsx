"use client"

import { useCallback, useEffect, useState } from "react"
import {
  decryptVault,
  encryptVault,
  maskSecret,
  type VaultKeyEntry,
} from "@/lib/apiKeyVault"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const STORAGE = "tm365-api-key-vault-v1"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 !text-neutral-900 dark:!text-neutral-100 placeholder:text-neutral-600 dark:placeholder:text-neutral-400"

const copy = {
  en: {
    title: "API key manager",
    description:
      "Keys are encrypted with your passphrase and stored only in this browser's localStorage. Use a real secrets manager for production; this is for staging keys and rotation reminders.",
    errPassphraseLength: "Use a passphrase of at least 8 characters.",
    errPassphraseMismatch: "Passphrases do not match.",
    errWrongPassphrase: "Wrong passphrase or vault data is damaged.",
    loading: "Loading…",
    createVault: "Create a vault",
    passphrasePlaceholder: "Passphrase (8+ characters)",
    confirmPassphrasePlaceholder: "Confirm passphrase",
    createEncryptedVault: "Create encrypted vault",
    unlockVault: "Unlock vault",
    passphrasePlaceholderShort: "Passphrase",
    unlock: "Unlock",
    lock: "Lock",
    addKey: "Add key",
    labelPlaceholder: "Label (e.g. Stripe test)",
    secretPlaceholder: "Secret value",
    saveKey: "Save key",
    noKeysYet: "No keys yet.",
    lastMarkedRotated: (date: string) => `Last marked rotated: ${date}`,
    hide: "Hide",
    reveal: "Reveal",
    markRotatedToday: "Mark rotated today",
    remove: "Remove",
    tipRotate: "Rotate keys on a schedule; revoke old keys in the provider dashboard.",
    tipNeverCommit: "Never commit secrets to git or paste them into shared docs.",
  },
  es: {
    title: "Administrador de claves API",
    description:
      "Las claves se cifran con tu contraseña y se guardan solo en el almacenamiento local de este navegador. Usa un gestor de secretos real para producción; esto es para claves de prueba y recordatorios de rotación.",
    errPassphraseLength: "Usa una contraseña de al menos 8 caracteres.",
    errPassphraseMismatch: "Las contraseñas no coinciden.",
    errWrongPassphrase: "Contraseña incorrecta o los datos de la bóveda están dañados.",
    loading: "Cargando…",
    createVault: "Crear una bóveda",
    passphrasePlaceholder: "Contraseña (8+ caracteres)",
    confirmPassphrasePlaceholder: "Confirmar contraseña",
    createEncryptedVault: "Crear bóveda cifrada",
    unlockVault: "Desbloquear bóveda",
    passphrasePlaceholderShort: "Contraseña",
    unlock: "Desbloquear",
    lock: "Bloquear",
    addKey: "Añadir clave",
    labelPlaceholder: "Etiqueta (ej. Stripe test)",
    secretPlaceholder: "Valor secreto",
    saveKey: "Guardar clave",
    noKeysYet: "Aún no hay claves.",
    lastMarkedRotated: (date: string) => `Última rotación marcada: ${date}`,
    hide: "Ocultar",
    reveal: "Mostrar",
    markRotatedToday: "Marcar rotada hoy",
    remove: "Eliminar",
    tipRotate: "Rota las claves según un calendario; revoca las antiguas en el panel del proveedor.",
    tipNeverCommit: "Nunca subas secretos a git ni los pegues en documentos compartidos.",
  },
}

export default function ApiKeyManagerPage() {
  const { language } = useLanguage()
  const c = copy[language]
  const [blob, setBlob] = useState("")
  const [phase, setPhase] = useState<"init" | "none" | "locked" | "unlocked">("init")
  const [pass, setPass] = useState("")
  const [pass2, setPass2] = useState("")
  const [masterPass, setMasterPass] = useState("")
  const [keys, setKeys] = useState<VaultKeyEntry[]>([])
  const [err, setErr] = useState("")
  const [newName, setNewName] = useState("")
  const [newVal, setNewVal] = useState("")
  const [revealId, setRevealId] = useState<string | null>(null)

  useEffect(() => {
    const b = typeof window !== "undefined" ? localStorage.getItem(STORAGE) || "" : ""
    setBlob(b)
    setPhase(b ? "locked" : "none")
  }, [])

  const persistKeys = useCallback(
    async (next: VaultKeyEntry[], passphrase: string) => {
      const packed = await encryptVault(passphrase, { version: 1, keys: next })
      localStorage.setItem(STORAGE, packed)
      setBlob(packed)
      setKeys(next)
    },
    []
  )

  const createVault = async () => {
    setErr("")
    if (pass.length < 8) {
      setErr(c.errPassphraseLength)
      return
    }
    if (pass !== pass2) {
      setErr(c.errPassphraseMismatch)
      return
    }
    try {
      await persistKeys([], pass)
      setMasterPass(pass)
      setPhase("unlocked")
      setPass("")
      setPass2("")
    } catch (e) {
      setErr(String(e))
    }
  }

  const unlock = async () => {
    setErr("")
    try {
      const payload = await decryptVault(pass, blob)
      setKeys(payload.keys)
      setMasterPass(pass)
      setPhase("unlocked")
      setPass("")
    } catch {
      setErr(c.errWrongPassphrase)
    }
  }

  const lock = () => {
    setMasterPass("")
    setKeys([])
    setRevealId(null)
    setPhase(blob ? "locked" : "none")
  }

  const addKey = async () => {
    if (!newName.trim() || !newVal.trim() || !masterPass) return
    const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`
    try {
      await persistKeys([...keys, { id, name: newName.trim(), value: newVal.trim() }], masterPass)
      setNewName("")
      setNewVal("")
    } catch (e) {
      setErr(String(e))
    }
  }

  const removeKey = async (id: string) => {
    if (!masterPass) return
    try {
      await persistKeys(
        keys.filter((k) => k.id !== id),
        masterPass
      )
    } catch (e) {
      setErr(String(e))
    }
  }

  const markRotated = async (id: string) => {
    if (!masterPass) return
    try {
      await persistKeys(
        keys.map((k) =>
          k.id === id ? { ...k, lastRotated: new Date().toISOString() } : k
        ),
        masterPass
      )
    } catch (e) {
      setErr(String(e))
    }
  }

  if (phase === "init") {
    return <div className="p-6 text-mono-600 dark:text-mono-400">{c.loading}</div>
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6 text-mono-900 dark:text-mono-100">
      <h1 className="text-2xl font-bold">{c.title}</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">
        {c.description}
      </p>
      {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}

      {phase === "none" ? (
        <section className="space-y-3 rounded-lg border border-mono-200 dark:border-mono-700 p-4">
          <p className="text-sm font-medium">{c.createVault}</p>
          <input
            type="password"
            className={inputClass}
            placeholder={c.passphrasePlaceholder}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoComplete="new-password"
          />
          <input
            type="password"
            className={inputClass}
            placeholder={c.confirmPassphrasePlaceholder}
            value={pass2}
            onChange={(e) => setPass2(e.target.value)}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => void createVault()}
            className="rounded-lg bg-black dark:bg-mono-100 px-4 py-2 text-sm font-semibold text-white dark:text-mono-950"
          >
            {c.createEncryptedVault}
          </button>
        </section>
      ) : null}

      {phase === "locked" ? (
        <section className="space-y-3 rounded-lg border border-mono-200 dark:border-mono-700 p-4">
          <p className="text-sm font-medium">{c.unlockVault}</p>
          <input
            type="password"
            className={inputClass}
            placeholder={c.passphrasePlaceholderShort}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => void unlock()}
            className="rounded-lg bg-black dark:bg-mono-100 px-4 py-2 text-sm font-semibold text-white dark:text-mono-950"
          >
            {c.unlock}
          </button>
        </section>
      ) : null}

      {phase === "unlocked" ? (
        <>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={lock}
              className="rounded-lg border border-mono-300 dark:border-mono-600 px-3 py-1.5 text-sm"
            >
              {c.lock}
            </button>
          </div>
          <section className="space-y-3 rounded-lg border border-mono-200 dark:border-mono-700 p-4">
            <p className="text-sm font-medium">{c.addKey}</p>
            <input
              className={inputClass}
              placeholder={c.labelPlaceholder}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              className={inputClass}
              type="password"
              placeholder={c.secretPlaceholder}
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => void addKey()}
              className="rounded-lg bg-black dark:bg-mono-100 px-4 py-2 text-sm font-semibold text-white dark:text-mono-950"
            >
              {c.saveKey}
            </button>
          </section>
          <ul className="space-y-3 text-sm">
            {keys.length === 0 ? (
              <li className="text-mono-500">{c.noKeysYet}</li>
            ) : (
              keys.map((k) => (
                <li
                  key={k.id}
                  className="flex flex-col gap-2 rounded border border-mono-200 dark:border-mono-700 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{k.name}</span>
                    <code className="text-xs bg-mono-100 dark:bg-mono-900 px-2 py-0.5 rounded">
                      {revealId === k.id ? k.value : maskSecret(k.value)}
                    </code>
                  </div>
                  {k.lastRotated ? (
                    <p className="text-xs text-mono-500">{c.lastMarkedRotated(k.lastRotated)}</p>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="text-xs text-accent-600 hover:underline"
                      onClick={() => setRevealId((id) => (id === k.id ? null : k.id))}
                    >
                      {revealId === k.id ? c.hide : c.reveal}
                    </button>
                    <button
                      type="button"
                      className="text-xs text-accent-600 hover:underline"
                      onClick={() => void markRotated(k.id)}
                    >
                      {c.markRotatedToday}
                    </button>
                    <button
                      type="button"
                      className="text-xs text-red-600 dark:text-red-400 hover:underline"
                      onClick={() => void removeKey(k.id)}
                    >
                      {c.remove}
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
          <ul className="text-xs text-mono-600 dark:text-mono-400 list-disc pl-5 space-y-1">
            <li>{c.tipRotate}</li>
            <li>{c.tipNeverCommit}</li>
          </ul>
        </>
      ) : null}
    </div>
  )
}
