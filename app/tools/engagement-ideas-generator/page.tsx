'use client'

import React, { useState } from 'react'
import { Lightbulb, RefreshCw, Copy, Check } from 'lucide-react';

const engagementIdeas = {
  instagram: [
    'Post a "This or That" story poll',
    'Ask followers to share their favorite tip in comments',
    'Create a carousel with "Save this post" call-to-action',
    'Share a behind-the-scenes Reel',
    'Host a Q&A in Stories',
    'Run a "Caption this photo" contest',
    'Share user-generated content and tag creators',
    'Post a "Rate this 1-10" interactive sticker',
    'Create a "Tell me your..." question sticker',
    'Share a "Day in my life" Reel',
    'Post a "What should I post next?" poll',
    'Share a tutorial with "Save for later" reminder',
    'Create a "Before & After" comparison post',
    'Ask followers to share their biggest challenge',
    'Post a "Fill in the blank" story',
  ],
  tiktok: [
    'Create a "POV: You..." video',
    'Make a "Tell me without telling me" video',
    'Share a "Day in my life" vlog',
    'Create a "Get ready with me" video',
    'Make a "This vs That" comparison',
    'Share a "Storytime" video',
    'Create a "Try not to laugh" challenge',
    'Make a "Things that just make sense" video',
    'Share a "Tips that changed my life" video',
    'Create a "Rate my..." video',
    'Make a "Tell me your unpopular opinion" video',
    'Share a "Things I wish I knew" video',
    'Create a "POV: You\'re..." character video',
    'Make a "This is why..." educational video',
    'Share a "Day in my life" with transitions',
  ],
  youtube: [
    'Create a "10 Things I Wish I Knew" video',
    'Share a "Day in my life" vlog',
    'Make a "Reacting to..." video',
    'Create a "How I..." tutorial',
    'Share a "Storytime" video',
    'Make a "Testing..." experiment video',
    'Create a "Q&A" video',
    'Share a "Behind the scenes" video',
    'Make a "Things that changed my life" video',
    'Create a "Ranking..." video',
    'Share a "Get ready with me" video',
    'Make a "This vs That" comparison',
    'Create a "Tips for..." educational video',
    'Share a "My honest thoughts on..." video',
    'Make a "Trying..." challenge video',
  ],
  twitter: [
    'Post a "What\'s your unpopular opinion?" thread',
    'Share a "Things I wish I knew" thread',
    'Create a "Tell me without telling me" tweet',
    'Post a "Hot take:" controversial opinion',
    'Share a "This is why..." educational thread',
    'Create a "POV: You\'re..." relatable tweet',
    'Post a "Rate my..." poll',
    'Share a "Storytime" thread',
    'Create a "Things that just make sense" tweet',
    'Post a "What\'s your..." question',
    'Share a "Tips that changed my life" thread',
    'Create a "This vs That" comparison thread',
    'Post a "Tell me your..." question',
    'Share a "Things I learned..." thread',
    'Create a "POV:" character tweet',
  ],
  linkedin: [
    'Share a "Lessons learned" post',
    'Post a "What I wish I knew" article',
    'Create a "This is why..." educational post',
    'Share a "Behind the scenes" story',
    'Post a "Tips for..." professional advice',
    'Create a "Things that changed my career" post',
    'Share a "My honest thoughts on..." post',
    'Post a "What\'s your take?" question',
    'Create a "This vs That" comparison',
    'Share a "Storytime" professional experience',
    'Post a "Lessons from..." reflection',
    'Create a "Tips that helped me" post',
    'Share a "Things I learned" post',
    'Post a "What\'s your biggest challenge?" question',
    'Create a "This is how I..." tutorial post',
  ],
  facebook: [
    'Post a "What\'s your favorite..." question',
    'Share a "This is why..." educational post',
    'Create a "Tell me your..." discussion post',
    'Post a "Rate this 1-10" poll',
    'Share a "Things I learned" post',
    'Create a "Before & After" comparison',
    'Post a "What\'s your take?" question',
    'Share a "Tips that helped me" post',
    'Create a "This vs That" comparison',
    'Post a "Storytime" post',
    'Share a "Things that changed my life" post',
    'Create a "Tell me without telling me" post',
    'Post a "What\'s your biggest challenge?" question',
    'Share a "Lessons learned" post',
    'Create a "POV: You\'re..." relatable post',
  ],
}

const platformNames: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  twitter: 'Twitter / X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
}

function EngagementIdeasGeneratorContent() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram')
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  const generateIdeas = (count: number = 5) => {
    const ideas = engagementIdeas[selectedPlatform as keyof typeof engagementIdeas] as string[]
    if (!ideas) return

    const shuffled = [...ideas].sort(() => Math.random() - 0.5)
    setGeneratedIdeas(shuffled.slice(0, count))
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  React.useEffect(() => {
    generateIdeas(5)
  }, [selectedPlatform])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Lightbulb className="h-10 w-10 text-accent-600 dark:text-accent-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Engagement Ideas Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Generate platform-specific engagement ideas to boost interaction and grow your audience.
          </p>
        </div>

        {/* Documentation */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How to Use This Tool</h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">What It Does</h3>
              <p>Generates platform-specific content ideas designed to boost engagement, comments, shares, and saves. Each idea is tailored to what works best on that platform.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Select your platform:</strong> Choose Instagram, TikTok, YouTube, etc.</li>
                <li><strong>View generated ideas:</strong> See 5 engagement ideas automatically generated</li>
                <li><strong>Generate more:</strong> Click "Generate New Ideas" for different suggestions</li>
                <li><strong>Copy ideas:</strong> Click the copy button next to any idea you like</li>
                <li><strong>Use them:</strong> Implement these ideas in your content strategy</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Fresh engagement ideas tailored to your platform</li>
                <li>Content concepts proven to boost interaction</li>
                <li>Inspiration when you're stuck on what to post</li>
                <li>Platform-specific strategies that work</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Platform Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Platform
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(engagementIdeas).map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPlatform === platform
                    ? 'bg-accent-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {platformNames[platform]}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="mb-6">
          <button
            onClick={() => generateIdeas(5)}
            className="flex items-center space-x-2 px-6 py-3 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Generate New Ideas</span>
          </button>
        </div>

        {/* Generated Ideas */}
        {generatedIdeas.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Engagement Ideas for {platformNames[selectedPlatform]}
            </h2>
            <div className="space-y-3">
              {generatedIdeas.map((idea, index) => {
                const ideaId = `${selectedPlatform}-${index}`
                return (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-start justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <p className="text-gray-900 dark:text-white flex-1 pr-4">{idea}</p>
                    <button
                      onClick={() => copyToClipboard(idea, ideaId)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors flex-shrink-0"
                      title="Copy idea"
                    >
                      {copied === ideaId ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <Copy className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function EngagementIdeasGeneratorPage() {
  return <EngagementIdeasGeneratorContent />
}
