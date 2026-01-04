import Link from 'next/link'
import { Hero } from '@/components/Hero'

const toolSections = [
  { title: 'High Priority - Complete the Workflow', slug: 'high-priority-complete-the-workflow' },
  { title: 'Content Creation & Optimization', slug: 'content-creation-optimization' },
  { title: 'Brand & Design', slug: 'brand-design' },
  { title: 'Analytics & Insights', slug: 'analytics-insights' },
  { title: 'Business & Monetization', slug: 'business-monetization' },
  { title: 'Engagement & Growth', slug: 'engagement-growth' },
  { title: 'SEO & Optimization', slug: 'seo-optimization' },
  { title: 'Workflow & Productivity', slug: 'workflow-productivity' },
]

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      
      <section className="py-12 bg-mono-50 dark:bg-mono-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-mono-950 dark:text-mono-50 mb-8 text-center">
              These are the tools we offer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {toolSections.map((section, idx) => (
                <Link
                  key={idx}
                  href={`/tools?section=${section.slug}`}
                  className="border-2 border-mono-200 dark:border-mono-700 rounded-lg p-4 text-center hover:border-accent-500 dark:hover:border-accent-500 transition-colors block"
                >
                  <h3 className="text-base font-semibold text-mono-950 dark:text-mono-50 hover:text-accent-600 dark:hover:text-accent-400 transition-colors">
                    {section.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


