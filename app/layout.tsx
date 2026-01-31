import type { Metadata } from 'next'
import './globals.css'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata: Metadata = {
  title: 'CreatorFlow365 — The Micro-SaaS Marketplace for Content Creators',
  description: 'The Micro-SaaS Marketplace for Content Creators.',
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-mono-50 text-mono-900">
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
