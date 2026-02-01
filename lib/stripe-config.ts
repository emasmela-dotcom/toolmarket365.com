/**
 * Stripe price IDs from env. Create products/prices in Stripe Dashboard and set these.
 * Subscriptions: recurring monthly. Credits: one-time.
 */
const env = process.env

export const STRIPE_PRICE_IDS = {
  subscriptions: {
    starter: env.STRIPE_PRICE_STARTER ?? '',
    essential: env.STRIPE_PRICE_ESSENTIAL ?? '',
    professional: env.STRIPE_PRICE_PROFESSIONAL ?? '',
    creator: env.STRIPE_PRICE_CREATOR ?? '',
    business: env.STRIPE_PRICE_BUSINESS ?? '',
  },
  credits: {
    bundle50: env.STRIPE_PRICE_CREDITS_50 ?? '',
    bundle100: env.STRIPE_PRICE_CREDITS_100 ?? '',
    bundle250: env.STRIPE_PRICE_CREDITS_250 ?? '',
  },
} as const

export type SubscriptionPlanId = keyof typeof STRIPE_PRICE_IDS.subscriptions
export type CreditBundleId = keyof typeof STRIPE_PRICE_IDS.credits

export function getStripePriceId(
  type: 'subscription',
  planId: string
): string | null
export function getStripePriceId(
  type: 'credits',
  bundleId: string
): string | null
export function getStripePriceId(
  type: 'subscription' | 'credits',
  id: string
): string | null {
  if (type === 'subscription') {
    const key = id as SubscriptionPlanId
    const value = STRIPE_PRICE_IDS.subscriptions[key]
    return value || null
  }
  const key = id as CreditBundleId
  const value = STRIPE_PRICE_IDS.credits[key]
  return value || null
}
