'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function SignupPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t('signupPasswordsNoMatch'))
      return
    }

    if (password.length < 8) {
      setError(t('signupPasswordTooShort'))
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/select-plan')
        router.refresh()
      } else {
        setError(data.error || t('signupFailed'))
      }
    } catch (error) {
      setError(t('signupErrorGeneric'))
      console.error('Signup error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mono-100 dark:bg-mono-100">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-white rounded-lg p-8 border border-mono-300 dark:border-mono-300 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-mono-950 mb-2">
                {t('signupTitle')}
              </h1>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

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

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-mono-900 mb-2">
                  {t('signupPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2 border border-mono-400 rounded-lg bg-white text-mono-950 placeholder:text-mono-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder={t('signupPasswordPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mono-500 hover:text-mono-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 text-xs">
                      {password.length >= 8 ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      )}
                      <span className={`${
                        password.length >= 8 ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {password.length >= 8
                          ? t('signupStrongPassword')
                          : t('signupCharsNeeded').replace('{n}', String(8 - password.length))}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-mono-900 mb-2">
                  {t('signupConfirmPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2 border border-mono-400 rounded-lg bg-white text-mono-950 placeholder:text-mono-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder={t('signupConfirmPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mono-500 hover:text-mono-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-2 text-xs text-red-600">{t('signupPasswordsNoMatch')}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || password !== confirmPassword || password.length < 8}
                className="w-full px-6 py-3 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{t('signupCreating')}</span>
                  </>
                ) : (
                  <span>{t('signupSubmit')}</span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-mono-700">
                {t('signupAlreadyHave')}{' '}
                <Link
                  href="/login"
                  className="text-accent-700 hover:text-accent-800 font-medium"
                >
                  {t('signupSignInLink')}
                </Link>
              </p>
              <p className="text-sm text-mono-700">
                <Link
                  href="/forgot-password"
                  className="text-accent-700 hover:text-accent-800 font-medium"
                >
                  {t('signupForgotLink')}
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-mono-200">
              <p className="text-xs text-center text-mono-600">
                {t('signupAgreeTerms')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
