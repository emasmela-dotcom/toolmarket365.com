import { NextRequest, NextResponse } from 'next/server'
import { buildAsyncStandup } from '@/lib/teamStandupBot'

export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json(
    buildAsyncStandup({
      channelName: String(body.channelName || ''),
      timezone: String(body.timezone || ''),
      teamSize: Number(body.teamSize) || undefined,
    })
  )
}
