import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'CreatorFlow365 — The Micro-SaaS Marketplace for Content Creators',
  description: 'The Micro-SaaS Marketplace for Content Creators. Professional toolkit with 53+ tools for content planning, SEO, analytics, social media, viral content prediction, and revenue optimization.',
  keywords: ['content creator tools', 'social media tools', 'content planning', 'SEO tools', 'creator economy', 'content library', 'viral content predictor', 'social media analytics'],
  robots: { index: true, follow: true },
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
          <div className="w-full px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-1">
                <span className="text-xl font-bold text-mono-950">CreatorFlow</span>
                <span className="text-xl font-bold text-accent-600">365</span>
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/" className="text-sm font-medium text-mono-700 hover:text-accent-600">Home</Link>
                <Link href="/tools" className="text-sm font-medium text-mono-700 hover:text-accent-600">Tools</Link>
                <Link href="/pricing" className="text-sm font-medium text-mono-700 hover:text-accent-600">Pricing</Link>
                <Link href="/login" className="text-sm font-medium text-mono-700 hover:text-accent-600">Sign In</Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-mono-200 bg-mono-50 py-8 px-4">
          <div className="container mx-auto text-center text-sm text-mono-600">
            <Link href="/" className="font-semibold text-mono-950">CreatorFlow365</Link>
            {' · '}
            <Link href="/tools">Tools</Link>
            {' · '}
            <Link href="/pricing">Pricing</Link>
            {' · '}
            <Link href="/contact">Contact</Link>
          </div>
        </footer>
      </body>
    </html>
  )
}
