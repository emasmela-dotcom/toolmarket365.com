'use client'

import { useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    toolName: 'Content Idea Generator',
    toolDescription:
      'Generate unlimited content ideas for your niche. Create titles, keywords, angles, formats, and difficulty levels to fuel your content calendar.',
    howToUse: [
      { label: 'Enter your niche:', text: 'Type your content niche or topic area (e.g., "fitness", "cooking", "tech")' },
      { label: 'Set idea count:', text: 'Choose how many content ideas to generate (default: 30)' },
      { label: 'Click "Generate Ideas"', text: 'to create content ideas' },
      { label: 'Review results:', text: 'Each idea includes title, keywords, angle, format, and difficulty' },
      { label: 'Export or copy:', text: 'Export all ideas or copy individual ones to your content calendar' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      "Generates content ideas based on your niche or topic. Provides creative content suggestions to help you overcome writer's block and plan your content strategy.",
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter your niche:', text: 'Type your content niche or topic (e.g., "fitness", "cooking", "marketing")' },
      { label: 'Click "Generate Ideas"', text: 'to get content suggestions' },
      { label: 'Review ideas:', text: 'See a list of content ideas tailored to your niche' },
      { label: 'Use the ideas:', text: 'Copy ideas you like and use them for your content planning' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'List of content ideas relevant to your niche',
      'Creative suggestions to inspire your content',
      'Ideas you can use immediately for posts, videos, or articles',
      "Help overcoming content creator's block",
    ],
    title: 'Content Idea Generator',
    nichePlaceholder: 'e.g. vegan baking',
    ideas30: '30 ideas',
    ideas60: '60 ideas',
    generate: 'Generate',
    copied: 'Copied!',
    copyMarkdown: 'Copy Markdown',
    copyCsv: 'Copy CSV',
    downloadCsv: 'Download CSV',
    primaryKw: 'Primary KW:',
    angleFormatDiff: (angle: string, format: string, diff: string) =>
      `Angle: ${angle} | Format: ${format} | Difficulty: ${diff}`,
    altKws: 'Alt KWs:',
    enterNicheAlert: 'Enter a niche first',
    formats: ['How-To', 'Listicle', 'Comparison', 'Story', 'News-jack', 'Carousel'],
    angles: ['Pain-point', 'Myth-bust', 'Beginner', 'Expert', 'Case-study', 'Trend'],
    difficulties: ['Easy', 'Medium', 'Hard'],
    titleTemplates: [
      (niche: string) => `How to ${niche} like a pro (even if you're a beginner)`,
      (niche: string) => `7 proven ${niche} hacks you haven't tried`,
      (niche: string) => `${niche} vs traditional method: which wins?`,
      (niche: string) => `I tried ${niche} for 30 days—here's what happened`,
      (niche: string) => `Breaking: new ${niche} trend taking over TikTok`,
      (niche: string) => `Swipe → 6 slides that'll change your ${niche} game`,
    ],
    kwTutorial: (niche: string) => `${niche} tutorial`,
    kwGuide: (niche: string) => `${niche} guide`,
    kwTips: (niche: string) => `best ${niche} tips`,
    mdHeading: '# Content Ideas',
    mdMeta: (angle: string, format: string, diff: string) =>
      `- Meta: ${angle} / ${format} / ${diff}`,
    csvHeader: 'Title,Primary KW,Angle,Format,Difficulty',
  },
  es: {
    toolName: 'Generador de ideas de contenido',
    toolDescription:
      'Genera ideas de contenido ilimitadas para tu nicho. Crea títulos, palabras clave, ángulos, formatos y niveles de dificultad para alimentar tu calendario de contenido.',
    howToUse: [
      { label: 'Ingresa tu nicho:', text: 'Escribe tu nicho o tema de contenido (ej. "fitness", "cocina", "tecnología")' },
      { label: 'Define la cantidad:', text: 'Elige cuántas ideas generar (predeterminado: 30)' },
      { label: 'Haz clic en "Generar ideas"', text: 'para crear ideas de contenido' },
      { label: 'Revisa los resultados:', text: 'Cada idea incluye título, palabras clave, ángulo, formato y dificultad' },
      { label: 'Exporta o copia:', text: 'Exporta todas las ideas o copia las que quieras a tu calendario de contenido' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Genera ideas de contenido según tu nicho o tema. Ofrece sugerencias creativas para superar el bloqueo del escritor y planificar tu estrategia de contenido.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Ingresa tu nicho:', text: 'Escribe tu nicho o tema (ej. "fitness", "cocina", "marketing")' },
      { label: 'Haz clic en "Generar ideas"', text: 'para obtener sugerencias de contenido' },
      { label: 'Revisa las ideas:', text: 'Verás una lista de ideas adaptadas a tu nicho' },
      { label: 'Usa las ideas:', text: 'Copia las que te gusten para planificar tu contenido' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Lista de ideas de contenido relevantes para tu nicho',
      'Sugerencias creativas para inspirar tu contenido',
      'Ideas que puedes usar de inmediato en publicaciones, videos o artículos',
      'Ayuda para superar el bloqueo del creador',
    ],
    title: 'Generador de ideas de contenido',
    nichePlaceholder: 'ej. repostería vegana',
    ideas30: '30 ideas',
    ideas60: '60 ideas',
    generate: 'Generar',
    copied: '¡Copiado!',
    copyMarkdown: 'Copiar Markdown',
    copyCsv: 'Copiar CSV',
    downloadCsv: 'Descargar CSV',
    primaryKw: 'KW principal:',
    angleFormatDiff: (angle: string, format: string, diff: string) =>
      `Ángulo: ${angle} | Formato: ${format} | Dificultad: ${diff}`,
    altKws: 'KW alternativas:',
    enterNicheAlert: 'Ingresa un nicho primero',
    formats: ['Tutorial', 'Lista', 'Comparación', 'Historia', 'Noticia', 'Carrusel'],
    angles: ['Punto de dolor', 'Desmitificar', 'Principiante', 'Experto', 'Caso de estudio', 'Tendencia'],
    difficulties: ['Fácil', 'Medio', 'Difícil'],
    titleTemplates: [
      (niche: string) => `Cómo dominar ${niche} como un pro (aunque seas principiante)`,
      (niche: string) => `7 trucos de ${niche} que aún no has probado`,
      (niche: string) => `${niche} vs método tradicional: ¿cuál gana?`,
      (niche: string) => `Probé ${niche} durante 30 días—esto es lo que pasó`,
      (niche: string) => `Última hora: nueva tendencia de ${niche} que arrasa en TikTok`,
      (niche: string) => `Desliza → 6 diapositivas que cambiarán tu juego en ${niche}`,
    ],
    kwTutorial: (niche: string) => `tutorial de ${niche}`,
    kwGuide: (niche: string) => `guía de ${niche}`,
    kwTips: (niche: string) => `mejores consejos de ${niche}`,
    mdHeading: '# Ideas de contenido',
    mdMeta: (angle: string, format: string, diff: string) =>
      `- Meta: ${angle} / ${format} / ${diff}`,
    csvHeader: 'Título,KW principal,Ángulo,Formato,Dificultad',
  },
}

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

interface Idea {
  title: string
  kw: string
  angle: string
  format: string
  diff: string
  altKW: string
}

type Copy = (typeof copy)['en']

function ContentIdeaGeneratorContent({ c }: { c: Copy }) {
  const [niche, setNiche] = useState('')
  const [count, setCount] = useState(30)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [showExport, setShowExport] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')

  const makeTitle = (nicheValue: string): string => {
    const template = rand(c.titleTemplates)
    return template(nicheValue)
  }

  const makeKW = (nicheValue: string): string[] => {
    return [c.kwTutorial(nicheValue), c.kwGuide(nicheValue), c.kwTips(nicheValue)]
  }

  const makeIdea = (nicheValue: string): Idea => {
    const fmt = rand(c.formats)
    const ang = rand(c.angles)
    const diff = rand(c.difficulties)
    const kwList = makeKW(nicheValue)

    return {
      title: makeTitle(nicheValue),
      kw: kwList[0],
      angle: ang,
      format: fmt,
      diff: diff,
      altKW: kwList.slice(1).join(', '),
    }
  }

  const handleGenerate = () => {
    const trimmedNiche = niche.trim()
    if (!trimmedNiche) {
      alert(c.enterNicheAlert)
      return
    }

    const generated: Idea[] = []
    for (let i = 0; i < count; i++) {
      generated.push(makeIdea(trimmedNiche))
    }

    setIdeas(generated)
    setShowExport(true)
  }

  const generateMarkdown = (): string => {
    const md = ideas
      .map((idea) => {
        return `### ${idea.title}\n- KW: \`${idea.kw}\`  \n${c.mdMeta(idea.angle, idea.format, idea.diff)}\n`
      })
      .join('\n')
    return `${c.mdHeading}\n\n${md}`
  }

  const generateCSV = (): string => {
    const lines = [c.csvHeader]
    ideas.forEach((idea) => {
      lines.push(`"${idea.title}","${idea.kw}","${idea.angle}","${idea.format}","${idea.diff}"`)
    })
    return lines.join('\n')
  }

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown())
    setCopyStatus('markdown')
    setTimeout(() => setCopyStatus(''), 1200)
  }

  const handleCopyCSV = () => {
    navigator.clipboard.writeText(generateCSV())
    setCopyStatus('csv')
    setTimeout(() => setCopyStatus(''), 1200)
  }

  const handleDownloadCSV = () => {
    const csv = generateCSV()
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'ideas.csv'
    a.click()
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 text-mono-950 dark:text-mono-50 p-4 max-w-5xl mx-auto">
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
        <input
          type="text"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder={c.nichePlaceholder}
          className="flex-1 px-4 py-2 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
        />
        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="px-4 py-2 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
        >
          <option value={30}>{c.ideas30}</option>
          <option value={60}>{c.ideas60}</option>
        </select>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-accent-600 text-white rounded cursor-pointer hover:opacity-90"
        >
          {c.generate}
        </button>
      </header>

      {showExport && ideas.length > 0 && (
        <div className="mt-4 flex gap-2 flex-wrap">
          <button
            onClick={handleCopyMarkdown}
            className="px-4 py-2 bg-mono-200 dark:bg-mono-700 rounded hover:bg-mono-300 dark:hover:bg-mono-600 text-sm"
          >
            {copyStatus === 'markdown' ? c.copied : c.copyMarkdown}
          </button>
          <button
            onClick={handleCopyCSV}
            className="px-4 py-2 bg-mono-200 dark:bg-mono-700 rounded hover:bg-mono-300 dark:hover:bg-mono-600 text-sm"
          >
            {copyStatus === 'csv' ? c.copied : c.copyCsv}
          </button>
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 bg-mono-200 dark:bg-mono-700 rounded hover:bg-mono-300 dark:hover:bg-mono-600 text-sm"
          >
            {c.downloadCsv}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {ideas.map((idea, idx) => (
          <div key={idx} className="bg-mono-100 dark:bg-mono-900 rounded-lg p-4 text-sm leading-relaxed">
            <strong className="text-base text-accent-600 block mb-2">{idea.title}</strong>
            <div className="mb-2">
              {c.primaryKw}{' '}
              <code className="bg-mono-200 dark:bg-mono-800 px-1 rounded">{idea.kw}</code>
            </div>
            <div className="mb-2">{c.angleFormatDiff(idea.angle, idea.format, idea.diff)}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-mono-200 dark:bg-mono-800 px-2 py-1 rounded text-xs">{idea.angle}</span>
              <span className="bg-mono-200 dark:bg-mono-800 px-2 py-1 rounded text-xs">{idea.format}</span>
              <span className="bg-mono-200 dark:bg-mono-800 px-2 py-1 rounded text-xs">{idea.diff}</span>
            </div>
            <div className="mt-2 text-xs text-mono-500">
              {c.altKws} {idea.altKW}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ContentIdeaGenerator() {
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
      toolSlug="content-idea-generator"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <ContentIdeaGeneratorContent c={c} />
    </ToolAccessGate>
  )
}
