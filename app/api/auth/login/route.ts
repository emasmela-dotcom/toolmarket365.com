import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'
import {
  SESSION_COOKIE_NAME,
  SESSION_TTL_DAYS,
  isValidEmail,
  normalizeEmail,
  nowPlusDays,
  randomToken,
  sha256Hex,
  verifyPassword,
} from '@/lib/auth'

export async function POST(req: NextRequest) {
  // If database not configured, return helpful message (auth is optional)
  if (!sql) {
    return NextResponse.json({ 
      error: 'Authentication requires database setup. Please configure DATABASE_URL in .env.local',
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
  if (!password) return NextResponse.json({ error: 'Password is required' }, { status: 400 })

  try {
    const rows = await sql`
      SELECT id, email, password_hash
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `
    const user = rows[0]
    if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

    const ok = await verifyPassword(password, user.password_hash)
    if (!ok) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

    const token = randomToken()
    const tokenHash = sha256Hex(token)
    const expiresAt = nowPlusDays(SESSION_TTL_DAYS).toISOString()

    await sql`
      INSERT INTO sessions (user_id, token_hash, expires_at)
      VALUES (${user.id}, ${tokenHash}, ${expiresAt})
    `

    const res = NextResponse.json({ user: { id: user.id, email: user.email } })
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: new Date(expiresAt),
    })
    return res
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

