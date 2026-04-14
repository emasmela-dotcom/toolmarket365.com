import { Hero } from '@/components/Hero'
import { FeaturedTools } from '@/components/FeaturedTools'
import { ValuePropositions } from '@/components/ValuePropositions'
import { Stats } from '@/components/Stats'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedTools />
      <ValuePropositions />
      <Stats />
    </>
  )
}
