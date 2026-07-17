"use client"

import { useState } from "react"
import type { MarketingSocialSchedulerResult } from "@/lib/marketingSocialScheduler"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

const copy = {
  en: {
    title: "Social media scheduler",
    description: "Weekly slot plan — import into your real scheduler app.",
    platformsPlaceholder: "Platforms (comma-separated)",
    postsPerWeekPlaceholder: "Posts per week",
    bestTimesPlaceholder: "Best times hint",
    buildPlan: "Build plan",
  },
  es: {
    title: "Programador de redes sociales",
    description: "Plan semanal de franjas — impórtalo en tu app de programación real.",
    platformsPlaceholder: "Plataformas (separadas por comas)",
    postsPerWeekPlaceholder: "Publicaciones por semana",
    bestTimesPlaceholder: "Pista de mejores horarios",
    buildPlan: "Crear plan",
  },
}

export default function MarketingSocialSchedulerPage() {
  const { language } = useLanguage()
  const c = copy[language]
  const [platformsRaw, setPlatformsRaw] = useState("LinkedIn, X, Instagram")
  const [postsPerWeek, setPostsPerWeek] = useState("7")
  const [bestTimesHint, setBestTimesHint] = useState("")
  const [result, setResult] = useState<MarketingSocialSchedulerResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/marketing-social-scheduler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platformsRaw, postsPerWeek, bestTimesHint }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">{c.title}</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">{c.description}</p>
      <input className={inputClass} placeholder={c.platformsPlaceholder} value={platformsRaw} onChange={(e) => setPlatformsRaw(e.target.value)} />
      <input className={inputClass} type="number" placeholder={c.postsPerWeekPlaceholder} value={postsPerWeek} onChange={(e) => setPostsPerWeek(e.target.value)} />
      <input className={inputClass} placeholder={c.bestTimesPlaceholder} value={bestTimesHint} onChange={(e) => setBestTimesHint(e.target.value)} />
      <button type="button" onClick={run} disabled={loading} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        {c.buildPlan}
      </button>
      {result ? (
        <div className="text-sm space-y-2">
          <pre className="whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-3 rounded">{result.weeklyPlanMarkdown}</pre>
          <ul className="list-disc pl-5">
            {result.checklist.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
