import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import {
  SESSION_COOKIE_NAME,
  SESSION_TTL_DAYS,
  hashPassword,
  isStrongEnoughPassword,
  isValidEmail,
  normalizeEmail,
  nowPlusDays,
  randomToken,
  sha256Hex,
} from '@/lib/auth'

export async function POST(req: NextRequest) {
  // If database not configured, return helpful message (auth is optional)
  if (!sql) {
    return NextResponse.json({ 
      error: 'Registration requires database setup. Please configure DATABASE_URL in .env.local',
      requiresSetup: true
    }, { status: 503 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const email = normalizeEmail(String(body.email || ''))
  const password = String(body.password || '')

  if (!isValidEmail(email)) return NextResponse.json({ error: 'Enter a valid email' }, { status: 400 })
  if (!isStrongEnoughPassword(password)) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  try {
    const pwHash = await hashPassword(password)
    // Extract name from email (part before @) as default name
    const defaultName = email.split('@')[0] || 'User'
    
    const userRows = await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${email}, ${pwHash}, ${defaultName})
      RETURNING id, email
    `

    const user = userRows[0]
    const token = randomToken()
    const tokenHash = sha256Hex(token)
    const expiresAt = nowPlusDays(SESSION_TTL_DAYS).toISOString()

    await sql`
      INSERT INTO sessions (user_id, token_hash, expires_at)
      VALUES (${user.id}, ${tokenHash}, ${expiresAt})
    `

    const res = NextResponse.json({ user })
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: new Date(expiresAt),
    })
    
    // Redirect to plan selection after signup
    // The frontend will handle the redirect based on this response
    return res
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    if (/duplicate key value|unique constraint/i.test(message)) {
      return NextResponse.json({ error: 'An account with that email already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

