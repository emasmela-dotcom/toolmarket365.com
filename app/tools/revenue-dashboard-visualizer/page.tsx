"use client"

import { useState } from "react"
import type { RevenueDashboardResult } from "@/lib/revenueDashboardVisualizer"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

export default function RevenueDashboardVisualizerPage() {
  const [mrr, setMrr] = useState("5000")
  const [lastMonthRevenue, setLastMonthRevenue] = useState("4800")
  const [growthPercentMoM, setGrowthPercentMoM] = useState("")
  const [churnPercent, setChurnPercent] = useState("3")
  const [processor, setProcessor] = useState<"stripe" | "paddle" | "other">("stripe")
  const [result, setResult] = useState<RevenueDashboardResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/revenue-dashboard-visualizer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mrr, lastMonthRevenue, growthPercentMoM, churnPercent, processor }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">Revenue dashboard</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">Stripe/Paddle-style MRR narrative from numbers you enter (no API).</p>
      <input className={inputClass} type="number" placeholder="MRR" value={mrr} onChange={(e) => setMrr(e.target.value)} />
      <input className={inputClass} type="number" placeholder="Last month revenue" value={lastMonthRevenue} onChange={(e) => setLastMonthRevenue(e.target.value)} />
      <input className={inputClass} type="number" placeholder="Growth % MoM (optional)" value={growthPercentMoM} onChange={(e) => setGrowthPercentMoM(e.target.value)} />
      <input className={inputClass} type="number" placeholder="Churn %" value={churnPercent} onChange={(e) => setChurnPercent(e.target.value)} />
      <select className={inputClass} value={processor} onChange={(e) => setProcessor(e.target.value as typeof processor)}>
        <option value="stripe">Stripe</option>
        <option value="paddle">Paddle</option>
        <option value="other">Other</option>
      </select>
      <button type="button" onClick={run} disabled={loading} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        Visualize
      </button>
      {result ? (
        <div className="text-sm space-y-2 border border-mono-200 dark:border-mono-700 rounded p-4">
          <p className="font-semibold">{result.headline}</p>
          <ul className="list-disc pl-5 text-mono-700 dark:text-mono-300">
            {result.bullets.map((b, i) => (
              <li key={i}>{b.replace(/\*\*/g, "")}</li>
            ))}
          </ul>
          <p>{result.chartCaption}</p>
          <ul className="list-disc pl-5">
            {result.paddleStripeNotes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
