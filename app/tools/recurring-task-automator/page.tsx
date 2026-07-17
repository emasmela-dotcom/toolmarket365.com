"use client"

import { useState } from "react"
import type { RecurringTaskResult } from "@/lib/recurringTaskAutomator"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"

const frequencyIds = ["daily", "weekdays", "weekly", "biweekly", "monthly"] as const

const copy = {
  en: {
    title: "Recurring task automator",
    description: "Smart scheduling lines and reminder snippets for calendar apps and nudges.",
    taskPlaceholder: "Task name",
    frequency: "Frequency",
    daily: "Daily",
    weekdays: "Weekdays",
    weekly: "Weekly",
    biweekly: "Biweekly",
    monthly: "Monthly",
    timePlaceholder: "Preferred time (e.g. 09:00)",
    dayPlaceholder: "Day of week (for weekly+)",
    planning: "Planning…",
    buildPlan: "Build plan",
    schedule: "Schedule",
    reminderSnippets: "Reminder snippets",
    calendarHints: "Calendar hints",
  },
  es: {
    title: "Automatizador de tareas recurrentes",
    description:
      "Líneas de programación inteligentes y fragmentos de recordatorio para apps de calendario y avisos.",
    taskPlaceholder: "Nombre de la tarea",
    frequency: "Frecuencia",
    daily: "Diaria",
    weekdays: "Días laborables",
    weekly: "Semanal",
    biweekly: "Quincenal",
    monthly: "Mensual",
    timePlaceholder: "Hora preferida (p. ej. 09:00)",
    dayPlaceholder: "Día de la semana (para semanal+)",
    planning: "Planificando…",
    buildPlan: "Crear plan",
    schedule: "Horario",
    reminderSnippets: "Fragmentos de recordatorio",
    calendarHints: "Consejos de calendario",
  },
}

export default function RecurringTaskAutomatorPage() {
  const { language } = useLanguage()
  const c = copy[language]
  const [task, setTask] = useState("")
  const [frequency, setFrequency] = useState<(typeof frequencyIds)[number]>("weekly")
  const [preferredTime, setPreferredTime] = useState("09:00")
  const [dayOfWeek, setDayOfWeek] = useState("Monday")
  const [result, setResult] = useState<RecurringTaskResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/recurring-task-automator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, frequency, preferredTime, dayOfWeek }),
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
        {c.title}
      </h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">
        {c.description}
      </p>
      <input
        className={inputClass}
        placeholder={c.taskPlaceholder}
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <label className="block text-sm text-mono-800 dark:text-mono-200">
        {c.frequency}
        <select
          className={`${inputClass} mt-1`}
          value={frequency}
          onChange={(e) =>
            setFrequency(e.target.value as (typeof frequencyIds)[number])
          }
        >
          {frequencyIds.map((id) => (
            <option key={id} value={id}>
              {c[id]}
            </option>
          ))}
        </select>
      </label>
      <input
        className={inputClass}
        placeholder={c.timePlaceholder}
        value={preferredTime}
        onChange={(e) => setPreferredTime(e.target.value)}
      />
      <input
        className={inputClass}
        placeholder={c.dayPlaceholder}
        value={dayOfWeek}
        onChange={(e) => setDayOfWeek(e.target.value)}
      />
      <button
        type="button"
        onClick={run}
        disabled={loading || !task.trim()}
        className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? c.planning : c.buildPlan}
      </button>
      {result ? (
        <div className="space-y-3 border border-mono-200 dark:border-mono-700 rounded p-4 text-sm">
          <p className="font-semibold text-mono-900 dark:text-mono-100">{result.headline}</p>
          <div>
            <p className="font-medium text-mono-800 dark:text-mono-200 mb-1">{c.schedule}</p>
            <ul className="list-disc pl-5 text-mono-700 dark:text-mono-300">
              {result.scheduleLines.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium text-mono-800 dark:text-mono-200 mb-1">{c.reminderSnippets}</p>
            <ul className="list-disc pl-5 text-mono-700 dark:text-mono-300">
              {result.reminderSnippets.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium text-mono-800 dark:text-mono-200 mb-1">{c.calendarHints}</p>
            <ul className="list-disc pl-5 text-mono-700 dark:text-mono-300">
              {result.calendarHints.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}
