import type { SubscriptionPlanId } from '@/lib/stripe-config'

/**
 * Wiring only: which DB plan row pairs with which Stripe price env key for your **two** public tiers.
 * Dollar amounts are **not** defined here—they come from Stripe and from your `plans` table in the DB.
 * Edit `planName` / `stripePlanId` / copy when **you** decide; nothing here recommends a price.
 */
export type PublicSubscriptionTier = {
  id: 'creator' | 'pro'
  planName: string
  headline: string
  positioning: string
  stripePlanId: SubscriptionPlanId
}

export const PUBLIC_SUBSCRIPTION_TIERS: PublicSubscriptionTier[] = [
  {
    id: 'creator',
    planName: 'essential',
    headline: 'Creator',
    positioning:
      'A real toolkit for creators who are getting consistent—everything you need to start without going all-in yet.',
    stripePlanId: 'essential',
  },
  {
    id: 'pro',
    planName: 'professional',
    headline: 'Pro',
    positioning:
      'The all-in version for when this stack is core to how you work—not a longer feature list, fewer limits in your head.',
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
