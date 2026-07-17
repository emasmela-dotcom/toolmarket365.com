'use client'

import { useState, useRef } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    toolName: 'Content Repurposer',
    toolDescription:
      'Repurposes long-form content into multiple formats for different platforms. Converts blog posts, articles, or videos into LinkedIn posts, Twitter threads, Instagram captions, TikTok scripts, emails, and carousel formats.',
    howToUse: [
      { label: 'Paste content:', text: 'Drag and drop a file or paste your long-form content' },
      { label: 'Click "Repurpose":', text: 'The tool automatically converts your content into multiple formats' },
      { label: 'Review output:', text: 'See repurposed content for LinkedIn, Twitter, Instagram, TikTok, email, and carousel formats' },
      { label: 'Copy or download:', text: 'Copy individual formats or download all as a ZIP file' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Takes one piece of content (blog post, article, video transcript, etc.) and automatically repurposes it into multiple formats for different platforms: LinkedIn posts, Twitter threads, Instagram captions, TikTok scripts, email blurbs, and carousel outlines.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Add your content:', text: 'Drag & drop text files/PDFs/audio, click drop zone to browse, paste text directly, or paste YouTube URL' },
      { label: 'Click "Repurpose"', text: 'button to process your content' },
      { label: 'Get repurposed content', text: 'for LinkedIn (5 posts), Twitter (5 posts), Instagram (3 captions), TikTok (60s script), Email blurb, and Carousel outline' },
      { label: 'Export options:', text: 'Copy All or Download ZIP as markdown file' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      '6 different content formats from one source',
      'Platform-optimized content for each platform',
      'Ready-to-use posts, captions, and scripts',
      'Structured output organized by platform',
      'Exportable for easy copying or saving',
    ],
    title: 'Content Repurposer',
    supportedPlatforms: 'Supported Platforms:',
    dropZone: 'Drop text/PDF/audio or paste YouTube URL / raw text',
    textareaPlaceholder: 'Or paste raw text here…',
    repurpose: 'Repurpose',
    copied: 'Copied!',
    copyAll: 'Copy All',
    downloadZip: 'Download ZIP',
    addContentAlert: 'Add text or drop a file first',
    pdfNotice: (name: string) => `[PDF file] ${name} - Please paste text content manually`,
    audioNotice: (name: string) => `[Audio file] ${name} - Please paste transcript manually`,
    tiktokScene1: 'Show the problem',
    tiktokScene2: 'Reveal the fix',
    tiktokCta: 'Follow for more',
    carouselProblem: "What's broken",
    carouselMyth: 'Common myth',
    carouselFix: "Here's the fix",
    carouselProof: 'Proof it works',
    carouselCta: 'Try it & tag us',
    outputLinkedin: '=== LINKEDIN (5 posts) ===',
    outputTwitter: '=== TWITTER (5 posts) ===',
    outputInstagram: '=== INSTAGRAM (3 captions) ===',
    outputTiktok: '=== TIKTOK (60 s script) ===',
    outputEmail: '=== EMAIL BLURB ===',
    outputCarousel: '=== CAROUSEL OUTLINE ===',
    mdHeading: '# Repurposed Content',
    templates: {
      linkedin: [
        '🚀 %s\n\nKey takeaway → %s\n\nWhat\'s your experience?',
        '🔍 %s\n\nMost people skip this step: %s\n\nSave this post for later.',
        '📊 %s\n\n3 numbers to remember:\n1️⃣ %s\n2️⃣ %s\n3️⃣ %s\n\nWhich surprised you most?',
        '💡 %s\n\nThe framework I use:\n→ %s\n→ %s\n→ %s\n\nSteal it.',
        '✍️ %s\n\nI wrote a 5-step checklist:\n☐ %s\n☐ %s\n☐ %s\n☐ %s\n☐ %s\n\nPrint it out.',
      ],
      twitter: [
        '%s → thread 🧵 (1/5)\n\n%s',
        'Hot take: %s\n\n%s',
        'Stop scrolling → %s\n\n%s',
        '1/ %s\n\n%s',
        '%s\n\n%s\n\nRT if useful.',
      ],
      ig: [
        'Swipe ➡️ to see %s\n\n%s\n\n#tip #contentcreator #growth',
        'Save this ❗%s\n\n%s\n\n#marketing #hacks #saveable',
        'Caption this 👇 %s\n\n%s\n\n#comment #engagement #post',
      ],
      tiktok: ['%s\n\nHook: %s\n\nScene 1: %s\n\nScene 2: %s\n\nCTA: %s'],
      email: ['Subject: %s (in under 2 min)\n\nHi {name},\n\n%s\n\nCheers,\nYou'],
      carousel: [
        'Slide 1: Title → %s\nSlide 2: Problem → %s\nSlide 3: Myth → %s\nSlide 4: Solution → %s\nSlide 5: Proof → %s\nSlide 6: CTA → %s',
      ],
    },
  },
  es: {
    toolName: 'Reutilizador de contenido',
    toolDescription:
      'Reutiliza contenido largo en múltiples formatos para distintas plataformas. Convierte entradas de blog, artículos o videos en publicaciones de LinkedIn, hilos de Twitter, pies de Instagram, guiones de TikTok, correos y formatos de carrusel.',
    howToUse: [
      { label: 'Pega el contenido:', text: 'Arrastra y suelta un archivo o pega tu contenido largo' },
      { label: 'Haz clic en "Reutilizar":', text: 'La herramienta convierte automáticamente tu contenido en múltiples formatos' },
      { label: 'Revisa la salida:', text: 'Ve el contenido reutilizado para LinkedIn, Twitter, Instagram, TikTok, correo y carrusel' },
      { label: 'Copia o descarga:', text: 'Copia formatos individuales o descarga todo como archivo ZIP' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Toma una pieza de contenido (entrada de blog, artículo, transcripción de video, etc.) y la reutiliza automáticamente en múltiples formatos para distintas plataformas: publicaciones de LinkedIn, hilos de Twitter, pies de Instagram, guiones de TikTok, correos breves y esquemas de carrusel.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Agrega tu contenido:', text: 'Arrastra y suelta archivos de texto/PDF/audio, haz clic en la zona para buscar, pega texto directamente o pega una URL de YouTube' },
      { label: 'Haz clic en "Reutilizar"', text: 'para procesar tu contenido' },
      { label: 'Obtén contenido reutilizado', text: 'para LinkedIn (5 publicaciones), Twitter (5 publicaciones), Instagram (3 pies), TikTok (guion de 60 s), correo breve y esquema de carrusel' },
      { label: 'Opciones de exportación:', text: 'Copiar todo o descargar ZIP como archivo markdown' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      '6 formatos de contenido distintos desde una sola fuente',
      'Contenido optimizado para cada plataforma',
      'Publicaciones, pies y guiones listos para usar',
      'Salida estructurada organizada por plataforma',
      'Exportable para copiar o guardar fácilmente',
    ],
    title: 'Reutilizador de contenido',
    supportedPlatforms: 'Plataformas compatibles:',
    dropZone: 'Suelta texto/PDF/audio o pega URL de YouTube / texto sin formato',
    textareaPlaceholder: 'O pega texto sin formato aquí…',
    repurpose: 'Reutilizar',
    copied: '¡Copiado!',
    copyAll: 'Copiar todo',
    downloadZip: 'Descargar ZIP',
    addContentAlert: 'Agrega texto o suelta un archivo primero',
    pdfNotice: (name: string) => `[Archivo PDF] ${name} - Pega el contenido de texto manualmente`,
    audioNotice: (name: string) => `[Archivo de audio] ${name} - Pega la transcripción manualmente`,
    tiktokScene1: 'Muestra el problema',
    tiktokScene2: 'Revela la solución',
    tiktokCta: 'Sígueme para más',
    carouselProblem: 'Qué está roto',
    carouselMyth: 'Mito común',
    carouselFix: 'Aquí está la solución',
    carouselProof: 'Prueba de que funciona',
    carouselCta: 'Pruébalo y etiquétanos',
    outputLinkedin: '=== LINKEDIN (5 publicaciones) ===',
    outputTwitter: '=== TWITTER (5 publicaciones) ===',
    outputInstagram: '=== INSTAGRAM (3 pies) ===',
    outputTiktok: '=== TIKTOK (guion de 60 s) ===',
    outputEmail: '=== CORREO BREVE ===',
    outputCarousel: '=== ESQUEMA DE CARRUSEL ===',
    mdHeading: '# Contenido reutilizado',
    templates: {
      linkedin: [
        '🚀 %s\n\nConclusión clave → %s\n\n¿Cuál es tu experiencia?',
        '🔍 %s\n\nLa mayoría omite este paso: %s\n\nGuarda esta publicación.',
        '📊 %s\n\n3 números a recordar:\n1️⃣ %s\n2️⃣ %s\n3️⃣ %s\n\n¿Cuál te sorprendió más?',
        '💡 %s\n\nEl marco que uso:\n→ %s\n→ %s\n→ %s\n\nCópialo.',
        '✍️ %s\n\nEscribí una lista de 5 pasos:\n☐ %s\n☐ %s\n☐ %s\n☐ %s\n☐ %s\n\nImprímela.',
      ],
      twitter: [
        '%s → hilo 🧵 (1/5)\n\n%s',
        'Opinión fuerte: %s\n\n%s',
        'Deja de desplazar → %s\n\n%s',
        '1/ %s\n\n%s',
        '%s\n\n%s\n\nRT si te sirvió.',
      ],
      ig: [
        'Desliza ➡️ para ver %s\n\n%s\n\n#consejo #creadordecontenido #crecimiento',
        'Guarda esto ❗%s\n\n%s\n\n#marketing #trucos #guardable',
        'Escribe un pie 👇 %s\n\n%s\n\n#comentario #engagement #publicacion',
      ],
      tiktok: ['%s\n\nGancho: %s\n\nEscena 1: %s\n\nEscena 2: %s\n\nCTA: %s'],
      email: ['Asunto: %s (en menos de 2 min)\n\nHola {name},\n\n%s\n\nSaludos,\nTú'],
      carousel: [
        'Diapositiva 1: Título → %s\nDiapositiva 2: Problema → %s\nDiapositiva 3: Mito → %s\nDiapositiva 4: Solución → %s\nDiapositiva 5: Prueba → %s\nDiapositiva 6: CTA → %s',
      ],
    },
  },
}

function countWords(str: string): number {
  return str.trim().split(/\s+/).length
}

function summarise(text: string, ratio: number = 0.25): string {
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text]
  const target = Math.max(1, Math.ceil(sentences.length * ratio))
  const idx = Math.floor(sentences.length / 2)
  return sentences.slice(idx, idx + target).join(' ').trim()
}

type Copy = (typeof copy)['en']

function ContentRepurposerContent({ c }: { c: Copy }) {
  const [manual, setManual] = useState('')
  const [output, setOutput] = useState('')
  const [showOutput, setShowOutput] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      let text = ''
      if (file.type === 'application/pdf') {
        text = c.pdfNotice(file.name)
      } else if (file.type.startsWith('audio/')) {
        text = c.audioNotice(file.name)
      } else {
        text = e.target?.result as string
      }
      setManual(text)
    }

    if (file.type.startsWith('text') || file.type === 'application/pdf') {
      reader.readAsText(file)
    } else if (file.type.startsWith('audio/')) {
      reader.readAsDataURL(file)
    } else {
      reader.readAsText(file)
    }
  }

  const fillTemplate = (template: string, summary: string, maxLen?: number) => {
    let result = template
    const value = maxLen ? summary.slice(0, maxLen) : summary
    const matches = result.match(/%s/g) || []
    matches.forEach(() => {
      result = result.replace('%s', value)
    })
    return result
  }

  const handleRepurpose = () => {
    const raw = manual.trim()
    if (!raw) {
      alert(c.addContentAlert)
      return
    }

    const summary = summarise(raw, 0.3)
    const templates = c.templates

    const li = templates.linkedin
      .map((t) => fillTemplate(t, summary))
      .join('\n\n—\n\n')

    const tw = templates.twitter
      .map((t) => fillTemplate(t, summary, 200))
      .join('\n\n—\n\n')

    const ig = templates.ig
      .map((t) => fillTemplate(t, summary, 150))
      .join('\n\n—\n\n')

    const tt = templates.tiktok[0]
      .replace('%s', summary.slice(0, 40))
      .replace('%s', summary.slice(0, 20))
      .replace('%s', c.tiktokScene1)
      .replace('%s', c.tiktokScene2)
      .replace('%s', c.tiktokCta)

    const em = templates.email[0]
      .replace('%s', summary.slice(0, 40))
      .replace('%s', summary.slice(0, 80))

    const car = templates.carousel[0]
      .replace('%s', summary.slice(0, 30))
      .replace('%s', c.carouselProblem)
      .replace('%s', c.carouselMyth)
      .replace('%s', c.carouselFix)
      .replace('%s', c.carouselProof)
      .replace('%s', c.carouselCta)

    const fullOutput = `${c.outputLinkedin}
${li}

${c.outputTwitter}
${tw}

${c.outputInstagram}
${ig}

${c.outputTiktok}
${tt}

${c.outputEmail}
${em}

${c.outputCarousel}
${car}
`

    setOutput(fullOutput)
    setShowOutput(true)
  }

  const handleCopyAll = () => {
    navigator.clipboard.writeText(output)
    setCopyStatus(c.copied)
    setTimeout(() => setCopyStatus(''), 2000)
  }

  const handleDownload = () => {
    const md = `${c.mdHeading}\n\n${output}`
    const blob = new Blob([md], { type: 'text/markdown' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'repurposed.md'
    a.click()
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 text-mono-950 dark:text-mono-50 p-4 max-w-4xl mx-auto">
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

      <header className="flex gap-4 flex-wrap items-center mb-4">
        <h1 className="text-2xl font-bold m-0">{c.title}</h1>
      </header>

      <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-4 mb-6">
        <p className="text-xs font-semibold text-mono-700 dark:text-mono-300 mb-2">{c.supportedPlatforms}</p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">💼 LinkedIn</span>
          <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">🐦 Twitter/X</span>
          <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">📸 Instagram</span>
          <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">🎵 TikTok</span>
          <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">📧 Email</span>
        </div>
      </div>

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
        className={`border-2 border-dashed rounded-lg p-8 text-center my-4 cursor-pointer ${
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
        accept="text/*,.txt,.pdf,.mp3,.mp4,.m4a"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <textarea
        value={manual}
        onChange={(e) => setManual(e.target.value)}
        placeholder={c.textareaPlaceholder}
        rows={5}
        className="w-full p-3 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 resize-y"
      />

      <button
        onClick={handleRepurpose}
        className="mt-4 px-6 py-3 bg-accent-600 text-white rounded font-medium hover:opacity-90 cursor-pointer"
      >
        {c.repurpose}
      </button>

      {showOutput && (
        <>
          <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mt-4 text-sm leading-relaxed whitespace-pre-wrap">
            {output}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCopyAll}
              className="px-4 py-2 bg-mono-200 dark:bg-mono-700 rounded hover:bg-mono-300 dark:hover:bg-mono-600 text-sm"
            >
              {copyStatus || c.copyAll}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-mono-200 dark:bg-mono-700 rounded hover:bg-mono-300 dark:hover:bg-mono-600 text-sm"
            >
              {c.downloadZip}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function ContentRepurposer() {
  const { language } = useLanguage()
  const c = copy[language]

  const howToUse = (
    <div>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        {c.howToUse.map((step, i) => (
          <li key={i}>
            <strong>{step.label}</strong> {step.text}
          </li>
        ))}
      </ol>
    </div>
  )

  return (
    <ToolAccessGate
      toolSlug="content-repurposer"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <ContentRepurposerContent c={c} />
    </ToolAccessGate>
  )
}
