"use client"

import { useState } from "react"
import type { LifeToolMeta } from "@/lib/lifeTools/types"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 !text-mono-950 dark:!text-mono-50 !placeholder:text-mono-800 dark:!placeholder:text-mono-400 caret-mono-950 dark:caret-mono-50"

export function LifeToolClient({ meta }: { meta: LifeToolMeta }) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [out, setOut] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    setErr("")
    setOut("")
    try {
      const res = await fetch(`/api/life-tool/${meta.id}`, {
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

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4 text-mono-900 dark:text-mono-100">
      <p className="text-xs uppercase tracking-wide text-mono-500">{meta.category}</p>
      <h1 className="text-2xl font-bold">{meta.title}</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">{meta.description}</p>
      <div className="space-y-3">
        {meta.fields.map((f) => (
          <label key={f.key} className="block text-sm font-medium">
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
        className="rounded-lg bg-black dark:bg-mono-100 px-4 py-2 text-sm font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? "Running…" : "Run"}
      </button>
      {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}
      {out ? (
        <pre className="whitespace-pre-wrap text-sm border border-mono-200 dark:border-mono-700 rounded p-4 bg-mono-50 dark:bg-mono-950 text-mono-900 dark:text-mono-100">
          {out}
        </pre>
      ) : null}
    </div>
  )
}
