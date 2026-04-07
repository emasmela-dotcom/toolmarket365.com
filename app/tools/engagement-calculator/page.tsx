'use client'

import { useState } from 'react'
import { TrendingUp, Users, Heart, MessageCircle, Share2, Eye, BarChart3, Calculator, AlertCircle } from 'lucide-react'
import { ToolAccessGate } from '@/components/ToolAccessGate'

interface Results {
  engagementRate: string
  rating: string
  ratingColor: string
  ratingBg: string
  totalEngagements: number
  likeRate: string
  commentRate: string
  shareRate: string
  viewRate: string | null
  estimatedReach: number
  estimatedImpressions: number
  projectedLikes: number
  projectedComments: number
  projectedShares: number
  benchmarks: {
    excellent: number
    good: number
    average: number
    poor: number
    avgLikes: number
    avgComments: number
    avgShares: number
  }
}

function EngagementCalculatorContent() {
  const [followers, setFollowers] = useState('')
  const [likes, setLikes] = useState('')
  const [comments, setComments] = useState('')
  const [shares, setShares] = useState('')
  const [views, setViews] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [results, setResults] = useState<Results | null>(null)

  const platformBenchmarks = {
    instagram: {
      excellent: 6.0,
      good: 3.0,
      average: 1.5,
      poor: 0.5,
      avgLikes: 3.5,
      avgComments: 0.3,
      avgShares: 0.1
    },
    tiktok: {
      excellent: 9.0,
      good: 5.0,
      average: 3.0,
      poor: 1.0,
      avgLikes: 7.0,
      avgComments: 0.5,
      avgShares: 0.2
    },
    twitter: {
      excellent: 2.0,
      good: 1.0,
      average: 0.5,
      poor: 0.2,
      avgLikes: 1.2,
      avgComments: 0.1,
      avgShares: 0.3
    },
    linkedin: {
      excellent: 4.0,
      good: 2.0,
      average: 1.0,
      poor: 0.4,
      avgLikes: 2.5,
      avgComments: 0.2,
      avgShares: 0.1
    },
    youtube: {
      excellent: 8.0,
      good: 4.0,
      average: 2.0,
      poor: 0.8,
      avgLikes: 4.0,
      avgComments: 0.5,
      avgShares: 0.1
    }
  }

  const calculateEngagement = () => {
    const followerCount = parseInt(followers) || 0
    const likeCount = parseInt(likes) || 0
    const commentCount = parseInt(comments) || 0
    const shareCount = parseInt(shares) || 0
    const viewCount = parseInt(views) || 0

    if (followerCount === 0) return

    const totalEngagements = likeCount + commentCount + shareCount
    const engagementRate = ((totalEngagements / followerCount) * 100).toFixed(2)
    
    const benchmarks = platformBenchmarks[platform as keyof typeof platformBenchmarks]
    let rating = ''
    let ratingColor = ''
    let ratingBg = ''
    
    if (parseFloat(engagementRate) >= benchmarks.excellent) {
      rating = 'Excellent'
      ratingColor = 'text-green-600'
      ratingBg = 'bg-green-100'
    } else if (parseFloat(engagementRate) >= benchmarks.good) {
      rating = 'Good'
      ratingColor = 'text-blue-600'
      ratingBg = 'bg-blue-100'
    } else if (parseFloat(engagementRate) >= benchmarks.average) {
      rating = 'Average'
      ratingColor = 'text-yellow-600'
      ratingBg = 'bg-yellow-100'
    } else {
      rating = 'Needs Improvement'
      ratingColor = 'text-red-600'
      ratingBg = 'bg-red-100'
    }

    const likeRate = ((likeCount / followerCount) * 100).toFixed(2)
    const commentRate = ((commentCount / followerCount) * 100).toFixed(2)
    const shareRate = ((shareCount / followerCount) * 100).toFixed(2)
    const viewRate = viewCount > 0 ? ((viewCount / followerCount) * 100).toFixed(2) : null

    const estimatedReach = Math.round(followerCount * (parseFloat(engagementRate) / 100) * 8)
    const estimatedImpressions = viewCount > 0 ? viewCount : Math.round(followerCount * 0.3)

    const projectedLikes = Math.round(followerCount * (benchmarks.avgLikes / 100))
    const projectedComments = Math.round(followerCount * (benchmarks.avgComments / 100))
    const projectedShares = Math.round(followerCount * (benchmarks.avgShares / 100))

    setResults({
      engagementRate,
      rating,
      ratingColor,
      ratingBg,
      totalEngagements,
      likeRate,
      commentRate,
      shareRate,
      viewRate,
      estimatedReach,
      estimatedImpressions,
      projectedLikes,
      projectedComments,
      projectedShares,
      benchmarks
    })
  }

  const resetCalculator = () => {
    setFollowers('')
    setLikes('')
    setComments('')
    setShares('')
    setViews('')
    setResults(null)
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-accent-600 rounded-2xl">
              <BarChart3 className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-3">Engagement Calculator</h1>
          <p className="text-xl text-mono-600 dark:text-mono-400 mb-4">Calculate and benchmark your social media performance</p>
          
          {/* Supported Platforms */}
          <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-xs font-semibold text-mono-700 dark:text-mono-300 mb-2">Supported Platforms:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">📸 Instagram</span>
              <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">🎵 TikTok</span>
              <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">🐦 Twitter/X</span>
              <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">💼 LinkedIn</span>
              <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">📺 YouTube</span>
            </div>
          </div>
        </div>

        {/* Documentation Section */}
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-8 border border-mono-200 dark:border-mono-700">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">How to Use This Tool</h2>
          <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">What It Does</h3>
              <p>Calculates your social media engagement rate and benchmarks it against industry standards. Helps you understand how well your content is performing and where you can improve.</p>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Enter followers:</strong> Type your total follower count</li>
                <li><strong>Enter likes:</strong> Enter the number of likes on a post</li>
                <li><strong>Enter comments:</strong> Enter the number of comments</li>
                <li><strong>Enter shares:</strong> Enter the number of shares (optional)</li>
                <li><strong>Click "Calculate"</strong> to see your engagement rate</li>
                <li><strong>Review results:</strong> See your engagement rate percentage and how it compares to benchmarks</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Engagement rate percentage calculation</li>
                <li>Benchmark comparison showing if your rate is above/below average</li>
                <li>Breakdown of engagement components (likes, comments, shares)</li>
                <li>Performance insights and recommendations</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
              <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">Enter Your Metrics</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">Platform</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['instagram', 'tiktok', 'twitter', 'linkedin', 'youtube'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPlatform(p)}
                        className={`px-4 py-3 rounded-lg font-semibold transition-all capitalize ${
                          platform === p
                            ? 'bg-accent-600 text-white shadow-lg'
                            : 'bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 hover:bg-mono-200 dark:hover:bg-mono-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    <Users className="inline mr-2" size={16} />
                    Followers / Subscribers
                  </label>
                  <input
                    type="number"
                    value={followers}
                    onChange={(e) => setFollowers(e.target.value)}
                    placeholder="e.g., 10000"
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:border-accent-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    <Heart className="inline mr-2" size={16} />
                    Likes (per post average)
                  </label>
                  <input
                    type="number"
                    value={likes}
                    onChange={(e) => setLikes(e.target.value)}
                    placeholder="e.g., 350"
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:border-accent-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    <MessageCircle className="inline mr-2" size={16} />
                    Comments (per post average)
                  </label>
                  <input
                    type="number"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="e.g., 25"
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:border-accent-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    <Share2 className="inline mr-2" size={16} />
                    Shares (per post average)
                  </label>
                  <input
                    type="number"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    placeholder="e.g., 15"
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:border-accent-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    <Eye className="inline mr-2" size={16} />
                    Views (optional)
                  </label>
                  <input
                    type="number"
                    value={views}
                    onChange={(e) => setViews(e.target.value)}
                    placeholder="e.g., 5000"
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:border-accent-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={calculateEngagement}
                    disabled={!followers}
                    className="flex-1 px-6 py-4 bg-accent-600 text-white rounded-xl font-bold text-lg hover:bg-accent-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Calculator size={24} />
                    Calculate
                  </button>
                  {results && (
                    <button
                      onClick={resetCalculator}
                      className="px-6 py-4 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-xl font-semibold transition-colors text-mono-700 dark:text-mono-300"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Overall Engagement Rate */}
                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">Your Engagement Rate</h2>
                  <div className="text-center py-6">
                    <div className={`inline-block px-6 py-3 ${results.ratingBg} rounded-full mb-4`}>
                      <span className={`text-lg font-bold ${results.ratingColor}`}>{results.rating}</span>
                    </div>
                    <div className="text-6xl font-bold text-mono-950 dark:text-mono-50 mb-2">{results.engagementRate}%</div>
                    <p className="text-mono-600 dark:text-mono-400">Overall Engagement Rate</p>
                  </div>
                  <div className="border-t border-mono-200 dark:border-mono-700 pt-4">
                    <p className="text-sm text-mono-600 dark:text-mono-400">
                      <AlertCircle className="inline mr-1" size={14} />
                      Based on {results.totalEngagements.toLocaleString()} total engagements
                    </p>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">Engagement Breakdown</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-100 dark:bg-pink-900/40 rounded-lg">
                          <Heart className="text-pink-600 dark:text-pink-400" size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-mono-950 dark:text-mono-50">Like Rate</p>
                          <p className="text-sm text-mono-600 dark:text-mono-400">{likes} likes</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{results.likeRate}%</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                          <MessageCircle className="text-blue-600 dark:text-blue-400" size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-mono-950 dark:text-mono-50">Comment Rate</p>
                          <p className="text-sm text-mono-600 dark:text-mono-400">{comments} comments</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{results.commentRate}%</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                          <Share2 className="text-green-600 dark:text-green-400" size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-mono-950 dark:text-mono-50">Share Rate</p>
                          <p className="text-sm text-mono-600 dark:text-mono-400">{shares} shares</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{results.shareRate}%</div>
                    </div>

                    {results.viewRate && (
                      <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                            <Eye className="text-purple-600 dark:text-purple-400" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-mono-950 dark:text-mono-50">View Rate</p>
                            <p className="text-sm text-mono-600 dark:text-mono-400">{views} views</p>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{results.viewRate}%</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Projections */}
                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">
                    <TrendingUp className="inline mr-2" size={24} />
                    Estimated Reach & Projections
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-mono-100 dark:bg-mono-800 rounded-lg">
                      <span className="text-mono-700 dark:text-mono-300 font-medium">Estimated Reach</span>
                      <span className="text-xl font-bold text-mono-950 dark:text-mono-50">{results.estimatedReach.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-mono-100 dark:bg-mono-800 rounded-lg">
                      <span className="text-mono-700 dark:text-mono-300 font-medium">Estimated Impressions</span>
                      <span className="text-xl font-bold text-mono-950 dark:text-mono-50">{results.estimatedImpressions.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-mono-200 dark:border-mono-700">
                    <p className="text-sm font-semibold text-mono-700 dark:text-mono-300 mb-3">
                      Expected Engagement for {platform.charAt(0).toUpperCase() + platform.slice(1)}:
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-mono-600 dark:text-mono-400">Projected Likes:</span>
                        <span className="font-semibold text-mono-950 dark:text-mono-50">{results.projectedLikes.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-mono-600 dark:text-mono-400">Projected Comments:</span>
                        <span className="font-semibold text-mono-950 dark:text-mono-50">{results.projectedComments.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-mono-600 dark:text-mono-400">Projected Shares:</span>
                        <span className="font-semibold text-mono-950 dark:text-mono-50">{results.projectedShares.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benchmarks */}
                <div className="bg-accent-600 rounded-2xl shadow-xl p-6 text-white">
                  <h2 className="text-xl font-bold mb-4">
                    Platform Benchmarks ({platform.charAt(0).toUpperCase() + platform.slice(1)})
                  </h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Excellent:</span>
                      <span className="font-bold">{results.benchmarks.excellent}%+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Good:</span>
                      <span className="font-bold">{results.benchmarks.good}%+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average:</span>
                      <span className="font-bold">{results.benchmarks.average}%+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Needs Work:</span>
                      <span className="font-bold">Below {results.benchmarks.average}%</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-12 text-center h-full flex flex-col justify-center border border-mono-200 dark:border-mono-700">
                <Calculator className="mx-auto text-mono-300 dark:text-mono-700 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-mono-700 dark:text-mono-300 mb-3">Ready to Calculate?</h3>
                <p className="text-mono-500 dark:text-mono-500 mb-6">
                  Enter your follower count and engagement metrics to see your performance
                </p>
                <div className="flex justify-center gap-6 text-sm text-mono-600 dark:text-mono-400">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={18} className="text-accent-600" />
                    <span>Detailed breakdown</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-accent-600" />
                    <span>Projections</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EngagementCalculator() {
  const toolDescription = "Calculates your engagement rate based on followers and interactions (likes, comments, shares, views). Provides detailed breakdowns, performance ratings, and projections to help you understand and improve your social media engagement."
  const howToUse = (
    <div>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li><strong>Enter followers:</strong> Input your total follower count</li>
        <li><strong>Enter metrics:</strong> Add likes, comments, shares, and optionally views</li>
        <li><strong>Click "Calculate":</strong> See your engagement rate and detailed breakdown</li>
        <li><strong>Review results:</strong> Check your performance rating, projections, and benchmarks</li>
        <li><strong>Analyze:</strong> Use the insights to improve your content strategy</li>
      </ol>
    </div>
  )

  return (
    <ToolAccessGate
      toolSlug="engagement-calculator"
      toolName="Engagement Calculator"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <EngagementCalculatorContent />
    </ToolAccessGate>
  )
}

