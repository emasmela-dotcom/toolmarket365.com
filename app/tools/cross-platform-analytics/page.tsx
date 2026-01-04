'use client'

import React, { useState } from 'react'

interface PlatformData {
  platform: string
  followers: number
  posts: number
  engagement: number
}

const platforms = ['Instagram', 'TikTok', 'Twitter', 'YouTube', 'LinkedIn']

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function CrossPlatformAnalytics() {
  const [data, setData] = useState<PlatformData[]>([])

  const loadMockData = () => {
    const mockData: PlatformData[] = platforms.map((p) => ({
      platform: p,
      followers: rand(1000, 50000),
      posts: rand(30, 200),
      engagement: parseFloat((rand(10, 100) / 10).toFixed(1)),
    }))

    setData(mockData)
  }

  const totals = data.reduce(
    (acc, item) => ({
      followers: acc.followers + item.followers,
      posts: acc.posts + item.posts,
      engagement: acc.engagement + item.engagement,
    }),
    { followers: 0, posts: 0, engagement: 0 }
  )

  const averages = data.length > 0
    ? {
        followers: Math.round(totals.followers / data.length),
        posts: Math.round(totals.posts / data.length),
        engagement: parseFloat((totals.engagement / data.length).toFixed(1)),
      }
    : { followers: 0, posts: 0, engagement: 0 }

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      Instagram: '📷',
      TikTok: '🎵',
      Twitter: '🐦',
      YouTube: '📺',
      LinkedIn: '💼',
    }
    return icons[platform] || '📱'
  }

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 5) return 'text-green-600 font-semibold'
    if (engagement >= 3) return 'text-yellow-600 font-semibold'
    return 'text-red-600 font-semibold'
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Documentation Section */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How to Use This Tool</h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">What It Does</h3>
              <p>Displays analytics data across multiple social media platforms in one unified view. Shows followers, posts, and engagement rates for Instagram, TikTok, Twitter, YouTube, and LinkedIn.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Click "Load mock data"</strong> to see example analytics</li>
                <li><strong>View platform data:</strong> See followers, posts, and engagement rate for each platform</li>
                <li><strong>Compare platforms:</strong> Easily compare performance across different social media platforms</li>
                <li><strong>Analyze trends:</strong> Review engagement rates and follower counts to identify top-performing platforms</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Unified view of all platform analytics</li>
                <li>Side-by-side comparison of platforms</li>
                <li>Followers, posts, and engagement data for each platform</li>
                <li>Easy-to-read table format</li>
                <li>Quick overview of your social media presence</li>
              </ul>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Cross-Platform Analytics
        </h1>

        <div className="mb-6">
          <button
            onClick={loadMockData}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Load Mock Data
          </button>
        </div>

        {data.length > 0 && (
          <>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                      Platform
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                      Followers
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                      Posts
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                      Engagement
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getPlatformIcon(item.platform)}</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {item.platform}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                        {item.followers.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                        {item.posts.toLocaleString()}
                      </td>
                      <td
                        className={`px-4 py-3 text-right ${getEngagementColor(item.engagement)}`}
                      >
                        {item.engagement}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-gray-700/50">
                  <tr className="font-bold">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">Totals</td>
                    <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                      {totals.followers.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                      {totals.posts.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                      {averages.engagement}%
                    </td>
                  </tr>
                  <tr className="text-sm text-gray-600 dark:text-gray-400">
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">Averages</td>
                    <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400">
                      {averages.followers.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400">
                      {averages.posts.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400">
                      {averages.engagement}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-sm text-blue-800 dark:text-blue-200 mb-1">
                  Total Followers
                </div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {totals.followers.toLocaleString()}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  Across all platforms
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-sm text-green-800 dark:text-green-200 mb-1">
                  Total Posts
                </div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {totals.posts.toLocaleString()}
                </div>
                <div className="text-xs text-green-600 dark:text-green-300 mt-1">
                  Content published
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-sm text-purple-800 dark:text-purple-200 mb-1">
                  Avg Engagement
                </div>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {averages.engagement}%
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-300 mt-1">
                  Average across platforms
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> This tool uses mock data for demonstration. For real
                cross-platform analytics, connect to platform APIs or use analytics services like
                Hootsuite, Sprout Social, or Buffer.
              </p>
            </div>
          </>
        )}

        {data.length === 0 && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              How it works:
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Click "Load Mock Data" to see a sample cross-platform analytics dashboard showing:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Followers, posts, and engagement across 5 platforms</li>
              <li>Totals and averages for all metrics</li>
              <li>Color-coded engagement rates</li>
              <li>Summary cards with key metrics</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}


