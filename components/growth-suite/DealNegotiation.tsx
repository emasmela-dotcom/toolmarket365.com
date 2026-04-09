'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { DollarSign, Calendar, Target, Clock, RotateCcw, Save, CheckCircle } from 'lucide-react';

interface Deal {
  id: string
  budget: number
  currency: string
  deadline: string
  requirements: string
  deliverables: string[]
  status: string
  platform?: string
}

interface DealNegotiationProps {
  deal: Deal
  userRole: 'brand' | 'creator' | 'unknown'
  onUpdate: () => void
}

export function DealNegotiation({ deal, userRole, onUpdate }: DealNegotiationProps) {
  const [negotiating, setNegotiating] = useState(false)
  const [proposal, setProposal] = useState({
    budget: deal.budget,
    deadline: deal.deadline ? new Date(deal.deadline).toISOString().split('T')[0] : '',
    requirements: deal.requirements || '',
    deliverables: deal.deliverables?.join('\n') || ''
  })

  const canNegotiate = deal.status === 'negotiating' && userRole === 'creator'
  const canAccept = deal.status === 'negotiating' && userRole === 'brand'

  const handleSubmitProposal = async () => {
    try {
      const response = await fetch(`/api/growth-suite/deals/${deal.id}/negotiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget: proposal.budget,
          deadline: proposal.deadline,
          requirements: proposal.requirements.split('\n').filter(r => r.trim()),
          deliverables: proposal.deliverables.split('\n').filter(d => d.trim()),
          proposedBy: userRole
        })
      })

      if (response.ok) {
        setNegotiating(false)
        onUpdate()
      }
    } catch (error) {
      console.error('Error submitting proposal:', error)
      alert('Failed to submit proposal')
    }
  }

  const handleAcceptTerms = async () => {
    try {
      const response = await fetch(`/api/growth-suite/deals/${deal.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' })
      })

      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error accepting terms:', error)
      alert('Failed to accept terms')
    }
  }

  if (userRole === 'unknown') {
    return (
      <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-8 text-center bg-mono-50 dark:bg-mono-900">
        <p className="text-mono-600 dark:text-mono-400">You must be a participant in this deal to negotiate terms.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Terms */}
      <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
        <h3 className="text-lg font-bold text-mono-950 dark:text-mono-50 mb-4">Current Deal Terms</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-mono-600 dark:text-mono-400">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Budget</span>
              </div>
              <p className="text-xl font-semibold text-mono-950 dark:text-mono-50">{formatCurrency(deal.budget, deal.currency || 'USD')}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-mono-600 dark:text-mono-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Deadline</span>
              </div>
              <p className="text-mono-950 dark:text-mono-50">
                {deal.deadline ? new Date(deal.deadline).toLocaleDateString() : 'Flexible'}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-mono-600 dark:text-mono-400">
              <Target className="w-4 h-4" />
              <span className="text-sm">Platform</span>
            </div>
            <span className="inline-block px-2 py-1 bg-accent-100 dark:bg-accent-900 text-accent-800 dark:text-accent-200 rounded text-sm capitalize">
              {deal.platform ?? '—'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-mono-900 dark:text-mono-100 mb-2">Requirements</h4>
              <div className="text-mono-700 dark:text-mono-300 text-sm whitespace-pre-line">
                {deal.requirements || 'No requirements specified.'}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-mono-900 dark:text-mono-100 mb-2">Deliverables</h4>
              <ul className="space-y-1">
                {deal.deliverables?.map((deliv, index) => (
                  <li key={index} className="text-mono-700 dark:text-mono-300 text-sm">• {deliv}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Negotiation Actions */}
      {canNegotiate && (
        <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
          <h3 className="text-lg font-bold text-mono-950 dark:text-mono-50 mb-4">Propose New Terms</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">Budget</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mono-400" />
                  <input
                    type="number"
                    value={proposal.budget}
                    onChange={(e) => setProposal(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
                    className="w-full pl-10 pr-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">Deadline</label>
                <input
                  type="date"
                  value={proposal.deadline}
                  onChange={(e) => setProposal(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">Requirements (one per line)</label>
              <textarea
                value={proposal.requirements}
                onChange={(e) => setProposal(prev => ({ ...prev, requirements: e.target.value }))}
                placeholder="List your requirements..."
                rows={4}
                className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">Deliverables (one per line)</label>
              <textarea
                value={proposal.deliverables}
                onChange={(e) => setProposal(prev => ({ ...prev, deliverables: e.target.value }))}
                placeholder="List deliverables..."
                rows={4}
                className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 resize-none"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setProposal({
                  budget: deal.budget,
                  deadline: deal.deadline ? new Date(deal.deadline).toISOString().split('T')[0] : '',
                  requirements: deal.requirements || '',
                  deliverables: deal.deliverables?.join('\n') || ''
                })}
                className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4 inline mr-2" />
                Reset to Current
              </button>
              <button
                onClick={handleSubmitProposal}
                className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Submit Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brand Actions */}
      {canAccept && (
        <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
          <h3 className="text-lg font-bold text-mono-950 dark:text-mono-50 mb-4">Review Proposal</h3>
          <p className="text-mono-700 dark:text-mono-300 mb-4">
            The creator has proposed new terms for this deal. Review the changes and decide whether to accept or continue negotiations.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={handleAcceptTerms}
              className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors"
            >
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Accept Terms
            </button>
            <button
              className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
            >
              Request Changes
            </button>
          </div>
        </div>
      )}

      {/* Status Info */}
      {deal.status !== 'negotiating' && (
        <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 bg-mono-50 dark:bg-mono-900 text-center">
          <Clock className="w-8 h-8 text-mono-400 mx-auto mb-2" />
          <p className="text-mono-600 dark:text-mono-400">
            {deal.status === 'pending' && 'Waiting for creator response...'}
            {deal.status === 'accepted' && 'Deal terms have been accepted!'}
            {deal.status === 'in_progress' && 'Deal is currently in progress.'}
            {deal.status === 'completed' && 'Deal has been completed successfully.'}
            {deal.status === 'cancelled' && 'Deal has been cancelled.'}
          </p>
        </div>
      )}
    </div>
  )
}
