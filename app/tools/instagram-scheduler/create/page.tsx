'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { Globe, Plus, X, Hash, AtSign, MapPin, Send, Save, Settings, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface InstagramAccount {
  id: string
  account_name: string
  username: string
  profile_picture_url: string | null
  is_active: boolean
}

const POST_TYPE_LIMITS: Record<string, number> = {
  feed: 2200,
  story: 150,
  reel: 150,
  igtv: 2200
}

function CreateInstagramPostContent() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<InstagramAccount[]>([])
  const [loading, setLoading] = useState(false)
  const [hashtagInput, setHashtagInput] = useState('')
  const [mentionInput, setMentionInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [form, setForm] = useState({
    accountId: '',
    content: '',
    mediaUrls: [] as string[],
    mediaTypes: ['image'] as string[],
    postType: 'feed',
    caption: '',
    hashtags: [] as string[],
    mentions: [] as string[],
    locationName: '',
    scheduledFor: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  })

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/instagram/accounts')
      if (response.ok) {
        const data = await response.json()
        setAccounts(data.accounts || [])
        if (data.accounts && data.accounts.length > 0) {
          setForm(prev => ({ ...prev, accountId: data.accounts[0].id }))
        } else {
          setError('No Instagram accounts found. Please connect an account first.')
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to load accounts' }))
        setError(errorData.error || 'Failed to load Instagram accounts')
      }
    } catch (error) {
      console.error('Error fetching accounts:', error)
      setError('Failed to load Instagram accounts. Please try again.')
    }
  }

  const addHashtag = () => {
    if (hashtagInput.trim()) {
      const newHashtag = hashtagInput.trim().replace(/\s+/g, '')
      if (!newHashtag.startsWith('#')) {
        const hashtag = '#' + newHashtag
        if (!form.hashtags.includes(hashtag)) {
          setForm(prev => ({ ...prev, hashtags: [...prev.hashtags, hashtag] }))
        }
      } else if (!form.hashtags.includes(newHashtag)) {
        setForm(prev => ({ ...prev, hashtags: [...prev.hashtags, newHashtag] }))
      }
      setHashtagInput('')
    }
  }

  const removeHashtag = (index: number) => {
    setForm(prev => ({ ...prev, hashtags: prev.hashtags.filter((_, i) => i !== index) }))
  }

  const addMention = () => {
    if (mentionInput.trim()) {
      const newMention = mentionInput.trim().replace(/\s+/g, '').replace('@', '')
      if (!form.mentions.includes(newMention)) {
        setForm(prev => ({ ...prev, mentions: [...prev.mentions, newMention] }))
      }
      setMentionInput('')
    }
  }

  const removeMention = (index: number) => {
    setForm(prev => ({ ...prev, mentions: prev.mentions.filter((_, i) => i !== index) }))
  }

  const getCharacterLimit = () => {
    return POST_TYPE_LIMITS[form.postType] || 2200
  }

  const currentLength = form.content.length
  const characterLimit = getCharacterLimit()
  const isNearLimit = characterLimit && currentLength > characterLimit * 0.9

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.accountId || !form.content || form.mediaUrls.length === 0) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      
      const response = await fetch('/api/instagram/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accountId: form.accountId,
          content: form.content,
          mediaUrls: form.mediaUrls,
          mediaTypes: form.mediaTypes,
          postType: form.postType,
          caption: form.caption,
          hashtags: form.hashtags,
          mentions: form.mentions,
          locationName: form.locationName || undefined,
          scheduledFor: new Date(form.scheduledFor).toISOString(),
          timezone: form.timezone
        })
      })

      if (response.ok) {
        router.push('/tools/instagram-scheduler')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to schedule post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to schedule post')
    } finally {
      setLoading(false)
    }
  }

  if (accounts.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-12 text-center">
          <Instagram className="w-16 h-16 text-mono-300 dark:text-mono-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-mono-950 dark:text-mono-50 mb-2">No Instagram Accounts</h3>
          <p className="text-mono-600 dark:text-mono-400 mb-6">Connect an Instagram account to start scheduling posts.</p>
          <button
            onClick={() => router.push('/tools/instagram-scheduler/accounts')}
            className="px-4 py-2 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors"
          >
            Connect Instagram Account
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">Create Instagram Post</h1>
          <p className="text-mono-600 dark:text-mono-400 mt-1">Schedule content for your Instagram accounts</p>
        </div>
        <button
          onClick={() => router.push('/tools/instagram-scheduler')}
          className="px-4 py-2 bg-mono-200 dark:bg-mono-800 text-mono-950 dark:text-mono-50 font-medium rounded-lg hover:bg-mono-300 dark:hover:bg-mono-700 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-green-800 dark:text-green-200 font-medium">{success}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-medium">Error</p>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Setup Requirements Notice */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Settings className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">⚠️ Setup Required for Auto-Posting</h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-2">
              <strong>Both Instagram API setup and a cron job are required</strong> for posts to automatically publish:
            </p>
            <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1 list-disc list-inside">
              <li><strong>Instagram API:</strong> Facebook Developer credentials (FREE) needed to actually post to Instagram</li>
              <li><strong>Cron Job:</strong> Automated task (runs every hour, FREE on Vercel) that publishes posts at scheduled times</li>
            </ul>
            <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-2">
              Without both, posts will be scheduled but won't auto-publish.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Account Selection */}
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2">Select Account</h2>
          <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">Choose which Instagram account to post to</p>
          <select
            value={form.accountId}
            onChange={(e) => setForm(prev => ({ ...prev, accountId: e.target.value }))}
            className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
            required
          >
            <option value="">Select an Instagram account</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.account_name} (@{account.username})
              </option>
            ))}
          </select>
        </div>

        {/* Post Type */}
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2">Post Type</h2>
          <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">Choose the type of Instagram post</p>
          <select
            value={form.postType}
            onChange={(e) => setForm(prev => ({ ...prev, postType: e.target.value }))}
            className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
          >
            <option value="feed">📸 Feed Post</option>
            <option value="story">📱 Story</option>
            <option value="reel">🎬 Reel</option>
            <option value="igtv">📺 IGTV</option>
          </select>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2">Post Content</h2>
          <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">Write your Instagram caption</p>
          <textarea
            value={form.content}
            onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Write your Instagram caption..."
            className="w-full min-h-[150px] px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50 resize-none"
            required
            maxLength={characterLimit}
          />
          <div className="flex justify-between items-center mt-2">
            <span className={`text-sm ${isNearLimit ? 'text-red-500' : 'text-mono-500 dark:text-mono-500'}`}>
              {currentLength}/{characterLimit} characters
            </span>
          </div>
        </div>

        {/* Hashtags */}
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2">Hashtags</h2>
          <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">Add relevant hashtags to increase reach</p>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
              placeholder="Enter hashtag (e.g., marketing)"
              className="flex-1 px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
            />
            <button
              type="button"
              onClick={addHashtag}
              className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 flex items-center gap-2"
            >
              <Hash className="w-4 h-4" />
              Add
            </button>
          </div>
          {form.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-200 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeHashtag(index)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Mentions */}
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2">Mentions</h2>
          <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">Tag other accounts</p>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={mentionInput}
              onChange={(e) => setMentionInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMention())}
              placeholder="Enter username (e.g., username)"
              className="flex-1 px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
            />
            <button
              type="button"
              onClick={addMention}
              className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 flex items-center gap-2"
            >
              <AtSign className="w-4 h-4" />
              Add
            </button>
          </div>
          {form.mentions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.mentions.map((mention, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2"
                >
                  @{mention}
                  <button
                    type="button"
                    onClick={() => removeMention(index)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Schedule */}
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2">Schedule</h2>
          <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">When should this post be published?</p>
          <input
            type="datetime-local"
            value={form.scheduledFor}
            onChange={(e) => setForm(prev => ({ ...prev, scheduledFor: e.target.value }))}
            className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
            required
          />
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Scheduling...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Schedule Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function CreateInstagramPostPage() {
  const toolDescription = "Create and schedule Instagram posts with media, hashtags, mentions, and optimal timing. Supports feed posts, stories, reels, and IGTV."
  const howToUse = "1. Select your Instagram account. 2. Choose post type (feed, story, reel, IGTV). 3. Write your caption. 4. Add hashtags and mentions. 5. Set the schedule date and time. 6. Click 'Schedule Post'."

  return (
    <ToolAccessGate
      toolSlug="instagram-scheduler"
      toolName="Create Instagram Post"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <CreateInstagramPostContent />
    </ToolAccessGate>
  )
}
