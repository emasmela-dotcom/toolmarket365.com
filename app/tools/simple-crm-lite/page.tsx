"use client"

import { useState } from "react"
import type { SimpleCrmResult } from "@/lib/simpleCrmLite"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

export default function SimpleCrmLitePage() {
  const [rawRows, setRawRows] = useState("Acme Co, jane@acme.com, lead\nBeta LLC, tom@beta.com, won")
  const [result, setResult] = useState<SimpleCrmResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/simple-crm-lite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawRows }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">Simple CRM</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">TSV/CSV rows: name, email, stage</p>
      <textarea className={`${inputClass} min-h-[140px] font-mono text-sm`} value={rawRows} onChange={(e) => setRawRows(e.target.value)} />
      <button type="button" onClick={run} disabled={loading} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        Summarize pipeline
      </button>
      {result ? (
        <div className="text-sm space-y-2">
          <p>Total rows: {result.total}</p>
          {result.byStage.map((s) => (
            <div key={s.stage} className="border border-mono-200 dark:border-mono-700 rounded p-2">
              <p className="font-semibold">
                {s.stage} ({s.count})
              </p>
              <p>{s.contacts.join(", ")}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
