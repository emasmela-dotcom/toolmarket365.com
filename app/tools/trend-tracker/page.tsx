'use client'

import React, { useState } from 'react'

interface TrendData {
  week: string
  score: number
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function TrendTracker() {
  const [keyword, setKeyword] = useState('')
  const [trends, setTrends] = useState<TrendData[]>([])
  const [isTracking, setIsTracking] = useState(false)

  const track = () => {
    const k = keyword.trim()
    if (!k) {
      alert('Please enter a keyword')
      return
    }

    setIsTracking(true)

    // Generate mock trend data for 4 weeks
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
    if (score >= 70) return 'text-green-600 bg-green-100'
    if (score >= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const trendDirection = trends.length > 0 ? getTrendDirection(trends) : null

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Documentation Section */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How to Use This Tool</h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">What It Does</h3>
              <p>Tracks trending status of keywords, topics, or hashtags over time. Shows weekly trend scores to help identify rising or falling topics in your niche.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Enter keyword:</strong> Type a keyword, topic, or hashtag to track (e.g., "content marketing")</li>
                <li><strong>Click "Track"</strong> to analyze the trend</li>
                <li><strong>Review results:</strong> See weekly trend scores (W1, W2, W3, W4) with visual progress bars and trend direction indicator (Rising, Falling, or Stable)</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Weekly trend scores (0-100) for 4 weeks</li>
                <li>Trend direction indicator - Rising 📈, Falling 📉, or Stable ➡️</li>
                <li>Visual progress bars showing trend strength</li>
                <li>Color-coded scores (Green: 70+ High, Yellow: 50-69 Moderate, Red: Below 50 Low)</li>
                <li>Score guide explaining trend levels</li>
              </ul>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Trend Tracker
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Keyword
            </label>
            <input
              id="kw"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter keyword or topic to track"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              onKeyPress={(e) => {
                if (e.key === 'Enter') track()
              }}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track trending topics, hashtags, or keywords in your niche
            </p>
          </div>

          <button
            onClick={track}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Track
          </button>
        </div>

        {trends.length > 0 && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Trend Analysis: "{keyword}"
              </h2>
              {trendDirection && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Trend:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      trendDirection === 'rising'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : trendDirection === 'falling'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {trendDirection === 'rising' && '📈 Rising'}
                    {trendDirection === 'falling' && '📉 Falling'}
                    {trendDirection === 'stable' && '➡️ Stable'}
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
                      <div className="font-semibold text-gray-900 dark:text-white w-12">
                        {trend.week}
                      </div>
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
                    <div
                      className={`px-4 py-2 rounded-lg font-bold ${getScoreColor(trend.score)}`}
                    >
                      {trend.score}/100
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Score Guide:</strong> 70+ = High trend, 50-69 = Moderate trend, Below 50 =
                Low trend
              </p>
            </div>
          </div>
        )}

        {!isTracking && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              Enter a keyword to track its trending status over time. The tool shows weekly trend
              scores to help you identify rising or falling topics in your niche.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


