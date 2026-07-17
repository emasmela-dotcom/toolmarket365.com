"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 !text-neutral-900 dark:!text-neutral-100 placeholder:text-neutral-600 dark:placeholder:text-neutral-400"

const copy = {
  en: {
    title: "QR code generator",
    description:
      "Encode a URL or short text. Dark/light colors use 6-digit hex (e.g. #0a0a0a). Output is a PNG data URL you can right-click and save.",
    payload: "Payload",
    dark: "Dark",
    light: "Light",
    size: "Size (px)",
    generate: "Generate QR",
    generating: "Generating…",
    failed: "Failed",
    networkError: "Network error",
    alt: "Generated QR code",
  },
  es: {
    title: "Generador de códigos QR",
    description:
      "Codifica una URL o texto corto. Los colores oscuro/claro usan hex de 6 dígitos (p. ej. #0a0a0a). El resultado es una URL de datos PNG que puedes guardar con clic derecho.",
    payload: "Contenido",
    dark: "Oscuro",
    light: "Claro",
    size: "Tamaño (px)",
    generate: "Generar QR",
    generating: "Generando…",
    failed: "Error",
    networkError: "Error de red",
    alt: "Código QR generado",
  },
}

export default function QrCodeGeneratorPage() {
  const { language } = useLanguage()
  const c = copy[language]
  const [payload, setPayload] = useState("https://example.com")
  const [dark, setDark] = useState("#000000")
  const [light, setLight] = useState("#ffffff")
  const [width, setWidth] = useState(280)
  const [dataUrl, setDataUrl] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    setErr("")
    setDataUrl("")
    try {
      const res = await fetch("/api/qr-code-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload, dark, light, width }),
      })
      const data = (await res.json()) as { dataUrl?: string; error?: string }
      if (!res.ok) {
        setErr(data.error || c.failed)
        setLoading(false)
        return
      }
      setDataUrl(data.dataUrl || "")
    } catch {
      setErr(c.networkError)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-lg mx-auto p-6 space-y-5 text-mono-900 dark:text-mono-100">
      <h1 className="text-2xl font-bold">{c.title}</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">{c.description}</p>
      <label className="block text-sm font-medium">
        {c.payload}
        <textarea
          className={`${inputClass} mt-1 min-h-[80px] font-mono text-sm`}
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-medium">
          {c.dark}
          <input className={`${inputClass} mt-1 font-mono`} value={dark} onChange={(e) => setDark(e.target.value)} />
        </label>
        <label className="text-sm font-medium">
          {c.light}
          <input className={`${inputClass} mt-1 font-mono`} value={light} onChange={(e) => setLight(e.target.value)} />
        </label>
      </div>
      <label className="block text-sm font-medium">
        {c.size}
        <input
          type="number"
          min={120}
          max={512}
          className={`${inputClass} mt-1`}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value) || 280)}
        />
      </label>
      {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}
      <button
        type="button"
        disabled={loading}
        onClick={() => void generate()}
        className="rounded-lg bg-black dark:bg-mono-100 px-4 py-2 text-sm font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? c.generating : c.generate}
      </button>
      {dataUrl ? (
        <div className="rounded border border-mono-200 dark:border-mono-700 p-4 bg-white dark:bg-mono-950 inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dataUrl} alt={c.alt} className="max-w-full h-auto" width={width} height={width} />
        </div>
      ) : null}
    </div>
  )
}
