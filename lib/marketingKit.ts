/**
 * Internal marketing kit: UTM presets, copy blocks, and tracking notes.
 * Replace {{BASE}} in snippets with your production origin (see getSiteUrl()).
 */

export type UtmParams = Partial<{
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_content: string
  utm_term: string
}>

/** Build a URL with UTM query params (empty values omitted). */
export function buildUtmUrl(origin: string, pathname: string, params: UtmParams): string {
  const base = origin.replace(/\/$/, "")
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`
  const u = new URL(path, `${base}/`)
  for (const [key, val] of Object.entries(params)) {
    if (val && typeof val === "string") u.searchParams.set(key, val)
  }
  return u.toString()
}

export const UTM_FIELD_HELP: { param: string; use: string }[] = [
  { param: "utm_source", use: "Where traffic comes from (google, meta, newsletter, partner_name)." },
  { param: "utm_medium", use: "Channel type: cpc, paid_social, email, organic_social, referral." },
  { param: "utm_campaign", use: "Campaign name: spring_launch, brand_search, creator_tools_q2." },
  { param: "utm_content", use: "Differentiate creatives: hook_video_a, carousel_blue, text_ad_short." },
  { param: "utm_term", use: "Paid search keywords (optional); keep PII out." },
]

export type UtmPreset = {
  id: string
  label: string
  path: string
  params: UtmParams
  note: string
}

/** Swap {{CAMPAIGN}} in labels when duplicating presets in ad platforms. */
export const UTM_PRESETS: UtmPreset[] = [
  {
    id: "google-brand-search",
    label: "Google Ads — brand search → home",
    path: "/",
    params: {
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "brand_search",
      utm_content: "rsa_primary",
    },
    note: "Use for exact / phrase match on CreatorFlow365 and related brand terms.",
  },
  {
    id: "google-tools-nonbrand",
    label: "Google Ads — non-brand → /home",
    path: "/home",
    params: {
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "tools_nonbrand",
      utm_content: "rsa_tools_grid",
    },
    note: "Pair with landing page message that matches ad headline.",
  },
  {
    id: "meta-prospecting",
    label: "Meta — prospecting → /pricing",
    path: "/pricing",
    params: {
      utm_source: "meta",
      utm_medium: "paid_social",
      utm_campaign: "prospecting_creators",
      utm_content: "video_15s_v1",
    },
    note: "Rotate utm_content per creative for creative reporting.",
  },
  {
    id: "linkedin-sponsored",
    label: "LinkedIn — sponsored → /compare",
    path: "/compare",
    params: {
      utm_source: "linkedin",
      utm_medium: "paid_social",
      utm_campaign: "b2b_creators",
      utm_content: "single_image",
    },
    note: "Good for founder / operator audiences comparing stacks.",
  },
  {
    id: "email-newsletter",
    label: "Email — newsletter CTA → /home",
    path: "/home",
    params: {
      utm_source: "newsletter",
      utm_medium: "email",
      utm_campaign: "weekly_issue",
      utm_content: "hero_cta",
    },
    note: "Change utm_campaign per issue date or slug.",
  },
  {
    id: "twitter-organic",
    label: "X / Twitter — organic post → /",
    path: "/",
    params: {
      utm_source: "twitter",
      utm_medium: "organic_social",
      utm_campaign: "organic_posts",
      utm_content: "tweet_tools_thread",
    },
    note: "Optional for organic; helps separate from paid if you boost the same link.",
  },
  {
    id: "lifepack-cross",
    label: "Cross-promo — LifePack365",
    path: "/",
    params: {
      utm_source: "lifepack365",
      utm_medium: "referral",
      utm_campaign: "sister_product",
      utm_content: "footer_or_email",
    },
    note: "Point href to LifePack365 domain with its own UTMs when linking out from TM365 emails.",
  },
]

export const HEADLINES: string[] = [
  "One tab. 120+ tools. Built for creators who are tired of tab soup.",
  "Stop duct-taping ten SaaS products together — CreatorFlow365 is the toolkit layer.",
  "Invoices, hooks, CRM lite, and SEO helpers — without another $200/mo subscription stack.",
  "Ship content, get paid, and stay organized — micro-tools that actually load.",
]

export const SUBHEADS: string[] = [
  "Micro-SaaS utilities for content, money, clients, and integrations — pick a tool, run it, move on.",
  "From invoice reminders to thread composers: built for solo creators and small teams.",
  "No enterprise bloat — fast pages, clear outputs, credit-friendly pricing when you scale.",
]

export const CTAS: string[] = [
  "Browse all tools",
  "See plans & credits",
  "Compare vs. point tools",
  "Open the free tools on /home",
]

export const SOCIAL_SNIPPETS: { platform: string; text: string }[] = [
  {
    platform: "X (Twitter)",
    text: "If your \"stack\" is 14 browser tabs of half-broken free tools, same. I’ve been using CreatorFlow365 as one place for hooks, invoices, and dumb little utilities that should exist. {{BASE}}",
  },
  {
    platform: "LinkedIn",
    text: "Creators run a business, not just a channel. CreatorFlow365 bundles the boring ops (invoicing, reminders, CRM-lite) with the creative layer (hooks, schedulers, repurposing helpers). Worth a scroll: {{BASE}}/home",
  },
  {
    platform: "Short ad primary text",
    text: "120+ creator + freelancer tools in one marketplace. Try a tool in seconds — {{BASE}}/home",
  },
]

export const EMAIL_SUBJECTS: string[] = [
  "Tools for the week: invoice nudges + hook ideas (CreatorFlow365)",
  "Your creator ops stack is probably too expensive — here’s one alternative",
  "New in the kit: life tools + integrations (if you missed them)",
]

export const TRACKING_CHECKLIST: string[] = [
  "Set **NEXT_PUBLIC_SITE_URL** in Vercel Production + Preview so links, OG, and sitemap use the right host.",
  "In **Google Analytics / Plausible / etc.**, mark conversions: signup_started, checkout_started, trial_started (match your real events).",
  "Use **one utm_campaign per initiative**; change only utm_content per creative so reports stay clean.",
  "Add **exclude IP** (office / VPN) in ad platforms to avoid skewing conversion data.",
  "After launch, run a **URL inspection** in Search Console for `/` and `/home`.",
  "Keep a **spreadsheet**: Campaign | utm | spend | landing | CPA — sync weekly.",
  "For **LifePack365** outbound links, use separate UTMs on that domain so attribution does not collide with TM365.",
]

export const LANDING_SECTION_OUTLINE: string[] = [
  "Hero: headline + subhead + primary CTA (Try tools / View pricing) + trust line (tools load, no sketchy downloads).",
  "Proof strip: number of tools, categories (creators, finance, life tools), optional testimonial placeholder.",
  "How it works: 1) Pick a tool 2) Run in-browser 3) Save outputs — three bullets.",
  "Category grid: link to /home sections or /categories — match ad promise to section above the fold.",
  "Objections: pricing clarity, what needs API keys, what runs offline vs server.",
  "Footer CTA: repeat primary CTA + LifePack365 sister link if relevant.",
]
