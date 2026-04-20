export type GaSimplifyInput = {
  sessions: number
  users: number
  bounceRatePct: number
  avgSessionSeconds?: number
  conversions?: number
}

export type GaSimplifyResult = {
  headline: string
  kpis: { label: string; value: string; plainEnglish: string }[]
  watchNext: string[]
}

/** Turn raw GA-style numbers into plain-language takeaways (no API calls). */
export function simplifyGoogleAnalytics(input: GaSimplifyInput): GaSimplifyResult {
  const sessions = Math.max(0, input.sessions)
  const users = Math.max(0, input.users)
  const bounce = Math.min(100, Math.max(0, input.bounceRatePct))
  const secs = Math.max(0, input.avgSessionSeconds ?? 0)
  const conv = Math.max(0, input.conversions ?? 0)

  const sessionsPerUser = users > 0 ? sessions / users : sessions

  let headline = 'Traffic looks steady — dig one layer deeper.'
  if (bounce >= 70) headline = 'Bounce is high — tighten first screen value and speed.'
  else if (bounce <= 35 && sessions > 50) headline = 'Healthy engagement depth for this volume.'
  if (sessions < 20) headline = 'Low sample size — treat trends as directional only.'

  const kpis: GaSimplifyResult['kpis'] = [
    {
      label: 'Sessions',
      value: String(sessions),
      plainEnglish:
        sessions < 30
          ? 'Not enough visits yet to split by channel confidently.'
          : `About ${Math.round(sessionsPerUser * 10) / 10} sessions per unique user — loyalty vs reach signal.`,
    },
    {
      label: 'Users',
      value: String(users),
      plainEnglish:
        users === 0
          ? 'Add tracking verification (GA4 debug view) if you expected traffic.'
          : 'Unique visitors — pair with new vs returning in GA4 for cohort context.',
    },
    {
      label: 'Bounce rate',
      value: `${Math.round(bounce)}%`,
      plainEnglish:
        bounce > 65
          ? 'Many single-page exits — check landing-message match and LCP.'
          : bounce < 40
            ? 'People stick — find the top paths and double down in content.'
            : 'Middle of the road — compare by landing page, not sitewide only.',
    },
  ]

  if (secs > 0) {
    kpis.push({
      label: 'Avg session',
      value: `${Math.round(secs)}s`,
      plainEnglish:
        secs < 45
          ? 'Short sessions — add internal links and clearer next steps.'
          : 'Longer reads or flows — ensure conversion CTAs appear after value.',
    })
  }

  if (conv > 0 && sessions > 0) {
    const rate = (conv / sessions) * 100
    kpis.push({
      label: 'Conversions',
      value: String(conv),
      plainEnglish: `Rough ${rate.toFixed(1)}% session conversion — validate event firing in GA4.`,
    })
  }

  const watchNext = [
    'Create one Exploration: landing page × bounce × device category.',
    'Annotate releases in GA4 so traffic spikes map to ship dates.',
    'Exclude internal IPs and staging hostnames from production views.',
  ]

  return { headline, kpis, watchNext }
}
