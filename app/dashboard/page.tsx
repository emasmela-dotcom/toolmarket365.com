'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  Settings, 
  Clock, 
  Star, 
  TrendingUp, 
  BarChart3, 
  Calendar,
  ArrowRight,
  Sparkles,
  FolderOpen,
  FileText,
  Image,
  Video,
  Hash,
  Eye
} from 'lucide-react'

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

const LOCAL_STORAGE_KEY = 'user_dashboard_data'
const FAVORITES_KEY = 'user_favorite_tools'
const ACTIVITY_KEY = 'user_activity_log'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    loadUser()
    loadDashboardData()
  }, [])

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
        setFavorites(data.data.favoriteTools || [])
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

  const loadFromLocalStorage = () => {
    try {
      const storedStats = localStorage.getItem(LOCAL_STORAGE_KEY)
      const storedFavorites = localStorage.getItem(FAVORITES_KEY)
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

      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
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
                {favorites.length || stats?.favoriteTools || 0}
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
                  {favorites.slice(0, 6).map((slug) => {
                    const Icon = getToolIcon(slug)
                    return (
                      <Link
                        key={slug}
                        href={`/tools/${slug}`}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-mono-200 dark:border-mono-700 hover:border-accent-500 dark:hover:border-accent-500 transition-colors"
                      >
                        <Icon className="w-5 h-5 text-accent-600" />
                        <span className="text-sm font-medium text-mono-950 dark:text-mono-50">
                          {getToolName(slug)}
                        </span>
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
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
        </div>
      </main>
    </div>
  )
}
