"use client"

import { useState } from "react"
import type { AiProductDescriptionResult } from "@/lib/aiProductDescriptionWriter"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

export default function AiProductDescriptionWriterPage() {
  const [productName, setProductName] = useState("")
  const [featureBullets, setFeatureBullets] = useState("")
  const [audience, setAudience] = useState("e-commerce shoppers")
  const [result, setResult] = useState<AiProductDescriptionResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/ai-product-description-writer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productName, featureBullets, audience }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">AI product description writer</h1>
      <input className={inputClass} placeholder="Product name" value={productName} onChange={(e) => setProductName(e.target.value)} />
      <textarea className={`${inputClass} min-h-[100px]`} placeholder="Features (one per line)" value={featureBullets} onChange={(e) => setFeatureBullets(e.target.value)} />
      <input className={inputClass} placeholder="Audience" value={audience} onChange={(e) => setAudience(e.target.value)} />
      <button type="button" onClick={run} disabled={loading || !productName.trim()} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        Write
      </button>
      {result ? (
        <div className="text-sm space-y-2 border border-mono-200 dark:border-mono-700 rounded p-4">
          <p className="font-bold">{result.title}</p>
          <p>{result.short}</p>
          <pre className="whitespace-pre-wrap">{result.long}</pre>
        </div>
      ) : null}
    </div>
  )
}
