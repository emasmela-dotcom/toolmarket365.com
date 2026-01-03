'use client'

import { useState } from 'react'
import { Search, Hash, TrendingUp } from 'lucide-react'

interface Keyword {
  word: string
  count: number
}

export default function SEOOptimizer() {
  const [text, setText] = useState('')
  const [keywords, setKeywords] = useState<Keyword[]>([])

  const stopWords = new Set([
    'the', 'and', 'to', 'of', 'a', 'in', 'is', 'it', 'you', 'that', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'i', 'at', 'be', 'this', 'have', 'from', 'or', 'one', 'had', 'by', 'word', 'but', 'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said', 'there', 'each', 'which', 'she', 'do', 'how', 'their', 'if', 'will', 'up', 'other', 'about', 'out', 'many', 'then', 'them', 'these', 'so', 'some', 'her', 'would', 'make', 'like', 'into', 'him', 'has', 'two', 'more', 'go', 'no', 'way', 'could', 'my', 'than', 'first', 'been', 'call', 'who', 'oil', 'its', 'now', 'find', 'long', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part'
  ])

  const analyze = () => {
    if (!text.trim()) {
      setKeywords([])
      return
    }

    const lowerText = text.toLowerCase()
    const words = lowerText.match(/\b\w+\b/g) || []
    const freq: Record<string, number> = {}

    words.forEach(word => {
      // Filter out stop words and short words
      if (!stopWords.has(word) && word.length > 3) {
        freq[word] = (freq[word] || 0) + 1
      }
    })

    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }))

    setKeywords(sorted)
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-accent-600 rounded-2xl">
              <Search className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-3">SEO Optimizer</h1>
          <p className="text-xl text-mono-600 dark:text-mono-400">Analyze keywords in your content</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
              <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">Your Content</h2>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your article or content here..."
                rows={12}
                className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none resize-y bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              />
              <button
                onClick={analyze}
                disabled={!text.trim()}
                className="w-full mt-4 px-6 py-4 bg-accent-600 text-white rounded-xl font-bold text-lg hover:bg-accent-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Search size={24} />
                Analyze
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {keywords.length > 0 ? (
              <>
                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4 flex items-center gap-2">
                    <Hash size={20} />
                    Top Keywords
                  </h2>
                  <div className="space-y-3">
                    {keywords.map((kw, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-mono-100 dark:bg-mono-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent-600 text-white flex items-center justify-center font-bold text-sm">
                            {idx + 1}
                          </div>
                          <span className="font-semibold text-mono-950 dark:text-mono-50 text-lg">{kw.word}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp size={18} className="text-accent-600" />
                          <span className="text-mono-700 dark:text-mono-300 font-medium">{kw.count} times</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h3 className="text-lg font-bold text-mono-950 dark:text-mono-50 mb-3">Keyword Insights</h3>
                  <div className="space-y-2 text-sm text-mono-700 dark:text-mono-300">
                    <p>• Top keyword appears <strong>{keywords[0]?.count}</strong> times</p>
                    <p>• Top 5 keywords: <strong>{keywords.slice(0, 5).map(k => k.word).join(', ')}</strong></p>
                    <p>• Total unique keywords analyzed: <strong>{keywords.length}</strong></p>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-12 text-center h-full flex flex-col justify-center border border-mono-200 dark:border-mono-700">
                <Search className="mx-auto text-mono-300 dark:text-mono-700 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-mono-700 dark:text-mono-300 mb-3">Ready to Analyze?</h3>
                <p className="text-mono-500">
                  Paste your content and click "Analyze" to find top keywords
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
