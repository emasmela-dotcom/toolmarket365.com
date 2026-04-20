"use client"

import { useState } from "react"
import type { FeedbackWidgetResult } from "@/lib/feedbackWidgetGenerator"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

export default function FeedbackWidgetGeneratorPage() {
  const [projectTitle, setProjectTitle] = useState("Feedback")
  const [webhookUrl, setWebhookUrl] = useState("https://")
  const [result, setResult] = useState<FeedbackWidgetResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/feedback-widget-generator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectTitle, webhookUrl }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">Feedback widget</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">Starter embed + your webhook (wire server-side validation yourself).</p>
      <input className={inputClass} value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
      <input className={inputClass} value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} />
      <button type="button" onClick={run} disabled={loading} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        Generate embed
      </button>
      {result ? (
        <div className="text-sm space-y-2">
          <pre className="text-xs overflow-x-auto bg-mono-100 dark:bg-mono-900 p-2 rounded whitespace-pre-wrap">{result.htmlEmbed}</pre>
          <ul className="list-disc pl-5">
            {result.setupNotes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
