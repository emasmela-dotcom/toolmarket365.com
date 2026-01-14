import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { SESSION_COOKIE_NAME, sha256Hex } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (!sql) {
    return NextResponse.json({ error: 'DATABASE_URL is not set' }, { status: 503 })
  }

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value || ''
  if (!token) {
    return NextResponse.json({ user: null })
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

    if (!rows[0]) return NextResponse.json({ user: null })
    return NextResponse.json({ user: rows[0] })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

