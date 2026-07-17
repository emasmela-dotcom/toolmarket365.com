'use client'

import { useState } from 'react'
import { Calculator, DollarSign, Clock, TrendingUp, Users, Globe } from 'lucide-react';
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    toolName: 'Rate Calculator',
    toolDescription:
      'Calculate your content creation rates based on hours worked, hourly rate, follower count, platform, and engagement rate. Determine fair pricing for your services.',
    howToUse: [
      { label: 'Enter hours:', text: 'Input the number of hours spent on the project' },
      { label: 'Set rate per hour:', text: 'Enter your hourly rate' },
      { label: 'Add follower count (optional):', text: 'Include your follower count for platform-based calculations' },
      { label: 'Select platform:', text: 'Choose Instagram, Twitter, YouTube, or LinkedIn' },
      { label: 'Add engagement rate (optional):', text: 'Include your engagement rate percentage' },
      { label: 'View results:', text: 'See total rate, rate per post, and rate per thousand followers' },
    ],
    title: 'Rate Calculator',
    subtitle: 'Calculate pricing for sponsored posts and collaborations',
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Calculates pricing for sponsored posts, collaborations, and content creation work. Provides total rates based on hours and hourly rate, plus platform-specific recommendations based on follower count and engagement.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter basic info:', text: 'Hours (time spent on project) and Rate per Hour (your hourly rate)' },
      { label: 'Optional advanced info:', text: 'Followers (your follower count), Platform (Instagram, Twitter, YouTube, LinkedIn, TikTok), Engagement Rate %' },
      { label: 'Click "Calculate"', text: 'to see results' },
      { label: 'Review results:', text: 'Total rate (hours × rate/hour), Rate per 1K followers, Estimated per post (if engagement rate provided), Recommended rate for platform' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Total Rate - Calculated total (hours × rate per hour)',
      'Rate per 1K Followers - CPM-style calculation',
      'Estimated per Post - Based on engagement rate',
      'Recommended Rate - Platform-specific suggestion',
      'Currency formatting - All amounts in USD',
    ],
    calculateRate: 'Calculate Rate',
    hours: 'Hours',
    hoursPlaceholder: 'e.g., 5.5',
    ratePerHour: 'Rate per Hour',
    ratePerHourPlaceholder: 'e.g., 100.00',
    followersOptional: 'Followers (optional)',
    followersPlaceholder: 'e.g., 10000',
    platformOptional: 'Platform (optional)',
    engagementRateOptional: 'Engagement Rate % (optional)',
    engagementRatePlaceholder: 'e.g., 3.5',
    calculate: 'Calculate',
    totalRate: 'Total Rate',
    hoursTimesRate: (hours: string, rate: string) => `${hours} hours × ${rate}/hour`,
    platformInsights: 'Platform Insights',
    ratePer1kFollowers: 'Rate per 1K Followers',
    estimatedPerPost: 'Estimated per Post',
    recommendedRate: 'Recommended Rate',
    stripePrompt: 'Ready to accept payments?',
    stripeSetup: 'to start getting paid for your work.',
    readyToCalculate: 'Ready to Calculate?',
    readyHint: 'Enter hours and rate per hour to calculate your total rate',
  },
  es: {
    toolName: 'Calculadora de tarifas',
    toolDescription:
      'Calcula tus tarifas de creación de contenido según horas trabajadas, tarifa por hora, seguidores, plataforma y tasa de engagement. Determina precios justos para tus servicios.',
    howToUse: [
      { label: 'Ingresa horas:', text: 'Introduce el número de horas dedicadas al proyecto' },
      { label: 'Establece tarifa por hora:', text: 'Ingresa tu tarifa por hora' },
      { label: 'Agrega seguidores (opcional):', text: 'Incluye tu número de seguidores para cálculos por plataforma' },
      { label: 'Selecciona plataforma:', text: 'Elige Instagram, Twitter, YouTube o LinkedIn' },
      { label: 'Agrega tasa de engagement (opcional):', text: 'Incluye tu porcentaje de engagement' },
      { label: 'Ve resultados:', text: 'Consulta tarifa total, tarifa por publicación y tarifa por mil seguidores' },
    ],
    title: 'Calculadora de tarifas',
    subtitle: 'Calcula precios para publicaciones patrocinadas y colaboraciones',
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Calcula precios para publicaciones patrocinadas, colaboraciones y trabajo de creación de contenido. Proporciona tarifas totales según horas y tarifa por hora, más recomendaciones específicas por plataforma según seguidores y engagement.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Ingresa info básica:', text: 'Horas (tiempo en el proyecto) y Tarifa por hora (tu tarifa horaria)' },
      { label: 'Info avanzada opcional:', text: 'Seguidores (tu número de seguidores), Plataforma (Instagram, Twitter, YouTube, LinkedIn, TikTok), Tasa de engagement %' },
      { label: 'Haz clic en "Calcular"', text: 'para ver resultados' },
      { label: 'Revisa resultados:', text: 'Tarifa total (horas × tarifa/hora), Tarifa por 1K seguidores, Estimado por publicación (si hay engagement), Tarifa recomendada por plataforma' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Tarifa total - Total calculado (horas × tarifa por hora)',
      'Tarifa por 1K seguidores - Cálculo estilo CPM',
      'Estimado por publicación - Basado en tasa de engagement',
      'Tarifa recomendada - Sugerencia específica por plataforma',
      'Formato de moneda - Todos los montos en USD',
    ],
    calculateRate: 'Calcular tarifa',
    hours: 'Horas',
    hoursPlaceholder: 'ej., 5.5',
    ratePerHour: 'Tarifa por hora',
    ratePerHourPlaceholder: 'ej., 100.00',
    followersOptional: 'Seguidores (opcional)',
    followersPlaceholder: 'ej., 10000',
    platformOptional: 'Plataforma (opcional)',
    engagementRateOptional: 'Tasa de engagement % (opcional)',
    engagementRatePlaceholder: 'ej., 3.5',
    calculate: 'Calcular',
    totalRate: 'Tarifa total',
    hoursTimesRate: (hours: string, rate: string) => `${hours} horas × ${rate}/hora`,
    platformInsights: 'Información de plataforma',
    ratePer1kFollowers: 'Tarifa por 1K seguidores',
    estimatedPerPost: 'Estimado por publicación',
    recommendedRate: 'Tarifa recomendada',
    stripePrompt: '¿Listo para aceptar pagos?',
    stripeSetup: 'para empezar a cobrar por tu trabajo.',
    readyToCalculate: '¿Listo para calcular?',
    readyHint: 'Ingresa horas y tarifa por hora para calcular tu tarifa total',
  },
}

function RateCalculatorContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [hours, setHours] = useState('')
  const [ratePerHour, setRatePerHour] = useState('')
  const [followers, setFollowers] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [engagementRate, setEngagementRate] = useState('')
  const [result, setResult] = useState<{
    total: number
    perPost: number
    perThousand: number
    recommended: number
  } | null>(null)

  const platformRates: Record<string, { base: number; multiplier: number }> = {
    instagram: { base: 100, multiplier: 0.01 },
    twitter: { base: 50, multiplier: 0.005 },
    youtube: { base: 200, multiplier: 0.02 },
    linkedin: { base: 150, multiplier: 0.015 },
    tiktok: { base: 80, multiplier: 0.008 }
  }

  const calculate = () => {
    const h = parseFloat(hours) || 0
    const r = parseFloat(ratePerHour) || 0
    const f = parseFloat(followers) || 0
    const er = parseFloat(engagementRate) || 0

    if (h && r) {
      const total = h * r
      const perPost = f > 0 && er > 0 ? (f * er / 100) * platformRates[platform].multiplier : 0
      const perThousand = f > 0 ? (total / (f / 1000)) : 0
      const recommended = f > 0 
        ? platformRates[platform].base + (f * platformRates[platform].multiplier)
        : total

      setResult({
        total,
        perPost,
        perThousand,
        recommended
      })
    } else {
      setResult(null)
    }
  }

  const formattedRate = (parseFloat(ratePerHour) || 0).toLocaleString('en', { style: 'currency', currency: 'USD' })

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-accent-600 rounded-2xl">
              <Calculator className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-3">{c.title}</h1>
          <p className="text-xl text-mono-600 dark:text-mono-400">{c.subtitle}</p>
        </div>

        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-8 border border-mono-200 dark:border-mono-700">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.howToUseTitle}</h2>
          <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.whatItDoes}</h3>
              <p>{c.whatItDoesBody}</p>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.howToUseInner}</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                {c.howToUseSteps.map((step, i) => (
                  <li key={i}><strong>{step.label}</strong> {step.text}</li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.expectedOutcome}</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {c.expectedOutcomes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
              <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">{c.calculateRate}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2 flex items-center gap-2">
                    <Clock size={16} />
                    {c.hours}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder={c.hoursPlaceholder}
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2 flex items-center gap-2">
                    <DollarSign size={16} />
                    {c.ratePerHour}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={ratePerHour}
                    onChange={(e) => setRatePerHour(e.target.value)}
                    placeholder={c.ratePerHourPlaceholder}
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2 flex items-center gap-2">
                    <Users size={16} />
                    {c.followersOptional}
                  </label>
                  <input
                    type="number"
                    value={followers}
                    onChange={(e) => setFollowers(e.target.value)}
                    placeholder={c.followersPlaceholder}
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    {c.platformOptional}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'instagram', icon: Globe, name: 'Instagram' },
                      { id: 'twitter', icon: Globe, name: 'Twitter' },
                      { id: 'youtube', icon: Globe, name: 'YouTube' },
                      { id: 'linkedin', icon: Globe, name: 'LinkedIn' },
                    ].map((p) => {
                      const Icon = p.icon
                      return (
                        <button
                          key={p.id}
                          onClick={() => setPlatform(p.id)}
                          className={`px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                            platform === p.id
                              ? 'bg-accent-600 text-white shadow-lg'
                              : 'bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 hover:bg-mono-200 dark:hover:bg-mono-700'
                          }`}
                        >
                          <Icon size={18} />
                          {p.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2 flex items-center gap-2">
                    <TrendingUp size={16} />
                    {c.engagementRateOptional}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={engagementRate}
                    onChange={(e) => setEngagementRate(e.target.value)}
                    placeholder={c.engagementRatePlaceholder}
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <button
                  onClick={calculate}
                  disabled={!hours || !ratePerHour}
                  className="w-full px-6 py-4 bg-accent-600 text-white rounded-xl font-bold text-lg hover:bg-accent-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Calculator size={24} />
                  {c.calculate}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {result ? (
              <>
                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.totalRate}</h2>
                  <div className="text-center py-6">
                    <div className="text-6xl font-bold text-accent-600 mb-2">
                      {result.total.toLocaleString('en', { style: 'currency', currency: 'USD' })}
                    </div>
                    <p className="text-mono-600 dark:text-mono-400">
                      {c.hoursTimesRate(hours, formattedRate)}
                    </p>
                  </div>
                </div>

                {followers && (
                  <>
                    <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                      <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.platformInsights}</h2>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-mono-100 dark:bg-mono-800 rounded-lg">
                          <span className="text-mono-700 dark:text-mono-300 font-medium">{c.ratePer1kFollowers}</span>
                          <span className="text-xl font-bold text-mono-950 dark:text-mono-50">
                            {result.perThousand.toLocaleString('en', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        {engagementRate && (
                          <div className="flex justify-between items-center p-3 bg-mono-100 dark:bg-mono-800 rounded-lg">
                            <span className="text-mono-700 dark:text-mono-300 font-medium">{c.estimatedPerPost}</span>
                            <span className="text-xl font-bold text-mono-950 dark:text-mono-50">
                              {result.perPost.toLocaleString('en', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center p-3 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                          <span className="text-mono-700 dark:text-mono-300 font-medium">{c.recommendedRate}</span>
                          <span className="text-xl font-bold text-accent-700 dark:text-accent-400">
                            {result.recommended.toLocaleString('en', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
                  <p className="text-sm text-blue-900 dark:text-blue-200 text-center">
                    <strong>{c.stripePrompt}</strong> Set up{' '}
                    <a 
                      href="https://stripe.com/payments" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-700 dark:text-blue-300 underline hover:text-blue-800 dark:hover:text-blue-200 font-semibold"
                    >
                      Stripe
                    </a>
                    {' '}{c.stripeSetup}
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-12 text-center h-full flex flex-col justify-center border border-mono-200 dark:border-mono-700">
                <Calculator className="mx-auto text-mono-300 dark:text-mono-700 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-mono-700 dark:text-mono-300 mb-3">{c.readyToCalculate}</h3>
                <p className="text-mono-500 dark:text-mono-400">
                  {c.readyHint}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RateCalculator() {
  const { language } = useLanguage()
  const c = copy[language]

  const howToUse = (
    <ol className="list-decimal list-inside space-y-1 ml-2">
      {c.howToUse.map((step, i) => (
        <li key={i}><strong>{step.label}</strong> {step.text}</li>
      ))}
    </ol>
  )

  return (
    <ToolAccessGate
      toolSlug="rate-calculator"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <RateCalculatorContent />
    </ToolAccessGate>
  )
}
