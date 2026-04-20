export type ShortLinkRecord = {
  targetUrl: string
  clicks: number
  createdAt: string
}

const map = new Map<string, ShortLinkRecord>()

function compoundKey(workspaceToken: string, slug: string) {
  return `${workspaceToken}::${slug}`
}

/** Lowercase slug: letters/digits; hyphens allowed in the middle (2–32 chars). */
const slugRe = /^[a-z0-9]([a-z0-9-]{0,30}[a-z0-9])?$/

export function isValidWorkspaceToken(t: string): boolean {
  return /^[a-zA-Z0-9_-]{16,128}$/.test(t)
}

export function isValidSlug(slug: string): boolean {
  return slugRe.test(slug)
}

export function createShortLink(
  workspaceToken: string,
  slug: string,
  targetUrl: string
): { ok: true } | { ok: false; error: string } {
  if (!isValidWorkspaceToken(workspaceToken)) return { ok: false, error: 'Invalid workspace token' }
  if (!isValidSlug(slug)) return { ok: false, error: 'Slug must be lowercase letters, digits, hyphens (2–32 chars)' }
  try {
    const u = new URL(targetUrl)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
      return { ok: false, error: 'Only http and https URLs are allowed' }
    }
  } catch {
    return { ok: false, error: 'Invalid destination URL' }
  }
  const k = compoundKey(workspaceToken, slug)
  if (map.has(k)) return { ok: false, error: 'Slug already exists for this workspace' }
  map.set(k, { targetUrl, clicks: 0, createdAt: new Date().toISOString() })
  return { ok: true }
}

export function resolveAndCountClick(workspaceToken: string, slug: string): string | null {
  const k = compoundKey(workspaceToken, slug)
  const rec = map.get(k)
  if (!rec) return null
  rec.clicks += 1
  return rec.targetUrl
}

export function listShortLinksForWorkspace(workspaceToken: string): {
  slug: string
  targetUrl: string
  clicks: number
  createdAt: string
}[] {
  const prefix = `${workspaceToken}::`
  const out: { slug: string; targetUrl: string; clicks: number; createdAt: string }[] = []
  for (const [k, v] of map) {
    if (k.startsWith(prefix)) {
      out.push({ slug: k.slice(prefix.length), targetUrl: v.targetUrl, clicks: v.clicks, createdAt: v.createdAt })
    }
  }
  return out.sort((a, b) => a.slug.localeCompare(b.slug))
}
