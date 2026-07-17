'use client'

import { useState } from 'react'
import type { StackCategoryResult, StackCategorySlug } from '@/lib/stackCategoryTools'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const inputClass =
  'border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400'

const LABELS: Record<
  StackCategorySlug,
  { en: { title: string; description: string }; es: { title: string; description: string } }
> = {
  writing: {
    en: {
      title: 'Writing',
      description: 'Turn a topic and notes into a writing outline and starter draft.',
    },
    es: {
      title: 'Writing',
      description: 'Convierte un tema y notas en un esquema de escritura y un borrador inicial.',
    },
  },
  coding: {
    en: {
      title: 'Coding',
      description: 'Turn a coding goal into a plan, checklist, and starter stub.',
    },
    es: {
      title: 'Coding',
      description: 'Convierte un objetivo de código en un plan, checklist y esqueleto inicial.',
    },
  },
  research: {
    en: {
      title: 'Research',
      description: 'Turn a research question into a brief, source checklist, and findings template.',
    },
    es: {
      title: 'Research',
      description: 'Convierte una pregunta de investigación en un brief, checklist de fuentes y plantilla de hallazgos.',
    },
  },
  images: {
    en: {
      title: 'Images',
      description: 'Turn an image need into a prompt, layout notes, and alt-text draft.',
    },
    es: {
      title: 'Images',
      description: 'Convierte una necesidad de imagen en un prompt, notas de composición y texto alt.',
    },
  },
  video: {
    en: {
      title: 'Video',
      description: 'Turn a video topic into a hook, beats, spoken draft, and shoot notes.',
    },
    es: {
      title: 'Video',
      description: 'Convierte un tema de video en gancho, beats, guion hablado y notas de grabación.',
    },
  },
  meetings: {
    en: {
      title: 'Meetings',
      description: 'Turn a meeting purpose into an agenda and notes template.',
    },
    es: {
      title: 'Meetings',
      description: 'Convierte el propósito de una reunión en agenda y plantilla de notas.',
    },
  },
  office: {
    en: {
      title: 'Office',
      description: 'Turn an office task into a memo/email document starter.',
    },
    es: {
      title: 'Office',
      description: 'Convierte una tarea de oficina en un borrador de memo o correo.',
    },
  },
  automation: {
    en: {
      title: 'Automation',
      description: 'Turn an outcome into a trigger → steps → result automation plan.',
    },
    es: {
      title: 'Automation',
      description: 'Convierte un resultado en un plan de automatización disparador → pasos → resultado.',
    },
  },
}

const ui = {
  en: {
    topic: 'Topic / goal',
    details: 'Details (one idea per line)',
    run: 'Run',
    running: 'Running…',
  },
  es: {
    topic: 'Tema / objetivo',
    details: 'Detalles (una idea por línea)',
    run: 'Ejecutar',
    running: 'Ejecutando…',
  },
}

export function StackCategoryTool({ category }: { category: StackCategorySlug }) {
  const { language } = useLanguage()
  const label = LABELS[category][language]
  const c = ui[language]
  const [topic, setTopic] = useState('')
  const [details, setDetails] = useState('')
  const [result, setResult] = useState<StackCategoryResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await fetch('/api/stack-category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, topic, details }),
    })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">{label.title}</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">{label.description}</p>
      <input
        className={inputClass}
        placeholder={c.topic}
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <textarea
        className={`${inputClass} min-h-[160px]`}
        placeholder={c.details}
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />
      <button
        type="button"
        onClick={() => void run()}
        disabled={loading || !topic.trim()}
        className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? c.running : c.run}
      </button>
      {result?.markdown ? (
        <pre className="whitespace-pre-wrap text-xs bg-mono-100 dark:bg-mono-900 text-mono-900 dark:text-mono-100 p-4 rounded border border-mono-200 dark:border-mono-700 overflow-x-auto">
          {result.markdown}
        </pre>
      ) : null}
    </div>
  )
}
