"use client"

import { useState } from "react"
import type { AiEmailReplyResult } from "@/lib/aiEmailReplyAssistant"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

const copy = {
  en: {
    title: "AI email reply assistant",
    subtitle: "Three reply skeletons from pasted context (template-based).",
    goalNeutral: "Neutral",
    goalAccept: "Accept / yes",
    goalDecline: "Decline",
    goalSchedule: "Schedule call",
    button: "Suggest replies",
    labelProfessional: "Professional",
    labelBrief: "Brief",
    labelFriendly: "Friendly",
  },
  es: {
    title: "Asistente de respuesta de correo con IA",
    subtitle: "Tres borradores de respuesta a partir del contexto pegado (basado en plantillas).",
    goalNeutral: "Neutral",
    goalAccept: "Aceptar / sí",
    goalDecline: "Rechazar",
    goalSchedule: "Agendar llamada",
    button: "Sugerir respuestas",
    labelProfessional: "Profesional",
    labelBrief: "Breve",
    labelFriendly: "Amable",
  },
}

export default function AiEmailReplyAssistantPage() {
  const { language } = useLanguage()
  const t = copy[language]
  const [incomingEmail, setIncomingEmail] = useState("")
  const [yourGoal, setYourGoal] = useState<"accept" | "decline" | "schedule" | "neutral">("neutral")
  const [result, setResult] = useState<AiEmailReplyResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/ai-email-reply-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ incomingEmail, yourGoal }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">{t.title}</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">{t.subtitle}</p>
      <textarea className={`${inputClass} min-h-[160px]`} value={incomingEmail} onChange={(e) => setIncomingEmail(e.target.value)} />
      <select className={inputClass} value={yourGoal} onChange={(e) => setYourGoal(e.target.value as typeof yourGoal)}>
        <option value="neutral">{t.goalNeutral}</option>
        <option value="accept">{t.goalAccept}</option>
        <option value="decline">{t.goalDecline}</option>
        <option value="schedule">{t.goalSchedule}</option>
      </select>
      <button type="button" onClick={run} disabled={loading || !incomingEmail.trim()} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        {t.button}
      </button>
      {result ? (
        <div className="text-sm space-y-4">
          <div>
            <p className="font-semibold">{t.labelProfessional}</p>
            <pre className="whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-2 rounded">{result.professional}</pre>
          </div>
          <div>
            <p className="font-semibold">{t.labelBrief}</p>
            <pre className="whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-2 rounded">{result.brief}</pre>
          </div>
          <div>
            <p className="font-semibold">{t.labelFriendly}</p>
            <pre className="whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-2 rounded">{result.friendly}</pre>
          </div>
        </div>
      ) : null}
    </div>
  )
}
