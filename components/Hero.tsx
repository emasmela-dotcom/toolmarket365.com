import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative bg-mono-50 dark:bg-mono-950 border-b border-mono-200 dark:border-mono-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-mono-950 dark:text-mono-50 mb-3">
            Build, Optimize, and{' '}
            <span className="text-accent-600 dark:text-accent-400">Monetize Your Content</span>
          </h1>
          <p className="text-sm sm:text-base text-mono-600 dark:text-mono-400 mb-6 max-w-xl mx-auto">
            43 professional tools for content creators—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tools"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors text-sm"
            >
              Browse All Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50 font-medium rounded-lg hover:bg-mono-100 dark:hover:bg-mono-700 transition-colors border border-mono-200 dark:border-mono-700 text-sm"
            >
              View Categories
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}


