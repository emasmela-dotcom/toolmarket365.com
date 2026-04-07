# Stripe Setup for CreatorFlow365

When Stripe env vars are set, the site uses **Stripe Checkout** for subscriptions and credit bundles. Otherwise it falls back to Gumroad links.

## 1. Env vars

In `.env` (local) and Vercel → Project → Settings → Environment Variables (production), set:

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Secret key from Stripe Dashboard (Developers → API keys). Use `sk_test_...` for test, `sk_live_...` for live. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Publishable key (`pk_test_...` or `pk_live_...`). Used by the frontend to know Stripe is enabled. |
| `STRIPE_PRICE_STARTER` | Price ID for Starter plan ($9/month recurring). |
| `STRIPE_PRICE_ESSENTIAL` | Price ID for Essential ($19/month). |
| `STRIPE_PRICE_PROFESSIONAL` | Price ID for Professional ($49/month). |
| `STRIPE_PRICE_CREATOR` | Price ID for Creator ($79/month). |
| `STRIPE_PRICE_BUSINESS` | Price ID for Business ($149/month). |
| `STRIPE_PRICE_CREDITS_50` | Price ID for 50 credits one-time ($5). |
| `STRIPE_PRICE_CREDITS_100` | Price ID for 100 credits one-time ($10). |
| `STRIPE_PRICE_CREDITS_250` | Price ID for 250 credits one-time ($22.50). |

## 2. Create products and prices in Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Products** → **Add product**.
2. For each plan and credit bundle:
   - **Name:** e.g. "CreatorFlow365 Starter", "50 Credits".
   - **Pricing:**
     - Subscriptions: **Recurring** → Monthly, amount (e.g. $9, $19, $49, $79, $149).
     - Credits: **One time** → amount ($5, $10, $22.50).
3. After saving, open each product and copy the **Price ID** (starts with `price_`) into the matching env var.

## 3. Success / cancel URLs

Checkout success URL is set to `${NEXT_PUBLIC_SITE_URL}/checkout/success`; cancel URL is `/pricing`. Ensure `NEXT_PUBLIC_SITE_URL` is set in production (e.g. `https://creatorflow365.com`).

## 4. Bank account (live mode)

For real payments you need a connected bank account in Stripe (Dashboard → **Settings** → **Payouts**). Test mode does not require it.

## 5. Optional: webhooks

To grant access or credits after payment (e.g. update your DB), add a webhook endpoint (e.g. `/api/stripe/webhook`) and subscribe to `checkout.session.completed` and `customer.subscription.*` in Stripe Dashboard → Developers → Webhooks. For now, success redirect is enough; you can add webhook logic later.
