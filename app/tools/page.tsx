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
  Eye,
  Palette,
  FileCheck,
  User,
  Sparkles as SparklesIcon
} from 'lucide-react'

const toolSections = [
  {
    title: 'High Priority - Complete the Workflow',
    description: 'Essential tools to complete your content creation workflow',
    tools: [
      { name: 'Post Scheduler', slug: 'post-scheduler', icon: Calendar },
      { name: 'Analytics Dashboard', slug: 'analytics-dashboard', icon: BarChart3 },
      { name: 'SEO Optimizer', slug: 'seo-optimizer', icon: Search },
      { name: 'Content Repurposer', slug: 'content-repurposer', icon: RefreshCw },
      { name: 'AI Caption Generator', slug: 'ai-caption-generator', icon: Sparkles },
    ]
  },
  {
    title: 'Content Creation & Optimization',
    description: 'Tools for creating and optimizing content across formats',
    tools: [
      { name: 'Video Script Generator', slug: 'video-script-generator', icon: Video },
      { name: 'Thumbnail Text Generator', slug: 'thumbnail-text-generator', icon: Type },
      { name: 'Quote Card Generator', slug: 'quote-card-generator', icon: Type },
      { name: 'Image Alt Text Generator', slug: 'image-alt-text-generator', icon: Image },
      { name: 'Podcast Show Notes Generator', slug: 'podcast-show-notes-generator', icon: Mic },
      { name: 'Blog Outline Generator', slug: 'blog-outline-generator', icon: Lightbulb },
      { name: 'Readability Checker', slug: 'readability-checker', icon: Eye },
      { name: 'Content Idea Generator', slug: 'content-idea-generator', icon: Lightbulb },
    ]
  },
  {
    title: 'Brand & Design',
    description: 'Create and manage your brand identity, colors, fonts, and style guides',
    tools: [
      { name: 'Brand Kit Manager', slug: 'brand-kit-manager', icon: Palette },
      { name: 'Color Palette Extractor', slug: 'color-palette-extractor', icon: Image },
      { name: 'Font Pairing Tool', slug: 'font-pairing-tool', icon: Type },
      { name: 'Style Guide Creator', slug: 'style-guide-creator', icon: FileCheck },
      { name: 'Profile Optimizer', slug: 'profile-optimizer', icon: User },
      { name: 'Bio Generator', slug: 'bio-generator', icon: SparklesIcon },
    ]
  },
  {
    title: 'Analytics & Insights',
    description: 'Track performance and gain insights into your content',
    tools: [
      { name: 'Engagement Calculator', slug: 'engagement-calculator', icon: TrendingUp },
      { name: 'Hashtag Analyzer', slug: 'hashtag-analyzer', icon: Hash },
      { name: 'Hashtag Research', slug: 'hashtag-research', icon: Hash },
      { name: 'Competitor Analyzer', slug: 'competitor-analyzer', icon: BarChart3 },
      { name: 'Trend Tracker', slug: 'trend-tracker', icon: TrendingUp },
      { name: 'Content Gap Analyzer', slug: 'content-gap-analyzer', icon: Lightbulb },
    ]
  },
  {
    title: 'Business & Monetization',
    description: 'Track revenue and calculate rates for your work',
    tools: [
      { name: 'Rate Calculator', slug: 'rate-calculator', icon: Calculator },
      { name: 'Revenue Tracker', slug: 'revenue-tracker', icon: DollarSign },
    ]
  },
  {
    title: 'Engagement & Growth',
    description: 'Tools to grow your audience and increase engagement',
    tools: [
      { name: 'Link in Bio Manager', slug: 'link-in-bio-manager', icon: LinkIcon },
    ]
  },
  {
    title: 'SEO & Optimization',
    description: 'Optimize your content for search engines and discoverability',
    tools: [
      { name: 'SEO Optimizer', slug: 'seo-optimizer', icon: Search },
      { name: 'Hashtag Research', slug: 'hashtag-research', icon: Hash },
      { name: 'Image Alt Text Generator', slug: 'image-alt-text-generator', icon: Image },
      { name: 'Readability Checker', slug: 'readability-checker', icon: Eye },
    ]
  },
  {
    title: 'Workflow & Productivity',
    description: 'Tools to organize, plan, and manage your content workflow',
    tools: [
      { name: 'Content Calendar', slug: 'content-calendar', icon: Calendar },
      { name: 'Content Library', slug: 'content-library', icon: FolderOpen },
      { name: 'Social Media Post Formatter', slug: 'social-media-post-formatter', icon: FileText },
      { name: 'Best Time to Post', slug: 'best-time-to-post', icon: Clock },
    ]
  },
]

export default function ToolsPage() {
  // Remove duplicates (some tools appear in multiple sections)
  const allTools = new Map()
  toolSections.forEach(section => {
    section.tools.forEach(tool => {
      if (!allTools.has(tool.slug)) {
        allTools.set(tool.slug, tool)
      }
    })
  })

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-mono-950 dark:text-mono-50 mb-4">
            All Tools
          </h1>
          <p className="text-xl text-mono-600 dark:text-mono-400">
            {Array.from(allTools.values()).length} professional tools for content creators
          </p>
        </div>

        <div className="space-y-16">
          {toolSections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-2">
                  {section.title}
                </h2>
                <p className="text-mono-600 dark:text-mono-400">
                  {section.description}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {section.tools.map(tool => {
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
          ))}
        </div>
      </div>
    </div>
  )
}

