"use client"

import { useState } from "react"
import type { RecurringTaskResult } from "@/lib/recurringTaskAutomator"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"

const frequencies = [
  { id: "daily", label: "Daily" },
  { id: "weekdays", label: "Weekdays" },
  { id: "weekly", label: "Weekly" },
  { id: "biweekly", label: "Biweekly" },
  { id: "monthly", label: "Monthly" },
] as const

export default function RecurringTaskAutomatorPage() {
  const [task, setTask] = useState("")
  const [frequency, setFrequency] = useState<(typeof frequencies)[number]["id"]>("weekly")
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
        Recurring task automator
      </h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">
        Smart scheduling lines and reminder snippets for calendar apps and nudges.
      </p>
      <input
        className={inputClass}
        placeholder="Task name"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <label className="block text-sm text-mono-800 dark:text-mono-200">
        Frequency
        <select
          className={`${inputClass} mt-1`}
          value={frequency}
          onChange={(e) =>
            setFrequency(e.target.value as (typeof frequencies)[number]["id"])
          }
        >
          {frequencies.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </label>
      <input
        className={inputClass}
        placeholder="Preferred time (e.g. 09:00)"
        value={preferredTime}
        onChange={(e) => setPreferredTime(e.target.value)}
      />
      <input
        className={inputClass}
        placeholder="Day of week (for weekly+)"
        value={dayOfWeek}
        onChange={(e) => setDayOfWeek(e.target.value)}
      />
      <button
        type="button"
        onClick={run}
        disabled={loading || !task.trim()}
        className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Planning…" : "Build plan"}
      </button>
      {result ? (
        <div className="space-y-3 border border-mono-200 dark:border-mono-700 rounded p-4 text-sm">
          <p className="font-semibold text-mono-900 dark:text-mono-100">{result.headline}</p>
          <div>
            <p className="font-medium text-mono-800 dark:text-mono-200 mb-1">Schedule</p>
            <ul className="list-disc pl-5 text-mono-700 dark:text-mono-300">
              {result.scheduleLines.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium text-mono-800 dark:text-mono-200 mb-1">Reminder snippets</p>
            <ul className="list-disc pl-5 text-mono-700 dark:text-mono-300">
              {result.reminderSnippets.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium text-mono-800 dark:text-mono-200 mb-1">Calendar hints</p>
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
