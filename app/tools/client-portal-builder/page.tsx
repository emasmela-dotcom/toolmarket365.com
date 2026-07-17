"use client"

import { useState } from "react"
import type { ClientPortalResult } from "@/lib/clientPortalBuilder"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"

const copy = {
  en: {
    title: "Client portal builder",
    clientNamePlaceholder: "Client name",
    modulesPlaceholder: "Modules (one per line)",
    outlinePortal: "Outline portal",
  },
  es: {
    title: "Constructor de portal de clientes",
    clientNamePlaceholder: "Nombre del cliente",
    modulesPlaceholder: "Módulos (uno por línea)",
    outlinePortal: "Esquematizar portal",
  },
}

export default function ClientPortalBuilderPage() {
  const { language } = useLanguage()
  const c = copy[language]
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
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">{c.title}</h1>
      <input className={inputClass} placeholder={c.clientNamePlaceholder} value={clientName} onChange={(e) => setClientName(e.target.value)} />
      <textarea className={`${inputClass} min-h-[100px]`} placeholder={c.modulesPlaceholder} value={modulesRaw} onChange={(e) => setModulesRaw(e.target.value)} />
      <button type="button" onClick={run} disabled={loading} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        {c.outlinePortal}
      </button>
      {result ? <pre className="text-sm whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-3 rounded">{result.outlineMarkdown}</pre> : null}
    </div>
  )
}
