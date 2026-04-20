export type AiEmailReplyInput = {
  incomingEmail: string
  yourGoal?: 'accept' | 'decline' | 'schedule' | 'neutral'
}

export type AiEmailReplyResult = {
  professional: string
  brief: string
  friendly: string
}

export function suggestEmailReplies(input: AiEmailReplyInput): AiEmailReplyResult {
  const snippet = input.incomingEmail.trim().slice(0, 2000)
  const goal = input.yourGoal || 'neutral'

  const tail =
    goal === 'accept'
      ? 'Happy to proceed—let me know the next step.'
      : goal === 'decline'
        ? 'I won’t be able to take this on; wishing you the best with the project.'
        : goal === 'schedule'
          ? 'Could we find 20 minutes this week? I’m flexible Tue–Thu afternoons.'
          : 'Let me know how you’d like to move forward.'

  return {
    professional: `Thanks for the note.\n\nI reviewed your message regarding: "${snippet.slice(0, 120)}…"\n\n${tail}\n\nBest,`,
    brief: `Got it — ${tail} Thanks.`,
    friendly: `Hey — thanks for sending this over! ${tail} Appreciate you thinking of me.`,
  }
}
