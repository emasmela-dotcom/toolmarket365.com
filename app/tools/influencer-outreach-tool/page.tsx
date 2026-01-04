'use client'

import React, { useState } from 'react'

const template = `Hi {handle},

We love your content and would love to collaborate on our upcoming campaign.  
Let us know if you're interested and we'll send details.

Best,
Your Brand Team`

export default function InfluencerOutreachTool() {
  const [handle, setHandle] = useState('')
  const [followers, setFollowers] = useState('')
  const [email, setEmail] = useState('')
  const [customMessage, setCustomMessage] = useState('')

  const generate = () => {
    if (!handle.trim()) {
      alert('Please enter a handle')
      return
    }

    let generatedEmail = template
      .replace('{handle}', handle)
      .replace('{followers}', followers || 'your audience')

    if (customMessage) {
      generatedEmail += `\n\nP.S. ${customMessage}`
    }

    setEmail(generatedEmail)
  }

  const copyEmail = () => {
    if (email) {
      navigator.clipboard.writeText(email)
      alert('Email copied to clipboard!')
    }
  }

  const reset = () => {
    setHandle('')
    setFollowers('')
    setEmail('')
    setCustomMessage('')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Documentation Section */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How to Use This Tool</h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">What It Does</h3>
              <p>Generates professional outreach email templates for contacting influencers. Creates personalized emails based on influencer handle and follower count for collaboration opportunities.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Enter handle:</strong> Type the influencer's handle (e.g., "@creator")</li>
                <li><strong>Enter followers (optional):</strong> Type their follower count</li>
                <li><strong>Add custom message (optional):</strong> Add a personal note that will be included in the email</li>
                <li><strong>Click "Generate Email"</strong> to create the outreach email</li>
                <li><strong>Copy email:</strong> Click "Copy Email" to copy the generated email to clipboard</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Professional outreach email template</li>
                <li>Personalized with influencer handle</li>
                <li>Includes follower count reference (if provided)</li>
                <li>Custom message included (if provided)</li>
                <li>Ready to copy and send</li>
              </ul>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Influencer Outreach Tool
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Handle
            </label>
            <input
              id="h"
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@creator"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Followers (optional)
            </label>
            <input
              id="f"
              type="number"
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
              placeholder="e.g., 50000"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Custom Message (optional)
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a personal note or additional details..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={generate}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Generate Email
            </button>
            {email && (
              <button
                onClick={reset}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {email && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Generated Email
              </h2>
              <button
                onClick={copyEmail}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
              >
                Copy Email
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700 font-sans">
              {email}
            </pre>
          </div>
        )}

        {!email && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              How it works:
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter the influencer's handle and optionally their follower count. Click "Generate
              Email" to create a professional outreach email template. Customize the message and
              copy it to send to influencers.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


