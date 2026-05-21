'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import { PlanConfirmation } from '@/components/PlanConfirmation'
import { stripePlanIdForDbPlanName } from '@/lib/subscriptionTiers'
import {
  MARKETPLACE_PLAN_DB_NAME,
  MARKETPLACE_PLAN_DISPLAY_NAME,
  MARKETPLACE_PLAN_INCLUDES,
  MARKETPLACE_PLAN_PRICE_MONTHLY,
  MARKETPLACE_PLAN_TAGLINE,
} from '@/lib/single-plan-marketplace'

interface Plan {
  id: string
  name: string
  display_name: string
  price_monthly: number
  price_yearly: number | null
  trial_days: number
  tool_slugs: string[]
  features: unknown
}

export default function SelectPlanPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [startingTrial, setStartingTrial] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const hasAutoOpenedFromQuery = useRef(false)

  useEffect(() => {
    fetchPlans()
  }, [])

  const planParam = searchParams.get('plan')
  useEffect(() => {
    if (!planParam || plans.length === 0 || hasAutoOpenedFromQuery.current) return
    const match = plans.find((p) => p.name.toLowerCase() === planParam.toLowerCase())
    if (match) {
      hasAutoOpenedFromQuery.current = true
      setSelectedPlan(match)
      setShowConfirmation(true)
    }
  }, [planParam, plans])

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/plans')
      const data = await res.json()
      if (res.ok) {
        setPlans(data.plans || [])
      } else {
        setError(data.error || 'Failed to load plans')
      }
    } catch {
      setError('Failed to load plans')
    } finally {
      setLoading(false)
    }
  }

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan)
    setShowConfirmation(true)
  }

  const handleConfirmTrial = async () => {
    if (!selectedPlan) return

    setShowConfirmation(false)
    setStartingTrial(selectedPlan.name)
    setError(null)

    try {
      const res = await fetch('/api/subscriptions/start-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planName: selectedPlan.name }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError(data.error || 'Failed to start trial')
        setStartingTrial(null)
      }
    } catch {
      setError('Failed to start trial. Please try again.')
      setStartingTrial(null)
    }
  }

  const handleCancelConfirmation = () => {
    setShowConfirmation(false)
    setSelectedPlan(null)
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

  const marketplacePlan =
    plans.find((p) => p.name === MARKETPLACE_PLAN_DB_NAME) ?? plans[0] ?? null

  if (showConfirmation && marketplacePlan) {
    const useStripe = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    const stripePlanId = stripePlanIdForDbPlanName(MARKETPLACE_PLAN_DB_NAME)

    return (
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <PlanConfirmation
            onConfirm={handleConfirmTrial}
            onCancel={handleCancelConfirmation}
            useStripe={useStripe}
            planIdForStripe={stripePlanId ?? undefined}
          />
        </div>
      </div>
    )
  }

  const isStarting = startingTrial === MARKETPLACE_PLAN_DB_NAME

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-4">Subscribe</h1>
          <p className="text-xl text-mono-600 dark:text-mono-400">{MARKETPLACE_PLAN_TAGLINE}</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-600 rounded-lg p-4 mb-6">
            <p className="text-red-900 dark:text-red-200">{error}</p>
          </div>
        )}

        {marketplacePlan ? (
          <div className="bg-white dark:bg-mono-900 rounded-lg border-2 border-accent-500 p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-2">
              {MARKETPLACE_PLAN_DISPLAY_NAME}
            </h2>
            <div className="mb-4">
              <span className="text-4xl font-bold text-mono-950 dark:text-mono-50">
                ${MARKETPLACE_PLAN_PRICE_MONTHLY}
              </span>
              <span className="text-mono-600 dark:text-mono-400">/month</span>
            </div>
            <ul className="space-y-2 mb-6 text-sm text-mono-700 dark:text-mono-300">
              {MARKETPLACE_PLAN_INCLUDES.map((line) => (
                <li key={line} className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => handlePlanSelect(marketplacePlan)}
              disabled={isStarting || !!startingTrial}
              className="w-full py-3 px-6 rounded-lg font-semibold bg-accent-600 text-white hover:bg-accent-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isStarting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Starting trial...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Continue</span>
                </>
              )}
            </button>
            <p className="text-xs text-mono-500 dark:text-mono-500 mt-3 text-center">
              {marketplacePlan.trial_days || 7} day free trial available • Cancel anytime
            </p>
          </div>
        ) : (
          <p className="text-center text-mono-600 dark:text-mono-400">Plan not available. Try again later.</p>
        )}

        <div className="text-center mt-8">
          <Link
            href="/pricing"
            className="text-accent-600 dark:text-accent-400 hover:underline inline-flex items-center space-x-2"
          >
            <span>Back to pricing</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
