'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div
      className="inline-flex items-center rounded-lg border border-mono-300 bg-white p-0.5 text-xs font-semibold text-mono-800 shadow-sm dark:border-mono-600 dark:bg-mono-900 dark:text-mono-100"
      aria-label={t('languageToggleLabel')}
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`rounded-md px-2 py-1 transition-colors ${
          language === 'en'
            ? 'bg-accent-600 text-white'
            : 'text-mono-700 hover:bg-mono-100 dark:text-mono-200 dark:hover:bg-mono-800'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('es')}
        className={`rounded-md px-2 py-1 transition-colors ${
          language === 'es'
            ? 'bg-accent-600 text-white'
            : 'text-mono-700 hover:bg-mono-100 dark:text-mono-200 dark:hover:bg-mono-800'
        }`}
      >
        ES
      </button>
    </div>
  )
}
