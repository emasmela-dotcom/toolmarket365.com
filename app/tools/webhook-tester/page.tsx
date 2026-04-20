"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { WebhookInspectResult } from "@/lib/webhookInspect"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 !text-neutral-900 dark:!text-neutral-100 placeholder:text-neutral-600 dark:placeholder:text-neutral-400"

const TOKEN_KEY = "tm365-webhook-tester-token"

function makeToken(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, "")
  }
  return `${Date.now()}${Math.random().toString(36).slice(2, 14)}`.slice(0, 32)
}

type InboxEvent = {
  id: string
  receivedAt: string
  method: string
  query: Record<string, string>
  headers: Record<string, string>
  bodyPreview: string
  bodyBytes: number
}

export default function WebhookTesterPage() {
  const [token, setToken] = useState("")
  const [events, setEvents] = useState<InboxEvent[]>([])
  const [pollErr, setPollErr] = useState("")
  const [inspectBody, setInspectBody] = useState("")
  const [inspectHeaders, setInspectHeaders] = useState("Content-Type: application/json")
  const [inspectResult, setInspectResult] = useState<WebhookInspectResult | null>(null)
  const [inspectLoading, setInspectLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let t = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null
    if (!t || t.length < 16) {
      t = makeToken()
      localStorage.setItem(TOKEN_KEY, t)
    }
    setToken(t)
  }, [])

  const poll = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch(`/api/webhook-tester/inbox/${token}`)
      const data = (await res.json()) as { events?: InboxEvent[]; error?: string }
      if (!res.ok) {
        setPollErr(data.error || `HTTP ${res.status}`)
        return
      }
      setPollErr("")
      setEvents(data.events ?? [])
    } catch {
      setPollErr("Network error")
    }
  }, [token])

  useEffect(() => {
    if (!token) return
    void poll()
    timer.current = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") void poll()
    }, 2500)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [token, poll])

  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const captureUrl = token ? `${origin}/api/webhook-tester/capture/${token}` : ""

  const runInspect = async () => {
    setInspectLoading(true)
    setInspectResult(null)
    try {
      const res = await fetch("/api/webhook-tester/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawBody: inspectBody, headersText: inspectHeaders }),
      })
      const data = (await res.json()) as WebhookInspectResult
      setInspectResult(data)
    } catch {
      setInspectResult({
        formattedBody: "",
        parsedJson: null,
        headerPairs: [],
        hints: ["Request failed — check your connection."],
      })
    }
    setInspectLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 text-mono-900 dark:text-mono-100">
      <h1 className="text-2xl font-bold">Webhook tester</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">
        Point external services at the capture URL (POST/PUT/PATCH/DELETE). Events are kept in server memory for a
        short time — fine for debugging; not durable across deploys or all server instances.
      </p>

      <section className="rounded-lg border border-mono-200 dark:border-mono-700 p-4 space-y-2 text-sm">
        <p className="font-semibold">Your capture URL</p>
        <code className="block break-all text-xs bg-mono-100 dark:bg-mono-900 p-2 rounded text-mono-900 dark:text-mono-100">
          {captureUrl || "…"}
        </code>
        <button
          type="button"
          className="text-sm text-accent-600 hover:underline"
          onClick={() => {
            const next = makeToken()
            localStorage.setItem(TOKEN_KEY, next)
            setToken(next)
            setEvents([])
          }}
        >
          Rotate token
        </button>
        {pollErr ? <p className="text-red-600 dark:text-red-400 text-sm">{pollErr}</p> : null}
      </section>

      <section>
        <h2 className="font-semibold mb-2">Inbox ({events.length})</h2>
        <ul className="space-y-3 text-sm">
          {events.length === 0 ? (
            <li className="text-mono-500">No events yet — send a test POST to the URL above.</li>
          ) : (
            events.map((ev) => (
              <li key={ev.id} className="border border-mono-200 dark:border-mono-700 rounded p-3 space-y-1">
                <p className="font-mono text-xs text-mono-500">
                  {ev.receivedAt} · {ev.method} · {ev.bodyBytes} bytes
                </p>
                <pre className="text-xs overflow-x-auto max-h-40 overflow-y-auto whitespace-pre-wrap bg-mono-50 dark:bg-mono-950 p-2 rounded text-mono-900 dark:text-mono-100">
                  {ev.bodyPreview || "(empty body)"}
                </pre>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Inspect pasted payload</h2>
        <p className="text-xs text-mono-600 dark:text-mono-400">
          Paste a raw body and optional header lines (Key: value) — nothing is stored on the server beyond this request.
        </p>
        <textarea
          className={`${inputClass} min-h-[100px] font-mono text-xs`}
          value={inspectBody}
          onChange={(e) => setInspectBody(e.target.value)}
          placeholder='{"type":"checkout.session.completed"}'
        />
        <textarea
          className={`${inputClass} min-h-[72px] font-mono text-xs`}
          value={inspectHeaders}
          onChange={(e) => setInspectHeaders(e.target.value)}
        />
        <button
          type="button"
          onClick={() => void runInspect()}
          disabled={inspectLoading}
          className="rounded-lg bg-black dark:bg-mono-100 px-4 py-2 text-sm font-semibold text-white dark:text-mono-950 disabled:opacity-60"
        >
          {inspectLoading ? "Inspecting…" : "Inspect"}
        </button>
        {inspectResult ? (
          <div className="space-y-2 text-sm border border-mono-200 dark:border-mono-700 rounded p-3">
            {inspectResult.hints.length > 0 ? (
              <ul className="list-disc pl-5 text-amber-800 dark:text-amber-200">
                {inspectResult.hints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            ) : null}
            {inspectResult.headerPairs.length > 0 ? (
              <div>
                <p className="font-medium text-xs mb-1">Headers</p>
                <ul className="font-mono text-xs space-y-0.5">
                  {inspectResult.headerPairs.map((h, i) => (
                    <li key={i}>
                      <span className="text-mono-500">{h.name}:</span> {h.value}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap bg-mono-50 dark:bg-mono-950 p-2 rounded text-mono-900 dark:text-mono-100">
              {inspectResult.formattedBody}
            </pre>
          </div>
        ) : null}
      </section>
    </div>
  )
}
