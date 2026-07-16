'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Info, Coins, Zap, ArrowRight, MessageSquare, Loader2 } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import {
  TOOL_CREDIT_COSTS,
  TOOL_CREDIT_DISPLAY_NAMES,
  getToolUseExplanation,
} from '@/lib/tool-credit-costs'
import { GUMROAD_LINKS } from '@/lib/gumroad-config'

const useStripe = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

const toolsByCost = Object.entries(TOOL_CREDIT_COSTS).reduce((acc, [slug, cost]) => {
  if (!acc[cost]) {
    acc[cost] = []
  }
  acc[cost].push({
    slug,
    name:
      TOOL_CREDIT_DISPLAY_NAMES[slug] ||
      slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    cost,
    explanation: getToolUseExplanation(slug),
  })
  return acc
}, {} as Record<number, Array<{ slug: string; name: string; cost: number; explanation: string }>>)

function ApiToolsWorkSection({ t }: { t: (key: import('@/lib/i18n/translations').TranslationKey) => string }) {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
      <div className="flex items-start space-x-3">
        <Zap className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h2 className="text-xl font-bold text-green-900 dark:text-green-200 mb-3">
            {t('apiToolsWorkTitle')}
          </h2>
          <p className="text-sm text-green-800 dark:text-green-300 mb-4">{t('apiToolsWorkIntro')}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">{t('apiCompetitorTitle')}</h4>
              <ul className="text-sm text-green-800 dark:text-green-300 space-y-1 ml-4">
                <li>• {t('apiCompetitorWithout')}</li>
                <li>• {t('apiCompetitorWith')}</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">{t('apiInstagramTitle')}</h4>
              <ul className="text-sm text-green-800 dark:text-green-300 space-y-1 ml-4">
                <li>• {t('apiInstagramDefault')}</li>
                <li>• {t('apiInstagramOptional')}</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">{t('apiAiTitle')}</h4>
              <ul className="text-sm text-green-800 dark:text-green-300 space-y-1 ml-4">
                <li>• {t('apiAiWithout')}</li>
                <li className="ml-4">- {t('apiAiBlogOutline')}</li>
                <li className="ml-4">- {t('apiAiCaption')}</li>
                <li className="ml-4">- {t('apiAiLeadFollowUp')}</li>
                <li>• {t('apiAiWith')}</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">{t('apiSocialTitle')}</h4>
              <ul className="text-sm text-green-800 dark:text-green-300 space-y-1 ml-4">
                <li>• {t('apiSocialInProduct')}</li>
                <li>• {t('apiSocialNotIncluded')}</li>
              </ul>
            </div>
          </div>

          <p className="text-sm text-green-800 dark:text-green-300 font-medium">💡 {t('apiBottomLine')}</p>
        </div>
      </div>
    </div>
  )
}

export default function CreditsPage() {
  const { t } = useLanguage()
  const sortedCosts = Object.keys(toolsByCost).map(Number).sort((a, b) => b - a)
  const [creditLoading, setCreditLoading] = useState<string | null>(null)

  const handleBuyCredits = async (bundleId: 'bundle50' | 'bundle100' | 'bundle250') => {
    if (useStripe) {
      setCreditLoading(bundleId)
      try {
        const res = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'credits', bundleId }),
        })
        const data = await res.json()
        if (data?.url) {
          window.location.href = data.url
          return
        }
      } catch (e) {
        console.error('Stripe checkout failed:', e)
      }
      setCreditLoading(null)
    }
    window.location.href = GUMROAD_LINKS.credits[bundleId]
  }

  const getCostTierTitle = (cost: number) => {
    if (cost === 15) return t('creditsHighValueTools')
    if (cost >= 10) return t('creditsMedHighValueTools')
    if (cost >= 8) return t('creditsMedValueTools')
    return t('creditsLowMedValueTools')
  }

  const getCostTierDesc = (cost: number) => {
    if (cost === 15) return t('creditsHighValueDesc')
    if (cost >= 10) return t('creditsMedHighDesc')
    if (cost >= 8) return t('creditsMedDesc')
    return t('creditsLowMedDesc')
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Coins className="h-10 w-10 text-accent-600 dark:text-accent-400" />
            <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50">{t('creditsTitle')}</h1>
          </div>
          <p className="text-lg text-mono-600 dark:text-mono-400 max-w-2xl mx-auto mb-4">
            {t('creditsSubtitleLead')}{' '}
            <strong>{t('creditsSubtitlePlanTools')}</strong> {t('creditsSubtitlePlanToolsDesc')}{' '}
            <strong>{t('creditsSubtitleNotInPlan')}</strong> {t('creditsSubtitleNotInPlanDesc')}
          </p>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-300 dark:border-green-700 rounded-lg p-4 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="font-bold text-green-900 dark:text-green-200">{t('creditsWelcomeTitle')}</p>
            </div>
            <p className="text-sm text-green-800 dark:text-green-300">{t('creditsWelcomeBody')}</p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">{t('transparencyTitle')}</h3>
              <p className="text-sm text-blue-800 dark:text-blue-300">{t('transparencyBody')}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-blue-900 dark:text-blue-200 mb-3">{t('creditsHowTitle')}</h2>
              <p className="text-sm text-blue-800 dark:text-blue-300 mb-4 font-semibold">{t('creditsHowIntro')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-300 mb-4">
                <div>
                  <p className="font-semibold mb-2">{t('creditsWelcomeCreditsTitle')}</p>
                  <ul className="space-y-1 ml-4">
                    <li>• {t('creditsWelcomeCredits1')}</li>
                    <li>• {t('creditsWelcomeCredits2')}</li>
                    <li>• {t('creditsWelcomeCredits3')}</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">{t('creditsPurchasedTitle')}</p>
                  <ul className="space-y-1 ml-4">
                    <li>• {t('creditsPurchased1')}</li>
                    <li>• {t('creditsPurchased2')}</li>
                    <li>• {t('creditsPurchased3')}</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">{t('creditsWhyCreditsTitle')}</h3>
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">{t('creditsWhyCreditsIntro')}</p>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 ml-4">
                  <li>• {t('creditsWhyCredits1')}</li>
                  <li>• {t('creditsWhyCredits2')}</li>
                  <li>• {t('creditsWhyCredits3')}</li>
                  <li>• {t('creditsWhyCredits4')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-700 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-red-900 dark:text-red-200 mb-2">{t('creditsApiTitle')}</h2>
              <p className="text-sm text-red-800 dark:text-red-300 mb-3">{t('creditsApiIntro')}</p>
              <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-red-200 dark:border-red-800 mb-3">
                <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-2">{t('creditsApiLimitedTitle')}</p>
                <ul className="text-sm text-red-800 dark:text-red-300 space-y-2 ml-4">
                  <li>• {t('creditsApiCompetitor')}</li>
                  <li>• {t('creditsApiInstagram')}</li>
                  <li>• {t('creditsApiAi')}</li>
                  <li>• {t('creditsApiSocial')}</li>
                </ul>
              </div>
              <p className="text-sm text-red-800 dark:text-red-300 mb-3">{t('creditsApiDontWorry')}</p>
              <Link
                href="/integrations"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <span>{t('creditsApiSetupBtn')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <ApiToolsWorkSection t={t} />

        <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-purple-900 dark:text-purple-200 mb-4">{t('creditsJustificationTitle')}</h2>
          <div className="space-y-4 text-sm text-purple-800 dark:text-purple-300">
            <div>
              <h3 className="font-semibold mb-2">{t('creditsHighValueTitle')}</h3>
              <p className="mb-2">{t('creditsHighValueBody')}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t('creditsMedHighTitle')}</h3>
              <p className="mb-2">{t('creditsMedHighBody')}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t('creditsMedTitle')}</h3>
              <p className="mb-2">{t('creditsMedBody')}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t('creditsLowMedTitle')}</h3>
              <p className="mb-2">{t('creditsLowMedBody')}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
              <p className="font-semibold mb-2">{t('creditsCostFactorsTitle')}</p>
              <ul className="space-y-1 ml-4">
                <li>• {t('creditsCostFactor1')}</li>
                <li>• {t('creditsCostFactor2')}</li>
                <li>• {t('creditsCostFactor3')}</li>
                <li>• {t('creditsCostFactor4')}</li>
                <li>• {t('creditsCostFactor5')}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {sortedCosts.map((cost) => (
            <div key={cost} className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-accent-100 dark:bg-accent-900/30 rounded-lg px-4 py-2">
                  <span className="text-2xl font-bold text-accent-600 dark:text-accent-400">{cost}</span>
                  <span className="text-sm text-mono-600 dark:text-mono-400 ml-1">{t('creditsLabel')}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-mono-950 dark:text-mono-50">{getCostTierTitle(cost)}</h3>
                  <p className="text-sm text-mono-600 dark:text-mono-400">{getCostTierDesc(cost)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {toolsByCost[cost].map((tool) => (
                  <div
                    key={tool.slug}
                    className="bg-mono-50 dark:bg-mono-800 rounded-lg p-4 border border-mono-200 dark:border-mono-700 hover:border-accent-300 dark:hover:border-accent-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-mono-950 dark:text-mono-50">{tool.name}</h4>
                      <span className="bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 font-bold px-2 py-1 rounded text-sm">
                        {tool.cost} {t('creditsLabel')}
                      </span>
                    </div>
                    <p className="text-sm text-mono-600 dark:text-mono-400 mb-2">{tool.explanation}</p>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-sm text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 font-medium inline-flex items-center space-x-1"
                    >
                      <span>{t('creditsViewTool')}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-accent-50 dark:bg-accent-900/20 border-2 border-accent-300 dark:border-accent-700 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Zap className="h-6 w-6 text-accent-600 dark:text-accent-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-accent-900 dark:text-accent-200 mb-3">{t('creditsBuyBundlesTitle')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700 flex flex-col">
                  <div className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-1">{t('credits50Credits')}</div>
                  <div className="text-lg font-semibold text-accent-600 dark:text-accent-400 mb-2">$5</div>
                  <p className="text-xs text-mono-600 dark:text-mono-400 mb-4 flex-grow">{t('creditsBundle50Desc')}</p>
                  {useStripe ? (
                    <button
                      type="button"
                      onClick={() => handleBuyCredits('bundle50')}
                      disabled={!!creditLoading}
                      className="text-accent-600 dark:text-accent-400 hover:underline font-medium text-sm inline-flex items-center gap-2 disabled:opacity-70"
                    >
                      {creditLoading === 'bundle50' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {t('creditsBuyCreditsBtn')}
                    </button>
                  ) : (
                    <a
                      href={GUMROAD_LINKS.credits.bundle50}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-600 dark:text-accent-400 hover:underline font-medium text-sm"
                    >
                      {t('creditsBuyCreditsBtn')}
                    </a>
                  )}
                </div>
                <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border-2 border-accent-300 dark:border-accent-700 flex flex-col">
                  <div className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-1">{t('credits100Credits')}</div>
                  <div className="text-lg font-semibold text-accent-600 dark:text-accent-400 mb-2">$10</div>
                  <p className="text-xs text-mono-600 dark:text-mono-400 mb-4 flex-grow">{t('creditsBundle100Desc')}</p>
                  {useStripe ? (
                    <button
                      type="button"
                      onClick={() => handleBuyCredits('bundle100')}
                      disabled={!!creditLoading}
                      className="text-accent-600 dark:text-accent-400 hover:underline font-medium text-sm inline-flex items-center gap-2 disabled:opacity-70"
                    >
                      {creditLoading === 'bundle100' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {t('creditsBuyCreditsBtn')}
                    </button>
                  ) : (
                    <a
                      href={GUMROAD_LINKS.credits.bundle100}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-600 dark:text-accent-400 hover:underline font-medium text-sm"
                    >
                      {t('creditsBuyCreditsBtn')}
                    </a>
                  )}
                </div>
                <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700 flex flex-col">
                  <div className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-1">{t('credits250Credits')}</div>
                  <div className="text-lg font-semibold text-accent-600 dark:text-accent-400 mb-2">$20</div>
                  <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-4">{t('creditsBundle250Save')}</p>
                  {useStripe ? (
                    <button
                      type="button"
                      onClick={() => handleBuyCredits('bundle250')}
                      disabled={!!creditLoading}
                      className="text-accent-600 dark:text-accent-400 hover:underline font-medium text-sm inline-flex items-center gap-2 disabled:opacity-70"
                    >
                      {creditLoading === 'bundle250' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {t('creditsBuyCreditsBtn')}
                    </button>
                  ) : (
                    <a
                      href={GUMROAD_LINKS.credits.bundle250}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-600 dark:text-accent-400 hover:underline font-medium text-sm"
                    >
                      {t('creditsBuyCreditsBtn')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-900 dark:text-yellow-200 mb-4">{t('creditsExamplesTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800 dark:text-yellow-300">
            <div>
              <p className="font-semibold mb-2">{t('creditsWelcomeExampleTitle')}</p>
              <ul className="space-y-1 ml-4">
                <li>• {t('creditsWelcomeExample1')}</li>
                <li>• {t('creditsWelcomeExample2')}</li>
                <li>• {t('creditsWelcomeExample3')}</li>
                <li>• {t('creditsWelcomeExample4')}</li>
                <li>• {t('creditsWelcomeExample5')}</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">{t('creditsPurchasedExampleTitle')}</p>
              <ul className="space-y-1 ml-4">
                <li>• {t('creditsPurchasedExample1')}</li>
                <li>• {t('creditsPurchasedExample2')}</li>
                <li>• {t('creditsPurchasedExample3')}</li>
                <li>• {t('creditsPurchasedExample4')}</li>
                <li>• {t('creditsPurchasedExample5')}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-accent-50 dark:bg-accent-900/20 border-2 border-accent-300 dark:border-accent-700 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-accent-900 dark:text-accent-200 mb-2">{t('creditsFeedbackTitle')}</h2>
          <p className="text-sm text-accent-800 dark:text-accent-300 mb-4">{t('creditsFeedbackBody')}</p>
          <Link
            href="/contact?type=feedback"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
            <span>{t('creditsFeedbackBtn')}</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
