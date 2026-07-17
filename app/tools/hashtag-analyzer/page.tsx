'use client'

import { useState } from 'react'
import { Hash, TrendingUp, TrendingDown, Award, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface HashtagData {
  tag: string
  uses: number
  avgEngagement: number
  reach: number
  performance: 'High' | 'Medium' | 'Low'
  trend: 'up' | 'down'
  changePercent: number
  recommendation: 'Keep' | 'Test' | 'Replace'
}

interface Results {
  hashtags: HashtagData[]
  topPerformers: HashtagData[]
  underperformers: HashtagData[]
  performanceHistory: { week: string; engagement: number }[]
  performanceDistribution: { name: string; value: number; color: string }[]
  totalHashtags: number
  avgEngagementPerHashtag: number
  overallScore: number
  recommendations: { type: string; message: string }[]
}

const copy = {
  en: {
    toolName: 'Hashtag Analyzer',
    toolDescription:
      'Analyzes hashtag performance by tracking usage, engagement rates, reach, and trends. Provides recommendations on which hashtags to keep, test, or replace based on performance data.',
    howToUse: [
      { label: 'Enter hashtags:', text: 'Paste your hashtags (one per line or comma-separated)' },
      { label: 'Enter post count:', text: "Input the number of posts you've used these hashtags in" },
      { label: 'Click "Analyze":', text: 'See detailed performance metrics for each hashtag' },
      { label: 'Review results:', text: 'Check performance ratings, trends, and recommendations' },
      { label: 'Optimize:', text: 'Use the recommendations to improve your hashtag strategy' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Analyzes your hashtag performance by tracking usage, engagement, reach, and trends. Provides recommendations on which hashtags to keep, test, or replace based on performance data.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter hashtags:', text: 'Paste your hashtags (comma or space separated)' },
      { label: 'Enter post count:', text: 'Number of posts using these hashtags' },
      { label: 'Enter total engagement:', text: 'Total likes, comments, shares across those posts' },
      { label: 'Click "Analyze"', text: 'to process your hashtags' },
      { label: 'Review results:', text: 'See performance metrics, top performers, underperformers, charts, and recommendations' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Performance analysis for each hashtag',
      'Top performing hashtags identified',
      'Underperforming hashtags flagged',
      'Visual charts showing performance trends',
      'Recommendations (Keep, Test, or Replace) for each hashtag',
      'Overall hashtag strategy score',
    ],
    title: 'Hashtag Analyzer',
    subtitle: 'Analyze hashtag performance and get recommendations',
    enterHashtags: 'Enter Your Hashtags',
    hashtagsLabel: 'Hashtags (comma or space separated)',
    hashtagsPlaceholder: '#fitness #motivation #workout #health #gym...',
    hashtagsCount: (n: number) => `${n} hashtags`,
    postCountLabel: 'Number of Posts (optional)',
    postCountPlaceholder: 'e.g., 20',
    engagementLabel: 'Total Engagement (optional)',
    engagementPlaceholder: 'e.g., 5000',
    analyzeHashtags: 'Analyze Hashtags',
    performanceScore: 'Performance Score',
    excellent: 'Excellent',
    good: 'Good',
    needsWork: 'Needs Work',
    overallPerformance: 'Overall Hashtag Performance',
    keyMetrics: 'Key Metrics',
    totalHashtags: 'Total Hashtags',
    avgEngagement: 'Avg Engagement',
    highPerformers: 'High Performers',
    recommendations: 'Recommendations',
    readyToAnalyze: 'Ready to Analyze?',
    readyBody: 'Enter your hashtags to see detailed performance metrics and recommendations',
    performanceOverTime: 'Performance Over Time',
    performanceDistribution: 'Performance Distribution',
    topPerforming: 'Top Performing Hashtags',
    avgEngagementCol: 'Avg Engagement:',
    reachCol: 'Reach:',
    completeAnalysis: 'Complete Hashtag Analysis',
    colHashtag: 'Hashtag',
    colUses: 'Uses',
    colAvgEngagement: 'Avg Engagement',
    colReach: 'Reach',
    colPerformance: 'Performance',
    colTrend: 'Trend',
    colAction: 'Action',
    performanceLabels: { High: 'High', Medium: 'Medium', Low: 'Low' } as Record<string, string>,
    recommendationLabels: { Keep: 'Keep', Test: 'Test', Replace: 'Replace' } as Record<string, string>,
    weekLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    recGreatSelection: 'Great hashtag selection! Most of your hashtags are performing well.',
    recReplaceLow: 'Consider replacing low-performing hashtags with higher-engagement alternatives.',
    recTryFiveTen: 'Try using 5-10 hashtags per post for optimal reach.',
    recTooMany: 'Too many hashtags may look spammy. Consider reducing to 10-15.',
    recTrendingUp: 'Most of your hashtags are trending upward! Keep using them.',
  },
  es: {
    toolName: 'Analizador de hashtags',
    toolDescription:
      'Analiza el rendimiento de hashtags rastreando uso, tasas de interacción, alcance y tendencias. Ofrece recomendaciones sobre qué hashtags mantener, probar o reemplazar según los datos de rendimiento.',
    howToUse: [
      { label: 'Ingresa hashtags:', text: 'Pega tus hashtags (uno por línea o separados por comas)' },
      { label: 'Ingresa cantidad de publicaciones:', text: 'Indica el número de publicaciones donde usaste estos hashtags' },
      { label: 'Haz clic en "Analizar":', text: 'Ve métricas detalladas de rendimiento para cada hashtag' },
      { label: 'Revisa resultados:', text: 'Consulta calificaciones de rendimiento, tendencias y recomendaciones' },
      { label: 'Optimiza:', text: 'Usa las recomendaciones para mejorar tu estrategia de hashtags' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Analiza el rendimiento de tus hashtags rastreando uso, interacción, alcance y tendencias. Ofrece recomendaciones sobre qué hashtags mantener, probar o reemplazar según los datos de rendimiento.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Ingresa hashtags:', text: 'Pega tus hashtags (separados por comas o espacios)' },
      { label: 'Ingresa cantidad de publicaciones:', text: 'Número de publicaciones que usan estos hashtags' },
      { label: 'Ingresa interacción total:', text: 'Total de likes, comentarios y compartidos en esas publicaciones' },
      { label: 'Haz clic en "Analizar"', text: 'para procesar tus hashtags' },
      { label: 'Revisa resultados:', text: 'Ve métricas de rendimiento, mejores, peores, gráficos y recomendaciones' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Análisis de rendimiento para cada hashtag',
      'Hashtags con mejor rendimiento identificados',
      'Hashtags con bajo rendimiento señalados',
      'Gráficos visuales de tendencias de rendimiento',
      'Recomendaciones (Mantener, Probar o Reemplazar) para cada hashtag',
      'Puntuación general de estrategia de hashtags',
    ],
    title: 'Analizador de hashtags',
    subtitle: 'Analiza el rendimiento de hashtags y obtén recomendaciones',
    enterHashtags: 'Ingresa tus hashtags',
    hashtagsLabel: 'Hashtags (separados por comas o espacios)',
    hashtagsPlaceholder: '#fitness #motivation #workout #health #gym...',
    hashtagsCount: (n: number) => `${n} hashtags`,
    postCountLabel: 'Número de publicaciones (opcional)',
    postCountPlaceholder: 'ej., 20',
    engagementLabel: 'Interacción total (opcional)',
    engagementPlaceholder: 'ej., 5000',
    analyzeHashtags: 'Analizar hashtags',
    performanceScore: 'Puntuación de rendimiento',
    excellent: 'Excelente',
    good: 'Bueno',
    needsWork: 'Necesita mejorar',
    overallPerformance: 'Rendimiento general de hashtags',
    keyMetrics: 'Métricas clave',
    totalHashtags: 'Total de hashtags',
    avgEngagement: 'Interacción promedio',
    highPerformers: 'Alto rendimiento',
    recommendations: 'Recomendaciones',
    readyToAnalyze: '¿Listo para analizar?',
    readyBody: 'Ingresa tus hashtags para ver métricas detalladas de rendimiento y recomendaciones',
    performanceOverTime: 'Rendimiento a lo largo del tiempo',
    performanceDistribution: 'Distribución de rendimiento',
    topPerforming: 'Hashtags con mejor rendimiento',
    avgEngagementCol: 'Interacción prom.:',
    reachCol: 'Alcance:',
    completeAnalysis: 'Análisis completo de hashtags',
    colHashtag: 'Hashtag',
    colUses: 'Usos',
    colAvgEngagement: 'Interacción prom.',
    colReach: 'Alcance',
    colPerformance: 'Rendimiento',
    colTrend: 'Tendencia',
    colAction: 'Acción',
    performanceLabels: { High: 'Alto', Medium: 'Medio', Low: 'Bajo' } as Record<string, string>,
    recommendationLabels: { Keep: 'Mantener', Test: 'Probar', Replace: 'Reemplazar' } as Record<string, string>,
    weekLabels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    recGreatSelection: '¡Excelente selección de hashtags! La mayoría están rindiendo bien.',
    recReplaceLow: 'Considera reemplazar hashtags de bajo rendimiento por alternativas con mayor interacción.',
    recTryFiveTen: 'Prueba usar 5-10 hashtags por publicación para un alcance óptimo.',
    recTooMany: 'Demasiados hashtags pueden parecer spam. Considera reducir a 10-15.',
    recTrendingUp: '¡La mayoría de tus hashtags están en tendencia al alza! Sigue usándolos.',
  },
}

function HashtagAnalyzerContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [hashtags, setHashtags] = useState('')
  const [postCount, setPostCount] = useState('')
  const [totalEngagement, setTotalEngagement] = useState('')
  const [results, setResults] = useState<Results | null>(null)

  const generateHashtagData = (tags: string[]): HashtagData[] => {
    return tags.map(tag => {
      const baseEngagement = Math.random() * 1000 + 200
      const trend = Math.random() > 0.5 ? 'up' : 'down'
      const changePercent = parseFloat((Math.random() * 30 + 5).toFixed(1))
      
      return {
        tag: tag,
        uses: Math.floor(Math.random() * 50 + 10),
        avgEngagement: Math.floor(baseEngagement),
        reach: Math.floor(baseEngagement * (Math.random() * 3 + 2)),
        performance: baseEngagement > 600 ? 'High' : baseEngagement > 400 ? 'Medium' : 'Low',
        trend: trend,
        changePercent: changePercent,
        recommendation: baseEngagement > 600 ? 'Keep' : baseEngagement > 400 ? 'Test' : 'Replace'
      }
    })
  }

  const generatePerformanceHistory = () => {
    const engagements = [450, 520, 480, 650]
    return c.weekLabels.map((week, i) => ({
      week,
      engagement: engagements[i],
    }))
  }

  const generateRecommendations = (data: HashtagData[]) => {
    const recommendations = []

    const highPerformers = data.filter(h => h.performance === 'High').length
    const lowPerformers = data.filter(h => h.performance === 'Low').length

    if (highPerformers / data.length > 0.6) {
      recommendations.push({
        type: 'success',
        message: c.recGreatSelection,
      })
    }

    if (lowPerformers / data.length > 0.4) {
      recommendations.push({
        type: 'warning',
        message: c.recReplaceLow,
      })
    }

    if (data.length < 5) {
      recommendations.push({
        type: 'info',
        message: c.recTryFiveTen,
      })
    }

    if (data.length > 15) {
      recommendations.push({
        type: 'warning',
        message: c.recTooMany,
      })
    }

    const trendingUp = data.filter(h => h.trend === 'up').length
    if (trendingUp > data.length / 2) {
      recommendations.push({
        type: 'success',
        message: c.recTrendingUp,
      })
    }

    return recommendations
  }

  const analyzeHashtags = () => {
    if (!hashtags.trim()) return

    const tagList = hashtags.split(/[,\s#]+/).filter(t => t.trim()).map(t => t.trim().toLowerCase())

    const hashtagData = generateHashtagData(tagList)
    const performanceHistory = generatePerformanceHistory()

    const topPerformers = [...hashtagData].sort((a, b) => b.avgEngagement - a.avgEngagement).slice(0, 3)
    const underperformers = [...hashtagData].sort((a, b) => a.avgEngagement - b.avgEngagement).slice(0, 3)

    const performanceDistribution = [
      { name: 'High', value: hashtagData.filter(h => h.performance === 'High').length, color: '#10b981' },
      { name: 'Medium', value: hashtagData.filter(h => h.performance === 'Medium').length, color: '#f59e0b' },
      { name: 'Low', value: hashtagData.filter(h => h.performance === 'Low').length, color: '#ef4444' }
    ]

    const overallScore = Math.round(
      (hashtagData.reduce((sum, h) => sum + h.avgEngagement, 0) / hashtagData.length) / 10
    )

    setResults({
      hashtags: hashtagData,
      topPerformers,
      underperformers,
      performanceHistory,
      performanceDistribution,
      totalHashtags: tagList.length,
      avgEngagementPerHashtag: Math.round(hashtagData.reduce((sum, h) => sum + h.avgEngagement, 0) / hashtagData.length),
      overallScore: Math.min(overallScore, 100),
      recommendations: generateRecommendations(hashtagData)
    })
  }

  const getPerformanceColor = (performance: string) => {
    switch(performance) {
      case 'High': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Low': return 'text-red-600 bg-red-100'
      default: return 'text-mono-600 bg-mono-100'
    }
  }

  const getRecommendationColor = (rec: string) => {
    switch(rec) {
      case 'Keep': return 'text-green-600 bg-green-100'
      case 'Test': return 'text-yellow-600 bg-yellow-100'
      case 'Replace': return 'text-red-600 bg-red-100'
      default: return 'text-mono-600 bg-mono-100'
    }
  }

  const hashtagCount = hashtags.split(/[,\s#]+/).filter(t => t.trim()).length

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-accent-600 rounded-2xl">
              <Hash className="text-white" size={48} />
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
                  <li key={i}>
                    <strong>{step.label}</strong> {step.text}
                  </li>
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
              <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">{c.enterHashtags}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    {c.hashtagsLabel}
                  </label>
                  <textarea
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    placeholder={c.hashtagsPlaceholder}
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none resize-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                  <p className="text-xs text-mono-500 mt-1">
                    {c.hashtagsCount(hashtagCount)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    {c.postCountLabel}
                  </label>
                  <input
                    type="number"
                    value={postCount}
                    onChange={(e) => setPostCount(e.target.value)}
                    placeholder={c.postCountPlaceholder}
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    {c.engagementLabel}
                  </label>
                  <input
                    type="number"
                    value={totalEngagement}
                    onChange={(e) => setTotalEngagement(e.target.value)}
                    placeholder={c.engagementPlaceholder}
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <button
                  onClick={analyzeHashtags}
                  disabled={!hashtags.trim()}
                  className="w-full px-6 py-4 bg-accent-600 text-white rounded-xl font-bold text-lg hover:bg-accent-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Zap size={24} />
                  {c.analyzeHashtags}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {results ? (
              <>
                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.performanceScore}</h2>
                  <div className="text-center py-6">
                    <div className={`inline-block px-6 py-3 rounded-full mb-4 ${
                      results.overallScore >= 70 ? 'bg-green-100' :
                      results.overallScore >= 50 ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <span className={`text-lg font-bold ${
                        results.overallScore >= 70 ? 'text-green-700' :
                        results.overallScore >= 50 ? 'text-yellow-700' : 'text-red-700'
                      }`}>
                        {results.overallScore >= 70 ? c.excellent :
                         results.overallScore >= 50 ? c.good : c.needsWork}
                      </span>
                    </div>
                    <div className="text-6xl font-bold text-mono-950 dark:text-mono-50 mb-2">{results.overallScore}/100</div>
                    <p className="text-mono-600 dark:text-mono-400">{c.overallPerformance}</p>
                  </div>
                </div>

                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.keyMetrics}</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-mono-100 dark:bg-mono-800 rounded-lg">
                      <span className="text-mono-700 dark:text-mono-300 font-medium">{c.totalHashtags}</span>
                      <span className="text-2xl font-bold text-mono-950 dark:text-mono-50">{results.totalHashtags}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-mono-100 dark:bg-mono-800 rounded-lg">
                      <span className="text-mono-700 dark:text-mono-300 font-medium">{c.avgEngagement}</span>
                      <span className="text-2xl font-bold text-mono-950 dark:text-mono-50">{results.avgEngagementPerHashtag}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-mono-100 dark:bg-mono-800 rounded-lg">
                      <span className="text-mono-700 dark:text-mono-300 font-medium">{c.highPerformers}</span>
                      <span className="text-2xl font-bold text-green-600">
                        {results.hashtags.filter(h => h.performance === 'High').length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.recommendations}</h2>
                  <div className="space-y-3">
                    {results.recommendations.map((rec, idx) => (
                      <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                        rec.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                        rec.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                        'border-accent-500 bg-accent-50 dark:bg-accent-900/20'
                      }`}>
                        <div className="flex items-start gap-3">
                          {rec.type === 'success' && <CheckCircle className="text-green-600 flex-shrink-0" size={20} />}
                          {rec.type === 'warning' && <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />}
                          {rec.type === 'info' && <AlertCircle className="text-accent-600 flex-shrink-0" size={20} />}
                          <p className="text-sm text-mono-700 dark:text-mono-300">{rec.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-12 text-center h-full flex flex-col justify-center border border-mono-200 dark:border-mono-700">
                <Hash className="mx-auto text-mono-300 dark:text-mono-700 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-mono-700 dark:text-mono-300 mb-3">{c.readyToAnalyze}</h3>
                <p className="text-mono-500 mb-6">{c.readyBody}</p>
              </div>
            )}
          </div>
        </div>

        {results && (
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.performanceOverTime}</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={results.performanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="week" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="engagement" stroke="#0a66c2" strokeWidth={3} dot={{ fill: '#0a66c2', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.performanceDistribution}</h2>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={results.performanceDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {results.performanceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {results.performanceDistribution.map(perf => (
                    <div key={perf.name} className="text-center">
                      <div className="w-4 h-4 rounded mx-auto mb-1" style={{ backgroundColor: perf.color }}></div>
                      <p className="text-xs text-mono-600 dark:text-mono-400">{c.performanceLabels[perf.name]}</p>
                      <p className="text-sm font-bold text-mono-950 dark:text-mono-50">{perf.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
              <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4 flex items-center gap-2">
                <Award className="text-yellow-500" size={24} />
                {c.topPerforming}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.topPerformers.map((tag, idx) => (
                  <div key={idx} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-green-700 dark:text-green-400">#{tag.tag}</span>
                      {tag.trend === 'up' && <TrendingUp className="text-green-600" size={20} />}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-mono-600 dark:text-mono-400">{c.avgEngagementCol}</span>
                        <span className="font-semibold text-mono-950 dark:text-mono-50">{tag.avgEngagement}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-mono-600 dark:text-mono-400">{c.reachCol}</span>
                        <span className="font-semibold text-mono-950 dark:text-mono-50">{tag.reach.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
              <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.completeAnalysis}</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b-2 border-mono-200 dark:border-mono-700">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-mono-700 dark:text-mono-300">{c.colHashtag}</th>
                      <th className="text-left py-3 px-4 font-semibold text-mono-700 dark:text-mono-300">{c.colUses}</th>
                      <th className="text-left py-3 px-4 font-semibold text-mono-700 dark:text-mono-300">{c.colAvgEngagement}</th>
                      <th className="text-left py-3 px-4 font-semibold text-mono-700 dark:text-mono-300">{c.colReach}</th>
                      <th className="text-left py-3 px-4 font-semibold text-mono-700 dark:text-mono-300">{c.colPerformance}</th>
                      <th className="text-left py-3 px-4 font-semibold text-mono-700 dark:text-mono-300">{c.colTrend}</th>
                      <th className="text-left py-3 px-4 font-semibold text-mono-700 dark:text-mono-300">{c.colAction}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.hashtags.map((tag, idx) => (
                      <tr key={idx} className="border-b border-mono-100 dark:border-mono-800 hover:bg-mono-50 dark:hover:bg-mono-800 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-semibold text-accent-600">#{tag.tag}</span>
                        </td>
                        <td className="py-3 px-4 text-mono-700 dark:text-mono-300">{tag.uses}</td>
                        <td className="py-3 px-4 text-mono-700 dark:text-mono-300 font-semibold">{tag.avgEngagement}</td>
                        <td className="py-3 px-4 text-mono-700 dark:text-mono-300">{tag.reach.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPerformanceColor(tag.performance)}`}>
                            {c.performanceLabels[tag.performance]}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {tag.trend === 'up' ? (
                              <TrendingUp className="text-green-600" size={16} />
                            ) : (
                              <TrendingDown className="text-red-600" size={16} />
                            )}
                            <span className={`text-sm font-semibold ${tag.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                              {tag.changePercent}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRecommendationColor(tag.recommendation)}`}>
                            {c.recommendationLabels[tag.recommendation]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function HashtagAnalyzer() {
  const { language } = useLanguage()
  const c = copy[language]

  const howToUse = (
    <div>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        {c.howToUse.map((step, i) => (
          <li key={i}>
            <strong>{step.label}</strong> {step.text}
          </li>
        ))}
      </ol>
    </div>
  )

  return (
    <ToolAccessGate
      toolSlug="hashtag-analyzer"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <HashtagAnalyzerContent />
    </ToolAccessGate>
  )
}
