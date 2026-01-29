'use client'

import { useState } from 'react'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface Deliverable {
  id: string
  title: string
  status: 'pending' | 'in_progress' | 'completed' | 'approved'
  dueDate: string
  submittedAt?: string
  feedback?: string
}

interface Deal {
  id: string
  status: string
  deliverables: string[]
}

interface DealDeliverablesProps {
  deal: Deal
  userRole: 'brand' | 'creator' | 'unknown'
  onUpdate: () => void
}

export function DealDeliverables({ deal, userRole, onUpdate }: DealDeliverablesProps) {
  const [deliverables, setDeliverables] = useState<Deliverable[]>(
    deal.deliverables?.map((item, index) => ({
      id: `deliverable-${index}`,
      title: item,
      status: 'pending' as const,
      dueDate: deal.status === 'in_progress' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : new Date().toISOString()
    })) || []
  )

  const canSubmit = userRole === 'creator' && deal.status === 'in_progress'
  const canApprove = userRole === 'brand' && deal.status === 'in_progress'

  const updateDeliverableStatus = async (deliverableId: string, newStatus: string) => {
    try {
      // In a real implementation, this would call an API
      setDeliverables(prev => 
        prev.map(del => 
          del.id === deliverableId 
            ? { 
                ...del, 
                status: newStatus as any,
                submittedAt: newStatus === 'completed' ? new Date().toISOString() : del.submittedAt
              }
            : del
        )
      )
      onUpdate()
    } catch (error) {
      console.error('Error updating deliverable:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-blue-600" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-mono-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'approved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-mono-100 text-mono-800 dark:bg-mono-800 dark:text-mono-200'
    }
  }

  const completedCount = deliverables.filter(d => d.status === 'completed' || d.status === 'approved').length
  const totalCount = deliverables.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  if (deliverables.length === 0) {
    return (
      <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-8 text-center bg-mono-50 dark:bg-mono-900">
        <p className="text-mono-600 dark:text-mono-400">No deliverables specified for this deal.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
        <h3 className="text-lg font-bold text-mono-950 dark:text-mono-50 mb-4">Deliverables Progress</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-mono-700 dark:text-mono-300">Completed</span>
            <span className="font-semibold text-mono-950 dark:text-mono-50">{completedCount} of {totalCount}</span>
          </div>
          
          <div className="w-full bg-mono-200 dark:bg-mono-700 rounded-full h-2">
            <div 
              className="bg-accent-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-accent-600">{Math.round(progressPercentage)}%</p>
            <p className="text-sm text-mono-600 dark:text-mono-400">Complete</p>
          </div>
        </div>
      </div>

      {/* Deliverables List */}
      <div className="space-y-4">
        {deliverables.map((deliverable) => (
          <div key={deliverable.id} className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                {canSubmit && deliverable.status === 'pending' ? (
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateDeliverableStatus(deliverable.id, 'completed')
                      }
                    }}
                    className="mt-1 w-4 h-4 text-accent-600 border-mono-300 rounded focus:ring-accent-500"
                  />
                ) : (
                  <div className="mt-1">
                    {getStatusIcon(deliverable.status)}
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-mono-950 dark:text-mono-50">{deliverable.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(deliverable.status)}`}>
                      {deliverable.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-mono-500">
                    <span>Due: {new Date(deliverable.dueDate).toLocaleDateString()}</span>
                    {deliverable.submittedAt && (
                      <span>Submitted: {new Date(deliverable.submittedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                  
                  {deliverable.feedback && (
                    <div className="mt-3 p-3 bg-mono-100 dark:bg-mono-800 rounded-lg">
                      <p className="text-sm text-mono-700 dark:text-mono-300">
                        <strong>Feedback:</strong> {deliverable.feedback}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {canApprove && deliverable.status === 'completed' && (
                  <>
                    <button
                      onClick={() => updateDeliverableStatus(deliverable.id, 'approved')}
                      className="px-3 py-1 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const feedback = prompt('Provide feedback for rejection:')
                        if (feedback !== null) {
                          setDeliverables(prev => 
                            prev.map(del => 
                              del.id === deliverable.id 
                                ? { ...del, status: 'in_progress' as any, feedback }
                                : del
                            )
                          )
                        }
                      }}
                      className="px-3 py-1 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors text-sm"
                    >
                      Request Changes
                    </button>
                  </>
                )}
                
                {canSubmit && deliverable.status === 'completed' && (
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                    Submitted
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit All Button */}
      {canSubmit && deliverables.some(d => d.status === 'pending') && (
        <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 bg-mono-50 dark:bg-mono-900 text-center">
          <button
            onClick={() => {
              if (confirm('Submit all pending deliverables?')) {
                deliverables
                  .filter(d => d.status === 'pending')
                  .forEach(d => updateDeliverableStatus(d.id, 'completed'))
              }
            }}
            className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors"
          >
            Submit All Deliverables
          </button>
        </div>
      )}

      {/* All Approved Message */}
      {deliverables.length > 0 && deliverables.every(d => d.status === 'approved') && (
        <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 bg-mono-50 dark:bg-mono-900 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-green-800 dark:text-green-200 font-semibold">All deliverables have been approved!</p>
          <p className="text-mono-600 dark:text-mono-400 text-sm">The deal can now be marked as complete.</p>
        </div>
      )}
    </div>
  )
}
