"use client"

import { useEffect, useMemo, useState } from "react"

const SHARE_TEXT =
  "ToolMarket365 — micro-SaaS tools for creators: content, billing, CRM, analytics, and more in one place."

export function HomeShareBar() {
  const [copied, setCopied] = useState(false)
  const fallbackOrigin = (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://toolmarket365.com"
  ).replace(/\/$/, "")

  /** Must match SSR on first paint; sync real origin after hydrate to avoid href mismatch. */
  const [pageUrl, setPageUrl] = useState(`${fallbackOrigin}/`)

  useEffect(() => {
    setPageUrl(`${window.location.origin}/`)
  }, [])

  const twitterHref = useMemo(() => {
    const u = pageUrl || `${fallbackOrigin}/`
    const p = new URLSearchParams({
      text: SHARE_TEXT,
      url: u,
    })
    return `https://twitter.com/intent/tweet?${p.toString()}`
  }, [pageUrl, fallbackOrigin])

  const linkedInHref = useMemo(() => {
    const u = encodeURIComponent(pageUrl || `${fallbackOrigin}/`)
    return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`
  }, [pageUrl, fallbackOrigin])

  const copy = async () => {
    const u = pageUrl || `${fallbackOrigin}/`
    try {
      await navigator.clipboard.writeText(u)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="tm-home__share" role="region" aria-label="Share this page">
      <p className="tm-home__share-label">Share</p>
      <div className="tm-home__share-actions">
        <button type="button" className="tm-home__share-btn" onClick={() => void copy()}>
          {copied ? "Copied link" : "Copy link"}
        </button>
        <a className="tm-home__share-btn" href={twitterHref} target="_blank" rel="noopener noreferrer">
          Post on X
        </a>
        <a className="tm-home__share-btn" href={linkedInHref} target="_blank" rel="noopener noreferrer">
          Share on LinkedIn
        </a>
      </div>
    </div>
  )
}
