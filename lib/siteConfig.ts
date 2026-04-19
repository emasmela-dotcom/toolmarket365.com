/** Canonical public site URL (no trailing slash). */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://creatorflow365.com"
  return raw.replace(/\/$/, "")
}

export const SITE_NAME = "ToolMarket365"

export const SITE_DESCRIPTION =
  "Micro-SaaS tools for creators and solo operators: content, monetization, client work, analytics, finance, and integrations — one marketplace to ship faster."

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
  "ToolMarket365",
  "CreatorFlow365",
  "LifePack365",
  "lifepack365",
]

/** Sister product — set `NEXT_PUBLIC_LIFEPACK365_URL` in Vercel when the live URL is final. */
export function getLifepack365Url(): string {
  const raw =
    process.env.NEXT_PUBLIC_LIFEPACK365_URL?.trim() || "https://lifepack365.com"
  return raw.replace(/\/$/, "")
}

export const LIFEPACK365_NAME = "LifePack365"
