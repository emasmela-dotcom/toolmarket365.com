'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function TermsPage() {
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
          {t('termsTitle')}
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-mono-600 dark:text-mono-400 mb-6">
            <strong>{t('termsLastUpdated')}</strong> {lastUpdated}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('terms1Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('terms1Body')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('terms2Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('terms2Body')}
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li>{t('terms2Item1')}</li>
              <li>{t('terms2Item2')}</li>
              <li>{t('terms2Item3')}</li>
              <li>{t('terms2Item4')}</li>
              <li>{t('terms2Item5')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('terms3Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('terms3Body')}
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li>{t('terms3Item1')}</li>
              <li>{t('terms3Item2')}</li>
              <li>{t('terms3Item3')}</li>
              <li>{t('terms3Item4')}</li>
              <li>{t('terms3Item5')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('terms4Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              <strong>{t('terms4FreeTierLabel')}</strong> {t('terms4FreeTierText')}
            </p>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              <strong>{t('terms4PaidLabel')}</strong> {t('terms4PaidText')}
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li>{t('terms4Item1')}</li>
              <li>{t('terms4Item2')}</li>
              <li>{t('terms4Item3')}</li>
              <li>{t('terms4Item4')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('terms5Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('terms5Intro')}
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li>{t('terms5Item1')}</li>
              <li>{t('terms5Item2')}</li>
              <li>{t('terms5Item3')}</li>
              <li>{t('terms5Item4')}</li>
              <li>{t('terms5Item5')}</li>
              <li>{t('terms5Item6')}</li>
              <li>{t('terms5Item7')}</li>
              <li>{t('terms5Item8')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('terms6Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('terms6Body')}
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li>{t('terms6Item1')}</li>
              <li>{t('terms6Item2')}</li>
              <li>{t('terms6Item3')}</li>
            </ul>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('terms6Body2')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('terms7Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('terms7Body')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('terms8Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('terms8Intro')}
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li>{t('terms8Item1')}</li>
              <li>{t('terms8Item2')}</li>
              <li>{t('terms8Item3')}</li>
            </ul>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('terms8Body2')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('terms9Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('terms9Body')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('terms10Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('terms10Body1')}
            </p>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('terms10Body2')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('terms11Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('terms11Body')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('terms12Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('terms12Body')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('terms13Title')}
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('terms13Intro')}
            </p>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              <strong>{t('terms13EmailLabel')}</strong> <a href="mailto:apputilitybuilder@gmail.com" className="text-accent-600 dark:text-accent-400 hover:underline">apputilitybuilder@gmail.com</a><br />
              <strong>{t('terms13WebsiteLabel')}</strong> <Link href="/contact" className="text-accent-600 dark:text-accent-400 hover:underline">{t('terms13ContactPage')}</Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
