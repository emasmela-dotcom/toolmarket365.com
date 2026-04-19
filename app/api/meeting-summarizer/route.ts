import { NextRequest, NextResponse } from 'next/server'
import { summarizeMeetingTranscript } from '@/lib/meetingSummarizer'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = summarizeMeetingTranscript({
    transcript: typeof body.transcript === 'string' ? body.transcript : '',
    meetingTitle: typeof body.meetingTitle === 'string' ? body.meetingTitle : '',
  })
  return NextResponse.json(result)
}
