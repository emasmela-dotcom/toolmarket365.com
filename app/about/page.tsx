'use client'

import { Zap, Cloud, TrendingUp, Users, Shield, Target } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('aboutTitleAbout')} ToolMarket<span className="text-accent-600">365</span>
            </h1>
            <p className="text-lg text-mono-600 dark:text-mono-400">
              {t('aboutSubtitle')}
            </p>
          </div>

          {/* Mission */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">{t('aboutMissionTitle')}</h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              {t('aboutMissionP1')}
            </p>
            <p className="text-mono-700 dark:text-mono-300">
              {t('aboutMissionP2')}
            </p>
          </section>

          {/* What We Offer */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">{t('aboutWhatWeOfferTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <Zap className="w-8 h-8 text-accent-600 mb-4" />
                <h3 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">{t('aboutToolsTitle')}</h3>
                <p className="text-mono-600 dark:text-mono-400">
                  {t('aboutToolsDesc')}
                </p>
              </div>

              <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <Cloud className="w-8 h-8 text-accent-600 mb-4" />
                <h3 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">{t('aboutCloudTitle')}</h3>
                <p className="text-mono-600 dark:text-mono-400">
                  {t('aboutCloudDesc')}
                </p>
              </div>

              <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <TrendingUp className="w-8 h-8 text-accent-600 mb-4" />
                <h3 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">{t('aboutAnalyticsTitle')}</h3>
                <p className="text-mono-600 dark:text-mono-400">
                  {t('aboutAnalyticsDesc')}
                </p>
              </div>

              <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <Shield className="w-8 h-8 text-accent-600 mb-4" />
                <h3 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">{t('aboutSecurityTitle')}</h3>
                <p className="text-mono-600 dark:text-mono-400">
                  {t('aboutSecurityDesc')}
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">{t('aboutWhyChooseTitle')}</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <Target className="w-6 h-6 text-accent-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{t('aboutAllInOneTitle')}</h3>
                  <p className="text-mono-600 dark:text-mono-400">
                    {t('aboutAllInOneDesc')}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Users className="w-6 h-6 text-accent-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{t('aboutBuiltForCreatorsTitle')}</h3>
                  <p className="text-mono-600 dark:text-mono-400">
                    {t('aboutBuiltForCreatorsDesc')}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Zap className="w-6 h-6 text-accent-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{t('aboutPerformanceTitle')}</h3>
                  <p className="text-mono-600 dark:text-mono-400">
                    {t('aboutPerformanceDesc')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">{t('aboutValuesTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-2">{t('aboutInnovationTitle')}</h3>
                <p className="text-sm text-mono-600 dark:text-mono-400">
                  {t('aboutInnovationDesc')}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-2">{t('aboutTransparencyTitle')}</h3>
                <p className="text-sm text-mono-600 dark:text-mono-400">
                  {t('aboutTransparencyDesc')}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-2">{t('aboutSupportTitle')}</h3>
                <p className="text-sm text-mono-600 dark:text-mono-400">
                  {t('aboutSupportDesc')}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
