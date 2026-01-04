'use client'

import React, { useState } from 'react'

interface MentionData {
  platform: string
  count: number
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function BrandMentionTracker() {
  const [brand, setBrand] = useState('')
  const [mentions, setMentions] = useState<MentionData[]>([])
  const [isChecking, setIsChecking] = useState(false)

  const check = () => {
    const brandName = brand.trim()
    if (!brandName) {
      alert('Please enter a brand name')
      return
    }

    setIsChecking(true)

    // Generate mock mention data across platforms
    const mock: MentionData[] = [
      { platform: 'Twitter', count: rand(5, 30) },
      { platform: 'Reddit', count: rand(2, 15) },
      { platform: 'TikTok', count: rand(10, 50) },
      { platform: 'Instagram', count: rand(8, 40) },
      { platform: 'LinkedIn', count: rand(3, 20) },
      { platform: 'YouTube', count: rand(5, 25) },
      { platform: 'Facebook', count: rand(4, 18) },
    ]

    setMentions(mock)
  }

  const totalMentions = mentions.reduce((sum, m) => sum + m.count, 0)

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      Twitter: '🐦',
      Reddit: '🤖',
      TikTok: '🎵',
      Instagram: '📷',
      LinkedIn: '💼',
      YouTube: '📺',
      Facebook: '👥',
    }
    return icons[platform] || '📱'
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
              <p>Tracks mentions of your brand across different social media platforms. Shows how many times your brand is mentioned on Twitter, Reddit, TikTok, Instagram, LinkedIn, YouTube, and Facebook.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Enter brand name:</strong> Type your brand name to track</li>
                <li><strong>Click "Check"</strong> to search for brand mentions</li>
                <li><strong>Review results:</strong> See total mentions and breakdown by platform with visual progress bars showing distribution</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Total brand mentions across all platforms</li>
                <li>Platform-by-platform breakdown with mention counts</li>
                <li>Visual progress bars showing mention distribution</li>
                <li>Platform icons for easy identification</li>
                <li>Percentage breakdown of mentions per platform</li>
              </ul>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Brand Mention Tracker
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Brand
            </label>
            <input
              id="b"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Enter your brand name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              onKeyPress={(e) => {
                if (e.key === 'Enter') check()
              }}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track mentions of your brand across social media platforms
            </p>
          </div>

          <button
            onClick={check}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Check
          </button>
        </div>

        {mentions.length > 0 && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Brand Mentions: "{brand}"
              </h2>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {totalMentions.toLocaleString()} total mentions
              </div>
            </div>

            <div className="space-y-3">
              {mentions.map((mention, index) => (
                <div
                  key={index}
                  className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getPlatformIcon(mention.platform)}</span>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {mention.platform}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {mention.count} mention{mention.count !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all"
                          style={{
                            width: `${(mention.count / totalMentions) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white w-16 text-right">
                        {mention.count}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> This is a demo tool that generates sample data. For real
                brand mention tracking, you would need to connect to social media APIs or use a
                brand monitoring service.
              </p>
            </div>
          </div>
        )}

        {!isChecking && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              How it works:
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter your brand name and click "Check" to see how many times your brand is
              mentioned across different social media platforms. Track your brand's visibility and
              monitor online conversations about your brand.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


