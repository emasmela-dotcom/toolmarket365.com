'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Settings, Clock, Star, TrendingUp, BarChart3, Calendar, ArrowRight, Sparkles, FolderOpen, FileText, Image, Video, Hash, Eye, CheckCircle2, Globe } from 'lucide-react';
import { getPreferences, toggleSaveToLibrary, isSaveToLibraryEnabled } from '@/lib/preferences'

interface DashboardStats {
  totalToolsUsed: number
  favoriteTools: number
  recentActivity: ActivityItem[]
  toolUsage: ToolUsage[]
  accountInfo: {
    email: string
    joinDate: string
    accountType: string
  }
}

interface ActivityItem {
  id: string
  type: 'tool_used' | 'content_created' | 'favorite_added'
  toolName?: string
  toolSlug?: string
  contentTitle?: string
  timestamp: string
  icon: string
}

interface ToolUsage {
  toolName: string
  toolSlug: string
  usageCount: number
  lastUsed: string
  icon: string
}

interface Favorite {
  id: string
  tool_name: string
  tool_category: string
  tool_description?: string
  favorited_at: string
  notes?: string
}

const LOCAL_STORAGE_KEY = 'user_dashboard_data'
const FAVORITES_KEY = 'user_favorite_tools'
const ACTIVITY_KEY = 'user_activity_log'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [usingLocalStorage, setUsingLocalStorage] = useState(false)
  const [saveToLibraryEnabled, setSaveToLibraryEnabled] = useState(true)
  const [trialStatus, setTrialStatus] = useState<{
    status: string
    daysRemaining: number | null
    planName: string | null
  } | null>(null)

  // Load user once on mount
  useEffect(() => {
    loadUser()
    loadTrialStatus()
  }, [])

  const loadTrialStatus = async () => {
    try {
      const res = await fetch('/api/subscriptions/status')
      if (res.ok) {
        const data = await res.json()
        if (data.status) {
          const status = data.status
          let daysRemaining: number | null = null
          
          if (status.status === 'trial' && status.trialEndsAt) {
            const trialEnd = new Date(status.trialEndsAt)
            const now = new Date()
            const days = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            daysRemaining = days > 0 ? days : 0
          }
          
          setTrialStatus({
            status: status.status,
            daysRemaining,
            planName: status.planName
          })
        }
      }
    } catch (error) {
      console.error('Error loading trial status:', error)
    }
  }

  // Load dashboard data and preferences once on mount
  useEffect(() => {
    loadDashboardData()
    
    // Load preferences
    const prefs = getPreferences()
    setSaveToLibraryEnabled(prefs.saveToLibraryEnabled ?? true)
    
    // Check if using localStorage
    const checkStorageMode = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        const data = await response.json()
        if (data.message && data.message.includes('local storage')) {
          setUsingLocalStorage(true)
        } else {
          setUsingLocalStorage(false)
        }
      } catch {
        setUsingLocalStorage(true)
      }
    }
    checkStorageMode()
  }, [])

  // Load favorites when user is available
  useEffect(() => {
    if (user?.id) {
      loadFavorites()
    } else {
      // If no user, try loading from localStorage
      loadFavoritesFromLocalStorage()
    }
  }, [user?.id])
  
  const handleToggleSaveToLibrary = (enabled: boolean) => {
    toggleSaveToLibrary(enabled)
    setSaveToLibraryEnabled(enabled)
  }

  const loadUser = async () => {
    try {
      const res = await fetch('/api/me')
      const data = await res.json().catch(() => null)
      setUser(data?.user || null)
    } catch (error) {
      setUser(null)
    }
  }

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Try to fetch from API
      const response = await fetch('/api/dashboard/stats')
      const data = await response.json()

      if (data.success && data.data) {
        setStats(data.data)
      } else {
        // Fallback to localStorage
        loadFromLocalStorage()
      }
    } catch (error) {
      // Fallback to localStorage
      loadFromLocalStorage()
    } finally {
      setIsLoading(false)
    }
  }

  const loadFavorites = async () => {
    try {
      // Try to fetch favorites from API
      const headers: HeadersInit = {}
      if (user?.id) {
        headers['x-user-id'] = user.id
      }
      
      const response = await fetch('/api/dashboard/favorites', {
        headers
      })
      const data = await response.json()

      if (data.success && Array.isArray(data.data)) {
        setFavorites(data.data)
        // Save to localStorage as fallback
        try {
          localStorage.setItem(FAVORITES_KEY, JSON.stringify(data.data))
        } catch {}
      } else {
        // Fallback to localStorage
        loadFavoritesFromLocalStorage()
      }
    } catch (error) {
      // Fallback to localStorage
      loadFavoritesFromLocalStorage()
    }
  }

  const loadFavoritesFromLocalStorage = () => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY)
      if (storedFavorites) {
        const parsed = JSON.parse(storedFavorites)
        // Handle both old format (string[]) and new format (Favorite[])
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof parsed[0] === 'string') {
            // Old format: convert to Favorite[] format
            setFavorites(parsed.map((slug: string) => ({
              id: slug,
              tool_name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
              tool_category: 'unknown',
              favorited_at: new Date().toISOString()
            })))
          } else {
            // New format: already Favorite[]
            setFavorites(parsed)
          }
        }
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error)
    }
  }

  const loadFromLocalStorage = () => {
    try {
      const storedStats = localStorage.getItem(LOCAL_STORAGE_KEY)
      const storedActivity = localStorage.getItem(ACTIVITY_KEY)

      if (storedStats) {
        const parsed = JSON.parse(storedStats)
        setStats(parsed)
      } else {
        // Initialize with default data
        const defaultStats: DashboardStats = {
          totalToolsUsed: 0,
          favoriteTools: 0,
          recentActivity: [],
          toolUsage: [],
          accountInfo: {
            email: user?.email || 'Guest',
            joinDate: new Date().toISOString(),
            accountType: 'Free'
          }
        }
        setStats(defaultStats)
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
  }

  const getToolIcon = (slug: string) => {
    const iconMap: Record<string, any> = {
      'content-library': FolderOpen,
      'viral-content-predictor': Sparkles,
      'hashtag-research': Hash,
      'content-idea-generator': FileText,
      'video-script-generator': Video,
      'image-alt-text-generator': Image,
      'analytics-dashboard': BarChart3,
      'best-time-to-post': Clock,
    }
    return iconMap[slug] || FileText
  }

  const getToolName = (slug: string) => {
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 flex items-center justify-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Trial Status Banner */}
          {trialStatus && trialStatus.status === 'trial' && trialStatus.daysRemaining !== null && (
            <div className={`mb-6 rounded-lg p-6 border-2 ${
              trialStatus.daysRemaining <= 3
                ? 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600'
            }`}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1">
                  <h3 className={`font-semibold mb-2 ${
                    trialStatus.daysRemaining <= 3
                      ? 'text-red-900 dark:text-red-200'
                      : 'text-blue-900 dark:text-blue-200'
                  }`}>
                    {trialStatus.daysRemaining <= 3
                      ? `⚠️ Trial Ending Soon - ${trialStatus.daysRemaining} Day${trialStatus.daysRemaining !== 1 ? 's' : ''} Left`
                      : `🎉 Free Trial Active - ${trialStatus.daysRemaining} Day${trialStatus.daysRemaining !== 1 ? 's' : ''} Remaining`
                    }
                  </h3>
                  <p className={`text-sm ${
                    trialStatus.daysRemaining <= 3
                      ? 'text-red-800 dark:text-red-300'
                      : 'text-blue-800 dark:text-blue-300'
                  }`}>
                    {trialStatus.daysRemaining <= 3
                      ? 'Subscribe now to keep all content created during your trial. If you don\'t subscribe, your account will be restored to its pre-trial state.'
                      : 'Subscribe anytime during your trial to lock in your content. You can continue using ToolMarket365 or subscribe now to secure your work.'
                    }
                  </p>
                </div>
                <Link
                  href="/checkout"
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                    trialStatus.daysRemaining <= 3
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {trialStatus.daysRemaining <= 3 ? 'Subscribe Now' : 'Subscribe Early'}
                </Link>
              </div>
            </div>
          )}

          {/* localStorage Notice */}
          {usingLocalStorage && (
            <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                    Data Stored Locally in Your Browser
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                    <strong>Good news:</strong> All tools work instantly with local storage—no setup required! <strong>However:</strong> Your dashboard data (favorites, tool usage, activity) is currently stored in your browser's local storage, which means your data is only on this device, won't sync across devices, and may be lost if you clear browser data. <strong>For full benefits and full functionality</strong> (cloud sync, cross-device access, data backup), set up a database connection. <strong>One database setup works for all tools</strong>—configure it once and enjoy cloud storage across your entire ToolMarket365 toolkit.
                  </p>
                  <div className="mt-3">
                    <a
                      href="https://neon.tech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Set up Neon Database (Free)
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-2">
              Dashboard
            </h1>
            <p className="text-mono-600 dark:text-mono-400">
              Welcome back{user ? `, ${user.email.split('@')[0]}` : ''}! Here's your activity overview.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-mono-600 dark:text-mono-400">Tools Used</h3>
                <BarChart3 className="w-5 h-5 text-accent-600" />
              </div>
              <p className="text-3xl font-bold text-mono-950 dark:text-mono-50">
                {stats?.totalToolsUsed || 0}
              </p>
              <p className="text-xs text-mono-500 mt-1">Total tools accessed</p>
            </div>

            <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-mono-600 dark:text-mono-400">Favorites</h3>
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold text-mono-950 dark:text-mono-50">
                {favorites.length || 0}
              </p>
              <p className="text-xs text-mono-500 mt-1">Saved tools</p>
            </div>

            <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-mono-600 dark:text-mono-400">Recent Activity</h3>
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-mono-950 dark:text-mono-50">
                {stats?.recentActivity?.length || 0}
              </p>
              <p className="text-xs text-mono-500 mt-1">Last 30 days</p>
            </div>

            <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-mono-600 dark:text-mono-400">Account Type</h3>
                <User className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-mono-950 dark:text-mono-50">
                {stats?.accountInfo?.accountType || 'Free'}
              </p>
              <p className="text-xs text-mono-500 mt-1">Current plan</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Favorite Tools */}
            <div className="lg:col-span-2 bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Favorite Tools
                </h2>
                <Link
                  href="/tools"
                  className="text-sm text-accent-600 hover:text-accent-700 dark:text-accent-400 font-medium flex items-center"
                >
                  Browse All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              {favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favorites.slice(0, 6).map((fav) => {
                    const slug = fav.tool_name.toLowerCase().replace(/\s+/g, '-')
                    const Icon = getToolIcon(slug)
                    return (
                      <Link
                        key={fav.id}
                        href={`/tools/${slug}`}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-mono-200 dark:border-mono-700 hover:border-accent-500 dark:hover:border-accent-500 transition-colors"
                      >
                        <Icon className="w-5 h-5 text-accent-600" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-mono-950 dark:text-mono-50 block">
                            {fav.tool_name}
                          </span>
                          {fav.tool_category && (
                            <span className="text-xs text-mono-500 dark:text-mono-400 block">
                              {fav.tool_category}
                            </span>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-mono-300 dark:text-mono-700 mx-auto mb-3" />
                  <p className="text-mono-600 dark:text-mono-400 mb-4">No favorite tools yet</p>
                  <Link
                    href="/tools"
                    className="inline-flex items-center px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm"
                  >
                    Explore Tools
                  </Link>
                </div>
              )}
            </div>

            {/* Account Info */}
            <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
              <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-500" />
                Account Info
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-mono-600 dark:text-mono-400 mb-1">Email</p>
                  <p className="text-sm font-medium text-mono-950 dark:text-mono-50">
                    {user?.email || stats?.accountInfo?.email || 'Not signed in'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-mono-600 dark:text-mono-400 mb-1">Member Since</p>
                  <p className="text-sm font-medium text-mono-950 dark:text-mono-50">
                    {stats?.accountInfo?.joinDate 
                      ? new Date(stats.accountInfo.joinDate).toLocaleDateString()
                      : 'Today'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-mono-600 dark:text-mono-400 mb-1">Plan</p>
                  <p className="text-sm font-medium text-mono-950 dark:text-mono-50">
                    {stats?.accountInfo?.accountType || 'Free'}
                  </p>
                </div>
                <Link
                  href="/account"
                  className="inline-flex items-center w-full justify-center px-4 py-2 bg-mono-100 dark:bg-mono-800 text-mono-950 dark:text-mono-50 rounded-lg hover:bg-mono-200 dark:hover:bg-mono-700 transition-colors text-sm font-medium"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Link>
              </div>
            </div>
            
            {/* Preferences/Settings */}
            <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
              <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-6 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-500" />
                Preferences
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-mono-950 dark:text-mono-50 mb-1">
                      Enable Save to Library Feature
                    </h3>
                    <p className="text-xs text-mono-600 dark:text-mono-400">
                      When enabled, "Save to Library" buttons will appear on tool output pages
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={saveToLibraryEnabled}
                      onChange={(e) => handleToggleSaveToLibrary(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-mono-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 dark:peer-focus:ring-accent-800 rounded-full peer dark:bg-mono-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-mono-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-mono-600 peer-checked:bg-accent-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6 bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
            <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Recent Activity
            </h2>
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActivity.slice(0, 10).map((activity) => {
                  const Icon = getToolIcon(activity.toolSlug || '')
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-4 p-3 rounded-lg bg-mono-50 dark:bg-mono-800"
                    >
                      <Icon className="w-5 h-5 text-accent-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-mono-950 dark:text-mono-50">
                          {activity.toolName || 'Activity'}
                        </p>
                        <p className="text-xs text-mono-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {activity.toolSlug && (
                        <Link
                          href={`/tools/${activity.toolSlug}`}
                          className="text-sm text-accent-600 hover:text-accent-700 dark:text-accent-400"
                        >
                          View
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-mono-300 dark:text-mono-700 mx-auto mb-3" />
                <p className="text-mono-600 dark:text-mono-400">No recent activity</p>
                <p className="text-sm text-mono-500 mt-1">Start using tools to see your activity here</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/tools"
              className="flex items-center justify-between p-4 bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 hover:border-accent-500 dark:hover:border-accent-500 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-accent-600" />
                <span className="font-medium text-mono-950 dark:text-mono-50">Browse All Tools</span>
              </div>
              <ArrowRight className="w-4 h-4 text-mono-400" />
            </Link>
            <Link
              href="/tools/content-library"
              className="flex items-center justify-between p-4 bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 hover:border-accent-500 dark:hover:border-accent-500 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FolderOpen className="w-5 h-5 text-accent-600" />
                <span className="font-medium text-mono-950 dark:text-mono-50">Content Library</span>
              </div>
              <ArrowRight className="w-4 h-4 text-mono-400" />
            </Link>
            <Link
              href="/dashboard/content-performance"
              className="flex items-center justify-between p-4 bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 hover:border-accent-500 dark:hover:border-accent-500 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-accent-600" />
                <span className="font-medium text-mono-950 dark:text-mono-50">Performance Dashboard</span>
              </div>
              <ArrowRight className="w-4 h-4 text-mono-400" />
            </Link>
            <Link
              href="/dashboard/verification"
              className="flex items-center justify-between p-4 bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 hover:border-accent-500 dark:hover:border-accent-500 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-accent-600" />
                <span className="font-medium text-mono-950 dark:text-mono-50">Creator Verification</span>
              </div>
              <ArrowRight className="w-4 h-4 text-mono-400" />
            </Link>
            <Link
              href="/tools/instagram-scheduler"
              className="flex items-center justify-between p-4 bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 hover:border-accent-500 dark:hover:border-accent-500 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-accent-600" />
                <span className="font-medium text-mono-950 dark:text-mono-50">Instagram Scheduler</span>
              </div>
              <ArrowRight className="w-4 h-4 text-mono-400" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
