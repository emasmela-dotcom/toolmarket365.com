import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/subscription'
import { sql } from '@/lib/db'
import { nanoid } from 'nanoid'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({ accounts: [] })
    }

    const accounts = await sql`
      SELECT 
        id, account_name, username, profile_picture_url,
        follower_count, following_count, is_business_account,
        is_active, created_at
      FROM instagram_accounts
      WHERE user_id = ${userId}
        AND is_active = true
      ORDER BY created_at DESC
    `

    return NextResponse.json({ accounts })
  } catch (error) {
    console.error('Error fetching Instagram accounts:', error)
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 })
  }
}

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
    const { accountName, username, accessToken, refreshToken, expiresAt, profilePictureUrl } = body

    if (!accountName || !username) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if account already exists
    const existing = await sql`
      SELECT id
      FROM instagram_accounts
      WHERE user_id = ${userId}
        AND username = ${username}
      LIMIT 1
    `

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Account already connected' }, { status: 409 })
    }

    const account = await sql`
      INSERT INTO instagram_accounts (
        id, user_id, account_name, username, access_token, refresh_token,
        expires_at, profile_picture_url, is_active, created_at, updated_at
      ) VALUES (
        ${nanoid()}, ${userId}, ${accountName}, ${username}, ${accessToken || null},
        ${refreshToken || null}, ${expiresAt ? new Date(expiresAt) : null},
        ${profilePictureUrl || null}, true, NOW(), NOW()
      )
      RETURNING id, account_name, username, profile_picture_url, follower_count, is_active
    `

    return NextResponse.json({ account: account[0] })
  } catch (error) {
    console.error('Error adding Instagram account:', error)
    return NextResponse.json({ error: 'Failed to add account' }, { status: 500 })
  }
}
