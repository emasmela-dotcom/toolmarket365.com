'use client'

import React, { useState, useRef } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'

function ColorPaletteExtractorContent() {
  const [palette, setPalette] = useState<string[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const extractColors = (imageFile: File) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) return
        
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        const freq: Record<string, number> = {}
        
        // Count color frequencies
        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i]
          const g = imageData[i + 1]
          const b = imageData[i + 2]
          const hex = '#' + [r, g, b]
            .map(x => x.toString(16).padStart(2, '0'))
            .join('')
          
          freq[hex] = (freq[hex] || 0) + 1
        }
        
        // Get top 5 most frequent colors
        const top = Object.entries(freq)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([hex]) => hex)
        
        setPalette(top)
      }
      
      img.src = e.target?.result as string
      setImagePreview(e.target?.result as string)
    }
    
    reader.readAsDataURL(imageFile)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    
    extractColors(file)
  }

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color)
    // Visual feedback could be added here
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
              <p>Extracts the dominant colors from any uploaded image. Analyzes the image and identifies the top 5 most frequent colors, perfect for creating color palettes from photos, designs, or inspiration images.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Upload an image:</strong> Click "Choose Image" or drag and drop an image file</li>
                <li><strong>Wait for processing:</strong> The tool analyzes the image pixels</li>
                <li><strong>View extracted colors:</strong> See the top 5 dominant colors displayed as color swatches</li>
                <li><strong>Copy color codes:</strong> Click any color to copy its hex code to clipboard</li>
                <li><strong>Use the palette:</strong> Use the extracted colors in your designs, brand kit, or content</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Top 5 dominant colors from your image</li>
                <li>Visual color swatches for each color</li>
                <li>Hex color codes for each color</li>
                <li>One-click copy functionality for color codes</li>
                <li>Image preview showing the analyzed image</li>
              </ul>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Color Palette Extractor
        </h1>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Upload an image to extract its color palette
          </label>
          <input
            ref={fileInputRef}
            type="file"
            id="img"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700
              cursor-pointer"
          />
        </div>

        {imagePreview && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Preview
            </h2>
            <img
              src={imagePreview}
              alt="Uploaded"
              className="max-w-full h-auto rounded-lg border border-gray-300 dark:border-gray-600"
            />
          </div>
        )}

        {palette.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Extracted Color Palette (Top 5)
            </h2>
            <div className="flex gap-4 flex-wrap">
              {palette.map((color, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center group"
                >
                  <div
                    className="w-20 h-20 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer hover:scale-110 transition-transform shadow-lg"
                    style={{ backgroundColor: color }}
                    onClick={() => copyColor(color)}
                    title={`Click to copy: ${color}`}
                  />
                  <span className="mt-2 text-sm font-mono text-gray-700 dark:text-gray-300">
                    {color}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Click on any color to copy its hex code
            </p>
          </div>
        )}

        {palette.length === 0 && !imagePreview && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Upload an image to extract its dominant colors</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ColorPaletteExtractor() {
  const toolDescription = "Extracts dominant colors from uploaded images. Analyzes image pixels to identify the top 5 most frequent colors and displays them as a color palette with hex codes."
  const howToUse = (
    <div>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li><strong>Upload image:</strong> Click "Choose Image" or drag and drop an image file</li>
        <li><strong>View palette:</strong> See the top 5 dominant colors extracted from your image</li>
        <li><strong>Copy colors:</strong> Click on any color swatch to copy its hex code to clipboard</li>
        <li><strong>Use colors:</strong> Use the extracted colors for your brand kit, design projects, or content creation</li>
      </ol>
    </div>
  )

  return (
    <ToolAccessGate
      toolSlug="color-palette-extractor"
      toolName="Color Palette Extractor"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <ColorPaletteExtractorContent />
    </ToolAccessGate>
  )
}

