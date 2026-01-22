'use client'

import { useState, useEffect } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { 
  Lightbulb, 
  RefreshCw, 
  Calendar,
  CheckCircle2,
  Star,
  Clock,
  TrendingUp,
  Filter,
  Sparkles
} from 'lucide-react'

interface ContentIdea {
  id: string
  title: string
  description: string
  contentType: string
  platforms: string[]
  category: string
  estimatedTime: number
  difficulty: string
  engagementPotential: number
  trending: boolean
  seasonal?: string
  hashtags: string[]
  callToAction: string
  tips: string[]
  examples: string[]
  isUsed: boolean
  weekNumber: number
  year: number
  createdAt: string
}

interface WeeklyPlan {
  id: string
  weekNumber: number
  year: number
  ideas: ContentIdea[]
  status: string
  emailSent: boolean
}

function WeeklyContentIdeasDashboardContent() {
  const [currentPlan, setCurrentPlan] = useState<WeeklyPlan | null>(null)
  const [generating, setGenerating] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showAPIKeys, setShowAPIKeys] = useState(false)
  const [apiKeys, setApiKeys] = useState<{service: string, isActive: boolean}[]>([])
  const [apiKeyInput, setApiKeyInput] = useState({service: '', key: ''})

  useEffect(() => {
    fetchWeeklyPlan()
    fetchAPIKeys()
  }, [])

  const fetchWeeklyPlan = async () => {
    try {
      const response = await fetch('/api/bots/content-ideas/weekly')
      if (response.ok) {
        const data = await response.json()
        if (data.plan) {
          setCurrentPlan(data.plan)
        }
      }
    } catch (error) {
      console.error('Error fetching weekly plan:', error)
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

  const generateNewIdeas = async () => {
    setGenerating(true)
    try {
      const response = await fetch('/api/bots/content-ideas/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 10 })
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentPlan(data.plan)
        setSuccessMessage(`Generated ${data.count} new content ideas!`)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error generating ideas:', error)
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

  const getContentTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      post: '📝',
      story: '📱',
      reel: '🎬',
      carousel: '🖼️',
      video: '🎥',
      live: '📺'
    }
    return icons[type] || '📝'
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }

  const filteredIdeas = currentPlan?.ideas.filter(idea => {
    if (selectedCategory !== 'all' && idea.category !== selectedCategory) return false
    if (selectedDifficulty !== 'all' && idea.difficulty !== selectedDifficulty) return false
    return true
  }) || []

  const categories = ['all', ...new Set(currentPlan?.ideas.map(i => i.category) || [])]

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
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">Weekly Content Ideas Bot</h1>
          <p className="text-mono-600 dark:text-mono-400 mt-1">
            Template-based content idea generation — zero external API usage
          </p>
        </div>
        <button
          onClick={generateNewIdeas}
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
              <Lightbulb className="w-5 h-5" />
              <span>Generate 10 Ideas</span>
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
              All content ideas are generated from pre-defined templates with zero external API usage. 
              No costs, no usage charges, works immediately out of the box.
            </p>
            <div className="mt-3 pt-3 border-t border-blue-300 dark:border-blue-700">
              <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                <strong>Optional Enhancement:</strong> Connect your own API keys (OpenAI, Anthropic) to generate more dynamic ideas. 
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
            Add your own API keys to enhance content idea generation. All usage costs are billed directly to you by the API provider.
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

      {/* Filters */}
      {currentPlan && currentPlan.ideas.length > 0 && (
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
              <span className="text-sm font-medium text-mono-700 dark:text-mono-300">Difficulty:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Current Week's Ideas */}
      {currentPlan && currentPlan.ideas.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
                Week {currentPlan.weekNumber} Content Ideas
              </h2>
              <p className="text-mono-600 dark:text-mono-400">
                {filteredIdeas.length} of {currentPlan.ideas.length} ideas
              </p>
            </div>
            <div className="flex items-center space-x-2 text-mono-600 dark:text-mono-400">
              <Calendar className="w-5 h-5" />
              <span>{currentPlan.year}</span>
            </div>
          </div>

          <div className="grid gap-6">
            {filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                className={`bg-white dark:bg-mono-900 rounded-lg border-2 ${
                  idea.isUsed 
                    ? 'border-gray-300 dark:border-gray-700 opacity-60' 
                    : 'border-mono-200 dark:border-mono-700 hover:shadow-lg'
                } transition-shadow p-6`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{getContentTypeIcon(idea.contentType)}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-mono-950 dark:text-mono-50">
                        {idea.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-mono-100 dark:bg-mono-800 rounded text-mono-600 dark:text-mono-400">
                          {idea.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(idea.difficulty)}`}>
                          {idea.difficulty}
                        </span>
                        {idea.trending && (
                          <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>Trending</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm text-mono-600 dark:text-mono-400 mb-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{idea.engagementPotential}/10</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-mono-600 dark:text-mono-400">
                      <Clock className="w-4 h-4" />
                      <span>{idea.estimatedTime}min</span>
                    </div>
                  </div>
                </div>

                <p className="text-mono-700 dark:text-mono-300 mb-4">{idea.description}</p>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Best Platforms:</p>
                    <div className="flex flex-wrap gap-2">
                      {idea.platforms.map((platform, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-mono-100 dark:bg-mono-800 rounded text-mono-600 dark:text-mono-400">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Call to Action:</p>
                    <p className="text-sm text-mono-600 dark:text-mono-400">{idea.callToAction}</p>
                  </div>
                </div>

                {idea.hashtags.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Suggested Hashtags:</p>
                    <div className="flex flex-wrap gap-2">
                      {idea.hashtags.map((tag, idx) => (
                        <span key={idx} className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {idea.tips.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">💡 Pro Tips:</p>
                    <ul className="text-sm text-mono-600 dark:text-mono-400 space-y-1">
                      {idea.tips.map((tip, idx) => (
                        <li key={idx}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {idea.examples.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">📝 Example Variations:</p>
                    <ul className="text-sm text-mono-600 dark:text-mono-400 space-y-1">
                      {idea.examples.map((example, idx) => (
                        <li key={idx}>• {example}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No ideas yet */}
      {!currentPlan && (
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-12 text-center">
          <Lightbulb className="w-16 h-16 mx-auto mb-4 text-mono-300 dark:text-mono-700" />
          <h3 className="text-lg font-semibold mb-2 text-mono-950 dark:text-mono-50">No content ideas yet</h3>
          <p className="text-mono-600 dark:text-mono-400 mb-4">
            Generate your first batch of 10 weekly content ideas
          </p>
          <button
            onClick={generateNewIdeas}
            disabled={generating}
            className="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate 10 Ideas'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function WeeklyContentIdeasDashboard() {
  const toolDescription = "Weekly Content Ideas Bot generates 10 fresh content ideas every week based on your content themes and preferences. Fully template-based with zero external API usage."
  const howToUse = "1. Click 'Generate 10 Ideas' to create a weekly content plan. 2. Filter by category or difficulty. 3. Review ideas with engagement potential, time estimates, and tips. 4. Ideas are automatically saved to your Content Library. All ideas are generated from pre-defined templates—no external APIs, no usage costs."

  return (
    <ToolAccessGate
      toolSlug="weekly-content-ideas-bot"
      toolName="Weekly Content Ideas Bot"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <WeeklyContentIdeasDashboardContent />
    </ToolAccessGate>
  )
}
