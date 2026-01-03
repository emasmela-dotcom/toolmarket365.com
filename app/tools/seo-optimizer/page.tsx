'use client'

import { useState } from 'react'
import { Search, CheckCircle, XCircle, AlertCircle, TrendingUp, FileText, Link, Hash, Eye, Target, Zap } from 'lucide-react'

interface AnalysisResult {
  length?: number
  wordCount?: number
  paragraphs?: number
  headings?: number
  count?: number
  density?: Array<{ keyword: string; count: number; density: number }>
  avgSentenceLength?: string
  score: number
  issues: string[]
  suggestions: string[]
  passed: boolean
}

interface Results {
  title: AnalysisResult
  description: AnalysisResult
  content: AnalysisResult
  url: AnalysisResult
  keywords: AnalysisResult
  readability: AnalysisResult
  overallScore: number
}

export default function SEOOptimizer() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [url, setUrl] = useState('')
  const [keywords, setKeywords] = useState('')
  const [results, setResults] = useState<Results | null>(null)

  const analyzeTitle = (text: string): AnalysisResult => {
    const length = text.length
    const wordCount = text.split(' ').filter(w => w).length
    const issues: string[] = []
    const suggestions: string[] = []
    let score = 0

    if (length === 0) {
      issues.push('Title is missing')
      suggestions.push('Add a descriptive title (50-60 characters)')
    } else if (length < 30) {
      issues.push('Title is too short')
      suggestions.push('Expand your title to 50-60 characters for better SEO')
      score = 40
    } else if (length > 70) {
      issues.push('Title is too long and may be truncated')
      suggestions.push('Shorten your title to 50-60 characters')
      score = 60
    } else if (length >= 50 && length <= 60) {
      score = 100
      suggestions.push('Perfect title length!')
    } else {
      score = 80
      suggestions.push('Good title length')
    }

    if (text && !/[0-9]/.test(text) && wordCount > 3) {
      suggestions.push('Consider adding numbers for higher click-through rates')
    }

    return { length, score, issues, suggestions, passed: score >= 60 }
  }

  const analyzeDescription = (text: string): AnalysisResult => {
    const length = text.length
    const issues: string[] = []
    const suggestions: string[] = []
    let score = 0

    if (length === 0) {
      issues.push('Meta description is missing')
      suggestions.push('Add a compelling description (150-160 characters)')
    } else if (length < 120) {
      issues.push('Description is too short')
      suggestions.push('Expand to 150-160 characters for optimal display')
      score = 40
    } else if (length > 165) {
      issues.push('Description is too long and may be truncated')
      suggestions.push('Shorten to 150-160 characters')
      score = 60
    } else if (length >= 150 && length <= 160) {
      score = 100
      suggestions.push('Perfect description length!')
    } else {
      score = 80
      suggestions.push('Good description length')
    }

    if (text && !text.includes('?') && !text.includes('!')) {
      suggestions.push('Add a question or call-to-action for better engagement')
    }

    return { length, score, issues, suggestions, passed: score >= 60 }
  }

  const analyzeContentBody = (text: string): AnalysisResult => {
    const wordCount = text.split(/\s+/).filter(w => w).length
    const paragraphs = text.split('\n\n').filter(p => p.trim()).length
    const headings = (text.match(/^#{1,6}\s/gm) || []).length
    const issues: string[] = []
    const suggestions: string[] = []
    let score = 0

    if (wordCount === 0) {
      issues.push('No content detected')
      suggestions.push('Add at least 300 words of quality content')
    } else if (wordCount < 300) {
      issues.push('Content is too short for good SEO')
      suggestions.push('Aim for at least 300-500 words')
      score = 30
    } else if (wordCount < 500) {
      score = 60
      suggestions.push('Add more content for better SEO (aim for 1000+ words)')
    } else if (wordCount < 1000) {
      score = 80
      suggestions.push('Good content length, consider expanding to 1000+ words')
    } else {
      score = 100
      suggestions.push('Excellent content length!')
    }

    if (headings === 0 && wordCount > 200) {
      issues.push('No headings detected')
      suggestions.push('Add headings (H2, H3) to structure your content')
    }

    if (paragraphs < 3 && wordCount > 200) {
      suggestions.push('Break content into more paragraphs for better readability')
    }

    return { wordCount, paragraphs, headings, score, issues, suggestions, passed: score >= 60 }
  }

  const analyzeURL = (text: string): AnalysisResult => {
    const issues: string[] = []
    const suggestions: string[] = []
    let score = 100

    if (!text) {
      issues.push('URL slug not provided')
      suggestions.push('Add a URL slug for analysis')
      return { score: 50, issues, suggestions, passed: false }
    }

    const length = text.length
    if (length > 75) {
      issues.push('URL is too long')
      suggestions.push('Keep URLs under 75 characters')
      score -= 20
    }

    if (/[A-Z]/.test(text)) {
      issues.push('URL contains uppercase letters')
      suggestions.push('Use only lowercase letters in URLs')
      score -= 15
    }

    if (/_/.test(text)) {
      issues.push('URL contains underscores')
      suggestions.push('Use hyphens (-) instead of underscores (_)')
      score -= 10
    }

    if (!/[a-z]/.test(text)) {
      issues.push('URL should contain keywords')
      suggestions.push('Include target keywords in your URL')
      score -= 20
    }

    if (score === 100) {
      suggestions.push('URL structure looks great!')
    }

    return { length, score, issues, suggestions, passed: score >= 60 }
  }

  const analyzeKeywords = (kw: string, t: string, d: string, c: string): AnalysisResult => {
    const keywordList = kw.toLowerCase().split(',').map(k => k.trim()).filter(k => k)
    const allText = (t + ' ' + d + ' ' + c).toLowerCase()
    const issues: string[] = []
    const suggestions: string[] = []
    let score = 0

    if (keywordList.length === 0) {
      issues.push('No keywords provided')
      suggestions.push('Add 3-5 target keywords')
      return { count: 0, score: 0, issues, suggestions, passed: false }
    }

    const keywordDensity: Array<{ keyword: string; count: number; density: number }> = []
    keywordList.forEach(keyword => {
      const count = (allText.match(new RegExp(keyword, 'gi')) || []).length
      const totalWords = allText.split(/\s+/).length
      const density = totalWords > 0 ? parseFloat(((count / totalWords) * 100).toFixed(2)) : 0
      keywordDensity.push({ keyword, count, density })
    })

    const avgDensity = keywordDensity.reduce((a, b) => a + b.density, 0) / keywordDensity.length

    if (keywordList.length < 3) {
      suggestions.push('Add more target keywords (aim for 3-5)')
      score = 50
    } else if (keywordList.length > 7) {
      issues.push('Too many keywords may dilute focus')
      suggestions.push('Focus on 3-5 primary keywords')
      score = 70
    } else {
      score = 90
    }

    if (avgDensity < 0.5) {
      issues.push('Keywords are underused in content')
      suggestions.push('Naturally incorporate keywords more (aim for 1-2% density)')
      score = Math.min(score, 60)
    } else if (avgDensity > 3) {
      issues.push('Keyword density is too high (keyword stuffing)')
      suggestions.push('Reduce keyword usage to avoid penalties')
      score = Math.min(score, 50)
    } else {
      suggestions.push('Good keyword density')
    }

    return { count: keywordList.length, density: keywordDensity, score, issues, suggestions, passed: score >= 60 }
  }

  const analyzeReadability = (text: string): AnalysisResult => {
    if (!text) return { score: 0, issues: ['No content to analyze'], suggestions: ['Add content'], passed: false }

    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length
    const words = text.split(/\s+/).filter(w => w).length
    const avgSentenceLength = words / (sentences || 1)
    const issues: string[] = []
    const suggestions: string[] = []
    let score = 100

    if (avgSentenceLength > 25) {
      issues.push('Sentences are too long')
      suggestions.push('Break long sentences into shorter ones (aim for 15-20 words)')
      score -= 20
    } else if (avgSentenceLength < 10) {
      suggestions.push('Consider varying sentence length for better flow')
      score -= 10
    }

    const longWords = text.split(/\s+/).filter(w => w.length > 12).length
    const longWordPercentage = (longWords / words) * 100

    if (longWordPercentage > 15) {
      issues.push('Too many complex words')
      suggestions.push('Use simpler language for better readability')
      score -= 15
    }

    if (score >= 85) {
      suggestions.push('Content is easy to read!')
    }

    return { avgSentenceLength: avgSentenceLength.toFixed(1), score, issues, suggestions, passed: score >= 60 }
  }

  const analyzeContent = () => {
    if (!title && !description && !content) return

    const analysis: Results = {
      title: analyzeTitle(title),
      description: analyzeDescription(description),
      content: analyzeContentBody(content),
      url: analyzeURL(url),
      keywords: analyzeKeywords(keywords, title, description, content),
      readability: analyzeReadability(content),
      overallScore: 0
    }

    const scores = [
      analysis.title.score,
      analysis.description.score,
      analysis.content.score,
      analysis.url.score,
      analysis.keywords.score,
      analysis.readability.score
    ]
    analysis.overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)

    setResults(analysis)
  }

  const ScoreCard = ({ title: cardTitle, icon: Icon, score, passed }: { title: string; icon: typeof FileText; score: number; passed: boolean }) => (
    <div className={`p-4 rounded-lg border-2 ${passed ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-red-300 bg-red-50 dark:bg-red-900/20'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={20} className={passed ? 'text-green-600' : 'text-red-600'} />
          <span className="font-semibold text-mono-950 dark:text-mono-50">{cardTitle}</span>
        </div>
        {passed ? (
          <CheckCircle className="text-green-600" size={20} />
        ) : (
          <XCircle className="text-red-600" size={20} />
        )}
      </div>
      <div className="text-2xl font-bold text-mono-950 dark:text-mono-50">{score}/100</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-accent-600 rounded-2xl">
              <Search className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-3">SEO Optimizer</h1>
          <p className="text-xl text-mono-600 dark:text-mono-400">Optimize your content for search engines</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
              <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">Your Content</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your page title..."
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                  <p className="text-xs text-mono-500 mt-1">{title.length} characters</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter your meta description..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none resize-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                  <p className="text-xs text-mono-500 mt-1">{description.length} characters</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="your-page-url-slug"
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    Target Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="seo, content marketing, digital strategy"
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    Content Body
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter your content here..."
                    rows={10}
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none resize-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                  <p className="text-xs text-mono-500 mt-1">
                    {content.split(/\s+/).filter(w => w).length} words
                  </p>
                </div>

                <button
                  onClick={analyzeContent}
                  disabled={!title && !description && !content}
                  className="w-full px-6 py-4 bg-accent-600 text-white rounded-xl font-bold text-lg hover:bg-accent-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Zap size={24} />
                  Analyze SEO
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {results ? (
              <>
                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">SEO Score</h2>
                  <div className="text-center py-6">
                    <div className={`inline-block px-6 py-3 rounded-full mb-4 ${
                      results.overallScore >= 80 ? 'bg-green-100 dark:bg-green-900/30' :
                      results.overallScore >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      <span className={`text-lg font-bold ${
                        results.overallScore >= 80 ? 'text-green-700 dark:text-green-400' :
                        results.overallScore >= 60 ? 'text-yellow-700 dark:text-yellow-400' : 'text-red-700 dark:text-red-400'
                      }`}>
                        {results.overallScore >= 80 ? 'Great!' :
                         results.overallScore >= 60 ? 'Good' : 'Needs Work'}
                      </span>
                    </div>
                    <div className="text-6xl font-bold text-mono-950 dark:text-mono-50 mb-2">{results.overallScore}/100</div>
                    <p className="text-mono-600 dark:text-mono-400">Overall SEO Score</p>
                  </div>
                </div>

                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">Detailed Analysis</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <ScoreCard title="Title" icon={FileText} score={results.title.score} passed={results.title.passed} />
                    <ScoreCard title="Description" icon={Eye} score={results.description.score} passed={results.description.passed} />
                    <ScoreCard title="Content" icon={Target} score={results.content.score} passed={results.content.passed} />
                    <ScoreCard title="URL" icon={Link} score={results.url.score} passed={results.url.passed} />
                    <ScoreCard title="Keywords" icon={Hash} score={results.keywords.score} passed={results.keywords.passed} />
                    <ScoreCard title="Readability" icon={TrendingUp} score={results.readability.score} passed={results.readability.passed} />
                  </div>
                </div>

                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">Recommendations</h2>
                  <div className="space-y-4">
                    {(results.title.issues.length > 0 || results.title.suggestions.length > 0) && (
                      <div className="border-l-4 border-accent-500 pl-4">
                        <h3 className="font-bold text-mono-950 dark:text-mono-50 mb-2 flex items-center gap-2">
                          <FileText size={16} />
                          Title
                        </h3>
                        {results.title.issues.map((issue, i) => (
                          <p key={i} className="text-sm text-red-600 dark:text-red-400 mb-1 flex items-start gap-2">
                            <XCircle size={14} className="mt-0.5 flex-shrink-0" />
                            {issue}
                          </p>
                        ))}
                        {results.title.suggestions.map((suggestion, i) => (
                          <p key={i} className="text-sm text-mono-600 dark:text-mono-400 mb-1 flex items-start gap-2">
                            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </p>
                        ))}
                      </div>
                    )}

                    {(results.description.issues.length > 0 || results.description.suggestions.length > 0) && (
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h3 className="font-bold text-mono-950 dark:text-mono-50 mb-2 flex items-center gap-2">
                          <Eye size={16} />
                          Meta Description
                        </h3>
                        {results.description.issues.map((issue, i) => (
                          <p key={i} className="text-sm text-red-600 dark:text-red-400 mb-1 flex items-start gap-2">
                            <XCircle size={14} className="mt-0.5 flex-shrink-0" />
                            {issue}
                          </p>
                        ))}
                        {results.description.suggestions.map((suggestion, i) => (
                          <p key={i} className="text-sm text-mono-600 dark:text-mono-400 mb-1 flex items-start gap-2">
                            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </p>
                        ))}
                      </div>
                    )}

                    {(results.content.issues.length > 0 || results.content.suggestions.length > 0) && (
                      <div className="border-l-4 border-green-500 pl-4">
                        <h3 className="font-bold text-mono-950 dark:text-mono-50 mb-2 flex items-center gap-2">
                          <Target size={16} />
                          Content ({results.content.wordCount} words)
                        </h3>
                        {results.content.issues.map((issue, i) => (
                          <p key={i} className="text-sm text-red-600 dark:text-red-400 mb-1 flex items-start gap-2">
                            <XCircle size={14} className="mt-0.5 flex-shrink-0" />
                            {issue}
                          </p>
                        ))}
                        {results.content.suggestions.map((suggestion, i) => (
                          <p key={i} className="text-sm text-mono-600 dark:text-mono-400 mb-1 flex items-start gap-2">
                            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </p>
                        ))}
                      </div>
                    )}

                    {results.keywords.density && results.keywords.density.length > 0 && (
                      <div className="border-l-4 border-orange-500 pl-4">
                        <h3 className="font-bold text-mono-950 dark:text-mono-50 mb-2 flex items-center gap-2">
                          <Hash size={16} />
                          Keyword Density
                        </h3>
                        {results.keywords.density.map((kw, i) => (
                          <div key={i} className="text-sm text-mono-700 dark:text-mono-300 mb-1">
                            <span className="font-semibold">{kw.keyword}:</span> {kw.count} times ({kw.density}%)
                          </div>
                        ))}
                        {results.keywords.suggestions.map((suggestion, i) => (
                          <p key={i} className="text-sm text-mono-600 dark:text-mono-400 mt-2 flex items-start gap-2">
                            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-12 text-center h-full flex flex-col justify-center border border-mono-200 dark:border-mono-700">
                <Search className="mx-auto text-mono-300 dark:text-mono-700 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-mono-700 dark:text-mono-300 mb-3">Ready to Optimize?</h3>
                <p className="text-mono-500 mb-6">
                  Enter your content details and click "Analyze SEO" to get personalized recommendations
                </p>
                <div className="flex justify-center gap-6 text-sm text-mono-600 dark:text-mono-400">
                  <div className="flex items-center gap-2">
                    <Target size={18} className="text-accent-600" />
                    <span>Detailed analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-accent-600" />
                    <span>Actionable tips</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

