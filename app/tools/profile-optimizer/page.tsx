'use client'

import React, { useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface OptimizationResult {
  score: number
  maxScore: number
  tips: string[]
  hasKeywords: boolean
  hasEmojis: boolean
  lengthScore: number
  bioLength: number
}

const copy = {
  en: {
    toolName: 'Profile Optimizer',
    toolDescription:
      "Optimizes your social media profile bio by analyzing keywords, emojis, length, and structure. Provides a score and actionable tips to improve your bio's effectiveness.",
    howToUse: [
      { label: 'Enter your bio:', text: 'Paste your current social media bio' },
      { label: 'Click "Optimize":', text: 'Get an optimization score and detailed analysis' },
      { label: 'Review score:', text: 'See how well-optimized your bio is (out of 100)' },
      { label: 'Read tips:', text: 'Get specific suggestions for improving your bio' },
      { label: 'Apply changes:', text: 'Use the tips to update your bio for better performance' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      "Analyzes and optimizes your social media profile bio. Checks for keywords, emojis, length, and provides a score with actionable tips to improve your profile's discoverability and engagement.",
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter your bio:', text: 'Paste or type your current social media bio' },
      { label: 'Enter keywords (optional):', text: 'Add relevant keywords separated by commas that you want to include' },
      { label: 'Click "Optimize"', text: 'to analyze your bio' },
      { label: 'Review results:', text: 'See your optimization score (out of 3), check which elements are present (keywords, emojis), view length score, and read optimization tips' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Optimization score showing how well your bio is optimized',
      'Checklist showing which elements are present (keywords, emojis)',
      'Length analysis with recommendations',
      'Actionable tips to improve your bio',
      'Bio length indicator',
    ],
    title: 'Profile Optimizer',
    supportedPlatforms: 'Supported Platforms:',
    currentBio: 'Current bio',
    bioPlaceholder: 'Enter your current social media bio...',
    characters: 'characters',
    keywordsLabel: 'Keywords (comma-separated)',
    keywordsPlaceholder: 'e.g., content creator, marketing, design',
    keywordsHint: 'Enter keywords you want to include in your bio',
    optimize: 'Optimise',
    optimizationScore: 'Optimization Score',
    analysis: 'Analysis',
    bioLength: 'Bio length:',
    tooShort: ' (too short)',
    tooLong: ' (too long)',
    keywords: 'Keywords:',
    found: 'Found',
    notFound: 'Not found',
    emojis: 'Emojis:',
    present: 'Present',
    missing: 'Missing',
    tipsForImprovement: 'Tips for Improvement',
    excellent: '🎉 Excellent! Your bio is well-optimized!',
    tips: {
      addKeywords: 'Add relevant keywords to improve discoverability',
      useMoreChars: 'Use more characters (aim for 50-150 for optimal engagement)',
      shorten: 'Consider shortening to 150 characters or less',
      addEmojis: 'Add emojis to make your bio more engaging and eye-catching',
      enterBio: 'Enter your bio to get started',
    },
  },
  es: {
    toolName: 'Optimizador de perfil',
    toolDescription:
      'Optimiza la biografía de tu perfil en redes sociales analizando palabras clave, emojis, longitud y estructura. Ofrece una puntuación y consejos prácticos para mejorar la efectividad de tu bio.',
    howToUse: [
      { label: 'Ingresa tu bio:', text: 'Pega tu biografía actual de redes sociales' },
      { label: 'Haz clic en "Optimizar":', text: 'Obtén una puntuación de optimización y un análisis detallado' },
      { label: 'Revisa la puntuación:', text: 'Ve qué tan optimizada está tu bio (de 100)' },
      { label: 'Lee los consejos:', text: 'Obtén sugerencias específicas para mejorar tu bio' },
      { label: 'Aplica cambios:', text: 'Usa los consejos para actualizar tu bio y mejorar el rendimiento' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Analiza y optimiza la biografía de tu perfil en redes sociales. Verifica palabras clave, emojis, longitud y ofrece una puntuación con consejos prácticos para mejorar la visibilidad e interacción de tu perfil.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Ingresa tu bio:', text: 'Pega o escribe tu biografía actual de redes sociales' },
      { label: 'Ingresa palabras clave (opcional):', text: 'Añade palabras clave relevantes separadas por comas que quieras incluir' },
      { label: 'Haz clic en "Optimizar"', text: 'para analizar tu bio' },
      { label: 'Revisa resultados:', text: 'Ve tu puntuación de optimización (de 3), comprueba qué elementos están presentes (palabras clave, emojis), revisa la puntuación de longitud y lee los consejos' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Puntuación de optimización que muestra qué tan bien está optimizada tu bio',
      'Lista de verificación de elementos presentes (palabras clave, emojis)',
      'Análisis de longitud con recomendaciones',
      'Consejos prácticos para mejorar tu bio',
      'Indicador de longitud de la bio',
    ],
    title: 'Optimizador de perfil',
    supportedPlatforms: 'Plataformas compatibles:',
    currentBio: 'Bio actual',
    bioPlaceholder: 'Ingresa tu biografía actual de redes sociales...',
    characters: 'caracteres',
    keywordsLabel: 'Palabras clave (separadas por comas)',
    keywordsPlaceholder: 'ej., creador de contenido, marketing, diseño',
    keywordsHint: 'Ingresa palabras clave que quieras incluir en tu bio',
    optimize: 'Optimizar',
    optimizationScore: 'Puntuación de optimización',
    analysis: 'Análisis',
    bioLength: 'Longitud de la bio:',
    tooShort: ' (muy corta)',
    tooLong: ' (muy larga)',
    keywords: 'Palabras clave:',
    found: 'Encontradas',
    notFound: 'No encontradas',
    emojis: 'Emojis:',
    present: 'Presentes',
    missing: 'Ausentes',
    tipsForImprovement: 'Consejos para mejorar',
    excellent: '🎉 ¡Excelente! ¡Tu bio está bien optimizada!',
    tips: {
      addKeywords: 'Añade palabras clave relevantes para mejorar la visibilidad',
      useMoreChars: 'Usa más caracteres (apunta a 50-150 para una interacción óptima)',
      shorten: 'Considera acortar a 150 caracteres o menos',
      addEmojis: 'Añade emojis para hacer tu bio más atractiva y llamativa',
      enterBio: 'Ingresa tu bio para comenzar',
    },
  },
}

function ProfileOptimizerContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [bio, setBio] = useState('')
  const [keywords, setKeywords] = useState('')
  const [result, setResult] = useState<OptimizationResult | null>(null)

  const optimize = () => {
    const bioText = bio.trim()
    const keywordList = keywords
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)

    let lengthScore = 0
    if (bioText.length > 80) {
      lengthScore = 0
    } else if (bioText.length > 50) {
      lengthScore = 1
    } else {
      lengthScore = 2
    }

    const hasKeywords = keywordList.some((kw) =>
      bioText.toLowerCase().includes(kw.toLowerCase())
    )

    const hasEmojis =
      /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
        bioText
      ) || bioText.includes('🎯') || bioText.includes('✨')

    let score = 0
    if (bioText.length >= 50 && bioText.length <= 150) score += 1
    if (hasKeywords) score += 1
    if (hasEmojis) score += 1

    const tips: string[] = []
    if (!hasKeywords && keywordList.length > 0) {
      tips.push(c.tips.addKeywords)
    }
    if (bioText.length < 50) {
      tips.push(c.tips.useMoreChars)
    }
    if (bioText.length > 150) {
      tips.push(c.tips.shorten)
    }
    if (!hasEmojis) {
      tips.push(c.tips.addEmojis)
    }
    if (bioText.length === 0) {
      tips.push(c.tips.enterBio)
    }

    setResult({
      score,
      maxScore: 3,
      tips,
      hasKeywords,
      hasEmojis,
      lengthScore,
      bioLength: bioText.length,
    })
  }

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100
    if (percentage >= 80) return 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900/40'
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/40'
    return 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/40'
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

        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{c.title}</h1>

        <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-4 mb-6">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">{c.supportedPlatforms}</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">📸 Instagram</span>
            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">🎵 TikTok</span>
            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">💼 LinkedIn</span>
            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">🐦 Twitter/X</span>
            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">📘 Facebook</span>
            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">📺 YouTube</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{c.currentBio}</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
              rows={4}
              placeholder={c.bioPlaceholder}
              maxLength={200}
            />
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {bio.length} / 200 {c.characters}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{c.keywordsLabel}</label>
            <input
              id="kw"
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder={c.keywordsPlaceholder}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{c.keywordsHint}</p>
          </div>

          <button
            onClick={optimize}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {c.optimize}
          </button>
        </div>

        {result && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{c.optimizationScore}</h2>
              <div
                className={`inline-block px-4 py-2 rounded-lg font-bold text-lg ${getScoreColor(
                  result.score,
                  result.maxScore
                )}`}
              >
                {result.score} / {result.maxScore}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{c.analysis}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {result.bioLength >= 50 && result.bioLength <= 150 ? (
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">✗</span>
                  )}
                  <span className="text-gray-700 dark:text-gray-300">
                    {c.bioLength} {result.bioLength} {c.characters}
                    {result.bioLength < 50 && c.tooShort}
                    {result.bioLength > 150 && c.tooLong}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {result.hasKeywords ? (
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">✗</span>
                  )}
                  <span className="text-gray-700 dark:text-gray-300">
                    {c.keywords} {result.hasKeywords ? c.found : c.notFound}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {result.hasEmojis ? (
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">✗</span>
                  )}
                  <span className="text-gray-700 dark:text-gray-300">
                    {c.emojis} {result.hasEmojis ? c.present : c.missing}
                  </span>
                </div>
              </div>
            </div>

            {result.tips.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{c.tipsForImprovement}</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  {result.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.score === result.maxScore && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-green-800 dark:text-green-200 font-semibold">{c.excellent}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProfileOptimizer() {
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
      toolSlug="profile-optimizer"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <ProfileOptimizerContent />
    </ToolAccessGate>
  )
}
