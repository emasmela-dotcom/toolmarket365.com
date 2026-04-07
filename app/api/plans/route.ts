import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
import { sql } from '@/lib/db'

export async function GET(req: NextRequest) {
  if (!sql) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }

  try {
    const plans = await sql`
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
      ORDER BY price_monthly ASC
    `

    return NextResponse.json({ plans })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
