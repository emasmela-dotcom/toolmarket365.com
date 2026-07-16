'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function ForgotPasswordPage() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resetUrl, setResetUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        if (data.resetUrl) {
          setResetUrl(data.resetUrl)
        }
      } else {
        setSuccess(true)
      }
    } catch (error) {
      setSuccess(true)
      console.error('Forgot password error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mono-100 dark:bg-mono-100">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-white rounded-lg p-8 border border-mono-300 dark:border-mono-300 shadow-lg">
            <div className="mb-6">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-mono-700 hover:text-accent-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('forgotBackToSignIn')}
              </Link>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-mono-950 mb-2">
                {t('forgotTitle')}
              </h1>
              <p className="text-mono-700">
                {t('forgotSubtitle')}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {success ? (
              <div className="space-y-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-green-700 dark:text-green-300 font-medium mb-1">
                      {t('forgotSuccessTitle')}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {t('forgotSuccessBody')}
                    </p>
                  </div>
                </div>

                {resetUrl && process.env.NODE_ENV !== 'production' && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-xs text-blue-700 dark:text-blue-300 mb-2 font-medium">
                      {t('forgotDevMode')}
                    </p>
                    <a
                      href={resetUrl}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline break-all"
                    >
                      {resetUrl}
                    </a>
                  </div>
                )}

                <div className="text-center">
                  <Link
                    href="/login"
                    className="text-sm text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 font-medium"
                  >
                    {t('forgotBackToSignIn')}
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                <label htmlFor="email" className="block text-sm font-semibold text-mono-900 mb-2">
                    {t('signupEmail')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 w-5 h-5" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-mono-400 rounded-lg bg-white text-mono-950 placeholder:text-mono-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder={t('signupEmailPlaceholder')}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{t('forgotSending')}</span>
                    </>
                  ) : (
                    <span>{t('forgotSubmit')}</span>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-mono-700">
                {t('forgotRemember')}{' '}
                <Link
                  href="/login"
                  className="text-accent-700 hover:text-accent-800 font-medium"
                >
                  {t('signupSignInLink')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
