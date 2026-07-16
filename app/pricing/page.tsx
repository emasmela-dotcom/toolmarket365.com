'use client'

import Link from 'next/link'
import { Check, ArrowRight, Info } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { translatedFaq, translatedPlanFeatures } from '@/lib/i18n/translations'

export default function PricingPage() {
  const { language, t } = useLanguage()
  const plans = [
    {
      name: 'ToolMarket365',
      price: '$0.99',
      period: t('pricingPeriod'),
      description: t('pricingPlanDescription'),
      features: translatedPlanFeatures[language],
    },
  ]
  const faq = translatedFaq[language]

  return (
    <div className="min-h-screen bg-mono-50 text-mono-900 dark:bg-mono-950 dark:text-mono-50">
      <section className="bg-gradient-to-b from-accent-50 to-white dark:from-mono-900 dark:to-mono-950 py-16 border-b border-mono-200 dark:border-mono-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-mono-950 dark:text-mono-50 mb-6">
              {t('pricingTitle')}
            </h1>
            <p className="text-xl text-mono-600 dark:text-mono-400 mb-6">
              {t('pricingSubtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-lg border border-blue-200 bg-white p-6 text-mono-950 dark:border-blue-300 dark:bg-white dark:text-mono-950">
              <div className="flex items-start space-x-3">
                <Info className="h-6 w-6 flex-shrink-0 text-blue-700 dark:text-blue-700 mt-0.5" />
                <p className="text-sm text-blue-900 dark:text-blue-900">
                  {t('pricingInfo')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="rounded-lg border-2 border-accent-500 bg-white p-6 text-mono-950 shadow-lg dark:bg-white dark:text-mono-950"
              >
                <div className="text-center mb-6">
                  <h2 className="mb-1 text-xl font-bold text-mono-950">{plan.name}</h2>
                  <p className="mb-3 text-sm text-mono-700">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-mono-950">{plan.price}</span>
                    <span className="ml-1 text-sm text-mono-700">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-mono-800">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/select-plan"
                  className="block w-full text-center py-2.5 px-4 rounded-lg font-semibold text-sm bg-accent-600 text-white hover:bg-accent-700 transition-colors"
                >
                  {t('pricingSubscribe')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-mono-50 dark:bg-mono-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('pricingWhyTitle')}
            </h2>
            <p className="text-lg text-mono-600 dark:text-mono-400">
              {t('pricingWhyText')}
            </p>
            <Link
              href="/compare"
              className="inline-block mt-6 text-accent-600 dark:text-accent-400 hover:underline font-medium"
            >
              {t('pricingCompare')}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-mono-100 py-16 text-mono-950 dark:bg-mono-950 dark:text-mono-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-8 text-center text-3xl font-bold text-mono-950 dark:text-mono-50">
              {t('pricingFaqTitle')}
            </h2>
            <div className="space-y-6">
              {faq.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-mono-200 bg-white p-6 dark:border-mono-600 dark:bg-white"
                >
                  <h3 className="mb-2 font-semibold text-mono-950">{item.question}</h3>
                  <p className="text-sm text-mono-700">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-accent-50 to-white dark:from-mono-900 dark:to-mono-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('pricingGetStarted')}
            </h2>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
            >
              {t('pricingSignUp')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
