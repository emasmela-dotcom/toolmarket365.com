'use client'

import React from 'react'
import { BookOpen, Copy, Check } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const pricingData = {
  instagram: {
    '0-10k': { post: '$50-$200', reel: '$100-$500', story: '$25-$100', collaboration: '$200-$1,000' },
    '10k-50k': { post: '$200-$500', reel: '$500-$1,500', story: '$100-$300', collaboration: '$1,000-$3,000' },
    '50k-100k': { post: '$500-$1,000', reel: '$1,500-$3,000', story: '$300-$600', collaboration: '$3,000-$7,000' },
    '100k-500k': { post: '$1,000-$3,000', reel: '$3,000-$8,000', story: '$600-$1,500', collaboration: '$7,000-$20,000' },
    '500k+': { post: '$3,000-$10,000+', reel: '$8,000-$25,000+', story: '$1,500-$5,000+', collaboration: '$20,000-$100,000+' },
  },
  tiktok: {
    '0-10k': { video: '$100-$500', brand: '$200-$1,000', collaboration: '$300-$1,500' },
    '10k-50k': { video: '$500-$1,500', brand: '$1,000-$3,000', collaboration: '$1,500-$5,000' },
    '50k-100k': { video: '$1,500-$3,000', brand: '$3,000-$7,000', collaboration: '$5,000-$10,000' },
    '100k-500k': { video: '$3,000-$8,000', brand: '$7,000-$20,000', collaboration: '$10,000-$30,000' },
    '500k+': { video: '$8,000-$25,000+', brand: '$20,000-$50,000+', collaboration: '$30,000-$100,000+' },
  },
  youtube: {
    '0-10k': { video: '$100-$500', sponsorship: '$200-$1,000', collaboration: '$300-$1,500' },
    '10k-50k': { video: '$500-$2,000', sponsorship: '$1,000-$5,000', collaboration: '$1,500-$7,000' },
    '50k-100k': { video: '$2,000-$5,000', sponsorship: '$5,000-$15,000', collaboration: '$7,000-$20,000' },
    '100k-500k': { video: '$5,000-$15,000', sponsorship: '$15,000-$50,000', collaboration: '$20,000-$75,000' },
    '500k+': { video: '$15,000-$50,000+', sponsorship: '$50,000-$200,000+', collaboration: '$75,000-$500,000+' },
  },
  twitter: {
    '0-10k': { tweet: '$25-$100', thread: '$100-$300', collaboration: '$200-$800' },
    '10k-50k': { tweet: '$100-$300', thread: '$300-$800', collaboration: '$800-$2,500' },
    '50k-100k': { tweet: '$300-$600', thread: '$800-$1,500', collaboration: '$2,500-$5,000' },
    '100k-500k': { tweet: '$600-$2,000', thread: '$1,500-$5,000', collaboration: '$5,000-$15,000' },
    '500k+': { tweet: '$2,000-$10,000+', thread: '$5,000-$25,000+', collaboration: '$15,000-$50,000+' },
  },
  linkedin: {
    '0-10k': { post: '$100-$500', article: '$300-$1,000', collaboration: '$500-$2,000' },
    '10k-50k': { post: '$500-$1,500', article: '$1,000-$3,000', collaboration: '$2,000-$5,000' },
    '50k-100k': { post: '$1,500-$3,000', article: '$3,000-$7,000', collaboration: '$5,000-$10,000' },
    '100k-500k': { post: '$3,000-$8,000', article: '$7,000-$20,000', collaboration: '$10,000-$30,000' },
    '500k+': { post: '$8,000-$25,000+', article: '$20,000-$50,000+', collaboration: '$30,000-$100,000+' },
  },
  facebook: {
    '0-10k': { post: '$50-$200', video: '$100-$500', collaboration: '$200-$1,000' },
    '10k-50k': { post: '$200-$500', video: '$500-$1,500', collaboration: '$1,000-$3,000' },
    '50k-100k': { post: '$500-$1,000', video: '$1,500-$3,000', collaboration: '$3,000-$7,000' },
    '100k-500k': { post: '$1,000-$3,000', video: '$3,000-$8,000', collaboration: '$7,000-$20,000' },
    '500k+': { post: '$3,000-$10,000+', video: '$8,000-$25,000+', collaboration: '$20,000-$100,000+' },
  },
}

const copy = {
  en: {
    title: 'Creator Pricing Guide',
    subtitle:
      'Industry-standard pricing benchmarks for content creators. Use this guide to understand fair rates based on your follower count and platform.',
    howToUseTitle: 'How to Use This Guide',
    whatThisIs: 'What This Is',
    whatThisIsBody:
      'Reference guide showing industry-standard pricing ranges for content creators based on follower count and platform. These are benchmarks—actual rates vary based on engagement, niche, and negotiation.',
    howToUse: 'How to Use',
    howToUseSteps: [
      { label: 'Select your platform:', text: 'Choose Instagram, TikTok, YouTube, etc.' },
      { label: 'Find your follower range:', text: 'Locate your current follower count' },
      { label: 'Check content types:', text: 'See pricing for posts, videos, collaborations, etc.' },
      {
        label: 'Use as reference:',
        text: 'These are starting points—adjust based on your engagement rate and niche',
      },
    ],
    importantNotes: 'Important Notes',
    importantNotesList: [
      'Rates vary significantly based on engagement rate, niche, and content quality',
      'These are per-post/video rates—long-term partnerships may offer different pricing',
      'Always negotiate based on your unique value and audience demographics',
      'For exact calculations, use the Rate Calculator tool (available in Professional plan)',
    ],
    selectPlatform: 'Select Platform',
    followerCount: 'Follower Count',
    copyPrice: 'Copy price',
    footerNote:
      'These are industry benchmarks. Your actual rates should be based on your engagement rate, niche, content quality, and negotiation skills. For personalized rate calculations, upgrade to Professional plan to access the Rate Calculator tool.',
    note: 'Note:',
    contentTypes: {
      post: 'Post',
      reel: 'Reel',
      story: 'Story',
      collaboration: 'Collaboration',
      video: 'Video',
      brand: 'Brand',
      sponsorship: 'Sponsorship',
      tweet: 'Tweet',
      thread: 'Thread',
      article: 'Article',
    },
    platforms: {
      instagram: 'Instagram',
      tiktok: 'TikTok',
      youtube: 'YouTube',
      twitter: 'Twitter / X',
      linkedin: 'LinkedIn',
      facebook: 'Facebook',
    },
  },
  es: {
    title: 'Guía de precios para creadores',
    subtitle:
      'Referencias de precios del sector para creadores de contenido. Usa esta guía para entender tarifas justas según tu número de seguidores y plataforma.',
    howToUseTitle: 'Cómo usar esta guía',
    whatThisIs: 'Qué es',
    whatThisIsBody:
      'Guía de referencia con rangos de precios estándar del sector según seguidores y plataforma. Son referencias: las tarifas reales varían según engagement, nicho y negociación.',
    howToUse: 'Cómo usar',
    howToUseSteps: [
      { label: 'Elige tu plataforma:', text: 'Instagram, TikTok, YouTube, etc.' },
      { label: 'Encuentra tu rango de seguidores:', text: 'Localiza tu número actual de seguidores' },
      { label: 'Revisa tipos de contenido:', text: 'Consulta precios de publicaciones, videos, colaboraciones, etc.' },
      {
        label: 'Úsalo como referencia:',
        text: 'Son puntos de partida: ajusta según tu tasa de engagement y nicho',
      },
    ],
    importantNotes: 'Notas importantes',
    importantNotesList: [
      'Las tarifas varían mucho según engagement, nicho y calidad del contenido',
      'Son tarifas por publicación/video: las colaboraciones a largo plazo pueden tener otros precios',
      'Negocia siempre según tu valor único y la demografía de tu audiencia',
      'Para cálculos exactos, usa la herramienta Rate Calculator (disponible en el plan Professional)',
    ],
    selectPlatform: 'Seleccionar plataforma',
    followerCount: 'Número de seguidores',
    copyPrice: 'Copiar precio',
    footerNote:
      'Estas son referencias del sector. Tus tarifas reales deben basarse en engagement, nicho, calidad del contenido y habilidades de negociación. Para cálculos personalizados, actualiza al plan Professional para acceder a la herramienta Rate Calculator.',
    note: 'Nota:',
    contentTypes: {
      post: 'Publicación',
      reel: 'Reel',
      story: 'Historia',
      collaboration: 'Colaboración',
      video: 'Video',
      brand: 'Marca',
      sponsorship: 'Patrocinio',
      tweet: 'Tweet',
      thread: 'Hilo',
      article: 'Artículo',
    },
    platforms: {
      instagram: 'Instagram',
      tiktok: 'TikTok',
      youtube: 'YouTube',
      twitter: 'Twitter / X',
      linkedin: 'LinkedIn',
      facebook: 'Facebook',
    },
  },
}

type Copy = (typeof copy)[keyof typeof copy]

function CreatorPricingGuideContent({ c }: { c: Copy }) {
  const [selectedPlatform, setSelectedPlatform] = React.useState<string>('instagram')
  const [copied, setCopied] = React.useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const currentData = pricingData[selectedPlatform as keyof typeof pricingData]

  const contentTypeLabel = (key: string) =>
    c.contentTypes[key as keyof typeof c.contentTypes] ?? key.charAt(0).toUpperCase() + key.slice(1)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BookOpen className="h-10 w-10 text-accent-600 dark:text-accent-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{c.title}</h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">{c.subtitle}</p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{c.howToUseTitle}</h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.whatThisIs}</h3>
              <p>{c.whatThisIsBody}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.howToUse}</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                {c.howToUseSteps.map((step, i) => (
                  <li key={i}>
                    <strong>{step.label}</strong> {step.text}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.importantNotes}</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {c.importantNotesList.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {c.selectPlatform}
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(pricingData).map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPlatform === platform
                    ? 'bg-accent-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {c.platforms[platform as keyof typeof c.platforms]}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {c.followerCount}
                  </th>
                  {Object.keys(currentData['0-10k']).map((contentType) => (
                    <th
                      key={contentType}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {contentTypeLabel(contentType)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {Object.entries(currentData).map(([followerRange, prices]) => (
                  <tr key={followerRange} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {followerRange.replace('-', ' - ')}
                    </td>
                    {Object.entries(prices).map(([contentType, price]) => {
                      const cellId = `${selectedPlatform}-${followerRange}-${contentType}`
                      return (
                        <td
                          key={contentType}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300"
                        >
                          <div className="flex items-center space-x-2">
                            <span>{String(price)}</span>
                            <button
                              onClick={() => copyToClipboard(String(price), cellId)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                              title={c.copyPrice}
                            >
                              {copied === cellId ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>{c.note}</strong> {c.footerNote}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CreatorPricingGuidePage() {
  const { language } = useLanguage()
  const c = copy[language]

  return <CreatorPricingGuideContent c={c} />
}
