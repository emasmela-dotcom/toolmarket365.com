'use client'

import React, { useState } from 'react'

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

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function CompetitorAnalyzer() {
  const [competitorHandle, setCompetitorHandle] = useState('')
  const [yourHandle, setYourHandle] = useState('')
  const [comparison, setComparison] = useState<ComparisonData | null>(null)

  const compare = () => {
    const h = competitorHandle.trim()
    const m = yourHandle.trim()

    if (!h || !m) {
      alert('Please enter both handles')
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
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Competitor Analyzer
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Competitor IG handle
            </label>
            <input
              id="h"
              type="text"
              value={competitorHandle}
              onChange={(e) => setCompetitorHandle(e.target.value)}
              placeholder="rivalbrand"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Your IG handle
            </label>
            <input
              id="me"
              type="text"
              value={yourHandle}
              onChange={(e) => setYourHandle(e.target.value)}
              placeholder="mybrand"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <button
            onClick={compare}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Compare
          </button>
        </div>

        {comparison && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
              Comparison Results
            </h2>

            <div className="space-y-6">
              {/* Posts Comparison */}
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Posts</h3>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      @{competitorHandle}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {comparison.competitor.posts.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-2xl text-gray-400 dark:text-gray-600 mx-4">vs</div>
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
                    Competitor has more posts
                  </div>
                )}
                {getWinner(
                  comparison.competitor.posts,
                  comparison.yours.posts,
                  true
                ) === 'you' && (
                  <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                    You have more posts
                  </div>
                )}
              </div>

              {/* Followers Comparison */}
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Followers</h3>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      @{competitorHandle}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {comparison.competitor.followers.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-2xl text-gray-400 dark:text-gray-600 mx-4">vs</div>
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
                    Competitor has more followers
                  </div>
                )}
                {getWinner(
                  comparison.competitor.followers,
                  comparison.yours.followers,
                  true
                ) === 'you' && (
                  <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                    You have more followers
                  </div>
                )}
              </div>

              {/* Engagement Comparison */}
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                  Engagement Rate
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
                  <div className="text-2xl text-gray-400 dark:text-gray-600 mx-4">vs</div>
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
                    Competitor has higher engagement
                  </div>
                )}
                {getWinner(
                  comparison.competitor.engagement,
                  comparison.yours.engagement,
                  true
                ) === 'you' && (
                  <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                    You have higher engagement
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> This is a demo tool that generates sample data for
                comparison purposes. For real competitor analysis, you would need to connect to
                Instagram's API or use a social media analytics service.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

