"use client"

import { useState } from "react"
import type { LinkInBioLandingResult } from "@/lib/linkInBioLandingBuilder"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

export default function LinkInBioLandingBuilderPage() {
  const [headline, setHeadline] = useState("My links")
  const [rows, setRows] = useState("Shop, https://example.com\nYouTube, https://youtube.com")
  const [accentColor, setAccentColor] = useState("#3b82f6")
  const [result, setResult] = useState<LinkInBioLandingResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    const links = rows.split(/\r?\n/).map((line) => {
      const [label, url] = line.split(",").map((s) => s.trim())
      return { label: label || "", url: url || "" }
    }).filter((l) => l.label && l.url)
    setLoading(true)
    const res = await fetch("/api/link-in-bio-landing-builder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ headline, links, accentColor }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">Link-in-bio builder</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">Lines: label, url</p>
      <input className={inputClass} value={headline} onChange={(e) => setHeadline(e.target.value)} />
      <textarea className={`${inputClass} min-h-[120px] font-mono text-sm`} value={rows} onChange={(e) => setRows(e.target.value)} />
      <input className={inputClass} placeholder="#hex accent" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
      <button type="button" onClick={run} disabled={loading} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        Build
      </button>
      {result ? (
        <div className="space-y-3 text-sm">
          <pre className="whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-2 rounded">{result.markdown}</pre>
          <pre className="text-xs overflow-x-auto bg-white text-black p-2 rounded border">{result.htmlFragment}</pre>
        </div>
      ) : null}
    </div>
  )
}
