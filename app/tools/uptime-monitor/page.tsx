"use client"

import { useState } from "react"
import type { UptimeMonitorResult } from "@/lib/uptimeMonitor"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"

const copy = {
  en: {
    title: "Uptime monitor",
    subtitle:
      "Plan checks, alerts, and payloads. This app does not ping your servers — use a dedicated uptime provider for real probes.",
    urlsPlaceholder: "One URL per line\nhttps://…",
    intervalPlaceholder: "Check interval (minutes)",
    building: "Building plan…",
    buildPlan: "Build monitoring plan",
    validUrls: "Valid URLs:",
    skipped: "Skipped:",
    checklist: "Checklist",
    emailAlert: "Email alert",
    slackExample: "Slack example JSON",
  },
  es: {
    title: "Monitor de uptime",
    subtitle:
      "Planifica comprobaciones, alertas y payloads. Esta app no hace ping a tus servidores — usa un proveedor de uptime dedicado para sondeos reales.",
    urlsPlaceholder: "Una URL por línea\nhttps://…",
    intervalPlaceholder: "Intervalo de comprobación (minutos)",
    building: "Creando plan…",
    buildPlan: "Crear plan de monitorización",
    validUrls: "URLs válidas:",
    skipped: "Omitidas:",
    checklist: "Lista de comprobación",
    emailAlert: "Alerta por correo",
    slackExample: "Ejemplo JSON para Slack",
  },
}

export default function UptimeMonitorPage() {
  const { language } = useLanguage()
  const c = copy[language]
  const [urlsRaw, setUrlsRaw] = useState("https://example.com")
  const [interval, setInterval] = useState("5")
  const [result, setResult] = useState<UptimeMonitorResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    const urls = urlsRaw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
    setLoading(true)
    const res = await fetch("/api/uptime-monitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls, checkIntervalMinutes: Number(interval) || 5 }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">{c.title}</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">{c.subtitle}</p>
      <textarea
        className={`${inputClass} min-h-[120px] font-mono text-sm`}
        placeholder={c.urlsPlaceholder}
        value={urlsRaw}
        onChange={(e) => setUrlsRaw(e.target.value)}
      />
      <input
        className={inputClass}
        type="number"
        min={1}
        max={60}
        placeholder={c.intervalPlaceholder}
        value={interval}
        onChange={(e) => setInterval(e.target.value)}
      />
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded"
      >
        {loading ? c.building : c.buildPlan}
      </button>
      {result ? (
        <div className="space-y-4 text-sm border border-mono-200 dark:border-mono-700 rounded p-4">
          {result.validUrls.length ? (
            <p className="text-mono-800 dark:text-mono-200">
              <span className="font-medium">{c.validUrls}</span> {result.validUrls.join(", ")}
            </p>
          ) : null}
          {result.invalidEntries.length ? (
            <p className="text-amber-800 dark:text-amber-200">
              {c.skipped} {result.invalidEntries.join(" | ")}
            </p>
          ) : null}
          <div>
            <p className="font-semibold text-mono-900 dark:text-mono-100 mb-1">{c.checklist}</p>
            <ul className="list-disc pl-5 text-mono-700 dark:text-mono-300 space-y-1">
              {result.monitoringChecklist.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-mono-900 dark:text-mono-100 mb-1">{c.emailAlert}</p>
            <p className="text-mono-600 dark:text-mono-400">{result.downtimeAlertEmail.subject}</p>
            <pre className="whitespace-pre-wrap text-xs bg-mono-100 dark:bg-mono-900 p-2 rounded mt-1 text-mono-900 dark:text-mono-100">
              {result.downtimeAlertEmail.body}
            </pre>
          </div>
          <div>
            <p className="font-semibold text-mono-900 dark:text-mono-100 mb-1">{c.slackExample}</p>
            <pre className="whitespace-pre-wrap text-xs bg-mono-100 dark:bg-mono-900 p-2 rounded overflow-x-auto text-mono-900 dark:text-mono-100">
              {result.slackWebhookPayloadExample}
            </pre>
          </div>
        </div>
      ) : null}
    </div>
  )
}
