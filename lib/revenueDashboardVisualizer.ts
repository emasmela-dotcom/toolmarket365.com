export type RevenueDashboardInput = {
  mrr: number
  lastMonthRevenue: number
  growthPercentMoM?: number
  churnPercent?: number
  processor?: 'stripe' | 'paddle' | 'other'
}

export type RevenueDashboardResult = {
  headline: string
  bullets: string[]
  chartCaption: string
  paddleStripeNotes: string[]
}

export function visualizeSubscriptionRevenue(input: RevenueDashboardInput): RevenueDashboardResult {
  const mrr = Math.max(0, input.mrr)
  const last = Math.max(0, input.lastMonthRevenue)
  const g = input.growthPercentMoM ?? (last > 0 ? ((mrr * 12 - last) / last) * 100 : 0)
  const churn = Math.min(100, Math.max(0, input.churnPercent ?? 0))
  const proc = input.processor || 'stripe'

  let headline = 'Revenue picture is flat — watch cohorts and expansion.'
  if (g > 8) headline = 'Strong month-over-month momentum — protect gross margin.'
  if (g < -5) headline = 'Contraction signal — audit churn reasons and discounts.'

  const bullets = [
    `Implied ARR from MRR: **${(mrr * 12).toFixed(0)}** (MRR × 12, not recognized revenue).`,
    `Last month recognized (you entered): **${last.toFixed(2)}**.`,
    churn > 5
      ? `Churn at **${churn.toFixed(1)}%** — prioritize onboarding and annual prepay.`
      : `Churn **${churn.toFixed(1)}%** — keep leading indicators on trials → paid.`,
  ]

  const chartCaption = `Suggested chart: dual-axis — bars = net new MRR, line = logo churn %; annotate ${proc} fee % and refunds.`

  const paddleStripeNotes =
    proc === 'paddle'
      ? [
          'Paddle: watch balance currency vs payout currency in reports.',
          'Export “Transaction history” monthly for reconciliation.',
        ]
      : [
          'Stripe: reconcile Balance transactions to bank payouts weekly.',
          'Segment by price ID for product-level MRR in Sigma or export.',
        ]

  return { headline, bullets, chartCaption, paddleStripeNotes }
}
