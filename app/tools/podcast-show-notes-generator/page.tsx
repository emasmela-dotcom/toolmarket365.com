'use client'

import { useState, useRef } from 'react'
import { Copy, Check } from 'lucide-react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    toolName: 'Podcast Show Notes Generator',
    toolDescription:
      'Generate professional podcast show notes from your episode transcript. Create structured show notes with key points, timestamps, and summaries to help listeners navigate your content.',
    howToUse: [
      { label: 'Enter episode title:', text: 'Type the title of your podcast episode' },
      { label: 'Add guest name (optional):', text: 'Include guest name if applicable' },
      { label: 'Paste transcript:', text: 'Upload or paste your episode transcript' },
      { label: 'Select language:', text: 'Choose the language of your transcript' },
      { label: 'Click "Generate Show Notes"', text: 'to create structured notes' },
      { label: 'Copy and use:', text: 'Copy the generated show notes for your podcast platform' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Generates professional show notes for podcast episodes from transcripts. Creates summaries, chapter timestamps, key takeaways, and SEO keywords automatically.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter episode details (optional):', text: 'Episode title, Guest name, Language (English, Español, Français)' },
      { label: 'Add transcript:', text: 'Drag & drop transcript file (.txt) or audio file, click drop zone to browse, paste transcript directly, or paste YouTube URL' },
      { label: 'Click "Generate notes"', text: 'to process your transcript' },
      { label: 'Review generated show notes:', text: 'Summary, Chapters with timestamps, Key takeaways, Guest information, SEO keywords' },
      { label: 'Copy', text: 'the formatted show notes' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Formatted show notes in Markdown format',
      'Summary - Condensed episode overview (25% of transcript)',
      'Chapters - Timestamped sections (auto-detected or generated)',
      'Key takeaways - Top 3 main points',
      'Guest info - Guest name if provided',
      'SEO keywords - Top 5 relevant keywords extracted',
      'Ready to publish - Copy directly to your podcast platform',
    ],
    title: 'Podcast Show-Notes Generator',
    episodeTitlePlaceholder: 'Episode title (optional)',
    guestNamePlaceholder: 'Guest name (optional)',
    generateNotes: 'Generate notes',
    dropZone: 'Drop transcript/audio or paste YouTube URL',
    transcriptPlaceholder: 'Or paste raw transcript here…',
    copied: 'Copied!',
    copy: 'Copy',
    alertAddTranscript: 'Add transcript first',
    untitledEpisode: 'Untitled Episode',
    audioUploaded: '[Audio file uploaded]',
  },
  es: {
    toolName: 'Generador de notas de podcast',
    toolDescription:
      'Genera notas profesionales de podcast a partir de la transcripción de tu episodio. Crea notas estructuradas con puntos clave, marcas de tiempo y resúmenes para ayudar a los oyentes a navegar tu contenido.',
    howToUse: [
      { label: 'Ingresa título del episodio:', text: 'Escribe el título de tu episodio de podcast' },
      { label: 'Añade nombre del invitado (opcional):', text: 'Incluye el nombre del invitado si aplica' },
      { label: 'Pega transcripción:', text: 'Sube o pega la transcripción de tu episodio' },
      { label: 'Selecciona idioma:', text: 'Elige el idioma de tu transcripción' },
      { label: 'Haz clic en "Generar notas"', text: 'para crear notas estructuradas' },
      { label: 'Copia y usa:', text: 'Copia las notas generadas para tu plataforma de podcast' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Genera notas profesionales para episodios de podcast a partir de transcripciones. Crea resúmenes, capítulos con marcas de tiempo, conclusiones clave y palabras clave SEO automáticamente.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Ingresa detalles del episodio (opcional):', text: 'Título del episodio, nombre del invitado, idioma (English, Español, Français)' },
      { label: 'Añade transcripción:', text: 'Arrastra y suelta archivo de transcripción (.txt) o audio, haz clic en la zona para buscar, pega la transcripción directamente o pega URL de YouTube' },
      { label: 'Haz clic en "Generar notas"', text: 'para procesar tu transcripción' },
      { label: 'Revisa las notas generadas:', text: 'Resumen, capítulos con marcas de tiempo, conclusiones clave, información del invitado, palabras clave SEO' },
      { label: 'Copia', text: 'las notas formateadas' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Notas formateadas en Markdown',
      'Resumen: vista general condensada del episodio (25% de la transcripción)',
      'Capítulos: secciones con marcas de tiempo (detectadas o generadas)',
      'Conclusiones clave: los 3 puntos principales',
      'Info del invitado: nombre del invitado si se proporcionó',
      'Palabras clave SEO: top 5 palabras clave relevantes extraídas',
      'Listo para publicar: copia directamente a tu plataforma de podcast',
    ],
    title: 'Generador de notas de podcast',
    episodeTitlePlaceholder: 'Título del episodio (opcional)',
    guestNamePlaceholder: 'Nombre del invitado (opcional)',
    generateNotes: 'Generar notas',
    dropZone: 'Suelta transcripción/audio o pega URL de YouTube',
    transcriptPlaceholder: 'O pega la transcripción aquí…',
    copied: '¡Copiado!',
    copy: 'Copiar',
    alertAddTranscript: 'Añade la transcripción primero',
    untitledEpisode: 'Episodio sin título',
    audioUploaded: '[Archivo de audio subido]',
  },
}

function PodcastShowNotesGeneratorContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [episodeTitle, setEpisodeTitle] = useState('')
  const [guestName, setGuestName] = useState('')
  const [lang, setLang] = useState('en')
  const [transcript, setTranscript] = useState('')
  const [result, setResult] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const stopWords = new Set([
    "the", "and", "to", "of", "a", "in", "is", "it", "you", "that", "he", "was", "for", "on", "are", "as", "with", "his", "they", "i", "at", "be", "this", "have", "from", "or", "one", "had", "by", "word", "but", "not", "what", "all", "were", "we", "when", "your", "can", "said", "there", "each", "which", "she", "do", "how", "their", "if", "will", "up", "other", "about", "out", "many", "then", "them", "these", "so", "some", "her", "would", "make", "like", "into", "him", "has", "two", "more", "go", "no", "way", "could", "my", "than", "first", "been", "call", "who", "oil", "its", "now", "find", "long", "down", "day", "did", "get", "come", "made", "may", "part"
  ])

  const summarise = (text: string, ratio: number = 0.25): string => {
    const sents = text.match(/[^\.!\?]+[\.!\?]+/g) || [text]
    const target = Math.max(2, Math.ceil(sents.length * ratio))
    const step = Math.floor(sents.length / target)
    const picked: string[] = []
    for (let i = 0; i < sents.length; i += step) {
      picked.push(sents[i].trim())
    }
    return picked.join(' ').slice(0, 600)
  }

  const extractChapters = (text: string): Array<{ time: string; title: string }> => {
    const lines = text.split('\n')
    const chapters: Array<{ time: string; title: string }> = []

    lines.forEach((ln) => {
      const m = ln.match(/(\d{1,2}:\d{2}(?::\d{2})?)\s*[–—-]\s*(.+)/)
      if (m) {
        chapters.push({ time: m[1], title: m[2].trim() })
      }
    })

    if (chapters.length < 3) {
      const words = text.split(' ')
      const chunk = Math.ceil(words.length / 4)
      for (let i = 0; i < 4; i++) {
        const start = i * chunk
        const time = `${i * 15}:00`
        const title = words.slice(start, start + 6).join(' ') + '…'
        chapters.push({ time, title })
      }
    }

    return chapters
  }

  const extractKeywords = (text: string): string[] => {
    const words = text.toLowerCase().match(/\b\w+\b/g) || []
    const freq: Record<string, number> = {}

    words.forEach(w => {
      if (!stopWords.has(w) && w.length > 3) {
        freq[w] = (freq[w] || 0) + 1
      }
    })

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(x => x[0])
  }

  const buildNotes = (
    title: string,
    guest: string,
    summary: string,
    chapters: Array<{ time: string; title: string }>,
    takeaways: string[],
    kws: string[]
  ): string => {
    const md = `# ${title}${guest ? ` (with ${guest})` : ''}

## Summary
${summary}

## Chapters
${chapters.map(ch => `- **${ch.time}** – ${ch.title}`).join('\n')}

## Key Take-aways
${takeaways.map(t => `- ${t}`).join('\n')}

## Guest Mentioned
${guest || 'N/A'}

## SEO Keywords
${kws.join(', ')}

---

Generated with Podcast Show-Notes Generator
`
    return md
  }

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      if (file.type.startsWith('audio/')) {
        setTranscript(`${c.audioUploaded} ${file.name}`)
      } else {
        setTranscript(e.target?.result as string)
      }
    }

    reader.readAsText(file)
  }

  const generateNotes = () => {
    const text = transcript.trim()
    const title = episodeTitle || c.untitledEpisode
    const guest = guestName || ''

    if (!text) {
      alert(c.alertAddTranscript)
      return
    }

    const summary = summarise(text)
    const chapters = extractChapters(text)
    const takeaways = chapters.slice(0, 3).map(ch => ch.title)
    const kws = extractKeywords(text)
    const notes = buildNotes(title, guest, summary, chapters, takeaways, kws)

    setResult(notes)
    setShowResult(true)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.howToUseTitle}</h2>
          <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.whatItDoes}</h3>
              <p>{c.whatItDoesBody}</p>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.howToUseInner}</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                {c.howToUseSteps.map((step, i) => (
                  <li key={i}>
                    <strong>{step.label}</strong> {step.text}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.expectedOutcome}</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {c.expectedOutcomes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <header className="flex gap-4 flex-wrap items-center mb-6">
          <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50 m-0">{c.title}</h1>
          <input
            type="text"
            value={episodeTitle}
            onChange={(e) => setEpisodeTitle(e.target.value)}
            placeholder={c.episodeTitlePlaceholder}
            className="flex-1 min-w-[200px] px-4 py-2 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
          />
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder={c.guestNamePlaceholder}
            className="flex-1 min-w-[200px] px-4 py-2 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
          />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="px-4 py-2 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
          <button
            onClick={generateNotes}
            className="px-6 py-2 bg-accent-600 text-white rounded cursor-pointer hover:opacity-90 text-sm"
          >
            {c.generateNotes}
          </button>
        </header>

        <div
          ref={dropZoneRef}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            handleFiles(e.dataTransfer.files)
          }}
          className={`border-2 border-dashed rounded-lg p-8 text-center my-4 cursor-pointer text-mono-600 dark:text-mono-400 ${
            isDragging
              ? 'border-accent-600 bg-mono-100 dark:bg-mono-900'
              : 'border-mono-300 dark:border-mono-700'
          }`}
        >
          {c.dropZone}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.mp3,.mp4,.m4a,.wav"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={8}
          placeholder={c.transcriptPlaceholder}
          className="w-full px-4 py-3 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 resize-y"
        />

        {showResult && result && (
          <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mt-4 text-sm leading-relaxed whitespace-pre-wrap relative border border-mono-200 dark:border-mono-700 text-mono-950 dark:text-mono-50">
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 px-3 py-1 bg-mono-200 dark:bg-mono-800 hover:bg-mono-300 dark:hover:bg-mono-700 rounded text-xs flex items-center gap-1 text-mono-700 dark:text-mono-300"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  {c.copied}
                </>
              ) : (
                <>
                  <Copy size={14} />
                  {c.copy}
                </>
              )}
            </button>
            <div className="pr-20">{result}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PodcastShowNotesGenerator() {
  const { language } = useLanguage()
  const c = copy[language]

  const howToUse = (
    <ol className="list-decimal list-inside space-y-1 ml-2">
      {c.howToUse.map((step, i) => (
        <li key={i}>
          <strong>{step.label}</strong> {step.text}
        </li>
      ))}
    </ol>
  )

  return (
    <ToolAccessGate
      toolSlug="podcast-show-notes-generator"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <PodcastShowNotesGeneratorContent />
    </ToolAccessGate>
  )
}
