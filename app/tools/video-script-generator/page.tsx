'use client'

import { useState } from 'react'
import { Video, Play, Copy, Check, Download } from 'lucide-react';
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface ScriptSection {
  type: string
  content: string
  duration?: string
}

const copy = {
  en: {
    toolName: 'Video Script Generator',
    toolDescription:
      'Generates structured video scripts for YouTube, TikTok, Instagram Reels, and YouTube Shorts. Creates scripts with hooks, introductions, main content points, and calls-to-action based on your topic.',
    howToUse: [
      { label: 'Enter video topic:', text: 'Type your video topic or title (e.g., "How to cook pasta")' },
      { label: 'Select platform:', text: 'Choose YouTube, TikTok, Instagram Reels, or YouTube Shorts. Script structure adapts to platform.' },
      { label: 'Choose video length:', text: 'Short (30-60s, 3 sections), Medium (2-5min, 5 sections), or Long (5+min, 8 sections)' },
      { label: 'Click "Generate Script"', text: 'to create your script' },
      { label: 'Review generated script:', text: 'Hook section, Introduction, Main content points, Call to action, Outro' },
      { label: 'Copy or download:', text: 'Copy formatted script, copy plain text, or download as .txt file' },
    ],
    title: 'Video Script Generator',
    subtitle: 'Generate scripts for YouTube, TikTok, and Reels',
    supportedPlatforms: 'Supported Platforms:',
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Generates structured video scripts for YouTube, TikTok, Instagram Reels, and YouTube Shorts. Creates scripts with hooks, introductions, main content points, and calls-to-action based on your topic.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter video topic:', text: 'Type your video topic or title (e.g., "How to cook pasta")' },
      { label: 'Select platform:', text: 'Choose YouTube, TikTok, Instagram Reels, or YouTube Shorts. Script structure adapts to platform.' },
      { label: 'Choose video length:', text: 'Short (30-60s, 3 sections), Medium (2-5min, 5 sections), or Long (5+min, 8 sections)' },
      { label: 'Click "Generate Script"', text: 'to create your script' },
      { label: 'Review generated script:', text: 'Hook section, Introduction, Main content points, Call to action, Outro' },
      { label: 'Copy or download:', text: 'Copy formatted script, copy plain text, or download as .txt file' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Structured script with Hook (attention-grabbing opening), Introduction (welcome and topic overview), Main Points (content breakdown), Call to Action (engagement prompts), and Outro (closing)',
      'Timing suggestions - Duration for each section',
      'Platform-optimized - Tailored for selected platform',
      'Ready to use - Copy and customize as needed',
    ],
    scriptSettings: 'Script Settings',
    videoTopic: 'Video Topic / Title',
    topicPlaceholder: 'e.g., How to cook pasta',
    platform: 'Platform',
    videoLength: 'Video Length',
    lengthShort: 'Short (30-60 seconds)',
    lengthMedium: 'Medium (2-5 minutes)',
    lengthLong: 'Long (5+ minutes)',
    generateScript: 'Generate Script',
    generatedScript: 'Generated Script',
    copy: 'Copy',
    plainText: 'Plain Text',
    download: 'Download',
    readyTitle: 'Ready to Generate?',
    readyBody: 'Enter a video topic and click "Generate Script" to create your script',
    hook: 'Hook',
    introduction: 'Introduction',
    point: (n: number) => `Point ${n}`,
    callToAction: 'Call to Action',
    outro: 'Outro',
    hookContent: (topic: string) =>
      `Did you know that ${topic}? In this video, I'm going to show you exactly how to master this.`,
    introContent: (topic: string) =>
      `Hey everyone! Welcome back to my channel. Today we're diving deep into ${topic}. Whether you're a beginner or looking to level up, this video has something for you.`,
    mainPoints: (topic: string) => [
      `First, let's talk about the fundamentals of ${topic}.`,
      `Next, I'll show you the most important techniques you need to know.`,
      `Then, we'll cover common mistakes people make with ${topic}.`,
      `Finally, I'll give you actionable tips you can use right away.`,
    ],
    ctaContent: (topic: string) =>
      `If this video helped you, make sure to like and subscribe for more content on ${topic}. Drop a comment below with your biggest takeaway!`,
    outroContent: 'Thanks for watching! See you in the next video.',
  },
  es: {
    toolName: 'Generador de guiones de video',
    toolDescription:
      'Genera guiones de video estructurados para YouTube, TikTok, Instagram Reels y YouTube Shorts. Crea guiones con ganchos, introducciones, puntos principales y llamadas a la acción según tu tema.',
    howToUse: [
      { label: 'Introduce el tema del video:', text: 'Escribe el tema o título del video (p. ej., "Cómo cocinar pasta")' },
      { label: 'Selecciona la plataforma:', text: 'Elige YouTube, TikTok, Instagram Reels o YouTube Shorts. La estructura del guion se adapta a la plataforma.' },
      { label: 'Elige la duración:', text: 'Corto (30-60 s, 3 secciones), Medio (2-5 min, 5 secciones) o Largo (5+ min, 8 secciones)' },
      { label: 'Haz clic en "Generar guion"', text: 'para crear tu guion' },
      { label: 'Revisa el guion generado:', text: 'Gancho, Introducción, Puntos principales, Llamada a la acción, Cierre' },
      { label: 'Copia o descarga:', text: 'Copia el guion formateado, copia texto plano o descarga como archivo .txt' },
    ],
    title: 'Generador de guiones de video',
    subtitle: 'Genera guiones para YouTube, TikTok y Reels',
    supportedPlatforms: 'Plataformas compatibles:',
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Genera guiones de video estructurados para YouTube, TikTok, Instagram Reels y YouTube Shorts. Crea guiones con ganchos, introducciones, puntos principales y llamadas a la acción según tu tema.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Introduce el tema del video:', text: 'Escribe el tema o título del video (p. ej., "Cómo cocinar pasta")' },
      { label: 'Selecciona la plataforma:', text: 'Elige YouTube, TikTok, Instagram Reels o YouTube Shorts. La estructura del guion se adapta a la plataforma.' },
      { label: 'Elige la duración:', text: 'Corto (30-60 s, 3 secciones), Medio (2-5 min, 5 secciones) o Largo (5+ min, 8 secciones)' },
      { label: 'Haz clic en "Generar guion"', text: 'para crear tu guion' },
      { label: 'Revisa el guion generado:', text: 'Gancho, Introducción, Puntos principales, Llamada a la acción, Cierre' },
      { label: 'Copia o descarga:', text: 'Copia el guion formateado, copia texto plano o descarga como archivo .txt' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Guion estructurado con Gancho (apertura que capta atención), Introducción (bienvenida y resumen del tema), Puntos principales (desglose del contenido), Llamada a la acción (invitaciones a interactuar) y Cierre',
      'Sugerencias de tiempo — Duración de cada sección',
      'Optimizado por plataforma — Adaptado a la plataforma seleccionada',
      'Listo para usar — Copia y personaliza según necesites',
    ],
    scriptSettings: 'Ajustes del guion',
    videoTopic: 'Tema / título del video',
    topicPlaceholder: 'p. ej., Cómo cocinar pasta',
    platform: 'Plataforma',
    videoLength: 'Duración del video',
    lengthShort: 'Corto (30-60 segundos)',
    lengthMedium: 'Medio (2-5 minutos)',
    lengthLong: 'Largo (5+ minutos)',
    generateScript: 'Generar guion',
    generatedScript: 'Guion generado',
    copy: 'Copiar',
    plainText: 'Texto plano',
    download: 'Descargar',
    readyTitle: '¿Listo para generar?',
    readyBody: 'Introduce un tema de video y haz clic en "Generar guion" para crear tu guion',
    hook: 'Gancho',
    introduction: 'Introducción',
    point: (n: number) => `Punto ${n}`,
    callToAction: 'Llamada a la acción',
    outro: 'Cierre',
    hookContent: (topic: string) =>
      `¿Sabías que ${topic}? En este video te mostraré exactamente cómo dominarlo.`,
    introContent: (topic: string) =>
      `¡Hola a todos! Bienvenidos de nuevo a mi canal. Hoy profundizamos en ${topic}. Tanto si eres principiante como si quieres mejorar, este video tiene algo para ti.`,
    mainPoints: (topic: string) => [
      `Primero, hablemos de los fundamentos de ${topic}.`,
      `Después, te mostraré las técnicas más importantes que debes conocer.`,
      `Luego, veremos los errores comunes que la gente comete con ${topic}.`,
      `Por último, te daré consejos prácticos que puedes usar de inmediato.`,
    ],
    ctaContent: (topic: string) =>
      `Si este video te ayudó, dale like y suscríbete para más contenido sobre ${topic}. ¡Deja un comentario con tu mayor aprendizaje!`,
    outroContent: '¡Gracias por ver! Nos vemos en el próximo video.',
  },
}

function VideoScriptGeneratorContent({ c }: { c: typeof copy.en }) {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('youtube')
  const [length, setLength] = useState('medium')
  const [script, setScript] = useState<ScriptSection[]>([])
  const [copied, setCopied] = useState(false)

  const generateScript = () => {
    if (!topic.trim()) {
      setScript([])
      return
    }

    const lengthMap: Record<string, { sections: number; hookDuration: string; mainDuration: string }> = {
      short: { sections: 3, hookDuration: '0-3s', mainDuration: '10-15s' },
      medium: { sections: 5, hookDuration: '0-5s', mainDuration: '30-60s' },
      long: { sections: 8, hookDuration: '0-10s', mainDuration: '60-120s' }
    }

    const config = lengthMap[length]
    const sections: ScriptSection[] = []

    sections.push({
      type: c.hook,
      content: c.hookContent(topic),
      duration: config.hookDuration
    })

    sections.push({
      type: c.introduction,
      content: c.introContent(topic),
      duration: config.mainDuration
    })

    const mainPoints = c.mainPoints(topic)

    mainPoints.slice(0, config.sections - 3).forEach((point, idx) => {
      sections.push({
        type: c.point(idx + 1),
        content: point,
        duration: config.mainDuration
      })
    })

    sections.push({
      type: c.callToAction,
      content: c.ctaContent(topic),
      duration: '10-15s'
    })

    sections.push({
      type: c.outro,
      content: c.outroContent,
      duration: '5-10s'
    })

    setScript(sections)
  }

  const copyScript = () => {
    const text = script.map(s =>
      `[${s.type}${s.duration ? ` - ${s.duration}` : ''}]\n${s.content}\n`
    ).join('\n')

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyPlainText = () => {
    const text = script.map(s => s.content).join('\n\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadScript = () => {
    const content = script.map(s =>
      `[${s.type}${s.duration ? ` - ${s.duration}` : ''}]\n${s.content}\n`
    ).join('\n\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `video-script-${topic.replace(/\s+/g, '-').toLowerCase()}.txt`
    a.click()
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-accent-600 rounded-2xl">
              <Video className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-3">{c.title}</h1>
          <p className="text-xl text-mono-600 dark:text-mono-400 mb-4">{c.subtitle}</p>

          <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-xs font-semibold text-mono-700 dark:text-mono-300 mb-2">{c.supportedPlatforms}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">📺 YouTube</span>
              <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">🎵 TikTok</span>
              <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">📸 Instagram Reels</span>
              <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">📺 YouTube Shorts</span>
            </div>
          </div>
        </div>

        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-8 border border-mono-200 dark:border-mono-700">
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
                  <li key={i}><strong>{step.label}</strong> {step.text}</li>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
              <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">{c.scriptSettings}</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    {c.videoTopic}
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={c.topicPlaceholder}
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    {c.platform}
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="reels">Instagram Reels</option>
                    <option value="shorts">YouTube Shorts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    {c.videoLength}
                  </label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  >
                    <option value="short">{c.lengthShort}</option>
                    <option value="medium">{c.lengthMedium}</option>
                    <option value="long">{c.lengthLong}</option>
                  </select>
                </div>

                <button
                  onClick={generateScript}
                  disabled={!topic.trim()}
                  className="w-full px-6 py-4 bg-accent-600 text-white rounded-xl font-bold text-lg hover:bg-accent-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Play size={24} />
                  {c.generateScript}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {script.length > 0 ? (
              <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50">{c.generatedScript}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={copyScript}
                      className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 text-mono-700 dark:text-mono-300 text-sm"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {c.copy}
                    </button>
                    <button
                      onClick={copyPlainText}
                      className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 text-mono-700 dark:text-mono-300 text-sm"
                    >
                      <Copy size={16} />
                      {c.plainText}
                    </button>
                    <button
                      onClick={downloadScript}
                      className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 text-mono-700 dark:text-mono-300 text-sm"
                    >
                      <Download size={16} />
                      {c.download}
                    </button>
                  </div>
                </div>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {script.map((section, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-mono-100 dark:bg-mono-800 rounded-lg border-l-4 border-accent-600"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-accent-600">{section.type}</h3>
                        {section.duration && (
                          <span className="text-xs text-mono-500 bg-mono-200 dark:bg-mono-700 px-2 py-1 rounded">
                            {section.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-mono-700 dark:text-mono-300 leading-relaxed whitespace-pre-wrap">
                        {section.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-12 text-center h-full flex flex-col justify-center border border-mono-200 dark:border-mono-700">
                <Video className="mx-auto text-mono-300 dark:text-mono-700 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-mono-700 dark:text-mono-300 mb-3">{c.readyTitle}</h3>
                <p className="text-mono-500 dark:text-mono-400">{c.readyBody}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VideoScriptGenerator() {
  const { language } = useLanguage()
  const c = copy[language]

  const howToUse = (
    <ol className="list-decimal list-inside space-y-1 ml-2">
      {c.howToUse.map((step, i) => (
        <li key={i}><strong>{step.label}</strong> {step.text}</li>
      ))}
    </ol>
  )

  return (
    <ToolAccessGate
      toolSlug="video-script-generator"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <VideoScriptGeneratorContent c={c} />
    </ToolAccessGate>
  )
}
