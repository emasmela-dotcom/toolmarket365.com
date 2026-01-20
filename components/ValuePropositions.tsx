import { Zap, Shield, TrendingUp, Users, Cloud } from 'lucide-react'

export function ValuePropositions() {
  const features = [
    {
      icon: Zap,
      title: 'Superior Performance',
      description: 'Tools optimized for speed and efficiency. Faster than competitors with better results.',
    },
    {
      icon: Cloud,
      title: 'Cloud Content Library',
      description: 'Store, organize, and manage all your content in one secure cloud library. Never lose your work.',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security and data protection. Your content and analytics are secure.',
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Deep insights competitors don\'t offer. Track performance across all platforms.',
    },
    {
      icon: Users,
      title: 'Creator-Focused',
      description: 'Built specifically for content creators. Features designed for your workflow.',
    },
  ]

  return (
    <section className="py-20 bg-mono-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-mono-950 mb-4">
            Why Choose Micro-SaaS Marketplace
          </h2>
          <p className="text-lg text-mono-600 max-w-2xl mx-auto">
            We don't just match competitors. We exceed them with features creators actually need.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="bg-white border border-mono-200 rounded-lg p-6 hover:border-accent-300 transition-colors">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-accent-600" />
                </div>
                <h3 className="text-lg font-semibold text-mono-950 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-mono-600">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}


