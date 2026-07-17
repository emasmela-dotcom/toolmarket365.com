'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import Link from 'next/link'
import { Plus, Clock, Globe, BarChart3, Settings, TrendingUp, Heart, MessageCircle, Share, Bookmark, Eye, XCircle, Info, ArrowRight } from 'lucide-react'
import { format, type Locale } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { useLanguage } from '@/lib/i18n/LanguageContext'

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

const copy = {
  en: {
    toolName: 'Instagram Planning & Scheduling',
    toolDescription:
      'Plan, schedule, and manage your Instagram content. Create posts for feed, stories, reels, and IGTV with media uploads, hashtags, and optimal scheduling.',
    howToUse:
      '1. Connect your Instagram account. 2. Create a new post with media and caption. 3. Schedule it for a specific date and time. 4. View all scheduled posts in the calendar view. 5. Posts are automatically published at the scheduled time.',
    title: 'Instagram Scheduler',
    subtitle: 'Plan, schedule, and manage your Instagram content',
    supportedPlatform: 'Supported Platform:',
    createPost: 'Create Post',
    errorLoading: 'Error Loading Data',
    tryAgain: 'Try Again',
    apiSetupTitle: '⚠️ External API Setup Required for Auto-Posting',
    apiSetupBody:
      'This tool works immediately for planning and scheduling posts, but requires Instagram API integration to automatically post to Instagram. You can use it right now to create, schedule, and manage your content calendar. However, posts won\'t automatically publish to your Instagram account until API setup is complete.',
    requiredSetup: 'Required Setup:',
    setupIgApi: 'Instagram API:',
    setupIgApiBody: 'Connect your Instagram account via Facebook Developer credentials (FREE)',
    setupCron: 'Cron Job:',
    setupCronBody: 'Automated task runs hourly to publish scheduled posts (FREE on Vercel)',
    payProviders:
      'You pay API providers directly - ToolMarket365 never charges for API usage. We only track usage for analytics.',
    setUpIntegration: 'Set Up Instagram API Integration',
    howItWorks: 'How It Works',
    howItWorksIntro:
      'Once both are configured, scheduled posts will automatically publish to Instagram at their scheduled times:',
    howStep1Label: '1. Instagram API:',
    howStep1Body: 'Enables automatic posting to your Instagram account',
    howStep2Label: '2. Cron Job:',
    howStep2Body: 'Checks every hour for posts scheduled to publish and triggers the API',
    howNote:
      'Note: You can still use this tool to plan and schedule posts without API setup, but they won\'t automatically publish until configured.',
    totalPosts: 'Total Posts',
    scheduled: 'Scheduled',
    published: 'Published',
    failed: 'Failed',
    accounts: 'Accounts',
    active: 'Active',
    connectedAccounts: 'Connected Accounts',
    connectedAccountsHint: 'Your linked Instagram profiles',
    followers: 'followers',
    inactive: 'Inactive',
    noAccounts: 'No accounts connected',
    connectAccount: 'Connect Account',
    tabs: {
      all: 'all',
      scheduled: 'scheduled',
      published: 'published',
      failed: 'failed',
    },
    statusLabels: {
      draft: 'draft',
      scheduled: 'scheduled',
      published: 'published',
      failed: 'failed',
      cancelled: 'cancelled',
    },
    noPostsYet: 'No posts yet',
    startScheduling: 'Start scheduling your Instagram content',
    createFirstPost: 'Create Your First Post',
    more: 'more',
    created: 'Created',
    edit: 'Edit',
    view: 'View',
    accountsLoadFailed: 'Failed to load accounts',
    postsLoadFailed: 'Failed to load posts',
    unknownError: 'Unknown error',
    networkError: 'Network error. Please check your connection and try again.',
    failedLoadAccounts: 'Failed to load accounts:',
    failedLoadPosts: 'Failed to load posts:',
  },
  es: {
    toolName: 'Planificación y programación de Instagram',
    toolDescription:
      'Planifica, programa y gestiona tu contenido de Instagram. Crea publicaciones para feed, stories, reels e IGTV con medios, hashtags y programación óptima.',
    howToUse:
      '1. Conecta tu cuenta de Instagram. 2. Crea una nueva publicación con medios y pie de foto. 3. Prográmala para una fecha y hora concretas. 4. Ve todas las publicaciones programadas en la vista de calendario. 5. Las publicaciones se publican automáticamente a la hora programada.',
    title: 'Programador de Instagram',
    subtitle: 'Planifica, programa y gestiona tu contenido de Instagram',
    supportedPlatform: 'Plataforma compatible:',
    createPost: 'Crear publicación',
    errorLoading: 'Error al cargar datos',
    tryAgain: 'Reintentar',
    apiSetupTitle: '⚠️ Se requiere configuración de API externa para la publicación automática',
    apiSetupBody:
      'Esta herramienta funciona de inmediato para planificar y programar publicaciones, pero necesita integración con la API de Instagram para publicar automáticamente. Puedes usarla ya para crear, programar y gestionar tu calendario de contenido. Sin embargo, las publicaciones no se publicarán solas en tu cuenta hasta completar la configuración de la API.',
    requiredSetup: 'Configuración requerida:',
    setupIgApi: 'API de Instagram:',
    setupIgApiBody: 'Conecta tu cuenta de Instagram con credenciales de Facebook Developer (GRATIS)',
    setupCron: 'Tarea programada (Cron):',
    setupCronBody: 'Una tarea automática se ejecuta cada hora para publicar las programadas (GRATIS en Vercel)',
    payProviders:
      'Pagas a los proveedores de API directamente: ToolMarket365 nunca cobra por el uso de API. Solo rastreamos el uso para analítica.',
    setUpIntegration: 'Configurar integración de API de Instagram',
    howItWorks: 'Cómo funciona',
    howItWorksIntro:
      'Cuando ambos estén configurados, las publicaciones programadas se publicarán automáticamente en Instagram a su hora:',
    howStep1Label: '1. API de Instagram:',
    howStep1Body: 'Permite publicar automáticamente en tu cuenta de Instagram',
    howStep2Label: '2. Tarea programada (Cron):',
    howStep2Body: 'Revisa cada hora las publicaciones listas para publicar y activa la API',
    howNote:
      'Nota: Puedes seguir usando esta herramienta para planificar y programar sin la API, pero no se publicarán solas hasta configurarla.',
    totalPosts: 'Total de publicaciones',
    scheduled: 'Programadas',
    published: 'Publicadas',
    failed: 'Fallidas',
    accounts: 'Cuentas',
    active: 'Activas',
    connectedAccounts: 'Cuentas conectadas',
    connectedAccountsHint: 'Tus perfiles de Instagram vinculados',
    followers: 'seguidores',
    inactive: 'Inactiva',
    noAccounts: 'No hay cuentas conectadas',
    connectAccount: 'Conectar cuenta',
    tabs: {
      all: 'todas',
      scheduled: 'programadas',
      published: 'publicadas',
      failed: 'fallidas',
    },
    statusLabels: {
      draft: 'borrador',
      scheduled: 'programada',
      published: 'publicada',
      failed: 'fallida',
      cancelled: 'cancelada',
    },
    noPostsYet: 'Aún no hay publicaciones',
    startScheduling: 'Empieza a programar tu contenido de Instagram',
    createFirstPost: 'Crea tu primera publicación',
    more: 'más',
    created: 'Creada',
    edit: 'Editar',
    view: 'Ver',
    accountsLoadFailed: 'Error al cargar cuentas',
    postsLoadFailed: 'Error al cargar publicaciones',
    unknownError: 'Error desconocido',
    networkError: 'Error de red. Comprueba tu conexión e inténtalo de nuevo.',
    failedLoadAccounts: 'Error al cargar cuentas:',
    failedLoadPosts: 'Error al cargar publicaciones:',
  },
}

function InstagramSchedulerContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const dateLocale = language === 'es' ? es : enUS
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
        const errorData = await accountsRes.json().catch(() => ({ error: c.accountsLoadFailed }))
        setError(`${c.failedLoadAccounts} ${errorData.error || c.unknownError}`)
      }

      const postsRes = await fetch('/api/instagram/posts')
      if (postsRes.ok) {
        const postsData = await postsRes.json()
        setPosts(postsData.posts || [])
      } else {
        const errorData = await postsRes.json().catch(() => ({ error: c.postsLoadFailed }))
        if (!error) {
          setError(`${c.failedLoadPosts} ${errorData.error || c.unknownError}`)
        }
      }

      calculateStats()
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(c.networkError)
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

  const tabKeys = ['all', 'scheduled', 'published', 'failed'] as const

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
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">{c.title}</h1>
          <p className="text-mono-600 dark:text-mono-400 mt-1">{c.subtitle}</p>
          
          <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-3 mt-3 inline-block">
            <p className="text-xs font-semibold text-mono-700 dark:text-mono-300 mb-1">{c.supportedPlatform}</p>
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
          {c.createPost}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-medium">{c.errorLoading}</p>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
              <button
                onClick={fetchData}
                className="mt-2 text-sm text-red-700 dark:text-red-300 underline hover:no-underline"
              >
                {c.tryAgain}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-700 rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-3">
          <Info className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-red-900 dark:text-red-200 mb-2">
              {c.apiSetupTitle}
            </h3>
            <p className="text-sm text-red-800 dark:text-red-300 mb-3">
              <strong>{c.apiSetupBody}</strong>
            </p>
            <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-red-200 dark:border-red-800 mb-3">
              <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-2">{c.requiredSetup}</p>
              <ul className="text-sm text-red-800 dark:text-red-300 space-y-2 ml-4">
                <li>• <strong>{c.setupIgApi}</strong> {c.setupIgApiBody}</li>
                <li>• <strong>{c.setupCron}</strong> {c.setupCronBody}</li>
              </ul>
            </div>
            <p className="text-sm text-red-800 dark:text-red-300 mb-3">
              <strong>{c.payProviders}</strong>
            </p>
            <Link
              href="/integrations"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <span>{c.setUpIntegration}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Settings className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">{c.howItWorks}</h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-3">
              {c.howItWorksIntro}
            </p>
            <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-2 mb-3">
              <li className="flex items-start gap-2">
                <span className="font-semibold">{c.howStep1Label}</span>
                <span>{c.howStep1Body}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">{c.howStep2Label}</span>
                <span>{c.howStep2Body}</span>
              </li>
            </ul>
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              <strong>{c.howNote}</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mono-600 dark:text-mono-400">{c.totalPosts}</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{stats.totalPosts}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-accent-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mono-600 dark:text-mono-400">{c.scheduled}</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{stats.scheduledPosts}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mono-600 dark:text-mono-400">{c.published}</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{stats.publishedPosts}</p>
            </div>
            <Globe className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mono-600 dark:text-mono-400">{c.failed}</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{stats.failedPosts}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mono-600 dark:text-mono-400">{c.accounts}</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{stats.totalAccounts}</p>
            </div>
            <Settings className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mono-600 dark:text-mono-400">{c.active}</p>
              <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{stats.activeAccounts}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6 mb-6">
            <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2">{c.connectedAccounts}</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">{c.connectedAccountsHint}</p>
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
                        <p className="text-xs text-mono-500 dark:text-mono-500">{account.follower_count.toLocaleString()} {c.followers}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      account.is_active 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                        : 'bg-mono-100 dark:bg-mono-800 text-mono-600 dark:text-mono-400'
                    }`}>
                      {account.is_active ? c.active : c.inactive}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-mono-500 dark:text-mono-400">{c.noAccounts}</p>
                  <button 
                    className="mt-2 px-3 py-1 text-sm bg-mono-200 dark:bg-mono-800 text-mono-950 dark:text-mono-50 rounded-lg hover:bg-mono-300 dark:hover:bg-mono-700"
                    onClick={() => router.push('/tools/instagram-scheduler/accounts')}
                  >
                    {c.connectAccount}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
            <div className="flex gap-2 mb-4 border-b border-mono-200 dark:border-mono-700">
              {tabKeys.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-accent-600 text-accent-600 dark:text-accent-400'
                      : 'text-mono-600 dark:text-mono-400 hover:text-mono-950 dark:hover:text-mono-50'
                  }`}
                >
                  {c.tabs[tab]}
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
                    labels={c}
                    dateLocale={dateLocale}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Globe className="w-16 h-16 text-mono-300 dark:text-mono-700 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-mono-950 dark:text-mono-50 mb-2">{c.noPostsYet}</h3>
                  <p className="text-mono-600 dark:text-mono-400 mb-6">{c.startScheduling}</p>
                  <button
                    onClick={() => router.push('/tools/instagram-scheduler/create')}
                    className="px-4 py-2 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    {c.createFirstPost}
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

function PostCard({ post, getPostTypeIcon, getStatusColor, formatEngagement, labels, dateLocale }: { 
  post: InstagramPost
  getPostTypeIcon: (type: string) => string
  getStatusColor: (status: string) => string 
  formatEngagement: (data: any) => any
  labels: (typeof copy)['en']
  dateLocale: Locale
}) {
  const engagement = formatEngagement(post.engagement_data)
  const statusLabel = labels.statusLabels[post.status] || post.status

  return (
    <div className="bg-mono-50 dark:bg-mono-800 rounded-lg border border-mono-200 dark:border-mono-700 p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getPostTypeIcon(post.post_type)}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
            {statusLabel}
          </span>
          <span className="text-sm text-mono-600 dark:text-mono-400">@{post.username}</span>
        </div>
        <span className="text-sm text-mono-500 dark:text-mono-500">
          {format(new Date(post.scheduled_for), 'MMM d, h:mm a', { locale: dateLocale })}
        </span>
      </div>
      
      <p className="text-mono-800 dark:text-mono-200 mb-3 line-clamp-3">{post.content}</p>
      
      {post.hashtags && post.hashtags.length > 0 && (
        <div className="mb-3">
          <p className="text-sm text-mono-600 dark:text-mono-400">
            {post.hashtags.slice(0, 5).join(' ')}
            {post.hashtags.length > 5 && ` +${post.hashtags.length - 5} ${labels.more}`}
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
          {labels.created} {format(new Date(post.created_at || post.scheduled_for), 'MMM d, yyyy', { locale: dateLocale })}
        </span>
        <div className="flex space-x-2">
          {post.status === 'scheduled' && (
            <button className="px-3 py-1 text-sm bg-mono-200 dark:bg-mono-700 text-mono-950 dark:text-mono-50 rounded-lg hover:bg-mono-300 dark:hover:bg-mono-600">
              {labels.edit}
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
              {labels.view}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function InstagramSchedulerPage() {
  const { language } = useLanguage()
  const c = copy[language]

  return (
    <ToolAccessGate
      toolSlug="instagram-scheduler"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={c.howToUse}
    >
      <InstagramSchedulerContent />
    </ToolAccessGate>
  )
}
