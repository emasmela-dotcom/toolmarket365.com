"use client"

import { useState } from "react"
import type { SubscriptionTrackerResult } from "@/lib/subscriptionTracker"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

const copy = {
  en: {
    title: "Subscription tracker",
    description: "Lines: Service, price, monthly or yearly",
    summarize: "Summarize burn",
    monthlyEq: "Monthly eq.",
    yearly: "Yearly",
  },
  es: {
    title: "Rastreador de suscripciones",
    description: "Líneas: Servicio, precio, mensual o anual",
    summarize: "Resumir gasto",
    monthlyEq: "Equiv. mensual",
    yearly: "Anual",
  },
}

export default function SubscriptionTrackerPage() {
  const { language } = useLanguage()
  const c = copy[language]
  const [raw, setRaw] = useState("Notion, 10, monthly\nFigma, 15, monthly\nAWS, 120, yearly")
  const [result, setResult] = useState<SubscriptionTrackerResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/subscription-tracker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawLines: raw }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">{c.title}</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">{c.description}</p>
      <textarea className={`${inputClass} min-h-[120px] font-mono text-sm`} value={raw} onChange={(e) => setRaw(e.target.value)} />
      <button type="button" onClick={run} disabled={loading} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        {c.summarize}
      </button>
      {result ? (
        <div className="text-sm space-y-2">
          <p>
            {c.monthlyEq} ~{result.monthlyEquivalent.toFixed(2)} · {c.yearly} ~{result.yearlyBurn.toFixed(2)}
          </p>
          <pre className="text-xs whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-3 rounded">{result.markdownTable}</pre>
        </div>
      ) : null}
    </div>
  )
}
