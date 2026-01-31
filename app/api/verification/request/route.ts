import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest, getUserSubscriptionStatus } from '@/lib/subscription'
import { sql } from '@/lib/db'
import { nanoid } from 'nanoid'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const body = await request.json()
    const verificationType = body.verificationType || 'email'

    // Check existing verification
    const existing = await sql`
      SELECT id, verification_status, verification_type
      FROM creator_verifications
      WHERE user_id = ${userId}
      LIMIT 1
    `

    if (existing.length > 0) {
      const existingVerification = existing[0]
      
      if (existingVerification.verification_status === 'verified') {
        return NextResponse.json({
          success: true,
          verified: true,
          status: 'verified',
          message: 'Already verified'
        })
      }
      
      if (existingVerification.verification_status === 'pending') {
        return NextResponse.json({
          success: false,
          verified: false,
          status: 'pending',
          message: 'Verification request already pending'
        })
      }
    }

    // Check if user has premium plan (Professional+)
    const subscription = await getUserSubscriptionStatus(userId)
    const isPremium = subscription.planName && ['professional', 'creator', 'business'].includes(subscription.planName)
    
    const verificationStatus = isPremium ? 'verified' : 'pending'
    const verifiedAt = isPremium ? new Date() : null

    if (existing.length > 0) {
      // Update existing
      await sql`
        UPDATE creator_verifications
        SET 
          verification_status = ${verificationStatus},
          verification_type = ${verificationType},
          verified_at = ${verifiedAt},
          updated_at = NOW()
        WHERE id = ${existing[0].id}
      `
    } else {
      // Create new
      await sql`
        INSERT INTO creator_verifications (
          id, user_id, verification_status, verification_type, verified_at, created_at, updated_at
        ) VALUES (
          ${nanoid()}, ${userId}, ${verificationStatus}, ${verificationType}, ${verifiedAt}, NOW(), NOW()
        )
      `
    }

    return NextResponse.json({
      success: true,
      verified: isPremium,
      status: verificationStatus,
      message: isPremium ? 'Successfully verified (Premium plan)' : 'Verification request submitted'
    })

  } catch (error) {
    console.error('Error requesting verification:', error)
    return NextResponse.json({ error: 'Failed to request verification' }, { status: 500 })
  }
}
