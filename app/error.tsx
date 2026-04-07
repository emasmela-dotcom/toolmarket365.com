'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
  reset?: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-mono-50 dark:bg-mono-950 px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-4">
            Something Went Wrong
          </h1>
          <p className="text-lg text-mono-600 dark:text-mono-400 mb-2">
            We encountered an unexpected error.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-sm text-mono-500 dark:text-mono-500 mt-4 p-4 bg-mono-100 dark:bg-mono-900 rounded-lg text-left font-mono">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-mono-200 dark:bg-mono-800 text-mono-950 dark:text-mono-50 font-medium rounded-lg hover:bg-mono-300 dark:hover:bg-mono-700 transition-colors"
          >
            Go Home
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-mono-200 dark:border-mono-700">
          <p className="text-sm text-mono-500 dark:text-mono-500">
            If this problem persists, please <Link href="/contact" className="text-accent-600 dark:text-accent-400 hover:underline">contact support</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
