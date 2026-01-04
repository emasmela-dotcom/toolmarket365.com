'use client'

import { useState } from 'react'
import { Calculator, DollarSign, Clock, TrendingUp, Users, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react'

export default function RateCalculator() {
  const [hours, setHours] = useState('')
  const [ratePerHour, setRatePerHour] = useState('')
  const [followers, setFollowers] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [engagementRate, setEngagementRate] = useState('')
  const [result, setResult] = useState<{
    total: number
    perPost: number
    perThousand: number
    recommended: number
  } | null>(null)

  const platformRates: Record<string, { base: number; multiplier: number }> = {
    instagram: { base: 100, multiplier: 0.01 },
    twitter: { base: 50, multiplier: 0.005 },
    youtube: { base: 200, multiplier: 0.02 },
    linkedin: { base: 150, multiplier: 0.015 },
    tiktok: { base: 80, multiplier: 0.008 }
  }

  const calculate = () => {
    const h = parseFloat(hours) || 0
    const r = parseFloat(ratePerHour) || 0
    const f = parseFloat(followers) || 0
    const er = parseFloat(engagementRate) || 0

    if (h && r) {
      const total = h * r
      const perPost = f > 0 && er > 0 ? (f * er / 100) * platformRates[platform].multiplier : 0
      const perThousand = f > 0 ? (total / (f / 1000)) : 0
      const recommended = f > 0 
        ? platformRates[platform].base + (f * platformRates[platform].multiplier)
        : total

      setResult({
        total,
        perPost,
        perThousand,
        recommended
      })
    } else {
      setResult(null)
    }
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-accent-600 rounded-2xl">
              <Calculator className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-3">Rate Calculator</h1>
          <p className="text-xl text-mono-600 dark:text-mono-400">Calculate pricing for sponsored posts and collaborations</p>
        </div>

        {/* Documentation Section */}
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-8 border border-mono-200 dark:border-mono-700">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">How to Use This Tool</h2>
          <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">What It Does</h3>
              <p>Calculates pricing for sponsored posts, collaborations, and content creation work. Provides total rates based on hours and hourly rate, plus platform-specific recommendations based on follower count and engagement.</p>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Enter basic info:</strong> Hours (time spent on project) and Rate per Hour (your hourly rate)</li>
                <li><strong>Optional advanced info:</strong> Followers (your follower count), Platform (Instagram, Twitter, YouTube, LinkedIn, TikTok), Engagement Rate %</li>
                <li><strong>Click "Calculate"</strong> to see results</li>
                <li><strong>Review results:</strong> Total rate (hours × rate/hour), Rate per 1K followers, Estimated per post (if engagement rate provided), Recommended rate for platform</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Total Rate - Calculated total (hours × rate per hour)</li>
                <li>Rate per 1K Followers - CPM-style calculation</li>
                <li>Estimated per Post - Based on engagement rate</li>
                <li>Recommended Rate - Platform-specific suggestion</li>
                <li>Currency formatting - All amounts in USD</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
              <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">Calculate Rate</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2 flex items-center gap-2">
                    <Clock size={16} />
                    Hours
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="e.g., 5.5"
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2 flex items-center gap-2">
                    <DollarSign size={16} />
                    Rate per Hour
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={ratePerHour}
                    onChange={(e) => setRatePerHour(e.target.value)}
                    placeholder="e.g., 100.00"
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2 flex items-center gap-2">
                    <Users size={16} />
                    Followers (optional)
                  </label>
                  <input
                    type="number"
                    value={followers}
                    onChange={(e) => setFollowers(e.target.value)}
                    placeholder="e.g., 10000"
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    Platform (optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'instagram', icon: Instagram, name: 'Instagram' },
                      { id: 'twitter', icon: Twitter, name: 'Twitter' },
                      { id: 'youtube', icon: Youtube, name: 'YouTube' },
                      { id: 'linkedin', icon: Linkedin, name: 'LinkedIn' }
                    ].map((p) => {
                      const Icon = p.icon
                      return (
                        <button
                          key={p.id}
                          onClick={() => setPlatform(p.id)}
                          className={`px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                            platform === p.id
                              ? 'bg-accent-600 text-white shadow-lg'
                              : 'bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 hover:bg-mono-200 dark:hover:bg-mono-700'
                          }`}
                        >
                          <Icon size={18} />
                          {p.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2 flex items-center gap-2">
                    <TrendingUp size={16} />
                    Engagement Rate % (optional)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={engagementRate}
                    onChange={(e) => setEngagementRate(e.target.value)}
                    placeholder="e.g., 3.5"
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <button
                  onClick={calculate}
                  disabled={!hours || !ratePerHour}
                  className="w-full px-6 py-4 bg-accent-600 text-white rounded-xl font-bold text-lg hover:bg-accent-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Calculator size={24} />
                  Calculate
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <>
                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">Total Rate</h2>
                  <div className="text-center py-6">
                    <div className="text-6xl font-bold text-accent-600 mb-2">
                      {result.total.toLocaleString('en', { style: 'currency', currency: 'USD' })}
                    </div>
                    <p className="text-mono-600 dark:text-mono-400">
                      {hours} hours × {ratePerHour.toLocaleString('en', { style: 'currency', currency: 'USD' })}/hour
                    </p>
                  </div>
                </div>

                {followers && (
                  <>
                    <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                      <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">Platform Insights</h2>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-mono-100 dark:bg-mono-800 rounded-lg">
                          <span className="text-mono-700 dark:text-mono-300 font-medium">Rate per 1K Followers</span>
                          <span className="text-xl font-bold text-mono-950 dark:text-mono-50">
                            {result.perThousand.toLocaleString('en', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        {engagementRate && (
                          <div className="flex justify-between items-center p-3 bg-mono-100 dark:bg-mono-800 rounded-lg">
                            <span className="text-mono-700 dark:text-mono-300 font-medium">Estimated per Post</span>
                            <span className="text-xl font-bold text-mono-950 dark:text-mono-50">
                              {result.perPost.toLocaleString('en', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center p-3 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                          <span className="text-mono-700 dark:text-mono-300 font-medium">Recommended Rate</span>
                          <span className="text-xl font-bold text-accent-700 dark:text-accent-400">
                            {result.recommended.toLocaleString('en', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-12 text-center h-full flex flex-col justify-center border border-mono-200 dark:border-mono-700">
                <Calculator className="mx-auto text-mono-300 dark:text-mono-700 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-mono-700 dark:text-mono-300 mb-3">Ready to Calculate?</h3>
                <p className="text-mono-500">
                  Enter hours and rate per hour to calculate your total rate
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


