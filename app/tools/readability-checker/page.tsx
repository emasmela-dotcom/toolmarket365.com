'use client'

import { useState } from 'react'
import { FileText, CheckCircle, AlertCircle, TrendingUp, BookOpen } from 'lucide-react';
import { ToolAccessGate } from '@/components/ToolAccessGate'

interface ReadabilityMetrics {
  words: number
  sentences: number
  paragraphs: number
  characters: number
  charactersNoSpaces: number
  syllables: number
  avgWordsPerSentence: number
  avgSyllablesPerWord: number
  fleschReadingEase: number
  fleschKincaidGrade: number
  readingTime: number
}

function ReadabilityCheckerContent() {
  const [text, setText] = useState('')
  const [metrics, setMetrics] = useState<ReadabilityMetrics | null>(null)

  const countSyllables = (word: string): number => {
    word = word.toLowerCase()
    if (word.length <= 3) return 1
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    word = word.replace(/^y/, '')
    const matches = word.match(/[aeiouy]{1,2}/g)
    return matches ? matches.length : 1
  }

  const calculateMetrics = () => {
    if (!text.trim()) {
      setMetrics(null)
      return
    }

    const words = text.split(/\s+/).filter(Boolean)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const paragraphs = text.split(/\n\n/).filter(p => p.trim().length > 0)
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length

    let totalSyllables = 0
    words.forEach(word => {
      totalSyllables += countSyllables(word)
    })

    const avgWordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 0
    const avgSyllablesPerWord = words.length > 0 ? totalSyllables / words.length : 0

    // Flesch Reading Ease Score
    const fleschReadingEase = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
    
    // Flesch-Kincaid Grade Level
    const fleschKincaidGrade = (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59

    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(words.length / 200)

    setMetrics({
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      characters,
      charactersNoSpaces,
      syllables: totalSyllables,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
      fleschReadingEase: Math.round(fleschReadingEase * 10) / 10,
      fleschKincaidGrade: Math.round(fleschKincaidGrade * 10) / 10,
      readingTime
    })
  }

  const getReadabilityLevel = (score: number): { level: string; color: string; description: string } => {
    if (score >= 90) {
      return { level: 'Very Easy', color: 'text-green-600', description: '5th grade level' }
    } else if (score >= 80) {
      return { level: 'Easy', color: 'text-green-500', description: '6th grade level' }
    } else if (score >= 70) {
      return { level: 'Fairly Easy', color: 'text-blue-600', description: '7th grade level' }
    } else if (score >= 60) {
      return { level: 'Standard', color: 'text-blue-500', description: '8th-9th grade level' }
    } else if (score >= 50) {
      return { level: 'Fairly Difficult', color: 'text-yellow-600', description: '10th-12th grade level' }
    } else if (score >= 30) {
      return { level: 'Difficult', color: 'text-orange-600', description: 'College level' }
    } else {
      return { level: 'Very Difficult', color: 'text-red-600', description: 'College graduate level' }
    }
  }

  const getGradeLevel = (grade: number): { level: string; color: string } => {
    if (grade <= 6) {
      return { level: 'Elementary', color: 'text-green-600' }
    } else if (grade <= 9) {
      return { level: 'Middle School', color: 'text-blue-600' }
    } else if (grade <= 12) {
      return { level: 'High School', color: 'text-yellow-600' }
    } else if (grade <= 16) {
      return { level: 'College', color: 'text-orange-600' }
    } else {
      return { level: 'Graduate', color: 'text-red-600' }
    }
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-accent-600 rounded-2xl">
              <FileText className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-3">Readability Checker</h1>
          <p className="text-xl text-mono-600 dark:text-mono-400">Analyze text readability and reading level</p>
        </div>

        {/* Documentation Section */}
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-8 border border-mono-200 dark:border-mono-700">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">How to Use This Tool</h2>
          <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">What It Does</h3>
              <p>Analyzes text readability using Flesch Reading Ease and Flesch-Kincaid Grade Level formulas. Provides detailed statistics about word count, sentence structure, reading time, and reading level.</p>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Paste your text:</strong> Copy and paste any text into the text area (articles, blog posts, social media content, etc.)</li>
                <li><strong>Click "Check Readability"</strong> to analyze your text</li>
                <li><strong>Review results:</strong> Readability Score (0-100), Grade Level, Text Statistics, Advanced Metrics</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Readability Score - Flesch Reading Ease (0-100, higher = easier to read)</li>
                <li>Grade Level - Flesch-Kincaid Grade Level (shows approximate school grade level)</li>
                <li>Text Statistics - Word count, sentence count, paragraph count, character count, reading time</li>
                <li>Advanced Metrics - Average words per sentence, average syllables per word, total syllables</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
              <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">Enter Your Text</h2>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here to analyze readability..."
                rows={12}
                className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none resize-y bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              />
              <button
                onClick={calculateMetrics}
                disabled={!text.trim()}
                className="w-full mt-4 px-6 py-4 bg-accent-600 text-white rounded-xl font-bold text-lg hover:bg-accent-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle size={24} />
                Check Readability
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {metrics ? (
              <>
                {/* Readability Score */}
                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">Readability Score</h2>
                  <div className="text-center py-4">
                    <div className="text-5xl font-bold text-accent-600 mb-2">
                      {metrics.fleschReadingEase.toFixed(1)}
                    </div>
                    <p className="text-mono-600 dark:text-mono-400 mb-2">
                      {getReadabilityLevel(metrics.fleschReadingEase).level}
                    </p>
                    <p className="text-sm text-mono-500">
                      {getReadabilityLevel(metrics.fleschReadingEase).description}
                    </p>
                  </div>
                </div>

                {/* Grade Level */}
                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4 flex items-center gap-2">
                    <BookOpen size={20} />
                    Grade Level
                  </h2>
                  <div className="text-center py-4">
                    <div className={`text-4xl font-bold mb-2 ${getGradeLevel(metrics.fleschKincaidGrade).color}`}>
                      {metrics.fleschKincaidGrade.toFixed(1)}
                    </div>
                    <p className="text-mono-600 dark:text-mono-400">
                      {getGradeLevel(metrics.fleschKincaidGrade).level}
                    </p>
                  </div>
                </div>

                {/* Basic Stats */}
                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">Text Statistics</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-mono-100 dark:bg-mono-800 rounded-lg">
                      <span className="text-mono-700 dark:text-mono-300 font-medium">Words</span>
                      <span className="text-xl font-bold text-mono-950 dark:text-mono-50">{metrics.words.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-mono-100 dark:bg-mono-800 rounded-lg">
                      <span className="text-mono-700 dark:text-mono-300 font-medium">Sentences</span>
                      <span className="text-xl font-bold text-mono-950 dark:text-mono-50">{metrics.sentences.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-mono-100 dark:bg-mono-800 rounded-lg">
                      <span className="text-mono-700 dark:text-mono-300 font-medium">Paragraphs</span>
                      <span className="text-xl font-bold text-mono-950 dark:text-mono-50">{metrics.paragraphs.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-mono-100 dark:bg-mono-800 rounded-lg">
                      <span className="text-mono-700 dark:text-mono-300 font-medium">Characters</span>
                      <span className="text-xl font-bold text-mono-950 dark:text-mono-50">{metrics.characters.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-mono-100 dark:bg-mono-800 rounded-lg">
                      <span className="text-mono-700 dark:text-mono-300 font-medium">Reading Time</span>
                      <span className="text-xl font-bold text-mono-950 dark:text-mono-50">{metrics.readingTime} min</span>
                    </div>
                  </div>
                </div>

                {/* Advanced Metrics */}
                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4 flex items-center gap-2">
                    <TrendingUp size={20} />
                    Advanced Metrics
                  </h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-mono-600 dark:text-mono-400">Avg Words/Sentence</span>
                      <span className="font-semibold text-mono-950 dark:text-mono-50">{metrics.avgWordsPerSentence}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mono-600 dark:text-mono-400">Avg Syllables/Word</span>
                      <span className="font-semibold text-mono-950 dark:text-mono-50">{metrics.avgSyllablesPerWord}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mono-600 dark:text-mono-400">Total Syllables</span>
                      <span className="font-semibold text-mono-950 dark:text-mono-50">{metrics.syllables.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-12 text-center h-full flex flex-col justify-center border border-mono-200 dark:border-mono-700">
                <FileText className="mx-auto text-mono-300 dark:text-mono-700 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-mono-700 dark:text-mono-300 mb-3">Ready to Check?</h3>
                <p className="text-mono-500">
                  Paste your text and click "Check Readability" to analyze
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ReadabilityChecker() {
  const toolDescription = "Analyzes text readability using multiple metrics including Flesch Reading Ease, Flesch-Kincaid Grade Level, and more. Provides detailed statistics to help you write content that's easy to read and understand."
  const howToUse = (
    <div>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li><strong>Paste text:</strong> Enter or paste the text you want to analyze</li>
        <li><strong>Click "Check Readability":</strong> Analyze the text for readability metrics</li>
        <li><strong>Review metrics:</strong> See word count, sentence count, reading ease score, and grade level</li>
        <li><strong>Understand scores:</strong> Use the color-coded ratings to see how readable your text is</li>
        <li><strong>Improve:</strong> Use the insights to make your content more accessible</li>
      </ol>
    </div>
  )

  return (
    <ToolAccessGate
      toolSlug="readability-checker"
      toolName="Readability Checker"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <ReadabilityCheckerContent />
    </ToolAccessGate>
  )
}

