'use client'

import { useState, useEffect } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { getUserPreferences, getPersonalizedSuggestions, trackUsage } from '@/lib/personalization'
import { Sparkles, TrendingUp, Clock, Target } from 'lucide-react'

function PersonalizationInsightsContent() {
  const [userId] = useState('user_' + (typeof window !== 'undefined' ? localStorage.getItem('user_id') || 'default' : 'default'))
  const [preferences, setPreferences] = useState(getUserPreferences(userId))
  const [suggestions, setSuggestions] = useState(getPersonalizedSuggestions(userId))

  useEffect(() => {
    // Update suggestions when preferences change
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
        {/* Documentation */}
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">AI Personalization Insights</h2>
          <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">What It Does</h3>
              <p>Learns from your usage patterns to provide personalized recommendations. No external APIs - all learning happens locally using your data.</p>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">How It Works</h3>
              <p>The system analyzes your tool usage, preferred tones, platforms, and posting times to suggest what works best for you.</p>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">Your Personalized Insights</h1>

        {/* Personalized Suggestions */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2">AI Recommendations</h2>
              <p className="text-mono-700 dark:text-mono-300">{suggestions.message}</p>
            </div>
          </div>
        </div>

        {/* Preferences Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-accent-600" />
              <h3 className="font-bold text-mono-950 dark:text-mono-50">Preferred Tone</h3>
            </div>
            <select
              value={preferences.preferredTone}
              onChange={(e) => updatePreference('preferredTone', e.target.value)}
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
            >
              <option value="funny">Funny / Witty</option>
              <option value="inspirational">Inspirational</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="informative">Informative</option>
            </select>
            <p className="text-xs text-mono-500 dark:text-mono-500 mt-2">
              Based on your usage: {preferences.preferredTone}
            </p>
          </div>

          <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-accent-600" />
              <h3 className="font-bold text-mono-950 dark:text-mono-50">Preferred Platform</h3>
            </div>
            <select
              value={preferences.preferredPlatform}
              onChange={(e) => updatePreference('preferredPlatform', e.target.value)}
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter / X</option>
              <option value="facebook">Facebook</option>
            </select>
            <p className="text-xs text-mono-500 dark:text-mono-500 mt-2">
              Most used: {preferences.preferredPlatform}
            </p>
          </div>

          <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-accent-600" />
              <h3 className="font-bold text-mono-950 dark:text-mono-50">Preferred Niche</h3>
            </div>
            <select
              value={preferences.preferredNiche}
              onChange={(e) => updatePreference('preferredNiche', e.target.value)}
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
            >
              <option value="general">General</option>
              <option value="fitness">Fitness</option>
              <option value="food">Food</option>
              <option value="travel">Travel</option>
              <option value="fashion">Fashion</option>
              <option value="tech">Tech</option>
              <option value="beauty">Beauty</option>
            </select>
            <p className="text-xs text-mono-500 dark:text-mono-500 mt-2">
              Your niche: {preferences.preferredNiche}
            </p>
          </div>

          <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-accent-600" />
              <h3 className="font-bold text-mono-950 dark:text-mono-50">Best Posting Times</h3>
            </div>
            <div className="space-y-2">
              {preferences.bestPostingTimes.map((time, idx) => (
                <div key={idx} className="text-sm text-mono-700 dark:text-mono-300">
                  {idx + 1}. {time}
                </div>
              ))}
            </div>
            <p className="text-xs text-mono-500 dark:text-mono-500 mt-2">
              Based on your activity patterns
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>How it works:</strong> This system learns from your tool usage patterns stored locally in your browser. 
            No external APIs are used - all personalization happens on your device using your data.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PersonalizationInsights() {
  const toolDescription = "AI-powered personalization that learns from your usage patterns to provide personalized recommendations. All learning happens locally - no external APIs."
  const howToUse = (
    <div>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li><strong>View insights:</strong> See personalized recommendations based on your usage</li>
        <li><strong>Update preferences:</strong> Adjust your preferred tone, platform, and niche</li>
        <li><strong>See recommendations:</strong> Get AI suggestions for best posting times and content style</li>
        <li><strong>Automatic learning:</strong> System learns from your tool usage automatically</li>
      </ol>
    </div>
  )

  return (
    <ToolAccessGate
      toolSlug="personalization-insights"
      toolName="AI Personalization Insights"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <PersonalizationInsightsContent />
    </ToolAccessGate>
  )
}
