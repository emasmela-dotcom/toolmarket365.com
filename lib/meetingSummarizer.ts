export type MeetingSummarizerInput = {
  transcript: string
  meetingTitle?: string
}

export type MeetingSummarizerResult = {
  title: string
  summaryBullets: string[]
  decisions: string[]
  actionItems: string[]
  openQuestions: string[]
}

function clean(s: string) {
  return s.replace(/\s+/g, ' ').trim()
}

/** Heuristic summary from pasted Zoom/Meet-style transcript (no external APIs). */
export function summarizeMeetingTranscript(
  input: MeetingSummarizerInput
): MeetingSummarizerResult {
  const raw = input.transcript.trim()
  const firstLine = raw.split(/\r?\n/).find((l) => l.trim().length > 0)
  const title =
    (input.meetingTitle || '').trim() ||
    (firstLine ? clean(firstLine).slice(0, 72) : '') ||
    'Meeting summary'

  const lines = raw
    .split(/\r?\n/)
    .map((l) => clean(l))
    .filter((l) => l.length > 0)

  const actionItems: string[] = []
  const decisions: string[] = []
  const openQuestions: string[] = []
  const summaryPool: string[] = []

  const actionRe =
    /\b(action|todo|follow[- ]?up|assign|owner|deadline|by (mon|tue|wed|thu|fri|next|eod|tomorrow|\d{1,2}\/\d)|need(s)? to|will do|i('ll| will))\b/i
  const decisionRe =
    /\b(decided|decision|agreed|we('ll| will) (use|ship|go with)|approved|signed off)\b/i

  for (const line of lines) {
    if (line.includes('?')) openQuestions.push(line)
    else if (decisionRe.test(line)) decisions.push(line)
    else if (actionRe.test(line)) actionItems.push(line)
    else if (line.length > 40) summaryPool.push(line)
  }

  const summaryBullets = summaryPool.slice(0, 6).map((s) => (s.length > 220 ? `${s.slice(0, 217)}…` : s))

  if (summaryBullets.length === 0 && lines.length) {
    summaryBullets.push(
      ...lines.slice(0, Math.min(5, lines.length)).map((s) => (s.length > 220 ? `${s.slice(0, 217)}…` : s))
    )
  }

  return {
    title: clean(title),
    summaryBullets,
    decisions: decisions.slice(0, 12),
    actionItems: actionItems.slice(0, 20),
    openQuestions: openQuestions.slice(0, 12),
  }
}
