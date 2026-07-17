"use client"

import { useState } from "react"
import type { TwitterThreadResult } from "@/lib/twitterThreadComposer"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

const copy = {
  en: {
    title: "Twitter / X thread composer",
    maxCharsPlaceholder: "Max chars per tweet",
    splitThread: "Split thread",
  },
  es: {
    title: "Compositor de hilos de Twitter / X",
    maxCharsPlaceholder: "Máx. caracteres por tweet",
    splitThread: "Dividir hilo",
  },
}

export default function TwitterThreadComposerPage() {
  const { language } = useLanguage()
  const c = copy[language]
  const [text, setText] = useState("")
  const [maxChars, setMaxChars] = useState("270")
  const [result, setResult] = useState<TwitterThreadResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/twitter-thread-composer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, maxChars }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">{c.title}</h1>
      <textarea className={`${inputClass} min-h-[200px]`} value={text} onChange={(e) => setText(e.target.value)} />
      <input className={inputClass} type="number" placeholder={c.maxCharsPlaceholder} value={maxChars} onChange={(e) => setMaxChars(e.target.value)} />
      <button type="button" onClick={run} disabled={loading || !text.trim()} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        {c.splitThread}
      </button>
      {result ? (
        <ol className="list-decimal pl-5 text-sm space-y-2">
          {result.tweets.map((t, i) => (
            <li key={i} className="whitespace-pre-wrap border border-mono-200 dark:border-mono-700 p-2 rounded">
              {t}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  )
}
