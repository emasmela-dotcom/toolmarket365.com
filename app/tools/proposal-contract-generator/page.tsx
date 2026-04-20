"use client"

import { useState } from "react"
import type { ProposalContractResult } from "@/lib/proposalContractGenerator"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

export default function ProposalContractGeneratorPage() {
  const [clientName, setClientName] = useState("")
  const [projectTitle, setProjectTitle] = useState("")
  const [scopeSummary, setScopeSummary] = useState("")
  const [fee, setFee] = useState("")
  const [paymentTerms, setPaymentTerms] = useState("Net 15")
  const [termLength, setTermLength] = useState("6 weeks")
  const [result, setResult] = useState<ProposalContractResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/proposal-contract-generator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName,
        projectTitle,
        scopeSummary,
        fee,
        paymentTerms,
        termLength,
      }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">Proposal / contract generator</h1>
      <input className={inputClass} placeholder="Client" value={clientName} onChange={(e) => setClientName(e.target.value)} />
      <input className={inputClass} placeholder="Project title" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
      <textarea className={`${inputClass} min-h-[100px]`} placeholder="Scope" value={scopeSummary} onChange={(e) => setScopeSummary(e.target.value)} />
      <input className={inputClass} placeholder="Fee" value={fee} onChange={(e) => setFee(e.target.value)} />
      <input className={inputClass} placeholder="Payment terms" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
      <input className={inputClass} placeholder="Term length" value={termLength} onChange={(e) => setTermLength(e.target.value)} />
      <button type="button" onClick={run} disabled={loading} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        Generate
      </button>
      {result ? (
        <div className="text-sm space-y-2">
          <pre className="whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-3 rounded">{result.proposalMarkdown}</pre>
          <ul className="list-disc pl-5">
            {result.contractChecklist.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
