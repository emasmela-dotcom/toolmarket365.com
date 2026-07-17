"use client"

import { useState } from "react"
import type { TeamStandupResult } from "@/lib/teamStandupBot"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

const copy = {
  en: {
    title: "Team standup bot",
    channelPlaceholder: "Slack channel",
    timezonePlaceholder: "Timezone label",
    buildTemplates: "Build templates",
  },
  es: {
    title: "Bot de standup del equipo",
    channelPlaceholder: "Canal de Slack",
    timezonePlaceholder: "Etiqueta de zona horaria",
    buildTemplates: "Crear plantillas",
  },
}

export default function TeamStandupBotPage() {
  const { language } = useLanguage()
  const c = copy[language]
  const [channelName, setChannelName] = useState("#team-standup")
  const [timezone, setTimezone] = useState("America/New_York")
  const [result, setResult] = useState<TeamStandupResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/team-standup-bot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelName, timezone }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">{c.title}</h1>
      <input
        className={inputClass}
        placeholder={c.channelPlaceholder}
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
      />
      <input
        className={inputClass}
        placeholder={c.timezonePlaceholder}
        value={timezone}
        onChange={(e) => setTimezone(e.target.value)}
      />
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded"
      >
        {c.buildTemplates}
      </button>
      {result ? (
        <div className="text-sm space-y-3">
          <pre className="whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-2 rounded">{result.slackMessage}</pre>
          <pre className="whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-2 rounded">{result.emailTemplate}</pre>
        </div>
      ) : null}
    </div>
  )
}
