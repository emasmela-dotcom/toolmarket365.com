'use client'

import { VerificationStatus } from '@/components/verification/VerificationStatus'
import { Shield, CheckCircle, Clock } from 'lucide-react'
import { ToolAccessGate } from '@/components/ToolAccessGate'

function VerificationPageContent() {
  const benefits = [
    {
      icon: Shield,
      title: 'Trust & Credibility',
      description: 'Build trust with your audience and potential collaborators'
    },
    {
      icon: CheckCircle,
      title: 'Premium Features',
      description: 'Unlock exclusive tools and features for verified creators'
    },
    {
      icon: Clock,
      title: 'Priority Support',
      description: 'Get faster response times from our support team'
    }
  ]

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">Creator Verification</h1>
        <p className="text-mono-600 dark:text-mono-400 mt-2">
          Get verified to unlock premium features and build trust with your audience
        </p>
      </div>

      <div className="grid gap-8">
        <VerificationStatus />

        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2">Verification Benefits</h2>
          <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">
            Unlock exclusive features and build credibility with verification
          </p>
          <div className="grid gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="flex items-start gap-4 p-4 bg-mono-50 dark:bg-mono-800 rounded-lg">
                  <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{benefit.title}</h3>
                    <p className="text-sm text-mono-600 dark:text-mono-400">{benefit.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2">Verification Requirements</h2>
          <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">
            To get verified, you'll need to meet these criteria
          </p>
          <ul className="space-y-2 text-sm text-mono-600 dark:text-mono-400">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-600 rounded-full"></span>
              Complete profile with profile picture and bio
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-600 rounded-full"></span>
              Active account for at least 30 days
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-600 rounded-full"></span>
              Consistent content creation or platform usage
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-600 rounded-full"></span>
              No policy violations or suspicious activity
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function VerificationPage() {
  const toolDescription = "Get verified as a creator to unlock premium features, build trust with your audience, and access exclusive tools. Verification is automatic for Professional+ plans."
  const howToUse = "1. Click 'Request Verification' if you're on a Starter or Essential plan. 2. Professional+ plans are automatically verified. 3. Once verified, you'll see a blue checkmark badge. 4. Verification helps build credibility and unlocks premium features."

  return (
    <ToolAccessGate
      toolSlug="creator-verification"
      toolName="Creator Verification"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <VerificationPageContent />
    </ToolAccessGate>
  )
}
