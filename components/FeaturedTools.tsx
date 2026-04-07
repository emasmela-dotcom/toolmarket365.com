import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

const featuredTools = [
  {
    name: 'AI Content Generator',
    description: 'Advanced AI that creates better content than competitors. Multi-format support with SEO optimization.',
    category: 'AI Tools',
    rating: 4.9,
    users: '25K+',
    badge: 'Most Popular',
  },
  {
    name: 'Multi-Platform Scheduler',
    description: 'Schedule across all platforms simultaneously. Better automation than Hootsuite or Buffer.',
    category: 'Social Media',
    rating: 4.8,
    users: '18K+',
    badge: 'Essential',
  },
  {
    name: 'Performance Analytics',
    description: 'Deep analytics competitors don\'t offer. Track ROI, engagement, and revenue across all channels.',
    category: 'Analytics',
    rating: 4.9,
    users: '22K+',
    badge: 'Pro Feature',
  },
  {
    name: 'Revenue Optimizer',
    description: 'Maximize monetization across all revenue streams. Track and optimize earnings automatically.',
    category: 'Revenue',
    rating: 4.7,
    users: '15K+',
    badge: 'New',
  },
]

export function FeaturedTools() {
  return (
    <section className="py-20 bg-mono-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-mono-950 mb-4">
              Featured Essential Tools
            </h2>
            <p className="text-lg text-mono-600">
              Tools that outperform competitors and provide unique value.
            </p>
          </div>
          <Link
            href="/tools"
            className="hidden sm:flex items-center text-accent-600 hover:text-accent-700 font-medium"
          >
            View All Tools
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredTools.map((tool) => (
            <Link
              key={tool.name}
              href={`/tools/${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group bg-white border border-mono-200 rounded-lg p-6 hover:border-accent-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-1 bg-accent-100 text-accent-700 rounded">
                      {tool.badge}
                    </span>
                    <span className="text-sm text-mono-500">{tool.category}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-mono-950 mb-2 group-hover:text-accent-600 transition-colors">
                    {tool.name}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-mono-600 mb-4">
                {tool.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-mono-600">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent-400 text-accent-400" />
                    <span className="font-medium">{tool.rating}</span>
                  </div>
                  <span>{tool.users} users</span>
                </div>
                <ArrowRight className="h-5 w-5 text-mono-400 group-hover:text-accent-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}


