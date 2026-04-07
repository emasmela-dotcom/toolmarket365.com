import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/subscription'
import { nowPlusDays } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }

  if (!sql) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const planName = String(body.planName || '').toLowerCase() // 'starter', 'essential', etc.

  if (!planName) {
    return NextResponse.json(
      { error: 'Plan name is required' },
      { status: 400 }
    )
  }

  try {
    // Check if user already has an active subscription/trial
    const existingSub = await sql`
      SELECT id, status
      FROM user_subscriptions
      WHERE user_id = ${userId}
        AND status IN ('trial', 'active')
      LIMIT 1
    `

    if (existingSub.length > 0) {
      return NextResponse.json(
        { error: 'You already have an active trial or subscription' },
        { status: 400 }
      )
    }

    // Get plan details
    const planRows = await sql`
      SELECT id, name, display_name, trial_days
      FROM plans
      WHERE name = ${planName}
      LIMIT 1
    `

    if (planRows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid plan name' },
        { status: 400 }
      )
    }

    const plan = planRows[0]
    const trialDays = plan.trial_days || 7
    const trialStartedAt = new Date()
    const trialEndsAt = nowPlusDays(trialDays)

    // Create pre-trial snapshot (empty state)
    const snapshotData = {
      content_library: [],
      scheduled_posts: [],
      viral_predictions: [],
      ab_tests: [],
      content_performance: [],
      timestamp: trialStartedAt.toISOString()
    }

    // Create snapshot
    await sql`
      INSERT INTO content_snapshots (user_id, snapshot_type, snapshot_data, is_active)
      VALUES (${userId}, 'pre_trial', ${JSON.stringify(snapshotData)}::jsonb, true)
    `

    // Deactivate any other pre_trial snapshots for this user
    await sql`
      UPDATE content_snapshots
      SET is_active = false
      WHERE user_id = ${userId}
        AND snapshot_type = 'pre_trial'
        AND id != (SELECT id FROM content_snapshots WHERE user_id = ${userId} AND snapshot_type = 'pre_trial' ORDER BY created_at DESC LIMIT 1)
    `

    // Create subscription with trial status
    const subRows = await sql`
      INSERT INTO user_subscriptions (
        user_id,
        plan_id,
        status,
        trial_started_at,
        trial_ends_at,
        can_downgrade
      )
      VALUES (
        ${userId},
        ${plan.id},
        'trial',
        ${trialStartedAt.toISOString()},
        ${trialEndsAt.toISOString()},
        false
      )
      RETURNING id, status, trial_ends_at
    `

    return NextResponse.json({
      success: true,
      subscription: {
        id: subRows[0].id,
        status: subRows[0].status,
        planName: plan.name,
        planDisplayName: plan.display_name,
        trialEndsAt: subRows[0].trial_ends_at
      }
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error starting trial:', err)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
