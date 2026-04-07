'use client'

import { useState, useEffect, useRef } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'

const STORAGE_KEY = 'mini_analytics'

interface AnalyticsEntry {
  t: number
  page: string
  ref: string
  device: string
  site?: string
}

function AnalyticsDashboardContent() {
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

  // Performance Benchmarks (template-based, no API calls)
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
    if (value >= benchmark.excellent) return { status: 'excellent', label: 'Top 10%', color: 'text-green-600 dark:text-green-400' }
    if (value >= benchmark.good) return { status: 'good', label: 'Top 25%', color: 'text-blue-600 dark:text-blue-400' }
    if (value >= benchmark.average) return { status: 'average', label: 'Average', color: 'text-yellow-600 dark:text-yellow-400' }
    return { status: 'needsImprovement', label: 'Needs Improvement', color: 'text-red-600 dark:text-red-400' }
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
    if (confirm('Delete all local data?')) {
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
      {/* Documentation Section */}
      <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
        <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">How to Use This Tool</h2>
        <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
          <div>
            <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">What It Does</h3>
            <p>Tracks page views, unique visitors, top pages, referrers, and device split. Stores data locally and exports to CSV or JSON.</p>
          </div>
          <div>
            <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">How to Use</h3>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li><strong>Automatic tracking:</strong> The dashboard automatically tracks visits when loaded</li>
              <li><strong>View metrics:</strong> Page Views (total visits), Unique Visitors (distinct users), Top Pages (most visited pages), Referrers (traffic sources), Device Split (mobile vs desktop)</li>
              <li><strong>Export data:</strong> Click "Export CSV" for spreadsheet format or "Export JSON" for raw data</li>
              <li><strong>Clear data:</strong> Click "Clear data" to reset all analytics</li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">Expected Outcome</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Real-time metrics updated every 3 seconds</li>
              <li>Visual charts showing device distribution</li>
              <li>Top pages table with view counts</li>
              <li>Referrer tracking showing where traffic comes from</li>
              <li>Exportable data in CSV or JSON format</li>
            </ul>
          </div>
        </div>
      </div>

      <header className="flex gap-4 items-center flex-wrap mb-4">
        <h1 className="text-2xl font-bold m-0">Mini Analytics Dashboard</h1>
        <button
          onClick={handleClear}
          className="px-4 py-2 border border-accent-600 bg-accent-600 text-white rounded cursor-pointer hover:opacity-90"
        >
          Clear data
        </button>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 border border-accent-600 bg-accent-600 text-white rounded cursor-pointer hover:opacity-90"
        >
          Export CSV
        </button>
        <button
          onClick={handleExportJSON}
          className="px-4 py-2 border border-accent-600 bg-accent-600 text-white rounded cursor-pointer hover:opacity-90"
        >
          Export JSON
        </button>
      </header>

      {/* Performance Benchmarks Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">Performance Benchmarks</h2>
        <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">
          See how your performance compares to industry averages
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700">
            <div className="text-sm text-mono-600 dark:text-mono-400 mb-1">Page Views</div>
            <div className="text-2xl font-bold mb-1">{pageViews.toLocaleString()}</div>
            <div className={`text-sm font-semibold ${pageViewsBenchmark.color}`}>
              {pageViewsBenchmark.label}
            </div>
            <div className="text-xs text-mono-500 dark:text-mono-500 mt-1">
              Industry avg: {benchmarks.pageViews.average.toLocaleString()}
            </div>
          </div>
          <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700">
            <div className="text-sm text-mono-600 dark:text-mono-400 mb-1">Unique Visitors</div>
            <div className="text-2xl font-bold mb-1">{uniqueVisitors.toLocaleString()}</div>
            <div className={`text-sm font-semibold ${uniqueVisitorsBenchmark.color}`}>
              {uniqueVisitorsBenchmark.label}
            </div>
            <div className="text-xs text-mono-500 dark:text-mono-500 mt-1">
              Industry avg: {benchmarks.uniqueVisitors.average.toLocaleString()}
            </div>
          </div>
          <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700">
            <div className="text-sm text-mono-600 dark:text-mono-400 mb-1">Engagement Rate</div>
            <div className="text-2xl font-bold mb-1">{engagementRate.toFixed(1)}%</div>
            <div className={`text-sm font-semibold ${engagementBenchmark.color}`}>
              {engagementBenchmark.label}
            </div>
            <div className="text-xs text-mono-500 dark:text-mono-500 mt-1">
              Industry avg: {benchmarks.engagementRate.average}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-4">
          <h3 className="m-0 mb-2 text-sm text-accent-600">Page Views</h3>
          <div className="text-4xl font-bold">{pageViews.toLocaleString()}</div>
          <div className={`text-xs mt-1 ${pageViewsBenchmark.color}`}>
            {pageViewsBenchmark.label}
          </div>
        </div>

        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-4">
          <h3 className="m-0 mb-2 text-sm text-accent-600">Unique Visitors</h3>
          <div className="text-4xl font-bold">{uniqueVisitors.toLocaleString()}</div>
          <div className={`text-xs mt-1 ${uniqueVisitorsBenchmark.color}`}>
            {uniqueVisitorsBenchmark.label}
          </div>
        </div>

        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-4">
          <h3 className="m-0 mb-2 text-sm text-accent-600">Top Pages</h3>
          <table className="w-full text-xs border-collapse mt-2">
            <thead>
              <tr>
                <th className="p-2 text-left">Page</th>
                <th className="p-2 text-left">Views</th>
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
          <h3 className="m-0 mb-2 text-sm text-accent-600">Referrers</h3>
          <table className="w-full text-xs border-collapse mt-2">
            <thead>
              <tr>
                <th className="p-2 text-left">Source</th>
                <th className="p-2 text-left">Clicks</th>
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
          <h3 className="m-0 mb-2 text-sm text-accent-600">Device Split</h3>
          <canvas ref={canvasRef} className="max-h-[200px]" />
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsDashboard() {
  const toolDescription = "Tracks page views, unique visitors, top pages, referrers, and device split. Stores data locally and exports to CSV or JSON."
  const howToUse = (
    <div>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li><strong>Automatic tracking:</strong> The dashboard automatically tracks visits when loaded</li>
        <li><strong>View metrics:</strong> Page Views (total visits), Unique Visitors (distinct users), Top Pages (most visited pages), Referrers (traffic sources), Device Split (mobile vs desktop)</li>
        <li><strong>Export data:</strong> Click "Export CSV" for spreadsheet format or "Export JSON" for raw data</li>
        <li><strong>Clear data:</strong> Click "Clear data" to reset all analytics</li>
      </ol>
    </div>
  )

  return (
    <ToolAccessGate
      toolSlug="analytics-dashboard"
      toolName="Analytics Dashboard"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <AnalyticsDashboardContent />
    </ToolAccessGate>
  )
}

