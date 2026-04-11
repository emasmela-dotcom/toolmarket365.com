'use client'

import { useState, type ReactElement } from 'react'
import { Calendar, DollarSign, Package, Clock, MessageSquare, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

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

interface DealCardProps {
  deal: Deal
  onStatusUpdate?: (dealId: string, newStatus: Deal['status']) => void
  onMessage?: (dealId: string) => void
  currentUserType?: 'brand' | 'creator'
}

export function DealCard({ deal, onStatusUpdate, onMessage, currentUserType }: DealCardProps) {
  const router = useRouter()
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      negotiating: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      disputed: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    }
    return colors[status] || 'bg-mono-100 text-mono-800 dark:bg-mono-800 dark:text-mono-200'
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, ReactElement> = {
      pending: <Clock className="w-4 h-4" />,
      negotiating: <MessageSquare className="w-4 h-4" />,
      accepted: <CheckCircle className="w-4 h-4" />,
      in_progress: <AlertCircle className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
      disputed: <AlertCircle className="w-4 h-4" />
    }
    return icons[status] || <Clock className="w-4 h-4" />
  }

  const getAvailableActions = () => {
    const actions = []
    
    switch (deal.status) {
      case 'pending':
        if (currentUserType === 'brand') {
          actions.push({ label: 'Accept', value: 'accepted', variant: 'default' as const })
          actions.push({ label: 'Negotiate', value: 'negotiating', variant: 'outline' as const })
        }
        actions.push({ label: 'Cancel', value: 'cancelled', variant: 'outline' as const })
        break
      case 'negotiating':
        actions.push({ label: 'Accept', value: 'accepted', variant: 'default' as const })
        actions.push({ label: 'Cancel', value: 'cancelled', variant: 'outline' as const })
        break
      case 'accepted':
        actions.push({ label: 'Start Work', value: 'in_progress', variant: 'default' as const })
        break
      case 'in_progress':
        if (currentUserType === 'creator') {
          actions.push({ label: 'Complete', value: 'completed', variant: 'default' as const })
        }
        actions.push({ label: 'Dispute', value: 'disputed', variant: 'outline' as const })
        break
    }
    
    return actions
  }

  const handleStatusUpdate = async (newStatus: Deal['status']) => {
    if (!onStatusUpdate) return
    
    setUpdatingStatus(true)
    try {
      await onStatusUpdate(deal.id, newStatus)
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const isOverdue = new Date(deal.deadline) < new Date()

  return (
    <div className="border border-mono-200 dark:border-mono-700 rounded-lg hover:shadow-lg transition-shadow bg-mono-50 dark:bg-mono-900">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-mono-950 dark:text-mono-50">
              {deal.deal_type.replace('_', ' ').toUpperCase()}
            </h3>
            <p className="text-sm text-mono-600 dark:text-mono-400">
              {deal.brand_name} × {deal.creator_name}
            </p>
          </div>
          <span className={`px-2 py-1 rounded text-xs flex items-center ${getStatusColor(deal.status)}`}>
            {getStatusIcon(deal.status)}
            <span className="ml-1">{deal.status.replace('_', ' ')}</span>
          </span>
        </div>
        
        <div className="space-y-4">
          {/* Platform and Budget */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-mono-700 dark:text-mono-300">Platform:</span>
              <span className="px-2 py-0.5 border border-mono-300 dark:border-mono-700 rounded text-xs capitalize">
                {deal.platform}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-600">
                {formatCurrency(deal.budget, 'USD')}
              </span>
            </div>
          </div>

          {/* Deadline */}
          <div className={`flex items-center space-x-2 text-sm ${isOverdue ? 'text-red-600' : 'text-mono-600 dark:text-mono-400'}`}>
            <Calendar className="w-4 h-4" />
            <span>Deadline: {format(new Date(deal.deadline), 'MMM dd, yyyy')}</span>
            {isOverdue && <span className="font-medium">(Overdue)</span>}
          </div>

          {/* Requirements */}
          {deal.requirements && (
            <div>
              <p className="text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">Requirements:</p>
              <p className="text-sm text-mono-600 dark:text-mono-400 bg-mono-100 dark:bg-mono-800 p-3 rounded-lg whitespace-pre-line">
                {deal.requirements}
              </p>
            </div>
          )}

          {/* Deliverables */}
          <div>
            <p className="text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">Deliverables:</p>
            <div className="space-y-2">
              {deal.deliverables?.map((deliverable, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-mono-600 dark:text-mono-400">
                  <Package className="w-4 h-4" />
                  <span>{deliverable}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-mono-200 dark:border-mono-700">
            {getAvailableActions().map((action) => (
              <button
                key={action.value}
                onClick={() => handleStatusUpdate(action.value as Deal['status'])}
                disabled={updatingStatus}
                className={`px-3 py-1 rounded-lg text-sm transition-colors disabled:opacity-50 ${
                  action.variant === 'default'
                    ? 'bg-accent-600 hover:bg-accent-700 text-white'
                    : 'border border-mono-300 dark:border-mono-700 text-mono-700 dark:text-mono-300 hover:bg-mono-100 dark:hover:bg-mono-800'
                }`}
              >
                {action.label}
              </button>
            ))}
            
            {onMessage && (
              <button
                onClick={() => onMessage(deal.id)}
                className="ml-auto px-3 py-1 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors text-sm"
              >
                <MessageSquare className="w-4 h-4 inline mr-1" />
                Message
              </button>
            )}

            <button
              onClick={() => router.push(`/growth-suite/deals/${deal.id}`)}
              className="px-3 py-1 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors text-sm"
            >
              View Details
            </button>
          </div>

          {/* Created Date */}
          <div className="pt-4 border-t text-xs text-mono-500">
            Created {format(new Date(deal.created_at), 'MMM dd, yyyy')}
          </div>
        </div>
      </div>
    </div>
  )
}
