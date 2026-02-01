import { Hero } from '@/components/Hero'
import { FeaturedTools } from '@/components/FeaturedTools'
import { ToolCategories } from '@/components/ToolCategories'
import { ValuePropositions } from '@/components/ValuePropositions'
import { Stats } from '@/components/Stats'

// Static so / is pre-rendered at build time; avoids Vercel 300s runtime timeout
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
