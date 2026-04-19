"use client"

import { useState } from "react"

export function CopyTextButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false)

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setDone(true)
          setTimeout(() => setDone(false), 2000)
        } catch {
          setDone(false)
        }
      }}
      className="shrink-0 rounded border border-mono-300 dark:border-mono-600 bg-mono-100 dark:bg-mono-800 px-2 py-1 text-xs font-medium text-mono-900 dark:text-mono-100 hover:border-accent-500"
    >
      {done ? "Copied" : label}
    </button>
  )
}
