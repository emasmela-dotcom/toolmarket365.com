'use client'

import Link from 'next/link'
import { Info, Coins, Zap, ArrowRight, CheckCircle2, X } from 'lucide-react'
import { TOOL_CREDIT_COSTS, getToolCreditCost, requiresCredits, getToolUseExplanation } from '@/lib/tool-credit-costs'

// Tool display names mapping
const toolDisplayNames: Record<string, string> = {
  'competitor-analyzer': 'Competitor Analyzer',
  'viral-content-predictor': 'Viral Content Predictor',
  'rate-calculator': 'Rate Calculator',
  'content-gap-analyzer': 'Content Gap Analyzer',
  'trend-tracker': 'Trend Tracker',
  'advanced-analytics': 'Advanced Analytics',
  'revenue-tracker': 'Revenue Tracker',
  'cross-platform-analytics': 'Cross-Platform Analytics',
  'brand-mention-tracker': 'Brand Mention Tracker',
  'sentiment-analyzer': 'Sentiment Analyzer',
  'follower-growth-tracker': 'Follower Growth Tracker',
  'brand-kit-manager': 'Brand Kit Manager',
}

// Group tools by credit cost
const toolsByCost = Object.entries(TOOL_CREDIT_COSTS).reduce((acc, [slug, cost]) => {
  if (!acc[cost]) {
    acc[cost] = []
  }
  acc[cost].push({
    slug,
    name: toolDisplayNames[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    cost,
    explanation: getToolUseExplanation(slug),
  })
  return acc
}, {} as Record<number, Array<{ slug: string; name: string; cost: number; explanation: string }>>)

export default function CreditsPage() {
  const sortedCosts = Object.keys(toolsByCost).map(Number).sort((a, b) => b - a) // Highest to lowest

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Coins className="h-10 w-10 text-accent-600 dark:text-accent-400" />
            <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50">
              Credit Costs Per Tool
            </h1>
          </div>
          <p className="text-lg text-mono-600 dark:text-mono-400 max-w-2xl mx-auto">
            See exactly how many credits each premium tool costs per use. All plans include 25 free credits/month.
          </p>
        </div>

        {/* How Credits Work */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-blue-900 dark:text-blue-200 mb-3">
                How Credits Work
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-300">
                <div>
                  <p className="font-semibold mb-2">Free Monthly Credits:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• 25 credits/month included with all plans</li>
                    <li>• Resets on the 1st of each month</li>
                    <li>• Does NOT roll over</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Purchased Credits:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• $10 per 100 credits</li>
                    <li>• Purchased credits roll over month to month</li>
                    <li>• Never expire</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tools by Cost */}
        <div className="space-y-8">
          {sortedCosts.map((cost) => (
            <div key={cost} className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-accent-100 dark:bg-accent-900/30 rounded-lg px-4 py-2">
                  <span className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                    {cost}
                  </span>
                  <span className="text-sm text-mono-600 dark:text-mono-400 ml-1">credits</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-mono-950 dark:text-mono-50">
                    {cost === 15 ? 'High-Value Tools' : 
                     cost >= 10 ? 'Medium-High Value Tools' :
                     cost >= 8 ? 'Medium Value Tools' :
                     'Low-Medium Value Tools'}
                  </h3>
                  <p className="text-sm text-mono-600 dark:text-mono-400">
                    {cost === 15 ? 'Most powerful analytics and research tools' :
                     cost >= 10 ? 'Advanced features with high value' :
                     cost >= 8 ? 'Professional tools for serious creators' :
                     'Essential premium features'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {toolsByCost[cost].map((tool) => (
                  <div
                    key={tool.slug}
                    className="bg-mono-50 dark:bg-mono-800 rounded-lg p-4 border border-mono-200 dark:border-mono-700 hover:border-accent-300 dark:hover:border-accent-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-mono-950 dark:text-mono-50">
                        {tool.name}
                      </h4>
                      <span className="bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 font-bold px-2 py-1 rounded text-sm">
                        {tool.cost} credits
                      </span>
                    </div>
                    <p className="text-sm text-mono-600 dark:text-mono-400 mb-2">
                      {tool.explanation}
                    </p>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-sm text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 font-medium inline-flex items-center space-x-1"
                    >
                      <span>View Tool</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Free Tools Section */}
        <div className="mt-8 bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-green-900 dark:text-green-200 mb-2">
                Free Tools (No Credits Required)
              </h2>
              <p className="text-sm text-green-800 dark:text-green-300 mb-3">
                Most tools in CreatorFlow365 are included with your plan and don't require credits. 
                Only premium/advanced tools listed above require credits.
              </p>
              <Link
                href="/tools"
                className="inline-flex items-center space-x-2 text-sm font-semibold text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200"
              >
                <span>View All Tools</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Credit Bundles */}
        <div className="mt-8 bg-accent-50 dark:bg-accent-900/20 border-2 border-accent-300 dark:border-accent-700 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Zap className="h-6 w-6 text-accent-600 dark:text-accent-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-accent-900 dark:text-accent-200 mb-3">
                Buy Credit Bundles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700">
                  <div className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-1">
                    50 Credits
                  </div>
                  <div className="text-lg font-semibold text-accent-600 dark:text-accent-400 mb-2">
                    $5
                  </div>
                  <p className="text-xs text-mono-600 dark:text-mono-400">
                    Perfect for trying premium tools
                  </p>
                </div>
                <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border-2 border-accent-300 dark:border-accent-700">
                  <div className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-1">
                    100 Credits
                  </div>
                  <div className="text-lg font-semibold text-accent-600 dark:text-accent-400 mb-2">
                    $10
                  </div>
                  <p className="text-xs text-mono-600 dark:text-mono-400">
                    Most popular bundle
                  </p>
                </div>
                <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700">
                  <div className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-1">
                    250 Credits
                  </div>
                  <div className="text-lg font-semibold text-accent-600 dark:text-accent-400 mb-2">
                    $22.50
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                    Save 10% ($2.50 off)
                  </p>
                </div>
              </div>
              <Link
                href="/pricing#credit-bundles"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
              >
                <Coins className="h-5 w-5" />
                <span>Buy Credits</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-900 dark:text-yellow-200 mb-4">
            💡 Usage Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800 dark:text-yellow-300">
            <div>
              <p className="font-semibold mb-2">With 25 Free Credits:</p>
              <ul className="space-y-1 ml-4">
                <li>• Viral Predictor: 2 uses (10 credits each)</li>
                <li>• Competitor Analyzer: 1 use (15 credits)</li>
                <li>• Brand Kit Manager: 5 uses (5 credits each)</li>
                <li>• Mix & match any combination!</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">With 100 Purchased Credits:</p>
              <ul className="space-y-1 ml-4">
                <li>• Viral Predictor: 10 uses</li>
                <li>• Competitor Analyzer: 6 uses</li>
                <li>• Trend Tracker: 8 uses</li>
                <li>• Purchased credits roll over month to month</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
