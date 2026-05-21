'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import {
  MARKETPLACE_PLAN_DISPLAY_NAME,
  MARKETPLACE_PLAN_INCLUDES,
  MARKETPLACE_PLAN_PRICE_MONTHLY,
} from '@/lib/single-plan-marketplace'

interface PlanConfirmationProps {
  onConfirm: () => void
  onCancel?: () => void
  subscribeNowHref?: string
  useStripe?: boolean
  planIdForStripe?: string
}

export function PlanConfirmation({
  onConfirm,
  onCancel,
  subscribeNowHref,
  useStripe = false,
  planIdForStripe,
}: PlanConfirmationProps) {
  const [confirmed, setConfirmed] = useState(false)
  const [stripeLoading, setStripeLoading] = useState(false)

  const handleSubscribeNow = async () => {
    if (!planIdForStripe) return
    setStripeLoading(true)
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'subscription', planId: planIdForStripe }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url as string
      }
    } finally {
      setStripeLoading(false)
    }
  }

  const handleConfirm = () => {
    if (confirmed) onConfirm()
  }

  const showPaidSubscribe = subscribeNowHref || (useStripe && planIdForStripe)

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-mono-900 rounded-lg border-2 border-mono-200 dark:border-mono-700 p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-2">
          Subscribe to {MARKETPLACE_PLAN_DISPLAY_NAME}
        </h2>
        <p className="text-lg font-semibold text-accent-600 dark:text-accent-400">
          ${MARKETPLACE_PLAN_PRICE_MONTHLY}/month
        </p>
        <p className="text-sm text-mono-600 dark:text-mono-400 mt-2">
          One subscription unlocks the whole marketplace — every tool, no tiers.
        </p>
      </div>

      <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <h3 className="font-semibold text-green-900 dark:text-green-200 mb-3 flex items-center">
          <Check className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
          What you get
        </h3>
        <ul className="space-y-2 text-sm text-green-800 dark:text-green-300">
          {MARKETPLACE_PLAN_INCLUDES.map((line) => (
            <li key={line} className="flex items-start">
              <Check className="h-4 w-4 mr-2 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6 p-4 bg-mono-50 dark:bg-mono-800 rounded-lg border border-mono-200 dark:border-mono-700">
        <label className="flex items-start cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 mr-3 h-5 w-5 text-accent-600 focus:ring-accent-500 border-mono-300 rounded"
          />
          <span className="text-sm text-mono-700 dark:text-mono-300">
            <strong>I understand</strong> this is ${MARKETPLACE_PLAN_PRICE_MONTHLY}/month for full access to
            all ToolMarket365 tools while my subscription is active.
          </span>
        </label>
      </div>

      {showPaidSubscribe && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">Free trial (optional)</h3>
          <p className="text-sm text-amber-800 dark:text-amber-300">
            You can start a free trial instead of paying now. Tool access works the same during an active trial
            or paid subscription.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-sm font-medium text-mono-700 dark:text-mono-300 bg-mono-100 dark:bg-mono-800 rounded-lg hover:bg-mono-200 dark:hover:bg-mono-700 transition-colors order-3 sm:order-1"
          >
            Cancel
          </button>
        )}
        {showPaidSubscribe ? (
          <>
            {useStripe && planIdForStripe ? (
              <button
                type="button"
                onClick={handleSubscribeNow}
                disabled={stripeLoading}
                className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-accent-600 text-white hover:bg-accent-700 transition-colors text-center inline-flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {stripeLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Pay ${MARKETPLACE_PLAN_PRICE_MONTHLY}/month
              </button>
            ) : (
              <a
                href={subscribeNowHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-accent-600 text-white hover:bg-accent-700 transition-colors text-center"
              >
                Pay ${MARKETPLACE_PLAN_PRICE_MONTHLY}/month
              </a>
            )}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!confirmed}
              className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                confirmed
                  ? 'bg-mono-200 dark:bg-mono-700 text-mono-950 dark:text-mono-50 hover:bg-mono-300 dark:hover:bg-mono-600'
                  : 'bg-mono-300 dark:bg-mono-700 text-mono-500 dark:text-mono-400 cursor-not-allowed'
              }`}
            >
              Start free trial
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!confirmed}
            className={`px-6 py-2 text-sm font-semibold rounded-lg transition-colors ${
              confirmed
                ? 'bg-accent-600 text-white hover:bg-accent-700'
                : 'bg-mono-300 dark:bg-mono-700 text-mono-500 dark:text-mono-400 cursor-not-allowed'
            }`}
          >
            Confirm & continue
          </button>
        )}
      </div>
    </div>
  )
}
