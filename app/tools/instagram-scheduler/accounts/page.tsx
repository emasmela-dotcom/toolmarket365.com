'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { Globe, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

function ConnectInstagramAccountContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    const successParam = searchParams.get('success')
    
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
    if (successParam) {
      setSuccess('Account connected successfully!')
    }
  }, [searchParams])

  const handleConnect = () => {
    setLoading(true)
    setError(null)

    const appId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID
    const redirectUri = `${window.location.origin}/api/instagram/auth/callback`
    
    if (!appId) {
      setError('Instagram API not configured. Please set INSTAGRAM_APP_ID in environment variables.')
      setLoading(false)
      return
    }

    // Redirect to Instagram OAuth
    const authUrl = `https://api.instagram.com/oauth/authorize?` +
      `client_id=${appId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=user_profile,user_media&` +
      `response_type=code`

    window.location.href = authUrl
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">Connect Instagram Account</h1>
          <p className="text-mono-600 dark:text-mono-400 mt-1">Authorize CreatorFlow365 to post to your Instagram account</p>
        </div>
        <button
          onClick={() => router.push('/tools/instagram-scheduler')}
          className="px-4 py-2 bg-mono-200 dark:bg-mono-800 text-mono-950 dark:text-mono-50 font-medium rounded-lg hover:bg-mono-300 dark:hover:bg-mono-700 transition-colors"
        >
          Back to Scheduler
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-green-800 dark:text-green-200 font-medium">{success}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-medium">Connection Failed</p>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Setup Requirements Notice */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">Setup Required</h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-3">
              Before connecting Instagram accounts, you need to:
            </p>
            <ol className="text-sm text-yellow-800 dark:text-yellow-300 space-y-2 list-decimal list-inside">
              <li>Create a Facebook Developer App at <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="underline">developers.facebook.com</a></li>
              <li>Add Instagram Basic Display product to your app</li>
              <li>Get your App ID and App Secret</li>
              <li>Add them to your environment variables (see <code className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">INSTAGRAM_API_SETUP.md</code>)</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Connection Card */}
      <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Globe className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-3">
            Connect Your Instagram Account
          </h2>
          
          <p className="text-mono-600 dark:text-mono-400 mb-6 max-w-md mx-auto">
            Authorize CreatorFlow365 to schedule and publish posts to your Instagram account. 
            You'll be redirected to Instagram to authorize the connection.
          </p>

          <button
            onClick={handleConnect}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Connecting...
              </>
            ) : (
              <>
                <Globe className="w-5 h-5" />
                Connect Instagram Account
              </>
            )}
          </button>

          <p className="text-xs text-mono-500 dark:text-mono-500 mt-6">
            By connecting, you authorize CreatorFlow365 to access your Instagram account for posting scheduled content.
            You can revoke access at any time from your Instagram settings.
          </p>
        </div>
      </div>

      {/* What You'll Get */}
      <div className="mt-8 bg-mono-50 dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
        <h3 className="text-lg font-semibold text-mono-950 dark:text-mono-50 mb-4">
          What You'll Get
        </h3>
        <ul className="space-y-3 text-sm text-mono-700 dark:text-mono-300">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <span>Schedule posts for feed, stories, reels, and IGTV</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <span>Automatic posting at scheduled times</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <span>Track engagement and analytics</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <span>Manage multiple Instagram accounts</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default function ConnectInstagramAccountPage() {
  const toolDescription = "Connect your Instagram account to enable automatic posting of scheduled content. Authorize CreatorFlow365 to post on your behalf."
  const howToUse = "1. Click 'Connect Instagram Account'. 2. You'll be redirected to Instagram to authorize. 3. After authorization, you'll be redirected back. 4. Your account will be connected and ready to use."

  return (
    <ToolAccessGate
      toolSlug="instagram-scheduler"
      toolName="Connect Instagram Account"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <ConnectInstagramAccountContent />
    </ToolAccessGate>
  )
}
