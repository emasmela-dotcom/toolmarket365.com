"use client"

import { useState } from "react"
import type { HeatmapRecorderResult } from "@/lib/heatmapRecorder"

/* Force readable field text: globals use `.dark textarea { color: inherit }` which can pick up muted ancestor colors. */
const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 !text-neutral-900 dark:!text-neutral-100 placeholder:text-neutral-600 dark:placeholder:text-neutral-400 caret-neutral-900 dark:caret-neutral-100"

export default function HeatmapRecorderPage() {
  const [samplesText, setSamplesText] = useState(
    "20,30\n45,60,2\n70,25"
  )
  const [gridSize, setGridSize] = useState("8")
  const [result, setResult] = useState<HeatmapRecorderResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/heatmap-recorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ samplesText, gridSize }),
      })
      const data = await res.json()
      if (!res.ok) {
        setResult({
          asciiGrid: `Error ${res.status}: ${(data as { error?: string }).error || "Request failed"}`,
          gridN: 0,
          implementationTips: [],
          privacyChecklist: [],
        })
      } else {
        setResult(data as HeatmapRecorderResult)
      }
    } catch {
      setResult({
        asciiGrid: "Network error — is the dev server running? Try again after refresh.",
        gridN: 0,
        implementationTips: [],
        privacyChecklist: [],
      })
    }
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">Heatmap recorder</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">
        Paste normalized x,y coordinates (0–100 scale) per line; optional third number = weight.
        ASCII density preview plus rollout tips — not a live session recorder.
      </p>
      <textarea
        className={`${inputClass} min-h-[120px] font-mono text-sm`}
        placeholder={"20,30\n45,60,2\n70,25"}
        value={samplesText}
        onChange={(e) => setSamplesText(e.target.value)}
        spellCheck={false}
      />
      <label className="block text-sm font-medium text-mono-800 dark:text-mono-200">
        Grid cells per side (4–12)
        <input
          className={`${inputClass} mt-1`}
          type="number"
          min={4}
          max={12}
          placeholder="8"
          value={gridSize}
          onChange={(e) => setGridSize(e.target.value)}
        />
      </label>
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded"
      >
        {loading ? "Rendering…" : "Render preview"}
      </button>
      {result ? (
        <div className="space-y-4 text-sm border border-mono-200 dark:border-mono-700 rounded p-4">
          <div>
            <p className="font-semibold text-mono-900 dark:text-mono-100 mb-1">Density grid</p>
            {result.gridN > 0 ? (
              <p className="text-xs text-mono-600 dark:text-mono-400 mb-2">
                {result.gridN}×{result.gridN} characters (one cell per coordinate bucket)
              </p>
            ) : null}
            <pre className="font-mono text-xs leading-none whitespace-pre text-mono-100 bg-mono-950 p-3 rounded overflow-x-auto inline-block min-w-0">
              {result.asciiGrid}
            </pre>
          </div>
          <div>
            <p className="font-semibold text-mono-900 dark:text-mono-100 mb-1">Implementation</p>
            <ul className="list-disc pl-5 text-mono-700 dark:text-mono-300">
              {result.implementationTips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-mono-900 dark:text-mono-100 mb-1">Privacy</p>
            <ul className="list-disc pl-5 text-mono-700 dark:text-mono-300">
              {result.privacyChecklist.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}
