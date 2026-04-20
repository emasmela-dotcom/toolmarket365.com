"use client"

import { useState } from "react"
import type { InvoiceResult } from "@/lib/invoiceGenerator"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

export default function InvoiceGeneratorPage() {
  const [clientName, setClientName] = useState("")
  const [yourBusinessName, setYourBusinessName] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001")
  const [dueDate, setDueDate] = useState("")
  const [linesRaw, setLinesRaw] = useState("Design sprint, 1500\nRetainer, 500")
  const [taxPercent, setTaxPercent] = useState("0")
  const [result, setResult] = useState<InvoiceResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    const lines = linesRaw.split(/\r?\n/).map((line) => {
      const [description, amt] = line.split(",").map((s) => s.trim())
      return { description: description || "Item", amount: Number(amt) || 0 }
    }).filter((l) => l.amount > 0 || l.description)
    setLoading(true)
    const res = await fetch("/api/invoice-generator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName,
        yourBusinessName,
        invoiceNumber,
        dueDate: dueDate || new Date().toISOString().slice(0, 10),
        lines,
        taxPercent,
      }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">Invoice generator</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">Freelancer invoice as Markdown. Lines: description, amount</p>
      <input className={inputClass} placeholder="Client name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
      <input className={inputClass} placeholder="Your business name" value={yourBusinessName} onChange={(e) => setYourBusinessName(e.target.value)} />
      <input className={inputClass} placeholder="Invoice #" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
      <input className={inputClass} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <textarea className={`${inputClass} min-h-[100px] font-mono text-sm`} value={linesRaw} onChange={(e) => setLinesRaw(e.target.value)} />
      <input className={inputClass} type="number" placeholder="Tax %" value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} />
      <button type="button" onClick={run} disabled={loading} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        {loading ? "…" : "Generate"}
      </button>
      {result ? <pre className="text-xs whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-4 rounded">{result.markdown}</pre> : null}
    </div>
  )
}
