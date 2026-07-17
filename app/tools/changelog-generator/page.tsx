"use client"

import { useState } from "react"
import type { ChangelogResult } from "@/lib/changelogGenerator"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"

const copy = {
  en: {
    title: "Changelog generator",
    description:
      "Paste GitHub commit subjects (or any lines); get a grouped Markdown changelog draft.",
    versionPlaceholder: "Version",
    generating: "Generating…",
    generateChangelog: "Generate changelog",
  },
  es: {
    title: "Generador de changelog",
    description:
      "Pega asuntos de commits de GitHub (o cualquier línea); obtén un borrador de changelog en Markdown agrupado.",
    versionPlaceholder: "Versión",
    generating: "Generando…",
    generateChangelog: "Generar changelog",
  },
}

export default function ChangelogGeneratorPage() {
  const { language } = useLanguage()
  const c = copy[language]
  const [version, setVersion] = useState("1.4.0")
  const [commitsText, setCommitsText] = useState(
    "feat: add digest builder\nfix: tooltip z-index on mobile\nchore: bump deps"
  )
  const [result, setResult] = useState<ChangelogResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/changelog-generator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ version, commitsText }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">{c.title}</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">{c.description}</p>
      <input className={inputClass} placeholder={c.versionPlaceholder} value={version} onChange={(e) => setVersion(e.target.value)} />
      <textarea
        className={`${inputClass} min-h-[180px] font-mono text-sm`}
        value={commitsText}
        onChange={(e) => setCommitsText(e.target.value)}
      />
      <button
        type="button"
        onClick={run}
        disabled={loading || !commitsText.trim()}
        className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? c.generating : c.generateChangelog}
      </button>
      {result ? (
        <pre className="whitespace-pre-wrap text-xs bg-mono-100 dark:bg-mono-900 text-mono-900 dark:text-mono-100 p-4 rounded border border-mono-200 dark:border-mono-700 overflow-x-auto">
          {result.markdown}
        </pre>
      ) : null}
    </div>
  )
}
