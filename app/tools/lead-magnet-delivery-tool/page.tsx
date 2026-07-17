"use client"

import { useState } from "react"
import type { LeadMagnetDeliveryResult } from "@/lib/leadMagnetDeliveryTool"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

const copy = {
  en: {
    title: "Lead magnet delivery tool",
    magnetTitlePlaceholder: "Magnet title",
    downloadUrlPlaceholder: "Download URL",
    fromNamePlaceholder: "From name",
    buildSequence: "Build sequence",
  },
  es: {
    title: "Herramienta de entrega de imán de leads",
    magnetTitlePlaceholder: "Título del imán",
    downloadUrlPlaceholder: "URL de descarga",
    fromNamePlaceholder: "Nombre del remitente",
    buildSequence: "Crear secuencia",
  },
}

export default function LeadMagnetDeliveryToolPage() {
  const { language } = useLanguage()
  const c = copy[language]
  const [magnetTitle, setMagnetTitle] = useState("")
  const [downloadUrl, setDownloadUrl] = useState("https://")
  const [fromName, setFromName] = useState("")
  const [result, setResult] = useState<LeadMagnetDeliveryResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/lead-magnet-delivery-tool", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ magnetTitle, downloadUrl, fromName }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">{c.title}</h1>
      <input className={inputClass} placeholder={c.magnetTitlePlaceholder} value={magnetTitle} onChange={(e) => setMagnetTitle(e.target.value)} />
      <input className={inputClass} placeholder={c.downloadUrlPlaceholder} value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} />
      <input className={inputClass} placeholder={c.fromNamePlaceholder} value={fromName} onChange={(e) => setFromName(e.target.value)} />
      <button type="button" onClick={run} disabled={loading || !magnetTitle.trim()} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        {c.buildSequence}
      </button>
      {result ? (
        <div className="text-sm space-y-2">
          <pre className="whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-2 rounded">{result.email1}</pre>
          <pre className="whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-2 rounded">{result.email2}</pre>
          <pre className="whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-2 rounded">{result.email3}</pre>
        </div>
      ) : null}
    </div>
  )
}
