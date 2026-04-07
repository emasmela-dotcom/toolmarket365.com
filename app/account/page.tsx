'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type User = { id: string; email: string } | null

export default function AccountPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [user, setUser] = useState<User>(null)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotMsg, setForgotMsg] = useState<string | null>(null)

  const loadMe = async () => {
    const res = await fetch('/api/me')
    const data = await res.json().catch(() => null)
    setUser(data?.user || null)
  }

  useEffect(() => {
    void loadMe()
  }, [])

  const submit = async () => {
    setLoading(true)
    setError(null)
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || 'Failed')
      setPassword('')
      await loadMe()
    } catch (e) {
      setError((e as Error)?.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    await loadMe()
  }

  const forgot = async () => {
    setLoading(true)
    setError(null)
    setForgotMsg(null)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || 'Failed')
      const msg = data?.resetUrl
        ? `Reset link (dev): ${data.resetUrl}`
        : 'If an account exists for that email, you’ll receive a password reset link.'
      setForgotMsg(msg)
    } catch (e) {
      setError((e as Error)?.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-6">Account</h1>

        <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
          {user ? (
            <>
              <p className="text-mono-700 dark:text-mono-300 text-sm mb-4">
                Signed in as <span className="font-semibold">{user.email}</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded text-mono-700 dark:text-mono-300 text-sm"
                >
                  Sign out
                </button>
                <Link
                  href="/tools/social-scheduler"
                  className="px-4 py-2 bg-accent-600 text-white rounded hover:opacity-90 text-sm"
                >
                  Go to Social Scheduler
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setMode('login')}
                  className={`px-4 py-2 rounded text-sm border ${
                    mode === 'login'
                      ? 'bg-accent-600 text-white border-accent-700'
                      : 'bg-mono-50 dark:bg-mono-900 border-mono-200 dark:border-mono-700 text-mono-700 dark:text-mono-300'
                  }`}
                >
                  Sign in
                </button>
                <button
                  onClick={() => setMode('register')}
                  className={`px-4 py-2 rounded text-sm border ${
                    mode === 'register'
                      ? 'bg-accent-600 text-white border-accent-700'
                      : 'bg-mono-50 dark:bg-mono-900 border-mono-200 dark:border-mono-700 text-mono-700 dark:text-mono-300'
                  }`}
                >
                  Create account
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Full Name</label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      type="text"
                      className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Password</label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                  <p className="mt-1 text-xs text-mono-500">Minimum 8 characters.</p>
                </div>

                <button
                  onClick={submit}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-accent-600 text-white rounded hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Working…' : mode === 'login' ? 'Sign in' : 'Create account'}
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-mono-200 dark:border-mono-700">
                <h2 className="text-lg font-bold text-mono-950 dark:text-mono-50 mb-3">Forgot password</h2>
                <div className="flex gap-2">
                  <input
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    type="email"
                    placeholder="you@example.com"
                    className="flex-1 px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                  <button
                    onClick={forgot}
                    disabled={loading}
                    className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded text-mono-700 dark:text-mono-300 text-sm disabled:opacity-50"
                  >
                    Send link
                  </button>
                </div>
                {forgotMsg && <p className="mt-2 text-xs text-mono-500 whitespace-pre-line">{forgotMsg}</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

