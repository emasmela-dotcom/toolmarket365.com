'use client'

import React, { useState } from 'react'

export default function ContentGapAnalyzer() {
  const [yourTopics, setYourTopics] = useState('')
  const [competitorTopics, setCompetitorTopics] = useState('')
  const [gaps, setGaps] = useState<string[]>([])

  const findGaps = () => {
    const yourTopicsList = yourTopics
      .toLowerCase()
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean)
    const competitorTopicsList = competitorTopics
      .toLowerCase()
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean)

    if (yourTopicsList.length === 0 || competitorTopicsList.length === 0) {
      alert('Please enter topics in both fields')
      return
    }

    const yourSet = new Set(yourTopicsList)
    const competitorSet = new Set(competitorTopicsList)

    // Find topics competitor has that you don't
    const gapsList = [...competitorSet].filter((x) => !yourSet.has(x))

    setGaps(gapsList)
  }

  const clearAll = () => {
    setYourTopics('')
    setCompetitorTopics('')
    setGaps([])
  }

  const copyGaps = () => {
    if (gaps.length > 0) {
      navigator.clipboard.writeText(gaps.join('\n'))
      alert('Content gaps copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Content Gap Analyzer
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Your topics (line-by-line)
            </label>
            <textarea
              id="mine"
              value={yourTopics}
              onChange={(e) => setYourTopics(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
              rows={6}
              placeholder="Enter your content topics, one per line&#10;Example:&#10;social media tips&#10;content creation&#10;marketing strategies"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {yourTopics.split('\n').filter((x) => x.trim()).length} topics entered
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Competitor topics (line-by-line)
            </label>
            <textarea
              id="comp"
              value={competitorTopics}
              onChange={(e) => setCompetitorTopics(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
              rows={6}
              placeholder="Enter competitor's content topics, one per line&#10;Example:&#10;social media tips&#10;content creation&#10;email marketing&#10;SEO optimization"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {competitorTopics.split('\n').filter((x) => x.trim()).length} topics entered
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={findGaps}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Find Gaps
            </button>
            <button
              onClick={clearAll}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {gaps.length > 0 && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Content Gaps Found
              </h2>
              <button
                onClick={copyGaps}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
              >
                Copy All
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {gaps.length} topic{gaps.length !== 1 ? 's' : ''} your competitor covers that you
              don't:
            </p>
            <ul className="space-y-2">
              {gaps.map((gap, index) => (
                <li
                  key={index}
                  className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                >
                  <span className="font-medium">{gap}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Tip:</strong> These are content opportunities! Consider creating content on
                these topics to compete more effectively.
              </p>
            </div>
          </div>
        )}

        {gaps.length === 0 && (yourTopics || competitorTopics) && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              No gaps found. You're covering all the topics your competitor covers!
            </p>
          </div>
        )}

        {!yourTopics && !competitorTopics && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              How to Use:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Enter your content topics (one per line) in the first field</li>
              <li>Enter your competitor's content topics (one per line) in the second field</li>
              <li>Click "Find Gaps" to identify topics your competitor covers that you don't</li>
              <li>Use the gaps as content opportunities for your strategy</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}

