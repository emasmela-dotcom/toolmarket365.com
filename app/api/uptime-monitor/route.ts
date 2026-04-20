import { NextRequest, NextResponse } from 'next/server'
import { planUptimeMonitoring } from '@/lib/uptimeMonitor'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const urls = Array.isArray(body.urls) ? body.urls.filter((x: unknown) => typeof x === 'string') : []
  const checkIntervalMinutes = Number(body.checkIntervalMinutes) || undefined
  const result = planUptimeMonitoring({ urls, checkIntervalMinutes })
  return NextResponse.json(result)
}
