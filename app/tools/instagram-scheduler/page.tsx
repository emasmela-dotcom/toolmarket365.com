'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import Link from 'next/link'
import { Calendar as CalendarIcon, Plus, Clock, Globe, BarChart3, Settings, TrendingUp, Heart, MessageCircle, Share, Bookmark, Eye, XCircle, Info, ArrowRight } from 'lucide-react';
import { format } from 'date-fns'

interface InstagramAccount {
  id: string
  account_name: string
  username: string
  profile_picture_url: string | null
  follower_count: number
  is_active: boolean
}

interface InstagramPost {
  id: string
  content: string
  media_urls: string[]
  media_types: string[]
  post_type: 'feed' | 'story' | 'reel' | 'igtv'
  caption: string | null
  hashtags: string[] | null
  scheduled_for: string
  status: 'draft' | 'scheduled' | 'published' | 'failed' | 'cancelled'
  posted_at: string | null
  instagram_post_id: string | null
  instagram_permalink_url: string | null
  engagement_data: any | null
  username: string
  account_name: string
  created_at?: string
}

interface DashboardStats {
  totalPosts: number
  scheduledPosts: number
  publishedPosts: number
  failedPosts: number
  totalAccounts: number
  activeAccounts: number
}

function InstagramSchedulerContent() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<InstagramAccount[]>([])
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    scheduledPosts: 0,
    publishedPosts: 0,
    failedPosts: 0,
    totalAccounts: 0,
    activeAccounts: 0
  })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const accountsRes = await fetch('/api/instagram/accounts')
      if (accountsRes.ok) {
        const accountsData = await accountsRes.json()
        setAccounts(accountsData.accounts || [])
      } else {
        const errorData = await accountsRes.json().catch(() => ({ error: 'Failed to load accounts' }))
        setError(`Failed to load accounts: ${errorData.error || 'Unknown error'}`)
      }

      const postsRes = await fetch('/api/instagram/posts')
      if (postsRes.ok) {
        const postsData = await postsRes.json()
        setPosts(postsData.posts || [])
      } else {
        const errorData = await postsRes.json().catch(() => ({ error: 'Failed to load posts' }))
        if (!error) {
          setError(`Failed to load posts: ${errorData.error || 'Unknown error'}`)
        }
      }

      calculateStats()
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    const totalPosts = posts.length
    const scheduledPosts = posts.filter(p => p.status === 'scheduled').length
    const publishedPosts = posts.filter(p => p.status === 'published').length
    const failedPosts = posts.filter(p => p.status === 'failed').length
    const totalAccounts = accounts.length
    const activeAccounts = accounts.filter(a => a.is_active).length

    setStats({
      totalPosts,
      scheduledPosts,
      publishedPosts,
      failedPosts,
      totalAccounts,
      activeAccounts
    })
  }

  useEffect(() => {
    calculateStats()
  }, [posts, accounts])

  const getPostTypeIcon = (postType: string) => {
    const icons: Record<string, string> = {
      feed: '📸',
      story: '📱',
      reel: '🎬',
      igtv: '📺'
    }
    return icons[postType] || '📸'
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-mono-100 dark:bg-mono-800 text-mono-800 dark:text-mono-200',
      scheduled: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
      published: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      failed: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
      cancelled: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200'
    }
    return colors[status] || 'bg-mono-100 dark:bg-mono-800'
  }

  const formatEngagement = (engagementData: any) => {
    if (!engagementData) return null
    return {
      likes: engagementData.likes || 0,
      comments: engagementData.comments || 0,
      shares: engagementData.shares || 0,
      saves: engagementData.saves || 0
    }
  }

  const filteredPosts = activeTab === 'all' 
    ? posts 
    : posts.filter(p => p.status === activeTab)

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">Instagram Scheduler</h1>
          <p className="text-mono-600 dark:text-mono-400 mt-1">Plan, schedule, and manage your Instagram content</p>
          
          {/* Supported Platforms */}
          <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-3 mt-3 inline-block">
            <p className="text-xs font-semibold text-mono-700 dark:text-mono-300 mb-1">Supported Platform:</p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">📸 Instagram</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => router.push('/tools/instagram-scheduler/create')}
          className="px-4 py-2 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Post
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-medium">Error Loading Data</p>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
              <button
                onClick={fetchData}
                className="mt-2 text-sm text-red-700 dark:text-red-300 underline hover:no-underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Setup Notice - Prominent */}
      <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-700 rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-3">
          <Info className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-red-900 dark:text-red-200 mb-2">
              ⚠️ External API Setup Required for Auto-Posting
            </h3>
            <p className="text-sm text-red-800 dark:text-red-300 mb-3">
              <strong>This tool works immediately for planning and scheduling posts, but requires Instagram API integration to automatically post to Instagram.</strong> You can use it right now to create, schedule, and manage your content calendar. However, posts won't automatically publish to your Instagram account until API setup is complete.
            </p>
            <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-red-200 dark:border-red-800 mb-3">
              <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-2">Required Setup:</p>
              <ul className="text-sm text-red-800 dark:text-red-300 space-y-2 ml-4">
                <li>• <strong>Instagram API:</strong> Connect your Instagram account via Facebook Developer credentials (FREE)</li>
                <li>• <strong>Cron Job:</strong> Automated task runs hourly to publish scheduled posts (FREE on Vercel)</li>
              </ul>
            </div>
            <p className="text-sm text-red-800 dark:text-red-300 mb-3">
              <strong>You pay API providers directly</strong> - CreatorFlow365 never charges for API usage. We only track usage for analytics.
            </p>
            <Link
              href="/integrations"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <span>Set Up Instagram API Integration</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Setup Requirements Notice - Additional Details */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Settings className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">How It Works</h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-3">
              Once both are configured, scheduled posts will automatically publish to Instagram at their scheduled times:
            </p>
            <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-2 mb-3">
              <li className="flex items-start gap-2">
                <span className="font-semibold">1. Instagram API:</span>
                <span>Enables automatic posting to your Instagram account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">2. Cron Job:</span>
                <span>Checks every hour for posts scheduled to publish and triggers the API</span>
              </li>
            </ul>
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              <strong>Note:</strong> You can still use this tool to plan and schedule posts without API setup, but they won't automatically publish until configured.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mono-600 dark:text-mono-400">Total Posts</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{stats.totalPosts}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-accent-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mono-600 dark:text-mono-400">Scheduled</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{stats.scheduledPosts}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mono-600 dark:text-mono-400">Published</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{stats.publishedPosts}</p>
            </div>
            <Globe className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mono-600 dark:text-mono-400">Failed</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{stats.failedPosts}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mono-600 dark:text-mono-400">Accounts</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{stats.totalAccounts}</p>
            </div>
            <Settings className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mono-600 dark:text-mono-400">Active</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{stats.activeAccounts}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Connected Accounts */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6 mb-6">
            <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2">Connected Accounts</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">Your linked Instagram profiles</p>
            <div className="space-y-3">
              {accounts.length > 0 ? (
                accounts.map(account => (
                  <div key={account.id} className="flex items-center justify-between p-3 bg-mono-50 dark:bg-mono-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center">
                        <span className="text-accent-600 dark:text-accent-400 font-semibold">@</span>
                      </div>
                      <div>
                        <p className="font-medium text-mono-950 dark:text-mono-50">{account.account_name}</p>
                        <p className="text-sm text-mono-600 dark:text-mono-400">@{account.username}</p>
                        <p className="text-xs text-mono-500 dark:text-mono-500">{account.follower_count.toLocaleString()} followers</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      account.is_active 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                        : 'bg-mono-100 dark:bg-mono-800 text-mono-600 dark:text-mono-400'
                    }`}>
                      {account.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-mono-500 dark:text-mono-400">No accounts connected</p>
                  <button 
                    className="mt-2 px-3 py-1 text-sm bg-mono-200 dark:bg-mono-800 text-mono-950 dark:text-mono-50 rounded-lg hover:bg-mono-300 dark:hover:bg-mono-700"
                    onClick={() => router.push('/tools/instagram-scheduler/accounts')}
                  >
                    Connect Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
            <div className="flex gap-2 mb-4 border-b border-mono-200 dark:border-mono-700">
              {['all', 'scheduled', 'published', 'failed'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-accent-600 text-accent-600 dark:text-accent-400'
                      : 'text-mono-600 dark:text-mono-400 hover:text-mono-950 dark:hover:text-mono-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    getPostTypeIcon={getPostTypeIcon} 
                    getStatusColor={getStatusColor} 
                    formatEngagement={formatEngagement} 
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Globe className="w-16 h-16 text-mono-300 dark:text-mono-700 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-mono-950 dark:text-mono-50 mb-2">No posts yet</h3>
                  <p className="text-mono-600 dark:text-mono-400 mb-6">Start scheduling your Instagram content</p>
                  <button
                    onClick={() => router.push('/tools/instagram-scheduler/create')}
                    className="px-4 py-2 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Create Your First Post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PostCard({ post, getPostTypeIcon, getStatusColor, formatEngagement }: { 
  post: InstagramPost
  getPostTypeIcon: (type: string) => string
  getStatusColor: (status: string) => string 
  formatEngagement: (data: any) => any
}) {
  const engagement = formatEngagement(post.engagement_data)

  return (
    <div className="bg-mono-50 dark:bg-mono-800 rounded-lg border border-mono-200 dark:border-mono-700 p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getPostTypeIcon(post.post_type)}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
            {post.status}
          </span>
          <span className="text-sm text-mono-600 dark:text-mono-400">@{post.username}</span>
        </div>
        <span className="text-sm text-mono-500 dark:text-mono-500">
          {format(new Date(post.scheduled_for), 'MMM d, h:mm a')}
        </span>
      </div>
      
      <p className="text-mono-800 dark:text-mono-200 mb-3 line-clamp-3">{post.content}</p>
      
      {post.hashtags && post.hashtags.length > 0 && (
        <div className="mb-3">
          <p className="text-sm text-mono-600 dark:text-mono-400">
            {post.hashtags.slice(0, 5).join(' ')}
            {post.hashtags.length > 5 && ` +${post.hashtags.length - 5} more`}
          </p>
        </div>
      )}
      
      {post.media_urls && post.media_urls.length > 0 && (
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-sm text-mono-500 dark:text-mono-500">
            {post.media_urls.length} {post.media_types?.[0] === 'video' ? '🎥' : '🖼️'}
          </span>
        </div>
      )}

      {engagement && (
        <div className="flex items-center space-x-4 mb-3 text-sm text-mono-600 dark:text-mono-400">
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4" />
            <span>{engagement.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4" />
            <span>{engagement.comments}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Share className="w-4 h-4" />
            <span>{engagement.shares}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bookmark className="w-4 h-4" />
            <span>{engagement.saves}</span>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-mono-400 dark:text-mono-500">
          Created {format(new Date(post.created_at || post.scheduled_for), 'MMM d, yyyy')}
        </span>
        <div className="flex space-x-2">
          {post.status === 'scheduled' && (
            <button className="px-3 py-1 text-sm bg-mono-200 dark:bg-mono-700 text-mono-950 dark:text-mono-50 rounded-lg hover:bg-mono-300 dark:hover:bg-mono-600">
              Edit
            </button>
          )}
          {post.instagram_permalink_url && (
            <a
              href={post.instagram_permalink_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-sm bg-mono-200 dark:bg-mono-700 text-mono-950 dark:text-mono-50 rounded-lg hover:bg-mono-300 dark:hover:bg-mono-600 flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              View
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function InstagramSchedulerPage() {
  const toolDescription = "Plan, schedule, and manage your Instagram content. Create posts for feed, stories, reels, and IGTV with media uploads, hashtags, and optimal scheduling."
  const howToUse = "1. Connect your Instagram account. 2. Create a new post with media and caption. 3. Schedule it for a specific date and time. 4. View all scheduled posts in the calendar view. 5. Posts are automatically published at the scheduled time."

  return (
    <ToolAccessGate
      toolSlug="instagram-scheduler"
      toolName="Instagram Planning & Scheduling"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <InstagramSchedulerContent />
    </ToolAccessGate>
  )
}
