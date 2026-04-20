export type TeamStandupInput = {
  channelName: string
  timezone: string
  teamSize?: number
}

export type TeamStandupResult = {
  slackMessage: string
  emailTemplate: string
  questions: string[]
}

export function buildAsyncStandup(input: TeamStandupInput): TeamStandupResult {
  const ch = input.channelName.trim() || '#team-standup'
  const tz = input.timezone.trim() || 'UTC'

  const questions = [
    'What did you ship since last standup?',
    'What will you finish before the next standup?',
    'What’s blocked — who can unblock it?',
  ]

  const slackMessage = `*Async standup — ${tz}*\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\nReply in thread with :white_check_mark: when done. Channel: ${ch}`

  const emailTemplate = `Subject: [Standup] ${new Date().toDateString()} (${tz})\n\nPlease reply-all with:\n${questions.map((q, i) => `${i + 1}) ${q}`).join('\n')}\n\nDeadline: end of local workday.`

  return { slackMessage, emailTemplate, questions }
}
