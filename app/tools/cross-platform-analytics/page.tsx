'use client'

import React, { useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface PlatformData {
  platform: string
  followers: number
  posts: number
  engagement: number
}

const platforms = ['Instagram', 'TikTok', 'Twitter', 'YouTube', 'LinkedIn']

const copy = {
  en: {
    toolName: 'Cross-Platform Analytics',
    toolDescription:
      'View analytics across multiple social media platforms in one dashboard. Compare followers, posts, and engagement rates across Instagram, TikTok, Twitter, YouTube, and LinkedIn.',
    howToUse: [
      { label: 'Load data:', text: 'Click "Load Mock Data" to see sample analytics' },
      { label: 'View metrics:', text: 'See followers, posts, and engagement rates for each platform' },
      { label: 'Compare platforms:', text: 'Review totals and averages across all platforms' },
      {
        label: 'Analyze performance:',
        text: 'Use color-coded engagement rates to identify top-performing platforms',
      },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Displays analytics data across multiple social media platforms in one unified view. Shows followers, posts, and engagement rates for Instagram, TikTok, Twitter, YouTube, and LinkedIn.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Click "Load mock data"', text: 'to see example analytics' },
      {
        label: 'View platform data:',
        text: 'See followers, posts, and engagement rate for each platform',
      },
      {
        label: 'Compare platforms:',
        text: 'Easily compare performance across different social media platforms',
      },
      {
        label: 'Analyze trends:',
        text: 'Review engagement rates and follower counts to identify top-performing platforms',
      },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Unified view of all platform analytics',
      'Side-by-side comparison of platforms',
      'Followers, posts, and engagement data for each platform',
      'Easy-to-read table format',
      'Quick overview of your social media presence',
    ],
    title: 'Cross-Platform Analytics',
    loadMockData: 'Load Mock Data',
    platform: 'Platform',
    followers: 'Followers',
    posts: 'Posts',
    engagement: 'Engagement',
    totals: 'Totals',
    averages: 'Averages',
    totalFollowers: 'Total Followers',
    acrossAll: 'Across all platforms',
    totalPosts: 'Total Posts',
    contentPublished: 'Content published',
    avgEngagement: 'Avg Engagement',
    avgAcross: 'Average across platforms',
    noteLabel: 'Note:',
    noteBody:
      'This tool uses mock data for demonstration. For real cross-platform analytics, connect to platform APIs or use analytics services like Hootsuite, Sprout Social, or Buffer.',
    howItWorks: 'How it works:',
    emptyIntro: 'Click "Load Mock Data" to see a sample cross-platform analytics dashboard showing:',
    emptyItems: [
      'Followers, posts, and engagement across 5 platforms',
      'Totals and averages for all metrics',
      'Color-coded engagement rates',
      'Summary cards with key metrics',
    ],
  },
  es: {
    toolName: 'Analítica multiplataforma',
    toolDescription:
      'Consulta analítica de varias redes sociales en un solo panel. Compara seguidores, publicaciones y tasas de engagement en Instagram, TikTok, Twitter, YouTube y LinkedIn.',
    howToUse: [
      { label: 'Cargar datos:', text: 'Haz clic en "Cargar datos de ejemplo" para ver analítica de muestra' },
      {
        label: 'Ver métricas:',
        text: 'Consulta seguidores, publicaciones y tasas de engagement de cada plataforma',
      },
      {
        label: 'Comparar plataformas:',
        text: 'Revisa totales y promedios en todas las plataformas',
      },
      {
        label: 'Analizar rendimiento:',
        text: 'Usa las tasas de engagement con colores para identificar las plataformas con mejor rendimiento',
      },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Muestra datos de analítica de varias redes sociales en una vista unificada. Incluye seguidores, publicaciones y tasas de engagement para Instagram, TikTok, Twitter, YouTube y LinkedIn.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Haz clic en "Cargar datos de ejemplo"', text: 'para ver analítica de muestra' },
      {
        label: 'Ver datos por plataforma:',
        text: 'Consulta seguidores, publicaciones y tasa de engagement de cada una',
      },
      {
        label: 'Comparar plataformas:',
        text: 'Compara fácilmente el rendimiento entre redes sociales',
      },
      {
        label: 'Analizar tendencias:',
        text: 'Revisa engagement y seguidores para identificar las plataformas con mejor rendimiento',
      },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Vista unificada de la analítica de todas las plataformas',
      'Comparación lado a lado entre plataformas',
      'Datos de seguidores, publicaciones y engagement por plataforma',
      'Formato de tabla fácil de leer',
      'Resumen rápido de tu presencia en redes',
    ],
    title: 'Analítica multiplataforma',
    loadMockData: 'Cargar datos de ejemplo',
    platform: 'Plataforma',
    followers: 'Seguidores',
    posts: 'Publicaciones',
    engagement: 'Engagement',
    totals: 'Totales',
    averages: 'Promedios',
    totalFollowers: 'Seguidores totales',
    acrossAll: 'En todas las plataformas',
    totalPosts: 'Publicaciones totales',
    contentPublished: 'Contenido publicado',
    avgEngagement: 'Engagement medio',
    avgAcross: 'Promedio entre plataformas',
    noteLabel: 'Nota:',
    noteBody:
      'Esta herramienta usa datos de ejemplo para demostración. Para analítica multiplataforma real, conecta las APIs de las plataformas o usa servicios como Hootsuite, Sprout Social o Buffer.',
    howItWorks: 'Cómo funciona:',
    emptyIntro:
      'Haz clic en "Cargar datos de ejemplo" para ver un panel de analítica multiplataforma de muestra con:',
    emptyItems: [
      'Seguidores, publicaciones y engagement en 5 plataformas',
      'Totales y promedios de todas las métricas',
      'Tasas de engagement con código de color',
      'Tarjetas resumen con métricas clave',
    ],
  },
}

type Copy = (typeof copy)[keyof typeof copy]

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function CrossPlatformAnalyticsContent({ c }: { c: Copy }) {
  const [data, setData] = useState<PlatformData[]>([])

  const loadMockData = () => {
    const mockData: PlatformData[] = platforms.map((p) => ({
      platform: p,
      followers: rand(1000, 50000),
      posts: rand(30, 200),
      engagement: parseFloat((rand(10, 100) / 10).toFixed(1)),
    }))

    setData(mockData)
  }

  const totals = data.reduce(
    (acc, item) => ({
      followers: acc.followers + item.followers,
      posts: acc.posts + item.posts,
      engagement: acc.engagement + item.engagement,
    }),
    { followers: 0, posts: 0, engagement: 0 }
  )

  const averages = data.length > 0
    ? {
        followers: Math.round(totals.followers / data.length),
        posts: Math.round(totals.posts / data.length),
        engagement: parseFloat((totals.engagement / data.length).toFixed(1)),
      }
    : { followers: 0, posts: 0, engagement: 0 }

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      Instagram: '📷',
      TikTok: '🎵',
      Twitter: '🐦',
      YouTube: '📺',
      LinkedIn: '💼',
    }
    return icons[platform] || '📱'
  }

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 5) return 'text-green-600 font-semibold'
    if (engagement >= 3) return 'text-yellow-600 font-semibold'
    return 'text-red-600 font-semibold'
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
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

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          {c.title}
        </h1>

        <div className="mb-6">
          <button
            onClick={loadMockData}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {c.loadMockData}
          </button>
        </div>

        {data.length > 0 && (
          <>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                      {c.platform}
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                      {c.followers}
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                      {c.posts}
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                      {c.engagement}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getPlatformIcon(item.platform)}</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {item.platform}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                        {item.followers.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                        {item.posts.toLocaleString()}
                      </td>
                      <td
                        className={`px-4 py-3 text-right ${getEngagementColor(item.engagement)}`}
                      >
                        {item.engagement}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-gray-700/50">
                  <tr className="font-bold">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{c.totals}</td>
                    <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                      {totals.followers.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                      {totals.posts.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                      {averages.engagement}%
                    </td>
                  </tr>
                  <tr className="text-sm text-gray-600 dark:text-gray-400">
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{c.averages}</td>
                    <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400">
                      {averages.followers.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400">
                      {averages.posts.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400">
                      {averages.engagement}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-sm text-blue-800 dark:text-blue-200 mb-1">
                  {c.totalFollowers}
                </div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {totals.followers.toLocaleString()}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  {c.acrossAll}
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-sm text-green-800 dark:text-green-200 mb-1">
                  {c.totalPosts}
                </div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {totals.posts.toLocaleString()}
                </div>
                <div className="text-xs text-green-600 dark:text-green-300 mt-1">
                  {c.contentPublished}
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-sm text-purple-800 dark:text-purple-200 mb-1">
                  {c.avgEngagement}
                </div>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {averages.engagement}%
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-300 mt-1">
                  {c.avgAcross}
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>{c.noteLabel}</strong> {c.noteBody}
              </p>
            </div>
          </>
        )}

        {data.length === 0 && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              {c.howItWorks}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {c.emptyIntro}
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {c.emptyItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CrossPlatformAnalytics() {
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
      toolSlug="cross-platform-analytics"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <CrossPlatformAnalyticsContent c={c} />
    </ToolAccessGate>
  )
}
