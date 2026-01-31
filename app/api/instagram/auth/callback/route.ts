import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/subscription'
import { sql } from '@/lib/db'
import { nanoid } from 'nanoid'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Instagram OAuth Callback Handler
 * 
 * This route handles the OAuth callback from Instagram/Facebook
 * after a user authorizes the app to access their Instagram account.
 * 
 * Flow:
 * 1. User clicks "Connect Instagram" → redirects to Facebook OAuth
 * 2. User authorizes → Facebook redirects back to this callback
 * 3. Exchange code for access token
 * 4. Get user's Instagram account info
 * 5. Save account to database
 * 6. Redirect back to Instagram Scheduler
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.redirect(new URL('/login?redirect=/tools/instagram-scheduler', request.url))
    }

    if (!sql) {
      return NextResponse.redirect(new URL('/tools/instagram-scheduler?error=database', request.url))
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorReason = searchParams.get('error_reason')
    const errorDescription = searchParams.get('error_description')

    // Handle OAuth errors
    if (error) {
      console.error('Instagram OAuth error:', { error, errorReason, errorDescription })
      return NextResponse.redirect(
        new URL(`/tools/instagram-scheduler?error=${encodeURIComponent(errorDescription || error)}`, request.url)
      )
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/tools/instagram-scheduler?error=no_code', request.url)
      )
    }

    // Exchange code for access token
    const appId = process.env.INSTAGRAM_APP_ID
    const appSecret = process.env.INSTAGRAM_APP_SECRET
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || `${request.nextUrl.origin}/api/instagram/auth/callback`

    if (!appId || !appSecret) {
      console.error('Instagram API credentials not configured')
      return NextResponse.redirect(
        new URL('/tools/instagram-scheduler?error=api_not_configured', request.url)
      )
    }

    // Step 1: Exchange code for short-lived access token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code: code,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}))
      console.error('Failed to exchange code for token:', errorData)
      return NextResponse.redirect(
        new URL('/tools/instagram-scheduler?error=token_exchange_failed', request.url)
      )
    }

    const tokenData = await tokenResponse.json()
    const { access_token, user_id } = tokenData

    if (!access_token || !user_id) {
      return NextResponse.redirect(
        new URL('/tools/instagram-scheduler?error=invalid_token_response', request.url)
      )
    }

    // Step 2: Exchange short-lived token for long-lived token (60 days)
    const longLivedTokenResponse = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${access_token}`,
      {
        method: 'GET',
      }
    )

    let finalAccessToken = access_token
    let expiresAt: Date | null = null

    if (longLivedTokenResponse.ok) {
      const longLivedData = await longLivedTokenResponse.json()
      finalAccessToken = longLivedData.access_token
      // Instagram long-lived tokens expire in 60 days
      if (longLivedData.expires_in) {
        expiresAt = new Date(Date.now() + longLivedData.expires_in * 1000)
      }
    }

    // Step 3: Get user's Instagram account info
    const userInfoResponse = await fetch(
      `https://graph.instagram.com/${user_id}?fields=id,username,account_type&access_token=${finalAccessToken}`
    )

    if (!userInfoResponse.ok) {
      console.error('Failed to get Instagram user info')
      return NextResponse.redirect(
        new URL('/tools/instagram-scheduler?error=user_info_failed', request.url)
      )
    }

    const userInfo = await userInfoResponse.json()
    const { username, account_type } = userInfo

    // Step 4: Check if account already exists
    const existing = await sql`
      SELECT id
      FROM instagram_accounts
      WHERE user_id = ${userId}
        AND username = ${username}
      LIMIT 1
    `

    if (existing.length > 0) {
      // Update existing account
      await sql`
        UPDATE instagram_accounts
        SET 
          access_token = ${finalAccessToken},
          expires_at = ${expiresAt},
          is_active = true,
          updated_at = NOW()
        WHERE id = ${existing[0].id}
      `
    } else {
      // Create new account
      await sql`
        INSERT INTO instagram_accounts (
          id, user_id, account_name, username, access_token,
          expires_at, is_business_account, is_active, created_at, updated_at
        ) VALUES (
          ${nanoid()}, ${userId}, ${username}, ${username}, ${finalAccessToken},
          ${expiresAt}, ${account_type === 'BUSINESS'}, true, NOW(), NOW()
        )
      `
    }

    // Success! Redirect back to Instagram Scheduler
    return NextResponse.redirect(
      new URL('/tools/instagram-scheduler?success=account_connected', request.url)
    )

  } catch (error) {
    console.error('Error in Instagram OAuth callback:', error)
    return NextResponse.redirect(
      new URL('/tools/instagram-scheduler?error=callback_failed', request.url)
    )
  }
}
