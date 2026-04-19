"use client"

import { useCallback, useEffect, useState } from "react"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 !text-neutral-900 dark:!text-neutral-100 placeholder:text-neutral-600 dark:placeholder:text-neutral-400"

const TOKEN_KEY = "tm365-url-shortener-workspace"

function makeToken(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, "")
  }
  return `${Date.now()}${Math.random().toString(36).slice(2, 14)}`.slice(0, 32)
}

type LinkRow = { slug: string; targetUrl: string; clicks: number; createdAt: string }

export default function UrlShortenerPage() {
  const [workspace, setWorkspace] = useState("")
  const [slug, setSlug] = useState("")
  const [targetUrl, setTargetUrl] = useState("https://")
  const [links, setLinks] = useState<LinkRow[]>([])
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let t = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null
    if (!t || t.length < 16) {
      t = makeToken()
      localStorage.setItem(TOKEN_KEY, t)
    }
    setWorkspace(t)
  }, [])

  const refresh = useCallback(async () => {
    if (!workspace) return
    setErr("")
    try {
      const res = await fetch("/api/url-shortener", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list", workspaceToken: workspace }),
      })
      const data = (await res.json()) as { links?: LinkRow[]; error?: string }
      if (!res.ok) {
        setErr(data.error || "List failed")
        return
      }
      setLinks(data.links || [])
    } catch {
      setErr("Network error")
    }
  }, [workspace])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const create = async () => {
    if (!workspace) return
    setLoading(true)
    setErr("")
    try {
      const res = await fetch("/api/url-shortener", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          workspaceToken: workspace,
          slug: slug.trim().toLowerCase(),
          targetUrl: targetUrl.trim(),
        }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok) {
        setErr(data.error || "Create failed")
        setLoading(false)
        return
      }
      setSlug("")
      await refresh()
    } catch {
      setErr("Network error")
    }
    setLoading(false)
  }

  const origin = typeof window !== "undefined" ? window.location.origin : ""

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 text-mono-900 dark:text-mono-100">
      <h1 className="text-2xl font-bold">URL shortener (demo)</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">
        Short links and click counts live in server memory for this deployment — useful for demos, not durable
        production analytics. Slug: lowercase letters, digits, hyphens (2–32 chars).
      </p>

      <section className="rounded-lg border border-mono-200 dark:border-mono-700 p-4 text-sm space-y-2">
        <p>
          <span className="font-medium">Workspace token</span> (keep private — anyone with it can add links in this
          sandbox):
        </p>
        <code className="block break-all text-xs bg-mono-100 dark:bg-mono-900 p-2 rounded">{workspace || "…"}</code>
        <button
          type="button"
          className="text-accent-600 hover:underline text-sm"
          onClick={() => {
            const next = makeToken()
            localStorage.setItem(TOKEN_KEY, next)
            setWorkspace(next)
            setLinks([])
          }}
        >
          New workspace
        </button>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium sm:col-span-2">
          Destination URL
          <input
            className={`${inputClass} mt-1 font-mono text-sm`}
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
          />
        </label>
        <label className="text-sm font-medium">
          Short slug
          <input
            className={`${inputClass} mt-1 font-mono text-sm`}
            placeholder="launch"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase())}
          />
        </label>
        <div className="flex items-end">
          <button
            type="button"
            disabled={loading || !slug.trim()}
            onClick={() => void create()}
            className="w-full rounded-lg bg-black dark:bg-mono-100 py-2 text-sm font-semibold text-white dark:text-mono-950 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Create short link"}
          </button>
        </div>
      </div>
      {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}

      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Links &amp; clicks</h2>
          <button type="button" className="text-sm text-accent-600 hover:underline" onClick={() => void refresh()}>
            Refresh
          </button>
        </div>
        {links.length === 0 ? (
          <p className="text-sm text-mono-500">No links yet.</p>
        ) : (
          <ul className="space-y-3 text-sm">
            {links.map((row) => (
              <li key={row.slug} className="border border-mono-200 dark:border-mono-700 rounded p-3 space-y-1">
                <p className="font-mono text-xs break-all text-accent-600 dark:text-accent-400">
                  {origin}/api/url-shortener/r/{workspace}/{row.slug}
                </p>
                <p className="text-mono-600 dark:text-mono-400 break-all">→ {row.targetUrl}</p>
                <p className="text-xs text-mono-500">Clicks: {row.clicks}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
