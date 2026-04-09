import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/subscription'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/growth-suite/deals/[id]/negotiate - Submit negotiation proposal
export async function POST(request: NextRequest, context: any) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const dealId = params.id
    const body = await request.json()
    const { budget, deadline, requirements, deliverables, proposedBy } = body

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

    // Update deal with proposed terms (simplified - in production you'd want a separate negotiations table)
    const result = await sql`
      UPDATE deals 
      SET 
        budget = ${budget},
        deadline = ${deadline ? new Date(deadline) : null},
        requirements = ${requirements || null},
        deliverables = ${deliverables ? JSON.stringify(deliverables) : null},
        status = 'negotiating',
        updated_at = NOW()
      WHERE id = ${dealId}
      RETURNING *
    `

    return NextResponse.json({ deal: result[0] })

  } catch (error) {
    console.error('Error creating negotiation:', error)
    return NextResponse.json(
      { error: 'Failed to create negotiation' },
      { status: 500 }
    )
  }
}
