"use client"

import { useState } from "react"
import type { ReviewRequestResult } from "@/lib/reviewRequestAutomator"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

export default function ReviewRequestAutomatorPage() {
  const [brandName, setBrandName] = useState("")
  const [productName, setProductName] = useState("")
  const [reviewLink, setReviewLink] = useState("https://")
  const [result, setResult] = useState<ReviewRequestResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/review-request-automator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandName, productName, reviewLink }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">Review request automator</h1>
      <input className={inputClass} placeholder="Brand" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
      <input className={inputClass} placeholder="Product" value={productName} onChange={(e) => setProductName(e.target.value)} />
      <input className={inputClass} placeholder="Review URL" value={reviewLink} onChange={(e) => setReviewLink(e.target.value)} />
      <button type="button" onClick={run} disabled={loading} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        Build copy
      </button>
      {result ? (
        <div className="text-sm space-y-3">
          <pre className="whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-2 rounded">{result.emailDay3}</pre>
          <pre className="whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-2 rounded">{result.emailDay10}</pre>
          <p>{result.smsShort}</p>
        </div>
      ) : null}
    </div>
  )
}
