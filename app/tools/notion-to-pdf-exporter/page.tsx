"use client"

import { useState } from "react"
import type { NotionPdfResult } from "@/lib/notionToPdfExporter"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"

export default function NotionToPdfExporterPage() {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [result, setResult] = useState<NotionPdfResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/notion-to-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
        Notion-to-PDF exporter
      </h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">
        Paste Notion-style Markdown or plain notes. Get a print-ready preview and a checklist
        to save as PDF from your browser (Print → Save as PDF).
      </p>
      <input
        className={inputClass}
        placeholder="Page title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className={`${inputClass} min-h-[200px] font-mono text-sm`}
        placeholder={"# Heading\n- Bullet\nParagraph text…"}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button
        type="button"
        onClick={run}
        disabled={loading || !body.trim()}
        className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Building…" : "Build print preview"}
      </button>
      {result ? (
        <div className="space-y-4 border border-mono-200 dark:border-mono-700 rounded p-4">
          <h2 className="font-semibold text-mono-900 dark:text-mono-100">Export checklist</h2>
          <ul className="list-disc pl-5 text-sm text-mono-700 dark:text-mono-300 space-y-1">
            {result.checklist.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
          <h2 className="font-semibold text-mono-900 dark:text-mono-100">Preview</h2>
          <div
            className="prose prose-invert max-w-none bg-white text-black p-4 rounded border border-mono-300 text-sm"
            dangerouslySetInnerHTML={{ __html: result.printableHtml }}
          />
        </div>
      ) : null}
    </div>
  )
}
