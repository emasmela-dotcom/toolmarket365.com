import { mkdir, readFile, writeFile } from "fs/promises"
import { join } from "path"

type LocalUser = {
  id: string
  email: string
  passwordHash: string
  createdAt: string
}

type LocalSession = {
  tokenHash: string
  userId: string
  expiresAt: string
}

type LocalReset = {
  tokenHash: string
  userId: string
  expiresAt: string
  usedAt?: string
}

type LocalAuthStore = {
  users: LocalUser[]
  sessions: LocalSession[]
  resets: LocalReset[]
}

const STORE_DIR = join(process.cwd(), ".local-data")
const STORE_FILE = join(STORE_DIR, "auth.json")

const EMPTY_STORE: LocalAuthStore = {
  users: [],
  sessions: [],
  resets: [],
}

async function readStore(): Promise<LocalAuthStore> {
  try {
    const raw = await readFile(STORE_FILE, "utf8")
    const parsed = JSON.parse(raw) as Partial<LocalAuthStore>
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      resets: Array.isArray(parsed.resets) ? parsed.resets : [],
    }
  } catch {
    return EMPTY_STORE
  }
}

async function writeStore(store: LocalAuthStore): Promise<void> {
  await mkdir(STORE_DIR, { recursive: true })
  await writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf8")
}

export async function createLocalUser(input: {
  id: string
  email: string
  passwordHash: string
}): Promise<{ ok: true; user: { id: string; email: string } } | { ok: false; reason: "exists" }> {
  const store = await readStore()
  const exists = store.users.some((u) => u.email === input.email)
  if (exists) return { ok: false, reason: "exists" }
  store.users.push({
    id: input.id,
    email: input.email,
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  })
  await writeStore(store)
  return { ok: true, user: { id: input.id, email: input.email } }
}

export async function getLocalUserByEmail(email: string): Promise<LocalUser | null> {
  const store = await readStore()
  return store.users.find((u) => u.email === email) || null
}

export async function createLocalSession(session: {
  tokenHash: string
  userId: string
  expiresAt: string
}): Promise<void> {
  const store = await readStore()
  store.sessions = store.sessions.filter((s) => !(s.userId === session.userId && s.tokenHash === session.tokenHash))
  store.sessions.push(session)
  await writeStore(store)
}

export async function getLocalUserFromSessionTokenHash(tokenHash: string): Promise<{ id: string; email: string } | null> {
  const store = await readStore()
  const now = Date.now()
  store.sessions = store.sessions.filter((s) => new Date(s.expiresAt).getTime() > now)
  const session = store.sessions.find((s) => s.tokenHash === tokenHash)
  if (!session) {
    await writeStore(store)
    return null
  }
  const user = store.users.find((u) => u.id === session.userId)
  await writeStore(store)
  return user ? { id: user.id, email: user.email } : null
}

export async function deleteLocalSessionByTokenHash(tokenHash: string): Promise<void> {
  const store = await readStore()
  store.sessions = store.sessions.filter((s) => s.tokenHash !== tokenHash)
  await writeStore(store)
}

export async function createLocalReset(input: {
  tokenHash: string
  userId: string
  expiresAt: string
}): Promise<void> {
  const store = await readStore()
  store.resets.push(input)
  await writeStore(store)
}

export async function consumeLocalResetToken(input: {
  tokenHash: string
  newPasswordHash: string
}): Promise<"ok" | "invalid_or_expired" | "already_used"> {
  const store = await readStore()
  const reset = store.resets.find((r) => r.tokenHash === input.tokenHash)
  if (!reset) return "invalid_or_expired"
  if (reset.usedAt) return "already_used"
  if (new Date(reset.expiresAt).getTime() < Date.now()) return "invalid_or_expired"

  const user = store.users.find((u) => u.id === reset.userId)
  if (!user) return "invalid_or_expired"

  user.passwordHash = input.newPasswordHash
  reset.usedAt = new Date().toISOString()
  store.sessions = store.sessions.filter((s) => s.userId !== user.id)
  await writeStore(store)
  return "ok"
}
