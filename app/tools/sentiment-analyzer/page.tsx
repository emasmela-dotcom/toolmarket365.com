'use client'

import React, { useState } from 'react'

interface SentimentResult {
  sentiment: 'Positive' | 'Negative' | 'Neutral'
  score: number
  percentage: number
  positiveWords: string[]
  negativeWords: string[]
  totalWords: number
}

const positiveWords = [
  'good',
  'great',
  'love',
  'awesome',
  'amazing',
  'excellent',
  'fantastic',
  'wonderful',
  'perfect',
  'brilliant',
  'outstanding',
  'superb',
  'delighted',
  'pleased',
  'happy',
  'satisfied',
  'impressed',
  'thrilled',
  'best',
  'favorite',
]

const negativeWords = [
  'bad',
  'hate',
  'terrible',
  'awful',
  'sucks',
  'worst',
  'horrible',
  'disappointed',
  'disgusting',
  'poor',
  'unhappy',
  'angry',
  'frustrated',
  'annoyed',
  'dislike',
  'disappointing',
  'fail',
  'broken',
  'useless',
  'waste',
]

export default function SentimentAnalyzer() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<SentimentResult | null>(null)

  const analyze = () => {
    const txt = text.trim()
    if (!txt) {
      alert('Please enter some text to analyze')
      return
    }

    const words = txt
      .toLowerCase()
      .split(/\s+/)
      .map((w) => w.replace(/[^\w]/g, ''))
      .filter((w) => w.length > 0)

    let score = 0
    const foundPositive: string[] = []
    const foundNegative: string[] = []

    words.forEach((w) => {
      if (positiveWords.includes(w)) {
        score++
        if (!foundPositive.includes(w)) foundPositive.push(w)
      }
      if (negativeWords.includes(w)) {
        score--
        if (!foundNegative.includes(w)) foundNegative.push(w)
      }
    })

    const percentage = ((score / words.length) * 100).toFixed(1)
    const sentiment: 'Positive' | 'Negative' | 'Neutral' =
      score > 0 ? 'Positive' : score < 0 ? 'Negative' : 'Neutral'

    setResult({
      sentiment,
      score,
      percentage: parseFloat(percentage),
      positiveWords: foundPositive,
      negativeWords: foundNegative,
      totalWords: words.length,
    })
  }

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'Positive') return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
    if (sentiment === 'Negative') return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
    return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
  }

  const getScoreColor = (score: number) => {
    if (score > 0) return 'text-green-600'
    if (score < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Sentiment Analyzer
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Text to Analyze
            </label>
            <textarea
              id="t"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste comments, reviews, or any text to analyze sentiment..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
              rows={6}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {text.split(/\s+/).filter((w) => w.trim()).length} words
            </p>
          </div>

          <button
            onClick={analyze}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Analyze
          </button>
        </div>

        {result && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Sentiment Analysis Results
              </h2>
              <div className="flex items-center gap-4">
                <div
                  className={`px-6 py-3 rounded-lg font-bold text-lg ${getSentimentColor(
                    result.sentiment
                  )}`}
                >
                  {result.sentiment}
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                  Score: {result.score > 0 ? '+' : ''}
                  {result.score}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {Math.abs(result.percentage)}% of words contribute to {result.sentiment.toLowerCase()}{' '}
                sentiment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {result.positiveWords.length > 0 && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Positive Words Found ({result.positiveWords.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.positiveWords.map((word, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded text-sm"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.negativeWords.length > 0 && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    Negative Words Found ({result.negativeWords.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.negativeWords.map((word, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded text-sm"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Analysis:</strong> Analyzed {result.totalWords} words. Score calculated by
                counting positive words (+1) and negative words (-1). Higher scores indicate more
                positive sentiment.
              </p>
            </div>
          </div>
        )}

        {!result && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              How it works:
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Paste any text (comments, reviews, social media posts, etc.) and the analyzer will:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Identify positive and negative words</li>
              <li>Calculate a sentiment score</li>
              <li>Determine overall sentiment (Positive, Negative, or Neutral)</li>
              <li>Show which words contributed to the sentiment</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

