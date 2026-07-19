# ToolMarket365 — Project Status

**Last Updated:** July 19, 2026

## Project overview

ToolMarket365 is a micro-SaaS marketplace (120+ tools) for creators and solo operators. Live at **https://www.toolmarket365.com**. Config: `lib/siteConfig.ts`.

## What's complete

### Product & brand
- ToolMarket365 branding sitewide (not CreatorFlow365)
- Tab title: `toolmarket365.com`
- Single plan: **$0.99/month** on `/pricing`, `/compare`, select-plan
- Tool pages browsable; subscription gates on individual tools / APIs
- SEO: dynamic `sitemap.xml` + `robots.ts`, `llms.txt` for AI crawlers
- **Spanish:** EN/ES language button sitewide; main pages + tool access gate translated

### Payments (Stripe) — May 2026
- Stripe product **ToolMarket365 Starter** — $0.99/month recurring
- Vercel `STRIPE_PRICE_STARTER` = `price_...` (production)
- Checkout: `/api/stripe/create-checkout-session`
- Production deploy: **Ready** on www.toolmarket365.com

### Tools & platform
- 120+ tool pages built; homepage catalog
- Platform filtering; credits display where applicable
- Template-based API tools work on production (smoke test pass)

### Build & deploy
- Vercel project: `micro-saas-marketplace` (name ≠ product name — OK)
- Git connected to: `emasmela-dotcom/toolmarket365.com` (old Micro-SaaS-marketplace link removed)
- `NEXT_PUBLIC_SITE_URL` → https://www.toolmarket365.com (recommended)
- `OPENAI_API_KEY` set in Vercel (Production + Preview) — needs a fresh deploy to load

## Deferred / optional

- **In-app AI burn checklist** (#1, #4–10) — partial; re-run OpenAI routes after fresh deploy
- Smoke template routes (#2–3): `scripts/smoke-burn-checklist.mjs` — local + production pass
- **Gumroad** — fallback when Stripe unset; primary path is Stripe
- Old multi-tier Stripe products ($9–$149) — ignore; archive in Stripe when convenient

## Next steps (launch finish)

1. **You:** One live checkout test — `/pricing` → pay → confirm $0.99 on Stripe Checkout → land on success → open a gated tool
2. **Optional:** Archive legacy Stripe tier products
3. **Marketing** — site is wired; focus on traffic and support

## Handoff doc

Full context for new sessions: **`PROJECT_HANDOFF.md`**

## Do not unless Eric asks

- CreatorFlow365 rebrand
- New pricing tiers or add-ons
- Strip layout/nav to “fix” bugs
- Auto-run usage-burning tests (ads, OAuth, mass AI, load test signups)

## Update this file

When shipping significant changes: what completed, what's next, blockers.

---

*Maintains context across Cursor sessions.*
