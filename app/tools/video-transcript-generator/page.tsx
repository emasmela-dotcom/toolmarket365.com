'use client'

import React, { useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    toolName: 'Video Transcript Generator',
    toolDescription:
      'Generates transcripts from video URLs or pasted text. Supports YouTube videos and manual text input. Creates searchable, editable transcripts for content repurposing and accessibility.',
    howToUse: [
      { label: 'Choose mode:', text: 'Select "Fetch from URL" or "Paste Text"' },
      { label: 'For URL mode:', text: 'Enter a YouTube video URL and click "Fetch Transcript"' },
      { label: 'For paste mode:', text: 'Paste your transcript text directly' },
      { label: 'Edit transcript:', text: 'Review and edit the generated transcript' },
      { label: 'Copy or download:', text: 'Copy the transcript or download as text file' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Extract transcripts from YouTube videos automatically. Get the full text content of any YouTube video for use in content creation, accessibility, SEO, or content repurposing.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter YouTube URL:', text: 'Paste a YouTube video URL (supports youtu.be, youtube.com/watch, or youtube.com/embed formats)' },
      { label: 'Click "Get Transcript"', text: 'button to extract the video ID and fetch the transcript' },
      { label: 'Use Transcript:', text: 'View the full transcript, click "Copy" to copy to clipboard, click "Download" to save as text file, see word count for reference' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Full transcript of the YouTube video',
      'Clean, readable text format',
      'Word count displayed',
      'Easy copy and download functionality',
      'Video ID extraction confirmation',
    ],
    title: 'Video Transcript Generator',
    fetchMode: 'Fetch from YouTube (may fail)',
    pasteMode: 'Paste / Upload transcript',
    youtubeUrl: 'YouTube URL',
    urlPlaceholder: 'https://youtu.be/xxxxxx or https://www.youtube.com/watch?v=xxxxxx',
    fetchNote:
      'Note: YouTube often blocks automated transcript fetching even when CC exists. Use "Paste / Upload" if this fails.',
    fetching: 'Fetching Transcript...',
    getTranscript: 'Get Transcript',
    uploadLabel: 'Upload (.vtt / .srt / .txt)',
    uploadTip:
      'Tip: You can copy the YouTube transcript and paste it below, or upload caption files.',
    removeBracketed: 'Remove bracketed cues (e.g. [Music])',
    pasteLabel: 'Paste transcript / captions',
    pastePlaceholder: 'Paste raw transcript text, or caption file contents (VTT/SRT)...',
    loaded: (name: string) => `Loaded: ${name}`,
    cleanFormat: 'Clean & Format Transcript',
    transcript: 'Transcript',
    copy: 'Copy',
    download: 'Download',
    words: (n: number) => `${n} words`,
    howItWorks: 'How it works:',
    howItWorksSteps: [
      'Paste a YouTube video URL',
      'Click "Get Transcript" to extract the transcript',
      'Copy or download the transcript for your use',
    ],
    howItWorksNote:
      'Note: Some videos do not provide transcripts, and YouTube may rate-limit requests.',
    errorValidUrl: 'Please enter a valid YouTube URL',
    errorExtractId: 'Could not extract video ID from URL',
    errorFetchFailed: 'Failed to fetch transcript',
    errorNoText:
      'No transcript text found. If you uploaded a .vtt/.srt, make sure it contains caption lines.',
    alertCopied: 'Transcript copied to clipboard!',
  },
  es: {
    toolName: 'Generador de transcripciones de video',
    toolDescription:
      'Genera transcripciones desde URLs de video o texto pegado. Compatible con videos de YouTube y entrada manual. Crea transcripciones editables y buscables para reutilizar contenido y accesibilidad.',
    howToUse: [
      { label: 'Elige el modo:', text: 'Selecciona "Obtener desde URL" o "Pegar texto"' },
      { label: 'Modo URL:', text: 'Introduce la URL de un video de YouTube y haz clic en "Obtener transcripción"' },
      { label: 'Modo pegar:', text: 'Pega el texto de la transcripción directamente' },
      { label: 'Edita la transcripción:', text: 'Revisa y edita la transcripción generada' },
      { label: 'Copia o descarga:', text: 'Copia la transcripción o descárgala como archivo de texto' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Extrae transcripciones de videos de YouTube automáticamente. Obtén el texto completo de cualquier video de YouTube para creación de contenido, accesibilidad, SEO o reutilización.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Introduce la URL de YouTube:', text: 'Pega una URL de video de YouTube (compatible con youtu.be, youtube.com/watch o youtube.com/embed)' },
      { label: 'Haz clic en "Obtener transcripción"', text: 'para extraer el ID del video y obtener la transcripción' },
      { label: 'Usa la transcripción:', text: 'Consulta el texto completo, haz clic en "Copiar" para el portapapeles, en "Descargar" para guardar como archivo de texto, y revisa el recuento de palabras' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Transcripción completa del video de YouTube',
      'Formato de texto limpio y legible',
      'Recuento de palabras mostrado',
      'Copia y descarga sencillas',
      'Confirmación de extracción del ID del video',
    ],
    title: 'Generador de transcripciones de video',
    fetchMode: 'Obtener de YouTube (puede fallar)',
    pasteMode: 'Pegar / subir transcripción',
    youtubeUrl: 'URL de YouTube',
    urlPlaceholder: 'https://youtu.be/xxxxxx o https://www.youtube.com/watch?v=xxxxxx',
    fetchNote:
      'Nota: YouTube a menudo bloquea la obtención automática de transcripciones aunque existan subtítulos. Usa "Pegar / subir" si falla.',
    fetching: 'Obteniendo transcripción...',
    getTranscript: 'Obtener transcripción',
    uploadLabel: 'Subir (.vtt / .srt / .txt)',
    uploadTip:
      'Consejo: Puedes copiar la transcripción de YouTube y pegarla abajo, o subir archivos de subtítulos.',
    removeBracketed: 'Eliminar indicaciones entre corchetes (p. ej. [Música])',
    pasteLabel: 'Pegar transcripción / subtítulos',
    pastePlaceholder: 'Pega texto de transcripción en bruto o contenido de archivo de subtítulos (VTT/SRT)...',
    loaded: (name: string) => `Cargado: ${name}`,
    cleanFormat: 'Limpiar y formatear transcripción',
    transcript: 'Transcripción',
    copy: 'Copiar',
    download: 'Descargar',
    words: (n: number) => `${n} palabras`,
    howItWorks: 'Cómo funciona:',
    howItWorksSteps: [
      'Pega la URL de un video de YouTube',
      'Haz clic en "Obtener transcripción" para extraer la transcripción',
      'Copia o descarga la transcripción para tu uso',
    ],
    howItWorksNote:
      'Nota: Algunos videos no tienen transcripción y YouTube puede limitar las solicitudes.',
    errorValidUrl: 'Por favor introduce una URL válida de YouTube',
    errorExtractId: 'No se pudo extraer el ID del video de la URL',
    errorFetchFailed: 'Error al obtener la transcripción',
    errorNoText:
      'No se encontró texto de transcripción. Si subiste un .vtt/.srt, asegúrate de que contenga líneas de subtítulos.',
    alertCopied: '¡Transcripción copiada al portapapeles!',
  },
}

function VideoTranscriptGeneratorContent({ c }: { c: typeof copy.en }) {
  const [mode, setMode] = useState<'fetch' | 'paste'>('fetch')
  const [url, setUrl] = useState('')
  const [transcript, setTranscript] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoId, setVideoId] = useState<string | null>(null)
  const [rawTranscript, setRawTranscript] = useState('')
  const [sourceLabel, setSourceLabel] = useState<string | null>(null)
  const [removeBracketed, setRemoveBracketed] = useState(true)

  const extractVideoId = (videoUrl: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
    ]

    for (const pattern of patterns) {
      const match = videoUrl.match(pattern)
      if (match && match[1]) {
        return match[1].split(/[?&]/)[0]
      }
    }

    return null
  }

  const fetchTranscript = async () => {
    const u = url.trim()

    if (!u.includes('youtu')) {
      setError(c.errorValidUrl)
      return
    }

    const id = extractVideoId(u)
    if (!id) {
      setError(c.errorExtractId)
      return
    }

    setIsLoading(true)
    setError(null)
    setTranscript('')
    setVideoId(id)

    try {
      const response = await fetch(`/api/transcript?id=${encodeURIComponent(id)}`)

      if (!response.ok) {
        const maybe = await response.json().catch(() => null)
        const msg = maybe?.error || c.errorFetchFailed
        throw new Error(msg)
      }

      const data = await response.json()
      setTranscript(data.transcript)
    } catch (e) {
      setError((e as Error)?.message || c.errorFetchFailed)
      setTranscript('')
    } finally {
      setIsLoading(false)
    }
  }

  const cleanTranscript = (input: string): string => {
    const lines = input
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map((l) => l.trim())

    const out: string[] = []

    const isTimestampLine = (l: string) =>
      /-->\s*\d{1,2}:\d{2}/.test(l) || /^\d{1,2}:\d{2}:\d{2}[,\.]\d{1,3}\s*-->/.test(l)

    const stripTags = (l: string) =>
      l
        .replace(/<[^>]*>/g, '')
        .replace(/\{\\an\d+\}/g, '')
        .trim()

    const isIndexLine = (l: string) => /^\d+$/.test(l)

    const isWebVttHeader = (l: string) => /^WEBVTT/i.test(l)

    const isSrtTimestampLine = (l: string) =>
      /^\d{1,2}:\d{2}:\d{2}[,\.]\d{1,3}\s*-->\s*\d{1,2}:\d{2}:\d{2}[,\.]\d{1,3}/.test(l)

    const isNote = (l: string) => /^NOTE\b/i.test(l)

    let inNoteBlock = false
    for (const lRaw of lines) {
      const l0 = lRaw
      if (!l0) {
        inNoteBlock = false
        continue
      }

      if (isWebVttHeader(l0)) continue
      if (isNote(l0)) {
        inNoteBlock = true
        continue
      }
      if (inNoteBlock) continue

      if (isIndexLine(l0)) continue
      if (isTimestampLine(l0) || isSrtTimestampLine(l0)) continue

      let l = stripTags(l0)
      if (!l) continue

      if (/^(align|position|line|size):/i.test(l)) continue

      if (removeBracketed) {
        l = l
          .replace(/\[[^\]]+\]/g, '')
          .replace(/\([^\)]+\)/g, '')
          .replace(/\s+/g, ' ')
          .trim()
        if (!l) continue
      }

      out.push(l)
    }

    const deduped: string[] = []
    for (const l of out) {
      const prev = deduped[deduped.length - 1]
      if (prev && prev.toLowerCase() === l.toLowerCase()) continue
      deduped.push(l)
    }

    return deduped.join(' ').replace(/\s+/g, ' ').trim()
  }

  const handlePasteConvert = () => {
    setError(null)
    setTranscript('')
    const cleaned = cleanTranscript(rawTranscript)
    if (!cleaned) {
      setError(c.errorNoText)
      return
    }
    setTranscript(cleaned)
  }

  const handleFile = async (file: File) => {
    setError(null)
    setTranscript('')
    setSourceLabel(file.name)
    const text = await file.text()
    setRawTranscript(text)
  }

  const copyTranscript = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript)
      alert(c.alertCopied)
    }
  }

  const downloadTranscript = () => {
    if (transcript) {
      const blob = new Blob([transcript], { type: 'text/plain' })
      const downloadUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      const base =
        mode === 'fetch'
          ? videoId || extractVideoId(url) || 'video'
          : (sourceLabel || 'transcript').replace(/\.[a-z0-9]+$/i, '') || 'transcript'
      a.download = `transcript-${base}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(downloadUrl)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{c.howToUseTitle}</h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.whatItDoes}</h3>
              <p>{c.whatItDoesBody}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.howToUseInner}</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                {c.howToUseSteps.map((step, i) => (
                  <li key={i}><strong>{step.label}</strong> {step.text}</li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.expectedOutcome}</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {c.expectedOutcomes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{c.title}</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setMode('fetch')
              setError(null)
            }}
            className={`px-4 py-2 rounded-md text-sm border ${
              mode === 'fetch'
                ? 'bg-blue-600 border-blue-700 text-white'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            {c.fetchMode}
          </button>
          <button
            onClick={() => {
              setMode('paste')
              setError(null)
            }}
            className={`px-4 py-2 rounded-md text-sm border ${
              mode === 'paste'
                ? 'bg-blue-600 border-blue-700 text-white'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            {c.pasteMode}
          </button>
        </div>

        {mode === 'fetch' ? (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {c.youtubeUrl}
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={c.urlPlaceholder}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') fetchTranscript()
                }}
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{c.fetchNote}</p>
            </div>

            <button
              onClick={fetchTranscript}
              disabled={isLoading || !url.trim()}
              className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors"
            >
              {isLoading ? c.fetching : c.getTranscript}
            </button>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {c.uploadLabel}
                </label>
                <input
                  type="file"
                  accept=".vtt,.srt,.txt,text/plain"
                  className="w-full text-sm text-gray-700 dark:text-gray-200"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) void handleFile(f)
                  }}
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{c.uploadTip}</p>
              </div>

              <div className="flex items-end gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={removeBracketed}
                    onChange={(e) => setRemoveBracketed(e.target.checked)}
                  />
                  {c.removeBracketed}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {c.pasteLabel}
              </label>
              <textarea
                value={rawTranscript}
                onChange={(e) => setRawTranscript(e.target.value)}
                rows={10}
                placeholder={c.pastePlaceholder}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-vertical"
              />
              {sourceLabel && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{c.loaded(sourceLabel)}</p>
              )}
            </div>

            <button
              onClick={handlePasteConvert}
              disabled={!rawTranscript.trim()}
              className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors"
            >
              {c.cleanFormat}
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200 whitespace-pre-line">{error}</p>
          </div>
        )}

        {transcript && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{c.transcript}</h2>
              <div className="flex gap-2">
                <button
                  onClick={copyTranscript}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm transition-colors"
                >
                  {c.copy}
                </button>
                <button
                  onClick={downloadTranscript}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
                >
                  {c.download}
                </button>
              </div>
            </div>
            <textarea
              id="out"
              value={transcript}
              readOnly
              rows={15}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-vertical"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {c.words(transcript.split(/\s+/).length)}
            </p>
          </div>
        )}

        {!transcript && !error && (
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">{c.howItWorks}</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
              {c.howItWorksSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-blue-800 dark:text-blue-200">{c.howItWorksNote}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function VideoTranscriptGenerator() {
  const { language } = useLanguage()
  const c = copy[language]

  const howToUse = (
    <div>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        {c.howToUse.map((step, i) => (
          <li key={i}><strong>{step.label}</strong> {step.text}</li>
        ))}
      </ol>
    </div>
  )

  return (
    <ToolAccessGate
      toolSlug="video-transcript-generator"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <VideoTranscriptGeneratorContent c={c} />
    </ToolAccessGate>
  )
}
