'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  WRITING_FORMATS,
  WRITING_LENGTHS,
  WRITING_TONES,
  runWritingStudio,
  type WritingFormat,
  type WritingLength,
  type WritingStudioResult,
  type WritingTone,
} from '@/lib/writingStudio'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    back: 'Back to tools',
    kicker: 'Writing studio',
    title: 'Writing',
    tagline:
      'Blog, email, social, ads, landing, and newsletter packs — headlines, outline, full draft, and extras in one pass.',
    honest:
      'Honest note: this is a template writing studio (same class as Landing Copy on this site). Not live ChatGPT/Jasper. It is a real multi-format tool — not the empty category shells.',
    topic: 'Topic / offer',
    audience: 'Audience',
    problem: 'Problem you solve',
    keyPoints: 'Key points (one per line)',
    cta: 'Call to action',
    format: 'Format',
    tone: 'Tone',
    length: 'Length',
    generate: 'Generate copy',
    generating: 'Generating…',
    headlines: 'Headline options',
    outline: 'Outline',
    draft: 'Full draft',
    tips: 'Pro tips',
    copyDraft: 'Copy draft',
    copyAll: 'Copy full pack',
    copied: 'Copied',
    words: 'words',
    engine: 'Engine: template (no live AI)',
    formats: {
      blog: 'Blog post',
      email: 'Email',
      social: 'Social post',
      ad: 'Ad copy',
      landing: 'Landing page',
      newsletter: 'Newsletter',
    } as Record<WritingFormat, string>,
    tones: {
      professional: 'Professional',
      friendly: 'Friendly',
      bold: 'Bold',
      casual: 'Casual',
      persuasive: 'Persuasive',
    } as Record<WritingTone, string>,
    lengths: {
      short: 'Short',
      medium: 'Medium',
      long: 'Long',
    } as Record<WritingLength, string>,
  },
  es: {
    back: 'Volver a herramientas',
    kicker: 'Estudio de escritura',
    title: 'Writing',
    tagline:
      'Packs de blog, email, social, anuncios, landing y newsletter — titulares, esquema, borrador y extras en un paso.',
    honest:
      'Nota honesta: estudio de escritura por plantillas (misma clase que Landing Copy en este sitio). No es ChatGPT/Jasper en vivo. Es una herramienta multi-formato real — no los shells vacíos de categoría.',
    topic: 'Tema / oferta',
    audience: 'Audiencia',
    problem: 'Problema que resuelves',
    keyPoints: 'Puntos clave (uno por línea)',
    cta: 'Llamada a la acción',
    format: 'Formato',
    tone: 'Tono',
    length: 'Longitud',
    generate: 'Generar texto',
    generating: 'Generando…',
    headlines: 'Opciones de titular',
    outline: 'Esquema',
    draft: 'Borrador completo',
    tips: 'Consejos',
    copyDraft: 'Copiar borrador',
    copyAll: 'Copiar pack completo',
    copied: 'Copiado',
    words: 'palabras',
    engine: 'Motor: plantilla (sin IA en vivo)',
    formats: {
      blog: 'Entrada de blog',
      email: 'Email',
      social: 'Post social',
      ad: 'Copy de anuncio',
      landing: 'Landing page',
      newsletter: 'Newsletter',
    } as Record<WritingFormat, string>,
    tones: {
      professional: 'Profesional',
      friendly: 'Amigable',
      bold: 'Audaz',
      casual: 'Casual',
      persuasive: 'Persuasivo',
    } as Record<WritingTone, string>,
    lengths: {
      short: 'Corto',
      medium: 'Medio',
      long: 'Largo',
    } as Record<WritingLength, string>,
  },
}

function packText(result: WritingStudioResult): string {
  const extras = result.extras
    .map((b) => `## ${b.label}\n${b.items.map((i) => `- ${i}`).join('\n')}`)
    .join('\n\n')
  return [
    `# Headlines\n${result.headlines.map((h, i) => `${i + 1}. ${h}`).join('\n')}`,
    `# Outline\n${result.outline.map((o, i) => `${i + 1}. ${o}`).join('\n')}`,
    `# Draft\n${result.draft}`,
    extras,
    `# Tips\n${result.tips.map((t) => `- ${t}`).join('\n')}`,
  ]
    .filter(Boolean)
    .join('\n\n')
}

export default function WritingPage() {
  const { language } = useLanguage()
  const c = copy[language]
  const [topic, setTopic] = useState('')
  const [audience, setAudience] = useState('')
  const [problem, setProblem] = useState('')
  const [keyPoints, setKeyPoints] = useState('')
  const [cta, setCta] = useState('')
  const [format, setFormat] = useState<WritingFormat>('blog')
  const [tone, setTone] = useState<WritingTone>('professional')
  const [length, setLength] = useState<WritingLength>('medium')
  const [result, setResult] = useState<WritingStudioResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<'draft' | 'all' | null>(null)

  const canRun = useMemo(() => topic.trim().length > 0, [topic])

  const run = () => {
    setLoading(true)
    setCopied(null)
    // Run locally — same engine as /api/writing. No login/API failure can empty the tool.
    const next = runWritingStudio({
      topic,
      audience,
      problem,
      keyPoints,
      cta,
      format,
      tone,
      length,
    })
    setResult(next)
    setLoading(false)
  }

  const copyText = async (mode: 'draft' | 'all') => {
    if (!result) return
    const text = mode === 'draft' ? result.draft : packText(result)
    await navigator.clipboard.writeText(text)
    setCopied(mode)
    window.setTimeout(() => setCopied(null), 1600)
  }

  return (
    <main className="ws-shell">
      <style>{`
        .ws-shell {
          min-height: 100vh;
          padding: 1.5rem 1rem 3rem;
          color: #ecfdf5;
          background:
            radial-gradient(900px 420px at 10% -12%, rgba(45,212,191,0.22), transparent 55%),
            radial-gradient(700px 360px at 95% 0%, rgba(56,189,248,0.14), transparent 50%),
            linear-gradient(165deg, #07111f 0%, #0b1f2a 42%, #10283a 100%);
          font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
        }
        .ws-wrap { max-width: 58rem; margin: 0 auto; }
        .ws-back {
          display: inline-flex; margin-bottom: 1rem; color: #5eead4;
          font-size: 0.85rem; font-weight: 700; text-decoration: none;
        }
        .ws-back:hover { color: #99f6e4; text-decoration: underline; }
        .ws-hero {
          border: 1px solid rgba(45,212,191,0.4);
          border-radius: 1.25rem;
          padding: 1.35rem 1.25rem;
          margin-bottom: 1.1rem;
          background:
            radial-gradient(620px 180px at 0% 0%, rgba(45,212,191,0.2), transparent 60%),
            rgba(8,24,32,0.88);
          box-shadow: 0 20px 40px rgba(0,0,0,0.28);
        }
        .ws-kicker {
          display: inline-flex; margin: 0 0 0.55rem; padding: 0.28rem 0.65rem;
          border-radius: 999px; border: 1px solid rgba(45,212,191,0.5);
          background: rgba(45,212,191,0.12); font-size: 0.68rem; font-weight: 800;
          letter-spacing: 0.12em; text-transform: uppercase; color: #99f6e4;
        }
        .ws-title {
          margin: 0 0 0.45rem; font-size: clamp(1.9rem, 4vw, 2.7rem);
          font-weight: 800; letter-spacing: -0.03em; color: #f0fdfa;
        }
        .ws-tagline { margin: 0 0 0.75rem; max-width: 44rem; color: #99f6e4; line-height: 1.55; }
        .ws-honest {
          margin: 0; padding: 0.7rem 0.85rem; border-radius: 0.75rem;
          border: 1px solid rgba(251,191,36,0.45);
          background: rgba(120,53,15,0.35); color: #fde68a;
          font-size: 0.82rem; line-height: 1.45;
        }
        .ws-grid {
          display: grid; gap: 0.75rem;
          border: 1px solid rgba(45,212,191,0.25);
          border-radius: 1rem; padding: 1rem;
          background: rgba(8,24,32,0.72);
          margin-bottom: 1rem;
        }
        @media (min-width: 720px) {
          .ws-grid-2 { grid-template-columns: 1fr 1fr; }
          .ws-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
        }
        .ws-label {
          display: grid; gap: 0.35rem; font-size: 0.8rem; font-weight: 700; color: #99f6e4;
        }
        .ws-input, .ws-select, .ws-area {
          width: 100%; border-radius: 0.75rem; border: 1px solid rgba(45,212,191,0.28);
          background: rgba(15,23,42,0.85); color: #f0fdfa; padding: 0.7rem 0.8rem; font: inherit;
        }
        .ws-area { min-height: 110px; resize: vertical; }
        .ws-btn {
          border: 0; border-radius: 999px; padding: 0.7rem 1.15rem; font-size: 0.92rem;
          font-weight: 800; cursor: pointer; font-family: inherit;
          background: linear-gradient(180deg, #2dd4bf, #14b8a6); color: #042f2e;
          box-shadow: 0 12px 28px rgba(45,212,191,0.28);
        }
        .ws-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .ws-btn-secondary {
          background: rgba(15,23,42,0.8); color: #99f6e4;
          border: 1px solid rgba(45,212,191,0.35); box-shadow: none;
        }
        .ws-panel {
          border: 1px solid rgba(45,212,191,0.25); border-radius: 1rem;
          background: rgba(8,24,32,0.72); padding: 1rem; margin-bottom: 0.85rem;
        }
        .ws-panel h2 { margin: 0 0 0.65rem; font-size: 1.05rem; color: #f0fdfa; }
        .ws-meta { margin: 0 0 0.75rem; font-size: 0.78rem; color: #5eead4; }
        .ws-list { margin: 0; padding-left: 1.1rem; color: #ccfbf1; line-height: 1.5; }
        .ws-draft {
          white-space: pre-wrap; font-size: 0.88rem; line-height: 1.55; color: #ecfdf5;
          background: rgba(2,6,23,0.55); border-radius: 0.75rem; padding: 0.9rem;
          border: 1px solid rgba(45,212,191,0.18);
        }
        .ws-actions { display: flex; flex-wrap: wrap; gap: 0.55rem; margin-top: 0.75rem; }
      `}</style>

      <div className="ws-wrap">
        <Link href="/" className="ws-back">
          ← {c.back}
        </Link>

        <header className="ws-hero">
          <p className="ws-kicker">{c.kicker}</p>
          <h1 className="ws-title">{c.title}</h1>
          <p className="ws-tagline">{c.tagline}</p>
          <p className="ws-honest">{c.honest}</p>
        </header>

        <section className="ws-grid">
          <label className="ws-label">
            {c.topic}
            <input
              className="ws-input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. $0.99 creator tools marketplace"
            />
          </label>
          <div className="ws-grid ws-grid-2" style={{ padding: 0, border: 0, background: 'transparent', margin: 0 }}>
            <label className="ws-label">
              {c.audience}
              <input
                className="ws-input"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. solo creators"
              />
            </label>
            <label className="ws-label">
              {c.problem}
              <input
                className="ws-input"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="e.g. paying for 10 separate tools"
              />
            </label>
          </div>
          <label className="ws-label">
            {c.keyPoints}
            <textarea
              className="ws-area"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder={'One idea per line\nOne low price\nAll tools in one tab\nNo free-trial maze'}
            />
          </label>
          <label className="ws-label">
            {c.cta}
            <input
              className="ws-input"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              placeholder="e.g. Start for $0.99/month"
            />
          </label>
          <div className="ws-grid ws-grid-3" style={{ padding: 0, border: 0, background: 'transparent', margin: 0 }}>
            <label className="ws-label">
              {c.format}
              <select className="ws-select" value={format} onChange={(e) => setFormat(e.target.value as WritingFormat)}>
                {WRITING_FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {c.formats[f]}
                  </option>
                ))}
              </select>
            </label>
            <label className="ws-label">
              {c.tone}
              <select className="ws-select" value={tone} onChange={(e) => setTone(e.target.value as WritingTone)}>
                {WRITING_TONES.map((t) => (
                  <option key={t} value={t}>
                    {c.tones[t]}
                  </option>
                ))}
              </select>
            </label>
            <label className="ws-label">
              {c.length}
              <select className="ws-select" value={length} onChange={(e) => setLength(e.target.value as WritingLength)}>
                {WRITING_LENGTHS.map((l) => (
                  <option key={l} value={l}>
                    {c.lengths[l]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button type="button" className="ws-btn" disabled={loading || !canRun} onClick={run}>
            {loading ? c.generating : c.generate}
          </button>
        </section>

        {result ? (
          <>
            <p className="ws-meta">
              {c.engine} · {result.wordCount} {c.words}
            </p>
            <section className="ws-panel">
              <h2>{c.headlines}</h2>
              <ol className="ws-list">
                {result.headlines.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ol>
            </section>
            <section className="ws-panel">
              <h2>{c.outline}</h2>
              <ol className="ws-list">
                {result.outline.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ol>
            </section>
            <section className="ws-panel">
              <h2>{c.draft}</h2>
              <pre className="ws-draft">{result.draft}</pre>
              <div className="ws-actions">
                <button type="button" className="ws-btn ws-btn-secondary" onClick={() => void copyText('draft')}>
                  {copied === 'draft' ? c.copied : c.copyDraft}
                </button>
                <button type="button" className="ws-btn ws-btn-secondary" onClick={() => void copyText('all')}>
                  {copied === 'all' ? c.copied : c.copyAll}
                </button>
              </div>
            </section>
            {result.extras.map((block) => (
              <section className="ws-panel" key={block.label}>
                <h2>{block.label}</h2>
                <ul className="ws-list">
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
            <section className="ws-panel">
              <h2>{c.tips}</h2>
              <ul className="ws-list">
                {result.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </section>
          </>
        ) : null}
      </div>
    </main>
  )
}
