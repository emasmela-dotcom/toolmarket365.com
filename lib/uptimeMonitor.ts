export type UptimeMonitorInput = {
  urls: string[]
  checkIntervalMinutes?: number
}

export type UptimeMonitorResult = {
  validUrls: string[]
  invalidEntries: string[]
  monitoringChecklist: string[]
  downtimeAlertEmail: { subject: string; body: string }
  slackWebhookPayloadExample: string
}

function normalizeUrl(raw: string): string | null {
  const t = raw.trim()
  if (!t) return null
  try {
    const u = new URL(t.startsWith('http') ? t : `https://${t}`)
    if (!['http:', 'https:'].includes(u.protocol)) return null
    return u.origin + (u.pathname === '/' ? '' : u.pathname)
  } catch {
    return null
  }
}

/** Planning copy for uptime checks (this app does not ping your servers). */
export function planUptimeMonitoring(input: UptimeMonitorInput): UptimeMonitorResult {
  const seen = new Set<string>()
  const validUrls: string[] = []
  const invalidEntries: string[] = []

  for (const line of input.urls) {
    const n = normalizeUrl(line)
    if (!n) {
      if (line.trim()) invalidEntries.push(line.trim())
      continue
    }
    if (seen.has(n)) continue
    seen.add(n)
    validUrls.push(n)
  }

  const interval = Math.min(60, Math.max(5, input.checkIntervalMinutes ?? 5))

  const monitoringChecklist = [
    `Pick an external monitor (e.g. Better Stack, UptimeRobot, Pingdom) — this page only helps you plan.`,
    `Probe every ${interval} minutes from at least two regions if the vendor allows it.`,
    'Assert HTTP 200 and a stable response body or keyword, not only TCP connect.',
    'Add SSL expiry checks on the same hostname.',
    'Wire alerts to email + Slack/PagerDuty; test with a deliberate 503 on staging first.',
    'Log incidents with start/end time and root cause for postmortems.',
  ]

  const hostList = validUrls.length ? validUrls.join(', ') : '(your production URL)'
  const downtimeAlertEmail = {
    subject: `[ALERT] Site check failed — ${hostList}`,
    body: `Time: {{iso_timestamp}}\nEndpoint: {{failed_url}}\nError: {{status_or_error}}\nRunbook: {{link_to_status_page}}\n\nAck: reply STOP only after traffic is healthy.`,
  }

  const slackWebhookPayloadExample = JSON.stringify(
    {
      text: `*:rotating_light: Downtime detected*\n• URL: ${validUrls[0] ?? 'https://example.com'}\n• Status: {{http_status}}\n• Checked from: {{region}}`,
    },
    null,
    2
  )

  return {
    validUrls,
    invalidEntries,
    monitoringChecklist,
    downtimeAlertEmail,
    slackWebhookPayloadExample,
  }
}
