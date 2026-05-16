'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { Info, ArrowRight } from 'lucide-react';

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

function CompetitorAnalyzerContent() {
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
        {/* Documentation Section */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How to Use This Tool</h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">What It Does</h3>
              <p>Compares your Instagram account with a competitor's account. Analyzes posts, followers, and engagement rate to help you understand how you stack up against competitors.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Enter competitor IG handle:</strong> Type the competitor's Instagram username (e.g., "rivalbrand")</li>
                <li><strong>Enter your IG handle:</strong> Type your Instagram username (e.g., "mybrand")</li>
                <li><strong>Click "Compare"</strong> to see side-by-side comparison</li>
                <li><strong>Review results:</strong> See comparison of posts, followers, and engagement rate with visual indicators showing who performs better</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Side-by-side comparison of posts count</li>
                <li>Follower count comparison</li>
                <li>Engagement rate comparison</li>
                <li>Visual indicators showing who performs better in each metric</li>
                <li>Clear winner indicators for each category</li>
              </ul>
            </div>
          </div>
        </div>

        {/* API Setup Notice */}
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-700 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 dark:text-red-200 mb-2">
                ⚠️ External API Setup for Real Data
              </h3>
              <p className="text-sm text-red-800 dark:text-red-300 mb-3">
                <strong>This tool works immediately with demo data, but requires external API integrations for real competitor analysis.</strong> You can use it right now to see how it works, but to get actual competitor data, you must connect your social media platform APIs (Instagram, Twitter, etc.) in the Integrations Hub.
              </p>
              <p className="text-sm text-red-800 dark:text-red-300 mb-3">
                <strong>Without API setup:</strong> Shows demo data (random numbers for comparison). <strong>With API setup:</strong> Shows real competitor metrics and analysis. <strong>You pay API providers directly</strong> - ToolMarket365 never charges for API usage.
              </p>
              <Link
                href="/integrations"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <span>Set Up Integrations Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

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
                <strong>Note:</strong> This tool currently shows demo data. To get real competitor analysis, 
                <Link href="/integrations" className="underline font-semibold hover:text-blue-900 dark:hover:text-blue-100 ml-1">
                  connect your social media platform APIs in the Integrations Hub
                </Link>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CompetitorAnalyzer() {
  const toolDescription = "Compares your social media performance against competitors. Analyzes posts, followers, and engagement rates to identify strengths and areas for improvement."
  const howToUse = (
    <div>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li><strong>Enter competitor handle:</strong> Type the competitor's social media handle</li>
        <li><strong>Enter your handle:</strong> Type your own social media handle</li>
        <li><strong>Click "Compare"</strong> to generate a side-by-side comparison</li>
        <li><strong>Review metrics:</strong> See posts count, followers, and engagement rate for both accounts</li>
        <li><strong>Identify gaps:</strong> Use the comparison to understand where you can improve</li>
      </ol>
    </div>
  )

  return (
    <ToolAccessGate
      toolSlug="competitor-analyzer"
      toolName="Competitor Analyzer"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <CompetitorAnalyzerContent />
    </ToolAccessGate>
  )
}

