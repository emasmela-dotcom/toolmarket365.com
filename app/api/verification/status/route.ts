import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/subscription'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({
        success: true,
        verified: false,
        status: 'not_requested',
        message: 'Database not configured'
      })
    }

    const verification = await sql`
      SELECT id, verification_status, verification_type, verified_at, created_at
      FROM creator_verifications
      WHERE user_id = ${userId}
      LIMIT 1
    `

    if (verification.length === 0) {
      return NextResponse.json({
        success: true,
        verified: false,
        status: 'not_requested',
        message: 'No verification request found'
      })
    }

    const v = verification[0]

    return NextResponse.json({
      success: true,
      verified: v.verification_status === 'verified',
      status: v.verification_status,
      verificationType: v.verification_type,
      verifiedAt: v.verified_at ? v.verified_at.toISOString() : null,
      createdAt: v.created_at ? v.created_at.toISOString() : null
    })

  } catch (error) {
    console.error('Error fetching verification status:', error)
    return NextResponse.json({ error: 'Failed to fetch verification status' }, { status: 500 })
  }
}
