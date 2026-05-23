# ToolMarket365 — Project handoff

**Last updated:** May 20, 2026

## What it is

- **Product:** ToolMarket365 — micro-SaaS marketplace with 120+ tools (creator, business, local services, etc.).
- **Live site:** https://www.toolmarket365.com (Vercel production Ready).
- **Repo folder:** Often still `micro-saas-marketplace-v2` on disk; Vercel project may show `micro-saas-marketplace`. Names don’t have to match.
- **npm package name:** `micro-saas-marketplace-v2` (internal only).

## Branding (important)

- **Not** CreatorFlow365 for this project (mistaken mix-up; reverted).
- **Site brand:** ToolMarket365 on pages (`lib/siteConfig.ts`).
- **Browser tab title:** `toolmarket365.com`
- **Default URL in code:** https://toolmarket365.com

## Pricing model (current)

- **One plan:** $0.99/month (`starter` in DB).
- Browse tool pages free on `/tools/*`; **using** gated tools requires active subscription (per-tool `ToolAccessGate` / APIs).
- Removed from `/pricing`: AI Power Pack ($15), Basic/Full Creator tiers, multi-tier marketing.

## Payments (Stripe)

- **Checkout:** `/api/stripe/create-checkout-session`
- **Vercel Production env:**
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_PRICE_STARTER` = Stripe Price ID for $0.99/month (`price_...`) — e.g. ToolMarket365 Starter
  - `DATABASE_URL` = Neon pooled connection string
  - `NEXT_PUBLIC_SITE_URL` = https://www.toolmarket365.com (recommended)
- Stripe dashboard: create product/price manually; domain is not auto-linked.

## Database

- Neon project (may still be named `micro-saas-marketplace` internally).
- Plan in DB: `starter` with `price_monthly = 0.99` for select-plan UI.
- Active subscription unlocks tools (per-plan tool list check relaxed in `lib/subscription.ts`).

## Key routes

| URL | Purpose |
|-----|---------|
| `/` | Homepage — tool catalog |
| `/pricing` | Single $0.99 plan |
| `/select-plan?plan=starter` | Subscribe / trial |
| `/compare` | Competitor comparison |
| `/tools/...` | Individual tools (subscription required) |
| `/login`, `/signup` | Auth |

## Local dev

```bash
cd micro-saas-marketplace-v2   # or your folder name
npm run dev -- -H 127.0.0.1 -p 3001
```

Open: http://127.0.0.1:3001/

## API smoke test (approved usage checklist #2–3)

```bash
PRODUCTION_URL=https://www.toolmarket365.com node scripts/smoke-burn-checklist.mjs
```

- Template routes: OK on production without OpenAI.
- `/api/content-repurpose`, `/api/trend-explainer`, `/api/action-items`: need `OPENAI_API_KEY` in Vercel (currently **skipped** by choice).
- `/api/bots/*`, `/api/assistant/chat`: require logged-in session (401 from CLI).

## OpenAI (optional)

- `OPENAI_API_KEY` in Vercel = platform pays OpenAI for env-backed routes.
- **Skipped for launch:** template tools + user keys via `/integrations` remain the model.

## What NOT to do unless Eric asks

- Rebrand to CreatorFlow365.
- Add tiers, add-ons, or new pricing.
- Assume Vercel project name = product name.
- Burn usage: mass AI fill, live OAuth, production emails, ads, load tests (see smoke script footer).

## Recent production work (May 2026)

- Stripe product **ToolMarket365 Starter** @ $0.99/month
- `STRIPE_PRICE_STARTER` set in Vercel; production deploy Ready
- Production API smoke: template routes pass; OpenAI env skipped; bots need auth

---

*Paste this summary into new Cursor sessions: “Work only on ToolMarket365 at toolmarket365.com; $0.99/month single plan; no extra tiers.”*
