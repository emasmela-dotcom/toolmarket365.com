import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

// Avoid static generation issues (e.g. event handlers passed to Client Components during SSG)
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'CreatorFlow365 — The Micro-SaaS Marketplace for Content Creators',
  description: 'The Micro-SaaS Marketplace for Content Creators. Professional toolkit with 53+ tools for content planning, SEO, analytics, social media, viral content prediction, and revenue optimization.',
  keywords: ['content creator tools', 'social media tools', 'content planning', 'SEO tools', 'creator economy', 'content library', 'viral content predictor', 'social media analytics'],
  authors: [{ name: 'CreatorFlow365' }],
  creator: 'CreatorFlow365',
  publisher: 'CreatorFlow365',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://creatorflow365.com',
    siteName: 'CreatorFlow365',
    title: 'CreatorFlow365 — The Micro-SaaS Marketplace for Content Creators',
    description: 'Professional toolkit with 53+ tools for content planning, SEO, analytics, social media, and revenue optimization.',
    images: [
      {
        url: '/og-image.png', // You'll need to create this
        width: 1200,
        height: 630,
        alt: 'CreatorFlow365 - Content Creator Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CreatorFlow365 — The Micro-SaaS Marketplace for Content Creators',
    description: 'Professional toolkit with 53+ tools for content planning, SEO, analytics, social media, and revenue optimization.',
    images: ['/og-image.png'], // You'll need to create this
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add when you have Google Search Console set up
    // google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Script src="https://gumroad.com/js/gumroad.js" strategy="lazyOnload" />
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}


