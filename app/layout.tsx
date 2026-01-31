import type { Metadata } from 'next'
import './globals.css'
import { AppShell } from '@/components/AppShell'

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
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
