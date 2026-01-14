'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = useMemo(() => searchParams.get('token') || '', [searchParams])
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const submit = async () => {
    setErr(null)
    setMsg(null)
    if (!token) return setErr('Missing token.')
    if (pw.length < 8) return setErr('Password must be at least 8 characters.')
    if (pw !== pw2) return setErr('Passwords do not match.')

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: pw }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || 'Failed')
      setPw('')
      setPw2('')
      setMsg('Password updated. You can now sign in.')
    } catch (e) {
      setErr((e as Error)?.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-6">Reset password</h1>

        <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
          {err && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">{err}</p>
            </div>
          )}
          {msg && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200">{msg}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">New password</label>
              <input
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                type="password"
                className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">
                Confirm new password
              </label>
              <input
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                type="password"
                className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              />
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="w-full px-4 py-2 bg-accent-600 text-white rounded hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Working…' : 'Update password'}
            </button>

            <p className="text-xs text-mono-500">
              Back to <Link href="/account" className="underline">account</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

