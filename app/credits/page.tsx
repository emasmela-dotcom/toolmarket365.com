'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Info, Coins, Zap, ArrowRight, X, MessageSquare, Loader2 } from 'lucide-react';
import {
  TOOL_CREDIT_COSTS,
  TOOL_CREDIT_DISPLAY_NAMES,
  getToolCreditCost,
  requiresCredits,
  getToolUseExplanation,
} from '@/lib/tool-credit-costs'
import { GUMROAD_LINKS } from '@/lib/gumroad-config'

const useStripe = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

// Group tools by credit cost
const toolsByCost = Object.entries(TOOL_CREDIT_COSTS).reduce((acc, [slug, cost]) => {
  if (!acc[cost]) {
    acc[cost] = []
  }
  acc[cost].push({
    slug,
    name:
      TOOL_CREDIT_DISPLAY_NAMES[slug] ||
      slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    cost,
    explanation: getToolUseExplanation(slug),
  })
  return acc
}, {} as Record<number, Array<{ slug: string; name: string; cost: number; explanation: string }>>)

export default function CreditsPage() {
  const sortedCosts = Object.keys(toolsByCost).map(Number).sort((a, b) => b - a) // Highest to lowest
  const [creditLoading, setCreditLoading] = useState<string | null>(null)

  const handleBuyCredits = async (bundleId: 'bundle50' | 'bundle100' | 'bundle250') => {
    if (useStripe) {
      setCreditLoading(bundleId)
      try {
        const res = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'credits', bundleId }),
        })
        const data = await res.json()
        if (data?.url) {
          window.location.href = data.url
          return
        }
      } catch (e) {
        console.error('Stripe checkout failed:', e)
      }
      setCreditLoading(null)
    }
    window.location.href = GUMROAD_LINKS.credits[bundleId]
  }

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
          <p className="text-lg text-mono-600 dark:text-mono-400 max-w-2xl mx-auto mb-4">
            See exactly how many credits each premium tool costs per use. <strong>Tools in your plan:</strong> Unlimited use, no credits needed. <strong>Tools not in your plan:</strong> Access them using credits—this flexibility lets you try premium tools beyond your plan level.
          </p>
          
          {/* Welcome Credits Banner */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-300 dark:border-green-700 rounded-lg p-4 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="font-bold text-green-900 dark:text-green-200">
                25 Welcome Credits During Your First Month
              </p>
            </div>
            <p className="text-sm text-green-800 dark:text-green-300">
              All plans include 25 free credits during your first month to try premium tools. After that, purchase credits to continue accessing tools beyond your plan level.
            </p>
          </div>
        </div>

        {/* Transparency Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                Transparency Notice
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                ToolMarket365 provides everything we can offer at no extra cost beyond your subscription fee. Some advanced tools, however, need external API integrations (e.g. Instagram API, OpenAI) to run at full capacity—beyond what we provide as standard. Those services charge their own fees, which you pay directly to them; ToolMarket365 never marks up or charges for third-party API usage. We only track usage for analytics purposes. This setup gives you flexibility to choose which external services you want to use, while keeping your ToolMarket365 subscription cost predictable.
              </p>
            </div>
          </div>
        </div>

        {/* How Credits Work */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-blue-900 dark:text-blue-200 mb-3">
                How Credits Work
              </h2>
              <p className="text-sm text-blue-800 dark:text-blue-300 mb-4 font-semibold">
                Credits are only required for tools that are <strong>not</strong> included in your plan. Tools included in your plan remain unlimited — credits are just for optional premium extras.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-300 mb-4">
                <div>
                  <p className="font-semibold mb-2">Welcome Credits (First Month Only):</p>
                  <ul className="space-y-1 ml-4">
                    <li>• 25 credits during your first month</li>
                    <li>• One-time trial to try premium tools</li>
                    <li>• After first month, purchase credits to continue</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Purchased Credits:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• $10 per 100 credits ($0.10 per credit)</li>
                    <li>• Roll over month to month</li>
                    <li>• Never expire - use them anytime</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  Why Credits Instead of One-Time Purchases?
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                  Credits give you <strong>flexibility</strong> to use multiple premium tools without committing to individual tool purchases. Instead of buying each tool separately, credits let you:
                </p>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 ml-4">
                  <li>• Try different premium tools with one purchase</li>
                  <li>• Use credits across multiple tools as needed</li>
                  <li>• Only pay for what you actually use</li>
                  <li>• Build up credits over time (they never expire)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* External API Setup Notice */}
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-700 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-red-900 dark:text-red-200 mb-2">
                ⚠️ Important: External API Setup for Full Functionality
              </h2>
              <p className="text-sm text-red-800 dark:text-red-300 mb-3">
                <strong>Some premium tools work with demo/template data, but require external API integrations for full functionality.</strong> You can use these tools immediately without API setup, but they'll show demo data or have limited features. For real data and full functionality, set up external API keys in the Integrations Hub.
              </p>
              <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-red-200 dark:border-red-800 mb-3">
                <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-2">Tools with limited functionality without API setup:</p>
                <ul className="text-sm text-red-800 dark:text-red-300 space-y-2 ml-4">
                  <li>• <strong>Competitor Analyzer</strong> - Works with demo data; requires social media API for real competitor analysis</li>
                  <li>• <strong>Instagram Scheduler</strong> - Can plan/schedule posts; requires Instagram API for automatic posting</li>
                  <li>• <strong>AI-Enhanced Tools</strong> - Work with templates; optional OpenAI/Anthropic/Google API keys enhance results</li>
                  <li>• <strong>Social Media Analytics</strong> - Show mock data; require platform APIs for real-time analytics</li>
                </ul>
              </div>
              <p className="text-sm text-red-800 dark:text-red-300 mb-3">
                <strong>Don't worry:</strong> You pay the API providers directly (ToolMarket365 never charges for API usage). We only track usage for analytics purposes.
              </p>
              <Link
                href="/integrations"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <span>Set Up Integrations Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* How Tools Work With/Without API Setup */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Zap className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-green-900 dark:text-green-200 mb-3">
                How Tools Work With & Without API Setup
              </h2>
              <p className="text-sm text-green-800 dark:text-green-300 mb-4">
                <strong>Good news:</strong> All ToolMarket365 tools work immediately without API setup! Some tools show demo/template data, while others have full functionality. API integrations enhance tools with real data and advanced features.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">1. Competitor Analyzer</h4>
                  <ul className="text-sm text-green-800 dark:text-green-300 space-y-1 ml-4">
                    <li>• <strong>Without API:</strong> Works with demo data (random numbers for comparison)</li>
                    <li>• <strong>With API:</strong> Shows real competitor metrics and analysis</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">2. Instagram Scheduler</h4>
                  <ul className="text-sm text-green-800 dark:text-green-300 space-y-1 ml-4">
                    <li>• <strong>Without API:</strong> Can plan, schedule, and manage posts in the calendar</li>
                    <li>• <strong>With API:</strong> Posts automatically publish to Instagram at scheduled times</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">3. AI-Enhanced Tools</h4>
                  <ul className="text-sm text-green-800 dark:text-green-300 space-y-1 ml-4">
                    <li>• <strong>Without API:</strong> Work with template-based generation</li>
                    <li className="ml-4">- Blog Outline Generator: Template outlines</li>
                    <li className="ml-4">- AI Caption Generator: Template pools</li>
                    <li className="ml-4">- AI Lead Follow-Up Agent: 100% template-based</li>
                    <li>• <strong>With API:</strong> Enhanced, personalized results</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">4. Social Media Analytics</h4>
                  <ul className="text-sm text-green-800 dark:text-green-300 space-y-1 ml-4">
                    <li>• <strong>Without API:</strong> Show mock/demo data</li>
                    <li>• <strong>With API:</strong> Real-time analytics from platform APIs</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                💡 <strong>Bottom line:</strong> You can use all tools immediately. API setup unlocks real data and advanced features, but isn't required to get started!
              </p>
            </div>
          </div>
        </div>

        {/* Credit Cost Justification */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-purple-900 dark:text-purple-200 mb-4">
            💰 Why These Credit Costs?
          </h2>
          <div className="space-y-4 text-sm text-purple-800 dark:text-purple-300">
            <div>
              <h3 className="font-semibold mb-2">High-Value Tools (15 credits = $1.50/use):</h3>
              <p className="mb-2">
                Tools like <strong>Competitor Analyzer</strong> require complex analysis, external API calls, and heavy data processing. These provide strategic business intelligence worth the investment. <strong className="text-purple-900 dark:text-purple-100">Note: External API setup required for full functionality.</strong>
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Medium-High Tools (10-12 credits = $1.00-$1.20/use):</h3>
              <p className="mb-2">
                Tools like <strong>Viral Content Predictor</strong> and <strong>Rate Calculator</strong> use AI/ML processing and provide high value to creators. These can directly impact your revenue and content performance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Medium Tools (8 credits = $0.80/use):</h3>
              <p className="mb-2">
                Analytics and tracking tools require data processing and API calls. These provide professional insights for serious creators.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Low-Medium Tools (5 credits = $0.50/use):</h3>
              <p className="mb-2">
                Design and organization tools like <strong>Brand Kit Manager</strong> have lower processing needs but still provide value for creators building their brand.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
              <p className="font-semibold mb-2">💡 Cost Factors:</p>
              <ul className="space-y-1 ml-4">
                <li>• <strong>Processing complexity:</strong> More complex = more credits</li>
                <li>• <strong>API costs:</strong> External data sources add cost (you pay API providers directly)</li>
                <li>• <strong>Value to creator:</strong> Business-critical tools cost more</li>
                <li>• <strong>Uniqueness:</strong> Unique features (like Viral Predictor) are premium</li>
                <li>• <strong>External API setup:</strong> Some tools require API integrations for full functionality</li>
              </ul>
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

        {/* Buy Credit Bundles */}
        <div className="mt-8 bg-accent-50 dark:bg-accent-900/20 border-2 border-accent-300 dark:border-accent-700 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Zap className="h-6 w-6 text-accent-600 dark:text-accent-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-accent-900 dark:text-accent-200 mb-3">
                Buy Credit Bundles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700 flex flex-col">
                  <div className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-1">50 Credits</div>
                  <div className="text-lg font-semibold text-accent-600 dark:text-accent-400 mb-2">$5</div>
                  <p className="text-xs text-mono-600 dark:text-mono-400 mb-4 flex-grow">Perfect for trying premium tools</p>
                  {useStripe ? (
                    <button
                      type="button"
                      onClick={() => handleBuyCredits('bundle50')}
                      disabled={!!creditLoading}
                      className="text-accent-600 dark:text-accent-400 hover:underline font-medium text-sm inline-flex items-center gap-2 disabled:opacity-70"
                    >
                      {creditLoading === 'bundle50' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Buy credits
                    </button>
                  ) : (
                    <a
                      href={GUMROAD_LINKS.credits.bundle50}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-600 dark:text-accent-400 hover:underline font-medium text-sm"
                    >
                      Buy credits
                    </a>
                  )}
                </div>
                <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border-2 border-accent-300 dark:border-accent-700 flex flex-col">
                  <div className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-1">100 Credits</div>
                  <div className="text-lg font-semibold text-accent-600 dark:text-accent-400 mb-2">$10</div>
                  <p className="text-xs text-mono-600 dark:text-mono-400 mb-4 flex-grow">Most popular bundle</p>
                  {useStripe ? (
                    <button
                      type="button"
                      onClick={() => handleBuyCredits('bundle100')}
                      disabled={!!creditLoading}
                      className="text-accent-600 dark:text-accent-400 hover:underline font-medium text-sm inline-flex items-center gap-2 disabled:opacity-70"
                    >
                      {creditLoading === 'bundle100' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Buy credits
                    </button>
                  ) : (
                    <a
                      href={GUMROAD_LINKS.credits.bundle100}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-600 dark:text-accent-400 hover:underline font-medium text-sm"
                    >
                      Buy credits
                    </a>
                  )}
                </div>
                <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700 flex flex-col">
                  <div className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-1">250 Credits</div>
                  <div className="text-lg font-semibold text-accent-600 dark:text-accent-400 mb-2">$20</div>
                  <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-4">Save 20% ($5 off)</p>
                  {useStripe ? (
                    <button
                      type="button"
                      onClick={() => handleBuyCredits('bundle250')}
                      disabled={!!creditLoading}
                      className="text-accent-600 dark:text-accent-400 hover:underline font-medium text-sm inline-flex items-center gap-2 disabled:opacity-70"
                    >
                      {creditLoading === 'bundle250' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Buy credits
                    </button>
                  ) : (
                    <a
                      href={GUMROAD_LINKS.credits.bundle250}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-600 dark:text-accent-400 hover:underline font-medium text-sm"
                    >
                      Buy credits
                    </a>
                  )}
                </div>
              </div>
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
              <p className="font-semibold mb-2">With 25 Welcome Credits (First Month Only):</p>
              <ul className="space-y-1 ml-4">
                <li>• Viral Predictor: 2 uses (10 credits each)</li>
                <li>• Competitor Analyzer: 1 use (15 credits)</li>
                <li>• Brand Kit Manager: 5 uses (5 credits each)</li>
                <li>• Mix & match any combination!</li>
                <li>• <strong>After first month:</strong> Purchase credits to continue</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">With 100 Purchased Credits:</p>
              <ul className="space-y-1 ml-4">
                <li>• Viral Predictor: 10 uses</li>
                <li>• Competitor Analyzer: 6 uses</li>
                <li>• Trend Tracker: 8 uses</li>
                <li>• Purchased credits roll over month to month</li>
                <li>• <strong>Never expire</strong> - use them anytime</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mt-8 bg-accent-50 dark:bg-accent-900/20 border-2 border-accent-300 dark:border-accent-700 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-accent-900 dark:text-accent-200 mb-2">
            💬 Have Feedback or Suggestions?
          </h2>
          <p className="text-sm text-accent-800 dark:text-accent-300 mb-4">
            We want to hear from you! Share your thoughts on credit costs, tool pricing, or any improvements you'd like to see.
          </p>
          <Link
            href="/contact?type=feedback"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Share Your Feedback</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
