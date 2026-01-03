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

