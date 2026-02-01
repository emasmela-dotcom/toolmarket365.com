import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { Footer } from '@/components/Footer'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

export const metadata: Metadata = {
  title: 'CreatorFlow365 — The Micro-SaaS Marketplace for Content Creators',
  description: 'The Micro-SaaS Marketplace for Content Creators. Professional toolkit with 53+ tools for content planning, SEO, analytics, social media, viral content prediction, and revenue optimization.',
  keywords: ['content creator tools', 'social media tools', 'content planning', 'SEO tools', 'creator economy', 'content library', 'viral content predictor', 'social media analytics'],
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="sticky top-0 z-50 border-b border-mono-200 bg-mono-50/95 backdrop-blur-sm">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-2">
              <div className="flex flex-col items-start flex-shrink-0">
                <Link href="/" className="flex items-center space-x-1 mb-1">
                  <span className="text-xl font-bold text-mono-950">CreatorFlow</span>
                  <span className="text-xl font-bold text-accent-600">365</span>
                </Link>
                <Link href="/compare" className="text-xs font-semibold text-accent-600 hover:text-accent-700 transition-colors bg-accent-50 dark:bg-accent-900/30 px-2 py-1 rounded border border-accent-200 dark:border-accent-800 whitespace-nowrap">
                  Compare ⭐
                </Link>
              </div>
              <div className="hidden md:flex flex-col gap-y-2 flex-1 justify-center mx-4">
                <div className="flex items-center justify-center gap-x-4 gap-y-1 flex-wrap">
                  <Link href="/" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">Home</Link>
                  <Link href="/tools" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">Tools</Link>
                  <Link href="/tools/content-library" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">Content Library</Link>
                  <Link href="/growth-suite" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">Growth Suite</Link>
                  <Link href="/dashboard" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">Dashboard</Link>
                </div>
                <div className="flex items-center justify-center gap-x-4 gap-y-1 flex-wrap">
                  <Link href="/categories" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">Categories</Link>
                  <Link href="/pricing" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">Pricing</Link>
                  <Link href="/credits" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">Credit Costs</Link>
                  <Link href="/integrations" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">Integrations</Link>
                  <Link href="/contact" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">Contact</Link>
                </div>
              </div>
              <div className="flex items-center space-x-4 flex-shrink-0">
                <Link href="/login" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors">Sign In</Link>
                <Link href="/signup" className="px-4 py-2 bg-accent-600 text-white text-sm font-medium rounded-lg hover:text-accent-700 transition-colors">Sign Up</Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
