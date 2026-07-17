'use client'

import React, { useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface MentionData {
  platform: string
  count: number
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const copy = {
  en: {
    toolName: 'Brand Mention Tracker',
    toolDescription:
      'Tracks mentions of your brand across different social media platforms. Shows how many times your brand is mentioned on Twitter, Reddit, TikTok, Instagram, LinkedIn, YouTube, and Facebook.',
    howToUse: [
      { label: 'Enter brand name:', text: 'Type your brand name to track' },
      { label: 'Click "Check"', text: 'to search for brand mentions' },
      {
        label: 'Review results:',
        text: 'See total mentions and breakdown by platform with visual progress bars showing distribution',
      },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Tracks mentions of your brand across different social media platforms. Shows how many times your brand is mentioned on Twitter, Reddit, TikTok, Instagram, LinkedIn, YouTube, and Facebook.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter brand name:', text: 'Type your brand name to track' },
      { label: 'Click "Check"', text: 'to search for brand mentions' },
      {
        label: 'Review results:',
        text: 'See total mentions and breakdown by platform with visual progress bars showing distribution',
      },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Total brand mentions across all platforms',
      'Platform-by-platform breakdown with mention counts',
      'Visual progress bars showing mention distribution',
      'Platform icons for easy identification',
      'Percentage breakdown of mentions per platform',
    ],
    title: 'Brand Mention Tracker',
    brandLabel: 'Brand',
    brandPlaceholder: 'Enter your brand name',
    brandHint: 'Track mentions of your brand across social media platforms',
    check: 'Check',
    brandMentions: (name: string) => `Brand Mentions: "${name}"`,
    totalMentions: (n: string) => `${n} total mentions`,
    mention: (n: number) => `${n} mention${n !== 1 ? 's' : ''}`,
    noteLabel: 'Note:',
    noteBody:
      'This is a demo tool that generates sample data. For real brand mention tracking, you would need to connect to social media APIs or use a brand monitoring service.',
    howItWorks: 'How it works:',
    howItWorksBody:
      'Enter your brand name and click "Check" to see how many times your brand is mentioned across different social media platforms. Track your brand\'s visibility and monitor online conversations about your brand.',
    alertEnterBrand: 'Please enter a brand name',
  },
  es: {
    toolName: 'Rastreador de menciones de marca',
    toolDescription:
      'Rastrea menciones de tu marca en distintas plataformas de redes sociales. Muestra cuántas veces se menciona tu marca en Twitter, Reddit, TikTok, Instagram, LinkedIn, YouTube y Facebook.',
    howToUse: [
      { label: 'Ingresa el nombre de marca:', text: 'Escribe el nombre de tu marca a rastrear' },
      { label: 'Haz clic en "Verificar"', text: 'para buscar menciones de marca' },
      {
        label: 'Revisa los resultados:',
        text: 'Ve el total de menciones y desglose por plataforma con barras de progreso visuales',
      },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Rastrea menciones de tu marca en distintas plataformas de redes sociales. Muestra cuántas veces se menciona tu marca en Twitter, Reddit, TikTok, Instagram, LinkedIn, YouTube y Facebook.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Ingresa el nombre de marca:', text: 'Escribe el nombre de tu marca a rastrear' },
      { label: 'Haz clic en "Verificar"', text: 'para buscar menciones de marca' },
      {
        label: 'Revisa los resultados:',
        text: 'Ve el total de menciones y desglose por plataforma con barras de progreso visuales',
      },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Total de menciones de marca en todas las plataformas',
      'Desglose por plataforma con conteo de menciones',
      'Barras de progreso visuales mostrando la distribución',
      'Iconos de plataforma para identificación fácil',
      'Desglose porcentual de menciones por plataforma',
    ],
    title: 'Rastreador de menciones de marca',
    brandLabel: 'Marca',
    brandPlaceholder: 'Ingresa el nombre de tu marca',
    brandHint: 'Rastrea menciones de tu marca en plataformas de redes sociales',
    check: 'Verificar',
    brandMentions: (name: string) => `Menciones de marca: "${name}"`,
    totalMentions: (n: string) => `${n} menciones en total`,
    mention: (n: number) => `${n} mención${n !== 1 ? 'es' : ''}`,
    noteLabel: 'Nota:',
    noteBody:
      'Esta es una herramienta de demostración que genera datos de ejemplo. Para rastreo real de menciones de marca, necesitarías conectar APIs de redes sociales o usar un servicio de monitoreo de marca.',
    howItWorks: 'Cómo funciona:',
    howItWorksBody:
      'Ingresa el nombre de tu marca y haz clic en "Verificar" para ver cuántas veces se menciona en distintas plataformas de redes sociales. Rastrea la visibilidad de tu marca y monitorea conversaciones en línea sobre ella.',
    alertEnterBrand: 'Por favor ingresa un nombre de marca',
  },
}

function BrandMentionTrackerContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [brand, setBrand] = useState('')
  const [mentions, setMentions] = useState<MentionData[]>([])
  const [isChecking, setIsChecking] = useState(false)

  const check = () => {
    const brandName = brand.trim()
    if (!brandName) {
      alert(c.alertEnterBrand)
      return
    }

    setIsChecking(true)

    const mock: MentionData[] = [
      { platform: 'Twitter', count: rand(5, 30) },
      { platform: 'Reddit', count: rand(2, 15) },
      { platform: 'TikTok', count: rand(10, 50) },
      { platform: 'Instagram', count: rand(8, 40) },
      { platform: 'LinkedIn', count: rand(3, 20) },
      { platform: 'YouTube', count: rand(5, 25) },
      { platform: 'Facebook', count: rand(4, 18) },
    ]

    setMentions(mock)
  }

  const totalMentions = mentions.reduce((sum, m) => sum + m.count, 0)

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      Twitter: '🐦',
      Reddit: '🤖',
      TikTok: '🎵',
      Instagram: '📷',
      LinkedIn: '💼',
      YouTube: '📺',
      Facebook: '👥',
    }
    return icons[platform] || '📱'
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{c.howToUseTitle}</h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.whatItDoes}</h3>
              <p>{c.whatItDoesBody}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.howToUseInner}</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                {c.howToUseSteps.map((step, i) => (
                  <li key={i}>
                    <strong>{step.label}</strong> {step.text}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.expectedOutcome}</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {c.expectedOutcomes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{c.title}</h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{c.brandLabel}</label>
            <input
              id="b"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder={c.brandPlaceholder}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              onKeyPress={(e) => {
                if (e.key === 'Enter') check()
              }}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{c.brandHint}</p>
          </div>

          <button onClick={check} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
            {c.check}
          </button>
        </div>

        {mentions.length > 0 && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{c.brandMentions(brand)}</h2>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {c.totalMentions(totalMentions.toLocaleString())}
              </div>
            </div>

            <div className="space-y-3">
              {mentions.map((mention, index) => (
                <div
                  key={index}
                  className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getPlatformIcon(mention.platform)}</span>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{mention.platform}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{c.mention(mention.count)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all"
                          style={{
                            width: `${(mention.count / totalMentions) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white w-16 text-right">
                        {mention.count}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>{c.noteLabel}</strong> {c.noteBody}
              </p>
            </div>
          </div>
        )}

        {!isChecking && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">{c.howItWorks}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{c.howItWorksBody}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BrandMentionTracker() {
  const { language } = useLanguage()
  const c = copy[language]

  const howToUse = (
    <div>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        {c.howToUse.map((step, i) => (
          <li key={i}>
            <strong>{step.label}</strong> {step.text}
          </li>
        ))}
      </ol>
    </div>
  )

  return (
    <ToolAccessGate
      toolSlug="brand-mention-tracker"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <BrandMentionTrackerContent />
    </ToolAccessGate>
  )
}
