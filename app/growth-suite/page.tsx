'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Users, Briefcase, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { BrandSearch } from '@/components/growth-suite/BrandSearch'
import { CreatorProfile } from '@/components/growth-suite/CreatorProfile'
import { DealCard } from '@/components/growth-suite/DealCard'
import { formatCurrency } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    loading: 'Loading your dashboard...',
    welcomeTitle: 'Welcome to ToolMarket365 Growth Suite',
    welcomeSubtitle:
      'Connect creators with brands for authentic collaborations. Choose your path to get started.',
    creatorTitle: "I'm a Creator",
    creatorDescription:
      'Showcase your work, connect with brands, and monetize your influence through authentic partnerships.',
    creatorBullet1: 'Create your professional profile',
    creatorBullet2: 'Showcase your portfolio and metrics',
    creatorBullet3: 'Receive collaboration offers from brands',
    creatorButton: 'Create Creator Profile',
    brandTitle: "I'm a Brand",
    brandDescription:
      'Find the perfect creators to showcase your products and reach your target audience authentically.',
    brandBullet1: 'Create your brand profile',
    brandBullet2: 'Browse and discover creators',
    brandBullet3: 'Manage collaborations and campaigns',
    brandButton: 'Create Brand Profile',
    brandDashboardTitle: 'Brand Dashboard',
    creatorDashboardTitle: 'Creator Dashboard',
    brandDashboardSubtitle: 'Manage your brand collaborations and discover new creators',
    creatorDashboardSubtitle: 'Manage your collaborations and showcase your work',
    totalDeals: 'Total Deals',
    pending: 'Pending',
    active: 'Active',
    completed: 'Completed',
    totalValue: 'Total Value',
    yourProfile: 'Your Profile',
    budgetRange: 'Budget Range:',
    editProfile: 'Edit Profile',
    tabDeals: 'Deals',
    tabDiscover: 'Discover',
    tabAnalytics: 'Analytics',
    tabMessages: 'Messages',
    yourDeals: 'Your Deals',
    newDeal: 'New Deal',
    noDealsYet: 'No deals yet',
    emptyDealsBrand: 'Create your first deal to start collaborating with creators',
    emptyDealsCreator: 'Complete your profile to start receiving collaboration offers',
    createFirstDeal: 'Create Your First Deal',
    completeProfile: 'Complete Your Profile',
    discoverCreators: 'Discover Creators',
    creatorDiscoverySoon: 'Creator discovery coming soon',
    discoverBrands: 'Discover Brands',
    analyticsComingSoon: 'Analytics Coming Soon',
    analyticsDescription: 'Track your collaboration performance and ROI',
    messagesComingSoon: 'Messages Coming Soon',
    messagesDescription: 'Direct messaging with brands and creators',
  },
  es: {
    loading: 'Cargando tu panel...',
    welcomeTitle: 'Bienvenido a ToolMarket365 Growth Suite',
    welcomeSubtitle:
      'Conecta creadores con marcas para colaboraciones auténticas. Elige tu camino para comenzar.',
    creatorTitle: 'Soy Creador',
    creatorDescription:
      'Muestra tu trabajo, conéctate con marcas y monetiza tu influencia a través de colaboraciones auténticas.',
    creatorBullet1: 'Crea tu perfil profesional',
    creatorBullet2: 'Muestra tu portafolio y métricas',
    creatorBullet3: 'Recibe ofertas de colaboración de marcas',
    creatorButton: 'Crear Perfil de Creador',
    brandTitle: 'Soy Marca',
    brandDescription:
      'Encuentra los creadores perfectos para mostrar tus productos y llegar a tu audiencia de forma auténtica.',
    brandBullet1: 'Crea tu perfil de marca',
    brandBullet2: 'Explora y descubre creadores',
    brandBullet3: 'Gestiona colaboraciones y campañas',
    brandButton: 'Crear Perfil de Marca',
    brandDashboardTitle: 'Panel de Marca',
    creatorDashboardTitle: 'Panel de Creador',
    brandDashboardSubtitle: 'Gestiona tus colaboraciones de marca y descubre nuevos creadores',
    creatorDashboardSubtitle: 'Gestiona tus colaboraciones y muestra tu trabajo',
    totalDeals: 'Total de Acuerdos',
    pending: 'Pendientes',
    active: 'Activos',
    completed: 'Completados',
    totalValue: 'Valor Total',
    yourProfile: 'Tu Perfil',
    budgetRange: 'Rango de Presupuesto:',
    editProfile: 'Editar Perfil',
    tabDeals: 'Acuerdos',
    tabDiscover: 'Descubrir',
    tabAnalytics: 'Analíticas',
    tabMessages: 'Mensajes',
    yourDeals: 'Tus Acuerdos',
    newDeal: 'Nuevo Acuerdo',
    noDealsYet: 'Aún no hay acuerdos',
    emptyDealsBrand: 'Crea tu primer acuerdo para empezar a colaborar con creadores',
    emptyDealsCreator: 'Completa tu perfil para empezar a recibir ofertas de colaboración',
    createFirstDeal: 'Crea Tu Primer Acuerdo',
    completeProfile: 'Completa Tu Perfil',
    discoverCreators: 'Descubrir Creadores',
    creatorDiscoverySoon: 'Descubrimiento de creadores próximamente',
    discoverBrands: 'Descubrir Marcas',
    analyticsComingSoon: 'Analíticas Próximamente',
    analyticsDescription: 'Sigue el rendimiento de tus colaboraciones y el ROI',
    messagesComingSoon: 'Mensajes Próximamente',
    messagesDescription: 'Mensajería directa con marcas y creadores',
  },
}

interface Brand {
  id: string
  company_name: string
  website: string
  budget_range: string // String like "$1K-$5K"
  preferred_creator_types: string[] // Not preferred_niches
  campaign_types: string[] // Not content_types
  status: 'active' | 'inactive' | 'suspended'
  description?: string
  location?: string
  industry?: string
  logo_url?: string
}

interface CreatorProfileData {
  id: string
  user_id: string
  display_name: string
  bio?: string
  niche: string // Single string, not array
  location?: string
  platforms: { // JSONB object
    instagram?: { handle: string; followers: number; engagement_rate: number }
    youtube?: { handle: string; subscribers: number; engagement_rate: number }
    twitter?: { handle: string; followers: number; engagement_rate: number }
    tiktok?: { handle: string; followers: number; engagement_rate: number }
  }
  total_followers: number
  average_engagement_rate: number
  rates: { // JSONB object
    sponsored_post?: number
    product_review?: number
    brand_ambassador?: number
  }
  portfolio_urls: string[]
  profile_image_url?: string
  is_verified: boolean
}

interface Deal {
  id: string
  brand_id: string
  creator_id: string
  deal_type: string
  platform: string
  budget: number
  deadline: string
  requirements: string // String, not array
  deliverables: string[] // Array
  status: 'pending' | 'negotiating' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
  brand_name: string
  creator_name: string
  created_at: string
  updated_at: string
}

export default function GrowthSuitePage() {
  const router = useRouter()
  const { language } = useLanguage()
  const c = copy[language]
  const [userType, setUserType] = useState<'brand' | 'creator' | null>(null)
  const [userProfile, setUserProfile] = useState<Brand | CreatorProfileData | null>(null)
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('deals')

  useEffect(() => {
    checkUserProfile()
  }, [])

  const checkUserProfile = async () => {
    try {
      // Check if user has creator profile
      const creatorResponse = await fetch('/api/growth-suite/creator-profile')
      if (creatorResponse.ok) {
        const creatorData = await creatorResponse.json()
        if (creatorData.profile) {
          setUserType('creator')
          setUserProfile(creatorData.profile)
          await fetchCreatorDeals()
          setLoading(false)
          return
        }
      }

      // Check if user has brand profile
      const brandResponse = await fetch('/api/growth-suite/brands')
      if (brandResponse.ok) {
        const brandData = await brandResponse.json()
        if (brandData.brand) {
          setUserType('brand')
          setUserProfile(brandData.brand)
          await fetchBrandDeals()
          setLoading(false)
          return
        }
      }

      // No profile found
      setUserType(null)
    } catch (error) {
      console.error('Error checking user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCreatorDeals = async () => {
    try {
      const response = await fetch('/api/growth-suite/deals')
      if (response.ok) {
        const data = await response.json()
        // Transform deals to match interface
        const transformedDeals = (data.deals || []).map((deal: any) => ({
          ...deal,
          brand_name: deal.brand?.company_name || deal.brand?.name || 'Unknown Brand',
          creator_name: deal.creator?.display_name || 'Unknown Creator',
          requirements: typeof deal.requirements === 'string' ? deal.requirements : (deal.requirements || []).join('\n'),
          deliverables: Array.isArray(deal.deliverables) ? deal.deliverables : []
        }))
        setDeals(transformedDeals)
      }
    } catch (error) {
      console.error('Error fetching creator deals:', error)
    }
  }

  const fetchBrandDeals = async () => {
    try {
      const response = await fetch('/api/growth-suite/deals')
      if (response.ok) {
        const data = await response.json()
        // Transform deals to match interface
        const transformedDeals = (data.deals || []).map((deal: any) => ({
          ...deal,
          brand_name: deal.brand?.company_name || deal.brand?.name || 'Unknown Brand',
          creator_name: deal.creator?.display_name || 'Unknown Creator',
          requirements: typeof deal.requirements === 'string' ? deal.requirements : (deal.requirements || []).join('\n'),
          deliverables: Array.isArray(deal.deliverables) ? deal.deliverables : []
        }))
        setDeals(transformedDeals)
      }
    } catch (error) {
      console.error('Error fetching brand deals:', error)
    }
  }

  const handleDealStatusUpdate = async (dealId: string, newStatus: Deal['status']) => {
    try {
      const response = await fetch(`/api/growth-suite/deals/${dealId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        // Refresh deals
        if (userType === 'creator') {
          await fetchCreatorDeals()
        } else {
          await fetchBrandDeals()
        }
      }
    } catch (error) {
      console.error('Error updating deal status:', error)
    }
  }

  const handleCreateProfile = (type: 'brand' | 'creator') => {
    router.push(`/growth-suite/${type}-setup`)
  }

  const getDealStats = () => {
    const stats = {
      total: deals.length,
      pending: deals.filter(d => d.status === 'pending').length,
      active: deals.filter(d => ['accepted', 'in_progress'].includes(d.status)).length,
      completed: deals.filter(d => d.status === 'completed').length,
      totalValue: deals.reduce((sum, deal) => sum + deal.budget, 0)
    }
    return stats
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto mb-4"></div>
          <p className="text-mono-600 dark:text-mono-400">{c.loading}</p>
        </div>
      </div>
    )
  }

  if (!userType) {
    return (
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {c.welcomeTitle}
            </h1>
            <p className="text-xl text-mono-600 dark:text-mono-400 max-w-2xl mx-auto">
              {c.welcomeSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Creator Path */}
            <div 
              className="border border-mono-200 dark:border-mono-700 rounded-lg p-8 hover:shadow-lg transition-shadow cursor-pointer bg-mono-50 dark:bg-mono-900"
              onClick={() => handleCreateProfile('creator')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-100 dark:bg-accent-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-accent-600" />
                </div>
                <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.creatorTitle}</h2>
                <p className="text-mono-600 dark:text-mono-400 mb-6">
                  {c.creatorDescription}
                </p>
                <ul className="text-sm text-mono-600 dark:text-mono-400 space-y-2 mb-6 text-left">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                    <span>{c.creatorBullet1}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                    <span>{c.creatorBullet2}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                    <span>{c.creatorBullet3}</span>
                  </li>
                </ul>
                <button className="w-full px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors">
                  {c.creatorButton}
                </button>
              </div>
            </div>

            {/* Brand Path */}
            <div 
              className="border border-mono-200 dark:border-mono-700 rounded-lg p-8 hover:shadow-lg transition-shadow cursor-pointer bg-mono-50 dark:bg-mono-900"
              onClick={() => handleCreateProfile('brand')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.brandTitle}</h2>
                <p className="text-mono-600 dark:text-mono-400 mb-6">
                  {c.brandDescription}
                </p>
                <ul className="text-sm text-mono-600 dark:text-mono-400 space-y-2 mb-6 text-left">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>{c.brandBullet1}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>{c.brandBullet2}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>{c.brandBullet3}</span>
                  </li>
                </ul>
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  {c.brandButton}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const stats = getDealStats()

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-2">
            {userType === 'brand' ? c.brandDashboardTitle : c.creatorDashboardTitle}
          </h1>
          <p className="text-mono-600 dark:text-mono-400">
            {userType === 'brand' 
              ? c.brandDashboardSubtitle
              : c.creatorDashboardSubtitle
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-4 bg-mono-50 dark:bg-mono-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-mono-600 dark:text-mono-400">{c.totalDeals}</p>
                <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{stats.total}</p>
              </div>
              <Briefcase className="w-8 h-8 text-accent-600" />
            </div>
          </div>

          <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-4 bg-mono-50 dark:bg-mono-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-mono-600 dark:text-mono-400">{c.pending}</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-4 bg-mono-50 dark:bg-mono-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-mono-600 dark:text-mono-400">{c.active}</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-4 bg-mono-50 dark:bg-mono-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-mono-600 dark:text-mono-400">{c.completed}</p>
                <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-mono-600" />
            </div>
          </div>

          <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-4 bg-mono-50 dark:bg-mono-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-mono-600 dark:text-mono-400">{c.totalValue}</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalValue, 'USD')}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Profile Overview */}
        <div className="mb-8">
          <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.yourProfile}</h2>
            {userType === 'brand' && userProfile && (
              <div className="text-mono-600 dark:text-mono-400">
                <p className="font-semibold text-mono-950 dark:text-mono-50">{(userProfile as Brand).company_name}</p>
                <p>{c.budgetRange} {(userProfile as Brand).budget_range}</p>
                <Link 
                  href="/growth-suite/brand-setup"
                  className="text-accent-600 hover:underline text-sm"
                >
                  {c.editProfile}
                </Link>
              </div>
            )}
            {userType === 'creator' && userProfile && (
              <CreatorProfile profile={userProfile as CreatorProfileData} compact />
            )}
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="border-b border-mono-200 dark:border-mono-700">
            <nav className="flex space-x-8">
              {[
                { id: 'deals', label: c.tabDeals },
                { id: 'discover', label: c.tabDiscover },
                { id: 'analytics', label: c.tabAnalytics },
                { id: 'messages', label: c.tabMessages }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-accent-600 text-accent-600'
                      : 'border-transparent text-mono-500 hover:text-mono-700 dark:text-mono-400 dark:hover:text-mono-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'deals' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50">{c.yourDeals}</h2>
                <Link
                  href="/growth-suite/deals/new"
                  className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  {c.newDeal}
                </Link>
              </div>

              <div className="grid gap-6">
                {deals.length > 0 ? (
                  deals.map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      onStatusUpdate={handleDealStatusUpdate}
                      currentUserType={userType}
                    />
                  ))
                ) : (
                  <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-12 text-center bg-mono-50 dark:bg-mono-900">
                    <Briefcase className="w-16 h-16 text-mono-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-mono-900 dark:text-mono-100 mb-2">{c.noDealsYet}</h3>
                    <p className="text-mono-600 dark:text-mono-400 mb-6">
                      {userType === 'brand'
                        ? c.emptyDealsBrand
                        : c.emptyDealsCreator
                      }
                    </p>
                    <Link
                      href={userType === 'brand' ? '/growth-suite/deals/new' : '/growth-suite/creator-setup'}
                      className="inline-block px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      {userType === 'brand' ? c.createFirstDeal : c.completeProfile}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'discover' && (
            <div className="space-y-6">
              {userType === 'brand' ? (
                <div>
                  <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">{c.discoverCreators}</h2>
                  <p className="text-mono-600 dark:text-mono-400 mb-4">{c.creatorDiscoverySoon}</p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">{c.discoverBrands}</h2>
                  <BrandSearch />
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-mono-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-mono-900 dark:text-mono-100 mb-2">{c.analyticsComingSoon}</h3>
              <p className="text-mono-600 dark:text-mono-400">{c.analyticsDescription}</p>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-mono-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-mono-900 dark:text-mono-100 mb-2">{c.messagesComingSoon}</h3>
              <p className="text-mono-600 dark:text-mono-400">{c.messagesDescription}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
