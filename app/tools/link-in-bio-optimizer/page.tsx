'use client'

import React, { useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    toolName: 'Link in Bio Optimizer',
    toolDescription:
      'Optimizes your social media bio for maximum impact. Analyzes your current bio and provides an optimized version with link-in-bio call-to-action, character count optimization, and improvement tips.',
    howToUse: [
      { label: 'Enter current bio:', text: 'Paste your existing social media bio' },
      { label: 'Click "Optimize":', text: 'Get an optimized version with improvements' },
      { label: 'Review tips:', text: 'See specific suggestions for improving your bio' },
      { label: 'Copy optimized bio:', text: 'Use the optimized version in your profile' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Analyzes and optimizes your social media bio (link in bio) to maximize engagement and conversions. Provides tips and suggestions to improve your bio\'s effectiveness.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter current bio:', text: 'Paste your current social media bio text' },
      { label: 'Click "Optimize"', text: 'to analyze your bio' },
      { label: 'Review tips:', text: 'See optimization suggestions (use full 150 chars, add CTA link, add hashtags, etc.)' },
      { label: 'Review optimized bio:', text: 'See suggested improved version with optimization tips applied' },
      { label: 'Copy optimized bio:', text: 'Click "Copy Optimized" to copy the improved version' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'List of optimization tips specific to your bio',
      'Optimized bio version with improvements',
      'Character count guidance (optimal: 150 chars)',
      'CTA link suggestions',
      'Hashtag recommendations',
      'Ready-to-copy optimized bio',
    ],
    title: 'Link in Bio Optimizer',
    currentBio: 'Current bio',
    bioPlaceholder: 'Enter your current Instagram or TikTok bio...',
    characters: (count: number) => `${count} / 150 characters`,
    optimize: 'Optimize',
    optimizedBio: 'Optimized Bio',
    copy: 'Copy',
    characterCount: (count: number) => `${count} characters`,
    tips: 'Tips:',
    bioWellOptimized: '✅ Your bio is already well-optimized!',
    howItWorks: 'How it works:',
    howItWorksIntro: 'Enter your current bio and click "Optimize" to get:',
    howItWorksItems: [
      'Optimized bio with link-in-bio call-to-action',
      'Tips for improving your bio',
      'Character count optimization',
      'Hashtag and link suggestions',
    ],
    enterBioAlert: 'Please enter your current bio',
    copiedAlert: 'Optimized bio copied to clipboard!',
    tipUseFullChars: 'Use full 150 chars',
    tipAddCtaLink: 'Add a CTA link',
    tipAddHashtags: 'Add 1-2 hashtags',
    tipShorten: 'Consider shortening to 150 chars',
    tipAddEmoji: 'Add an emoji to draw attention to link',
  },
  es: {
    toolName: 'Optimizador de link in bio',
    toolDescription:
      'Optimiza tu biografía de redes sociales para máximo impacto. Analiza tu bio actual y proporciona una versión optimizada con llamada a la acción link-in-bio, optimización de caracteres y consejos de mejora.',
    howToUse: [
      { label: 'Ingresa la bio actual:', text: 'Pega tu biografía existente de redes sociales' },
      { label: 'Haz clic en "Optimizar":', text: 'Obtén una versión optimizada con mejoras' },
      { label: 'Revisa consejos:', text: 'Ve sugerencias específicas para mejorar tu bio' },
      { label: 'Copia bio optimizada:', text: 'Usa la versión optimizada en tu perfil' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Analiza y optimiza tu biografía de redes sociales (link in bio) para maximizar engagement y conversiones. Proporciona consejos y sugerencias para mejorar la efectividad de tu bio.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Ingresa la bio actual:', text: 'Pega el texto de tu biografía actual de redes sociales' },
      { label: 'Haz clic en "Optimizar"', text: 'para analizar tu bio' },
      { label: 'Revisa consejos:', text: 'Ve sugerencias de optimización (usa los 150 caracteres, agrega enlace CTA, hashtags, etc.)' },
      { label: 'Revisa bio optimizada:', text: 'Ve la versión mejorada sugerida con consejos aplicados' },
      { label: 'Copia bio optimizada:', text: 'Haz clic en "Copiar" para copiar la versión mejorada' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Lista de consejos de optimización específicos para tu bio',
      'Versión optimizada de la bio con mejoras',
      'Guía de conteo de caracteres (óptimo: 150 caracteres)',
      'Sugerencias de enlace CTA',
      'Recomendaciones de hashtags',
      'Bio optimizada lista para copiar',
    ],
    title: 'Optimizador de link in bio',
    currentBio: 'Bio actual',
    bioPlaceholder: 'Ingresa tu bio actual de Instagram o TikTok...',
    characters: (count: number) => `${count} / 150 caracteres`,
    optimize: 'Optimizar',
    optimizedBio: 'Bio optimizada',
    copy: 'Copiar',
    characterCount: (count: number) => `${count} caracteres`,
    tips: 'Consejos:',
    bioWellOptimized: '✅ ¡Tu bio ya está bien optimizada!',
    howItWorks: 'Cómo funciona:',
    howItWorksIntro: 'Ingresa tu bio actual y haz clic en "Optimizar" para obtener:',
    howItWorksItems: [
      'Bio optimizada con llamada a la acción link-in-bio',
      'Consejos para mejorar tu bio',
      'Optimización de conteo de caracteres',
      'Sugerencias de hashtags y enlaces',
    ],
    enterBioAlert: 'Por favor ingresa tu bio actual',
    copiedAlert: '¡Bio optimizada copiada al portapapeles!',
    tipUseFullChars: 'Usa los 150 caracteres completos',
    tipAddCtaLink: 'Agrega un enlace CTA',
    tipAddHashtags: 'Agrega 1-2 hashtags',
    tipShorten: 'Considera acortar a 150 caracteres',
    tipAddEmoji: 'Agrega un emoji para llamar la atención al enlace',
  },
}

function LinkInBioOptimizerContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [bio, setBio] = useState('')
  const [optimized, setOptimized] = useState<string | null>(null)
  const [tips, setTips] = useState<string[]>([])

  const optimize = () => {
    const b = bio.trim()
    if (!b) {
      alert(c.enterBioAlert)
      return
    }

    const newTips: string[] = []

    if (b.length < 50) {
      newTips.push(c.tipUseFullChars)
    }
    if (!b.includes('http')) {
      newTips.push(c.tipAddCtaLink)
    }
    if (!/#\w+/.test(b)) {
      newTips.push(c.tipAddHashtags)
    }
    if (b.length > 150) {
      newTips.push(c.tipShorten)
    }
    if (!b.includes('👉') && !b.includes('➡️') && !b.includes('🔗')) {
      newTips.push(c.tipAddEmoji)
    }

    const suggest =
      b + (newTips.length > 0 && !b.includes('linkinbio') ? ' | ➡️ linkinbio' : '')

    setOptimized(suggest)
    setTips(newTips)
  }

  const copyOptimized = () => {
    if (optimized) {
      navigator.clipboard.writeText(optimized)
      alert(c.copiedAlert)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Documentation Section */}
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
              {c.currentBio}
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={c.bioPlaceholder}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
              rows={4}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {c.characters(bio.length)}
            </p>
          </div>

          <button
            onClick={optimize}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {c.optimize}
          </button>
        </div>

        {optimized && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {c.optimizedBio}
              </h2>
              <button
                onClick={copyOptimized}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
              >
                {c.copy}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700 font-sans mb-4">
              {optimized}
            </pre>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {c.characterCount(optimized.length)}
            </p>

            {tips.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">{c.tips}</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  {tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {tips.length === 0 && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">
                  {c.bioWellOptimized}
                </p>
              </div>
            )}
          </div>
        )}

        {!optimized && (
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

export default function LinkInBioOptimizer() {
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
      toolSlug="link-in-bio-optimizer"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <LinkInBioOptimizerContent />
    </ToolAccessGate>
  )
}
