/** Single public plan: ToolMarket365 @ $0.99/month — full marketplace access. */
export const MARKETPLACE_PLAN_DB_NAME = 'starter' as const

export const MARKETPLACE_PLAN_DISPLAY_NAME = 'ToolMarket365'

export const MARKETPLACE_PLAN_PRICE_MONTHLY = 0.99

export const MARKETPLACE_PLAN_TAGLINE =
  '$0.99/month — every tool on the site while you are subscribed.'

export const MARKETPLACE_PLAN_INCLUDES = [
  'Full access to every tool on ToolMarket365 (120+ tools)',
  'Browse the catalog anytime',
  'Use all tool features while subscribed',
  'Cancel anytime',
] as const

export function normalizePlanRow<T extends { name: string; display_name?: string; price_monthly?: unknown }>(
  plan: T
): T & { display_name: string; price_monthly: number } {
  if (plan.name !== MARKETPLACE_PLAN_DB_NAME) return plan as T & { display_name: string; price_monthly: number }
  return {
    ...plan,
    display_name: MARKETPLACE_PLAN_DISPLAY_NAME,
    price_monthly: MARKETPLACE_PLAN_PRICE_MONTHLY,
  }
}
