'use client'

import React, { useState } from 'react'

export default function StyleGuideCreator() {
  const [brandName, setBrandName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#0a66c2')
  const [secondaryColor, setSecondaryColor] = useState('#16a34a')
  const [voiceTone, setVoiceTone] = useState('Friendly, concise, professional.')
  const [guide, setGuide] = useState<string | null>(null)

  const buildGuide = () => {
    const styleGuide = `# ${brandName || 'Your Brand'} Style Guide

## Logo
![Logo](${logoUrl || 'https://example.com/logo.png'})

## Colours
- Primary: \`${primaryColor}\`
- Secondary: \`${secondaryColor}\`

## Voice & Tone
${voiceTone}
`
    setGuide(styleGuide)
  }

  const copyToClipboard = () => {
    if (guide) {
      navigator.clipboard.writeText(guide)
      alert('Style guide copied to clipboard!')
    }
  }

  const downloadMarkdown = () => {
    if (guide) {
      const blob = new Blob([guide], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${brandName || 'style-guide'}-style-guide.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Style Guide Creator
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Brand name
            </label>
            <input
              id="b"
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter your brand name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Logo URL
            </label>
            <input
              id="l"
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Primary colour
            </label>
            <div className="flex gap-3 items-center">
              <input
                id="c1"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-20 h-12 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
              />
              <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                {primaryColor}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Secondary colour
            </label>
            <div className="flex gap-3 items-center">
              <input
                id="c2"
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-20 h-12 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
              />
              <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                {secondaryColor}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Voice & tone
            </label>
            <textarea
              id="v"
              value={voiceTone}
              onChange={(e) => setVoiceTone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
              rows={4}
              placeholder="Describe your brand's voice and tone..."
            />
          </div>

          <button
            onClick={buildGuide}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Build Guide
          </button>
        </div>

        {guide && (
          <div
            id="out"
            className="mt-6 p-6 border-2 rounded-lg bg-gray-50 dark:bg-gray-800"
            style={{ borderColor: primaryColor }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Generated Style Guide
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={downloadMarkdown}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
                >
                  Download .md
                </button>
              </div>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono bg-white dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
              {guide}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

