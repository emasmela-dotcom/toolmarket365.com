"use client"

import { useState } from "react"
import type { FocusSessionResult } from "@/lib/focusTimerAnalytics"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"

const copy = {
  en: {
    title: "Focus timer with analytics",
    subtitle:
      "Log what you actually did today (pomodoros, focus minutes, breaks, interruptions). Get a simple productivity score and next-session goal.",
    pomodorosPlaceholder: "Pomodoros completed",
    focusMinutesPlaceholder: "Total focus minutes",
    breakMinutesPlaceholder: "Break minutes",
    interruptionsPlaceholder: "Interruptions",
    analyzing: "Analyzing…",
    analyze: "Analyze",
    score: (n: number) => `Score: ${n} / 100`,
  },
  es: {
    title: "Temporizador de enfoque con analíticas",
    subtitle:
      "Registra lo que hiciste hoy (pomodoros, minutos de enfoque, descansos, interrupciones). Obtén una puntuación de productividad y una meta para la próxima sesión.",
    pomodorosPlaceholder: "Pomodoros completados",
    focusMinutesPlaceholder: "Minutos totales de enfoque",
    breakMinutesPlaceholder: "Minutos de descanso",
    interruptionsPlaceholder: "Interrupciones",
    analyzing: "Analizando…",
    analyze: "Analizar",
    score: (n: number) => `Puntuación: ${n} / 100`,
  },
}

export default function FocusTimerAnalyticsPage() {
  const { language } = useLanguage()
  const c = copy[language]
  const [pomodorosCompleted, setPomodorosCompleted] = useState("4")
  const [totalFocusMinutes, setTotalFocusMinutes] = useState("100")
  const [breakMinutes, setBreakMinutes] = useState("25")
  const [interruptions, setInterruptions] = useState("2")
  const [result, setResult] = useState<FocusSessionResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/focus-timer-analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pomodorosCompleted,
        totalFocusMinutes,
        breakMinutes,
        interruptions,
      }),
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
        {c.subtitle}
      </p>
      <input
        className={inputClass}
        type="number"
        min={0}
        placeholder={c.pomodorosPlaceholder}
        value={pomodorosCompleted}
        onChange={(e) => setPomodorosCompleted(e.target.value)}
      />
      <input
        className={inputClass}
        type="number"
        min={0}
        placeholder={c.focusMinutesPlaceholder}
        value={totalFocusMinutes}
        onChange={(e) => setTotalFocusMinutes(e.target.value)}
      />
      <input
        className={inputClass}
        type="number"
        min={0}
        placeholder={c.breakMinutesPlaceholder}
        value={breakMinutes}
        onChange={(e) => setBreakMinutes(e.target.value)}
      />
      <input
        className={inputClass}
        type="number"
        min={0}
        placeholder={c.interruptionsPlaceholder}
        value={interruptions}
        onChange={(e) => setInterruptions(e.target.value)}
      />
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded"
      >
        {loading ? c.analyzing : c.analyze}
      </button>
      {result ? (
        <div className="border border-mono-200 dark:border-mono-700 rounded p-4 space-y-3">
          <p className="text-lg font-semibold text-mono-900 dark:text-mono-100">
            {c.score(result.productivityScore)}
          </p>
          <ul className="list-disc pl-5 text-sm text-mono-700 dark:text-mono-300">
            {result.insights.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
          <p className="text-sm font-medium text-mono-800 dark:text-mono-200">{result.nextGoal}</p>
        </div>
      ) : null}
    </div>
  )
}
