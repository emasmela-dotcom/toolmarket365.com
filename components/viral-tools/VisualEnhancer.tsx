'use client'

import { useState } from 'react'
import type { VisualEnhancements } from '@/lib/viral-predictor/types'

interface VisualEnhancerProps {
  onEnhance: (enhancements: VisualEnhancements) => void
  currentAnalysis?: any
}

export function VisualEnhancer({ onEnhance, currentAnalysis }: VisualEnhancerProps) {
  const [enhancements, setEnhancements] = useState<VisualEnhancements>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    warmth: 0,
    vibrance: 0,
    sharpness: 0,
    textColor: '#ffffff',
    textBackground: '#00000080',
    fontSize: 16
  })

  const applySmartEnhancements = () => {
    // Auto-enhance based on analysis
    const smartEnhancements: VisualEnhancements = {
      brightness: (currentAnalysis?.attentionScore || 50) < 70 ? 110 : 100,
      contrast: (currentAnalysis?.colorPsychologyScore || 50) < 70 ? 115 : 100,
      saturation: (currentAnalysis?.visualScore || 50) < 70 ? 120 : 100,
      warmth: (currentAnalysis?.emotionalAnalysis?.sentimentScore || 0) > 0 ? 10 : -5,
      vibrance: 15,
      sharpness: 20,
      textColor: (currentAnalysis?.emotionalAnalysis?.sentimentScore || 0) > 0 ? '#FFD700' : '#FFFFFF',
      textBackground: '#00000080',
      fontSize: 18
    }
    
    setEnhancements(smartEnhancements)
    onEnhance(smartEnhancements)
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Visual Enhancement Tools</h3>
      <div className="space-y-6">
        <button
          onClick={applySmartEnhancements}
          className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md transition-colors"
        >
          ✨ Auto-Enhance Based on Analysis
        </button>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Brightness: {enhancements.brightness}%
            </label>
            <input
              type="range"
              min="50"
              max="150"
              step="5"
              value={enhancements.brightness}
              onChange={(e) => setEnhancements({...enhancements, brightness: parseInt(e.target.value)})}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Contrast: {enhancements.contrast}%
            </label>
            <input
              type="range"
              min="50"
              max="150"
              step="5"
              value={enhancements.contrast}
              onChange={(e) => setEnhancements({...enhancements, contrast: parseInt(e.target.value)})}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Saturation: {enhancements.saturation}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={enhancements.saturation}
              onChange={(e) => setEnhancements({...enhancements, saturation: parseInt(e.target.value)})}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Text Color
              </label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                  style={{ backgroundColor: enhancements.textColor }}
                />
                <input
                  type="color"
                  value={enhancements.textColor}
                  onChange={(e) => setEnhancements({...enhancements, textColor: e.target.value})}
                  className="w-16 h-8 rounded border border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Text Background
              </label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                  style={{ backgroundColor: enhancements.textBackground }}
                />
                <input
                  type="color"
                  value={enhancements.textBackground}
                  onChange={(e) => setEnhancements({...enhancements, textBackground: e.target.value})}
                  className="w-16 h-8 rounded border border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => onEnhance(enhancements)}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Apply Enhancements
        </button>
      </div>
    </div>
  )
}
