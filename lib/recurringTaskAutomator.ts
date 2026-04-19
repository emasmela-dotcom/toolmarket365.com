export type TaskFrequency = 'daily' | 'weekdays' | 'weekly' | 'biweekly' | 'monthly'

export type RecurringTaskInput = {
  task: string
  frequency: TaskFrequency
  preferredTime?: string
  dayOfWeek?: string
}

export type RecurringTaskResult = {
  headline: string
  scheduleLines: string[]
  reminderSnippets: string[]
  calendarHints: string[]
}

export function planRecurringTask(input: RecurringTaskInput): RecurringTaskResult {
  const task = input.task.trim() || 'Your task'
  const time = (input.preferredTime || '09:00').trim()
  const dow = (input.dayOfWeek || 'Monday').trim()

  const scheduleLines: string[] = []
  const reminderSnippets: string[] = []
  const calendarHints: string[] = []

  switch (input.frequency) {
    case 'daily':
      scheduleLines.push(`Every day at ${time} — block 25–50 minutes for: ${task}`)
      reminderSnippets.push(`Daily ${time}: ${task}`)
      calendarHints.push('Create a repeating “all-day” note or a single recurring event with alert 10m before.')
      break
    case 'weekdays':
      scheduleLines.push(`Mon–Fri at ${time} — ${task}`)
      reminderSnippets.push(`Weekdays ${time}: ${task}`)
      calendarHints.push('Google Calendar: repeat “Every weekday”. Outlook: Recurrence → Weekly → Mon–Fri.')
      break
    case 'weekly':
      scheduleLines.push(`Every ${dow} at ${time} — ${task}`)
      reminderSnippets.push(`${dow} ${time}: ${task}`)
      calendarHints.push('Set end date after 8–12 weeks, then review cadence.')
      break
    case 'biweekly':
      scheduleLines.push(`Every other ${dow} at ${time} — ${task}`)
      reminderSnippets.push(`Biweekly ${dow} ${time}: ${task}`)
      calendarHints.push('Use “custom” recurrence every 2 weeks in most calendar apps.')
      break
    case 'monthly':
      scheduleLines.push(`Monthly (same date or first ${dow}) at ${time} — ${task}`)
      reminderSnippets.push(`Monthly: ${task}`)
      calendarHints.push('Pick “monthly on day X” or “first Monday” to avoid drift.')
      break
    default:
      scheduleLines.push(`${task} — set a fixed slot you can defend on the calendar.`)
  }

  reminderSnippets.push(`End-of-week check: did ${task} happen ≥80% of planned slots?`)

  return {
    headline: `Recurring plan: ${task}`,
    scheduleLines,
    reminderSnippets,
    calendarHints,
  }
}
