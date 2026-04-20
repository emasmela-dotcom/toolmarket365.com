export type MarketingSocialSchedulerInput = {
  platforms: string[]
  postsPerWeek: number
  bestTimesHint?: string
}

export type MarketingSocialSchedulerResult = {
  weeklyPlanMarkdown: string
  checklist: string[]
}

export function planCrossPlatformSchedule(input: MarketingSocialSchedulerInput): MarketingSocialSchedulerResult {
  const plats = input.platforms.length ? input.platforms : ['LinkedIn', 'X', 'Instagram']
  const n = Math.min(21, Math.max(1, Math.round(input.postsPerWeek)))
  const hint = input.bestTimesHint?.trim() || 'Mornings local time; avoid Friday PM'

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const slots: string[] = []
  let d = 0
  for (let i = 0; i < n; i++) {
    const day = days[d % 7]
    const p = plats[i % plats.length]
    slots.push(`- **${day}** — ${p}: 1 post (${hint})`)
    d += i % 2 === 0 ? 1 : 2
  }

  const weeklyPlanMarkdown = `## ${n} slots / week\n${slots.join('\n')}\n\n_Rotate hooks vs educational vs proof. Batch film on one block day._`

  const checklist = [
    'Export a single CSV calendar and import into Buffer / Metricool / native schedulers.',
    'Keep one canonical link-in-bio URL per campaign.',
    'UTM every outbound link; reuse naming: utm_source=network&utm_medium=organic&utm_campaign=q2_push',
  ]

  return { weeklyPlanMarkdown: weeklyPlanMarkdown.trim(), checklist }
}
