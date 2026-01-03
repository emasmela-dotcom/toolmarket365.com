'use client'

import React, { useState } from 'react'

export default function LinkInBioOptimizer() {
  const [bio, setBio] = useState('')
  const [optimized, setOptimized] = useState<string | null>(null)
  const [tips, setTips] = useState<string[]>([])

  const optimize = () => {
    const b = bio.trim()
    if (!b) {
      alert('Please enter your current bio')
      return
    }

    const newTips: string[] = []

    if (b.length < 50) {
      newTips.push('Use full 150 chars')
    }
    if (!b.includes('http')) {
      newTips.push('Add a CTA link')
    }
    if (!/#\w+/.test(b)) {
      newTips.push('Add 1-2 hashtags')
    }
    if (b.length > 150) {
      newTips.push('Consider shortening to 150 chars')
    }
    if (!b.includes('👉') && !b.includes('➡️') && !b.includes('🔗')) {
      newTips.push('Add an emoji to draw attention to link')
    }

    const suggest =
      b + (newTips.length > 0 && !b.includes('linkinbio') ? ' | ➡️ linkinbio' : '')

    setOptimized(suggest)
    setTips(newTips)
  }

  const copyOptimized = () => {
    if (optimized) {
      navigator.clipboard.writeText(optimized)
      alert('Optimized bio copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Link in Bio Optimizer
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Current bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Enter your current Instagram or TikTok bio..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
              rows={4}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {bio.length} / 150 characters
            </p>
          </div>

          <button
            onClick={optimize}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Optimize
          </button>
        </div>

        {optimized && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Optimized Bio
              </h2>
              <button
                onClick={copyOptimized}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
              >
                Copy
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700 font-sans mb-4">
              {optimized}
            </pre>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {optimized.length} characters
            </p>

            {tips.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Tips:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  {tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {tips.length === 0 && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✅ Your bio is already well-optimized!
                </p>
              </div>
            )}
          </div>
        )}

        {!optimized && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              How it works:
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Enter your current bio and click "Optimize" to get:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Optimized bio with link-in-bio call-to-action</li>
              <li>Tips for improving your bio</li>
              <li>Character count optimization</li>
              <li>Hashtag and link suggestions</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

