'use client'

import { useState, useEffect } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { 
  Hash, 
  RefreshCw, 
  Calendar,
  CheckCircle2,
  TrendingUp,
  Copy,
  Star,
  Target,
  Filter,
  Sparkles
} from 'lucide-react'

interface HashtagSet {
  id: string
  name: string
  description: string
  hashtags: string[]
  primaryHashtags: string[]
  secondaryHashtags: string[]
  nicheHashtags: string[]
  bannedHashtags: string[]
  platform: string
  category: string
  industry: string
  targetAudience: string
  competitionLevel: string
  averagePostsPerHour: number
  engagementRate: number
  reachPotential: number
  trendingScore: number
  seasonalRelevance?: string
  isActive: boolean
  usageCount: number
  createdAt: string
}

interface WeeklyReport {
  id: string
  weekNumber: number
  year: number
  hashtagSets: HashtagSet[]
  trendingHashtags: string[]
  emergingHashtags: string[]
  decliningHashtags: string[]
  seasonalHashtags: string[]
  competitorInsights: any[]
  recommendations: any[]
  industryTrends: string[]
  emailSent: boolean
}

function HashtagResearchDashboardContent() {
  const [currentReport, setCurrentReport] = useState<WeeklyReport | null>(null)
  const [researching, setResearching] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showAPIKeys, setShowAPIKeys] = useState(false)
  const [apiKeys, setApiKeys] = useState<{service: string, isActive: boolean}[]>([])
  const [apiKeyInput, setApiKeyInput] = useState({service: '', key: ''})

  useEffect(() => {
    fetchWeeklyReport()
    fetchAPIKeys()
  }, [])

  const fetchWeeklyReport = async () => {
    try {
      const response = await fetch('/api/bots/hashtags/weekly')
      if (response.ok) {
        const data = await response.json()
        if (data.report) {
          setCurrentReport(data.report)
        }
      }
    } catch (error) {
      console.error('Error fetching weekly report:', error)
    }
  }

  const fetchAPIKeys = async () => {
    try {
      const response = await fetch('/api/bots/api-keys')
      if (response.ok) {
        const data = await response.json()
        setApiKeys(data.keys || [])
      }
    } catch (error) {
      console.error('Error fetching API keys:', error)
    }
  }

  const generateWeeklyReport = async () => {
    setResearching(true)
    try {
      const response = await fetch('/api/bots/hashtags/weekly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentReport(data.report)
        setSuccessMessage('Weekly hashtag report generated successfully!')
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setResearching(false)
    }
  }

  const researchNewHashtags = async () => {
    setResearching(true)
    try {
      const response = await fetch('/api/bots/hashtags/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specificTopic: 'social media marketing' })
      })

      if (response.ok) {
        const data = await response.json()
        setSuccessMessage('Hashtag set researched successfully!')
        setShowSuccess(true)
        fetchWeeklyReport() // Refresh report
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error researching hashtags:', error)
    } finally {
      setResearching(false)
    }
  }

  const saveAPIKey = async () => {
    if (!apiKeyInput.service || !apiKeyInput.key) return

    try {
      const response = await fetch('/api/bots/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: apiKeyInput.service,
          apiKey: apiKeyInput.key
        })
      })

      if (response.ok) {
        setSuccessMessage('API key saved successfully!')
        setShowSuccess(true)
        setApiKeyInput({service: '', key: ''})
        fetchAPIKeys()
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error saving API key:', error)
    }
  }

  const deleteAPIKey = async (service: string) => {
    try {
      const response = await fetch(`/api/bots/api-keys?service=${service}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSuccessMessage('API key removed successfully!')
        setShowSuccess(true)
        fetchAPIKeys()
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error deleting API key:', error)
    }
  }

  const copyHashtags = async (hashtags: string[]) => {
    try {
      await navigator.clipboard.writeText(hashtags.join(' '))
      setSuccessMessage('Hashtags copied to clipboard!')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error('Error copying hashtags:', error)
    }
  }

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      instagram: '📸',
      tiktok: '🎵',
      twitter: '🐦',
      facebook: '📘',
      linkedin: '💼',
      all: '🌐'
    }
    return icons[platform] || '#️⃣'
  }

  const getCompetitionColor = (level: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[level] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }

  const filteredSets = currentReport?.hashtagSets.filter(set => {
    if (selectedCategory !== 'all' && set.category !== selectedCategory) return false
    if (selectedPlatform !== 'all' && set.platform !== selectedPlatform) return false
    return true
  }) || []

  const categories = ['all', ...new Set(currentReport?.hashtagSets.map(s => s.category) || [])]
  const platforms = ['all', ...new Set(currentReport?.hashtagSets.map(s => s.platform) || [])]

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">Hashtag Research Bot</h1>
          <p className="text-mono-600 dark:text-mono-400 mt-1">
            Template-based hashtag research — zero external API usage
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={researchNewHashtags}
            disabled={researching}
            className="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {researching ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Researching...</span>
              </>
            ) : (
              <>
                <Hash className="w-5 h-5" />
                <span>Research Hashtags</span>
              </>
            )}
          </button>
          <button
            onClick={generateWeeklyReport}
            disabled={researching}
            className="px-6 py-3 bg-mono-200 dark:bg-mono-800 text-mono-900 dark:text-mono-100 rounded-lg hover:bg-mono-300 dark:hover:bg-mono-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Weekly Report</span>
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-400 dark:border-blue-600 rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-3">
          <CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-2">
              Works Out of the Box - Zero Cost
            </h3>
            <p className="text-blue-800 dark:text-blue-300 mb-3">
              All hashtag sets are generated from pre-defined templates with zero external API usage. 
              No costs, no usage charges, works immediately out of the box.
            </p>
            <div className="mt-3 pt-3 border-t border-blue-300 dark:border-blue-700">
              <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                <strong>Optional Enhancement:</strong> Connect your own API keys (OpenAI, Anthropic) to generate more dynamic hashtag sets. 
                <strong className="text-blue-900 dark:text-blue-100"> All API costs are at your expense</strong> — CreatorFlow365 never charges for API usage.
              </p>
              <button
                onClick={() => setShowAPIKeys(!showAPIKeys)}
                className="text-sm text-blue-700 dark:text-blue-300 hover:underline font-medium"
              >
                {showAPIKeys ? 'Hide' : 'Configure'} API Keys
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* API Keys Configuration */}
      {showAPIKeys && (
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-mono-950 dark:text-mono-50">External API Configuration</h3>
          <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">
            Add your own API keys to enhance hashtag research. All usage costs are billed directly to you by the API provider.
          </p>

          {apiKeys.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Active API Keys:</p>
              <div className="space-y-2">
                {apiKeys.map((key) => (
                  <div key={key.service} className="flex items-center justify-between p-3 bg-mono-50 dark:bg-mono-800 rounded">
                    <div>
                      <span className="font-medium capitalize text-mono-900 dark:text-mono-100">{key.service}</span>
                      {key.isActive && (
                        <span className="ml-2 text-xs text-green-600 dark:text-green-400">● Active</span>
                      )}
                    </div>
                    <button
                      onClick={() => deleteAPIKey(key.service)}
                      className="text-sm text-red-600 dark:text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Service</label>
              <select
                value={apiKeyInput.service}
                onChange={(e) => setApiKeyInput({...apiKeyInput, service: e.target.value})}
                className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
              >
                <option value="">Select service...</option>
                <option value="openai">OpenAI (GPT-4)</option>
                <option value="anthropic">Anthropic (Claude)</option>
                <option value="google">Google (Gemini)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">API Key</label>
              <input
                type="password"
                value={apiKeyInput.key}
                onChange={(e) => setApiKeyInput({...apiKeyInput, key: e.target.value})}
                placeholder="Enter your API key..."
                className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
              />
            </div>
            <button
              onClick={saveAPIKey}
              disabled={!apiKeyInput.service || !apiKeyInput.key}
              className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save API Key
            </button>
          </div>
        </div>
      )}

      {/* Weekly Report Section */}
      {currentReport && (
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
                Week {currentReport.weekNumber} Hashtag Report
              </h2>
              <p className="text-mono-600 dark:text-mono-400">
                {currentReport.year} • {currentReport.hashtagSets.length} hashtag sets
              </p>
            </div>
            <div className="flex items-center space-x-2 text-mono-600 dark:text-mono-400">
              <Calendar className="w-5 h-5" />
              <span>{currentReport.trendingHashtags.length} Trending</span>
            </div>
          </div>

          {/* Trending Hashtags */}
          {currentReport.trendingHashtags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-mono-950 dark:text-mono-50 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-accent-600" />
                <span>Trending Hashtags</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentReport.trendingHashtags.map((hashtag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-200 rounded-lg text-sm font-medium"
                  >
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {currentReport.recommendations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-mono-950 dark:text-mono-50">Recommendations</h3>
              <div className="space-y-2">
                {currentReport.recommendations.slice(0, 5).map((rec: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-mono-50 dark:bg-mono-800 rounded">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        rec.type === 'use' ? 'bg-green-500' : 
                        rec.type === 'test' ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-mono-900 dark:text-mono-100">{rec.hashtag}</p>
                        <p className="text-sm text-mono-600 dark:text-mono-400">{rec.reason}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-mono-200 dark:bg-mono-700 rounded text-mono-600 dark:text-mono-400">
                      {rec.confidence}% confidence
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      {currentReport && currentReport.hashtagSets.length > 0 && (
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-mono-600 dark:text-mono-400" />
              <span className="text-sm font-medium text-mono-700 dark:text-mono-300">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-mono-700 dark:text-mono-300">Platform:</span>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
              >
                {platforms.map(plat => (
                  <option key={plat} value={plat}>{plat === 'all' ? 'All Platforms' : plat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Hashtag Sets Grid */}
      {filteredSets.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSets.map((set) => (
            <div
              key={set.id}
              className="bg-white dark:bg-mono-900 rounded-lg border-2 border-mono-200 dark:border-mono-700 hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-1">
                    {set.name}
                  </h3>
                  <p className="text-sm text-mono-600 dark:text-mono-400 mb-2">{set.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-mono-100 dark:bg-mono-800 rounded text-mono-600 dark:text-mono-400">
                      {set.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getCompetitionColor(set.competitionLevel)}`}>
                      {set.competitionLevel} competition
                    </span>
                    <span className="text-xs px-2 py-1 bg-mono-100 dark:bg-mono-800 rounded text-mono-600 dark:text-mono-400 flex items-center space-x-1">
                      <span>{getPlatformIcon(set.platform)}</span>
                      <span>{set.platform}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Primary Hashtags */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-mono-700 dark:text-mono-300">Primary Hashtags (High Volume)</p>
                    <button
                      onClick={() => copyHashtags(set.primaryHashtags)}
                      className="text-xs text-accent-600 dark:text-accent-400 hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {set.primaryHashtags.slice(0, 8).map((hashtag, idx) => (
                      <span key={idx} className="text-sm px-2 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-200 rounded">
                        {hashtag}
                      </span>
                    ))}
                    {set.primaryHashtags.length > 8 && (
                      <span className="text-xs text-mono-500 dark:text-mono-500">+{set.primaryHashtags.length - 8} more</span>
                    )}
                  </div>
                </div>

                {/* Secondary Hashtags */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-mono-700 dark:text-mono-300">Secondary Hashtags (Medium Volume)</p>
                    <button
                      onClick={() => copyHashtags(set.secondaryHashtags)}
                      className="text-xs text-accent-600 dark:text-accent-400 hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {set.secondaryHashtags.slice(0, 8).map((hashtag, idx) => (
                      <span key={idx} className="text-sm px-2 py-1 bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 rounded">
                        {hashtag}
                      </span>
                    ))}
                    {set.secondaryHashtags.length > 8 && (
                      <span className="text-xs text-mono-500 dark:text-mono-500">+{set.secondaryHashtags.length - 8} more</span>
                    )}
                  </div>
                </div>

                {/* Niche Hashtags */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-mono-700 dark:text-mono-300">Niche Hashtags (Low Volume)</p>
                    <button
                      onClick={() => copyHashtags(set.nicheHashtags)}
                      className="text-xs text-accent-600 dark:text-accent-400 hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {set.nicheHashtags.slice(0, 8).map((hashtag, idx) => (
                      <span key={idx} className="text-sm px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded">
                        {hashtag}
                      </span>
                    ))}
                    {set.nicheHashtags.length > 8 && (
                      <span className="text-xs text-mono-500 dark:text-mono-500">+{set.nicheHashtags.length - 8} more</span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-mono-200 dark:border-mono-700">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{set.trendingScore}/100</p>
                    <p className="text-xs text-mono-600 dark:text-mono-400">Trending Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{set.engagementRate}%</p>
                    <p className="text-xs text-mono-600 dark:text-mono-400">Est. Engagement</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{set.reachPotential?.toLocaleString()}</p>
                    <p className="text-xs text-mono-600 dark:text-mono-400">Est. Reach</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{set.averagePostsPerHour}</p>
                    <p className="text-xs text-mono-600 dark:text-mono-400">Posts/Hour</p>
                  </div>
                </div>

                {/* Copy All Button */}
                <button
                  onClick={() => copyHashtags(set.hashtags)}
                  className="w-full px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy All Hashtags</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No report yet */}
      {!currentReport && (
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-12 text-center">
          <Hash className="w-16 h-16 mx-auto mb-4 text-mono-300 dark:text-mono-700" />
          <h3 className="text-lg font-semibold mb-2 text-mono-950 dark:text-mono-50">No hashtag research yet</h3>
          <p className="text-mono-600 dark:text-mono-400 mb-4">
            Generate your first weekly hashtag report with strategic hashtag sets
          </p>
          <button
            onClick={generateWeeklyReport}
            disabled={researching}
            className="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50"
          >
            {researching ? 'Generating...' : 'Generate Weekly Report'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function HashtagResearchDashboard() {
  const toolDescription = "Hashtag Research Bot generates weekly hashtag suggestions optimized for your niche and platform. Fully template-based with zero external API usage."
  const howToUse = "1. Click 'Generate Weekly Report' to create a comprehensive hashtag research report. 2. Review hashtag sets organized by volume (primary, secondary, niche). 3. Filter by category or platform. 4. Copy hashtags to use in your posts. All hashtags are generated from pre-defined templates—no external APIs, no usage costs."

  return (
    <ToolAccessGate
      toolSlug="hashtag-research-bot"
      toolName="Hashtag Research Bot"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <HashtagResearchDashboardContent />
    </ToolAccessGate>
  )
}
