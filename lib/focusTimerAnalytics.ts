export type FocusSessionInput = {
  pomodorosCompleted: number
  totalFocusMinutes: number
  breakMinutes: number
  interruptions: number
}

export type FocusSessionResult = {
  productivityScore: number
  insights: string[]
  nextGoal: string
}

/** Simple score from self-reported Pomodoro-style stats (no tracking SDK). */
export function analyzeFocusSessions(input: FocusSessionInput): FocusSessionResult {
  const p = Math.max(0, Math.min(20, Math.round(input.pomodorosCompleted)))
  const focus = Math.max(0, input.totalFocusMinutes)
  const br = Math.max(0, input.breakMinutes)
  const intr = Math.max(0, Math.round(input.interruptions))

  const breakRatio = focus + br > 0 ? br / (focus + br) : 0
  const focusPerPomo = p > 0 ? focus / p : focus

  let score = 50
  score += Math.min(30, p * 2)
  score += Math.min(15, Math.floor(focus / 30))
  score -= Math.min(25, intr * 3)
  if (breakRatio > 0.35) score -= 8
  if (breakRatio < 0.12 && p > 4) score -= 5
  score = Math.max(0, Math.min(100, Math.round(score)))

  const insights: string[] = []
  if (p >= 6) insights.push('Solid volume of completed pomodoros—momentum is compounding.')
  if (p <= 2 && focus > 0) insights.push('Low pomodoro count; try shorter focus blocks (15m) to build the habit.')
  if (intr >= 4) insights.push('Interruptions are dragging the score—batch notifications for the next session.')
  if (breakRatio > 0.35) insights.push('Breaks are a large share of time; consider stricter “do not disturb” during focus.')
  if (focusPerPomo > 32) insights.push('Long average focus per pomodoro—watch for fatigue; micro-breaks help.')
  if (insights.length === 0) insights.push('Baseline looks steady—tighten one variable next session (time or interruptions).')

  const nextGoal =
    intr > 2
      ? 'Next session: aim for −1 interruption vs today, same pomodoro target.'
      : 'Next session: add +1 pomodoro or +10 focused minutes without raising interruptions.'

  return { productivityScore: score, insights, nextGoal }
}
