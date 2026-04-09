'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { DealMessages } from '@/components/growth-suite/DealMessages'
import { DealNegotiation } from '@/components/growth-suite/DealNegotiation'
import { DealDeliverables } from '@/components/growth-suite/DealDeliverables'
import { Calendar, DollarSign, Target, Clock, User, Building2, ArrowLeft, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'

interface Deal {
  id: string
  title: string
  description: string
  deal_type: string
  platform: string
  budget: number
  currency: string
  deadline: string
  requirements: string
  deliverables: string[]
  status: 'pending' | 'negotiating' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
  created_at: string
  updated_at: string
  brand?: {
    id: string
    name: string
    company_name: string
    logo_url?: string
    is_verified: boolean
  }
  creator?: {
    id: string
    display_name: string
    niche: string
    avatar_url?: string
  }
}

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  negotiating: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-mono-100 text-mono-800 dark:bg-mono-800 dark:text-mono-200',
  disputed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

export default function DealDetailPage() {
  const router = useRouter()
  const params = useParams()
  const dealId = params.id as string
  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<'brand' | 'creator' | 'unknown'>('unknown')
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    if (dealId) {
      fetchDeal()
      determineUserRole()
    }
  }, [dealId])

  const fetchDeal = async () => {
    try {
      const response = await fetch(`/api/growth-suite/deals/${dealId}`)
      if (response.ok) {
        const data = await response.json()
        setDeal(data.deal)
      } else {
        console.error('Failed to fetch deal')
      }
    } catch (error) {
      console.error('Error fetching deal:', error)
    } finally {
      setLoading(false)
    }
  }

  const determineUserRole = async () => {
    try {
      const response = await fetch('/api/me')
      if (response.ok) {
        const userData = await response.json()
        
        const brandResponse = await fetch('/api/growth-suite/brands')
        const creatorResponse = await fetch('/api/growth-suite/creator-profile')
        
        const [brandData, creatorData] = await Promise.all([
          brandResponse.json(),
          creatorResponse.json()
        ])

        if (brandData.brand) {
          setUserRole('brand')
        } else if (creatorData.profile) {
          setUserRole('creator')
        }
      }
    } catch (error) {
      console.error('Error determining user role:', error)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/growth-suite/deals/${dealId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        fetchDeal()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600 mx-auto mb-4"></div>
          <p className="text-mono-600 dark:text-mono-400">Loading deal details...</p>
        </div>
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-mono-600 dark:text-mono-400 mb-4">Deal not found</p>
          <Link
            href="/growth-suite"
            className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
          >
            Back to Deals
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/growth-suite/deals"
                className="px-3 py-1 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Back
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">{deal.title}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-2 py-1 rounded text-xs ${STATUS_COLORS[deal.status] || STATUS_COLORS.pending}`}>
                    {deal.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-mono-600 dark:text-mono-400 flex items-center space-x-1 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Due {deal.deadline ? format(new Date(deal.deadline), 'MMM d, yyyy') : 'Flexible'}</span>
                  </span>
                  <span className="text-mono-600 dark:text-mono-400 flex items-center space-x-1 text-sm">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatCurrency(deal.budget, deal.currency || 'USD')}</span>
                  </span>
                  <span className="text-mono-600 dark:text-mono-400 flex items-center space-x-1 text-sm">
                    <Target className="w-4 h-4" />
                    <span className="capitalize">{deal.platform}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deal Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-4 bg-mono-50 dark:bg-mono-900">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-mono-600 dark:text-mono-400">Budget</p>
                <p className="text-lg font-bold text-mono-950 dark:text-mono-50">{formatCurrency(deal.budget, deal.currency || 'USD')}</p>
              </div>
            </div>
          </div>

          <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-4 bg-mono-50 dark:bg-mono-900">
            <div className="flex items-center space-x-3">
              <Target className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-mono-600 dark:text-mono-400">Platform</p>
                <p className="text-lg font-bold text-mono-950 dark:text-mono-50 capitalize">{deal.platform}</p>
              </div>
            </div>
          </div>

          <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-4 bg-mono-50 dark:bg-mono-900">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-mono-600 dark:text-mono-400">Deadline</p>
                <p className="text-lg font-bold text-mono-950 dark:text-mono-50">
                  {deal.deadline ? format(new Date(deal.deadline), 'MMM d') : 'Flexible'}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-4 bg-mono-50 dark:bg-mono-900">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-mono-600 dark:text-mono-400">Type</p>
                <p className="text-lg font-bold text-mono-950 dark:text-mono-50 capitalize">{deal.deal_type?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Participant Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {deal.brand && (
            <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
              <h3 className="text-lg font-bold text-mono-950 dark:text-mono-50 mb-4 flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Brand</span>
              </h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-accent-100 dark:bg-accent-900 flex items-center justify-center text-accent-600 font-bold">
                  {deal.brand.name?.charAt(0).toUpperCase() || 'B'}
                </div>
                <div>
                  <h3 className="font-semibold text-mono-950 dark:text-mono-50">{deal.brand.name}</h3>
                  <p className="text-sm text-mono-600 dark:text-mono-400">{deal.brand.company_name}</p>
                  {deal.brand.is_verified && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                      <CheckCircle className="w-3 h-3 inline mr-1" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {deal.creator && (
            <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
              <h3 className="text-lg font-bold text-mono-950 dark:text-mono-50 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Creator</span>
              </h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 font-bold">
                  {deal.creator.display_name?.charAt(0).toUpperCase() || 'C'}
                </div>
                <div>
                  <h3 className="font-semibold text-mono-950 dark:text-mono-50">{deal.creator.display_name}</h3>
                  <p className="text-sm text-mono-600 dark:text-mono-400">{deal.creator.niche}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Tabs */}
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="border-b border-mono-200 dark:border-mono-700">
            <nav className="flex space-x-8">
              {[
                { id: 'details', label: 'Details' },
                { id: 'messages', label: 'Messages' },
                { id: 'negotiation', label: 'Negotiation' },
                { id: 'deliverables', label: 'Deliverables' }
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
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
                <h3 className="text-lg font-bold text-mono-950 dark:text-mono-50 mb-4">Deal Description</h3>
                <p className="text-mono-700 dark:text-mono-300 mb-6">{deal.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-mono-900 dark:text-mono-100 mb-3">Requirements</h4>
                    <div className="text-mono-700 dark:text-mono-300 whitespace-pre-line">
                      {deal.requirements || 'No specific requirements provided.'}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-mono-900 dark:text-mono-100 mb-3">Deliverables</h4>
                    {deal.deliverables && deal.deliverables.length > 0 ? (
                      <ul className="space-y-2">
                        {deal.deliverables.map((deliverable, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-accent-600 mt-1">•</span>
                            <span className="text-mono-700 dark:text-mono-300">{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-mono-600 dark:text-mono-400">No deliverables specified.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {userRole !== 'unknown' && deal.status === 'pending' && (
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => handleStatusUpdate('cancelled')}
                    className="px-4 py-2 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                  >
                    <XCircle className="w-4 h-4 inline mr-2" />
                    Reject Deal
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('negotiating')}
                    className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Start Negotiation
                  </button>
                </div>
              )}

              {userRole !== 'unknown' && deal.status === 'negotiating' && (
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => handleStatusUpdate('cancelled')}
                    className="px-4 py-2 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                  >
                    <XCircle className="w-4 h-4 inline mr-2" />
                    Reject Deal
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('accepted')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Accept Deal
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <DealMessages dealId={dealId} userRole={userRole} />
          )}

          {activeTab === 'negotiation' && (
            <DealNegotiation deal={deal} userRole={userRole} onUpdate={fetchDeal} />
          )}

          {activeTab === 'deliverables' && (
            <DealDeliverables deal={deal} userRole={userRole} onUpdate={fetchDeal} />
          )}
        </div>
      </div>
    </div>
  )
}
