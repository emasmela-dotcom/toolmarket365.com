import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
import { sql } from '@/lib/db'
import { PUBLIC_TIER_PLAN_NAMES } from '@/lib/subscriptionTiers'
import { normalizePlanRow } from '@/lib/single-plan-marketplace'

export async function GET(req: NextRequest) {
  if (!sql) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }

  try {
    const plans = (await sql`
      SELECT 
        id,
        name,
        display_name,
        price_monthly,
        price_yearly,
        trial_days,
        tool_slugs,
        features
      FROM plans
      WHERE name = ANY(${PUBLIC_TIER_PLAN_NAMES}::text[])
      ORDER BY price_monthly ASC
    `) as Array<{
      id: string
      name: string
      display_name: string
      price_monthly: number
      price_yearly: number | null
      trial_days: number
      tool_slugs: string[]
      features: unknown
    }>

    return NextResponse.json({ plans: plans.map((p) => normalizePlanRow(p)) })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
