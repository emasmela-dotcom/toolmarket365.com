'use client'

import { useState } from 'react'
import { Check, X, AlertCircle } from 'lucide-react'

interface PlanConfirmationProps {
  planName: string
  includedTools: string[]
  excludedTools?: string[]
  onConfirm: () => void
  onCancel?: () => void
}

export function PlanConfirmation({
  planName,
  includedTools,
  excludedTools = [],
  onConfirm,
  onCancel,
}: PlanConfirmationProps) {
  const [confirmed, setConfirmed] = useState(false)

  const handleConfirm = () => {
    if (confirmed) {
      onConfirm()
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-mono-900 rounded-lg border-2 border-mono-200 dark:border-mono-700 p-6 shadow-lg">
      <div className="flex items-start space-x-3 mb-6">
        <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-2">
            Confirm Your Plan Details
          </h2>
          <p className="text-sm text-mono-600 dark:text-mono-400">
            Please review what's included and what's not before subscribing
          </p>
        </div>
      </div>

      {/* Included Section */}
      <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <h3 className="font-semibold text-green-900 dark:text-green-200 mb-3 flex items-center">
          <Check className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
          You're Getting with the {planName} Plan:
        </h3>
        <ul className="space-y-2 text-sm text-green-800 dark:text-green-300">
          {includedTools.map((tool, idx) => (
            <li key={idx} className="flex items-start">
              <Check className="h-4 w-4 mr-2 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span>{tool}</span>
            </li>
          ))}
          <li className="flex items-start pt-2 border-t border-green-200 dark:border-green-800 mt-2">
            <Check className="h-4 w-4 mr-2 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Unlimited use</strong> of all tools listed in this plan
            </span>
          </li>
          <li className="flex items-start">
            <Check className="h-4 w-4 mr-2 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>25 welcome credits</strong> during your first month to test premium tools
            </span>
          </li>
        </ul>
      </div>

      {/* Not Included Section */}
      <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-3 flex items-center">
          <X className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-400" />
          Not Included in This Plan:
        </h3>
        <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
          <li className="flex items-start">
            <X className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <span>
              Tools marked with a <strong>credit badge</strong>
            </span>
          </li>
          <li className="flex items-start">
            <X className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <span>
              Any tools shown as part of <strong>higher-tier plans</strong>
            </span>
          </li>
          <li className="flex items-start pt-2 border-t border-amber-200 dark:border-amber-800 mt-2">
            <span className="text-xs text-amber-700 dark:text-amber-400 italic">
              You can still use these tools at any time by <strong>buying credits</strong> or upgrading your plan. They were <strong>never part of this plan</strong>.
            </span>
          </li>
        </ul>
      </div>

      {/* Confirmation Checkbox */}
      <div className="mb-6 p-4 bg-mono-50 dark:bg-mono-800 rounded-lg border border-mono-200 dark:border-mono-700">
        <label className="flex items-start cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 mr-3 h-5 w-5 text-accent-600 focus:ring-accent-500 border-mono-300 rounded"
          />
          <span className="text-sm text-mono-700 dark:text-mono-300">
            <strong>I understand</strong> which tools are included in the {planName} plan and that other tools require credits or a higher plan. I will not claim these tools were part of my subscription.
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-2 text-sm font-medium text-mono-700 dark:text-mono-300 bg-mono-100 dark:bg-mono-800 rounded-lg hover:bg-mono-200 dark:hover:bg-mono-700 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleConfirm}
          disabled={!confirmed}
          className={`px-6 py-2 text-sm font-semibold rounded-lg transition-colors ${
            confirmed
              ? 'bg-accent-600 text-white hover:bg-accent-700'
              : 'bg-mono-300 dark:bg-mono-700 text-mono-500 dark:text-mono-400 cursor-not-allowed'
          }`}
        >
          Confirm & Continue
        </button>
      </div>
    </div>
  )
}
