import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/subscription'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// PATCH /api/growth-suite/deals/[id]/status - Update deal status
export async function PATCH(request: NextRequest, context: any) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const dealId = (await context.params).id
    const body = await request.json()
    const { status } = body

    if (!['pending', 'negotiating', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Verify user has access to this deal
    const accessResult = await sql`
      SELECT 1 FROM deals d
      LEFT JOIN brands b ON b.id = d.brand_id
      WHERE d.id = ${dealId} 
      AND (b.user_id = ${userId} OR d.creator_id = ${userId})
      LIMIT 1
    `

    if (accessResult.length === 0) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Update deal status
    const result = await sql`
      UPDATE deals 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${dealId}
      RETURNING *
    `

    return NextResponse.json({ deal: result[0] })

  } catch (error) {
    console.error('Error updating deal status:', error)
    return NextResponse.json(
      { error: 'Failed to update deal status' },
      { status: 500 }
    )
  }
}
