"use client"

import { useState } from "react"
import type { SeoAuditResult } from "@/lib/seoAuditTool"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"

export default function SeoAuditToolPage() {
  const [url, setUrl] = useState("https://")
  const [hasSitemap, setHasSitemap] = useState(true)
  const [mobileFriendly, setMobileFriendly] = useState(true)
  const [metaTitleLength, setMetaTitleLength] = useState("48")
  const [metaDescriptionLength, setMetaDescriptionLength] = useState("140")
  const [h1Count, setH1Count] = useState("1")
  const [result, setResult] = useState<SeoAuditResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/seo-audit-tool", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        hasSitemap,
        hasSsl: true,
        mobileFriendly,
        metaTitleLength,
        metaDescriptionLength,
        h1Count,
      }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">SEO audit tool</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">
        One-page health checklist from your URL and a few signals — not a live crawl.
      </p>
      <input className={inputClass} value={url} onChange={(e) => setUrl(e.target.value)} />
      <label className="flex items-center gap-2 text-sm text-mono-800 dark:text-mono-200">
        <input type="checkbox" checked={hasSitemap} onChange={(e) => setHasSitemap(e.target.checked)} />
        Sitemap in robots.txt
      </label>
      <label className="flex items-center gap-2 text-sm text-mono-800 dark:text-mono-200">
        <input
          type="checkbox"
          checked={mobileFriendly}
          onChange={(e) => setMobileFriendly(e.target.checked)}
        />
        Mobile-friendly layout
      </label>
      <input
        className={inputClass}
        type="number"
        placeholder="Meta title length"
        value={metaTitleLength}
        onChange={(e) => setMetaTitleLength(e.target.value)}
      />
      <input
        className={inputClass}
        type="number"
        placeholder="Meta description length"
        value={metaDescriptionLength}
        onChange={(e) => setMetaDescriptionLength(e.target.value)}
      />
      <input
        className={inputClass}
        type="number"
        min={0}
        placeholder="H1 count on key template"
        value={h1Count}
        onChange={(e) => setH1Count(e.target.value)}
      />
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded"
      >
        {loading ? "Scoring…" : "Run audit"}
      </button>
      {result ? (
        <div className="border border-mono-200 dark:border-mono-700 rounded p-4 space-y-3">
          <p className="text-lg font-semibold text-mono-900 dark:text-mono-100">
            Score: {result.score} / 100
          </p>
          <ul className="space-y-2 text-sm">
            {result.findings.map((f, i) => (
              <li
                key={i}
                className={
                  f.level === "good"
                    ? "text-green-800 dark:text-green-200"
                    : f.level === "bad"
                      ? "text-red-800 dark:text-red-200"
                      : "text-amber-800 dark:text-amber-200"
                }
              >
                {f.text}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
