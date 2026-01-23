'use client'

import { useState, useEffect } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { 
  FileText, 
  RefreshCw, 
  CheckCircle2,
  Copy,
  Trash2,
  Download,
  Clock,
  Target,
  TrendingUp,
  Filter,
  Sparkles
} from 'lucide-react'

interface BlogSection {
  id: string
  title: string
  headingLevel: number
  bulletPoints: string[]
  examples: string[]
  statistics?: string[]
  estimatedWordCount: number
  writingPrompt?: string
  orderIndex: number
}

interface BlogOutline {
  id: string
  title: string
  topic: string
  tone: string
  blogType: string
  estimatedReadTime: number
  wordCountTarget: number
  sections: BlogSection[]
  keyPoints: string[]
  keywords: string[]
  metaDescription: string
  slug: string
  callToAction: string
  contentBrief: string
  seoScore: number
  originalityScore: number
  difficulty: string
  status: string
  createdAt: string
  generatedAt: string
}

function BlogOutlineBotDashboardContent() {
  const [outlines, setOutlines] = useState<BlogOutline[]>([])
  const [generating, setGenerating] = useState(false)
  const [topic, setTopic] = useState('')
  const [blogType, setBlogType] = useState('how-to')
  const [wordCount, setWordCount] = useState('medium')
  const [selectedType, setSelectedType] = useState('all')
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showAPIKeys, setShowAPIKeys] = useState(false)
  const [apiKeys, setApiKeys] = useState<{service: string, isActive: boolean}[]>([])
  const [apiKeyInput, setApiKeyInput] = useState({service: '', key: ''})

  useEffect(() => {
    fetchOutlines()
    fetchAPIKeys()
  }, [])

  const fetchOutlines = async () => {
    try {
      const response = await fetch('/api/bots/blog-outlines')
      if (response.ok) {
        const data = await response.json()
        setOutlines(data.outlines || [])
      }
    } catch (error) {
      console.error('Error fetching outlines:', error)
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

  const generateOutline = async () => {
    if (!topic.trim()) {
      setSuccessMessage('Please enter a topic')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/bots/blog-outlines/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          blogType,
          wordCount: wordCount === 'short' ? 1000 : wordCount === 'medium' ? 1800 : 3000
        })
      })

      if (response.ok) {
        const data = await response.json()
        setOutlines([data.outline, ...outlines])
        setTopic('')
        setSuccessMessage(`Blog outline generated successfully!`)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error generating outline:', error)
    } finally {
      setGenerating(false)
    }
  }

  const deleteOutline = async (outlineId: string) => {
    try {
      const response = await fetch(`/api/bots/blog-outlines/${outlineId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setOutlines(outlines.filter(o => o.id !== outlineId))
        setSuccessMessage('Outline deleted successfully!')
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
      }
    } catch (error) {
      console.error('Error deleting outline:', error)
    }
  }

  const copyOutline = async (outline: BlogOutline) => {
    try {
      const text = `# ${outline.title}\n\n## Meta Description\n${outline.metaDescription}\n\n## Outline\n${outline.sections.map(s => `${'#'.repeat(s.headingLevel)} ${s.title}`).join('\n')}`
      await navigator.clipboard.writeText(text)
      setSuccessMessage('Outline copied to clipboard!')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error('Error copying outline:', error)
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

  const getBlogTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'how-to': '🔧',
      'listicle': '📋',
      'review': '⭐',
      'comparison': '⚖️',
      'case-study': '📊',
      'opinion': '💭',
      'news': '📰'
    }
    return icons[type] || '📝'
  }

  const getToneColor = (tone: string) => {
    const colors: Record<string, string> = {
      professional: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      casual: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      educational: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      persuasive: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      storytelling: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    }
    return colors[tone] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }

  const filteredOutlines = outlines.filter(outline => {
    if (selectedType !== 'all' && outline.blogType !== selectedType) return false
    return true
  })

  const blogTypes = ['all', ...new Set(outlines.map(o => o.blogType))]

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
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">Blog Outline Bot</h1>
          <p className="text-mono-600 dark:text-mono-400 mt-1">
            Template-based blog outline generation — zero external API usage
          </p>
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
              All blog outlines are generated from pre-defined templates with zero external API usage. 
              No costs, no usage charges, works immediately out of the box.
            </p>
            <div className="mt-3 pt-3 border-t border-blue-300 dark:border-blue-700">
              <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                <strong>Optional Enhancement:</strong> Connect your own API keys (OpenAI, Anthropic) to generate more dynamic outlines. 
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
            Add your own API keys to enhance blog outline generation. All usage costs are billed directly to you by the API provider.
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

      {/* Generate New Outline */}
      <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-mono-950 dark:text-mono-50">Generate New Blog Outline</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Blog Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your blog topic (e.g., 'How to improve social media engagement')"
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Blog Type</label>
              <select
                value={blogType}
                onChange={(e) => setBlogType(e.target.value)}
                className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
              >
                <option value="how-to">How-To Guide</option>
                <option value="listicle">Listicle</option>
                <option value="review">Review</option>
                <option value="comparison">Comparison</option>
                <option value="case-study">Case Study</option>
                <option value="opinion">Opinion</option>
                <option value="news">News</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Length</label>
              <select
                value={wordCount}
                onChange={(e) => setWordCount(e.target.value)}
                className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
              >
                <option value="short">Short (800-1200 words)</option>
                <option value="medium">Medium (1200-2000 words)</option>
                <option value="long">Long (2000+ words)</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={generateOutline}
            disabled={generating || !topic.trim()}
            className="w-full px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {generating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Outline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      {outlines.length > 0 && (
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-mono-600 dark:text-mono-400" />
            <span className="text-sm font-medium text-mono-700 dark:text-mono-300">Blog Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
            >
              {blogTypes.map(type => (
                <option key={type} value={type}>{type === 'all' ? 'All Types' : type}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Outlines List */}
      <div className="space-y-6">
        {filteredOutlines.map((outline) => (
          <div
            key={outline.id}
            className="bg-white dark:bg-mono-900 rounded-lg border-2 border-mono-200 dark:border-mono-700 hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-mono-950 dark:text-mono-50 mb-2">
                  {outline.title}
                </h3>
                <p className="text-mono-600 dark:text-mono-400 mb-3">{outline.metaDescription}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`text-xs px-2 py-1 rounded ${getToneColor(outline.tone)}`}>
                    {getBlogTypeIcon(outline.blogType)} {outline.tone}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(outline.difficulty)}`}>
                    {outline.difficulty}
                  </span>
                  <span className="text-xs px-2 py-1 bg-mono-100 dark:bg-mono-800 rounded text-mono-600 dark:text-mono-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{outline.estimatedReadTime} min read</span>
                  </span>
                  <span className="text-xs px-2 py-1 bg-mono-100 dark:bg-mono-800 rounded text-mono-600 dark:text-mono-400 flex items-center space-x-1">
                    <Target className="w-3 h-3" />
                    <span>{outline.wordCountTarget} words</span>
                  </span>
                  {outline.seoScore > 80 && (
                    <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>SEO: {outline.seoScore}/100</span>
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {outline.keywords.slice(0, 5).map((keyword, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => copyOutline(outline)}
                  className="p-2 text-mono-600 dark:text-mono-400 hover:bg-mono-100 dark:hover:bg-mono-800 rounded transition-colors"
                  title="Copy outline"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteOutline(outline.id)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  title="Delete outline"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Content Brief */}
              <div>
                <h4 className="font-semibold mb-2 text-mono-950 dark:text-mono-50">Content Brief</h4>
                <p className="text-sm text-mono-600 dark:text-mono-400">{outline.contentBrief}</p>
              </div>

              {/* Key Points */}
              {outline.keyPoints.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-mono-950 dark:text-mono-50">Key Points</h4>
                  <ul className="text-sm space-y-1 text-mono-600 dark:text-mono-400">
                    {outline.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-accent-600 dark:text-accent-400 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Outline Structure */}
              <div>
                <h4 className="font-semibold mb-2 text-mono-950 dark:text-mono-50">Outline Structure</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {outline.sections.map((section, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 bg-mono-50 dark:bg-mono-800 rounded">
                      <span className="text-mono-500 dark:text-mono-500 font-mono text-xs mt-1">
                        H{section.headingLevel}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-mono-900 dark:text-mono-100">{section.title}</p>
                        {section.bulletPoints.length > 0 && (
                          <ul className="text-xs text-mono-600 dark:text-mono-400 mt-1 space-y-1">
                            {section.bulletPoints.slice(0, 2).map((bp, bpIdx) => (
                              <li key={bpIdx}>• {bp}</li>
                            ))}
                            {section.bulletPoints.length > 2 && (
                              <li className="text-mono-500">+{section.bulletPoints.length - 2} more points</li>
                            )}
                          </ul>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-mono-500 dark:text-mono-500">
                            {section.estimatedWordCount} words
                          </span>
                          {section.examples.length > 0 && (
                            <span className="text-xs text-mono-500 dark:text-mono-500">
                              • {section.examples.length} examples
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div>
                <h4 className="font-semibold mb-2 text-mono-950 dark:text-mono-50">Call to Action</h4>
                <p className="text-sm text-mono-600 dark:text-mono-400">{outline.callToAction}</p>
              </div>

              {/* Meta Info */}
              <div className="flex justify-between items-center pt-4 border-t border-mono-200 dark:border-mono-700 text-sm text-mono-500 dark:text-mono-500">
                <span>Generated {new Date(outline.generatedAt).toLocaleDateString()}</span>
                <span>{outline.sections.length} sections</span>
              </div>
            </div>
          </div>
        ))}

        {/* No outlines yet */}
        {outlines.length === 0 && (
          <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-mono-300 dark:text-mono-700" />
            <h3 className="text-lg font-semibold mb-2 text-mono-950 dark:text-mono-50">No blog outlines yet</h3>
            <p className="text-mono-600 dark:text-mono-400 mb-4">
              Generate your first blog outline by entering a topic above
            </p>
            <button
              onClick={() => {
                const input = document.querySelector('input[type="text"]') as HTMLInputElement
                input?.focus()
              }}
              className="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
            >
              Create First Outline
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BlogOutlineBotDashboard() {
  const toolDescription = "Blog Outline Bot generates comprehensive blog outlines based on your topics. Fully template-based with zero external API usage."
  const howToUse = "1. Enter your blog topic. 2. Select blog type (how-to, listicle, review, etc.) and length. 3. Click 'Generate Outline' to create a structured outline with sections, key points, keywords, and SEO optimization. 4. Copy or export your outline. All outlines are generated from pre-defined templates—no external APIs, no usage costs."

  return (
    <ToolAccessGate
      toolSlug="blog-outline-bot"
      toolName="Blog Outline Bot"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <BlogOutlineBotDashboardContent />
    </ToolAccessGate>
  )
}
