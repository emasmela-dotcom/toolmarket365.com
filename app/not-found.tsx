import Link from 'next/link'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-mono-50 dark:bg-mono-950 px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-accent-600 dark:text-accent-400 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-mono-600 dark:text-mono-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center justify-center px-6 py-3 bg-mono-200 dark:bg-mono-800 text-mono-950 dark:text-mono-50 font-medium rounded-lg hover:bg-mono-300 dark:hover:bg-mono-700 transition-colors"
          >
            <Search className="w-5 h-5 mr-2" />
            Browse Tools
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-mono-200 dark:bg-mono-800 text-mono-950 dark:text-mono-50 font-medium rounded-lg hover:bg-mono-300 dark:hover:bg-mono-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-mono-200 dark:border-mono-700">
          <p className="text-sm text-mono-500 dark:text-mono-500">
            Need help? <Link href="/contact" className="text-accent-600 dark:text-accent-400 hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
