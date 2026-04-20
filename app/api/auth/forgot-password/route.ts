import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { createLocalReset, getLocalUserByEmail } from '@/lib/localAuth'
import { RESET_TTL_MINUTES, isValidEmail, normalizeEmail, nowPlusMinutes, randomToken, sha256Hex } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const email = normalizeEmail(String(body.email || ''))
  if (!isValidEmail(email)) {
    // Always respond 200 to avoid account enumeration
    return NextResponse.json({ ok: true })
  }

  try {
    let user: { id: string; email: string } | null = null
    if (!sql) {
      const localUser = await getLocalUserByEmail(email)
      if (localUser) user = { id: localUser.id, email: localUser.email }
    } else {
      const users = await sql`SELECT id, email FROM users WHERE email = ${email} LIMIT 1`
      user = users[0] || null
    }

    if (!user) return NextResponse.json({ ok: true })

    const token = randomToken()
    const tokenHash = sha256Hex(token)
    const expiresAt = nowPlusMinutes(RESET_TTL_MINUTES).toISOString()

    if (!sql) {
      await createLocalReset({
        userId: user.id,
        tokenHash,
        expiresAt,
      })
    } else {
      await sql`
        INSERT INTO password_resets (user_id, token_hash, expires_at)
        VALUES (${user.id}, ${tokenHash}, ${expiresAt})
      `
    }

    // Use canonical site URL in production so reset links in email work on your .com domain
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
      req.headers.get('origin') ||
      'http://localhost:3000'
    const resetUrl = `${baseUrl}/account/reset?token=${encodeURIComponent(token)}`

    return NextResponse.json({
      ok: true,
      ...(process.env.NODE_ENV !== 'production' ? { resetUrl } : {}),
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

