# ToolMarket365 — Project Status

**Last Updated:** May 20, 2026

## Project overview

ToolMarket365 is a micro-SaaS marketplace (120+ tools) for creators and solo operators. Live at **https://www.toolmarket365.com**. Config: `lib/siteConfig.ts`.

## What's complete

### Product & brand
- ToolMarket365 branding sitewide (not CreatorFlow365)
- Tab title: `toolmarket365.com`
- Single plan: **$0.99/month** on `/pricing`, `/compare`, select-plan
- `/tools/*` subscription gate (`app/tools/layout.tsx`)

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
- `NEXT_PUBLIC_SITE_URL` → https://www.toolmarket365.com (recommended)

## Deferred / optional

- **`OPENAI_API_KEY` in Vercel** — skipped; env-backed routes (content-repurpose, trend-explainer, action-items) return 500 until added
- **In-app AI burn checklist** (#1, #4–10) — not run; #2–3 done via `scripts/smoke-burn-checklist.mjs`
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
