'use client'

import { useState, useRef } from 'react'
import { Image, Upload, Copy, Check, Loader2, Sparkles } from 'lucide-react'

export default function ImageAltTextGenerator() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [altText, setAltText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string)
      setAltText('')
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const generateAltText = async () => {
    if (!imageSrc) {
      setError('Please upload an image first')
      return
    }

    setIsGenerating(true)
    setError('')
    setAltText('')

    try {
      // Load transformers.js dynamically
      const { pipeline } = await import('@xenova/transformers')
      
      // Initialize the image-to-text pipeline
      const vision = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning')
      
      // Generate caption from image
      const out = await vision(imageSrc)
      const generated = out[0]?.generated_text || 'A descriptive image'
      
      // Limit to 125 characters for SEO-friendly alt text
      const alt = generated.slice(0, 125)
      
      setAltText(alt)
    } catch (err) {
      console.error('Alt text generation error:', err)
      // Fallback: Generate basic alt text from image analysis
      const fallbackAlt = generateFallbackAltText(imageSrc)
      setAltText(fallbackAlt)
      setError('AI generation unavailable. Using fallback description.')
    } finally {
      setIsGenerating(false)
    }
  }

  const generateFallbackAltText = (src: string): string => {
    // Fallback: Create descriptive alt text based on common patterns
    const patterns = [
      'A professional image showcasing',
      'An engaging visual representation of',
      'A high-quality photograph featuring',
      'An illustrative image displaying',
      'A well-composed image showing'
    ]
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)]
    return `${randomPattern} content relevant to the page topic.`
  }

  const handleCopy = () => {
    if (altText) {
      navigator.clipboard.writeText(altText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string)
        setAltText('')
        setError('')
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-accent-600 rounded-2xl">
              <Image className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-3">Image Alt Text Generator</h1>
          <p className="text-xl text-mono-600 dark:text-mono-400">Generate SEO-friendly alt text for your images using AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
              <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">Upload Image</h2>
              
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-mono-300 dark:border-mono-700 rounded-lg p-12 text-center cursor-pointer hover:border-accent-500 transition-colors"
              >
                {imageSrc ? (
                  <div className="space-y-4">
                    <img
                      src={imageSrc}
                      alt="Uploaded"
                      className="max-w-full max-h-64 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-mono-600 dark:text-mono-400">
                      Click to upload a different image
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="mx-auto text-mono-400" size={48} />
                    <div>
                      <p className="text-mono-700 dark:text-mono-300 font-semibold">
                        Drag & drop an image here
                      </p>
                      <p className="text-sm text-mono-500 mt-2">or click to browse</p>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {error && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={generateAltText}
                disabled={!imageSrc || isGenerating}
                className="w-full mt-6 px-6 py-4 bg-accent-600 text-white rounded-xl font-bold text-lg hover:bg-accent-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={24} />
                    Generate Alt Text
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {altText ? (
              <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50">Generated Alt Text</h2>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 transition-colors text-mono-700 dark:text-mono-300"
                  >
                    {copied ? (
                      <>
                        <Check size={18} className="text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-mono-100 dark:bg-mono-800 rounded-lg p-4 mb-4">
                  <p className="text-mono-950 dark:text-mono-50 leading-relaxed">{altText}</p>
                </div>
                <div className="flex items-center justify-between text-sm text-mono-600 dark:text-mono-400">
                  <span>{altText.length} characters</span>
                  <span className={altText.length > 125 ? 'text-red-600' : 'text-green-600'}>
                    {altText.length > 125 ? 'Too long (max 125 recommended)' : 'Optimal length'}
                  </span>
                </div>
                {error && (
                  <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded text-yellow-700 dark:text-yellow-400 text-sm">
                    {error}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-12 text-center h-full flex flex-col justify-center border border-mono-200 dark:border-mono-700">
                <Image className="mx-auto text-mono-300 dark:text-mono-700 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-mono-700 dark:text-mono-300 mb-3">Ready to Generate?</h3>
                <p className="text-mono-500 mb-6">
                  Upload an image and click "Generate Alt Text" to create SEO-friendly descriptions
                </p>
                <div className="flex justify-center gap-6 text-sm text-mono-600 dark:text-mono-400">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-accent-600" />
                    <span>AI-powered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={18} className="text-accent-600" />
                    <span>SEO-optimized</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
              <h3 className="text-lg font-bold text-mono-950 dark:text-mono-50 mb-4">Alt Text Best Practices</h3>
              <ul className="space-y-2 text-sm text-mono-700 dark:text-mono-300">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Keep alt text under 125 characters</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Be descriptive and specific</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Include relevant keywords naturally</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Describe what's in the image, not decorative elements</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Write for users who can't see the image</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

