"use client"

import { useState } from "react"
import type { AiBlogPostResult } from "@/lib/aiBlogPostWriter"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

export default function AiBlogPostWriterPage() {
  const [topic, setTopic] = useState("")
  const [audience, setAudience] = useState("founders")
  const [keywords, setKeywords] = useState("")
  const [tone, setTone] = useState<"professional" | "friendly" | "technical">("professional")
  const [result, setResult] = useState<AiBlogPostResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/ai-blog-post-writer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, audience, keywords, tone }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">AI blog post writer</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">SEO-structured draft from templates (no live LLM).</p>
      <input className={inputClass} placeholder="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
      <input className={inputClass} placeholder="Audience" value={audience} onChange={(e) => setAudience(e.target.value)} />
      <input className={inputClass} placeholder="Keywords (comma-separated)" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
      <select className={inputClass} value={tone} onChange={(e) => setTone(e.target.value as typeof tone)}>
        <option value="professional">Professional</option>
        <option value="friendly">Friendly</option>
        <option value="technical">Technical</option>
      </select>
      <button type="button" onClick={run} disabled={loading || !topic.trim()} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        Draft
      </button>
      {result ? (
        <div className="text-sm space-y-3 border border-mono-200 dark:border-mono-700 rounded p-4">
          <p className="font-bold">{result.title}</p>
          <p className="text-mono-600 dark:text-mono-400">{result.metaDescription}</p>
          {result.sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-semibold">{s.heading}</h2>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
