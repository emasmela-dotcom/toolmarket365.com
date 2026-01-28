'use client'

import React from 'react'
import { BookOpen, Copy, Check } from 'lucide-react'

const pricingData = {
  instagram: {
    '0-10k': { post: '$50-$200', reel: '$100-$500', story: '$25-$100', collaboration: '$200-$1,000' },
    '10k-50k': { post: '$200-$500', reel: '$500-$1,500', story: '$100-$300', collaboration: '$1,000-$3,000' },
    '50k-100k': { post: '$500-$1,000', reel: '$1,500-$3,000', story: '$300-$600', collaboration: '$3,000-$7,000' },
    '100k-500k': { post: '$1,000-$3,000', reel: '$3,000-$8,000', story: '$600-$1,500', collaboration: '$7,000-$20,000' },
    '500k+': { post: '$3,000-$10,000+', reel: '$8,000-$25,000+', story: '$1,500-$5,000+', collaboration: '$20,000-$100,000+' },
  },
  tiktok: {
    '0-10k': { video: '$100-$500', brand: '$200-$1,000', collaboration: '$300-$1,500' },
    '10k-50k': { video: '$500-$1,500', brand: '$1,000-$3,000', collaboration: '$1,500-$5,000' },
    '50k-100k': { video: '$1,500-$3,000', brand: '$3,000-$7,000', collaboration: '$5,000-$10,000' },
    '100k-500k': { video: '$3,000-$8,000', brand: '$7,000-$20,000', collaboration: '$10,000-$30,000' },
    '500k+': { video: '$8,000-$25,000+', brand: '$20,000-$50,000+', collaboration: '$30,000-$100,000+' },
  },
  youtube: {
    '0-10k': { video: '$100-$500', sponsorship: '$200-$1,000', collaboration: '$300-$1,500' },
    '10k-50k': { video: '$500-$2,000', sponsorship: '$1,000-$5,000', collaboration: '$1,500-$7,000' },
    '50k-100k': { video: '$2,000-$5,000', sponsorship: '$5,000-$15,000', collaboration: '$7,000-$20,000' },
    '100k-500k': { video: '$5,000-$15,000', sponsorship: '$15,000-$50,000', collaboration: '$20,000-$75,000' },
    '500k+': { video: '$15,000-$50,000+', sponsorship: '$50,000-$200,000+', collaboration: '$75,000-$500,000+' },
  },
  twitter: {
    '0-10k': { tweet: '$25-$100', thread: '$100-$300', collaboration: '$200-$800' },
    '10k-50k': { tweet: '$100-$300', thread: '$300-$800', collaboration: '$800-$2,500' },
    '50k-100k': { tweet: '$300-$600', thread: '$800-$1,500', collaboration: '$2,500-$5,000' },
    '100k-500k': { tweet: '$600-$2,000', thread: '$1,500-$5,000', collaboration: '$5,000-$15,000' },
    '500k+': { tweet: '$2,000-$10,000+', thread: '$5,000-$25,000+', collaboration: '$15,000-$50,000+' },
  },
  linkedin: {
    '0-10k': { post: '$100-$500', article: '$300-$1,000', collaboration: '$500-$2,000' },
    '10k-50k': { post: '$500-$1,500', article: '$1,000-$3,000', collaboration: '$2,000-$5,000' },
    '50k-100k': { post: '$1,500-$3,000', article: '$3,000-$7,000', collaboration: '$5,000-$10,000' },
    '100k-500k': { post: '$3,000-$8,000', article: '$7,000-$20,000', collaboration: '$10,000-$30,000' },
    '500k+': { post: '$8,000-$25,000+', article: '$20,000-$50,000+', collaboration: '$30,000-$100,000+' },
  },
  facebook: {
    '0-10k': { post: '$50-$200', video: '$100-$500', collaboration: '$200-$1,000' },
    '10k-50k': { post: '$200-$500', video: '$500-$1,500', collaboration: '$1,000-$3,000' },
    '50k-100k': { post: '$500-$1,000', video: '$1,500-$3,000', collaboration: '$3,000-$7,000' },
    '100k-500k': { post: '$1,000-$3,000', video: '$3,000-$8,000', collaboration: '$7,000-$20,000' },
    '500k+': { post: '$3,000-$10,000+', video: '$8,000-$25,000+', collaboration: '$20,000-$100,000+' },
  },
}

const platformNames: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  twitter: 'Twitter / X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
}

function CreatorPricingGuideContent() {
  const [selectedPlatform, setSelectedPlatform] = React.useState<string>('instagram')
  const [copied, setCopied] = React.useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const currentData = pricingData[selectedPlatform as keyof typeof pricingData]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BookOpen className="h-10 w-10 text-accent-600 dark:text-accent-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Creator Pricing Guide
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Industry-standard pricing benchmarks for content creators. Use this guide to understand fair rates based on your follower count and platform.
          </p>
        </div>

        {/* Documentation */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How to Use This Guide</h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">What This Is</h3>
              <p>Reference guide showing industry-standard pricing ranges for content creators based on follower count and platform. These are benchmarks—actual rates vary based on engagement, niche, and negotiation.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Select your platform:</strong> Choose Instagram, TikTok, YouTube, etc.</li>
                <li><strong>Find your follower range:</strong> Locate your current follower count</li>
                <li><strong>Check content types:</strong> See pricing for posts, videos, collaborations, etc.</li>
                <li><strong>Use as reference:</strong> These are starting points—adjust based on your engagement rate and niche</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Important Notes</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Rates vary significantly based on engagement rate, niche, and content quality</li>
                <li>These are per-post/video rates—long-term partnerships may offer different pricing</li>
                <li>Always negotiate based on your unique value and audience demographics</li>
                <li>For exact calculations, use the <strong>Rate Calculator</strong> tool (available in Professional plan)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Platform Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Platform
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(pricingData).map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPlatform === platform
                    ? 'bg-accent-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {platformNames[platform]}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Follower Count
                  </th>
                  {Object.keys(currentData['0-10k']).map((contentType) => (
                    <th
                      key={contentType}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {Object.entries(currentData).map(([followerRange, prices]) => (
                  <tr key={followerRange} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {followerRange.replace('-', ' - ')}
                    </td>
                    {Object.entries(prices).map(([contentType, price]) => {
                      const cellId = `${selectedPlatform}-${followerRange}-${contentType}`
                      return (
                        <td
                          key={contentType}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300"
                        >
                          <div className="flex items-center space-x-2">
                            <span>{price}</span>
                            <button
                              onClick={() => copyToClipboard(price, cellId)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                              title="Copy price"
                            >
                              {copied === cellId ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Note:</strong> These are industry benchmarks. Your actual rates should be based on your engagement rate, niche, content quality, and negotiation skills. For personalized rate calculations, upgrade to Professional plan to access the <strong>Rate Calculator</strong> tool.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CreatorPricingGuidePage() {
  return <CreatorPricingGuideContent />
}
