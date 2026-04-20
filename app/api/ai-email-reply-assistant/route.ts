import { NextRequest, NextResponse } from 'next/server'
import { suggestEmailReplies } from '@/lib/aiEmailReplyAssistant'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const g =
    (['accept', 'decline', 'schedule', 'neutral'] as const).find((x) => x === body.yourGoal) ??
    'neutral'
  return NextResponse.json(
    suggestEmailReplies({
      incomingEmail: String(body.incomingEmail || ''),
      yourGoal: g,
    })
  )
}
