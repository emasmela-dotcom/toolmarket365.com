import Link from 'next/link'
import { 
  FileText, 
  Search, 
  BarChart3, 
  Share2, 
  Video, 
  Palette, 
  PenTool, 
  DollarSign,
  Users,
  Calendar,
  Sparkles
} from 'lucide-react'

const categories = [
  {
    icon: FileText,
    name: 'Content Planning',
    description: 'Strategic content calendars and planning tools',
    count: 24,
    color: 'accent',
  },
  {
    icon: Search,
    name: 'SEO Optimization',
    description: 'Advanced SEO tools for maximum visibility',
    count: 18,
    color: 'accent',
  },
  {
    icon: BarChart3,
    name: 'Analytics Dashboard',
    description: 'Comprehensive performance tracking and insights',
    count: 22,
    color: 'accent',
  },
  {
    icon: Share2,
    name: 'Social Media',
    description: 'Multi-platform management and scheduling',
    count: 28,
    color: 'accent',
  },
  {
    icon: Video,
    name: 'Video Tools',
    description: 'Professional video editing and optimization',
    count: 16,
    color: 'accent',
  },
  {
    icon: Palette,
    name: 'Design Suite',
    description: 'Advanced design and branding tools',
    count: 20,
    color: 'accent',
  },
  {
    icon: PenTool,
    name: 'Writing Assistant',
    description: 'AI-powered writing and content generation',
    count: 15,
    color: 'accent',
  },
  {
    icon: DollarSign,
    name: 'Revenue Tracking',
    description: 'Monetization and revenue optimization',
    count: 12,
    color: 'accent',
  },
  {
    icon: Users,
    name: 'Collaboration',
    description: 'Team collaboration and workflow tools',
    count: 14,
    color: 'accent',
  },
  {
    icon: Calendar,
    name: 'Scheduling',
    description: 'Multi-platform content scheduling',
    count: 10,
    color: 'accent',
  },
  {
    icon: Sparkles,
    name: 'AI Tools',
    description: 'AI-powered content generation and optimization',
    count: 19,
    color: 'accent',
  },
]

export function ToolCategories() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-mono-950 mb-4">
            Essential Tool Categories
          </h2>
          <p className="text-lg text-mono-600 max-w-2xl mx-auto">
            Comprehensive toolkit covering every aspect of content creation and optimization.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.name}
                href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group bg-mono-50 border border-mono-200 rounded-lg p-6 hover:border-accent-300 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent-200 transition-colors">
                  <Icon className="h-6 w-6 text-accent-600" />
                </div>
                <h3 className="text-lg font-semibold text-mono-950 mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-mono-600 mb-3">
                  {category.description}
                </p>
                <div className="text-sm font-medium text-accent-600">
                  {category.count} tools
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}


