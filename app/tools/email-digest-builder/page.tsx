"use client"

import { useEffect, useState } from "react"
import type { EmailDigestResult } from "@/lib/emailDigestBuilder"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"

const copy = {
  en: {
    title: "Email digest builder",
    description:
      "One line per newsletter or story (title — optional link). Builds a Markdown digest you can paste into your ESP or Notion.",
    digestTitlePlaceholder: "Digest title",
    defaultDigestTitle: "Creator briefings",
    cadence: "Cadence",
    daily: "Daily",
    weekly: "Weekly",
    itemsPlaceholder: "Newsletter A — link\nStory B — notes…",
    building: "Building…",
    buildDigest: "Build digest",
    suggestedSubject: "Suggested subject:",
  },
  es: {
    title: "Constructor de resúmenes por correo",
    description:
      "Una línea por boletín o historia (título — enlace opcional). Crea un resumen en Markdown que puedes pegar en tu ESP o Notion.",
    digestTitlePlaceholder: "Título del resumen",
    defaultDigestTitle: "Briefings para creadores",
    cadence: "Cadencia",
    daily: "Diario",
    weekly: "Semanal",
    itemsPlaceholder: "Boletín A — enlace\nHistoria B — notas…",
    building: "Creando…",
    buildDigest: "Crear resumen",
    suggestedSubject: "Asunto sugerido:",
  },
}

export default function EmailDigestBuilderPage() {
  const { language } = useLanguage()
  const c = copy[language]
  const [digestTitle, setDigestTitle] = useState(copy.en.defaultDigestTitle)
  const [cadence, setCadence] = useState<"daily" | "weekly">("weekly")
  const [rawItems, setRawItems] = useState("")
  const [result, setResult] = useState<EmailDigestResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setDigestTitle((prev) => {
      if (
        prev === copy.en.defaultDigestTitle ||
        prev === copy.es.defaultDigestTitle
      ) {
        return c.defaultDigestTitle
      }
      return prev
    })
  }, [language, c.defaultDigestTitle])

  const run = async () => {
    const items = rawItems
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
    setLoading(true)
    const res = await fetch("/api/email-digest-builder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ digestTitle, cadence, items }),
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">{c.title}</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">
        {c.description}
      </p>
      <input
        className={inputClass}
        placeholder={c.digestTitlePlaceholder}
        value={digestTitle}
        onChange={(e) => setDigestTitle(e.target.value)}
      />
      <label className="block text-sm text-mono-800 dark:text-mono-200">
        {c.cadence}
        <select
          className={`${inputClass} mt-1`}
          value={cadence}
          onChange={(e) => setCadence(e.target.value as "daily" | "weekly")}
        >
          <option value="daily">{c.daily}</option>
          <option value="weekly">{c.weekly}</option>
        </select>
      </label>
      <textarea
        className={`${inputClass} min-h-[180px] font-mono text-sm`}
        placeholder={c.itemsPlaceholder}
        value={rawItems}
        onChange={(e) => setRawItems(e.target.value)}
      />
      <button
        type="button"
        onClick={run}
        disabled={loading || !rawItems.trim()}
        className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? c.building : c.buildDigest}
      </button>
      {result ? (
        <div className="space-y-3 border border-mono-200 dark:border-mono-700 rounded p-4">
          <p className="text-sm text-mono-600 dark:text-mono-400">
            <span className="font-medium text-mono-800 dark:text-mono-200">{c.suggestedSubject}</span>{" "}
            {result.subjectLine}
          </p>
          <pre className="whitespace-pre-wrap text-xs bg-mono-100 dark:bg-mono-900 text-mono-900 dark:text-mono-100 p-3 rounded overflow-x-auto">
            {result.digestMarkdown}
          </pre>
        </div>
      ) : null}
    </div>
  )
}
