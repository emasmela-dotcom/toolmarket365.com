'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, Sparkles, Zap, ArrowRight, Loader2 } from 'lucide-react'

interface Plan {
  id: string
  name: string
  display_name: string
  price_monthly: number
  price_yearly: number | null
  trial_days: number
  tool_slugs: string[]
  features: any
}

export default function SelectPlanPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [startingTrial, setStartingTrial] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/plans')
      const data = await res.json()
      if (res.ok) {
        setPlans(data.plans || [])
      } else {
        setError(data.error || 'Failed to load plans')
      }
    } catch (err) {
      setError('Failed to load plans')
    } finally {
      setLoading(false)
    }
  }

  const startTrial = async (planName: string) => {
    setStartingTrial(planName)
    setError(null)

    try {
      const res = await fetch('/api/subscriptions/start-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planName })
      })

      const data = await res.json()

      if (res.ok) {
        // Redirect to dashboard or tools page
        router.push('/dashboard')
        router.refresh()
      } else {
        setError(data.error || 'Failed to start trial')
        setStartingTrial(null)
      }
    } catch (err) {
      setError('Failed to start trial. Please try again.')
      setStartingTrial(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent-600" />
      </div>
    )
  }

  if (error && plans.length === 0) {
    return (
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Link href="/" className="text-accent-600 dark:text-accent-400 hover:underline">
            Go to Homepage
          </Link>
        </div>
      </div>
    )
  }

  const planOrder = ['starter', 'essential', 'professional', 'creator', 'business']
  const sortedPlans = [...plans].sort((a, b) => {
    const indexA = planOrder.indexOf(a.name)
    const indexB = planOrder.indexOf(b.name)
    return indexA - indexB
  })

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-mono-600 dark:text-mono-400 mb-6">
            Start your 7-day free trial. No credit card required.
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-yellow-900 dark:text-yellow-200">
              <strong>Important:</strong> After your trial, subscribe to keep all content created during trial. 
              If you don't subscribe, your account will be restored to its pre-trial state. 
              You can upgrade anytime, but cannot downgrade from your selected plan.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-600 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
            <p className="text-red-900 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sortedPlans.map((plan) => {
            const toolCount = plan.tool_slugs?.length || 0
            const isStarting = startingTrial === plan.name
            const isPopular = plan.name === 'professional'

            return (
              <div
                key={plan.id}
                className={`bg-white dark:bg-mono-900 rounded-lg border-2 p-6 ${
                  isPopular
                    ? 'border-accent-500 shadow-lg scale-105'
                    : 'border-mono-200 dark:border-mono-700'
                }`}
              >
                {isPopular && (
                  <div className="bg-accent-600 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-2">
                  {plan.display_name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-mono-950 dark:text-mono-50">
                    ${plan.price_monthly}
                  </span>
                  <span className="text-mono-600 dark:text-mono-400">/month</span>
                </div>
                <p className="text-mono-600 dark:text-mono-400 mb-4">
                  {toolCount} tools included
                </p>
                <button
                  onClick={() => startTrial(plan.name)}
                  disabled={isStarting || !!startingTrial}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                    isPopular
                      ? 'bg-accent-600 text-white hover:bg-accent-700'
                      : 'bg-mono-200 dark:bg-mono-700 text-mono-950 dark:text-mono-50 hover:bg-mono-300 dark:hover:bg-mono-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isStarting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Starting Trial...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Start Free Trial</span>
                    </>
                  )}
                </button>
                <p className="text-xs text-mono-500 dark:text-mono-500 mt-3 text-center">
                  {plan.trial_days || 7} days free • No credit card
                </p>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <Link
            href="/pricing"
            className="text-accent-600 dark:text-accent-400 hover:underline inline-flex items-center space-x-2"
          >
            <span>View detailed pricing and features</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
