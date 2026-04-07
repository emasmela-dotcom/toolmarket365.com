import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { SESSION_COOKIE_NAME, sha256Hex } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true })

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value || ''
  res.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  })

  if (!sql || !token) return res

  try {
    await sql`DELETE FROM sessions WHERE token_hash = ${sha256Hex(token)}`
  } catch {
    // ignore
  }

  return res
}

