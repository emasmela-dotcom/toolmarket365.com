'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Hash, 
  FileText, 
  BarChart3, 
  Lightbulb,
  Clock,
  DollarSign,
  Search,
  RefreshCw,
  Zap,
  Bot,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

interface Bot {
  id: string
  name: string
  category: string
  description: string
  frequency: string
  icon: any
  price: string
}

const bots: Bot[] = [
  // Content Generation Bots
  {
    id: 'daily-caption-bot',
    name: 'Daily Caption Bot',
    category: 'Content Generation',
    description: 'Generates 3-5 captions daily based on your content theme and tone preferences',
    frequency: 'Daily',
    icon: FileText,
    price: '$9/month'
  },
  {
    id: 'weekly-content-ideas-bot',
    name: 'Weekly Content Ideas Bot',
    category: 'Content Generation',
    description: 'Sends 10 fresh content ideas every Monday to keep your content pipeline full',
    frequency: 'Weekly',
    icon: Lightbulb,
    price: '$7/month'
  },
  {
    id: 'hashtag-research-bot',
    name: 'Hashtag Research Bot',
    category: 'Content Generation',
    description: 'Weekly hashtag suggestions optimized for your niche and platform',
    frequency: 'Weekly',
    icon: Hash,
    price: '$6/month'
  },
  {
    id: 'blog-outline-bot',
    name: 'Blog Outline Bot',
    category: 'Content Generation',
    description: 'Generates structured blog outlines based on your topics and keywords',
    frequency: 'On-demand',
    icon: FileText,
    price: '$5/month'
  },
  // Analytics & Reporting Bots
  {
    id: 'weekly-performance-bot',
    name: 'Weekly Performance Report Bot',
    category: 'Analytics & Reporting',
    description: 'Automated weekly analytics summary delivered to your inbox every Monday',
    frequency: 'Weekly',
    icon: BarChart3,
    price: '$12/month'
  },
  {
    id: 'competitor-watch-bot',
    name: 'Competitor Watch Bot',
    category: 'Analytics & Reporting',
    description: 'Monthly competitor analysis reports tracking their performance and strategies',
    frequency: 'Monthly',
    icon: TrendingUp,
    price: '$15/month'
  },
  {
    id: 'engagement-tracker-bot',
    name: 'Engagement Tracker Bot',
    category: 'Analytics & Reporting',
    description: 'Daily engagement rate tracking with alerts when rates drop or spike',
    frequency: 'Daily',
    icon: TrendingUp,
    price: '$8/month'
  },
  // Optimization Bots
  {
    id: 'bio-optimizer-bot',
    name: 'Bio Optimizer Bot',
    category: 'Optimization',
    description: 'Monthly bio optimization suggestions to improve your profile effectiveness',
    frequency: 'Monthly',
    icon: Sparkles,
    price: '$5/month'
  },
  {
    id: 'profile-audit-bot',
    name: 'Profile Audit Bot',
    category: 'Optimization',
    description: 'Weekly profile health check with actionable improvement recommendations',
    frequency: 'Weekly',
    icon: CheckCircle2,
    price: '$6/month'
  },
  {
    id: 'seo-content-analyzer-bot',
    name: 'SEO Content Analyzer Bot',
    category: 'Optimization',
    description: 'Analyzes your content for SEO improvements and keyword optimization',
    frequency: 'On-demand',
    icon: Search,
    price: '$7/month'
  },
  // Planning & Scheduling Bots
  {
    id: 'content-calendar-bot',
    name: 'Content Calendar Builder Bot',
    category: 'Planning & Scheduling',
    description: 'Auto-generates monthly content calendar with optimal posting times',
    frequency: 'Monthly',
    icon: Calendar,
    price: '$10/month'
  },
  {
    id: 'best-time-post-bot',
    name: 'Best Time to Post Bot',
    category: 'Planning & Scheduling',
    description: 'Weekly suggestions for optimal posting times based on your audience',
    frequency: 'Weekly',
    icon: Clock,
    price: '$6/month'
  },
  {
    id: 'content-repurposing-bot',
    name: 'Content Repurposing Bot',
    category: 'Planning & Scheduling',
    description: 'Identifies repurposing opportunities from your existing content',
    frequency: 'Weekly',
    icon: RefreshCw,
    price: '$8/month'
  },
  // Research & Discovery Bots
  {
    id: 'trend-tracker-bot',
    name: 'Trend Tracker Bot',
    category: 'Research & Discovery',
    description: 'Weekly trend reports in your niche to keep content relevant',
    frequency: 'Weekly',
    icon: TrendingUp,
    price: '$9/month'
  },
  {
    id: 'content-gap-bot',
    name: 'Content Gap Analyzer Bot',
    category: 'Research & Discovery',
    description: 'Monthly content gap analysis comparing you to competitors',
    frequency: 'Monthly',
    icon: Lightbulb,
    price: '$10/month'
  },
  {
    id: 'viral-predictor-bot',
    name: 'Viral Content Predictor Bot',
    category: 'Research & Discovery',
    description: 'Pre-publish viral potential scores before you post content',
    frequency: 'On-demand',
    icon: Zap,
    price: '$12/month'
  },
  // Monetization Bots
  {
    id: 'rate-calculator-bot',
    name: 'Rate Calculator Bot',
    category: 'Monetization',
    description: 'Suggests optimal pricing based on your metrics and industry standards',
    frequency: 'On-demand',
    icon: DollarSign,
    price: '$7/month'
  },
  {
    id: 'revenue-tracker-bot',
    name: 'Revenue Tracker Bot',
    category: 'Monetization',
    description: 'Monthly revenue summaries with growth trends and insights',
    frequency: 'Monthly',
    icon: DollarSign,
    price: '$8/month'
  }
]

const categories = [
  'All Bots',
  'Content Generation',
  'Analytics & Reporting',
  'Optimization',
  'Planning & Scheduling',
  'Research & Discovery',
  'Monetization'
]

export default function BotsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Bots')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBots = bots.filter(bot => {
    const matchesCategory = selectedCategory === 'All Bots' || bot.category === selectedCategory
    const matchesSearch = bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bot.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent-600 to-accent-700 dark:from-accent-800 dark:to-accent-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Bot className="w-12 h-12" />
              <h1 className="text-4xl sm:text-5xl font-bold">Bot Farm</h1>
            </div>
            <p className="text-xl sm:text-2xl text-white/90 mb-6 max-w-3xl mx-auto">
              Automated bots that work 24/7 to handle your repetitive content tasks
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Set it once, forget it. Bots execute automatically and deliver results to your Content Library.
            </p>
          </div>

          {/* Key Features Box */}
          <div className="bg-white/10 dark:bg-white/5 rounded-lg p-6 border border-white/20 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Fully Template-Based</p>
                <p className="text-sm text-white/80">Zero cost to you or us</p>
              </div>
              <div>
                <Zap className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Automatic Execution</p>
                <p className="text-sm text-white/80">Runs on your schedule</p>
              </div>
              <div>
                <Sparkles className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Individual Pricing</p>
                <p className="text-sm text-white/80">Buy only what you need</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-white dark:bg-mono-900 border-b border-mono-200 dark:border-mono-700">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-mono-950 dark:text-mono-50">
            How Bot Farm Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-accent-100 dark:bg-accent-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent-600 dark:text-accent-400">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-mono-950 dark:text-mono-50">Choose Your Bot</h3>
              <p className="text-mono-600 dark:text-mono-400">
                Browse available bots and select the ones that fit your workflow
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent-100 dark:bg-accent-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent-600 dark:text-accent-400">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-mono-950 dark:text-mono-50">Configure & Activate</h3>
              <p className="text-mono-600 dark:text-mono-400">
                Set your preferences, schedule, and activate. Takes 2 minutes.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent-100 dark:bg-accent-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent-600 dark:text-accent-400">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-mono-950 dark:text-mono-50">Get Results Automatically</h3>
              <p className="text-mono-600 dark:text-mono-400">
                Bot runs automatically, saves results to your Content Library, and notifies you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-blue-50 dark:bg-blue-900/20 border-b-2 border-blue-400 dark:border-blue-600">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-2">
                All Bots Are Template-Based
              </h3>
              <p className="text-blue-800 dark:text-blue-300">
                <strong>All bots work immediately with zero cost to you or CreatorFlow365.</strong> No external API calls, no setup fees, no usage charges. Bots can be enhanced with external integrations that provide additional functionality, but at the creator's cost—CreatorFlow365 never charges for API usage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bots Marketplace */}
      <section className="py-12 bg-mono-50 dark:bg-mono-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold text-mono-950 dark:text-mono-50">
              Available Bots
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search bots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-accent-600 text-white'
                    : 'bg-white dark:bg-mono-900 text-mono-700 dark:text-mono-300 border border-mono-300 dark:border-mono-700 hover:bg-mono-100 dark:hover:bg-mono-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Bots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBots.map(bot => {
              const Icon = bot.icon
              return (
                <div
                  key={bot.id}
                  className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                        <Icon className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-mono-950 dark:text-mono-50">
                          {bot.name}
                        </h3>
                        <span className="text-xs text-mono-500 dark:text-mono-500 bg-mono-100 dark:bg-mono-800 px-2 py-1 rounded">
                          {bot.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-mono-600 dark:text-mono-400 mb-4 text-sm">
                    {bot.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-mono-200 dark:border-mono-700">
                    <div>
                      <p className="text-xs text-mono-500 dark:text-mono-500">Frequency</p>
                      <p className="text-sm font-medium text-mono-700 dark:text-mono-300">{bot.frequency}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-mono-500 dark:text-mono-500">Price</p>
                      <p className="text-lg font-bold text-accent-600 dark:text-accent-400">{bot.price}</p>
                    </div>
                  </div>
                  
                  {bot.id === 'daily-caption-bot' ? (
                    <Link
                      href="/dashboard/caption-bot"
                      className="w-full mt-4 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <span>Open Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : bot.id === 'weekly-content-ideas-bot' ? (
                    <Link
                      href="/dashboard/weekly-content-ideas"
                      className="w-full mt-4 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <span>Open Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : bot.id === 'hashtag-research-bot' ? (
                    <Link
                      href="/dashboard/hashtag-research"
                      className="w-full mt-4 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <span>Open Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : bot.id === 'blog-outline-bot' ? (
                    <Link
                      href="/dashboard/blog-outline-bot"
                      className="w-full mt-4 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <span>Open Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : bot.id === 'weekly-performance-bot' ? (
                    <Link
                      href="/dashboard/weekly-performance-report"
                      className="w-full mt-4 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <span>Open Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : bot.id === 'competitor-watch-bot' ? (
                    <Link
                      href="/dashboard/competitor-watch"
                      className="w-full mt-4 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <span>Open Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : bot.id === 'engagement-tracker-bot' ? (
                    <Link
                      href="/dashboard/engagement-tracker"
                      className="w-full mt-4 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <span>Open Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button className="w-full mt-4 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium flex items-center justify-center space-x-2">
                      <span>Purchase Bot</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {filteredBots.length === 0 && (
            <div className="text-center py-12">
              <p className="text-mono-600 dark:text-mono-400">
                No bots found matching your search. Try a different category or search term.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-accent-600 dark:bg-accent-700 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Automate Your Content Workflow?
          </h2>
          <p className="text-xl text-white/90 mb-6">
            Start with one bot and see how much time you save. Add more as you need them.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-accent-600 font-semibold rounded-lg hover:bg-mono-100 transition-colors"
          >
            <span>View Pricing Plans</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
