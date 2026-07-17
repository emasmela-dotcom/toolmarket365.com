'use client'

import { useState } from 'react'
import type { StackCategoryResult, StackCategorySlug } from '@/lib/stackCategoryTools'
import { useLanguage } from '@/lib/i18n/LanguageContext'

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

const ACCENT: Record<StackCategorySlug, string> = {
  writing: '#2dd4bf',
  coding: '#38bdf8',
  research: '#f59e0b',
  images: '#fbbf24',
  video: '#fb7185',
  meetings: '#34d399',
  office: '#60a5fa',
  automation: '#f472b6',
}

export function StackCategoryTool({ category }: { category: StackCategorySlug }) {
  const { language } = useLanguage()
  const label = LABELS[category][language]
  const c = ui[language]
  const accent = ACCENT[category]
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
    <div
      className="min-h-[calc(100vh-2rem)] px-4 py-8 sm:px-6"
      style={{
        background:
          'radial-gradient(900px 420px at 10% -10%, rgba(45,212,191,0.16), transparent 55%), radial-gradient(700px 360px at 90% 0%, rgba(56,189,248,0.14), transparent 50%), linear-gradient(165deg, #07111f 0%, #0f1c33 45%, #12243d 100%)',
      }}
    >
      <div
        className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-500/30 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-md sm:p-8"
        style={{ borderTop: `4px solid ${accent}` }}
      >
        <p
          className="mb-3 inline-flex rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em]"
          style={{
            color: accent,
            background: `${accent}22`,
            border: `1px solid ${accent}66`,
          }}
        >
          Stack tool
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-50 sm:text-4xl">
          {label.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
          {label.description}
        </p>
        <div className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl border border-slate-500/40 bg-slate-900/80 px-3.5 py-3 text-slate-50 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70"
            placeholder={c.topic}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <textarea
            className="min-h-[160px] w-full rounded-xl border border-slate-500/40 bg-slate-900/80 px-3.5 py-3 text-slate-50 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70"
            placeholder={c.details}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <button
            type="button"
            onClick={() => void run()}
            disabled={loading || !topic.trim()}
            className="rounded-full px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg transition hover:brightness-110 disabled:opacity-50"
            style={{
              background: `linear-gradient(180deg, ${accent}, ${accent}cc)`,
              boxShadow: `0 12px 28px ${accent}44`,
            }}
          >
            {loading ? c.running : c.run}
          </button>
        </div>
        {result?.markdown ? (
          <pre className="mt-6 overflow-x-auto whitespace-pre-wrap rounded-xl border border-slate-500/30 bg-slate-900/90 p-4 text-xs leading-relaxed text-slate-100">
            {result.markdown}
          </pre>
        ) : null}
      </div>
    </div>
  )
}
