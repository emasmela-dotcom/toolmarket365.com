'use client'

import { useState, useEffect } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Bell, 
  Plus,
  CheckCircle2,
  Users,
  Eye,
  Target,
  Heart,
  BarChart3,
  Sparkles
} from 'lucide-react'

interface SocialAccount {
  id: string
  platform: string
  accountName: string
  accountHandle: string
  avatarUrl?: string
  followerCount: number
  isActive: boolean
  createdAt: string
}

interface EngagementMetrics {
  id: string
  accountId: string
  platform: string
  metricDate: string
  impressions: number
  reach: number
  engagementRate: number
  likes: number
  comments: number
  shares: number
  saves: number
  clicks: number
  followerChange: number
  postsCount: number
  accountName?: string
  accountHandle?: string
}

interface EngagementAlert {
  id: string
  alertType: string
  title: string
  description?: string
  severity: string
  isRead: boolean
  createdAt: string
  accountName?: string
  platform?: string
}

interface DashboardStats {
  totalAccounts: number
  totalImpressions: number
  totalReach: number
  averageEngagementRate: number
  totalFollowerGrowth: number
  activeAlerts: number
}

function EngagementTrackerDashboardContent() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [metrics, setMetrics] = useState<EngagementMetrics[]>([])
  const [alerts, setAlerts] = useState<EngagementAlert[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalAccounts: 0,
    totalImpressions: 0,
    totalReach: 0,
    averageEngagementRate: 0,
    totalFollowerGrowth: 0,
    activeAlerts: 0
  })
  const [loading, setLoading] = useState(true)
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showAPIKeys, setShowAPIKeys] = useState(false)
  const [apiKeys, setApiKeys] = useState<{service: string, isActive: boolean}[]>([])
  const [apiKeyInput, setApiKeyInput] = useState({service: '', key: ''})
  
  const [newAccount, setNewAccount] = useState({
    platform: '',
    accountName: '',
    accountHandle: '',
    followerCount: 0
  })

  useEffect(() => {
    fetchDashboardData()
    fetchAPIKeys()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const [accountsRes, metricsRes, alertsRes] = await Promise.all([
        fetch('/api/bots/engagement-tracker/accounts'),
        fetch('/api/bots/engagement-tracker/metrics?days=30'),
        fetch('/api/bots/engagement-tracker/alerts?unreadOnly=true&limit=10')
      ])

      if (accountsRes.ok) {
        const data = await accountsRes.json()
        setAccounts(data.accounts || [])
      }

      if (metricsRes.ok) {
        const data = await metricsRes.json()
        setMetrics(data.metrics || [])
      }

      if (alertsRes.ok) {
        const data = await alertsRes.json()
        setAlerts(data.alerts || [])
      }

      calculateStats()
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
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

  const calculateStats = () => {
    const totalAccounts = accounts.length
    const totalImpressions = metrics.reduce((sum, m) => sum + m.impressions, 0)
    const totalReach = metrics.reduce((sum, m) => sum + m.reach, 0)
    const averageEngagementRate = metrics.length > 0 
      ? metrics.reduce((sum, m) => sum + m.engagementRate, 0) / metrics.length 
      : 0
    const totalFollowerGrowth = metrics.reduce((sum, m) => sum + m.followerChange, 0)
    const activeAlerts = alerts.filter(a => !a.isRead).length

    setStats({
      totalAccounts,
      totalImpressions,
      totalReach,
      averageEngagementRate: parseFloat(averageEngagementRate.toFixed(2)),
      totalFollowerGrowth,
      activeAlerts
    })
  }

  const addAccount = async () => {
    if (!newAccount.platform || !newAccount.accountName || !newAccount.accountHandle) {
      setSuccessMessage('Platform, account name, and handle are required')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
      return
    }

    try {
      const response = await fetch('/api/bots/engagement-tracker/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount)
      })

      if (response.ok) {
        const data = await response.json()
        setAccounts([data.account, ...accounts])
        setNewAccount({ platform: '', accountName: '', accountHandle: '', followerCount: 0 })
        setShowAddAccount(false)
        setSuccessMessage('Account added successfully!')
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error adding account:', error)
    }
  }

  const generateMetrics = async (accountId: string) => {
    try {
      const response = await fetch('/api/bots/engagement-tracker/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId })
      })

      if (response.ok) {
        const data = await response.json()
        setMetrics([data.metrics, ...metrics])
        setSuccessMessage('Metrics generated successfully!')
        setShowSuccess(true)
        fetchDashboardData()
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error generating metrics:', error)
    }
  }

  const markAlertAsRead = async (alertId: string) => {
    try {
      const response = await fetch(`/api/bots/engagement-tracker/alerts/${alertId}/read`, {
        method: 'POST'
      })

      if (response.ok) {
        setAlerts(alerts.filter(a => a.id !== alertId))
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error marking alert as read:', error)
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

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      instagram: '📷',
      twitter: '🐦',
      facebook: '📘',
      linkedin: '💼',
      tiktok: '🎵',
      youtube: '📺'
    }
    return icons[platform] || '🌐'
  }

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[severity] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

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
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">Engagement Tracker Bot</h1>
          <p className="text-mono-600 dark:text-mono-400 mt-1">
            Template-based engagement tracking — zero external API usage
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddAccount(!showAddAccount)}
            className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Account</span>
          </button>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-mono-200 dark:bg-mono-700 text-mono-900 dark:text-mono-100 rounded-lg hover:bg-mono-300 dark:hover:bg-mono-600 transition-colors"
          >
            Refresh
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
              All engagement metrics and alerts are generated from pre-defined templates with zero external API usage. 
              No costs, no usage charges, works immediately out of the box.
            </p>
            <div className="mt-3 pt-3 border-t border-blue-300 dark:border-blue-700">
              <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                <strong>Optional Enhancement:</strong> Connect your own API keys (Instagram, Twitter, Facebook, LinkedIn APIs) to track real engagement data. 
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
            Add your own API keys to track real engagement data. All usage costs are billed directly to you by the API provider.
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
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
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

      {/* Add Account Form */}
      {showAddAccount && (
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-mono-950 dark:text-mono-50">Add Social Media Account</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Platform *</label>
              <select
                value={newAccount.platform}
                onChange={(e) => setNewAccount({...newAccount, platform: e.target.value})}
                className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
              >
                <option value="">Select platform...</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Account Name *</label>
              <input
                type="text"
                value={newAccount.accountName}
                onChange={(e) => setNewAccount({...newAccount, accountName: e.target.value})}
                placeholder="Your Account Name"
                className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Account Handle *</label>
              <input
                type="text"
                value={newAccount.accountHandle}
                onChange={(e) => setNewAccount({...newAccount, accountHandle: e.target.value})}
                placeholder="@username"
                className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Follower Count</label>
              <input
                type="number"
                value={newAccount.followerCount}
                onChange={(e) => setNewAccount({...newAccount, followerCount: parseInt(e.target.value) || 0})}
                placeholder="0"
                className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={addAccount}
              className="px-6 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
            >
              Add Account
            </button>
            <button
              onClick={() => setShowAddAccount(false)}
              className="px-6 py-2 bg-mono-200 dark:bg-mono-700 text-mono-900 dark:text-mono-100 rounded-lg hover:bg-mono-300 dark:hover:bg-mono-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-mono-600 dark:text-mono-400">Accounts</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{stats.totalAccounts}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-mono-600 dark:text-mono-400">Impressions</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{formatNumber(stats.totalImpressions)}</p>
            </div>
            <Eye className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-mono-600 dark:text-mono-400">Reach</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{formatNumber(stats.totalReach)}</p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-mono-600 dark:text-mono-400">Avg Engagement</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{stats.averageEngagementRate}%</p>
            </div>
            <Heart className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-mono-600 dark:text-mono-400">Follower Growth</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{formatNumber(stats.totalFollowerGrowth)}</p>
            </div>
            {stats.totalFollowerGrowth >= 0 ? 
              <TrendingUp className="w-8 h-8 text-green-500" /> :
              <TrendingDown className="w-8 h-8 text-red-500" />
            }
          </div>
        </div>

        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-mono-600 dark:text-mono-400">Active Alerts</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{stats.activeAlerts}</p>
            </div>
            <Bell className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <h3 className="text-xl font-semibold mb-4 text-mono-950 dark:text-mono-50">Recent Alerts</h3>
          <div className="space-y-3">
            {alerts.length > 0 ? (
              alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 cursor-pointer transition-colors ${
                    alert.severity === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                    alert.severity === 'high' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' :
                    alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                    'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  }`}
                  onClick={() => markAlertAsRead(alert.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <AlertCircle className={`w-5 h-5 ${
                          alert.severity === 'critical' ? 'text-red-600' :
                          alert.severity === 'high' ? 'text-orange-600' :
                          alert.severity === 'medium' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`} />
                        <h4 className="font-semibold text-mono-950 dark:text-mono-50">{alert.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      {alert.description && (
                        <p className="text-sm text-mono-600 dark:text-mono-400 mt-1">{alert.description}</p>
                      )}
                      {alert.platform && (
                        <div className="mt-2">
                          <span className="text-xs text-mono-500 dark:text-mono-500">
                            {getPlatformIcon(alert.platform)} {alert.platform}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-mono-500 dark:text-mono-500">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No alerts</p>
              </div>
            )}
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <h3 className="text-xl font-semibold mb-4 text-mono-950 dark:text-mono-50">Connected Accounts</h3>
          <div className="space-y-3">
            {accounts.length > 0 ? (
              accounts.map(account => (
                <div key={account.id} className="flex items-center justify-between p-3 bg-mono-50 dark:bg-mono-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getPlatformIcon(account.platform)}</span>
                    <div>
                      <p className="font-medium text-mono-950 dark:text-mono-50">{account.accountName}</p>
                      <p className="text-sm text-mono-500 dark:text-mono-500">@{account.accountHandle}</p>
                      <p className="text-xs text-mono-400 dark:text-mono-600">{formatNumber(account.followerCount)} followers</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      account.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}>
                      {account.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => generateMetrics(account.id)}
                      className="text-xs px-3 py-1 bg-accent-600 text-white rounded hover:bg-accent-700 transition-colors"
                    >
                      Generate Metrics
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto mb-2 text-mono-300 dark:text-mono-700" />
                <p className="text-mono-500 dark:text-mono-500 mb-3">No accounts connected</p>
                <button
                  onClick={() => setShowAddAccount(true)}
                  className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm"
                >
                  Connect Account
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Metrics */}
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <h3 className="text-xl font-semibold mb-4 text-mono-950 dark:text-mono-50">Recent Metrics</h3>
          <div className="space-y-3">
            {metrics.slice(0, 5).map(metric => (
              <div key={metric.id} className="p-3 bg-mono-50 dark:bg-mono-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getPlatformIcon(metric.platform)}</span>
                    <div>
                      <p className="font-medium text-sm text-mono-950 dark:text-mono-50">
                        {metric.accountName || metric.platform}
                      </p>
                      <p className="text-xs text-mono-500 dark:text-mono-500">
                        {new Date(metric.metricDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-accent-600 dark:text-accent-400">
                    {metric.engagementRate}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-mono-600 dark:text-mono-400">
                  <div>
                    <span className="font-medium">Impressions:</span> {formatNumber(metric.impressions)}
                  </div>
                  <div>
                    <span className="font-medium">Reach:</span> {formatNumber(metric.reach)}
                  </div>
                  <div className="flex items-center space-x-1">
                    {metric.followerChange >= 0 ? 
                      <TrendingUp className="w-3 h-3 text-green-500" /> :
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    }
                    <span>{formatNumber(metric.followerChange)}</span>
                  </div>
                </div>
              </div>
            ))}
            {metrics.length === 0 && (
              <div className="text-center py-8 text-mono-500 dark:text-mono-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No metrics yet</p>
                <p className="text-xs mt-1">Generate metrics for your accounts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EngagementTrackerDashboard() {
  const toolDescription = "Engagement Tracker Bot monitors your social media engagement rates daily and sends alerts when rates drop or spike. Fully template-based with zero external API usage."
  const howToUse = "1. Add your social media accounts by clicking 'Add Account' and entering platform, name, and handle. 2. Click 'Generate Metrics' on any account to create template-based engagement data. 3. View alerts for engagement drops, spikes, and follower changes. 4. Monitor your engagement trends across all platforms. 5. All tracking is template-based—no external APIs, no usage costs."

  return (
    <ToolAccessGate
      toolSlug="engagement-tracker-bot"
      toolName="Engagement Tracker Bot"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <EngagementTrackerDashboardContent />
    </ToolAccessGate>
  )
}
