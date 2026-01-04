'use client'

import React, { useState, useEffect } from 'react'

const fonts = [
  'Arial',
  'Georgia',
  'Times',
  'Verdana',
  'Courier',
  'Impact',
  'Inter',
  'Roboto',
  'Poppins',
  'Lato',
  'Open Sans',
  'Montserrat'
]

export default function FontPairingTool() {
  const [headingFont, setHeadingFont] = useState(fonts[0])
  const [bodyFont, setBodyFont] = useState(fonts[1])

  useEffect(() => {
    // Apply fonts on mount and when they change
    applyFonts()
  }, [headingFont, bodyFont])

  const applyFonts = () => {
    // Fonts are applied via inline styles in the JSX
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
              <p>Helps you find the perfect font combinations for headings and body text. Preview different font pairings in real-time to see how they look together before using them in your designs.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Select heading font:</strong> Choose a font from the dropdown for your headings/titles</li>
                <li><strong>Select body font:</strong> Choose a font from the dropdown for your body text</li>
                <li><strong>Preview the pairing:</strong> See how the fonts look together in the preview section</li>
                <li><strong>Try different combinations:</strong> Experiment with different font pairs to find the best match</li>
                <li><strong>Use in your designs:</strong> Apply the font pairings to your content, websites, or graphics</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Real-time preview of font pairings</li>
                <li>Heading and body text examples showing the fonts together</li>
                <li>Wide selection of fonts to choose from</li>
                <li>Easy comparison of different font combinations</li>
                <li>Professional font pairings ready to use</li>
              </ul>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Font Pairing Tool
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Heading Font
            </label>
            <select
              id="h"
              value={headingFont}
              onChange={(e) => setHeadingFont(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {fonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Body Font
            </label>
            <select
              id="b"
              value={bodyFont}
              onChange={(e) => setBodyFont(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {fonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={applyFonts}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Apply
          </button>
        </div>

        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h1
            id="hd"
            className="text-4xl font-bold mb-4 text-gray-900 dark:text-white"
            style={{ fontFamily: headingFont }}
          >
            Almost before we knew it, we had left the ground.
          </h1>
          <p
            id="bd"
            className="text-lg leading-relaxed text-gray-700 dark:text-gray-300"
            style={{ fontFamily: bodyFont }}
          >
            By three methods we may learn wisdom: first, by reflection, which is noblest; second, by imitation, which is easiest; and third by experience, which is the bitterest.
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Tip:</strong> Try different combinations to find the perfect pairing. Headings typically work well with bold, attention-grabbing fonts, while body text benefits from readable, comfortable fonts.
          </p>
        </div>
      </div>
    </div>
  )
}


