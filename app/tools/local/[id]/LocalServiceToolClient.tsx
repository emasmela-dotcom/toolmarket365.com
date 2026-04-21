"use client"

import { useState } from "react"
import type { LifeToolMeta } from "@/lib/lifeTools/types"
import { localToolSurfaceAccent } from "@/lib/toolSurfaceTheme"

const inputClass =
  "border p-2.5 w-full rounded-lg border-mono-300 dark:border-mono-600 bg-white text-mono-950 placeholder:text-mono-600 dark:bg-mono-900 dark:text-mono-50 dark:placeholder:text-mono-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mono-400 focus-visible:ring-offset-2 dark:focus-visible:ring-mono-500 dark:focus-visible:ring-offset-mono-950"

export function LocalServiceToolClient({ meta }: { meta: LifeToolMeta }) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [out, setOut] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    setErr("")
    setOut("")
    try {
      const res = await fetch(`/api/local-service-tool/${meta.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = (await res.json()) as { ok?: boolean; output?: string; error?: string }
      if (!res.ok || !data.ok) {
        setErr(data.error || "Request failed")
        setLoading(false)
        return
      }
      setOut(data.output || "")
    } catch {
      setErr("Network error")
    }
    setLoading(false)
  }

  const accent = localToolSurfaceAccent(meta.category)

  return (
    <div
      data-light-fields
      className={`max-w-xl mx-auto space-y-5 rounded-2xl border border-mono-200 bg-white p-6 text-mono-900 shadow-sm dark:border-mono-800 dark:bg-mono-950 dark:text-mono-100 sm:p-8 border-l-4 ${accent.leftRail}`}
    >
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-mono-500 dark:text-mono-400">
          Local & service business
        </p>
        <span
          className={`inline-flex max-w-full rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${accent.badge}`}
        >
          {meta.category}
        </span>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{meta.title}</h1>
        <p className="text-sm leading-relaxed text-mono-600 dark:text-mono-400">{meta.description}</p>
      </header>
      <div className="space-y-4">
        {meta.fields.map((f) => (
          <label key={f.key} className="block text-sm font-medium text-mono-800 dark:text-mono-200">
            {f.label}
            {f.type === "textarea" ? (
              <textarea
                className={`${inputClass} mt-1 min-h-[88px]`}
                placeholder={f.placeholder}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((s) => ({ ...s, [f.key]: e.target.value }))}
              />
            ) : (
              <input
                className={`${inputClass} mt-1`}
                type={f.type === "number" ? "number" : "text"}
                placeholder={f.placeholder}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((s) => ({ ...s, [f.key]: e.target.value }))}
              />
            )}
          </label>
        ))}
      </div>
      <button
        type="button"
        disabled={loading}
        onClick={() => void run()}
        className="rounded-lg bg-mono-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 active:opacity-90 disabled:opacity-60 dark:bg-mono-100 dark:text-mono-950 dark:shadow-none"
      >
        {loading ? "Running…" : "Run"}
      </button>
      {err ? <p className="text-sm font-medium text-red-700 dark:text-red-400">{err}</p> : null}
      {out ? (
        <pre className="whitespace-pre-wrap rounded-xl border border-mono-200 bg-mono-50 p-4 text-sm leading-relaxed text-mono-900 shadow-inner dark:border-mono-700 dark:bg-mono-900/60 dark:text-mono-100">
          {out}
        </pre>
      ) : null}
    </div>
  )
}
