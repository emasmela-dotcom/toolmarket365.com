"use client"

import { useState } from "react"
import type { ProposalContractResult } from "@/lib/proposalContractGenerator"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"

const copy = {
  en: {
    title: "Proposal / contract generator",
    clientPlaceholder: "Client",
    projectTitlePlaceholder: "Project title",
    scopePlaceholder: "Scope",
    feePlaceholder: "Fee",
    paymentTermsPlaceholder: "Payment terms",
    termLengthPlaceholder: "Term length",
    generate: "Generate",
  },
  es: {
    title: "Generador de propuestas / contratos",
    clientPlaceholder: "Cliente",
    projectTitlePlaceholder: "Título del proyecto",
    scopePlaceholder: "Alcance",
    feePlaceholder: "Tarifa",
    paymentTermsPlaceholder: "Condiciones de pago",
    termLengthPlaceholder: "Duración del plazo",
    generate: "Generar",
  },
}

export default function ProposalContractGeneratorPage() {
  const { language } = useLanguage()
  const c = copy[language]
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
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">{c.title}</h1>
      <input className={inputClass} placeholder={c.clientPlaceholder} value={clientName} onChange={(e) => setClientName(e.target.value)} />
      <input className={inputClass} placeholder={c.projectTitlePlaceholder} value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
      <textarea className={`${inputClass} min-h-[100px]`} placeholder={c.scopePlaceholder} value={scopeSummary} onChange={(e) => setScopeSummary(e.target.value)} />
      <input className={inputClass} placeholder={c.feePlaceholder} value={fee} onChange={(e) => setFee(e.target.value)} />
      <input className={inputClass} placeholder={c.paymentTermsPlaceholder} value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
      <input className={inputClass} placeholder={c.termLengthPlaceholder} value={termLength} onChange={(e) => setTermLength(e.target.value)} />
      <button type="button" onClick={run} disabled={loading} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        {c.generate}
      </button>
      {result ? (
        <div className="text-sm space-y-2">
          <pre className="whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-3 rounded text-mono-950 dark:text-mono-50">{result.proposalMarkdown}</pre>
          <ul className="list-disc pl-5 text-mono-700 dark:text-mono-300">
            {result.contractChecklist.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
