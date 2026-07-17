"use client"

import { useState } from "react"
import type { HeatmapRecorderResult } from "@/lib/heatmapRecorder"
import { useLanguage } from "@/lib/i18n/LanguageContext"

/* Force readable field text: globals use `.dark textarea { color: inherit }` which can pick up muted ancestor colors. */
const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 !text-neutral-900 dark:!text-neutral-100 placeholder:text-neutral-600 dark:placeholder:text-neutral-400 caret-neutral-900 dark:caret-neutral-100"

const copy = {
  en: {
    title: "Heatmap recorder",
    description:
      "Paste normalized x,y coordinates (0–100 scale) per line; optional third number = weight. ASCII density preview plus rollout tips — not a live session recorder.",
    gridLabel: "Grid cells per side (4–12)",
    rendering: "Rendering…",
    renderPreview: "Render preview",
    densityGrid: "Density grid",
    gridSizeNote: (n: number) =>
      `${n}×${n} characters (one cell per coordinate bucket)`,
    implementation: "Implementation",
    privacy: "Privacy",
    requestFailed: "Request failed",
    networkError:
      "Network error — is the dev server running? Try again after refresh.",
    errorPrefix: (status: number, error?: string) =>
      `Error ${status}: ${error || "Request failed"}`,
  },
  es: {
    title: "Registrador de mapas de calor",
    description:
      "Pega coordenadas x,y normalizadas (escala 0–100) por línea; un tercer número opcional = peso. Vista previa de densidad ASCII más consejos de implementación — no es un grabador de sesiones en vivo.",
    gridLabel: "Celdas de cuadrícula por lado (4–12)",
    rendering: "Renderizando…",
    renderPreview: "Renderizar vista previa",
    densityGrid: "Cuadrícula de densidad",
    gridSizeNote: (n: number) =>
      `${n}×${n} caracteres (una celda por grupo de coordenadas)`,
    implementation: "Implementación",
    privacy: "Privacidad",
    requestFailed: "La solicitud falló",
    networkError:
      "Error de red — ¿está el servidor de desarrollo en ejecución? Inténtalo de nuevo tras actualizar.",
    errorPrefix: (status: number, error?: string) =>
      `Error ${status}: ${error || "La solicitud falló"}`,
  },
}

export default function HeatmapRecorderPage() {
  const { language } = useLanguage()
  const c = copy[language]
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
          asciiGrid: c.errorPrefix(
            res.status,
            (data as { error?: string }).error
          ),
          gridN: 0,
          implementationTips: [],
          privacyChecklist: [],
        })
      } else {
        setResult(data as HeatmapRecorderResult)
      }
    } catch {
      setResult({
        asciiGrid: c.networkError,
        gridN: 0,
        implementationTips: [],
        privacyChecklist: [],
      })
    }
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">{c.title}</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">
        {c.description}
      </p>
      <textarea
        className={`${inputClass} min-h-[120px] font-mono text-sm`}
        placeholder={"20,30\n45,60,2\n70,25"}
        value={samplesText}
        onChange={(e) => setSamplesText(e.target.value)}
        spellCheck={false}
      />
      <label className="block text-sm font-medium text-mono-800 dark:text-mono-200">
        {c.gridLabel}
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
        {loading ? c.rendering : c.renderPreview}
      </button>
      {result ? (
        <div className="space-y-4 text-sm border border-mono-200 dark:border-mono-700 rounded p-4">
          <div>
            <p className="font-semibold text-mono-900 dark:text-mono-100 mb-1">{c.densityGrid}</p>
            {result.gridN > 0 ? (
              <p className="text-xs text-mono-600 dark:text-mono-400 mb-2">
                {c.gridSizeNote(result.gridN)}
              </p>
            ) : null}
            <pre className="font-mono text-xs leading-none whitespace-pre text-mono-100 bg-mono-950 p-3 rounded overflow-x-auto inline-block min-w-0">
              {result.asciiGrid}
            </pre>
          </div>
          <div>
            <p className="font-semibold text-mono-900 dark:text-mono-100 mb-1">{c.implementation}</p>
            <ul className="list-disc pl-5 text-mono-700 dark:text-mono-300">
              {result.implementationTips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-mono-900 dark:text-mono-100 mb-1">{c.privacy}</p>
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
