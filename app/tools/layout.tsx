import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { sql } from '@/lib/db'
import { SESSION_COOKIE_NAME, sha256Hex } from '@/lib/auth'

type Props = {
  children: ReactNode
}

export default async function ToolsLayout({ children }: Props) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value || ''

  if (!token || !sql) {
    redirect('/pricing')
  }

  const tokenHash = sha256Hex(token)

  const rows = await sql`
    SELECT us.status, us.trial_ends_at, us.subscription_ends_at
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    JOIN user_subscriptions us ON us.user_id = u.id
    WHERE s.token_hash = ${tokenHash}
      AND s.expires_at > NOW()
      AND us.status IN ('trial', 'active')
    ORDER BY us.created_at DESC
    LIMIT 1
  `

  if (rows.length === 0) {
    redirect('/pricing')
  }

  const sub = rows[0]
  const now = new Date()

  if (sub.status === 'trial' && sub.trial_ends_at && new Date(sub.trial_ends_at) < now) {
    redirect('/pricing')
  }

  if (
    sub.status === 'active' &&
    sub.subscription_ends_at &&
    new Date(sub.subscription_ends_at) < now
  ) {
    redirect('/pricing')
  }

  return <>{children}</>
}
