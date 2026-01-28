'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Key, 
  Zap, 
  Info,
  Sparkles,
  Image,
  BarChart3,
  Video,
  MessageSquare,
  Settings
} from 'lucide-react'
import Link from 'next/link'

interface Integration {
  id: string
  name: string
  description: string
  category: 'ai' | 'social' | 'analytics' | 'other'
  icon: React.ReactNode
  status: 'connected' | 'available' | 'not_configured'
  getKeyUrl: string
  docsUrl?: string
  whatItDoes: string
  costInfo: string
}

const integrations: Integration[] = [
  {
    id: 'openai',
    name: 'OpenAI (GPT-4)',
    description: 'Enhanced AI content generation and analysis',
    category: 'ai',
    icon: <Sparkles className="h-6 w-6" />,
    status: 'available',
    getKeyUrl: 'https://platform.openai.com/api-keys',
    docsUrl: 'https://platform.openai.com/docs',
    whatItDoes: 'Enhances AI-powered tools with GPT-4 for better content generation, analysis, and insights',
    costInfo: 'Pay-as-you-go pricing. ~$0.01-0.03 per request depending on usage.',
  },
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    description: 'Advanced AI for content and analysis',
    category: 'ai',
    icon: <Sparkles className="h-6 w-6" />,
    status: 'available',
    getKeyUrl: 'https://console.anthropic.com/settings/keys',
    docsUrl: 'https://docs.anthropic.com',
    whatItDoes: 'Alternative AI model for content generation and analysis with Claude',
    costInfo: 'Pay-as-you-go pricing. ~$0.008-0.024 per request.',
  },
  {
    id: 'google',
    name: 'Google (Gemini)',
    description: 'Google AI for enhanced features',
    category: 'ai',
    icon: <Sparkles className="h-6 w-6" />,
    status: 'available',
    getKeyUrl: 'https://makersuite.google.com/app/apikey',
    docsUrl: 'https://ai.google.dev/docs',
    whatItDoes: 'Google\'s Gemini AI for content generation and analysis',
    costInfo: 'Free tier available, then pay-as-you-go pricing.',
  },
  {
    id: 'instagram',
    name: 'Instagram API',
    description: 'Connect Instagram for automatic posting',
    category: 'social',
    icon: <Image className="h-6 w-6" />,
    status: 'available',
    getKeyUrl: 'https://developers.facebook.com/apps',
    docsUrl: 'https://developers.facebook.com/docs/instagram-api',
    whatItDoes: 'Enables automatic posting to Instagram via Instagram Scheduler tool',
    costInfo: 'Free for basic posting. Requires Facebook Developer account.',
  },
  {
    id: 'twitter',
    name: 'Twitter / X API',
    description: 'Connect Twitter for automated posting',
    category: 'social',
    icon: <MessageSquare className="h-6 w-6" />,
    status: 'available',
    getKeyUrl: 'https://developer.twitter.com/en/portal/dashboard',
    docsUrl: 'https://developer.twitter.com/en/docs',
    whatItDoes: 'Enables automated posting and engagement tracking on Twitter/X',
    costInfo: 'Free tier available, paid plans start at $100/month for higher limits.',
  },
  {
    id: 'facebook',
    name: 'Facebook API',
    description: 'Connect Facebook for posting and analytics',
    category: 'social',
    icon: <MessageSquare className="h-6 w-6" />,
    status: 'available',
    getKeyUrl: 'https://developers.facebook.com/apps',
    docsUrl: 'https://developers.facebook.com/docs',
    whatItDoes: 'Enables posting and analytics for Facebook pages and groups',
    costInfo: 'Free for basic features. Requires Facebook Developer account.',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn API',
    description: 'Connect LinkedIn for professional content',
    category: 'social',
    icon: <MessageSquare className="h-6 w-6" />,
    status: 'available',
    getKeyUrl: 'https://www.linkedin.com/developers/apps',
    docsUrl: 'https://learn.microsoft.com/en-us/linkedin',
    whatItDoes: 'Enables automated posting and engagement tracking on LinkedIn',
    costInfo: 'Free for basic features. Requires LinkedIn Developer account.',
  },
  {
    id: 'youtube',
    name: 'YouTube API',
    description: 'Connect YouTube for video management',
    category: 'social',
    icon: <Video className="h-6 w-6" />,
    status: 'available',
    getKeyUrl: 'https://console.cloud.google.com/apis/credentials',
    docsUrl: 'https://developers.google.com/youtube/v3',
    whatItDoes: 'Enables video upload, scheduling, and analytics for YouTube',
    costInfo: 'Free quota available. Additional usage may incur costs.',
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Enhanced analytics and insights',
    category: 'analytics',
    icon: <BarChart3 className="h-6 w-6" />,
    status: 'available',
    getKeyUrl: 'https://analytics.google.com/',
    docsUrl: 'https://developers.google.com/analytics',
    whatItDoes: 'Connects Google Analytics data for enhanced reporting and insights',
    costInfo: 'Free for standard analytics. GA4 is free to use.',
  },
]

function IntegrationsPageContent() {
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check which integrations are connected
    const checkConnections = async () => {
      try {
        const response = await fetch('/api/bots/api-keys')
        if (response.ok) {
          const data = await response.json()
          const connected = new Set<string>()
          
          // Check which services have keys (from keys array or keysMap)
          if (data.keys && Array.isArray(data.keys)) {
            data.keys.forEach((key: any) => {
              if (key.isActive) {
                connected.add(key.service)
              }
            })
          } else if (data.keysMap) {
            Object.keys(data.keysMap).forEach(service => {
              if (data.keysMap[service]) {
                connected.add(service)
              }
            })
          }
          
          setConnectedIntegrations(connected)
        }
      } catch (error) {
        console.error('Error checking connections:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkConnections()
  }, [])

  const getIntegrationStatus = (integration: Integration): 'connected' | 'available' | 'not_configured' => {
    if (connectedIntegrations.has(integration.id)) {
      return 'connected'
    }
    return 'available'
  }

  const categories = [
    { id: 'all', label: 'All Integrations' },
    { id: 'ai', label: 'AI Services' },
    { id: 'social', label: 'Social Media' },
    { id: 'analytics', label: 'Analytics' },
  ]

  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredIntegrations = integrations.filter(integration => 
    selectedCategory === 'all' || integration.category === selectedCategory
  )

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Settings className="h-10 w-10 text-accent-600 dark:text-accent-400" />
            <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50">
              Integrations Hub
            </h1>
          </div>
          <p className="text-lg text-mono-600 dark:text-mono-400 max-w-3xl mx-auto mb-4">
            Connect external services to enhance CreatorFlow365 functionality. You pay these services directly—we just make it easy to connect.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-3xl mx-auto mb-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>How it works:</strong> All CreatorFlow365 tools work without integrations. Connect external services to unlock enhanced features—you pay those services directly, not us.
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-lg p-4 max-w-3xl mx-auto">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800 dark:text-green-300">
                <strong>No Usage Charges:</strong> CreatorFlow365 never charges for integration usage. We only track usage for analytics purposes—you pay third-party services directly for their API costs. Your CreatorFlow365 subscription covers the platform; integrations are optional enhancements you pay for separately.
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-accent-600 text-white'
                  : 'bg-white dark:bg-mono-900 text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700 hover:border-accent-500'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Integrations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredIntegrations.map(integration => {
            const status = getIntegrationStatus(integration)
            return (
              <div
                key={integration.id}
                className={`bg-white dark:bg-mono-900 rounded-lg border-2 p-6 transition-all ${
                  status === 'connected'
                    ? 'border-green-500 dark:border-green-600 shadow-lg'
                    : 'border-mono-200 dark:border-mono-700 hover:border-accent-500 dark:hover:border-accent-500'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      status === 'connected'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-mono-100 dark:bg-mono-800 text-mono-600 dark:text-mono-400'
                    }`}>
                      {integration.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-mono-950 dark:text-mono-50">
                        {integration.name}
                      </h3>
                      <p className="text-xs text-mono-500 dark:text-mono-500">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  {status === 'connected' && (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  )}
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  {status === 'connected' ? (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-mono-100 dark:bg-mono-800 text-mono-600 dark:text-mono-400">
                      Available
                    </span>
                  )}
                </div>

                {/* What It Does */}
                <div className="mb-4">
                  <p className="text-sm text-mono-600 dark:text-mono-400 mb-2">
                    <strong className="text-mono-900 dark:text-mono-100">What it does:</strong> {integration.whatItDoes}
                  </p>
                  <p className="text-xs text-mono-500 dark:text-mono-500">
                    <strong>Cost:</strong> {integration.costInfo}
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {status === 'connected' ? (
                    <Link
                      href={`/dashboard?integration=${integration.id}`}
                      className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Connection
                    </Link>
                  ) : (
                    <>
                      <a
                        href={integration.getKeyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm font-medium"
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Get API Key
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </a>
                      {integration.docsUrl && (
                        <a
                          href={integration.docsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center px-4 py-2 bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 rounded-lg hover:bg-mono-200 dark:hover:bg-mono-700 transition-colors text-sm"
                        >
                          View Docs
                          <ExternalLink className="h-3 w-3 ml-2" />
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                Need Help Setting Up Integrations?
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                Each integration enhances specific CreatorFlow365 tools. After getting your API key from the service:
              </p>
              <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside ml-2">
                <li>Click "Get API Key" to visit the service's website</li>
                <li>Create an account and generate an API key</li>
                <li>Return to the tool that uses this integration</li>
                <li>Enter your API key in the tool's settings</li>
                <li>Start using enhanced features!</li>
              </ol>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-3 italic">
                <strong>Remember:</strong> You pay these services directly. CreatorFlow365 never charges for API access or integrations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function IntegrationsPage() {
  return <IntegrationsPageContent />
}
