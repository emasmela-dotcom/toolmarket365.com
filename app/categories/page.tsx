'use client'

import Link from 'next/link'
import {
  BarChart3,
  Search,
  Video,
  Palette,
  TrendingUp,
  DollarSign,
  FolderOpen,
  Zap,
  LineChart,
  Wallet,
  Sparkles,
  Megaphone,
  UsersRound,
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { translatedCategories } from '@/lib/i18n/translations'

const categories = [
  {
    slug: 'content-creation-optimization',
    icon: Video,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    toolCount: 9,
    tools: [
      'Video Script Generator',
      'Video Transcript Generator',
      'Thumbnail Text Generator',
      'Quote Card Generator',
      'Image Alt Text Generator',
      'Podcast Show Notes Generator',
      'Blog Outline Generator',
      'Readability Checker',
      'Content Idea Generator',
    ],
  },
  {
    slug: 'brand-design',
    icon: Palette,
    color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    toolCount: 6,
    tools: [
      'Brand Kit Manager',
      'Color Palette Extractor',
      'Font Pairing Tool',
      'Style Guide Creator',
      'Profile Optimizer',
      'Bio Generator',
    ],
  },
  {
    slug: 'analytics-insights',
    icon: BarChart3,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    toolCount: 12,
    tools: [
      'Viral Content Predictor',
      'Engagement Calculator',
      'Social Media Report Generator',
      'Hashtag Analyzer',
      'Hashtag Research',
      'Competitor Analyzer',
      'Trend Tracker',
      'Content Gap Analyzer',
      'Brand Mention Tracker',
      'Sentiment Analyzer',
      'Follower Growth Tracker',
      'Cross-Platform Analytics',
    ],
  },
  {
    slug: 'business-monetization',
    icon: DollarSign,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    toolCount: 2,
    tools: ['Rate Calculator', 'Revenue Tracker'],
  },
  {
    slug: 'engagement-growth',
    icon: TrendingUp,
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    toolCount: 6,
    tools: [
      'Poll / Question Generator',
      'Giveaway Manager',
      'Influencer Outreach Tool',
      'Collaboration Manager',
      'Link in Bio Manager',
      'Link in Bio Optimizer',
    ],
  },
  {
    slug: 'seo-optimization',
    icon: Search,
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    toolCount: 4,
    tools: ['SEO Optimizer', 'Hashtag Research', 'Image Alt Text Generator', 'Readability Checker'],
  },
  {
    slug: 'workflow-productivity',
    icon: FolderOpen,
    color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    toolCount: 5,
    tools: [
      'Content Calendar',
      'Content Library',
      'Social Media Post Formatter',
      'Social Scheduler',
      'Best Time to Post',
    ],
  },
  {
    slug: 'productivity-workflow',
    icon: Zap,
    color: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
    toolCount: 5,
    tools: [
      'Notion-to-PDF exporter',
      'Meeting summarizer',
      'Recurring task automator',
      'Email digest builder',
      'Focus timer with analytics',
    ],
  },
  {
    slug: 'analytics-reporting',
    icon: LineChart,
    color: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
    toolCount: 5,
    tools: [
      'Uptime monitor',
      'SEO audit tool',
      'Google Analytics simplifier',
      'Changelog generator',
      'Heatmap recorder',
    ],
  },
  {
    slug: 'finance-billing',
    icon: Wallet,
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    toolCount: 4,
    tools: ['Invoice generator', 'Expense tracker', 'Subscription tracker', 'Revenue dashboard'],
  },
  {
    slug: 'ai-powered-tools',
    icon: Sparkles,
    color: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200',
    toolCount: 5,
    tools: [
      'AI blog post writer',
      'AI image alt-text generator',
      'AI email reply assistant',
      'AI product description writer',
      'AI cold outreach personalizer',
    ],
  },
  {
    slug: 'marketing-social',
    icon: Megaphone,
    color: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
    toolCount: 5,
    tools: [
      'Social media scheduler',
      'Link-in-bio builder',
      'Review request automator',
      'Twitter/X thread composer',
      'Lead magnet delivery tool',
    ],
  },
  {
    slug: 'client-team-tools',
    icon: UsersRound,
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    toolCount: 5,
    tools: [
      'Client portal builder',
      'Proposal/contract generator',
      'Simple CRM',
      'Feedback widget',
      'Team standup bot',
    ],
  },
]

export default function CategoriesPage() {
  const { language, t } = useLanguage()
  const categoryCopyBySlug = Object.fromEntries(
    translatedCategories[language].map((item) => [item.slug, item])
  )

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {t('categoriesTitle')}
            </h1>
            <p className="text-lg text-mono-600 dark:text-mono-400 max-w-2xl mx-auto">
              {t('categoriesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {categories.map((category) => {
              const IconComponent = category.icon
              const copy = categoryCopyBySlug[category.slug]
              return (
                <Link
                  key={category.slug}
                  href="/home"
                  className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700 hover:border-accent-500 dark:hover:border-accent-500 transition-all hover:shadow-lg group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${category.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-mono-500 dark:text-mono-400">
                      {t('categoriesToolCount').replace('{n}', String(category.toolCount))}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                    {copy.title}
                  </h3>

                  <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">{copy.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {category.tools.slice(0, 3).map((tool, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-mono-100 dark:bg-mono-800 rounded text-mono-700 dark:text-mono-300"
                      >
                        {tool}
                      </span>
                    ))}
                    {category.toolCount > 3 && (
                      <span className="text-xs px-2 py-1 bg-mono-100 dark:bg-mono-800 rounded text-mono-700 dark:text-mono-300">
                        {t('categoriesMore').replace('{n}', String(category.toolCount - 3))}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 text-sm text-accent-600 dark:text-accent-400 font-medium group-hover:underline">
                    {t('categoriesViewAll')}
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="bg-white dark:bg-mono-900 rounded-lg p-8 border border-mono-200 dark:border-mono-700">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6 text-center">
              {t('categoriesOverviewTitle')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600 dark:text-accent-400 mb-2">53+</div>
                <div className="text-sm text-mono-600 dark:text-mono-400">{t('categoriesStatTools')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600 dark:text-accent-400 mb-2">13</div>
                <div className="text-sm text-mono-600 dark:text-mono-400">
                  {t('categoriesStatCategories')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600 dark:text-accent-400 mb-2">100%</div>
                <div className="text-sm text-mono-600 dark:text-mono-400">{t('categoriesStatReady')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600 dark:text-accent-400 mb-2">24/7</div>
                <div className="text-sm text-mono-600 dark:text-mono-400">
                  {t('categoriesStatAvailable')}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/home"
              className="inline-flex items-center px-6 py-3 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors"
            >
              {t('categoriesBrowseAll')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
