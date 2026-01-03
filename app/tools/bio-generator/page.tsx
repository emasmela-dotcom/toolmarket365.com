'use client'

import React, { useState } from 'react'

const templates = [
  '{em} I help {who} {do}',
  '{do} | empowering {who}',
  '{em} {do} for {who}',
  '{em} {do} specialist helping {who}',
  'Building {do} solutions for {who} {em}',
  '{em} {do} expert | Helping {who} succeed',
]

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function BioGenerator() {
  const [whatYouDo, setWhatYouDo] = useState('')
  const [whoYouHelp, setWhoYouHelp] = useState('')
  const [emoji, setEmoji] = useState('')
  const [generatedBio, setGeneratedBio] = useState<string | null>(null)
  const [generatedBios, setGeneratedBios] = useState<string[]>([])

  const generate = () => {
    if (!whatYouDo.trim() || !whoYouHelp.trim()) {
      alert('Please fill in "What you do" and "Who you help" fields')
      return
    }

    const template = rand(templates)
    const bio = template
      .replace('{do}', whatYouDo.trim())
      .replace('{who}', whoYouHelp.trim())
      .replace('{em}', emoji.trim() || '')
      .trim()

    setGeneratedBio(bio)
    setGeneratedBios((prev) => [bio, ...prev].slice(0, 5)) // Keep last 5
  }

  const generateMultiple = () => {
    if (!whatYouDo.trim() || !whoYouHelp.trim()) {
      alert('Please fill in "What you do" and "Who you help" fields')
      return
    }

    const bios: string[] = []
    const usedTemplates = new Set<number>()

    // Generate 3 unique bios
    while (bios.length < 3 && usedTemplates.size < templates.length) {
      const randomIndex = Math.floor(Math.random() * templates.length)
      if (!usedTemplates.has(randomIndex)) {
        usedTemplates.add(randomIndex)
        const template = templates[randomIndex]
        const bio = template
          .replace('{do}', whatYouDo.trim())
          .replace('{who}', whoYouHelp.trim())
          .replace('{em}', emoji.trim() || '')
          .trim()
        bios.push(bio)
      }
    }

    setGeneratedBios(bios)
    setGeneratedBio(bios[0])
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Bio copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Bio Generator
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              What you do
            </label>
            <input
              id="do"
              type="text"
              value={whatYouDo}
              onChange={(e) => setWhatYouDo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="e.g., create content, design websites, write code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Who you help
            </label>
            <input
              id="who"
              type="text"
              value={whoYouHelp}
              onChange={(e) => setWhoYouHelp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="e.g., small businesses, creators, entrepreneurs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Emoji (optional)
            </label>
            <input
              id="em"
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
              maxLength={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="🎯 ✨ 💡"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add 1-2 emojis to make your bio more engaging
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={generate}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Generate
            </button>
            <button
              onClick={generateMultiple}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              Generate 3 Options
            </button>
          </div>
        </div>

        {generatedBio && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Generated Bio
              </h2>
              <button
                onClick={() => copyToClipboard(generatedBio)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm transition-colors"
              >
                Copy
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-lg text-gray-800 dark:text-gray-200 font-medium bg-white dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700">
              {generatedBio}
            </pre>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {generatedBio.length} characters
            </p>
          </div>
        )}

        {generatedBios.length > 1 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              All Generated Options
            </h3>
            <div className="space-y-3">
              {generatedBios.map((bio, index) => (
                <div
                  key={index}
                  className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex justify-between items-center"
                >
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    {bio}
                  </p>
                  <button
                    onClick={() => {
                      setGeneratedBio(bio)
                      copyToClipboard(bio)
                    }}
                    className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                  >
                    Use & Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!generatedBio && (
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-blue-800 dark:text-blue-200">
              <strong>How it works:</strong> Fill in what you do and who you help,
              optionally add an emoji, then click Generate to create a professional
              bio for your social media profiles.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

