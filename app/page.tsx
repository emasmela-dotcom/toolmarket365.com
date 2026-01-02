import { Hero } from '@/components/Hero'
import { ToolCategories } from '@/components/ToolCategories'
import { FeaturedTools } from '@/components/FeaturedTools'
import { ValuePropositions } from '@/components/ValuePropositions'
import { Stats } from '@/components/Stats'

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Stats />
      <ValuePropositions />
      <ToolCategories />
      <FeaturedTools />
    </div>
  )
}


