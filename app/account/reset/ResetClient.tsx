'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    title: 'Reset password',
    newPassword: 'New password',
    confirmPassword: 'Confirm new password',
    working: 'Working…',
    updatePassword: 'Update password',
    backTo: 'Back to',
    account: 'account',
    missingToken: 'Missing token.',
    passwordMinLength: 'Password must be at least 8 characters.',
    passwordsMismatch: 'Passwords do not match.',
    passwordUpdated: 'Password updated. You can now sign in.',
    failed: 'Failed',
  },
  es: {
    title: 'Restablecer contraseña',
    newPassword: 'Nueva contraseña',
    confirmPassword: 'Confirmar nueva contraseña',
    working: 'Procesando…',
    updatePassword: 'Actualizar contraseña',
    backTo: 'Volver a',
    account: 'cuenta',
    missingToken: 'Falta el token.',
    passwordMinLength: 'La contraseña debe tener al menos 8 caracteres.',
    passwordsMismatch: 'Las contraseñas no coinciden.',
    passwordUpdated: 'Contraseña actualizada. Ya puedes iniciar sesión.',
    failed: 'Error',
  },
}

export default function ResetClient() {
  const searchParams = useSearchParams()
  const { language } = useLanguage()
  const c = copy[language]
  const token = useMemo(() => searchParams.get('token') || '', [searchParams])
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const submit = async () => {
    setErr(null)
    setMsg(null)
    if (!token) return setErr(c.missingToken)
    if (pw.length < 8) return setErr(c.passwordMinLength)
    if (pw !== pw2) return setErr(c.passwordsMismatch)

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: pw }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || c.failed)
      setPw('')
      setPw2('')
      setMsg(c.passwordUpdated)
    } catch (e) {
      setErr((e as Error)?.message || c.failed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mono-100 dark:bg-mono-100 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-mono-950 mb-6">{c.title}</h1>

        <div className="bg-white dark:bg-white rounded-2xl shadow-xl p-6 border border-mono-300 dark:border-mono-300">
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
              <label className="block text-sm font-semibold mb-2 text-mono-900">{c.newPassword}</label>
              <input
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                type="password"
                className="w-full px-4 py-2 border border-mono-400 rounded bg-white text-mono-950 placeholder:text-mono-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-mono-900">
                {c.confirmPassword}
              </label>
              <input
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                type="password"
                className="w-full px-4 py-2 border border-mono-400 rounded bg-white text-mono-950 placeholder:text-mono-600"
              />
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="w-full px-4 py-2 bg-accent-600 text-white rounded hover:opacity-90 disabled:opacity-50"
            >
              {loading ? c.working : c.updatePassword}
            </button>

            <p className="text-xs text-mono-700">
              {c.backTo}{' '}
              <Link href="/login" className="underline text-accent-700 hover:text-accent-800">
                {c.account}
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
