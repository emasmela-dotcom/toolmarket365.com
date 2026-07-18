'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, AlertCircle, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { PlanConfirmation } from '@/components/PlanConfirmation'
import { MARKETPLACE_PLAN_DB_NAME, MARKETPLACE_PLAN_PRICE_MONTHLY } from '@/lib/single-plan-marketplace'
import { stripePlanIdForDbPlanName } from '@/lib/subscriptionTiers'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    subscribeTitle: 'Subscribe to ToolMarket365',
    subscribePrice: '$0.99/month for full access to every tool.',
    subscribe: 'Subscribe',
    trialExpiredTitle: 'Trial Expired - Subscribe Now',
    keepContentTitle: 'Subscribe to Keep Your Content',
    trialExpiredDesc: 'Your trial has ended. Subscribe now to regain access and keep all your content.',
    trialEndsIn: (days: number) =>
      `Your trial ends in ${days} day${days !== 1 ? 's' : ''}. Subscribe now to lock in your content and continue using ToolMarket365.`,
    subscribeKeepDesc: 'Subscribe now to keep all content created during your trial and continue using ToolMarket365.',
    trialExpiredBanner: 'Trial Expired',
    importantBanner: 'Important: Subscribe to Keep Your Content',
    trialExpiredWarning:
      'Your trial has ended. All content created during your trial will be lost if you do not subscribe. Subscribe now to regain access and keep your content.',
    trialWarning:
      'If you do not subscribe before your trial ends, all content created during the trial will be restored to your pre-trial state. Subscribe now to lock in your work and continue using ToolMarket365.',
    planSuffix: 'Plan',
    daysRemaining: (days: number) => `${days} day${days !== 1 ? 's' : ''} remaining in trial`,
    subscribeContinue: 'Subscribe to continue',
    keepHeading: "By Subscribing, You'll Keep:",
    keepContent: 'All content created during your trial',
    keepTools: 'Unlimited use of all tools in your plan',
    keepCredits: '25 welcome credits during your first month',
    keepLibrary: 'Full access to your content library',
    subscribeNow: 'Subscribe Now - Lock In Your Content',
    secureCheckout: 'Secure checkout • Cancel anytime',
    backDashboard: 'Back to Dashboard',
    perMonth: '/month',
  },
  es: {
    subscribeTitle: 'Suscríbete a ToolMarket365',
    subscribePrice: '$0.99/mes para acceso completo a todas las herramientas.',
    subscribe: 'Suscribirse',
    trialExpiredTitle: 'Prueba expirada — suscríbete ahora',
    keepContentTitle: 'Suscríbete para conservar tu contenido',
    trialExpiredDesc: 'Tu prueba ha terminado. Suscríbete ahora para recuperar el acceso y conservar todo tu contenido.',
    trialEndsIn: (days: number) =>
      `Tu prueba termina en ${days} día${days !== 1 ? 's' : ''}. Suscríbete ahora para asegurar tu contenido y seguir usando ToolMarket365.`,
    subscribeKeepDesc:
      'Suscríbete ahora para conservar todo el contenido creado durante tu prueba y seguir usando ToolMarket365.',
    trialExpiredBanner: 'Prueba expirada',
    importantBanner: 'Importante: suscríbete para conservar tu contenido',
    trialExpiredWarning:
      'Tu prueba ha terminado. Todo el contenido creado durante la prueba se perderá si no te suscribes. Suscríbete ahora para recuperar el acceso y conservar tu contenido.',
    trialWarning:
      'Si no te suscribes antes de que termine la prueba, todo el contenido creado durante la prueba volverá a su estado anterior. Suscríbete ahora para asegurar tu trabajo y seguir usando ToolMarket365.',
    planSuffix: 'Plan',
    daysRemaining: (days: number) => `${days} día${days !== 1 ? 's' : ''} restantes de prueba`,
    subscribeContinue: 'Suscríbete para continuar',
    keepHeading: 'Al suscribirte, conservarás:',
    keepContent: 'Todo el contenido creado durante tu prueba',
    keepTools: 'Uso ilimitado de todas las herramientas de tu plan',
    keepCredits: '25 créditos de bienvenida durante tu primer mes',
    keepLibrary: 'Acceso completo a tu biblioteca de contenido',
    subscribeNow: 'Suscríbete ahora — asegura tu contenido',
    secureCheckout: 'Pago seguro • Cancela cuando quieras',
    backDashboard: 'Volver al panel',
    perMonth: '/mes',
  },
}

interface SubscriptionStatus {
  status: 'trial' | 'expired' | 'active' | 'none'
  planName: string | null
  planDisplayName: string | null
  trialEndsAt: string | null
  subscriptionEndsAt: string | null
  canAccessTool: boolean
  reason: string
}

export default function CheckoutPage() {
  const { language } = useLanguage()
  const c = copy[language]
  const router = useRouter()
  const searchParams = useSearchParams()
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [planName, setPlanName] = useState<string | null>(null)
  const [planPrice, setPlanPrice] = useState<number | null>(null)
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null)

  useEffect(() => {
    checkSubscriptionStatus()
  }, [])

  const checkSubscriptionStatus = async () => {
    try {
      const res = await fetch('/api/subscriptions/status')
      const data = await res.json()
      
      if (res.ok && data.status) {
        setSubscriptionStatus(data.status)
        setPlanName(data.status.planName)
        
        // Calculate days remaining if in trial
        if (data.status.status === 'trial' && data.status.trialEndsAt) {
          const trialEnd = new Date(data.status.trialEndsAt)
          const now = new Date()
          const days = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          setDaysRemaining(days > 0 ? days : 0)
        }
        
        // Get plan price
        if (data.status.planName) {
          setPlanPrice(
            data.status.planName?.toLowerCase() === MARKETPLACE_PLAN_DB_NAME
              ? MARKETPLACE_PLAN_PRICE_MONTHLY
              : MARKETPLACE_PLAN_PRICE_MONTHLY
          )
        }
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = () => {
    if (!planName) return
    setShowConfirmation(true)
  }

  const handleCancelConfirmation = () => {
    setShowConfirmation(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent-600" />
      </div>
    )
  }

  // Show confirmation modal
  if (showConfirmation && planName && planPrice) {
    const stripePlanId = stripePlanIdForDbPlanName(MARKETPLACE_PLAN_DB_NAME)

    return (
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <PlanConfirmation
            onCancel={handleCancelConfirmation}
            useStripe={!!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
            planIdForStripe={stripePlanId ?? undefined}
          />
        </div>
      </div>
    )
  }

  // No active trial or subscription
  if (!subscriptionStatus || (subscriptionStatus.status !== 'trial' && subscriptionStatus.status !== 'expired')) {
    return (
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-mono-900 rounded-lg border-2 border-mono-200 dark:border-mono-700 p-8 text-center">
            <AlertCircle className="h-12 w-12 text-mono-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {c.subscribeTitle}
            </h1>
            <p className="text-mono-600 dark:text-mono-400 mb-6">
              {c.subscribePrice}
            </p>
            <Link
              href="/select-plan"
              className="inline-flex items-center px-6 py-3 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
            >
              {c.subscribe}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isTrialExpired = subscriptionStatus.status === 'expired'
  const isInTrial = subscriptionStatus.status === 'trial'

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Lock className="h-10 w-10 text-accent-600 dark:text-accent-400" />
            <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50">
              {isTrialExpired ? c.trialExpiredTitle : c.keepContentTitle}
            </h1>
          </div>
          <p className="text-lg text-mono-600 dark:text-mono-400 max-w-2xl mx-auto">
            {isTrialExpired 
              ? c.trialExpiredDesc
              : daysRemaining !== null && daysRemaining > 0
                ? c.trialEndsIn(daysRemaining)
                : c.subscribeKeepDesc
            }
          </p>
        </div>

        {/* Warning Banner */}
        <div className={`mb-8 rounded-lg p-6 border-2 ${
          isTrialExpired
            ? 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600'
            : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 dark:border-yellow-600'
        }`}>
          <div className="flex items-start space-x-3">
            <AlertCircle className={`h-6 w-6 flex-shrink-0 mt-0.5 ${
              isTrialExpired
                ? 'text-red-600 dark:text-red-400'
                : 'text-yellow-600 dark:text-yellow-400'
            }`} />
            <div>
              <h3 className={`font-semibold mb-2 ${
                isTrialExpired
                  ? 'text-red-900 dark:text-red-200'
                  : 'text-yellow-900 dark:text-yellow-200'
              }`}>
                {isTrialExpired ? c.trialExpiredBanner : c.importantBanner}
              </h3>
              <p className={`text-sm ${
                isTrialExpired
                  ? 'text-red-800 dark:text-red-300'
                  : 'text-yellow-800 dark:text-yellow-300'
              }`}>
                {isTrialExpired ? c.trialExpiredWarning : c.trialWarning}
              </p>
            </div>
          </div>
        </div>

        {/* Plan Summary */}
        {planName && planPrice && (
          <div className="bg-white dark:bg-mono-900 rounded-lg border-2 border-mono-200 dark:border-mono-700 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-2">
                  {subscriptionStatus.planDisplayName || planName.charAt(0).toUpperCase() + planName.slice(1)} {c.planSuffix}
                </h2>
                <p className="text-mono-600 dark:text-mono-400">
                  {isInTrial && daysRemaining !== null && daysRemaining > 0
                    ? c.daysRemaining(daysRemaining)
                    : c.subscribeContinue
                  }
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-mono-950 dark:text-mono-50">
                  ${planPrice}
                </div>
                <div className="text-mono-600 dark:text-mono-400">
                  {c.perMonth}
                </div>
              </div>
            </div>

            {/* What You're Locking In */}
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h3 className="font-semibold text-green-900 dark:text-green-200 mb-3 flex items-center">
                <Check className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                {c.keepHeading}
              </h3>
              <ul className="space-y-2 text-sm text-green-800 dark:text-green-300">
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{c.keepContent}</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{c.keepTools}</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{c.keepCredits}</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{c.keepLibrary}</span>
                </li>
              </ul>
            </div>

            {/* Subscribe Button */}
            <button
              onClick={handleSubscribe}
              className="w-full py-4 px-6 bg-accent-600 text-white font-bold text-lg rounded-lg hover:bg-accent-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Lock className="h-5 w-5" />
              <span>{c.subscribeNow}</span>
            </button>

            <p className="text-xs text-center text-mono-500 dark:text-mono-500 mt-4">
              {c.secureCheckout}
            </p>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-accent-600 dark:text-accent-400 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {c.backDashboard}
          </Link>
        </div>
      </div>
    </div>
  )
}
