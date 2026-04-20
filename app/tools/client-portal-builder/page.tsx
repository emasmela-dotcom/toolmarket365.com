"use client"

import { useState } from "react"
import type { ClientPortalResult } from "@/lib/clientPortalBuilder"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

export default function ClientPortalBuilderPage() {
  const [clientName, setClientName] = useState("")
  const [modulesRaw, setModulesRaw] = useState("Status\nFiles\nInvoices")
  const [result, setResult] = useState<ClientPortalResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/client-portal-builder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientName, modulesRaw }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">Client portal builder</h1>
      <input className={inputClass} placeholder="Client name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
      <textarea className={`${inputClass} min-h-[100px]`} placeholder="Modules (one per line)" value={modulesRaw} onChange={(e) => setModulesRaw(e.target.value)} />
      <button type="button" onClick={run} disabled={loading} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        Outline portal
      </button>
      {result ? <pre className="text-sm whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-3 rounded">{result.outlineMarkdown}</pre> : null}
    </div>
  )
}
