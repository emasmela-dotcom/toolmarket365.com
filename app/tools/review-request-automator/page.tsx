"use client"

import { useState } from "react"
import type { ReviewRequestResult } from "@/lib/reviewRequestAutomator"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"

const copy = {
  en: {
    title: "Review request automator",
    brandPlaceholder: "Brand",
    productPlaceholder: "Product",
    reviewUrlPlaceholder: "Review URL",
    buildCopy: "Build copy",
  },
  es: {
    title: "Automatizador de solicitudes de reseñas",
    brandPlaceholder: "Marca",
    productPlaceholder: "Producto",
    reviewUrlPlaceholder: "URL de reseña",
    buildCopy: "Generar texto",
  },
}

export default function ReviewRequestAutomatorPage() {
  const { language } = useLanguage()
  const c = copy[language]
  const [brandName, setBrandName] = useState("")
  const [productName, setProductName] = useState("")
  const [reviewLink, setReviewLink] = useState("https://")
  const [result, setResult] = useState<ReviewRequestResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch("/api/review-request-automator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandName, productName, reviewLink }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">{c.title}</h1>
      <input className={inputClass} placeholder={c.brandPlaceholder} value={brandName} onChange={(e) => setBrandName(e.target.value)} />
      <input className={inputClass} placeholder={c.productPlaceholder} value={productName} onChange={(e) => setProductName(e.target.value)} />
      <input className={inputClass} placeholder={c.reviewUrlPlaceholder} value={reviewLink} onChange={(e) => setReviewLink(e.target.value)} />
      <button type="button" onClick={run} disabled={loading} className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded">
        {c.buildCopy}
      </button>
      {result ? (
        <div className="text-sm space-y-3">
          <pre className="whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-2 rounded text-mono-950 dark:text-mono-50">{result.emailDay3}</pre>
          <pre className="whitespace-pre-wrap bg-mono-100 dark:bg-mono-900 p-2 rounded text-mono-950 dark:text-mono-50">{result.emailDay10}</pre>
          <p className="text-mono-700 dark:text-mono-300">{result.smsShort}</p>
        </div>
      ) : null}
    </div>
  )
}
