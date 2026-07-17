'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { Info, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface ComparisonData {
  competitor: {
    posts: number
    followers: number
    engagement: number
  }
  yours: {
    posts: number
    followers: number
    engagement: number
  }
}

type Copy = {
  toolName: string
  toolDescription: string
  howToUse: { label: string; text: string }[]
  howToUseTitle: string
  whatItDoes: string
  whatItDoesBody: string
  howToUseInner: string
  howToUseSteps: { label: string; text: string }[]
  expectedOutcome: string
  expectedOutcomes: string[]
  apiSetupTitle: string
  apiSetupBody1: string
  apiSetupBody2: string
  setUpIntegrations: string
  title: string
  competitorHandle: string
  competitorPlaceholder: string
  yourHandle: string
  yourPlaceholder: string
  compare: string
  enterBothAlert: string
  comparisonResults: string
  posts: string
  followers: string
  engagementRate: string
  vs: string
  competitorMorePosts: string
  youMorePosts: string
  competitorMoreFollowers: string
  youMoreFollowers: string
  competitorHigherEngagement: string
  youHigherEngagement: string
  noteLabel: string
  noteBody: string
  connectApisLink: string
}

const copy: Record<'en' | 'es', Copy> = {
  en: {
    toolName: 'Competitor Analyzer',
    toolDescription:
      'Compares your social media performance against competitors. Analyzes posts, followers, and engagement rates to identify strengths and areas for improvement.',
    howToUse: [
      { label: 'Enter competitor handle:', text: "Type the competitor's social media handle" },
      { label: 'Enter your handle:', text: 'Type your own social media handle' },
      { label: 'Click "Compare"', text: 'to generate a side-by-side comparison' },
      { label: 'Review metrics:', text: 'See posts count, followers, and engagement rate for both accounts' },
      { label: 'Identify gaps:', text: 'Use the comparison to understand where you can improve' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      "Compares your Instagram account with a competitor's account. Analyzes posts, followers, and engagement rate to help you understand how you stack up against competitors.",
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter competitor IG handle:', text: 'Type the competitor\'s Instagram username (e.g., "rivalbrand")' },
      { label: 'Enter your IG handle:', text: 'Type your Instagram username (e.g., "mybrand")' },
      { label: 'Click "Compare"', text: 'to see side-by-side comparison' },
      { label: 'Review results:', text: 'See comparison of posts, followers, and engagement rate with visual indicators showing who performs better' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Side-by-side comparison of posts count',
      'Follower count comparison',
      'Engagement rate comparison',
      'Visual indicators showing who performs better in each metric',
      'Clear winner indicators for each category',
    ],
    apiSetupTitle: '⚠️ External API Setup for Real Data',
    apiSetupBody1:
      'This tool works immediately with demo data, but requires external API integrations for real competitor analysis. You can use it right now to see how it works, but to get actual competitor data, you must connect your social media platform APIs (Instagram, Twitter, etc.) in the Integrations Hub.',
    apiSetupBody2:
      'Without API setup: Shows demo data (random numbers for comparison). With API setup: Shows real competitor metrics and analysis. You pay API providers directly - ToolMarket365 never charges for API usage.',
    setUpIntegrations: 'Set Up Integrations Now',
    title: 'Competitor Analyzer',
    competitorHandle: 'Competitor IG handle',
    competitorPlaceholder: 'rivalbrand',
    yourHandle: 'Your IG handle',
    yourPlaceholder: 'mybrand',
    compare: 'Compare',
    enterBothAlert: 'Please enter both handles',
    comparisonResults: 'Comparison Results',
    posts: 'Posts',
    followers: 'Followers',
    engagementRate: 'Engagement Rate',
    vs: 'vs',
    competitorMorePosts: 'Competitor has more posts',
    youMorePosts: 'You have more posts',
    competitorMoreFollowers: 'Competitor has more followers',
    youMoreFollowers: 'You have more followers',
    competitorHigherEngagement: 'Competitor has higher engagement',
    youHigherEngagement: 'You have higher engagement',
    noteLabel: 'Note:',
    noteBody: 'This tool currently shows demo data. To get real competitor analysis,',
    connectApisLink: 'connect your social media platform APIs in the Integrations Hub',
  },
  es: {
    toolName: 'Analizador de competidores',
    toolDescription:
      'Compara tu rendimiento en redes sociales con el de tus competidores. Analiza publicaciones, seguidores y tasas de engagement para identificar fortalezas y áreas de mejora.',
    howToUse: [
      { label: 'Ingresa el handle del competidor:', text: 'Escribe el handle de redes sociales del competidor' },
      { label: 'Ingresa tu handle:', text: 'Escribe tu propio handle de redes sociales' },
      { label: 'Haz clic en "Comparar"', text: 'para generar una comparación lado a lado' },
      { label: 'Revisa métricas:', text: 'Mira publicaciones, seguidores y tasa de engagement de ambas cuentas' },
      { label: 'Identifica brechas:', text: 'Usa la comparación para entender dónde puedes mejorar' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Compara tu cuenta de Instagram con la de un competidor. Analiza publicaciones, seguidores y tasa de engagement para ayudarte a entender cómo te comparas con la competencia.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Ingresa el handle IG del competidor:', text: 'Escribe el usuario de Instagram del competidor (ej. "rivalbrand")' },
      { label: 'Ingresa tu handle IG:', text: 'Escribe tu usuario de Instagram (ej. "mybrand")' },
      { label: 'Haz clic en "Comparar"', text: 'para ver la comparación lado a lado' },
      { label: 'Revisa resultados:', text: 'Mira la comparación de publicaciones, seguidores y engagement con indicadores visuales de quién rinde mejor' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Comparación lado a lado del número de publicaciones',
      'Comparación de seguidores',
      'Comparación de tasa de engagement',
      'Indicadores visuales de quién rinde mejor en cada métrica',
      'Indicadores claros de ganador en cada categoría',
    ],
    apiSetupTitle: '⚠️ Configuración de API externa para datos reales',
    apiSetupBody1:
      'Esta herramienta funciona de inmediato con datos de demostración, pero requiere integraciones de API externas para análisis real de competidores. Puedes usarla ahora para ver cómo funciona, pero para obtener datos reales debes conectar las APIs de tus plataformas sociales (Instagram, Twitter, etc.) en el Hub de Integraciones.',
    apiSetupBody2:
      'Sin configuración de API: muestra datos de demostración (números aleatorios para comparación). Con API configurada: muestra métricas y análisis reales del competidor. Pagas directamente a los proveedores de API — ToolMarket365 nunca cobra por el uso de APIs.',
    setUpIntegrations: 'Configurar integraciones ahora',
    title: 'Analizador de competidores',
    competitorHandle: 'Handle IG del competidor',
    competitorPlaceholder: 'rivalbrand',
    yourHandle: 'Tu handle IG',
    yourPlaceholder: 'mybrand',
    compare: 'Comparar',
    enterBothAlert: 'Por favor ingresa ambos handles',
    comparisonResults: 'Resultados de la comparación',
    posts: 'Publicaciones',
    followers: 'Seguidores',
    engagementRate: 'Tasa de engagement',
    vs: 'vs',
    competitorMorePosts: 'El competidor tiene más publicaciones',
    youMorePosts: 'Tú tienes más publicaciones',
    competitorMoreFollowers: 'El competidor tiene más seguidores',
    youMoreFollowers: 'Tú tienes más seguidores',
    competitorHigherEngagement: 'El competidor tiene mayor engagement',
    youHigherEngagement: 'Tú tienes mayor engagement',
    noteLabel: 'Nota:',
    noteBody: 'Esta herramienta muestra datos de demostración. Para análisis real de competidores,',
    connectApisLink: 'conecta las APIs de tus plataformas sociales en el Hub de Integraciones',
  },
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function CompetitorAnalyzerContent({ c }: { c: Copy }) {
  const [competitorHandle, setCompetitorHandle] = useState('')
  const [yourHandle, setYourHandle] = useState('')
  const [comparison, setComparison] = useState<ComparisonData | null>(null)

  const compare = () => {
    const h = competitorHandle.trim()
    const m = yourHandle.trim()

    if (!h || !m) {
      alert(c.enterBothAlert)
      return
    }

    const mock = {
      posts: rand(50, 200),
      followers: rand(1000, 20000),
      engagement: rand(1, 5),
    }

    const mine = {
      posts: rand(50, 200),
      followers: rand(1000, 20000),
      engagement: rand(1, 5),
    }

    setComparison({
      competitor: mock,
      yours: mine,
    })
  }

  const getWinner = (
    competitorValue: number,
    yourValue: number,
    higherIsBetter: boolean = true
  ) => {
    if (competitorValue === yourValue) return 'tie'
    const competitorWins = higherIsBetter
      ? competitorValue > yourValue
      : competitorValue < yourValue
    return competitorWins ? 'competitor' : 'you'
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

        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-700 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 dark:text-red-200 mb-2">
                {c.apiSetupTitle}
              </h3>
              <p className="text-sm text-red-800 dark:text-red-300 mb-3">
                <strong>{c.apiSetupBody1}</strong>
              </p>
              <p className="text-sm text-red-800 dark:text-red-300 mb-3">
                <strong>{c.apiSetupBody2}</strong>
              </p>
              <Link
                href="/integrations"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <span>{c.setUpIntegrations}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          {c.title}
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.competitorHandle}
            </label>
            <input
              id="h"
              type="text"
              value={competitorHandle}
              onChange={(e) => setCompetitorHandle(e.target.value)}
              placeholder={c.competitorPlaceholder}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.yourHandle}
            </label>
            <input
              id="me"
              type="text"
              value={yourHandle}
              onChange={(e) => setYourHandle(e.target.value)}
              placeholder={c.yourPlaceholder}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <button
            onClick={compare}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {c.compare}
          </button>
        </div>

        {comparison && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
              {c.comparisonResults}
            </h2>

            <div className="space-y-6">
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">{c.posts}</h3>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      @{competitorHandle}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {comparison.competitor.posts.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-2xl text-gray-400 dark:text-gray-600 mx-4">{c.vs}</div>
                  <div className="flex-1 text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      @{yourHandle}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {comparison.yours.posts.toLocaleString()}
                    </div>
                  </div>
                </div>
                {getWinner(
                  comparison.competitor.posts,
                  comparison.yours.posts,
                  true
                ) === 'competitor' && (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {c.competitorMorePosts}
                  </div>
                )}
                {getWinner(
                  comparison.competitor.posts,
                  comparison.yours.posts,
                  true
                ) === 'you' && (
                  <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                    {c.youMorePosts}
                  </div>
                )}
              </div>

              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">{c.followers}</h3>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      @{competitorHandle}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {comparison.competitor.followers.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-2xl text-gray-400 dark:text-gray-600 mx-4">{c.vs}</div>
                  <div className="flex-1 text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      @{yourHandle}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {comparison.yours.followers.toLocaleString()}
                    </div>
                  </div>
                </div>
                {getWinner(
                  comparison.competitor.followers,
                  comparison.yours.followers,
                  true
                ) === 'competitor' && (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {c.competitorMoreFollowers}
                  </div>
                )}
                {getWinner(
                  comparison.competitor.followers,
                  comparison.yours.followers,
                  true
                ) === 'you' && (
                  <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                    {c.youMoreFollowers}
                  </div>
                )}
              </div>

              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                  {c.engagementRate}
                </h3>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      @{competitorHandle}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {comparison.competitor.engagement.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-2xl text-gray-400 dark:text-gray-600 mx-4">{c.vs}</div>
                  <div className="flex-1 text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      @{yourHandle}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {comparison.yours.engagement.toFixed(1)}%
                    </div>
                  </div>
                </div>
                {getWinner(
                  comparison.competitor.engagement,
                  comparison.yours.engagement,
                  true
                ) === 'competitor' && (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {c.competitorHigherEngagement}
                  </div>
                )}
                {getWinner(
                  comparison.competitor.engagement,
                  comparison.yours.engagement,
                  true
                ) === 'you' && (
                  <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                    {c.youHigherEngagement}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>{c.noteLabel}</strong> {c.noteBody}{' '}
                <Link href="/integrations" className="underline font-semibold hover:text-blue-900 dark:hover:text-blue-100 ml-1">
                  {c.connectApisLink}
                </Link>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CompetitorAnalyzer() {
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
      toolSlug="competitor-analyzer"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <CompetitorAnalyzerContent c={c} />
    </ToolAccessGate>
  )
}
