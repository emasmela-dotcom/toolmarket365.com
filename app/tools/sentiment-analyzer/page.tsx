'use client'

import React, { useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface SentimentResult {
  sentiment: 'Positive' | 'Negative' | 'Neutral'
  score: number
  percentage: number
  positiveWords: string[]
  negativeWords: string[]
  totalWords: number
}

const positiveWords = [
  'good',
  'great',
  'love',
  'awesome',
  'amazing',
  'excellent',
  'fantastic',
  'wonderful',
  'perfect',
  'brilliant',
  'outstanding',
  'superb',
  'delighted',
  'pleased',
  'happy',
  'satisfied',
  'impressed',
  'thrilled',
  'best',
  'favorite',
]

const negativeWords = [
  'bad',
  'hate',
  'terrible',
  'awful',
  'sucks',
  'worst',
  'horrible',
  'disappointed',
  'disgusting',
  'poor',
  'unhappy',
  'angry',
  'frustrated',
  'annoyed',
  'dislike',
  'disappointing',
  'fail',
  'broken',
  'useless',
  'waste',
]

const copy = {
  en: {
    toolName: 'Sentiment Analyzer',
    toolDescription:
      "Analyzes the sentiment of text to determine if it's positive, negative, or neutral. Perfect for analyzing comments, reviews, social media posts, and customer feedback to understand emotional tone.",
    howToUse: [
      { label: 'Enter text:', text: 'Paste or type the text you want to analyze' },
      { label: 'Click "Analyze":', text: 'Get sentiment analysis results' },
      { label: 'Review results:', text: 'See sentiment classification (Positive/Negative/Neutral), score, percentage, and word lists' },
      { label: 'Understand insights:', text: 'Use the positive and negative word lists to understand what drives the sentiment' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Analyzes text to determine sentiment (Positive, Negative, or Neutral). Identifies positive and negative words, calculates a sentiment score, and shows which words contributed to the overall sentiment.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Paste text to analyze:', text: 'Enter comments, reviews, social media posts, or any text' },
      { label: 'Click "Analyze"', text: 'to process the text' },
      { label: 'Review results:', text: 'See overall sentiment (Positive/Negative/Neutral), sentiment score, percentage of words contributing to sentiment, and lists of positive/negative words found' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Overall sentiment classification (Positive, Negative, or Neutral)',
      'Sentiment score (positive words +1, negative words -1)',
      'Percentage of words contributing to sentiment',
      'List of positive words found in the text',
      'List of negative words found in the text',
      'Total word count analyzed',
    ],
    title: 'Sentiment Analyzer',
    textToAnalyze: 'Text to Analyze',
    textPlaceholder: 'Paste comments, reviews, or any text to analyze sentiment...',
    wordsCount: (count: number) => `${count} words`,
    analyze: 'Analyze',
    enterTextAlert: 'Please enter some text to analyze',
    resultsTitle: 'Sentiment Analysis Results',
    score: 'Score',
    percentContribute: (pct: number, sentiment: string) =>
      `${Math.abs(pct)}% of words contribute to ${sentiment} sentiment`,
    positiveWordsFound: (count: number) => `Positive Words Found (${count})`,
    negativeWordsFound: (count: number) => `Negative Words Found (${count})`,
    analysisSummary: (totalWords: number) =>
      `Analyzed ${totalWords} words. Score calculated by counting positive words (+1) and negative words (-1). Higher scores indicate more positive sentiment.`,
    analysisLabel: 'Analysis:',
    howItWorks: 'How it works:',
    howItWorksIntro: 'Paste any text (comments, reviews, social media posts, etc.) and the analyzer will:',
    howItWorksItems: [
      'Identify positive and negative words',
      'Calculate a sentiment score',
      'Determine overall sentiment (Positive, Negative, or Neutral)',
      'Show which words contributed to the sentiment',
    ],
    sentimentLabels: {
      Positive: 'Positive',
      Negative: 'Negative',
      Neutral: 'Neutral',
    },
  },
  es: {
    toolName: 'Analizador de sentimiento',
    toolDescription:
      'Analiza el sentimiento del texto para determinar si es positivo, negativo o neutral. Ideal para analizar comentarios, reseñas, publicaciones en redes sociales y feedback de clientes para entender el tono emocional.',
    howToUse: [
      { label: 'Ingresa texto:', text: 'Pega o escribe el texto que quieres analizar' },
      { label: 'Haz clic en "Analizar":', text: 'Obtén resultados del análisis de sentimiento' },
      { label: 'Revisa resultados:', text: 'Ve clasificación (Positivo/Negativo/Neutral), puntuación, porcentaje y listas de palabras' },
      { label: 'Entiende insights:', text: 'Usa las listas de palabras positivas y negativas para entender qué impulsa el sentimiento' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Analiza texto para determinar el sentimiento (Positivo, Negativo o Neutral). Identifica palabras positivas y negativas, calcula una puntuación de sentimiento y muestra qué palabras contribuyeron al sentimiento general.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Pega texto para analizar:', text: 'Ingresa comentarios, reseñas, publicaciones en redes sociales o cualquier texto' },
      { label: 'Haz clic en "Analizar"', text: 'para procesar el texto' },
      { label: 'Revisa resultados:', text: 'Ve sentimiento general (Positivo/Negativo/Neutral), puntuación, porcentaje de palabras que contribuyen y listas de palabras positivas/negativas encontradas' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Clasificación general de sentimiento (Positivo, Negativo o Neutral)',
      'Puntuación de sentimiento (palabras positivas +1, negativas -1)',
      'Porcentaje de palabras que contribuyen al sentimiento',
      'Lista de palabras positivas encontradas en el texto',
      'Lista de palabras negativas encontradas en el texto',
      'Conteo total de palabras analizadas',
    ],
    title: 'Analizador de sentimiento',
    textToAnalyze: 'Texto a analizar',
    textPlaceholder: 'Pega comentarios, reseñas o cualquier texto para analizar el sentimiento...',
    wordsCount: (count: number) => `${count} palabras`,
    analyze: 'Analizar',
    enterTextAlert: 'Por favor ingresa texto para analizar',
    resultsTitle: 'Resultados del análisis de sentimiento',
    score: 'Puntuación',
    percentContribute: (pct: number, sentiment: string) =>
      `${Math.abs(pct)}% de las palabras contribuyen al sentimiento ${sentiment}`,
    positiveWordsFound: (count: number) => `Palabras positivas encontradas (${count})`,
    negativeWordsFound: (count: number) => `Palabras negativas encontradas (${count})`,
    analysisSummary: (totalWords: number) =>
      `Se analizaron ${totalWords} palabras. La puntuación se calcula contando palabras positivas (+1) y negativas (-1). Puntuaciones más altas indican sentimiento más positivo.`,
    analysisLabel: 'Análisis:',
    howItWorks: 'Cómo funciona:',
    howItWorksIntro: 'Pega cualquier texto (comentarios, reseñas, publicaciones en redes sociales, etc.) y el analizador:',
    howItWorksItems: [
      'Identificará palabras positivas y negativas',
      'Calculará una puntuación de sentimiento',
      'Determinará el sentimiento general (Positivo, Negativo o Neutral)',
      'Mostrará qué palabras contribuyeron al sentimiento',
    ],
    sentimentLabels: {
      Positive: 'Positivo',
      Negative: 'Negativo',
      Neutral: 'Neutral',
    },
  },
}

function SentimentAnalyzerContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [text, setText] = useState('')
  const [result, setResult] = useState<SentimentResult | null>(null)

  const analyze = () => {
    const txt = text.trim()
    if (!txt) {
      alert(c.enterTextAlert)
      return
    }

    const words = txt
      .toLowerCase()
      .split(/\s+/)
      .map((w) => w.replace(/[^\w]/g, ''))
      .filter((w) => w.length > 0)

    let score = 0
    const foundPositive: string[] = []
    const foundNegative: string[] = []

    words.forEach((w) => {
      if (positiveWords.includes(w)) {
        score++
        if (!foundPositive.includes(w)) foundPositive.push(w)
      }
      if (negativeWords.includes(w)) {
        score--
        if (!foundNegative.includes(w)) foundNegative.push(w)
      }
    })

    const percentage = ((score / words.length) * 100).toFixed(1)
    const sentiment: 'Positive' | 'Negative' | 'Neutral' =
      score > 0 ? 'Positive' : score < 0 ? 'Negative' : 'Neutral'

    setResult({
      sentiment,
      score,
      percentage: parseFloat(percentage),
      positiveWords: foundPositive,
      negativeWords: foundNegative,
      totalWords: words.length,
    })
  }

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'Positive') return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
    if (sentiment === 'Negative') return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
    return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
  }

  const getScoreColor = (score: number) => {
    if (score > 0) return 'text-green-600'
    if (score < 0) return 'text-red-600'
    return 'text-gray-600 dark:text-gray-400'
  }

  const wordCount = text.split(/\s+/).filter((w) => w.trim()).length

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{c.howToUseTitle}</h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.whatItDoes}</h3>
              <p>{c.whatItDoesBody}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.howToUseInner}</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                {c.howToUseSteps.map((step, i) => (
                  <li key={i}><strong>{step.label}</strong> {step.text}</li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.expectedOutcome}</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {c.expectedOutcomes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          {c.title}
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.textToAnalyze}
            </label>
            <textarea
              id="t"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={c.textPlaceholder}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
              rows={6}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {c.wordsCount(wordCount)}
            </p>
          </div>

          <button
            onClick={analyze}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {c.analyze}
          </button>
        </div>

        {result && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {c.resultsTitle}
              </h2>
              <div className="flex items-center gap-4">
                <div
                  className={`px-6 py-3 rounded-lg font-bold text-lg ${getSentimentColor(
                    result.sentiment
                  )}`}
                >
                  {c.sentimentLabels[result.sentiment]}
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                  {c.score}: {result.score > 0 ? '+' : ''}
                  {result.score}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {c.percentContribute(result.percentage, c.sentimentLabels[result.sentiment].toLowerCase())}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {result.positiveWords.length > 0 && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    {c.positiveWordsFound(result.positiveWords.length)}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.positiveWords.map((word, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded text-sm"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.negativeWords.length > 0 && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    {c.negativeWordsFound(result.negativeWords.length)}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.negativeWords.map((word, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded text-sm"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>{c.analysisLabel}</strong> {c.analysisSummary(result.totalWords)}
              </p>
            </div>
          </div>
        )}

        {!result && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              {c.howItWorks}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {c.howItWorksIntro}
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {c.howItWorksItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SentimentAnalyzer() {
  const { language } = useLanguage()
  const c = copy[language]

  const howToUse = (
    <div>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        {c.howToUse.map((step, i) => (
          <li key={i}><strong>{step.label}</strong> {step.text}</li>
        ))}
      </ol>
    </div>
  )

  return (
    <ToolAccessGate
      toolSlug="sentiment-analyzer"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <SentimentAnalyzerContent />
    </ToolAccessGate>
  )
}
