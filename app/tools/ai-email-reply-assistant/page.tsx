"use client"

import { useState } from "react"
import type { AiEmailReplyResult } from "@/lib/aiEmailReplyAssistant"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"

export default function AiEmailReplyAssistantPage() {
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
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">AI email reply assistant</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">Three reply skeletons from pasted context (template-based).</p>
      <textarea className={`${inputClass} min-h-[160px]`} value={incomingEmail} onChange={(e) => setIncomingEmail(e.target.value)} />
      <select className={inputClass} value={yourGoal} onChange={(e) => setYourGoal(e.target.value as typeof yourGoal)}>
        <option value="neutral">Neutral</option>
        <option value="accept">Accept / yes</option>
        <option value="decline">Decline</option>
        <option value="schedule">Schedule call</option>
      </select>
      <button type="button" onClick={run} disabled={loading || !incomingEmail.trim()} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        Suggest replies
      </button>
      {result ? (
        <div className="text-sm space-y-4">
          <div>
            <p className="font-semibold">Professional</p>
            <pre className="whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-2 rounded">{result.professional}</pre>
          </div>
          <div>
            <p className="font-semibold">Brief</p>
            <pre className="whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-2 rounded">{result.brief}</pre>
          </div>
          <div>
            <p className="font-semibold">Friendly</p>
            <pre className="whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-2 rounded">{result.friendly}</pre>
          </div>
        </div>
      ) : null}
    </div>
  )
}
