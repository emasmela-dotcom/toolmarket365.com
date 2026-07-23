'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function PrivacyPage() {
  const { t, language } = useLanguage()
  const lastUpdated = new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-8">
          {t('privacyTitle')}
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-mono-600 dark:text-mono-400 mb-6">
            <strong>{t('privacyLastUpdated')}</strong> {lastUpdated}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('privacy1Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('privacy1Body')}
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li>{t('privacy1Item1')}</li>
              <li>{t('privacy1Item2')}</li>
              <li>{t('privacy1Item3')}</li>
              <li>{t('privacy1Item4')}</li>
              <li>{t('privacy1Item5')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('privacy2Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('privacy2Body')}
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li>{t('privacy2Item1')}</li>
              <li>{t('privacy2Item2')}</li>
              <li>{t('privacy2Item3')}</li>
              <li>{t('privacy2Item4')}</li>
              <li>{t('privacy2Item5')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('privacy3Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('privacy3Body')}
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li><strong>{t('privacy3Item1Label')}</strong> {t('privacy3Item1Text')}</li>
              <li><strong>{t('privacy3Item2Label')}</strong> {t('privacy3Item2Text')}</li>
              <li><strong>{t('privacy3Item3Label')}</strong> {t('privacy3Item3Text')}</li>
            </ul>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('privacy3Body2')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('privacy4Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('privacy4Body')}
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li><strong>{t('privacy4StripeLabel')}</strong> {t('privacy4StripeBefore')}<a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent-600 dark:text-accent-400 hover:underline">{t('privacy4StripeLink')}</a>)</li>
              <li><strong>{t('privacy4NeonLabel')}</strong> {t('privacy4NeonBefore')}<a href="https://neon.tech/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent-600 dark:text-accent-400 hover:underline">{t('privacy4NeonLink')}</a>)</li>
              <li><strong>{t('privacy4VercelLabel')}</strong> {t('privacy4VercelBefore')}<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent-600 dark:text-accent-400 hover:underline">{t('privacy4VercelLink')}</a>)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('privacy5Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('privacy5Body')}
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li>{t('privacy5Item1')}</li>
              <li>{t('privacy5Item2')}</li>
              <li>{t('privacy5Item3')}</li>
              <li>{t('privacy5Item4')}</li>
              <li>{t('privacy5Item5')}</li>
            </ul>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('privacy5Body2')} <a href="mailto:apputilitybuilder@gmail.com" className="text-accent-600 dark:text-accent-400 hover:underline">apputilitybuilder@gmail.com</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('privacy6Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('privacy6Body')}
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li>{t('privacy6Item1')}</li>
              <li>{t('privacy6Item2')}</li>
              <li>{t('privacy6Item3')}</li>
            </ul>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('privacy6Body2')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('privacy7Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('privacy7Body')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('privacy8Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('privacy8Body')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('privacy9Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('privacy9Intro')}
            </p>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              <strong>{t('privacy9EmailLabel')}</strong> <a href="mailto:apputilitybuilder@gmail.com" className="text-accent-600 dark:text-accent-400 hover:underline">apputilitybuilder@gmail.com</a><br />
              <strong>{t('privacy9WebsiteLabel')}</strong> <Link href="/contact" className="text-accent-600 dark:text-accent-400 hover:underline">{t('privacy9ContactPage')}</Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
