'use client'

import React, { useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface TrendData {
  week: string
  score: number
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const copy = {
  en: {
    toolName: 'Trend Tracker',
    toolDescription:
      'Tracks trending topics and keywords over time. Monitors trend scores, identifies rising trends, and provides insights into what\'s gaining popularity in your niche or industry.',
    howToUse: [
      { label: 'Enter topic:', text: 'Type a topic or keyword to track' },
      { label: 'Click "Track":', text: 'See trend data and scores over time' },
      { label: 'Review trends:', text: 'View weekly trend scores and visualizations' },
      { label: 'Analyze patterns:', text: 'Identify rising or declining trends' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Tracks trending status of keywords, topics, or hashtags over time. Shows weekly trend scores to help identify rising or falling topics in your niche.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter keyword:', text: 'Type a keyword, topic, or hashtag to track (e.g., "content marketing")' },
      { label: 'Click "Track"', text: 'to analyze the trend' },
      { label: 'Review results:', text: 'See weekly trend scores (W1, W2, W3, W4) with visual progress bars and trend direction indicator (Rising, Falling, or Stable)' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Weekly trend scores (0-100) for 4 weeks',
      'Trend direction indicator - Rising 📈, Falling 📉, or Stable ➡️',
      'Visual progress bars showing trend strength',
      'Color-coded scores (Green: 70+ High, Yellow: 50-69 Moderate, Red: Below 50 Low)',
      'Score guide explaining trend levels',
    ],
    title: 'Trend Tracker',
    keyword: 'Keyword',
    keywordPlaceholder: 'Enter keyword or topic to track',
    keywordHint: 'Track trending topics, hashtags, or keywords in your niche',
    track: 'Track',
    enterKeywordAlert: 'Please enter a keyword',
    trendAnalysis: (kw: string) => `Trend Analysis: "${kw}"`,
    trendLabel: 'Trend:',
    rising: '📈 Rising',
    falling: '📉 Falling',
    stable: '➡️ Stable',
    scoreGuide: 'Score Guide:',
    scoreGuideBody: '70+ = High trend, 50-69 = Moderate trend, Below 50 = Low trend',
    emptyState:
      'Enter a keyword to track its trending status over time. The tool shows weekly trend scores to help you identify rising or falling topics in your niche.',
  },
  es: {
    toolName: 'Rastreador de tendencias',
    toolDescription:
      'Rastrea temas y palabras clave en tendencia a lo largo del tiempo. Monitorea puntuaciones de tendencia, identifica tendencias en alza y ofrece información sobre lo que gana popularidad en tu nicho o industria.',
    howToUse: [
      { label: 'Ingresa tema:', text: 'Escribe un tema o palabra clave para rastrear' },
      { label: 'Haz clic en "Rastrear":', text: 'Ve datos y puntuaciones de tendencia a lo largo del tiempo' },
      { label: 'Revisa tendencias:', text: 'Ve puntuaciones semanales y visualizaciones' },
      { label: 'Analiza patrones:', text: 'Identifica tendencias en alza o en baja' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Rastrea el estado de tendencia de palabras clave, temas o hashtags a lo largo del tiempo. Muestra puntuaciones semanales para ayudar a identificar temas en alza o en baja en tu nicho.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Ingresa palabra clave:', text: 'Escribe una palabra clave, tema o hashtag para rastrear (ej. "marketing de contenidos")' },
      { label: 'Haz clic en "Rastrear"', text: 'para analizar la tendencia' },
      { label: 'Revisa resultados:', text: 'Ve puntuaciones semanales (S1, S2, S3, S4) con barras de progreso e indicador de dirección (En alza, En baja o Estable)' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Puntuaciones semanales (0-100) por 4 semanas',
      'Indicador de dirección - En alza 📈, En baja 📉 o Estable ➡️',
      'Barras de progreso que muestran la fuerza de la tendencia',
      'Puntuaciones con colores (Verde: 70+ Alta, Amarillo: 50-69 Moderada, Rojo: Menos de 50 Baja)',
      'Guía de puntuación que explica los niveles de tendencia',
    ],
    title: 'Rastreador de tendencias',
    keyword: 'Palabra clave',
    keywordPlaceholder: 'Ingresa palabra clave o tema para rastrear',
    keywordHint: 'Rastrea temas, hashtags o palabras clave en tendencia en tu nicho',
    track: 'Rastrear',
    enterKeywordAlert: 'Por favor ingresa una palabra clave',
    trendAnalysis: (kw: string) => `Análisis de tendencia: "${kw}"`,
    trendLabel: 'Tendencia:',
    rising: '📈 En alza',
    falling: '📉 En baja',
    stable: '➡️ Estable',
    scoreGuide: 'Guía de puntuación:',
    scoreGuideBody: '70+ = Tendencia alta, 50-69 = Tendencia moderada, Menos de 50 = Tendencia baja',
    emptyState:
      'Ingresa una palabra clave para rastrear su estado de tendencia a lo largo del tiempo. La herramienta muestra puntuaciones semanales para ayudarte a identificar temas en alza o en baja en tu nicho.',
  },
}

function TrendTrackerContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [keyword, setKeyword] = useState('')
  const [trends, setTrends] = useState<TrendData[]>([])
  const [isTracking, setIsTracking] = useState(false)

  const track = () => {
    const k = keyword.trim()
    if (!k) {
      alert(c.enterKeywordAlert)
      return
    }

    setIsTracking(true)

    const mock: TrendData[] = [
      { week: 'W1', score: rand(20, 60) },
      { week: 'W2', score: rand(30, 70) },
      { week: 'W3', score: rand(40, 80) },
      { week: 'W4', score: rand(50, 90) },
    ]

    setTrends(mock)
  }

  const getTrendDirection = (trends: TrendData[]) => {
    if (trends.length < 2) return 'stable'
    const first = trends[0].score
    const last = trends[trends.length - 1].score
    if (last > first + 10) return 'rising'
    if (last < first - 10) return 'falling'
    return 'stable'
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
    if (score >= 50) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30'
    return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
  }

  const trendDirection = trends.length > 0 ? getTrendDirection(trends) : null

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
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{c.keyword}</label>
            <input
              id="kw"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={c.keywordPlaceholder}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              onKeyPress={(e) => {
                if (e.key === 'Enter') track()
              }}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{c.keywordHint}</p>
          </div>

          <button
            onClick={track}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {c.track}
          </button>
        </div>

        {trends.length > 0 && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{c.trendAnalysis(keyword)}</h2>
              {trendDirection && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{c.trendLabel}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      trendDirection === 'rising'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : trendDirection === 'falling'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {trendDirection === 'rising' && c.rising}
                    {trendDirection === 'falling' && c.falling}
                    {trendDirection === 'stable' && c.stable}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {trends.map((trend, index) => (
                <div
                  key={index}
                  className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="font-semibold text-gray-900 dark:text-white w-12">{trend.week}</div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              trend.score >= 70
                                ? 'bg-green-500'
                                : trend.score >= 50
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${trend.score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-bold ${getScoreColor(trend.score)}`}>
                      {trend.score}/100
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>{c.scoreGuide}</strong> {c.scoreGuideBody}
              </p>
            </div>
          </div>
        )}

        {!isTracking && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">{c.emptyState}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TrendTracker() {
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
      toolSlug="trend-tracker"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <TrendTrackerContent />
    </ToolAccessGate>
  )
}
