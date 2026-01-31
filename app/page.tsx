import Link from 'next/link'
import { Hero } from '@/components/Hero'
import { FeaturedTools } from '@/components/FeaturedTools'
import { ToolCategories } from '@/components/ToolCategories'
import { ValuePropositions } from '@/components/ValuePropositions'
import { Stats } from '@/components/Stats'

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
