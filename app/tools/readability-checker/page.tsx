'use client'

import { useState } from 'react'
import { FileText, CheckCircle, TrendingUp, BookOpen } from 'lucide-react';
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

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

const copy = {
  en: {
    toolName: 'Readability Checker',
    toolDescription:
      "Analyzes text readability using multiple metrics including Flesch Reading Ease, Flesch-Kincaid Grade Level, and more. Provides detailed statistics to help you write content that's easy to read and understand.",
    howToUse: [
      { label: 'Paste text:', text: 'Enter or paste the text you want to analyze' },
      { label: 'Click "Check Readability":', text: 'Analyze the text for readability metrics' },
      { label: 'Review metrics:', text: 'See word count, sentence count, reading ease score, and grade level' },
      { label: 'Understand scores:', text: 'Use the color-coded ratings to see how readable your text is' },
      { label: 'Improve:', text: 'Use the insights to make your content more accessible' },
    ],
    title: 'Readability Checker',
    subtitle: 'Analyze text readability and reading level',
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Analyzes text readability using Flesch Reading Ease and Flesch-Kincaid Grade Level formulas. Provides detailed statistics about word count, sentence structure, reading time, and reading level.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Paste your text:', text: 'Copy and paste any text into the text area (articles, blog posts, social media content, etc.)' },
      { label: 'Click "Check Readability"', text: 'to analyze your text' },
      { label: 'Review results:', text: 'Readability Score (0-100), Grade Level, Text Statistics, Advanced Metrics' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Readability Score - Flesch Reading Ease (0-100, higher = easier to read)',
      'Grade Level - Flesch-Kincaid Grade Level (shows approximate school grade level)',
      'Text Statistics - Word count, sentence count, paragraph count, character count, reading time',
      'Advanced Metrics - Average words per sentence, average syllables per word, total syllables',
    ],
    enterYourText: 'Enter Your Text',
    textPlaceholder: 'Paste your text here to analyze readability...',
    checkReadability: 'Check Readability',
    readabilityScore: 'Readability Score',
    gradeLevel: 'Grade Level',
    textStatistics: 'Text Statistics',
    words: 'Words',
    sentences: 'Sentences',
    paragraphs: 'Paragraphs',
    characters: 'Characters',
    readingTime: 'Reading Time',
    readingTimeMin: (min: number) => `${min} min`,
    advancedMetrics: 'Advanced Metrics',
    avgWordsPerSentence: 'Avg Words/Sentence',
    avgSyllablesPerWord: 'Avg Syllables/Word',
    totalSyllables: 'Total Syllables',
    readyToCheck: 'Ready to Check?',
    readyHint: 'Paste your text and click "Check Readability" to analyze',
    readabilityLevels: {
      veryEasy: { level: 'Very Easy', description: '5th grade level' },
      easy: { level: 'Easy', description: '6th grade level' },
      fairlyEasy: { level: 'Fairly Easy', description: '7th grade level' },
      standard: { level: 'Standard', description: '8th-9th grade level' },
      fairlyDifficult: { level: 'Fairly Difficult', description: '10th-12th grade level' },
      difficult: { level: 'Difficult', description: 'College level' },
      veryDifficult: { level: 'Very Difficult', description: 'College graduate level' },
    },
    gradeLevels: {
      elementary: 'Elementary',
      middleSchool: 'Middle School',
      highSchool: 'High School',
      college: 'College',
      graduate: 'Graduate',
    },
  },
  es: {
    toolName: 'Verificador de legibilidad',
    toolDescription:
      'Analiza la legibilidad del texto con múltiples métricas, incluyendo Flesch Reading Ease y Flesch-Kincaid Grade Level. Proporciona estadísticas detalladas para ayudarte a escribir contenido fácil de leer y entender.',
    howToUse: [
      { label: 'Pega texto:', text: 'Ingresa o pega el texto que quieres analizar' },
      { label: 'Haz clic en "Verificar legibilidad":', text: 'Analiza el texto para obtener métricas de legibilidad' },
      { label: 'Revisa métricas:', text: 'Ve conteo de palabras, oraciones, puntuación de facilidad de lectura y nivel de grado' },
      { label: 'Entiende puntuaciones:', text: 'Usa las calificaciones con colores para ver qué tan legible es tu texto' },
      { label: 'Mejora:', text: 'Usa los insights para hacer tu contenido más accesible' },
    ],
    title: 'Verificador de legibilidad',
    subtitle: 'Analiza la legibilidad del texto y el nivel de lectura',
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Analiza la legibilidad del texto usando las fórmulas Flesch Reading Ease y Flesch-Kincaid Grade Level. Proporciona estadísticas detalladas sobre conteo de palabras, estructura de oraciones, tiempo de lectura y nivel de lectura.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Pega tu texto:', text: 'Copia y pega cualquier texto en el área de texto (artículos, posts de blog, contenido de redes sociales, etc.)' },
      { label: 'Haz clic en "Verificar legibilidad"', text: 'para analizar tu texto' },
      { label: 'Revisa resultados:', text: 'Puntuación de legibilidad (0-100), Nivel de grado, Estadísticas de texto, Métricas avanzadas' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Puntuación de legibilidad - Flesch Reading Ease (0-100, mayor = más fácil de leer)',
      'Nivel de grado - Flesch-Kincaid Grade Level (muestra el nivel escolar aproximado)',
      'Estadísticas de texto - Conteo de palabras, oraciones, párrafos, caracteres, tiempo de lectura',
      'Métricas avanzadas - Promedio de palabras por oración, sílabas por palabra, total de sílabas',
    ],
    enterYourText: 'Ingresa tu texto',
    textPlaceholder: 'Pega tu texto aquí para analizar la legibilidad...',
    checkReadability: 'Verificar legibilidad',
    readabilityScore: 'Puntuación de legibilidad',
    gradeLevel: 'Nivel de grado',
    textStatistics: 'Estadísticas de texto',
    words: 'Palabras',
    sentences: 'Oraciones',
    paragraphs: 'Párrafos',
    characters: 'Caracteres',
    readingTime: 'Tiempo de lectura',
    readingTimeMin: (min: number) => `${min} min`,
    advancedMetrics: 'Métricas avanzadas',
    avgWordsPerSentence: 'Prom. palabras/oración',
    avgSyllablesPerWord: 'Prom. sílabas/palabra',
    totalSyllables: 'Total de sílabas',
    readyToCheck: '¿Listo para verificar?',
    readyHint: 'Pega tu texto y haz clic en "Verificar legibilidad" para analizar',
    readabilityLevels: {
      veryEasy: { level: 'Muy fácil', description: 'Nivel de 5.º grado' },
      easy: { level: 'Fácil', description: 'Nivel de 6.º grado' },
      fairlyEasy: { level: 'Bastante fácil', description: 'Nivel de 7.º grado' },
      standard: { level: 'Estándar', description: 'Nivel de 8.º-9.º grado' },
      fairlyDifficult: { level: 'Bastante difícil', description: 'Nivel de 10.º-12.º grado' },
      difficult: { level: 'Difícil', description: 'Nivel universitario' },
      veryDifficult: { level: 'Muy difícil', description: 'Nivel de posgrado' },
    },
    gradeLevels: {
      elementary: 'Primaria',
      middleSchool: 'Secundaria',
      highSchool: 'Preparatoria',
      college: 'Universidad',
      graduate: 'Posgrado',
    },
  },
}

function ReadabilityCheckerContent() {
  const { language } = useLanguage()
  const c = copy[language]
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

    const fleschReadingEase = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
    const fleschKincaidGrade = (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59
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
    const levels = c.readabilityLevels
    if (score >= 90) {
      return { level: levels.veryEasy.level, color: 'text-green-600', description: levels.veryEasy.description }
    } else if (score >= 80) {
      return { level: levels.easy.level, color: 'text-green-500', description: levels.easy.description }
    } else if (score >= 70) {
      return { level: levels.fairlyEasy.level, color: 'text-blue-600', description: levels.fairlyEasy.description }
    } else if (score >= 60) {
      return { level: levels.standard.level, color: 'text-blue-500', description: levels.standard.description }
    } else if (score >= 50) {
      return { level: levels.fairlyDifficult.level, color: 'text-yellow-600', description: levels.fairlyDifficult.description }
    } else if (score >= 30) {
      return { level: levels.difficult.level, color: 'text-orange-600', description: levels.difficult.description }
    } else {
      return { level: levels.veryDifficult.level, color: 'text-red-600', description: levels.veryDifficult.description }
    }
  }

  const getGradeLevel = (grade: number): { level: string; color: string } => {
    const levels = c.gradeLevels
    if (grade <= 6) {
      return { level: levels.elementary, color: 'text-green-600' }
    } else if (grade <= 9) {
      return { level: levels.middleSchool, color: 'text-blue-600' }
    } else if (grade <= 12) {
      return { level: levels.highSchool, color: 'text-yellow-600' }
    } else if (grade <= 16) {
      return { level: levels.college, color: 'text-orange-600' }
    } else {
      return { level: levels.graduate, color: 'text-red-600' }
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
          <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-3">{c.title}</h1>
          <p className="text-xl text-mono-600 dark:text-mono-400">{c.subtitle}</p>
        </div>

        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-8 border border-mono-200 dark:border-mono-700">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.howToUseTitle}</h2>
          <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.whatItDoes}</h3>
              <p>{c.whatItDoesBody}</p>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.howToUseInner}</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                {c.howToUseSteps.map((step, i) => (
                  <li key={i}><strong>{step.label}</strong> {step.text}</li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.expectedOutcome}</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {c.expectedOutcomes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
              <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">{c.enterYourText}</h2>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={c.textPlaceholder}
                rows={12}
                className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none resize-y bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              />
              <button
                onClick={calculateMetrics}
                disabled={!text.trim()}
                className="w-full mt-4 px-6 py-4 bg-accent-600 text-white rounded-xl font-bold text-lg hover:bg-accent-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle size={24} />
                {c.checkReadability}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {metrics ? (
              <>
                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.readabilityScore}</h2>
                  <div className="text-center py-4">
                    <div className="text-5xl font-bold text-accent-600 mb-2">
                      {metrics.fleschReadingEase.toFixed(1)}
                    </div>
                    <p className="text-mono-600 dark:text-mono-400 mb-2">
                      {getReadabilityLevel(metrics.fleschReadingEase).level}
                    </p>
                    <p className="text-sm text-mono-500 dark:text-mono-400">
                      {getReadabilityLevel(metrics.fleschReadingEase).description}
                    </p>
                  </div>
                </div>

                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4 flex items-center gap-2">
                    <BookOpen size={20} />
                    {c.gradeLevel}
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

                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.textStatistics}</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-mono-100 dark:bg-mono-800 rounded-lg">
                      <span className="text-mono-700 dark:text-mono-300 font-medium">{c.words}</span>
                      <span className="text-xl font-bold text-mono-950 dark:text-mono-50">{metrics.words.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-mono-100 dark:bg-mono-800 rounded-lg">
                      <span className="text-mono-700 dark:text-mono-300 font-medium">{c.sentences}</span>
                      <span className="text-xl font-bold text-mono-950 dark:text-mono-50">{metrics.sentences.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-mono-100 dark:bg-mono-800 rounded-lg">
                      <span className="text-mono-700 dark:text-mono-300 font-medium">{c.paragraphs}</span>
                      <span className="text-xl font-bold text-mono-950 dark:text-mono-50">{metrics.paragraphs.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-mono-100 dark:bg-mono-800 rounded-lg">
                      <span className="text-mono-700 dark:text-mono-300 font-medium">{c.characters}</span>
                      <span className="text-xl font-bold text-mono-950 dark:text-mono-50">{metrics.characters.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-mono-100 dark:bg-mono-800 rounded-lg">
                      <span className="text-mono-700 dark:text-mono-300 font-medium">{c.readingTime}</span>
                      <span className="text-xl font-bold text-mono-950 dark:text-mono-50">{c.readingTimeMin(metrics.readingTime)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4 flex items-center gap-2">
                    <TrendingUp size={20} />
                    {c.advancedMetrics}
                  </h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-mono-600 dark:text-mono-400">{c.avgWordsPerSentence}</span>
                      <span className="font-semibold text-mono-950 dark:text-mono-50">{metrics.avgWordsPerSentence}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mono-600 dark:text-mono-400">{c.avgSyllablesPerWord}</span>
                      <span className="font-semibold text-mono-950 dark:text-mono-50">{metrics.avgSyllablesPerWord}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mono-600 dark:text-mono-400">{c.totalSyllables}</span>
                      <span className="font-semibold text-mono-950 dark:text-mono-50">{metrics.syllables.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-12 text-center h-full flex flex-col justify-center border border-mono-200 dark:border-mono-700">
                <FileText className="mx-auto text-mono-300 dark:text-mono-700 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-mono-700 dark:text-mono-300 mb-3">{c.readyToCheck}</h3>
                <p className="text-mono-500 dark:text-mono-400">
                  {c.readyHint}
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
      toolSlug="readability-checker"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <ReadabilityCheckerContent />
    </ToolAccessGate>
  )
}
