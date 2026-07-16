'use client'

import { useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Lock, ArrowRight, Sparkles, Info } from 'lucide-react';
import { getToolCreditCost, requiresCredits, getToolUseExplanation } from '@/lib/tool-credit-costs'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface ToolAccessGateProps {
  children: ReactNode
  toolSlug: string
  toolName: string
  toolDescription: string
  howToUse: string | ReactNode
}

export function ToolAccessGate({ 
  children, 
  toolSlug, 
  toolName, 
  toolDescription,
  howToUse 
}: ToolAccessGateProps) {
  const { t } = useLanguage()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [reason, setReason] = useState<string>('')
  const [planName, setPlanName] = useState<string | null>(null)
  const [userCredits, setUserCredits] = useState<number | null>(null)
  const pathname = usePathname()

  // Get credit information for this tool
  const needsCredits = requiresCredits(toolSlug)
  const creditCost = getToolCreditCost(toolSlug)
  const useExplanation = getToolUseExplanation(toolSlug)

  useEffect(() => {
    checkAccess()
  }, [toolSlug])

  const checkAccess = async () => {
    try {
      const res = await fetch(`/api/tools/check-access?tool=${toolSlug}`)
      const data = await res.json()
      
      if (res.status === 401) {
        // Not authenticated - redirect handled by middleware
        setHasAccess(false)
        setReason(t('toolGatePleaseSignIn'))
      } else {
        setHasAccess(data.canAccess || false)
        setReason(data.reason || '')
        setPlanName(data.planName || null)
        setUserCredits(data.credits || null)
      }
    } catch (error) {
      setHasAccess(false)
      setReason(t('toolGateErrorChecking'))
    } finally {
      setLoading(false)
    }
  }

  const creditCostLabel = creditCost
    ? t('toolGateCostPerUse').replace('{n}', String(creditCost))
    : ''
  const exampleTimes = creditCost ? String(Math.floor(25 / creditCost)) : '0'

  if (loading) {
    return (
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto mb-4"></div>
          <p className="text-mono-600 dark:text-mono-400">{t('toolGateCheckingAccess')}</p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Tool Info Section */}
          <div className="bg-white dark:bg-mono-900 rounded-lg p-8 mb-6 border border-mono-200 dark:border-mono-700">
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="h-8 w-8 text-accent-600" />
              <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">
                {toolName}
              </h1>
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">
                  {t('toolGateWhatToolDoes')}
                </h2>
                <p className="text-mono-700 dark:text-mono-300">
                  {toolDescription}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">
                  {t('toolGateHowToUse')}
                </h2>
                <div className="text-mono-700 dark:text-mono-300">
                  {typeof howToUse === 'string' ? (
                    <p>{howToUse}</p>
                  ) : (
                    howToUse
                  )}
                </div>
              </div>

                      {/* Credit Cost Explanation */}
              {needsCredits && creditCost && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                        {creditCostLabel}
                      </h3>
                      <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                        <strong>{t('toolGateWhatThisMeans')}</strong> {useExplanation}
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                        <strong>{t('toolGateHowCreditsWork')}</strong> {t('toolGateCreditsWorkBody')}
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
                        💡 <strong>{t('toolGateExampleLabel')}</strong>{' '}
                        {t('toolGateExample').replace('{n}', exampleTimes)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Access Denied / Upgrade Section */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Lock className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-yellow-900 dark:text-yellow-200 mb-2">
                  {planName ? t('toolGateUpgradeRequired') : t('toolGateSubscriptionRequired')}
                </h3>
                <p className="text-yellow-800 dark:text-yellow-300 mb-4">
                  {reason || t('toolGateDefaultReason')}
                </p>
                {planName ? (
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-4">
                    {t('toolGateHigherPlans')}
                  </p>
                ) : (
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-4">
                    {t('toolGateSubscribePrompt')}
                  </p>
                )}
                <Link
                  href="/pricing"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>{planName ? t('toolGateUpgradePlan') : t('toolGateSubscribeButton')}</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // User has access - show the actual tool with credit cost info
  return (
    <div>
      {/* Credit Cost Display - Show at top of tool page */}
      {needsCredits && creditCost && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 mx-4 mt-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                {creditCostLabel}
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                <strong>{t('toolGateWhatThisMeans')}</strong> {useExplanation}
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                <strong>{t('toolGateHowCreditsWork')}</strong> {t('toolGateCreditsWorkBody')}
              </p>
              {userCredits !== null && (
                <div className="mb-2">
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                    <strong>{t('toolGateYourCredits')}</strong>{' '}
                    {t('toolGateCreditsAvailable').replace('{n}', String(userCredits))}
                    {userCredits >= creditCost ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold ml-2">
                        {t('toolGateCanUse').replace('{n}', String(Math.floor(userCredits / creditCost)))}
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-semibold ml-2">
                        {t('toolGateNeedMoreCredits').replace('{n}', String(creditCost - userCredits))}
                      </span>
                    )}
                  </p>
                  {userCredits < creditCost && (
                    <Link
                      href="/account/credits"
                      className="inline-flex items-center text-sm text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 font-medium underline"
                    >
                      {t('toolGateBuyCredits')}
                    </Link>
                  )}
                </div>
              )}
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
                💡 <strong>{t('toolGateExampleLabel')}</strong>{' '}
                {t('toolGateExampleFirstMonthOnly').replace('{n}', exampleTimes)}
              </p>
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  )
}
