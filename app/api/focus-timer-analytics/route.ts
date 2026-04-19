import { NextRequest, NextResponse } from 'next/server'
import { analyzeFocusSessions } from '@/lib/focusTimerAnalytics'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = analyzeFocusSessions({
    pomodorosCompleted: Number(body.pomodorosCompleted) || 0,
    totalFocusMinutes: Number(body.totalFocusMinutes) || 0,
    breakMinutes: Number(body.breakMinutes) || 0,
    interruptions: Number(body.interruptions) || 0,
  })
  return NextResponse.json(result)
}
