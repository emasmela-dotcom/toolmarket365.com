'use client'

import Link from 'next/link'
import { Check } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-8 text-center shadow-lg">
        <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
          <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-2">
          Payment successful
        </h1>
        <p className="text-mono-600 dark:text-mono-400 mb-6">
          Thank you for your purchase. Your account will be updated shortly.
        </p>
        <Link
          href="/dashboard"
          className="inline-block w-full py-2.5 px-4 bg-accent-600 text-white rounded-lg font-semibold hover:bg-accent-700 transition-colors"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/pricing"
          className="block mt-3 text-sm text-accent-600 dark:text-accent-400 hover:underline"
        >
          Back to Pricing
        </Link>
      </div>
    </div>
  )
}
