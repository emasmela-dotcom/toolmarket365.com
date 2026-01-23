'use client'

import { useState, useEffect } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { 
  Sparkles, 
  Copy, 
  RefreshCw, 
  Calendar,
  CheckCircle2,
  X,
  Filter,
  Download
} from 'lucide-react'

interface Caption {
  id: string
  content: string
  tone: string
  theme: string
  platform: string
  hashtags: string[]
  emojis: string[]
  category: string
  isUsed: boolean
  createdAt: string
}

function CaptionBotDashboardContent() {
  const [captions, setCaptions] = useState<Caption[]>([])
  const [generating, setGenerating] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedTone, setSelectedTone] = useState('all')
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [apiKeys, setApiKeys] = useState<Array<{service: string, hasKey: boolean}>>([])
  const [apiKeyInput, setApiKeyInput] = useState({service: '', key: ''})
  const [showAPIKeys, setShowAPIKeys] = useState(false)

  useEffect(() => {
    fetchDailyCaptions()
    fetchAPIKeys()
  }, [])

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

  const fetchDailyCaptions = async () => {
    try {
      const response = await fetch('/api/bots/captions/daily')
      if (response.ok) {
        const data = await response.json()
        setCaptions(data.captions || [])
      }
    } catch (error) {
      console.error('Error fetching captions:', error)
    }
  }

  const generateNewCaptions = async () => {
    setGenerating(true)
    try {
      const response = await fetch('/api/bots/captions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: 5,
          platforms: selectedPlatform === 'all' ? undefined : [selectedPlatform],
          tone: selectedTone === 'all' ? undefined : selectedTone
        })
      })

      if (response.ok) {
        const data = await response.json()
        setCaptions([...data.captions, ...captions])
        setSuccessMessage(`Generated ${data.count} new captions!`)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error generating captions:', error)
    } finally {
      setGenerating(false)
    }
  }

  const markAsUsed = async (captionId: string) => {
    try {
      const response = await fetch(`/api/bots/captions/${captionId}/use`, {
        method: 'POST'
      })

      if (response.ok) {
        setCaptions(captions.map(c => 
          c.id === captionId ? { ...c, isUsed: true } : c
        ))
        setSuccessMessage('Caption marked as used!')
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
      }
    } catch (error) {
      console.error('Error marking caption as used:', error)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setSuccessMessage('Caption copied to clipboard!')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      instagram: '📸',
      facebook: '📘',
      twitter: '🐦',
      linkedin: '💼',
      tiktok: '🎵'
    }
    return icons[platform] || '📝'
  }

  const getToneColor = (tone: string) => {
    const colors: Record<string, string> = {
      professional: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      casual: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      funny: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      inspirational: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      educational: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    }
    return colors[tone] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }

  const filteredCaptions = captions.filter(caption => {
    if (selectedPlatform !== 'all' && caption.platform !== selectedPlatform) return false
    if (selectedTone !== 'all' && caption.tone !== selectedTone) return false
    return true
  })

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
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">Daily Caption Bot</h1>
          <p className="text-mono-600 dark:text-mono-400 mt-1">
            Template-based caption generation — zero external API usage
          </p>
        </div>
        <button
          onClick={generateNewCaptions}
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
              <span>Generate Captions</span>
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
              All captions are generated from pre-defined templates with zero external API usage. 
              No costs, no usage charges, works immediately out of the box.
            </p>
            <div className="mt-3 pt-3 border-t border-blue-300 dark:border-blue-700">
              <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                <strong>Optional Enhancement:</strong> Connect your own API keys (OpenAI, Anthropic) to generate more dynamic captions. 
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
            Add your own API keys to enhance caption generation. All usage costs are billed directly to you by the API provider.
          </p>

          {/* Existing Keys */}
          {apiKeys.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Active API Keys:</p>
              <div className="space-y-2">
                {apiKeys.map((key) => (
                  <div key={key.service} className="flex items-center justify-between p-3 bg-mono-50 dark:bg-mono-800 rounded">
                    <div>
                      <span className="font-medium capitalize text-mono-900 dark:text-mono-100">{key.service}</span>
                      {key.hasKey && (
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

          {/* Add New Key */}
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
      <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-mono-600 dark:text-mono-400" />
            <span className="text-sm font-medium text-mono-700 dark:text-mono-300">Platform:</span>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="all">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter</option>
              <option value="linkedin">LinkedIn</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-mono-700 dark:text-mono-300">Tone:</span>
            <select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value)}
              className="px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="all">All Tones</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="funny">Funny</option>
              <option value="inspirational">Inspirational</option>
              <option value="educational">Educational</option>
            </select>
          </div>
        </div>
      </div>

      {/* Captions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCaptions.map((caption) => (
          <div
            key={caption.id}
            className={`bg-white dark:bg-mono-900 rounded-lg border-2 ${
              caption.isUsed 
                ? 'border-gray-300 dark:border-gray-700 opacity-60' 
                : 'border-mono-200 dark:border-mono-700 hover:shadow-lg'
            } transition-shadow p-6`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getPlatformIcon(caption.platform)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-mono-950 dark:text-mono-50 capitalize">
                    {caption.platform}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded ${getToneColor(caption.tone)}`}>
                    {caption.tone}
                  </span>
                </div>
              </div>
              {caption.isUsed && (
                <span className="text-xs text-green-600 dark:text-green-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Used</span>
                </span>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-mono-50 dark:bg-mono-800 rounded-lg">
                <p className="text-sm leading-relaxed text-mono-700 dark:text-mono-300">
                  {caption.content}
                </p>
              </div>
              
              {caption.hashtags.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-2 text-mono-600 dark:text-mono-400">Hashtags:</p>
                  <div className="flex flex-wrap gap-1">
                    {caption.hashtags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-mono-100 dark:bg-mono-800 rounded text-mono-600 dark:text-mono-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {caption.emojis.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-2 text-mono-600 dark:text-mono-400">Emojis:</p>
                  <div className="text-lg">
                    {caption.emojis.join(' ')}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 border-t border-mono-200 dark:border-mono-700">
                <div className="text-xs text-mono-500 dark:text-mono-500">
                  {new Date(caption.createdAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(caption.content)}
                    className="p-2 text-mono-600 dark:text-mono-400 hover:bg-mono-100 dark:hover:bg-mono-800 rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {!caption.isUsed && (
                    <button
                      onClick={() => markAsUsed(caption.id)}
                      className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                      title="Mark as used"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCaptions.length === 0 && (
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-12 text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-mono-300 dark:text-mono-700" />
          <h3 className="text-lg font-semibold mb-2 text-mono-950 dark:text-mono-50">No captions yet</h3>
          <p className="text-mono-600 dark:text-mono-400 mb-4">
            Generate your first batch of template-based captions
          </p>
          <button
            onClick={generateNewCaptions}
            disabled={generating}
            className="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate Captions'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function CaptionBotDashboard() {
  const toolDescription = "Daily Caption Bot generates 3-5 captions daily based on your content theme and tone preferences. Fully template-based with zero external API usage."
  const howToUse = "1. Click 'Generate Captions' to create a batch of 5 captions. 2. Filter by platform or tone using the dropdowns. 3. Copy captions to clipboard or mark them as used. 4. Captions are automatically saved to your Content Library. All captions are generated from pre-defined templates—no external APIs, no usage costs."

  return (
    <ToolAccessGate
      toolSlug="daily-caption-bot"
      toolName="Daily Caption Bot"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <CaptionBotDashboardContent />
    </ToolAccessGate>
  )
}
