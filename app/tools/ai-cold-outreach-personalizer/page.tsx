"use client"

import { useState } from "react"
import type { AiColdOutreachResult } from "@/lib/aiColdOutreachPersonalizer"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

const copy = {
  en: {
    title: "AI cold outreach personalizer",
    companyPlaceholder: "Company",
    rolePlaceholder: "Role / greeting name",
    valuePropPlaceholder: "Value prop (what you help with)",
    signalPlaceholder: "Signal (optional, e.g. hiring SDRs)",
    button: "Generate",
  },
  es: {
    title: "Personalizador de prospección en frío con IA",
    companyPlaceholder: "Empresa",
    rolePlaceholder: "Cargo / nombre del saludo",
    valuePropPlaceholder: "Propuesta de valor (en qué ayudas)",
    signalPlaceholder: "Señal (opcional, p. ej. contratando SDRs)",
    button: "Generar",
  },
}

export default function AiColdOutreachPersonalizerPage() {
  const { language } = useLanguage()
  const t = copy[language]
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
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">{t.title}</h1>
      <input className={inputClass} placeholder={t.companyPlaceholder} value={company} onChange={(e) => setCompany(e.target.value)} />
      <input className={inputClass} placeholder={t.rolePlaceholder} value={contactRole} onChange={(e) => setContactRole(e.target.value)} />
      <input className={inputClass} placeholder={t.valuePropPlaceholder} value={valueProp} onChange={(e) => setValueProp(e.target.value)} />
      <input className={inputClass} placeholder={t.signalPlaceholder} value={signal} onChange={(e) => setSignal(e.target.value)} />
      <button type="button" onClick={run} disabled={loading || !company.trim()} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        {t.button}
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
