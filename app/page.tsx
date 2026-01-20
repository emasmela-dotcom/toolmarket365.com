import Link from 'next/link'
import { Hero } from '@/components/Hero'
import { Cloud, Search, Folder, Tag } from 'lucide-react'

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
      
      {/* Content Library Feature Section */}
      <section className="py-16 bg-white dark:bg-mono-950 border-b border-mono-200 dark:border-mono-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Cloud className="w-8 h-8 text-accent-600" />
                  <h2 className="text-3xl font-bold text-mono-950 dark:text-mono-50">
                    Your Content Library
                  </h2>
                </div>
                <p className="text-lg text-mono-600 dark:text-mono-400 mb-6">
                  Store, organize, and manage all your content in one secure cloud library. Never lose your work again.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <Search className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">Smart Search</h3>
                      <p className="text-sm text-mono-600 dark:text-mono-400">Find any content instantly with advanced search and filtering</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Folder className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">Organize with Collections</h3>
                      <p className="text-sm text-mono-600 dark:text-mono-400">Group your content into collections and folders for easy management</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Tag className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">Tag & Categorize</h3>
                      <p className="text-sm text-mono-600 dark:text-mono-400">Tag your content for quick retrieval and organization</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/tools/content-library"
                  className="inline-flex items-center px-6 py-3 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors"
                >
                  Open Content Library
                </Link>
              </div>
              <div className="bg-mono-50 dark:bg-mono-900 rounded-lg p-8 border border-mono-200 dark:border-mono-700">
                <h3 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-4">What You Can Store</h3>
                <ul className="space-y-3 text-mono-700 dark:text-mono-300">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-accent-600 rounded-full"></span>
                    <span>Text content, captions, and notes</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-accent-600 rounded-full"></span>
                    <span>Images, videos, and audio files</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-accent-600 rounded-full"></span>
                    <span>Documents and PDFs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-accent-600 rounded-full"></span>
                    <span>Content templates and designs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-accent-600 rounded-full"></span>
                    <span>Links and external resources</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-accent-600 rounded-full"></span>
                    <span>Performance metrics and analytics</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
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


