import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
import { sql } from '@/lib/db'
import { SESSION_COOKIE_NAME, sha256Hex } from '@/lib/auth'
import { getUserSubscriptionStatus } from '@/lib/subscription'

export async function GET(req: NextRequest) {
  // If database not configured, return null user (auth is optional)
  if (!sql) {
    return NextResponse.json({ user: null, subscription: null })
  }

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value || ''
  if (!token) {
    return NextResponse.json({ user: null, subscription: null })
  }

  try {
    const tokenHash = sha256Hex(token)
    const rows = await sql`
      SELECT u.id, u.email
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ${tokenHash}
        AND s.expires_at > NOW()
      LIMIT 1
    `

    if (!rows[0]) return NextResponse.json({ user: null, subscription: null })
    
    // Get subscription status
    const subscription = await getUserSubscriptionStatus(rows[0].id)
    
    // Check if user has brand profile
    const brandResult = await sql`
      SELECT id FROM brands WHERE user_id = ${rows[0].id} LIMIT 1
    `

    // Check if user has creator profile
    const creatorResult = await sql`
      SELECT id FROM creator_profiles WHERE user_id = ${rows[0].id} LIMIT 1
    `

    const hasBrand = brandResult.length > 0
    const hasCreator = creatorResult.length > 0

    let accountType: 'user' | 'brand' | 'creator' | 'both' = 'user'
    if (hasBrand && hasCreator) {
      accountType = 'both'
    } else if (hasBrand) {
      accountType = 'brand'
    } else if (hasCreator) {
      accountType = 'creator'
    }
    
    return NextResponse.json({ 
      user: {
        ...rows[0],
        accountType,
        hasBrand,
        hasCreator
      },
      subscription 
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

