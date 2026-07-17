'use client'

import { useState } from 'react'
import { Search, Hash, TrendingUp } from 'lucide-react';
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Keyword {
  word: string
  count: number
}

const copy = {
  en: {
    toolName: 'SEO Optimizer',
    toolDescription:
      'Optimizes content for search engines by analyzing keywords, density, and SEO best practices. Provides keyword suggestions, density analysis, and recommendations to improve search visibility.',
    howToUse: [
      { label: 'Enter content:', text: 'Paste your text content to analyze' },
      { label: 'Click "Analyze":', text: 'Get SEO analysis and keyword insights' },
      { label: 'Review keywords:', text: 'See most frequent keywords and their counts' },
      { label: 'Check density:', text: 'Review keyword density percentages' },
      { label: 'Get suggestions:', text: 'Use recommendations to improve SEO' },
    ],
    title: 'SEO Optimizer',
    subtitle: 'Analyze keywords in your content',
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Analyzes your content to find the most frequently used keywords. Helps identify which words appear most often in your text, useful for SEO optimization and keyword research.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Paste your content:', text: 'Copy and paste your article, blog post, or any text (can be any length)' },
      { label: 'Click "Analyze"', text: 'to process your content' },
      { label: 'Review top keywords:', text: 'See top 10 keywords ranked by frequency, view how many times each keyword appears. Keywords are filtered (stop words removed)' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Top 10 Keywords - Most frequently used words',
      'Frequency count - How many times each keyword appears',
      'Ranked list - Keywords sorted by usage',
      'Keyword insights - Summary statistics',
    ],
    yourContent: 'Your Content',
    contentPlaceholder: 'Paste your article or content here...',
    analyze: 'Analyze',
    topKeywords: 'Top Keywords',
    times: (count: number) => `${count} times`,
    keywordInsights: 'Keyword Insights',
    topKeywordAppears: (count: number) => `Top keyword appears ${count} times`,
    top5Keywords: (words: string) => `Top 5 keywords: ${words}`,
    totalUniqueKeywords: (count: number) => `Total unique keywords analyzed: ${count}`,
    readyToAnalyze: 'Ready to Analyze?',
    readyHint: 'Paste your content and click "Analyze" to find top keywords',
  },
  es: {
    toolName: 'Optimizador SEO',
    toolDescription:
      'Optimiza contenido para motores de búsqueda analizando palabras clave, densidad y mejores prácticas SEO. Proporciona sugerencias de palabras clave, análisis de densidad y recomendaciones para mejorar la visibilidad en búsquedas.',
    howToUse: [
      { label: 'Ingresa contenido:', text: 'Pega tu contenido de texto para analizar' },
      { label: 'Haz clic en "Analizar":', text: 'Obtén análisis SEO e insights de palabras clave' },
      { label: 'Revisa palabras clave:', text: 'Ve las palabras clave más frecuentes y sus conteos' },
      { label: 'Revisa densidad:', text: 'Consulta porcentajes de densidad de palabras clave' },
      { label: 'Obtén sugerencias:', text: 'Usa recomendaciones para mejorar el SEO' },
    ],
    title: 'Optimizador SEO',
    subtitle: 'Analiza palabras clave en tu contenido',
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Analiza tu contenido para encontrar las palabras clave más usadas. Ayuda a identificar qué palabras aparecen con más frecuencia en tu texto, útil para optimización SEO e investigación de palabras clave.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Pega tu contenido:', text: 'Copia y pega tu artículo, post de blog o cualquier texto (puede ser de cualquier longitud)' },
      { label: 'Haz clic en "Analizar"', text: 'para procesar tu contenido' },
      { label: 'Revisa palabras clave principales:', text: 'Ve las 10 palabras clave principales ordenadas por frecuencia, cuántas veces aparece cada una. Las palabras clave están filtradas (stop words eliminadas)' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Top 10 palabras clave - Palabras más usadas',
      'Conteo de frecuencia - Cuántas veces aparece cada palabra clave',
      'Lista ordenada - Palabras clave ordenadas por uso',
      'Insights de palabras clave - Estadísticas resumidas',
    ],
    yourContent: 'Tu contenido',
    contentPlaceholder: 'Pega tu artículo o contenido aquí...',
    analyze: 'Analizar',
    topKeywords: 'Palabras clave principales',
    times: (count: number) => `${count} veces`,
    keywordInsights: 'Insights de palabras clave',
    topKeywordAppears: (count: number) => `La palabra clave principal aparece ${count} veces`,
    top5Keywords: (words: string) => `Top 5 palabras clave: ${words}`,
    totalUniqueKeywords: (count: number) => `Total de palabras clave únicas analizadas: ${count}`,
    readyToAnalyze: '¿Listo para analizar?',
    readyHint: 'Pega tu contenido y haz clic en "Analizar" para encontrar palabras clave principales',
  },
}

function SEOOptimizerContent() {
  const { language } = useLanguage()
  const c = copy[language]
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
              <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">{c.yourContent}</h2>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={c.contentPlaceholder}
                rows={12}
                className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none resize-y bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              />
              <button
                onClick={analyze}
                disabled={!text.trim()}
                className="w-full mt-4 px-6 py-4 bg-accent-600 text-white rounded-xl font-bold text-lg hover:bg-accent-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Search size={24} />
                {c.analyze}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {keywords.length > 0 ? (
              <>
                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4 flex items-center gap-2">
                    <Hash size={20} />
                    {c.topKeywords}
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
                          <span className="text-mono-700 dark:text-mono-300 font-medium">{c.times(kw.count)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h3 className="text-lg font-bold text-mono-950 dark:text-mono-50 mb-3">{c.keywordInsights}</h3>
                  <div className="space-y-2 text-sm text-mono-700 dark:text-mono-300">
                    <p>• {c.topKeywordAppears(keywords[0]?.count ?? 0)}</p>
                    <p>• {c.top5Keywords(keywords.slice(0, 5).map(k => k.word).join(', '))}</p>
                    <p>• {c.totalUniqueKeywords(keywords.length)}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-12 text-center h-full flex flex-col justify-center border border-mono-200 dark:border-mono-700">
                <Search className="mx-auto text-mono-300 dark:text-mono-700 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-mono-700 dark:text-mono-300 mb-3">{c.readyToAnalyze}</h3>
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

export default function SEOOptimizer() {
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
      toolSlug="seo-optimizer"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <SEOOptimizerContent />
    </ToolAccessGate>
  )
}
