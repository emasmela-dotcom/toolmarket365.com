"use client"

import { useState } from "react"
import type { AiImageAltResult } from "@/lib/aiImageAltGenerator"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

export default function AiImageAltGeneratorPage() {
  const [context, setContext] = useState("")
  const [pageTopic, setPageTopic] = useState("")
  const [result, setResult] = useState<AiImageAltResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/ai-image-alt-generator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context, pageTopic }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">AI image alt-text generator</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">Accessibility-focused alt variants from context you provide.</p>
      <textarea className={`${inputClass} min-h-[80px]`} placeholder="What’s in the image?" value={context} onChange={(e) => setContext(e.target.value)} />
      <input className={inputClass} placeholder="Page topic (optional)" value={pageTopic} onChange={(e) => setPageTopic(e.target.value)} />
      <button type="button" onClick={run} disabled={loading || !context.trim()} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        Generate
      </button>
      {result ? (
        <ul className="list-disc pl-5 text-sm space-y-1">
          {result.variants.map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
