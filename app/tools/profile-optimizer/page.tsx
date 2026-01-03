'use client'

import React, { useState } from 'react'

interface OptimizationResult {
  score: number
  maxScore: number
  tips: string[]
  hasKeywords: boolean
  hasEmojis: boolean
  lengthScore: number
  bioLength: number
}

export default function ProfileOptimizer() {
  const [bio, setBio] = useState('')
  const [keywords, setKeywords] = useState('')
  const [result, setResult] = useState<OptimizationResult | null>(null)

  const optimize = () => {
    const bioText = bio.trim()
    const keywordList = keywords
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)

    // Calculate length score (inverted - shorter is better for this metric)
    let lengthScore = 0
    if (bioText.length > 80) {
      lengthScore = 0 // Too long
    } else if (bioText.length > 50) {
      lengthScore = 1 // Good length
    } else {
      lengthScore = 2 // Too short
    }

    // Check for keywords
    const hasKeywords = keywordList.some((kw) =>
      bioText.toLowerCase().includes(kw.toLowerCase())
    )

    // Check for emojis
    const hasEmojis =
      /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
        bioText
      ) || bioText.includes('🎯') || bioText.includes('✨')

    // Calculate total score
    let score = 0
    if (bioText.length >= 50 && bioText.length <= 150) score += 1
    if (hasKeywords) score += 1
    if (hasEmojis) score += 1

    const tips: string[] = []
    if (!hasKeywords && keywordList.length > 0) {
      tips.push('Add relevant keywords to improve discoverability')
    }
    if (bioText.length < 50) {
      tips.push('Use more characters (aim for 50-150 for optimal engagement)')
    }
    if (bioText.length > 150) {
      tips.push('Consider shortening to 150 characters or less')
    }
    if (!hasEmojis) {
      tips.push('Add emojis to make your bio more engaging and eye-catching')
    }
    if (bioText.length === 0) {
      tips.push('Enter your bio to get started')
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
    if (percentage >= 80) return 'text-green-600 bg-green-100'
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Profile Optimizer
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Current bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
              rows={4}
              placeholder="Enter your current social media bio..."
              maxLength={200}
            />
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {bio.length} / 200 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Keywords (comma-separated)
            </label>
            <input
              id="kw"
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="e.g., content creator, marketing, design"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter keywords you want to include in your bio
            </p>
          </div>

          <button
            onClick={optimize}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Optimise
          </button>
        </div>

        {result && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Optimization Score
              </h2>
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
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Analysis
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {result.bioLength >= 50 && result.bioLength <= 150 ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-600">✗</span>
                  )}
                  <span className="text-gray-700 dark:text-gray-300">
                    Bio length: {result.bioLength} characters
                    {result.bioLength < 50 && ' (too short)'}
                    {result.bioLength > 150 && ' (too long)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {result.hasKeywords ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-600">✗</span>
                  )}
                  <span className="text-gray-700 dark:text-gray-300">
                    Keywords: {result.hasKeywords ? 'Found' : 'Not found'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {result.hasEmojis ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-600">✗</span>
                  )}
                  <span className="text-gray-700 dark:text-gray-300">
                    Emojis: {result.hasEmojis ? 'Present' : 'Missing'}
                  </span>
                </div>
              </div>
            </div>

            {result.tips.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Tips for Improvement
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  {result.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.score === result.maxScore && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-green-800 dark:text-green-200 font-semibold">
                  🎉 Excellent! Your bio is well-optimized!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

