import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { consumeLocalResetToken } from '@/lib/localAuth'
import { hashPassword, isStrongEnoughPassword, sha256Hex } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const token = String(body.token || '').trim()
  const newPassword = String(body.newPassword || body.password || '')

  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  if (!isStrongEnoughPassword(newPassword)) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  try {
    const pwHash = await hashPassword(newPassword)
    const tokenHash = sha256Hex(token)

    if (!sql) {
      const status = await consumeLocalResetToken({
        tokenHash,
        newPasswordHash: pwHash,
      })
      if (status === 'already_used') {
        return NextResponse.json({ error: 'Reset token already used' }, { status: 400 })
      }
      if (status !== 'ok') {
        return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 })
      }
    } else {
      const rows = await sql`
        SELECT id, user_id, expires_at, used_at
        FROM password_resets
        WHERE token_hash = ${tokenHash}
        LIMIT 1
      `
      const pr = rows[0]
      if (!pr) return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 })
      if (pr.used_at) return NextResponse.json({ error: 'Reset token already used' }, { status: 400 })

      const exp = new Date(pr.expires_at)
      if (Number.isNaN(exp.getTime()) || exp.getTime() < Date.now()) {
        return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 })
      }

      await sql`UPDATE users SET password_hash = ${pwHash}, updated_at = NOW() WHERE id = ${pr.user_id}`
      await sql`UPDATE password_resets SET used_at = NOW() WHERE id = ${pr.id}`
      // Optional: revoke all sessions after password reset
      await sql`DELETE FROM sessions WHERE user_id = ${pr.user_id}`
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

