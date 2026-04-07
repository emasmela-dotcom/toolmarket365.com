'use client'

import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
