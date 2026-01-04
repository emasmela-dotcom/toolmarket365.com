import { Hero } from '@/components/Hero'
import { ToolCategories } from '@/components/ToolCategories'
import { FeaturedTools } from '@/components/FeaturedTools'
import { ValuePropositions } from '@/components/ValuePropositions'
import { CommentBoard } from '@/components/CommentBoard'

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ValuePropositions />
      <ToolCategories />
      <FeaturedTools />
      <CommentBoard />
    </div>
  )
}


