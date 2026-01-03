import Link from 'next/link'
import { 
  FileText, 
  Calendar, 
  Sparkles, 
  BarChart3, 
  Clock, 
  Lightbulb, 
  FolderOpen, 
  RefreshCw, 
  TrendingUp, 
  Hash, 
  Image, 
  Link as LinkIcon, 
  Mic, 
  Type, 
  Calculator, 
  DollarSign, 
  Search, 
  Video, 
  Download,
  Eye,
  Target
} from 'lucide-react'

const tools = [
  { name: 'Social Media Post Formatter', slug: 'social-media-post-formatter', icon: FileText, category: 'Content' },
  { name: 'Content Calendar', slug: 'content-calendar', icon: Calendar, category: 'Planning' },
  { name: 'AI Caption Generator', slug: 'ai-caption-generator', icon: Sparkles, category: 'AI Tools' },
  { name: 'Analytics Dashboard', slug: 'analytics-dashboard', icon: BarChart3, category: 'Analytics' },
  { name: 'Best Time to Post', slug: 'best-time-to-post', icon: Clock, category: 'Planning' },
  { name: 'Blog Outline Generator', slug: 'blog-outline-generator', icon: Lightbulb, category: 'Content' },
  { name: 'Content Idea Generator', slug: 'content-idea-generator', icon: Lightbulb, category: 'Content' },
  { name: 'Content Library', slug: 'content-library', icon: FolderOpen, category: 'Organization' },
  { name: 'Content Repurposer', slug: 'content-repurposer', icon: RefreshCw, category: 'Content' },
  { name: 'Engagement Calculator', slug: 'engagement-calculator', icon: TrendingUp, category: 'Analytics' },
  { name: 'Hashtag Research', slug: 'hashtag-research', icon: Hash, category: 'SEO' },
  { name: 'Hashtag Analyzer', slug: 'hashtag-analyzer', icon: Hash, category: 'Analytics' },
  { name: 'Image Alt Text Generator', slug: 'image-alt-text-generator', icon: Image, category: 'SEO' },
  { name: 'Link in Bio Manager', slug: 'link-in-bio-manager', icon: LinkIcon, category: 'Organization' },
  { name: 'Podcast Show Notes Generator', slug: 'podcast-show-notes-generator', icon: Mic, category: 'Content' },
  { name: 'Post Scheduler', slug: 'post-scheduler', icon: Calendar, category: 'Planning' },
  { name: 'Quote Card Generator', slug: 'quote-card-generator', icon: Type, category: 'Design' },
  { name: 'Rate Calculator', slug: 'rate-calculator', icon: Calculator, category: 'Business' },
  { name: 'Readability Checker', slug: 'readability-checker', icon: Eye, category: 'SEO' },
  { name: 'Revenue Tracker', slug: 'revenue-tracker', icon: DollarSign, category: 'Business' },
  { name: 'SEO Optimizer', slug: 'seo-optimizer', icon: Search, category: 'SEO' },
  { name: 'Thumbnail Text Generator', slug: 'thumbnail-text-generator', icon: Type, category: 'Design' },
  { name: 'Video Script Generator', slug: 'video-script-generator', icon: Video, category: 'Content' },
]

export default function ToolsPage() {
  const categories = Array.from(new Set(tools.map(t => t.category))).sort()

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-mono-950 dark:text-mono-50 mb-4">
            All Tools
          </h1>
          <p className="text-xl text-mono-600 dark:text-mono-400">
            {tools.length} professional tools for content creators
          </p>
        </div>

        <div className="space-y-12">
          {categories.map(category => {
            const categoryTools = tools.filter(t => t.category === category)
            return (
              <div key={category}>
                <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryTools.map(tool => {
                    const Icon = tool.icon
                    return (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        className="bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-700 rounded-lg p-6 hover:border-accent-500 hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-lg group-hover:bg-accent-200 dark:group-hover:bg-accent-900/50 transition-colors">
                            <Icon className="text-accent-600 dark:text-accent-400" size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-2 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                              {tool.name}
                            </h3>
                            <p className="text-sm text-mono-600 dark:text-mono-400">
                              Click to use →
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

