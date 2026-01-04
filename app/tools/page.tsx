'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
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
      { name: 'Video Transcript Generator', slug: 'video-transcript-generator', icon: Video },
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
      { name: 'Brand Mention Tracker', slug: 'brand-mention-tracker', icon: BarChart3 },
      { name: 'Sentiment Analyzer', slug: 'sentiment-analyzer', icon: BarChart3 },
      { name: 'Follower Growth Tracker', slug: 'follower-growth-tracker', icon: TrendingUp },
      { name: 'Cross-Platform Analytics', slug: 'cross-platform-analytics', icon: BarChart3 },
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
      { name: 'Poll / Question Generator', slug: 'poll-question-generator', icon: Lightbulb },
      { name: 'Giveaway Manager', slug: 'giveaway-manager', icon: Calendar },
      { name: 'Influencer Outreach Tool', slug: 'influencer-outreach-tool', icon: FileText },
      { name: 'Collaboration Manager', slug: 'collaboration-manager', icon: Calendar },
      { name: 'Link in Bio Manager', slug: 'link-in-bio-manager', icon: LinkIcon },
      { name: 'Link in Bio Optimizer', slug: 'link-in-bio-optimizer', icon: LinkIcon },
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

function ToolsPageContent() {
  const searchParams = useSearchParams()
  const sectionParam = searchParams.get('section')

  // Generate slug map
  const sectionSlugMap: { [key: string]: string } = {
    'high-priority-complete-the-workflow': 'High Priority - Complete the Workflow',
    'content-creation-optimization': 'Content Creation & Optimization',
    'brand-design': 'Brand & Design',
    'analytics-insights': 'Analytics & Insights',
    'business-monetization': 'Business & Monetization',
    'engagement-growth': 'Engagement & Growth',
    'seo-optimization': 'SEO & Optimization',
    'workflow-productivity': 'Workflow & Productivity',
  }

  // Filter sections if section parameter is provided
  const displaySections = sectionParam && sectionSlugMap[sectionParam]
    ? toolSections.filter(section => section.title === sectionSlugMap[sectionParam])
    : toolSections

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
            {sectionParam ? sectionSlugMap[sectionParam] || 'All Tools' : 'All Tools'}
          </h1>
          <p className="text-xl text-mono-600 dark:text-mono-400">
            {sectionParam 
              ? `${displaySections[0]?.tools.length || 0} tools in this section`
              : `${Array.from(allTools.values()).length} professional tools for content creators`
            }
          </p>
          {sectionParam && (
            <Link
              href="/tools"
              className="inline-block mt-4 text-accent-600 dark:text-accent-400 hover:underline"
            >
              ← View All Sections
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displaySections.map((section, sectionIdx) => {
            // Generate slug to match homepage links
            const reverseSlugMap: { [key: string]: string } = {
              'High Priority - Complete the Workflow': 'high-priority-complete-the-workflow',
              'Content Creation & Optimization': 'content-creation-optimization',
              'Brand & Design': 'brand-design',
              'Analytics & Insights': 'analytics-insights',
              'Business & Monetization': 'business-monetization',
              'Engagement & Growth': 'engagement-growth',
              'SEO & Optimization': 'seo-optimization',
              'Workflow & Productivity': 'workflow-productivity',
            }
            const sectionSlug = reverseSlugMap[section.title] || section.title.toLowerCase().replace(/\s+/g, '-')
            return (
            <div 
              key={sectionIdx} 
              id={sectionSlug}
              className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 scroll-mt-8"
            >
              <div className="mb-4">
                <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2">
                  {section.title}
                </h2>
                <p className="text-sm text-mono-600 dark:text-mono-400">
                  {section.description}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {section.tools.map(tool => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 hover:underline transition-colors text-sm"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function ToolsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-mono-600 dark:text-mono-400">Loading...</p>
        </div>
      </div>
    }>
      <ToolsPageContent />
    </Suspense>
  )
}

