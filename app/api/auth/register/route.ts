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
  if (!sql) return NextResponse.json({ error: 'DATABASE_URL is not set' }, { status: 503 })

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
    const userRows = await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${email}, ${pwHash})
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
    return res
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    if (/duplicate key value|unique constraint/i.test(message)) {
      return NextResponse.json({ error: 'An account with that email already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

