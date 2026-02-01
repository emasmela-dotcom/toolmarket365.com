import { Hero } from '@/components/Hero'
import { FeaturedTools } from '@/components/FeaturedTools'
import { ToolCategories } from '@/components/ToolCategories'
import { ValuePropositions } from '@/components/ValuePropositions'
import { Stats } from '@/components/Stats'

// Static so homepage is pre-rendered at build time; avoids Vercel runtime timeout on /
export const dynamic = 'force-static'

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedTools />
      <ToolCategories />
      <ValuePropositions />
      <Stats />
    </>
  )
}
