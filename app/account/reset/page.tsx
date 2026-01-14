import { Suspense } from 'react'
import ResetClient from './ResetClient'

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-10 px-4">
          <div className="max-w-lg mx-auto">
            <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
              <p className="text-sm text-mono-600 dark:text-mono-400">Loading…</p>
            </div>
          </div>
        </div>
      }
    >
      <ResetClient />
    </Suspense>
  )
}

