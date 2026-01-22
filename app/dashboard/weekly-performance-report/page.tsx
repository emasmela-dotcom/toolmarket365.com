'use client'

import { useState, useEffect } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { 
  BarChart3, 
  RefreshCw, 
  Calendar,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  Download,
  Mail,
  Sparkles,
  Eye,
  Heart,
  Users,
  MousePointerClick
} from 'lucide-react'

interface WeeklyPerformanceReport {
  id: string
  weekNumber: number
  year: number
  reportPeriod: {
    start: string
    end: string
  }
  summary: {
    totalViews: number
    totalEngagement: number
    totalReach: number
    totalClicks: number
    conversionRate: number
    revenue: number
  }
  platforms: {
    instagram?: any
    facebook?: any
    website?: any
    email?: any
  }
  topPerformingContent: any[]
  audienceInsights: any
  growthMetrics: {
    weekOverWeek: {
      views: number
      engagement: number
      followers: number
      revenue: number
    }
    trends: {
      improving: string[]
      declining: string[]
      stable: string[]
    }
  }
  recommendations: any[]
  achievements: any[]
  challenges: any[]
  nextWeekGoals: any[]
  trends: any[]
  createdAt: string
}

function WeeklyPerformanceReportDashboardContent() {
  const [reports, setReports] = useState<WeeklyPerformanceReport[]>([])
  const [currentReport, setCurrentReport] = useState<WeeklyPerformanceReport | null>(null)
  const [generating, setGenerating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showAPIKeys, setShowAPIKeys] = useState(false)
  const [apiKeys, setApiKeys] = useState<{service: string, isActive: boolean}[]>([])
  const [apiKeyInput, setApiKeyInput] = useState({service: '', key: ''})

  useEffect(() => {
    fetchReports()
    fetchCurrentReport()
    fetchAPIKeys()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/bots/performance-reports')
      if (response.ok) {
        const data = await response.json()
        setReports(data.reports || [])
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    }
  }

  const fetchCurrentReport = async () => {
    try {
      const response = await fetch('/api/bots/performance-reports/current')
      if (response.ok) {
        const data = await response.json()
        if (data.report) {
          setCurrentReport(data.report)
        }
      }
    } catch (error) {
      console.error('Error fetching current report:', error)
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

  const generateReport = async () => {
    setGenerating(true)
    try {
      const response = await fetch('/api/bots/performance-reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentReport(data.report)
        setReports([data.report, ...reports])
        setSuccessMessage('Weekly performance report generated successfully!')
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setGenerating(false)
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatPercent = (num: number) => {
    return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`
  }

  const displayReport = currentReport || reports[0]

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
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">Weekly Performance Report Bot</h1>
          <p className="text-mono-600 dark:text-mono-400 mt-1">
            Template-based weekly analytics reports — zero external API usage
          </p>
        </div>
        <button
          onClick={generateReport}
          disabled={generating}
          className="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {generating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Report</span>
            </>
          )}
        </button>
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
              All performance reports are generated from pre-defined templates with zero external API usage. 
              No costs, no usage charges, works immediately out of the box.
            </p>
            <div className="mt-3 pt-3 border-t border-blue-300 dark:border-blue-700">
              <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                <strong>Optional Enhancement:</strong> Connect your own API keys (Google Analytics, Facebook, Instagram, etc.) to generate reports with real data. 
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
            Add your own API keys to enhance report generation with real data. All usage costs are billed directly to you by the API provider.
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
                <option value="google-analytics">Google Analytics</option>
                <option value="facebook">Facebook/Instagram</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="openai">OpenAI (Enhanced Analysis)</option>
                <option value="anthropic">Anthropic (Enhanced Analysis)</option>
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

      {/* Current Report */}
      {displayReport ? (
        <div className="space-y-6">
          {/* Report Header */}
          <div className="bg-white dark:bg-mono-900 rounded-lg border-2 border-mono-200 dark:border-mono-700 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-mono-950 dark:text-mono-50">
                  Week {displayReport.weekNumber}, {displayReport.year}
                </h2>
                <p className="text-mono-600 dark:text-mono-400 mt-1">
                  {new Date(displayReport.reportPeriod.start).toLocaleDateString()} - {new Date(displayReport.reportPeriod.end).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-mono-500" />
                <span className="text-sm text-mono-500">
                  {new Date(displayReport.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div className="bg-mono-50 dark:bg-mono-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="w-4 h-4 text-accent-600" />
                  <span className="text-sm text-mono-600 dark:text-mono-400">Views</span>
                </div>
                <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">
                  {formatNumber(displayReport.summary.totalViews)}
                </p>
              </div>
              <div className="bg-mono-50 dark:bg-mono-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-mono-600 dark:text-mono-400">Engagement</span>
                </div>
                <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">
                  {formatNumber(displayReport.summary.totalEngagement)}
                </p>
              </div>
              <div className="bg-mono-50 dark:bg-mono-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-mono-600 dark:text-mono-400">Reach</span>
                </div>
                <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">
                  {formatNumber(displayReport.summary.totalReach)}
                </p>
              </div>
              <div className="bg-mono-50 dark:bg-mono-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MousePointerClick className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-mono-600 dark:text-mono-400">Clicks</span>
                </div>
                <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">
                  {formatNumber(displayReport.summary.totalClicks)}
                </p>
              </div>
              <div className="bg-mono-50 dark:bg-mono-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-mono-600 dark:text-mono-400">Conversion</span>
                </div>
                <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">
                  {(displayReport.summary.conversionRate * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-mono-50 dark:bg-mono-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-mono-600 dark:text-mono-400">Revenue</span>
                </div>
                <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">
                  ${formatNumber(displayReport.summary.revenue)}
                </p>
              </div>
            </div>

            {/* Growth Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300 mb-1">Week-over-Week</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-green-600 dark:text-green-400">Views:</span>
                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                      {formatPercent(displayReport.growthMetrics.weekOverWeek.views)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-green-600 dark:text-green-400">Engagement:</span>
                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                      {formatPercent(displayReport.growthMetrics.weekOverWeek.engagement)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">Trends</p>
                <div className="space-y-1">
                  {displayReport.growthMetrics.trends.improving.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-blue-600" />
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        {displayReport.growthMetrics.trends.improving.join(', ')}
                      </span>
                    </div>
                  )}
                  {displayReport.growthMetrics.trends.declining.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <TrendingDown className="w-3 h-3 text-red-600" />
                      <span className="text-xs text-red-600 dark:text-red-400">
                        {displayReport.growthMetrics.trends.declining.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-700 dark:text-purple-300 mb-1">Achievements</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {displayReport.achievements.length}
                </p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-700 dark:text-orange-300 mb-1">Recommendations</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                  {displayReport.recommendations.length}
                </p>
              </div>
            </div>
          </div>

          {/* Platform Performance */}
          {Object.keys(displayReport.platforms).length > 0 && (
            <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
              <h3 className="text-xl font-semibold mb-4 text-mono-950 dark:text-mono-50">Platform Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(displayReport.platforms).map(([platform, metrics]: [string, any]) => (
                  <div key={platform} className="bg-mono-50 dark:bg-mono-800 rounded-lg p-4">
                    <h4 className="font-semibold capitalize mb-3 text-mono-950 dark:text-mono-50">{platform}</h4>
                    <div className="space-y-2 text-sm">
                      {metrics.followers !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-mono-600 dark:text-mono-400">Followers:</span>
                          <span className="font-medium text-mono-950 dark:text-mono-50">
                            {formatNumber(metrics.followers)}
                          </span>
                        </div>
                      )}
                      {metrics.engagementRate !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-mono-600 dark:text-mono-400">Engagement Rate:</span>
                          <span className="font-medium text-mono-950 dark:text-mono-50">
                            {(metrics.engagementRate * 100).toFixed(2)}%
                          </span>
                        </div>
                      )}
                      {metrics.visitors !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-mono-600 dark:text-mono-400">Visitors:</span>
                          <span className="font-medium text-mono-950 dark:text-mono-50">
                            {formatNumber(metrics.visitors)}
                          </span>
                        </div>
                      )}
                      {metrics.openRate !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-mono-600 dark:text-mono-400">Open Rate:</span>
                          <span className="font-medium text-mono-950 dark:text-mono-50">
                            {(metrics.openRate * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {displayReport.recommendations.length > 0 && (
            <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
              <h3 className="text-xl font-semibold mb-4 text-mono-950 dark:text-mono-50">Recommendations</h3>
              <div className="space-y-4">
                {displayReport.recommendations.map((rec: any) => (
                  <div key={rec.id} className="border-l-4 border-accent-600 pl-4 py-2">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-mono-950 dark:text-mono-50">{rec.title}</h4>
                        <p className="text-sm text-mono-600 dark:text-mono-400 mt-1">{rec.description}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                    {rec.implementationSteps && rec.implementationSteps.length > 0 && (
                      <ul className="text-sm text-mono-600 dark:text-mono-400 mt-2 space-y-1">
                        {rec.implementationSteps.slice(0, 3).map((step: string, idx: number) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-accent-600 mt-1">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {displayReport.achievements.length > 0 && (
            <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
              <h3 className="text-xl font-semibold mb-4 text-mono-950 dark:text-mono-50">Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayReport.achievements.map((ach: any) => (
                  <div key={ach.id} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <h4 className="font-semibold text-green-900 dark:text-green-200">{ach.title}</h4>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">{ach.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges */}
          {displayReport.challenges.length > 0 && (
            <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
              <h3 className="text-xl font-semibold mb-4 text-mono-950 dark:text-mono-50">Challenges</h3>
              <div className="space-y-4">
                {displayReport.challenges.map((challenge: any) => (
                  <div key={challenge.id} className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                    <div className="flex items-start space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-900 dark:text-red-200">{challenge.title}</h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">{challenge.description}</p>
                        {challenge.suggestedSolution && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                            <strong>Solution:</strong> {challenge.suggestedSolution}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-12 text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-mono-300 dark:text-mono-700" />
          <h3 className="text-lg font-semibold mb-2 text-mono-950 dark:text-mono-50">No performance reports yet</h3>
          <p className="text-mono-600 dark:text-mono-400 mb-4">
            Generate your first weekly performance report to see analytics and insights
          </p>
          <button
            onClick={generateReport}
            disabled={generating}
            className="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? 'Generating...' : 'Generate First Report'}
          </button>
        </div>
      )}

      {/* Previous Reports */}
      {reports.length > 1 && (
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6 mt-6">
          <h3 className="text-xl font-semibold mb-4 text-mono-950 dark:text-mono-50">Previous Reports</h3>
          <div className="space-y-2">
            {reports.slice(1, 6).map((report) => (
              <div
                key={report.id}
                onClick={() => setCurrentReport(report)}
                className="flex items-center justify-between p-4 bg-mono-50 dark:bg-mono-800 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-700 cursor-pointer transition-colors"
              >
                <div>
                  <p className="font-medium text-mono-950 dark:text-mono-50">
                    Week {report.weekNumber}, {report.year}
                  </p>
                  <p className="text-sm text-mono-600 dark:text-mono-400">
                    {formatNumber(report.summary.totalViews)} views • {formatNumber(report.summary.totalEngagement)} engagement
                  </p>
                </div>
                <Calendar className="w-4 h-4 text-mono-500" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function WeeklyPerformanceReportDashboard() {
  const toolDescription = "Weekly Performance Report Bot generates comprehensive analytics reports every Monday. Fully template-based with zero external API usage."
  const howToUse = "1. Click 'Generate Report' to create a weekly performance report. 2. View summary metrics (views, engagement, reach, clicks, conversion, revenue). 3. Review platform performance across Instagram, Facebook, Website, and Email. 4. Check growth metrics (week-over-week trends). 5. Review recommendations, achievements, and challenges. 6. All reports are generated from pre-defined templates—no external APIs, no usage costs."

  return (
    <ToolAccessGate
      toolSlug="weekly-performance-report-bot"
      toolName="Weekly Performance Report Bot"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <WeeklyPerformanceReportDashboardContent />
    </ToolAccessGate>
  )
}
