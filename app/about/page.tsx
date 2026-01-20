import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Zap, Cloud, TrendingUp, Users, Shield, Target } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              About CreatorFlow<span className="text-accent-600">365</span>
            </h1>
            <p className="text-lg text-mono-600 dark:text-mono-400">
              The Micro-SaaS Marketplace for Content Creators
            </p>
          </div>

          {/* Mission */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">Our Mission</h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              CreatorFlow365 was built to solve a real problem: content creators need powerful tools, but they're scattered across dozens of platforms, each with its own pricing, learning curve, and limitations.
            </p>
            <p className="text-mono-700 dark:text-mono-300">
              We've created a unified platform that brings together 43+ professional tools—from content creation and optimization to analytics and monetization—all in one place, with a secure cloud library to store and organize everything you create.
            </p>
          </section>

          {/* What We Offer */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <Zap className="w-8 h-8 text-accent-600 mb-4" />
                <h3 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">43+ Professional Tools</h3>
                <p className="text-mono-600 dark:text-mono-400">
                  Everything you need to create, optimize, and monetize content. From AI caption generators to viral content predictors, we've got you covered.
                </p>
              </div>

              <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <Cloud className="w-8 h-8 text-accent-600 mb-4" />
                <h3 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">Cloud Content Library</h3>
                <p className="text-mono-600 dark:text-mono-400">
                  Store, organize, and manage all your content in one secure place. Never lose your work again with our cloud-based storage system.
                </p>
              </div>

              <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <TrendingUp className="w-8 h-8 text-accent-600 mb-4" />
                <h3 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">Advanced Analytics</h3>
                <p className="text-mono-600 dark:text-mono-400">
                  Track performance, predict viral potential, and optimize your content strategy with data-driven insights.
                </p>
              </div>

              <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <Shield className="w-8 h-8 text-accent-600 mb-4" />
                <h3 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">Enterprise Security</h3>
                <p className="text-mono-600 dark:text-mono-400">
                  Your content and data are protected with bank-level security. We take your privacy seriously.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">Why Choose CreatorFlow365?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <Target className="w-6 h-6 text-accent-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">All-in-One Platform</h3>
                  <p className="text-mono-600 dark:text-mono-400">
                    No more switching between multiple tools and platforms. Everything you need is here, integrated and working together.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Users className="w-6 h-6 text-accent-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">Built for Creators</h3>
                  <p className="text-mono-600 dark:text-mono-400">
                    Every feature is designed with content creators in mind. We understand your workflow and built tools that actually help.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Zap className="w-6 h-6 text-accent-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">Superior Performance</h3>
                  <p className="text-mono-600 dark:text-mono-400">
                    Our tools are optimized for speed and efficiency. Get better results faster than with competing platforms.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-2">Innovation</h3>
                <p className="text-sm text-mono-600 dark:text-mono-400">
                  We're constantly adding new tools and features based on creator feedback and industry trends.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-2">Transparency</h3>
                <p className="text-sm text-mono-600 dark:text-mono-400">
                  Clear pricing, honest features, and straightforward terms. No hidden fees or surprises.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-2">Support</h3>
                <p className="text-sm text-mono-600 dark:text-mono-400">
                  We're here to help you succeed. Fast support and comprehensive documentation for every tool.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
