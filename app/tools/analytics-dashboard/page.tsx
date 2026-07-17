'use client'

import { useState, useEffect, useRef } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const STORAGE_KEY = 'mini_analytics'

interface AnalyticsEntry {
  t: number
  page: string
  ref: string
  device: string
  site?: string
}

const copy = {
  en: {
    toolName: 'Analytics Dashboard',
    toolDescription:
      'Tracks page views, unique visitors, top pages, referrers, and device split. Stores data locally and exports to CSV or JSON.',
    howToUse: [
      { label: 'Automatic tracking:', text: 'The dashboard automatically tracks visits when loaded' },
      {
        label: 'View metrics:',
        text: 'Page Views (total visits), Unique Visitors (distinct users), Top Pages (most visited pages), Referrers (traffic sources), Device Split (mobile vs desktop)',
      },
      {
        label: 'Export data:',
        text: 'Click "Export CSV" for spreadsheet format or "Export JSON" for raw data',
      },
      { label: 'Clear data:', text: 'Click "Clear data" to reset all analytics' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Tracks page views, unique visitors, top pages, referrers, and device split. Stores data locally and exports to CSV or JSON.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Automatic tracking:', text: 'The dashboard automatically tracks visits when loaded' },
      {
        label: 'View metrics:',
        text: 'Page Views (total visits), Unique Visitors (distinct users), Top Pages (most visited pages), Referrers (traffic sources), Device Split (mobile vs desktop)',
      },
      {
        label: 'Export data:',
        text: 'Click "Export CSV" for spreadsheet format or "Export JSON" for raw data',
      },
      { label: 'Clear data:', text: 'Click "Clear data" to reset all analytics' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Real-time metrics updated every 3 seconds',
      'Visual charts showing device distribution',
      'Top pages table with view counts',
      'Referrer tracking showing where traffic comes from',
      'Exportable data in CSV or JSON format',
    ],
    title: 'Mini Analytics Dashboard',
    clearData: 'Clear data',
    exportCsv: 'Export CSV',
    exportJson: 'Export JSON',
    clearConfirm: 'Delete all local data?',
    benchmarksTitle: 'Performance Benchmarks',
    benchmarksIntro: 'See how your performance compares to industry averages',
    pageViews: 'Page Views',
    uniqueVisitors: 'Unique Visitors',
    engagementRate: 'Engagement Rate',
    industryAvg: 'Industry avg:',
    topPages: 'Top Pages',
    pageCol: 'Page',
    viewsCol: 'Views',
    referrers: 'Referrers',
    sourceCol: 'Source',
    clicksCol: 'Clicks',
    deviceSplit: 'Device Split',
    labelTop10: 'Top 10%',
    labelTop25: 'Top 25%',
    labelAverage: 'Average',
    labelNeedsImprovement: 'Needs Improvement',
  },
  es: {
    toolName: 'Panel de analítica',
    toolDescription:
      'Registra vistas de página, visitantes únicos, páginas principales, referencias y división por dispositivo. Guarda los datos en local y exporta a CSV o JSON.',
    howToUse: [
      { label: 'Seguimiento automático:', text: 'El panel registra visitas automáticamente al cargarse' },
      {
        label: 'Ver métricas:',
        text: 'Vistas de página (visitas totales), Visitantes únicos, Páginas principales, Referencias (fuentes de tráfico), División por dispositivo (móvil vs escritorio)',
      },
      {
        label: 'Exportar datos:',
        text: 'Haz clic en "Exportar CSV" para hoja de cálculo o "Exportar JSON" para datos en bruto',
      },
      { label: 'Borrar datos:', text: 'Haz clic en "Borrar datos" para reiniciar toda la analítica' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Registra vistas de página, visitantes únicos, páginas principales, referencias y división por dispositivo. Guarda los datos en local y exporta a CSV o JSON.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Seguimiento automático:', text: 'El panel registra visitas automáticamente al cargarse' },
      {
        label: 'Ver métricas:',
        text: 'Vistas de página (visitas totales), Visitantes únicos, Páginas principales, Referencias (fuentes de tráfico), División por dispositivo (móvil vs escritorio)',
      },
      {
        label: 'Exportar datos:',
        text: 'Haz clic en "Exportar CSV" para hoja de cálculo o "Exportar JSON" para datos en bruto',
      },
      { label: 'Borrar datos:', text: 'Haz clic en "Borrar datos" para reiniciar toda la analítica' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Métricas en tiempo real actualizadas cada 3 segundos',
      'Gráficos visuales de la distribución por dispositivo',
      'Tabla de páginas principales con conteo de vistas',
      'Seguimiento de referencias que muestra de dónde viene el tráfico',
      'Datos exportables en CSV o JSON',
    ],
    title: 'Mini panel de analítica',
    clearData: 'Borrar datos',
    exportCsv: 'Exportar CSV',
    exportJson: 'Exportar JSON',
    clearConfirm: '¿Eliminar todos los datos locales?',
    benchmarksTitle: 'Referencias de rendimiento',
    benchmarksIntro: 'Compara tu rendimiento con los promedios del sector',
    pageViews: 'Vistas de página',
    uniqueVisitors: 'Visitantes únicos',
    engagementRate: 'Tasa de engagement',
    industryAvg: 'Promedio del sector:',
    topPages: 'Páginas principales',
    pageCol: 'Página',
    viewsCol: 'Vistas',
    referrers: 'Referencias',
    sourceCol: 'Fuente',
    clicksCol: 'Clics',
    deviceSplit: 'División por dispositivo',
    labelTop10: 'Top 10%',
    labelTop25: 'Top 25%',
    labelAverage: 'Promedio',
    labelNeedsImprovement: 'Necesita mejorar',
  },
}

type Copy = (typeof copy)[keyof typeof copy]

function AnalyticsDashboardContent({ c }: { c: Copy }) {
  const [db, setDb] = useState<AnalyticsEntry[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setDb(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setDb(JSON.parse(stored))
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (canvasRef.current) {
      drawPie()
    }
  }, [db])

  const sum = (arr: AnalyticsEntry[]) => arr.length
  const uniq = (arr: string[]) => new Set(arr).size

  const pageViews = sum(db)
  const uniqueVisitors = uniq(db.map(r => `${r.t}-${r.site || 'default'}`))

  const pages: Record<string, number> = {}
  db.forEach(r => {
    pages[r.page] = (pages[r.page] || 0) + 1
  })
  const topPages = Object.entries(pages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const refs: Record<string, number> = {}
  db.forEach(r => {
    const hostname = r.ref ? new URL(r.ref).hostname : 'direct'
    refs[hostname] = (refs[hostname] || 0) + 1
  })
  const topRefs = Object.entries(refs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const devices: Record<string, number> = { mobile: 0, desktop: 0 }
  db.forEach(r => {
    devices[r.device] = (devices[r.device] || 0) + 1
  })

  const benchmarks = {
    pageViews: {
      excellent: 10000,
      good: 5000,
      average: 1000,
      needsImprovement: 500
    },
    uniqueVisitors: {
      excellent: 5000,
      good: 2500,
      average: 500,
      needsImprovement: 250
    },
    engagementRate: {
      excellent: 5.0,
      good: 3.0,
      average: 1.5,
      needsImprovement: 0.5
    }
  }

  const getBenchmarkStatus = (value: number, benchmark: Record<string, number>) => {
    if (value >= benchmark.excellent) return { status: 'excellent', label: c.labelTop10, color: 'text-green-600 dark:text-green-400' }
    if (value >= benchmark.good) return { status: 'good', label: c.labelTop25, color: 'text-blue-600 dark:text-blue-400' }
    if (value >= benchmark.average) return { status: 'average', label: c.labelAverage, color: 'text-yellow-600 dark:text-yellow-400' }
    return { status: 'needsImprovement', label: c.labelNeedsImprovement, color: 'text-red-600 dark:text-red-400' }
  }

  const pageViewsBenchmark = getBenchmarkStatus(pageViews, benchmarks.pageViews)
  const uniqueVisitorsBenchmark = getBenchmarkStatus(uniqueVisitors, benchmarks.uniqueVisitors)
  const engagementRate = pageViews > 0 ? (uniqueVisitors / pageViews) * 100 : 0
  const engagementBenchmark = getBenchmarkStatus(engagementRate, benchmarks.engagementRate)

  const drawPie = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 200
    canvas.height = 200

    const total = Object.values(devices).reduce((a, b) => a + b, 0)
    if (!total) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    const angles = Object.values(devices).map(v => (v / total) * 2 * Math.PI)
    const colors = ['#0a66c2', '#16a34a']
    let cur = 0

    Object.keys(devices).forEach((k, i) => {
      ctx.beginPath()
      ctx.arc(100, 100, 80, cur, cur + angles[i])
      ctx.lineTo(100, 100)
      ctx.fillStyle = colors[i % colors.length]
      ctx.fill()
      cur += angles[i]
    })
  }

  const handleClear = () => {
    if (confirm(c.clearConfirm)) {
      localStorage.removeItem(STORAGE_KEY)
      setDb([])
    }
  }

  const handleExportCSV = () => {
    const rows = [
      'timestamp,page,referrer,device,site',
      ...db.map(r => `${r.t},${r.page},${r.ref},${r.device},${r.site || ''}`)
    ]
    download(rows.join('\n'), 'analytics.csv', 'text/csv')
  }

  const handleExportJSON = () => {
    download(JSON.stringify(db, null, 2), 'analytics.json', 'application/json')
  }

  const download = (content: string, name: string, type: string) => {
    const blob = new Blob([content], { type })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = name
    a.click()
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 text-mono-950 dark:text-mono-50 p-4">
      <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
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

      <header className="flex gap-4 items-center flex-wrap mb-4">
        <h1 className="text-2xl font-bold m-0">{c.title}</h1>
        <button
          onClick={handleClear}
          className="px-4 py-2 border border-accent-600 bg-accent-600 text-white rounded cursor-pointer hover:opacity-90"
        >
          {c.clearData}
        </button>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 border border-accent-600 bg-accent-600 text-white rounded cursor-pointer hover:opacity-90"
        >
          {c.exportCsv}
        </button>
        <button
          onClick={handleExportJSON}
          className="px-4 py-2 border border-accent-600 bg-accent-600 text-white rounded cursor-pointer hover:opacity-90"
        >
          {c.exportJson}
        </button>
      </header>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.benchmarksTitle}</h2>
        <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">
          {c.benchmarksIntro}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700">
            <div className="text-sm text-mono-600 dark:text-mono-400 mb-1">{c.pageViews}</div>
            <div className="text-2xl font-bold mb-1">{pageViews.toLocaleString()}</div>
            <div className={`text-sm font-semibold ${pageViewsBenchmark.color}`}>
              {pageViewsBenchmark.label}
            </div>
            <div className="text-xs text-mono-500 dark:text-mono-500 mt-1">
              {c.industryAvg} {benchmarks.pageViews.average.toLocaleString()}
            </div>
          </div>
          <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700">
            <div className="text-sm text-mono-600 dark:text-mono-400 mb-1">{c.uniqueVisitors}</div>
            <div className="text-2xl font-bold mb-1">{uniqueVisitors.toLocaleString()}</div>
            <div className={`text-sm font-semibold ${uniqueVisitorsBenchmark.color}`}>
              {uniqueVisitorsBenchmark.label}
            </div>
            <div className="text-xs text-mono-500 dark:text-mono-500 mt-1">
              {c.industryAvg} {benchmarks.uniqueVisitors.average.toLocaleString()}
            </div>
          </div>
          <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700">
            <div className="text-sm text-mono-600 dark:text-mono-400 mb-1">{c.engagementRate}</div>
            <div className="text-2xl font-bold mb-1">{engagementRate.toFixed(1)}%</div>
            <div className={`text-sm font-semibold ${engagementBenchmark.color}`}>
              {engagementBenchmark.label}
            </div>
            <div className="text-xs text-mono-500 dark:text-mono-500 mt-1">
              {c.industryAvg} {benchmarks.engagementRate.average}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-4">
          <h3 className="m-0 mb-2 text-sm text-accent-600">{c.pageViews}</h3>
          <div className="text-4xl font-bold">{pageViews.toLocaleString()}</div>
          <div className={`text-xs mt-1 ${pageViewsBenchmark.color}`}>
            {pageViewsBenchmark.label}
          </div>
        </div>

        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-4">
          <h3 className="m-0 mb-2 text-sm text-accent-600">{c.uniqueVisitors}</h3>
          <div className="text-4xl font-bold">{uniqueVisitors.toLocaleString()}</div>
          <div className={`text-xs mt-1 ${uniqueVisitorsBenchmark.color}`}>
            {uniqueVisitorsBenchmark.label}
          </div>
        </div>

        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-4">
          <h3 className="m-0 mb-2 text-sm text-accent-600">{c.topPages}</h3>
          <table className="w-full text-xs border-collapse mt-2">
            <thead>
              <tr>
                <th className="p-2 text-left">{c.pageCol}</th>
                <th className="p-2 text-left">{c.viewsCol}</th>
              </tr>
            </thead>
            <tbody>
              {topPages.map(([page, count], idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-black/5' : ''}>
                  <td className="p-2">{page}</td>
                  <td className="p-2">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-4">
          <h3 className="m-0 mb-2 text-sm text-accent-600">{c.referrers}</h3>
          <table className="w-full text-xs border-collapse mt-2">
            <thead>
              <tr>
                <th className="p-2 text-left">{c.sourceCol}</th>
                <th className="p-2 text-left">{c.clicksCol}</th>
              </tr>
            </thead>
            <tbody>
              {topRefs.map(([host, count], idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-black/5' : ''}>
                  <td className="p-2">{host}</td>
                  <td className="p-2">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-4">
          <h3 className="m-0 mb-2 text-sm text-accent-600">{c.deviceSplit}</h3>
          <canvas ref={canvasRef} className="max-h-[200px]" />
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsDashboard() {
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
      toolSlug="analytics-dashboard"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <AnalyticsDashboardContent c={c} />
    </ToolAccessGate>
  )
}
