import type { SubscriptionPlanId } from '@/lib/stripe-config'

/**
 * Public subscription tiers (two choices for new customers).
 *
 * - `planName` → must match `plans.name` in the database (`/select-plan?plan=`, trials).
 * - `stripePlanId` → must match keys in `STRIPE_PRICE_IDS.subscriptions` / env vars in `lib/stripe-config.ts`
 *   (`getStripePriceId('subscription', stripePlanId)`).
 *
 * Checkout: use Stripe (`/api/stripe/create-checkout-session` with `planId: stripePlanId`).
 * Gumroad is not used for these tiers.
 */
export type PublicSubscriptionTier = {
  id: 'creator' | 'pro'
  planName: string
  headline: string
  positioning: string
  monthlyPriceUsd: number
  stripePlanId: SubscriptionPlanId
}

export const PUBLIC_SUBSCRIPTION_TIERS: PublicSubscriptionTier[] = [
  {
    id: 'creator',
    planName: 'essential',
    headline: 'Creator',
    positioning:
      'A real toolkit for creators who are getting consistent—everything you need to start without going all-in yet.',
    monthlyPriceUsd: 19,
    stripePlanId: 'essential',
  },
  {
    id: 'pro',
    planName: 'professional',
    headline: 'Pro',
    positioning:
      'The all-in version for when this stack is core to how you work—not a longer feature list, fewer limits in your head.',
    monthlyPriceUsd: 49,
    stripePlanId: 'professional',
  },
]

export const PUBLIC_TIER_PLAN_NAMES = PUBLIC_SUBSCRIPTION_TIERS.map((t) => t.planName)

/** Map DB plan name → Stripe checkout id (for `/api/stripe/create-checkout-session`). */
export function stripePlanIdForDbPlanName(planName: string): SubscriptionPlanId | null {
  const row = PUBLIC_SUBSCRIPTION_TIERS.find(
    (t) => t.planName.toLowerCase() === planName.toLowerCase()
  )
  return row?.stripePlanId ?? null
}
