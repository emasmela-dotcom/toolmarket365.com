'use client'

import { useState, useEffect } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { 
  Target, 
  RefreshCw, 
  Plus,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Globe,
  Users,
  BarChart3,
  FileText,
  Bell,
  Sparkles
} from 'lucide-react'

interface Competitor {
  id: string
  name: string
  websiteUrl: string
  industry?: string
  companySize?: string
  status: string
  monitoringFrequency: string
  createdAt: string
}

interface CompetitorMetrics {
  id: string
  metricDate: string
  websiteTraffic?: number
  organicTraffic?: number
  paidTraffic?: number
  bounceRate?: number
  domainAuthority?: number
  backlinkCount?: number
  facebookFollowers?: number
  instagramFollowers?: number
  twitterFollowers?: number
  linkedinFollowers?: number
  blogPostsCount?: number
  estimatedAdSpend?: number
}

interface CompetitorAlert {
  id: string
  competitorId?: string
  alertType: string
  title: string
  description?: string
  severity: string
  isRead: boolean
  createdAt: string
}

interface CompetitorReport {
  id: string
  title: string
  reportType: string
  periodStartDate: string
  periodEndDate: string
  executiveSummary?: string
  status: string
  createdAt: string
}

function CompetitorWatchDashboardContent() {
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [alerts, setAlerts] = useState<CompetitorAlert[]>([])
  const [reports, setReports] = useState<CompetitorReport[]>([])
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null)
  const [competitorMetrics, setCompetitorMetrics] = useState<CompetitorMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddCompetitor, setShowAddCompetitor] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showAPIKeys, setShowAPIKeys] = useState(false)
  const [apiKeys, setApiKeys] = useState<{service: string, isActive: boolean}[]>([])
  const [apiKeyInput, setApiKeyInput] = useState({service: '', key: ''})
  
  const [newCompetitor, setNewCompetitor] = useState({
    name: '',
    websiteUrl: '',
    industry: '',
    companySize: '',
    monitoringFrequency: 'weekly'
  })

  useEffect(() => {
    fetchData()
    fetchAPIKeys()
  }, [])

  useEffect(() => {
    if (selectedCompetitor) {
      fetchCompetitorMetrics(selectedCompetitor)
    }
  }, [selectedCompetitor])

  const fetchData = async () => {
    try {
      const [competitorsRes, alertsRes, reportsRes] = await Promise.all([
        fetch('/api/bots/competitors'),
        fetch('/api/bots/competitors/alerts?unreadOnly=true'),
        fetch('/api/bots/competitors/reports')
      ])

      if (competitorsRes.ok) {
        const data = await competitorsRes.json()
        setCompetitors(data.competitors || [])
      }

      if (alertsRes.ok) {
        const data = await alertsRes.json()
        setAlerts(data.alerts || [])
      }

      if (reportsRes.ok) {
        const data = await reportsRes.json()
        setReports(data.reports || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCompetitorMetrics = async (competitorId: string) => {
    try {
      const response = await fetch(`/api/bots/competitors/${competitorId}/metrics?limit=30`)
      if (response.ok) {
        const data = await response.json()
        setCompetitorMetrics(data.metrics || [])
      }
    } catch (error) {
      console.error('Error fetching metrics:', error)
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

  const addCompetitor = async () => {
    if (!newCompetitor.name || !newCompetitor.websiteUrl) {
      setSuccessMessage('Name and website URL are required')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
      return
    }

    try {
      const response = await fetch('/api/bots/competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompetitor)
      })

      if (response.ok) {
        const data = await response.json()
        setCompetitors([data.competitor, ...competitors])
        setNewCompetitor({ name: '', websiteUrl: '', industry: '', companySize: '', monitoringFrequency: 'weekly' })
        setShowAddCompetitor(false)
        setSuccessMessage('Competitor added successfully!')
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error adding competitor:', error)
    }
  }

  const generateMetrics = async (competitorId: string) => {
    try {
      const response = await fetch(`/api/bots/competitors/${competitorId}/metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })

      if (response.ok) {
        const data = await response.json()
        setCompetitorMetrics([data.metrics, ...competitorMetrics])
        setSuccessMessage('Metrics generated successfully!')
        setShowSuccess(true)
        fetchData()
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error generating metrics:', error)
    }
  }

  const generateReport = async () => {
    if (competitors.length === 0) {
      setSuccessMessage('Add at least one competitor first')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
      return
    }

    try {
      const competitorIds = competitors.filter(c => c.status === 'active').map(c => c.id)
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)

      const response = await fetch('/api/bots/competitors/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitorIds,
          reportType: 'monthly',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        })
      })

      if (response.ok) {
        const data = await response.json()
        setReports([data.report, ...reports])
        setSuccessMessage('Report generated successfully!')
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error generating report:', error)
    }
  }

  const markAlertAsRead = async (alertId: string) => {
    try {
      const response = await fetch(`/api/bots/competitors/alerts/${alertId}/read`, {
        method: 'POST'
      })

      if (response.ok) {
        setAlerts(alerts.filter(a => a.id !== alertId))
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
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">Competitor Watch Bot</h1>
          <p className="text-mono-600 dark:text-mono-400 mt-1">
            Template-based competitor monitoring — zero external API usage
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddCompetitor(!showAddCompetitor)}
            className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Competitor</span>
          </button>
          <button
            onClick={generateReport}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>Generate Report</span>
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
              All competitor monitoring and reports are generated from pre-defined templates with zero external API usage. 
              No costs, no usage charges, works immediately out of the box.
            </p>
            <div className="mt-3 pt-3 border-t border-blue-300 dark:border-blue-700">
              <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                <strong>Optional Enhancement:</strong> Connect your own API keys (SimilarWeb, SEMrush, social media APIs) to generate reports with real data. 
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
            Add your own API keys to enhance competitor monitoring with real data. All usage costs are billed directly to you by the API provider.
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
                <option value="similarweb">SimilarWeb</option>
                <option value="semrush">SEMrush</option>
                <option value="ahrefs">Ahrefs</option>
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

      {/* Add Competitor Form */}
      {showAddCompetitor && (
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-mono-950 dark:text-mono-50">Add New Competitor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Competitor Name *</label>
              <input
                type="text"
                value={newCompetitor.name}
                onChange={(e) => setNewCompetitor({...newCompetitor, name: e.target.value})}
                placeholder="Company name"
                className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Website URL *</label>
              <input
                type="url"
                value={newCompetitor.websiteUrl}
                onChange={(e) => setNewCompetitor({...newCompetitor, websiteUrl: e.target.value})}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Industry</label>
              <input
                type="text"
                value={newCompetitor.industry}
                onChange={(e) => setNewCompetitor({...newCompetitor, industry: e.target.value})}
                placeholder="e.g., Digital Marketing"
                className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Company Size</label>
              <select
                value={newCompetitor.companySize}
                onChange={(e) => setNewCompetitor({...newCompetitor, companySize: e.target.value})}
                className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
              >
                <option value="">Select size...</option>
                <option value="small">Small (1-50 employees)</option>
                <option value="medium">Medium (51-500 employees)</option>
                <option value="large">Large (500+ employees)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Monitoring Frequency</label>
              <select
                value={newCompetitor.monitoringFrequency}
                onChange={(e) => setNewCompetitor({...newCompetitor, monitoringFrequency: e.target.value})}
                className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={addCompetitor}
              className="px-6 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
            >
              Add Competitor
            </button>
            <button
              onClick={() => setShowAddCompetitor(false)}
              className="px-6 py-2 bg-mono-200 dark:bg-mono-700 text-mono-900 dark:text-mono-100 rounded-lg hover:bg-mono-300 dark:hover:bg-mono-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-mono-600 dark:text-mono-400">Total Competitors</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{competitors.length}</p>
            </div>
            <Target className="w-8 h-8 text-accent-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-mono-600 dark:text-mono-400">Active Alerts</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{alerts.length}</p>
            </div>
            <Bell className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-mono-600 dark:text-mono-400">Reports Generated</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{reports.length}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-mono-600 dark:text-mono-400">Active Monitoring</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">
                {competitors.filter(c => c.status === 'active').length}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-mono-950 dark:text-mono-50">Recent Alerts</h3>
            <span className="text-sm text-mono-600 dark:text-mono-400">{alerts.length} unread</span>
          </div>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                  alert.severity === 'high' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' :
                  alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                  'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <AlertTriangle className={`w-5 h-5 ${
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
                  </div>
                  <button
                    onClick={() => markAlertAsRead(alert.id)}
                    className="text-sm text-mono-500 hover:text-mono-700 dark:hover:text-mono-300"
                  >
                    Mark Read
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitors List */}
      <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-mono-950 dark:text-mono-50">Your Competitors</h3>
        {competitors.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-16 h-16 mx-auto mb-4 text-mono-300 dark:text-mono-700" />
            <h4 className="text-lg font-semibold mb-2 text-mono-950 dark:text-mono-50">No competitors yet</h4>
            <p className="text-mono-600 dark:text-mono-400 mb-4">
              Add your first competitor to start monitoring
            </p>
            <button
              onClick={() => setShowAddCompetitor(true)}
              className="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
            >
              Add First Competitor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {competitors.map((competitor) => (
              <div
                key={competitor.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCompetitor === competitor.id
                    ? 'border-accent-600 bg-accent-50 dark:bg-accent-900/20'
                    : 'border-mono-200 dark:border-mono-700 hover:border-accent-300 dark:hover:border-accent-700'
                }`}
                onClick={() => setSelectedCompetitor(selectedCompetitor === competitor.id ? null : competitor.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-accent-600" />
                    <div>
                      <h4 className="font-semibold text-mono-950 dark:text-mono-50">{competitor.name}</h4>
                      <p className="text-xs text-mono-500 dark:text-mono-500">{competitor.websiteUrl}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    competitor.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}>
                    {competitor.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-mono-600 dark:text-mono-400 mb-3">
                  {competitor.industry && (
                    <div className="flex justify-between">
                      <span>Industry:</span>
                      <span className="font-medium">{competitor.industry}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Frequency:</span>
                    <span className="font-medium capitalize">{competitor.monitoringFrequency}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    generateMetrics(competitor.id)
                  }}
                  className="w-full px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm"
                >
                  Generate Metrics
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Competitor Metrics */}
      {selectedCompetitor && competitorMetrics.length > 0 && (
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-mono-950 dark:text-mono-50">
            Metrics for {competitors.find(c => c.id === selectedCompetitor)?.name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {competitorMetrics[0] && (
              <>
                {competitorMetrics[0].websiteTraffic && (
                  <div className="bg-mono-50 dark:bg-mono-800 rounded-lg p-4">
                    <p className="text-xs text-mono-600 dark:text-mono-400 mb-1">Website Traffic</p>
                    <p className="text-lg font-bold text-mono-950 dark:text-mono-50">
                      {formatNumber(competitorMetrics[0].websiteTraffic)}
                    </p>
                  </div>
                )}
                {competitorMetrics[0].domainAuthority && (
                  <div className="bg-mono-50 dark:bg-mono-800 rounded-lg p-4">
                    <p className="text-xs text-mono-600 dark:text-mono-400 mb-1">Domain Authority</p>
                    <p className="text-lg font-bold text-mono-950 dark:text-mono-50">
                      {competitorMetrics[0].domainAuthority}
                    </p>
                  </div>
                )}
                {competitorMetrics[0].instagramFollowers && (
                  <div className="bg-mono-50 dark:bg-mono-800 rounded-lg p-4">
                    <p className="text-xs text-mono-600 dark:text-mono-400 mb-1">Instagram</p>
                    <p className="text-lg font-bold text-mono-950 dark:text-mono-50">
                      {formatNumber(competitorMetrics[0].instagramFollowers)}
                    </p>
                  </div>
                )}
                {competitorMetrics[0].facebookFollowers && (
                  <div className="bg-mono-50 dark:bg-mono-800 rounded-lg p-4">
                    <p className="text-xs text-mono-600 dark:text-mono-400 mb-1">Facebook</p>
                    <p className="text-lg font-bold text-mono-950 dark:text-mono-50">
                      {formatNumber(competitorMetrics[0].facebookFollowers)}
                    </p>
                  </div>
                )}
                {competitorMetrics[0].blogPostsCount && (
                  <div className="bg-mono-50 dark:bg-mono-800 rounded-lg p-4">
                    <p className="text-xs text-mono-600 dark:text-mono-400 mb-1">Blog Posts</p>
                    <p className="text-lg font-bold text-mono-950 dark:text-mono-50">
                      {competitorMetrics[0].blogPostsCount}
                    </p>
                  </div>
                )}
                {competitorMetrics[0].estimatedAdSpend && (
                  <div className="bg-mono-50 dark:bg-mono-800 rounded-lg p-4">
                    <p className="text-xs text-mono-600 dark:text-mono-400 mb-1">Est. Ad Spend</p>
                    <p className="text-lg font-bold text-mono-950 dark:text-mono-50">
                      ${formatNumber(competitorMetrics[0].estimatedAdSpend)}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Reports */}
      {reports.length > 0 && (
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <h3 className="text-xl font-semibold mb-4 text-mono-950 dark:text-mono-50">Generated Reports</h3>
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 bg-mono-50 dark:bg-mono-800 rounded-lg border border-mono-200 dark:border-mono-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-mono-950 dark:text-mono-50">{report.title}</h4>
                    <p className="text-sm text-mono-600 dark:text-mono-400">
                      {new Date(report.periodStartDate).toLocaleDateString()} - {new Date(report.periodEndDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    report.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {report.status}
                  </span>
                </div>
                {report.executiveSummary && (
                  <p className="text-sm text-mono-600 dark:text-mono-400 mt-2">{report.executiveSummary}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CompetitorWatchDashboard() {
  const toolDescription = "Competitor Watch Bot monitors your competitors and generates monthly analysis reports. Fully template-based with zero external API usage."
  const howToUse = "1. Add competitors by clicking 'Add Competitor' and entering their name and website. 2. Set monitoring frequency (daily/weekly/monthly). 3. Click 'Generate Metrics' on any competitor to create template-based metrics. 4. View alerts for significant changes. 5. Generate monthly reports comparing all competitors. 6. All monitoring is template-based—no external APIs, no usage costs."

  return (
    <ToolAccessGate
      toolSlug="competitor-watch-bot"
      toolName="Competitor Watch Bot"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <CompetitorWatchDashboardContent />
    </ToolAccessGate>
  )
}
