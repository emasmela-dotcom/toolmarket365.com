import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative bg-mono-950 text-mono-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Essential Tools for
            <span className="text-accent-400"> Professional Creators</span>
          </h1>
          <p className="text-lg sm:text-xl text-mono-300 mb-8 max-w-2xl mx-auto">
            Comprehensive toolkit marketplace with advanced features competitors lack. 
            Everything you need to create, optimize, and monetize content at scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tools"
              className="inline-flex items-center justify-center px-6 py-3 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors"
            >
              Explore Tools
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center px-6 py-3 bg-mono-800 text-mono-50 font-medium rounded-lg hover:bg-mono-700 transition-colors border border-mono-700"
            >
              View Categories
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}


