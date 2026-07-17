'use client'

import { useState, useEffect } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { getUserPreferences, getPersonalizedSuggestions, trackUsage } from '@/lib/personalization'
import { Sparkles, TrendingUp, Clock, Target } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    toolName: 'AI Personalization Insights',
    toolDescription:
      'AI-powered personalization that learns from your usage patterns to provide personalized recommendations. All learning happens locally - no external APIs.',
    howToUse: [
      { label: 'View insights:', text: 'See personalized recommendations based on your usage' },
      { label: 'Update preferences:', text: 'Adjust your preferred tone, platform, and niche' },
      { label: 'See recommendations:', text: 'Get AI suggestions for best posting times and content style' },
      { label: 'Automatic learning:', text: 'System learns from your tool usage automatically' },
    ],
    docTitle: 'AI Personalization Insights',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Learns from your usage patterns to provide personalized recommendations. No external APIs - all learning happens locally using your data.',
    howItWorks: 'How It Works',
    howItWorksBody:
      'The system analyzes your tool usage, preferred tones, platforms, and posting times to suggest what works best for you.',
    pageTitle: 'Your Personalized Insights',
    aiRecommendations: 'AI Recommendations',
    preferredTone: 'Preferred Tone',
    preferredPlatform: 'Preferred Platform',
    preferredNiche: 'Preferred Niche',
    bestPostingTimes: 'Best Posting Times',
    basedOnUsage: 'Based on your usage:',
    mostUsed: 'Most used:',
    yourNiche: 'Your niche:',
    basedOnActivity: 'Based on your activity patterns',
    howItWorksFooter:
      'This system learns from your tool usage patterns stored locally in your browser. No external APIs are used - all personalization happens on your device using your data.',
    howItWorksLabel: 'How it works:',
    toneOptions: {
      funny: 'Funny / Witty',
      inspirational: 'Inspirational',
      professional: 'Professional',
      casual: 'Casual',
      informative: 'Informative',
    } as Record<string, string>,
    platformOptions: {
      instagram: 'Instagram',
      tiktok: 'TikTok',
      linkedin: 'LinkedIn',
      twitter: 'Twitter / X',
      facebook: 'Facebook',
    } as Record<string, string>,
    nicheOptions: {
      general: 'General',
      fitness: 'Fitness',
      food: 'Food',
      travel: 'Travel',
      fashion: 'Fashion',
      tech: 'Tech',
      beauty: 'Beauty',
    } as Record<string, string>,
  },
  es: {
    toolName: 'Información de personalización con IA',
    toolDescription:
      'Personalización con IA que aprende de tus patrones de uso para ofrecer recomendaciones personalizadas. Todo el aprendizaje ocurre localmente, sin APIs externas.',
    howToUse: [
      { label: 'Ver información:', text: 'Consulta recomendaciones personalizadas según tu uso' },
      { label: 'Actualizar preferencias:', text: 'Ajusta tu tono, plataforma y nicho preferidos' },
      { label: 'Ver recomendaciones:', text: 'Obtén sugerencias de IA sobre mejores horarios y estilo de contenido' },
      { label: 'Aprendizaje automático:', text: 'El sistema aprende automáticamente de tu uso de herramientas' },
    ],
    docTitle: 'Información de personalización con IA',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Aprende de tus patrones de uso para ofrecer recomendaciones personalizadas. Sin APIs externas: todo el aprendizaje ocurre localmente con tus datos.',
    howItWorks: 'Cómo funciona',
    howItWorksBody:
      'El sistema analiza tu uso de herramientas, tonos preferidos, plataformas y horarios de publicación para sugerir lo que mejor funciona para ti.',
    pageTitle: 'Tu información personalizada',
    aiRecommendations: 'Recomendaciones de IA',
    preferredTone: 'Tono preferido',
    preferredPlatform: 'Plataforma preferida',
    preferredNiche: 'Nicho preferido',
    bestPostingTimes: 'Mejores horarios de publicación',
    basedOnUsage: 'Según tu uso:',
    mostUsed: 'Más usada:',
    yourNiche: 'Tu nicho:',
    basedOnActivity: 'Según tus patrones de actividad',
    howItWorksFooter:
      'Este sistema aprende de tus patrones de uso almacenados localmente en tu navegador. No se usan APIs externas: toda la personalización ocurre en tu dispositivo con tus datos.',
    howItWorksLabel: 'Cómo funciona:',
    toneOptions: {
      funny: 'Divertido / Ingenioso',
      inspirational: 'Inspirador',
      professional: 'Profesional',
      casual: 'Informal',
      informative: 'Informativo',
    } as Record<string, string>,
    platformOptions: {
      instagram: 'Instagram',
      tiktok: 'TikTok',
      linkedin: 'LinkedIn',
      twitter: 'Twitter / X',
      facebook: 'Facebook',
    } as Record<string, string>,
    nicheOptions: {
      general: 'General',
      fitness: 'Fitness',
      food: 'Comida',
      travel: 'Viajes',
      fashion: 'Moda',
      tech: 'Tecnología',
      beauty: 'Belleza',
    } as Record<string, string>,
  },
}

function PersonalizationInsightsContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [userId] = useState('user_' + (typeof window !== 'undefined' ? localStorage.getItem('user_id') || 'default' : 'default'))
  const [preferences, setPreferences] = useState(getUserPreferences(userId))
  const [suggestions, setSuggestions] = useState(getPersonalizedSuggestions(userId))

  useEffect(() => {
    setSuggestions(getPersonalizedSuggestions(userId))
  }, [userId])

  const updatePreference = (key: string, value: string) => {
    const newPrefs = { ...preferences, [key]: value }
    setPreferences(newPrefs)
    localStorage.setItem(`user_prefs_${userId}`, JSON.stringify(newPrefs))
    setSuggestions(getPersonalizedSuggestions(userId))
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.docTitle}</h2>
          <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.whatItDoes}</h3>
              <p>{c.whatItDoesBody}</p>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.howItWorks}</h3>
              <p>{c.howItWorksBody}</p>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">{c.pageTitle}</h1>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2">{c.aiRecommendations}</h2>
              <p className="text-mono-700 dark:text-mono-300">{suggestions.message}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-accent-600" />
              <h3 className="font-bold text-mono-950 dark:text-mono-50">{c.preferredTone}</h3>
            </div>
            <select
              value={preferences.preferredTone}
              onChange={(e) => updatePreference('preferredTone', e.target.value)}
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
            >
              <option value="funny">{c.toneOptions.funny}</option>
              <option value="inspirational">{c.toneOptions.inspirational}</option>
              <option value="professional">{c.toneOptions.professional}</option>
              <option value="casual">{c.toneOptions.casual}</option>
              <option value="informative">{c.toneOptions.informative}</option>
            </select>
            <p className="text-xs text-mono-500 dark:text-mono-500 mt-2">
              {c.basedOnUsage} {c.toneOptions[preferences.preferredTone] ?? preferences.preferredTone}
            </p>
          </div>

          <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-accent-600" />
              <h3 className="font-bold text-mono-950 dark:text-mono-50">{c.preferredPlatform}</h3>
            </div>
            <select
              value={preferences.preferredPlatform}
              onChange={(e) => updatePreference('preferredPlatform', e.target.value)}
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
            >
              <option value="instagram">{c.platformOptions.instagram}</option>
              <option value="tiktok">{c.platformOptions.tiktok}</option>
              <option value="linkedin">{c.platformOptions.linkedin}</option>
              <option value="twitter">{c.platformOptions.twitter}</option>
              <option value="facebook">{c.platformOptions.facebook}</option>
            </select>
            <p className="text-xs text-mono-500 dark:text-mono-500 mt-2">
              {c.mostUsed} {c.platformOptions[preferences.preferredPlatform] ?? preferences.preferredPlatform}
            </p>
          </div>

          <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-accent-600" />
              <h3 className="font-bold text-mono-950 dark:text-mono-50">{c.preferredNiche}</h3>
            </div>
            <select
              value={preferences.preferredNiche}
              onChange={(e) => updatePreference('preferredNiche', e.target.value)}
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
            >
              <option value="general">{c.nicheOptions.general}</option>
              <option value="fitness">{c.nicheOptions.fitness}</option>
              <option value="food">{c.nicheOptions.food}</option>
              <option value="travel">{c.nicheOptions.travel}</option>
              <option value="fashion">{c.nicheOptions.fashion}</option>
              <option value="tech">{c.nicheOptions.tech}</option>
              <option value="beauty">{c.nicheOptions.beauty}</option>
            </select>
            <p className="text-xs text-mono-500 dark:text-mono-500 mt-2">
              {c.yourNiche} {c.nicheOptions[preferences.preferredNiche] ?? preferences.preferredNiche}
            </p>
          </div>

          <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-accent-600" />
              <h3 className="font-bold text-mono-950 dark:text-mono-50">{c.bestPostingTimes}</h3>
            </div>
            <div className="space-y-2">
              {preferences.bestPostingTimes.map((time, idx) => (
                <div key={idx} className="text-sm text-mono-700 dark:text-mono-300">
                  {idx + 1}. {time}
                </div>
              ))}
            </div>
            <p className="text-xs text-mono-500 dark:text-mono-500 mt-2">{c.basedOnActivity}</p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>{c.howItWorksLabel}</strong> {c.howItWorksFooter}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PersonalizationInsights() {
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
      toolSlug="personalization-insights"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <PersonalizationInsightsContent />
    </ToolAccessGate>
  )
}
