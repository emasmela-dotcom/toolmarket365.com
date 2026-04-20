import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { createLocalSession, getLocalUserByEmail } from '@/lib/localAuth'

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
    let user: { id: string; email: string; password_hash: string } | null = null
    if (!sql) {
      const localUser = await getLocalUserByEmail(email)
      if (localUser) {
        user = {
          id: localUser.id,
          email: localUser.email,
          password_hash: localUser.passwordHash,
        }
      }
    } else {
      const rows = await sql`
        SELECT id, email, password_hash
        FROM users
        WHERE email = ${email}
        LIMIT 1
      `
      user = rows[0] || null
    }

    if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

    const ok = await verifyPassword(password, user.password_hash)
    if (!ok) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

    const token = randomToken()
    const tokenHash = sha256Hex(token)
    const expiresAt = nowPlusDays(SESSION_TTL_DAYS).toISOString()

    if (!sql) {
      await createLocalSession({ userId: user.id, tokenHash, expiresAt })
    } else {
      await sql`
        INSERT INTO sessions (user_id, token_hash, expires_at)
        VALUES (${user.id}, ${tokenHash}, ${expiresAt})
      `
    }

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

