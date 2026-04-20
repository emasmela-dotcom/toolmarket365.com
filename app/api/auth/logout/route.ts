import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { deleteLocalSessionByTokenHash } from '@/lib/localAuth'
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

  if (!token) return res

  try {
    const tokenHash = sha256Hex(token)
    if (!sql) {
      await deleteLocalSessionByTokenHash(tokenHash)
    } else {
      await sql`DELETE FROM sessions WHERE token_hash = ${tokenHash}`
    }
  } catch {
    // ignore
  }

  return res
}

