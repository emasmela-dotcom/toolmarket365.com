import { Suspense } from 'react'
import ResetClient from './ResetClient'

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-mono-100 dark:bg-mono-100 py-10 px-4">
          <div className="max-w-lg mx-auto">
            <div className="bg-white dark:bg-white rounded-2xl shadow-xl p-6 border border-mono-300 dark:border-mono-300">
              <p className="text-sm text-mono-700">Loading…</p>
            </div>
          </div>
        </div>
      }
    >
      <ResetClient />
    </Suspense>
  )
}

