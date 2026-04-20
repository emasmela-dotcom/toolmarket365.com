import { NextRequest, NextResponse } from 'next/server'
import { simplifyGoogleAnalytics } from '@/lib/googleAnalyticsSimplifier'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = simplifyGoogleAnalytics({
    sessions: Number(body.sessions) || 0,
    users: Number(body.users) || 0,
    bounceRatePct: Number(body.bounceRatePct) || 0,
    avgSessionSeconds: Number(body.avgSessionSeconds) || undefined,
    conversions: Number(body.conversions) || undefined,
  })
  return NextResponse.json(result)
}
