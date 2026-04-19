"use client"

import { useState } from "react"
import type { MeetingSummarizerResult } from "@/lib/meetingSummarizer"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"

export default function MeetingSummarizerPage() {
  const [meetingTitle, setMeetingTitle] = useState("")
  const [transcript, setTranscript] = useState("")
  const [result, setResult] = useState<MeetingSummarizerResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/meeting-summarizer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meetingTitle, transcript }),
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  const list = (label: string, items: string[]) =>
    items.length ? (
      <div>
        <h2 className="font-semibold text-mono-900 dark:text-mono-100 mb-2">{label}</h2>
        <ul className="list-disc pl-5 text-sm text-mono-700 dark:text-mono-300 space-y-1">
          {items.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </div>
    ) : null

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">Meeting summarizer</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">
        Paste a Zoom / Google Meet / Otter transcript. Get a fast heuristic summary, decisions,
        action items, and open questions (no external AI required).
      </p>
      <input
        className={inputClass}
        placeholder="Meeting title (optional)"
        value={meetingTitle}
        onChange={(e) => setMeetingTitle(e.target.value)}
      />
      <textarea
        className={`${inputClass} min-h-[220px] text-sm`}
        placeholder="Paste transcript…"
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
      />
      <button
        type="button"
        onClick={run}
        disabled={loading || !transcript.trim()}
        className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Summarizing…" : "Summarize"}
      </button>
      {result ? (
        <div className="space-y-4 border border-mono-200 dark:border-mono-700 rounded p-4">
          <p className="font-medium text-mono-900 dark:text-mono-100">{result.title}</p>
          {list("Summary", result.summaryBullets)}
          {list("Decisions", result.decisions)}
          {list("Action items", result.actionItems)}
          {list("Open questions", result.openQuestions)}
        </div>
      ) : null}
    </div>
  )
}
