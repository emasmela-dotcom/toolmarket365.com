'use client'

import React, { useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    toolName: 'Follower Growth Tracker',
    toolDescription:
      'Tracks your follower growth progress toward a 30-day goal. Calculates daily and weekly follower targets, growth rate, and provides visual progress indicators to help you stay on track.',
    howToUse: [
      { label: 'Enter current followers:', text: 'Input your current follower count' },
      { label: 'Enter goal:', text: 'Set your 30-day follower goal' },
      { label: 'Click "Track":', text: 'See how many followers you need and daily/weekly targets' },
      { label: 'Monitor progress:', text: 'Use the visual progress bar and growth rate to track your progress' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Calculates how many new followers you need to reach your 30-day goal. Provides daily and weekly targets, growth rate, and progress visualization to help you plan your follower growth strategy.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter current followers:', text: 'Type your current follower count' },
      { label: 'Enter 30-day goal:', text: 'Type your target follower count for the next 30 days' },
      { label: 'Click "Track"', text: 'to calculate your growth plan' },
      { label: 'Review results:', text: 'See total needed, daily/weekly targets, growth rate, and progress bar' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Total followers needed to reach your goal',
      'Daily follower target (how many new followers per day)',
      'Weekly follower target (how many new followers per week)',
      'Growth rate percentage (percentage increase needed)',
      'Progress bar showing current progress toward goal',
      'Percentage to goal calculation',
    ],
    title: 'Follower Growth Tracker',
    currentFollowersLabel: 'Current followers',
    currentFollowersPlaceholder: 'Enter your current follower count',
    goalLabel: '30-day goal',
    goalPlaceholder: 'Enter your 30-day follower goal',
    goalHint: 'Set a realistic goal for the next 30 days',
    track: 'Track',
    reset: 'Reset',
    growthPlan: 'Growth Plan',
    progressToGoal: 'Progress to Goal',
    currentSuffix: 'current',
    goalSuffix: 'goal',
    totalNeeded: 'Total Needed',
    followersIn30Days: 'followers in 30 days',
    growthRate: 'Growth Rate',
    increaseNeeded: 'increase needed',
    dailyTarget: 'Daily Target',
    newFollowersPerDay: 'new followers per day',
    weeklyTarget: 'Weekly Target',
    newFollowersPerWeek: 'new followers per week',
    summary: 'Summary:',
    summaryBody: (goal: string, daily: string, weekly: string) =>
      `To reach ${goal} followers in 30 days, you need to gain approximately ${daily} new followers per day or ${weekly} per week.`,
    howItWorks: 'How it works:',
    howItWorksIntro: 'Enter your current follower count and your 30-day goal. The tracker will calculate:',
    howItWorksItems: [
      'How many new followers you need',
      'Daily follower target',
      'Weekly follower target',
      'Growth rate percentage',
      'Progress visualization',
    ],
    alertInvalidNumbers: 'Please enter valid numbers for both fields',
    alertGoalMustBeGreater: 'Goal must be greater than current followers',
  },
  es: {
    toolName: 'Rastreador de crecimiento de seguidores',
    toolDescription:
      'Rastrea tu progreso de crecimiento de seguidores hacia una meta de 30 días. Calcula objetivos diarios y semanales, tasa de crecimiento e indicadores visuales de progreso para ayudarte a mantenerte en el camino.',
    howToUse: [
      { label: 'Ingresa seguidores actuales:', text: 'Introduce tu número actual de seguidores' },
      { label: 'Ingresa la meta:', text: 'Establece tu meta de seguidores para 30 días' },
      { label: 'Haz clic en "Rastrear":', text: 'Consulta cuántos seguidores necesitas y los objetivos diarios/semanales' },
      { label: 'Monitorea el progreso:', text: 'Usa la barra de progreso visual y la tasa de crecimiento para seguir tu avance' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Calcula cuántos seguidores nuevos necesitas para alcanzar tu meta de 30 días. Proporciona objetivos diarios y semanales, tasa de crecimiento y visualización de progreso para planificar tu estrategia de crecimiento.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Ingresa seguidores actuales:', text: 'Escribe tu número actual de seguidores' },
      { label: 'Ingresa meta de 30 días:', text: 'Escribe tu meta de seguidores para los próximos 30 días' },
      { label: 'Haz clic en "Rastrear"', text: 'para calcular tu plan de crecimiento' },
      { label: 'Revisa resultados:', text: 'Consulta total necesario, objetivos diarios/semanales, tasa de crecimiento y barra de progreso' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Total de seguidores necesarios para alcanzar tu meta',
      'Objetivo diario de seguidores (cuántos nuevos por día)',
      'Objetivo semanal de seguidores (cuántos nuevos por semana)',
      'Porcentaje de tasa de crecimiento (aumento necesario)',
      'Barra de progreso que muestra el avance hacia la meta',
      'Cálculo del porcentaje hacia la meta',
    ],
    title: 'Rastreador de crecimiento de seguidores',
    currentFollowersLabel: 'Seguidores actuales',
    currentFollowersPlaceholder: 'Ingresa tu número actual de seguidores',
    goalLabel: 'Meta de 30 días',
    goalPlaceholder: 'Ingresa tu meta de seguidores para 30 días',
    goalHint: 'Establece una meta realista para los próximos 30 días',
    track: 'Rastrear',
    reset: 'Reiniciar',
    growthPlan: 'Plan de crecimiento',
    progressToGoal: 'Progreso hacia la meta',
    currentSuffix: 'actual',
    goalSuffix: 'meta',
    totalNeeded: 'Total necesario',
    followersIn30Days: 'seguidores en 30 días',
    growthRate: 'Tasa de crecimiento',
    increaseNeeded: 'aumento necesario',
    dailyTarget: 'Objetivo diario',
    newFollowersPerDay: 'nuevos seguidores por día',
    weeklyTarget: 'Objetivo semanal',
    newFollowersPerWeek: 'nuevos seguidores por semana',
    summary: 'Resumen:',
    summaryBody: (goal: string, daily: string, weekly: string) =>
      `Para alcanzar ${goal} seguidores en 30 días, necesitas ganar aproximadamente ${daily} nuevos seguidores por día o ${weekly} por semana.`,
    howItWorks: 'Cómo funciona:',
    howItWorksIntro: 'Ingresa tu número actual de seguidores y tu meta de 30 días. El rastreador calculará:',
    howItWorksItems: [
      'Cuántos seguidores nuevos necesitas',
      'Objetivo diario de seguidores',
      'Objetivo semanal de seguidores',
      'Porcentaje de tasa de crecimiento',
      'Visualización de progreso',
    ],
    alertInvalidNumbers: 'Ingresa números válidos en ambos campos',
    alertGoalMustBeGreater: 'La meta debe ser mayor que los seguidores actuales',
  },
}

interface GrowthData {
  current: number
  goal: number
  needed: number
  daily: number
  weekly: number
  percentageToGoal: number
  growthRate: number
}

function FollowerGrowthTrackerContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [currentFollowers, setCurrentFollowers] = useState('')
  const [goalFollowers, setGoalFollowers] = useState('')
  const [growthData, setGrowthData] = useState<GrowthData | null>(null)

  const track = () => {
    const n = parseFloat(currentFollowers)
    const g = parseFloat(goalFollowers)

    if (!n || !g || n < 0 || g < 0) {
      alert(c.alertInvalidNumbers)
      return
    }

    if (g <= n) {
      alert(c.alertGoalMustBeGreater)
      return
    }

    const needed = g - n
    const daily = Math.ceil(needed / 30)
    const weekly = Math.ceil(needed / 4.3)
    const percentageToGoal = ((n / g) * 100).toFixed(1)
    const growthRate = ((needed / n) * 100).toFixed(1)

    setGrowthData({
      current: n,
      goal: g,
      needed,
      daily,
      weekly,
      percentageToGoal: parseFloat(percentageToGoal),
      growthRate: parseFloat(growthRate),
    })
  }

  const reset = () => {
    setCurrentFollowers('')
    setGoalFollowers('')
    setGrowthData(null)
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

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          {c.title}
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.currentFollowersLabel}
            </label>
            <input
              id="now"
              type="number"
              value={currentFollowers}
              onChange={(e) => setCurrentFollowers(e.target.value)}
              placeholder={c.currentFollowersPlaceholder}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.goalLabel}
            </label>
            <input
              id="goal"
              type="number"
              value={goalFollowers}
              onChange={(e) => setGoalFollowers(e.target.value)}
              placeholder={c.goalPlaceholder}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="0"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {c.goalHint}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={track}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              {c.track}
            </button>
            {growthData && (
              <button
                onClick={reset}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                {c.reset}
              </button>
            )}
          </div>
        </div>

        {growthData && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
              {c.growthPlan}
            </h2>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {c.progressToGoal}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {growthData.percentageToGoal}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${growthData.percentageToGoal}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span>{growthData.current.toLocaleString()} {c.currentSuffix}</span>
                <span>{growthData.goal.toLocaleString()} {c.goalSuffix}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {c.totalNeeded}
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  +{growthData.needed.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {c.followersIn30Days}
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {c.growthRate}
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  +{growthData.growthRate}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {c.increaseNeeded}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📅</span>
                  <div className="text-sm font-semibold text-green-800 dark:text-green-200">
                    {c.dailyTarget}
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  +{growthData.daily.toLocaleString()}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {c.newFollowersPerDay}
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📊</span>
                  <div className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                    {c.weeklyTarget}
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  +{growthData.weekly.toLocaleString()}
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  {c.newFollowersPerWeek}
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>{c.summary}</strong>{' '}
                {c.summaryBody(
                  growthData.goal.toLocaleString(),
                  growthData.daily.toLocaleString(),
                  growthData.weekly.toLocaleString()
                )}
              </p>
            </div>
          </div>
        )}

        {!growthData && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              {c.howItWorks}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {c.howItWorksIntro}
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {c.howItWorksItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default function FollowerGrowthTracker() {
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
      toolSlug="follower-growth-tracker"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <FollowerGrowthTrackerContent />
    </ToolAccessGate>
  )
}
