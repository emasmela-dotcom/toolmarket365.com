import { GUMROAD_LINKS } from '@/lib/gumroad-config'

/**
 * Public subscription tiers (what you sell as “two choices”).
 * `planName` must match `plans.name` in the database (see `lib/subscription_tables.sql`)
 * so `/select-plan?plan=…` and trials resolve correctly.
 *
 * Other rows (`starter`, `creator`, `business`) can remain in DB for legacy users;
 * new marketing should use only these two.
 */
export type GumroadSubscriptionKey = keyof typeof GUMROAD_LINKS.subscriptions

export type PublicSubscriptionTier = {
  /** Stable id for React keys / analytics */
  id: 'creator' | 'pro'
  /** Value for `?plan=` and API `plans.name` */
  planName: string
  /** Short card title */
  headline: string
  /** One line: who this is for (not a feature spreadsheet) */
  positioning: string
  /** Shown on pricing; Gumroad/Stripe is source of truth for actual charge */
  monthlyPriceUsd: number
  /** Resolves checkout URL from `GUMROAD_LINKS` */
  gumroadKey: GumroadSubscriptionKey
}

export const PUBLIC_SUBSCRIPTION_TIERS: PublicSubscriptionTier[] = [
  {
    id: 'creator',
    planName: 'essential',
    headline: 'Creator',
    positioning:
      'A real toolkit for creators who are getting consistent—everything you need to start without going all-in yet.',
    monthlyPriceUsd: 19,
    gumroadKey: 'essential',
  },
  {
    id: 'pro',
    planName: 'professional',
    headline: 'Pro',
    positioning:
      'The all-in version for when this stack is core to how you work—not a longer feature list, fewer limits in your head.',
    monthlyPriceUsd: 49,
    // Gumroad product labeled “creator” is the ~$49 / former-Pro slot in this repo’s config
    gumroadKey: 'creator',
  },
]

export function gumroadUrlForTier(gumroadKey: GumroadSubscriptionKey): string {
  return GUMROAD_LINKS.subscriptions[gumroadKey]
}

export const PUBLIC_TIER_PLAN_NAMES = PUBLIC_SUBSCRIPTION_TIERS.map((t) => t.planName)
