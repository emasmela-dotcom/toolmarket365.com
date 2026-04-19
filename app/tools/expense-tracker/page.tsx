"use client"

import { useState } from "react"
import type { ExpenseTrackerResult } from "@/lib/expenseTracker"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

export default function ExpenseTrackerPage() {
  const [raw, setRaw] = useState("Software, 29, SaaS\nTravel, 120, Flight")
  const [result, setResult] = useState<ExpenseTrackerResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/expense-tracker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawLines: raw }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">Expense tracker</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">One line per expense: Category, amount, note</p>
      <textarea className={`${inputClass} min-h-[140px] font-mono text-sm`} value={raw} onChange={(e) => setRaw(e.target.value)} />
      <button type="button" onClick={run} disabled={loading} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        Categorize
      </button>
      {result ? (
        <div className="text-sm space-y-2">
          <p className="font-semibold">Total: {result.grandTotal.toFixed(2)}</p>
          <ul className="list-disc pl-5">
            {result.byCategory.map((r) => (
              <li key={r.category}>
                {r.category}: {r.total.toFixed(2)} ({r.count})
              </li>
            ))}
          </ul>
          <pre className="text-xs bg-mono-100 dark:bg-mono-900 p-2 rounded overflow-x-auto">{result.csv}</pre>
        </div>
      ) : null}
    </div>
  )
}
