'use client'

import { useState, useEffect } from 'react'
import { VerificationBadge } from './VerificationBadge'
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface VerificationStatus {
  verified: boolean
  status: string
  verificationType?: string
  verifiedAt?: string
}

export function VerificationStatus() {
  const [verification, setVerification] = useState<VerificationStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchVerificationStatus()
  }, [])

  const fetchVerificationStatus = async () => {
    try {
      const response = await fetch('/api/verification/status')
      const data = await response.json()
      
      if (response.ok) {
        setVerification({
          verified: data.verified,
          status: data.status,
          verificationType: data.verificationType,
          verifiedAt: data.verifiedAt
        })
      }
    } catch (error) {
      console.error('Error fetching verification status:', error)
    } finally {
      setLoading(false)
    }
  }

  const requestVerification = async () => {
    setRequesting(true)
    setMessage('')
    try {
      const response = await fetch('/api/verification/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationType: 'email' })
      })

      const data = await response.json()
      
      if (response.ok) {
        setMessage(data.message || 'Verification requested successfully')
        await fetchVerificationStatus()
      } else {
        setMessage(data.error || 'Failed to request verification')
      }
    } catch (error) {
      console.error('Error requesting verification:', error)
      setMessage('Failed to request verification')
    } finally {
      setRequesting(false)
    }
  }

  const getStatusBadge = () => {
    if (!verification) return null

    const statusConfig: Record<string, { label: string; icon: typeof CheckCircle2; color: string; bgColor: string }> = {
      verified: { 
        label: 'Verified', 
        icon: CheckCircle2, 
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/20'
      },
      pending: { 
        label: 'Pending Review', 
        icon: Clock, 
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
      },
      rejected: { 
        label: 'Rejected', 
        icon: XCircle, 
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/20'
      },
      not_requested: { 
        label: 'Not Requested', 
        icon: XCircle, 
        color: 'text-mono-600 dark:text-mono-400',
        bgColor: 'bg-mono-100 dark:bg-mono-800'
      }
    }

    const config = statusConfig[verification.status] || statusConfig.not_requested
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 flex items-center gap-2">
          Creator Verification
          {verification?.verified && <VerificationBadge verified={verification.verified} />}
        </h2>
      </div>
      
      <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">
        Get verified to unlock premium features and build trust with your audience
      </p>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          {getStatusBadge()}
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.includes('success') || message.includes('verified')
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
          }`}>
            {message}
          </div>
        )}

        {verification?.verified && verification.verifiedAt && (
          <div className="text-sm text-mono-600 dark:text-mono-400">
            Verified on {new Date(verification.verifiedAt).toLocaleDateString()}
          </div>
        )}

        {verification?.status === 'rejected' && (
          <div className="text-sm text-red-600 dark:text-red-400">
            Your verification request was rejected. Please contact support for assistance.
          </div>
        )}

        {!verification?.verified && verification?.status !== 'pending' && (
          <button
            onClick={requestVerification}
            disabled={requesting}
            className="w-full px-4 py-2 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {requesting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Requesting...
              </>
            ) : (
              'Request Verification'
            )}
          </button>
        )}

        {verification?.status === 'pending' && (
          <div className="text-sm text-mono-600 dark:text-mono-400">
            Your verification request is being reviewed. This typically takes 1-3 business days.
          </div>
        )}
      </div>
    </div>
  )
}
