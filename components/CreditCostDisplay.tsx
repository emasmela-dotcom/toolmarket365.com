'use client'

import { Info } from 'lucide-react'
import { getToolCreditCost, requiresCredits, getToolUseExplanation } from '@/lib/tool-credit-costs'
import { useState, useEffect } from 'react'

interface CreditCostDisplayProps {
  toolSlug: string
  className?: string
}

export function CreditCostDisplay({ toolSlug, className = '' }: CreditCostDisplayProps) {
  const [userCredits, setUserCredits] = useState<number | null>(null)
  const creditCost = getToolCreditCost(toolSlug)
  const needsCredits = requiresCredits(toolSlug)
  const useExplanation = getToolUseExplanation(toolSlug)

  useEffect(() => {
    // Fetch user's current credit balance
    const fetchCredits = async () => {
      try {
        const res = await fetch('/api/credits/balance')
        if (res.ok) {
          const data = await res.json()
          setUserCredits(data.credits || 0)
        }
      } catch (error) {
        // Silently fail - credits will show as unknown
      }
    }
    fetchCredits()
  }, [])

  if (!needsCredits || !creditCost) {
    return null // Tool doesn't require credits
  }

  return (
    <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Cost Per Use: {creditCost} Credits
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
            <strong>What this means:</strong> {useExplanation}
          </p>
          {userCredits !== null && (
            <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
              <strong>Your credits:</strong> {userCredits} credits available
              {userCredits >= creditCost ? (
                <span className="text-green-600 dark:text-green-400 font-semibold ml-2">
                  ✓ You can use this tool {Math.floor(userCredits / creditCost)} time(s)
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400 font-semibold ml-2">
                  ⚠ You need {creditCost - userCredits} more credits
                </span>
              )}
            </p>
          )}
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
            💡 <strong>Tip:</strong> All plans include 25 welcome credits during your first month only. After that, purchase credits ($10 per 100) to continue accessing premium tools. Purchased credits roll over month to month and never expire.
          </p>
        </div>
      </div>
    </div>
  )
}
