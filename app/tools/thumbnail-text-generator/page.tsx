'use client'

import { useState } from 'react'
import { Type, Copy, Check, Download, Image as ImageIcon } from 'lucide-react'

export default function ThumbnailTextGenerator() {
  const [title, setTitle] = useState('')
  const [wordsPerLine, setWordsPerLine] = useState(3)
  const [result, setResult] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [fontSize, setFontSize] = useState(48)
  const [textColor, setTextColor] = useState('#ffffff')
  const [bgColor, setBgColor] = useState('#000000')
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center')

  const generate = () => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setResult([])
      return
    }

    const words = trimmedTitle.split(' ')
    const lines: string[] = []
    
    for (let i = 0; i < words.length; i += wordsPerLine) {
      lines.push(words.slice(i, i + wordsPerLine).join(' '))
    }

    setResult(lines)
  }

  const copyText = () => {
    const text = result.join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyHTML = () => {
    const html = result.map(line => `<div>${line}</div>`).join('\n')
    navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-accent-600 rounded-2xl">
              <Type className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-3">Thumbnail Text Generator</h1>
          <p className="text-xl text-mono-600 dark:text-mono-400">Generate formatted text for video thumbnails</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
              <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">Text Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="How to cook pasta"
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    Words per Line
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={wordsPerLine}
                    onChange={(e) => setWordsPerLine(parseInt(e.target.value) || 3)}
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    Font Size
                  </label>
                  <input
                    type="number"
                    min="24"
                    max="120"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value) || 48)}
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-12 border border-mono-300 dark:border-mono-700 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full h-12 border border-mono-300 dark:border-mono-700 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    Text Alignment
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => setTextAlign(align)}
                        className={`px-4 py-3 rounded-lg font-semibold transition-all capitalize ${
                          textAlign === align
                            ? 'bg-accent-600 text-white shadow-lg'
                            : 'bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 hover:bg-mono-200 dark:hover:bg-mono-700'
                        }`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={generate}
                  disabled={!title.trim()}
                  className="w-full px-6 py-4 bg-accent-600 text-white rounded-xl font-bold text-lg hover:bg-accent-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Type size={24} />
                  Generate
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            {result.length > 0 ? (
              <>
                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50">Preview</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={copyText}
                        className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 text-mono-700 dark:text-mono-300 text-sm"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        Copy Text
                      </button>
                      <button
                        onClick={copyHTML}
                        className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 text-mono-700 dark:text-mono-300 text-sm"
                      >
                        <Copy size={16} />
                        Copy HTML
                      </button>
                    </div>
                  </div>
                  <div
                    className="rounded-lg p-8 min-h-[300px] flex flex-col justify-center"
                    style={{
                      backgroundColor: bgColor,
                      textAlign: textAlign
                    }}
                  >
                    {result.map((line, idx) => (
                      <div
                        key={idx}
                        className="font-bold mb-2"
                        style={{
                          fontSize: `${fontSize}px`,
                          color: textColor,
                          lineHeight: 1.2
                        }}
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h3 className="text-lg font-bold text-mono-950 dark:text-mono-50 mb-4">Plain Text</h3>
                  <pre className="bg-mono-100 dark:bg-mono-800 rounded-lg p-4 text-mono-950 dark:text-mono-50 whitespace-pre-wrap">
                    {result.join('\n')}
                  </pre>
                </div>
              </>
            ) : (
              <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-12 text-center h-full flex flex-col justify-center border border-mono-200 dark:border-mono-700">
                <Type className="mx-auto text-mono-300 dark:text-mono-700 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-mono-700 dark:text-mono-300 mb-3">Ready to Generate?</h3>
                <p className="text-mono-500">
                  Enter a title and click "Generate" to create formatted thumbnail text
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

