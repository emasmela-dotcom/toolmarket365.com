import { Suspense } from 'react'
import { HomePageClient } from '@/components/HomePageClient'

export const dynamic = 'force-dynamic'

function HomeLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-mono-50">
      <div className="animate-pulse text-mono-500 text-sm">Loading…</div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomePageClient />
    </Suspense>
  )
}
