"use client"

import { useState } from "react"
import type { GaSimplifyResult } from "@/lib/googleAnalyticsSimplifier"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"

const copy = {
  en: {
    title: "Google Analytics simplifier",
    description:
      "Paste headline numbers from GA4 — get plain-English KPI blurbs for stakeholders.",
    sessions: "Sessions",
    users: "Users",
    bounceRate: "Bounce rate %",
    avgSession: "Avg session (seconds)",
    conversions: "Conversions (optional)",
    simplify: "Simplify",
    simplifying: "Simplifying…",
    doNext: "Do next in GA4",
  },
  es: {
    title: "Simplificador de Google Analytics",
    description:
      "Pega los números principales de GA4 — obtén resúmenes de KPI en lenguaje claro para interesados.",
    sessions: "Sesiones",
    users: "Usuarios",
    bounceRate: "Tasa de rebote %",
    avgSession: "Sesión media (segundos)",
    conversions: "Conversiones (opcional)",
    simplify: "Simplificar",
    simplifying: "Simplificando…",
    doNext: "Qué hacer después en GA4",
  },
}

export default function GoogleAnalyticsSimplifierPage() {
  const { language } = useLanguage()
  const c = copy[language]
  const [sessions, setSessions] = useState("1200")
  const [users, setUsers] = useState("980")
  const [bounceRatePct, setBounceRatePct] = useState("52")
  const [avgSessionSeconds, setAvgSessionSeconds] = useState("95")
  const [conversions, setConversions] = useState("")
  const [result, setResult] = useState<GaSimplifyResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/google-analytics-simplifier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessions,
        users,
        bounceRatePct,
        avgSessionSeconds,
        conversions: conversions || undefined,
      }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
        {c.title}
      </h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">
        {c.description}
      </p>
      <input className={inputClass} type="number" placeholder={c.sessions} value={sessions} onChange={(e) => setSessions(e.target.value)} />
      <input className={inputClass} type="number" placeholder={c.users} value={users} onChange={(e) => setUsers(e.target.value)} />
      <input
        className={inputClass}
        type="number"
        placeholder={c.bounceRate}
        value={bounceRatePct}
        onChange={(e) => setBounceRatePct(e.target.value)}
      />
      <input
        className={inputClass}
        type="number"
        placeholder={c.avgSession}
        value={avgSessionSeconds}
        onChange={(e) => setAvgSessionSeconds(e.target.value)}
      />
      <input
        className={inputClass}
        type="number"
        placeholder={c.conversions}
        value={conversions}
        onChange={(e) => setConversions(e.target.value)}
      />
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded"
      >
        {loading ? c.simplifying : c.simplify}
      </button>
      {result ? (
        <div className="border border-mono-200 dark:border-mono-700 rounded p-4 space-y-3 text-sm">
          <p className="font-semibold text-mono-900 dark:text-mono-100">{result.headline}</p>
          {result.kpis.map((k, i) => (
            <div key={i} className="border-t border-mono-200 dark:border-mono-700 pt-2 first:border-t-0 first:pt-0">
              <p className="font-medium text-mono-800 dark:text-mono-200">
                {k.label}: <span className="text-accent-600 dark:text-accent-400">{k.value}</span>
              </p>
              <p className="text-mono-600 dark:text-mono-400">{k.plainEnglish}</p>
            </div>
          ))}
          <div>
            <p className="font-medium text-mono-800 dark:text-mono-200 mb-1">{c.doNext}</p>
            <ul className="list-disc pl-5 text-mono-700 dark:text-mono-300">
              {result.watchNext.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}
