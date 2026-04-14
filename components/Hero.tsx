import Link from 'next/link'
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative bg-mono-50 dark:bg-mono-950 border-b border-mono-200 dark:border-mono-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-mono-950 dark:text-mono-50 mb-3">
            Creator Tools
          </h1>
          <p className="text-base sm:text-lg text-mono-600 dark:text-mono-400 mb-6">
            Use the tools you added.
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
              className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-lg border transition-colors bg-white text-mono-950 border-mono-300 hover:bg-mono-100 dark:bg-mono-800 dark:text-white dark:border-mono-600 dark:hover:bg-mono-700"
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


