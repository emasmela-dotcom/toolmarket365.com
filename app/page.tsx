import Link from 'next/link'
import { Hero } from '@/components/Hero'
import { Cloud, Search, Folder, Tag, TrendingUp, DollarSign, Video, ShoppingCart, Sparkles } from 'lucide-react'

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
      
      {/* Market Opportunity Section */}
      <section className="py-4 bg-white dark:bg-mono-950 border-b border-mono-200 dark:border-mono-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
                The Creator Economy is Exploding
              </h2>
              
              {/* Market Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 max-w-4xl mx-auto">
                <div className="inline-flex items-center justify-center space-x-2 bg-accent-50 dark:bg-accent-950/30 px-6 py-3 rounded-lg border-2 border-accent-200 dark:border-accent-800">
                  <TrendingUp className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                  <span className="text-2xl sm:text-3xl font-bold text-accent-600 dark:text-accent-400">
                    $1 Trillion+
                  </span>
                  <span className="text-sm sm:text-base text-mono-700 dark:text-mono-300">
                    global market by mid-2030s
                  </span>
                </div>
                
                <div className="inline-flex items-center justify-center space-x-2 bg-blue-50 dark:bg-blue-950/30 px-6 py-3 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                  <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                    162 Million
                  </span>
                  <span className="text-sm sm:text-base text-mono-700 dark:text-mono-300">
                    content creators in the U.S.
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm sm:text-base text-mono-700 dark:text-mono-300 text-center mb-4 max-w-4xl mx-auto">
              With <strong className="text-accent-600 dark:text-accent-400">162 million content creators in the U.S.</strong> and the global creator economy projected to hit over <strong className="text-accent-600 dark:text-accent-400">$1 trillion by the mid-2030s</strong>, there's never been a better time to build your creator brand. The industry is experiencing massive, sustained growth, driven by demand for personalized content, evolving monetization tools, and platform empowerment.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div className="bg-mono-50 dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                    <Video className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-mono-950 dark:text-mono-50">Video Content</h3>
                </div>
                <p className="text-sm text-mono-600 dark:text-mono-400">
                  Increasing reliance on video for entertainment, marketing, and training across diverse sectors
                </p>
              </div>
              
              <div className="bg-mono-50 dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-mono-950 dark:text-mono-50">Social Commerce</h3>
                </div>
                <p className="text-sm text-mono-600 dark:text-mono-400">
                  E-commerce integration and influencer marketing driving new revenue streams
                </p>
              </div>
              
              <div className="bg-mono-50 dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                    <Sparkles className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-mono-950 dark:text-mono-50">AI & Tech</h3>
                </div>
                <p className="text-sm text-mono-600 dark:text-mono-400">
                  Easier-to-use technology and AI tools empowering creators at every level
                </p>
              </div>
            </div>
            
            <p className="text-center text-xs text-mono-500 dark:text-mono-500 italic">
              Now is the time to build your content brand and position yourself in this rapidly growing market.
            </p>
          </div>
        </div>
      </section>
      
      {/* Tools Exploration Callout */}
      <section className="py-3 bg-accent-600 dark:bg-accent-700 border-b-4 border-accent-700 dark:border-accent-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-base sm:text-lg lg:text-xl font-bold text-white leading-tight mb-3">
              CreatorFlow365 has several tools! Many you will not use, but also many that will strengthen your brand of content. Look around, read how they work, how to use and build your content brand to its maximum potential!
            </p>
            <div className="bg-white/10 dark:bg-white/5 rounded-lg p-3 border border-white/20">
              <p className="text-sm sm:text-base text-white/95 leading-tight">
                <strong>All tools are fully template-based and work immediately with zero cost.</strong> Tools can be enhanced with external integrations that provide additional functionality, but at the creator's cost—CreatorFlow365 never charges for API usage.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Content Library Feature Section */}
      <section className="py-12 bg-white dark:bg-mono-950 border-b border-mono-200 dark:border-mono-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Cloud className="w-6 h-6 text-accent-600" />
                  <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
                    Your Content Library
                  </h2>
                </div>
                <p className="text-sm text-mono-600 dark:text-mono-400 mb-3">
                  Store, organize, and manage all your content in one secure cloud library. Never lose your work again.
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex items-start space-x-2">
                    <Search className="w-4 h-4 text-accent-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-sm text-mono-950 dark:text-mono-50 mb-0.5">Smart Search</h3>
                      <p className="text-xs text-mono-600 dark:text-mono-400">Find any content instantly with advanced search and filtering</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Folder className="w-4 h-4 text-accent-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-sm text-mono-950 dark:text-mono-50 mb-0.5">Organize with Collections</h3>
                      <p className="text-xs text-mono-600 dark:text-mono-400">Group your content into collections and folders for easy management</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Tag className="w-4 h-4 text-accent-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-sm text-mono-950 dark:text-mono-50 mb-0.5">Tag & Categorize</h3>
                      <p className="text-xs text-mono-600 dark:text-mono-400">Tag your content for quick retrieval and organization</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/tools/content-library"
                  className="inline-flex items-center px-5 py-2 bg-accent-600 text-white text-sm font-medium rounded-lg hover:bg-accent-700 transition-colors"
                >
                  Open Content Library
                </Link>
              </div>
              <div className="bg-mono-50 dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <h3 className="text-lg font-semibold text-mono-950 dark:text-mono-50 mb-3">What You Can Store</h3>
                <ul className="space-y-2 text-sm text-mono-700 dark:text-mono-300">
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-accent-600 rounded-full"></span>
                    <span>Text content, captions, and notes</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-accent-600 rounded-full"></span>
                    <span>Images, videos, and audio files</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-accent-600 rounded-full"></span>
                    <span>Documents and PDFs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-accent-600 rounded-full"></span>
                    <span>Content templates and designs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-accent-600 rounded-full"></span>
                    <span>Links and external resources</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-accent-600 rounded-full"></span>
                    <span>Performance metrics and analytics</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-4 bg-mono-50 dark:bg-mono-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4 text-center">
              These are the tools we offer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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


