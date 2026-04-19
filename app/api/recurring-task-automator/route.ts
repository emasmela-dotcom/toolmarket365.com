import { NextRequest, NextResponse } from 'next/server'
import { planRecurringTask } from '@/lib/recurringTaskAutomator'
import type { TaskFrequency } from '@/lib/recurringTaskAutomator'

const freqs: TaskFrequency[] = ['daily', 'weekdays', 'weekly', 'biweekly', 'monthly']

export async function POST(req: NextRequest) {
  const body = await req.json()
  const f = body.frequency as string
  const frequency = freqs.includes(f as TaskFrequency) ? (f as TaskFrequency) : 'weekly'
  const result = planRecurringTask({
    task: typeof body.task === 'string' ? body.task : '',
    frequency,
    preferredTime: typeof body.preferredTime === 'string' ? body.preferredTime : '',
    dayOfWeek: typeof body.dayOfWeek === 'string' ? body.dayOfWeek : '',
  })
  return NextResponse.json(result)
}
