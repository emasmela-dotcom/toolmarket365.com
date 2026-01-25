import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative bg-mono-50 dark:bg-mono-950 border-b border-mono-200 dark:border-mono-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Market Statistic */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center space-x-2 bg-accent-50 dark:bg-accent-950/30 px-4 py-2 rounded-lg border border-accent-200 dark:border-accent-800 mb-4">
              <span className="text-2xl sm:text-3xl font-bold text-accent-600 dark:text-accent-400">
                162 Million
              </span>
              <span className="text-sm sm:text-base text-mono-700 dark:text-mono-300">
                content creators in the U.S.
              </span>
            </div>
            <p className="text-lg sm:text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">
              Are you one of them?
            </p>
            <p className="text-base sm:text-lg font-bold text-accent-600 dark:text-accent-400">
              Grow with CreatorFlow365
            </p>
          </div>
          
          <div className="mb-4">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-accent-600 dark:text-accent-400 mb-4">
              Improve Your Content with CreatorFlow365!
            </p>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-mono-950 dark:text-mono-50 mb-3">
            CreatorFlow<span className="text-accent-600 dark:text-accent-400">365</span>
          </h1>
          <p className="text-base sm:text-lg text-mono-600 dark:text-mono-400 mb-2 max-w-xl mx-auto font-medium">
            The Micro-SaaS Marketplace for Content Creators
          </p>
          <p className="text-sm sm:text-base text-mono-600 dark:text-mono-400 mb-3 max-w-xl mx-auto">
            Build, optimize, and monetize your content with 43+ professional tools—all in one place. Store, organize, and manage all your content in your personal cloud library.
          </p>
          <p className="text-base sm:text-lg font-semibold text-accent-600 dark:text-accent-400 mb-6 max-w-2xl mx-auto">
            Run your entire creator business from one platform—not just schedule posts.
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
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-mono-900 dark:bg-mono-100 text-white dark:text-mono-950 font-medium rounded-lg hover:bg-mono-800 dark:hover:bg-mono-200 transition-colors text-sm"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}


