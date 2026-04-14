import Link from 'next/link'
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-950 dark:text-gray-50 mb-3">
            Creator Tools
          </h1>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6">
            Use the tools you added.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tools"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Browse All Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-lg border transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
            >
              View Categories
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-950 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}


