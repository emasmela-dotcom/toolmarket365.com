/** Canonical public site URL (no trailing slash). Prefer www in production. */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.toolmarket365.com"
  return raw.replace(/\/$/, "")
}

export const SITE_NAME = "ToolMarket365"

/** Browser tab / window title */
export const SITE_WINDOW_TITLE = "toolmarket365.com"

export const SITE_DESCRIPTION =
  "120+ micro-SaaS tools for creators and solo operators: content, monetization, client work, analytics, finance, local services, life tools, and plain-language legal helpers — one marketplace at $0.99/month."

export const SITE_KEYWORDS = [
  "micro SaaS",
  "creator tools",
  "content creator",
  "freelancer tools",
  "social media tools",
  "invoicing",
  "SEO tools",
  "newsletter",
  "link in bio",
  "demand letter generator",
  "employment rights",
  "local business tools",
  "ToolMarket365",
  "tool marketplace",
]

/** Sister product base URL — only set when DNS is live. No default (avoids dead links). */
export function getLifepack365Url(): string | null {
  const raw = process.env.NEXT_PUBLIC_LIFEPACK365_URL?.trim()
  if (!raw) return null
  return raw.replace(/\/$/, "")
}

export const LIFEPACK365_NAME = "LifePack365"
