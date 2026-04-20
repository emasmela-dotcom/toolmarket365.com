"use client"

import { useState } from "react"
import type { AiColdOutreachResult } from "@/lib/aiColdOutreachPersonalizer"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

export default function AiColdOutreachPersonalizerPage() {
  const [company, setCompany] = useState("")
  const [contactRole, setContactRole] = useState("there")
  const [valueProp, setValueProp] = useState("")
  const [signal, setSignal] = useState("")
  const [result, setResult] = useState<AiColdOutreachResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/ai-cold-outreach-personalizer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, contactRole, valueProp, signal }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">AI cold outreach personalizer</h1>
      <input className={inputClass} placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
      <input className={inputClass} placeholder="Role / greeting name" value={contactRole} onChange={(e) => setContactRole(e.target.value)} />
      <input className={inputClass} placeholder="Value prop (what you help with)" value={valueProp} onChange={(e) => setValueProp(e.target.value)} />
      <input className={inputClass} placeholder="Signal (optional, e.g. hiring SDRs)" value={signal} onChange={(e) => setSignal(e.target.value)} />
      <button type="button" onClick={run} disabled={loading || !company.trim()} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        Generate
      </button>
      {result ? (
        <ul className="text-sm space-y-3">
          {result.pairs.map((p, i) => (
            <li key={i} className="border border-mono-200 dark:border-mono-700 rounded p-3">
              <p className="font-semibold">{p.subject}</p>
              <p>{p.opener}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
