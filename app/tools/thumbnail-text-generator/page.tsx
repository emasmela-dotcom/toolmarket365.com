'use client'

import { useState } from 'react'
import { Type, Copy, Check } from 'lucide-react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    toolName: 'Thumbnail Text Generator',
    toolDescription:
      'Generates formatted text for video thumbnails. Splits titles into multiple lines with customizable words per line, colors, fonts, and alignment. Perfect for YouTube, TikTok, and other video platforms.',
    howToUse: [
      { label: 'Enter title:', text: 'Type or paste your video title' },
      { label: 'Set words per line:', text: 'Choose how many words appear on each line (default: 3)' },
      { label: 'Customize appearance:', text: 'Adjust font size, text color, background color, and alignment' },
      { label: 'Click "Generate":', text: 'See formatted text preview' },
      { label: 'Copy results:', text: 'Copy as plain text or HTML format' },
    ],
    title: 'Thumbnail Text Generator',
    subtitle: 'Generate formatted text for video thumbnails',
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Generates formatted text for video thumbnails. Splits titles into multiple lines with customizable words per line, colors, fonts, and alignment. Perfect for YouTube, TikTok, and other video platforms.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter title:', text: 'Type or paste your video title (e.g., "How to cook pasta in 10 minutes")' },
      { label: 'Set words per line:', text: 'Choose how many words appear on each line (default: 3 words per line)' },
      { label: 'Customize appearance:', text: 'Adjust Font Size (24-120px), Text Color, Background Color, and Text Alignment (left, center, right)' },
      { label: 'Click "Generate"', text: 'to create formatted text' },
      { label: 'Review preview:', text: 'See how text looks on colored background, adjust settings and regenerate' },
      { label: 'Copy results:', text: 'Copy Text (plain text format) or Copy HTML (HTML div format)' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Formatted lines - Title split into multiple lines',
      'Visual preview - See how text looks on background',
      'Customizable styling - Colors, size, alignment',
      'Copy options - Text or HTML format',
      'Ready to use - Paste into thumbnail editor',
    ],
    textSettings: 'Text Settings',
    titleLabel: 'Title',
    titlePlaceholder: 'How to cook pasta',
    wordsPerLine: 'Words per Line',
    fontSize: 'Font Size',
    textColor: 'Text Color',
    backgroundColor: 'Background Color',
    textAlignment: 'Text Alignment',
    alignLeft: 'left',
    alignCenter: 'center',
    alignRight: 'right',
    generate: 'Generate',
    preview: 'Preview',
    copyText: 'Copy Text',
    copyHtml: 'Copy HTML',
    plainText: 'Plain Text',
    readyTitle: 'Ready to Generate?',
    readyBody: 'Enter a title and click "Generate" to create formatted thumbnail text',
  },
  es: {
    toolName: 'Generador de texto para miniaturas',
    toolDescription:
      'Genera texto formateado para miniaturas de video. Divide títulos en varias líneas con palabras por línea, colores, fuentes y alineación personalizables. Perfecto para YouTube, TikTok y otras plataformas de video.',
    howToUse: [
      { label: 'Ingresa título:', text: 'Escribe o pega el título de tu video' },
      { label: 'Palabras por línea:', text: 'Elige cuántas palabras aparecen en cada línea (predeterminado: 3)' },
      { label: 'Personaliza apariencia:', text: 'Ajusta tamaño de fuente, color de texto, color de fondo y alineación' },
      { label: 'Haz clic en "Generar":', text: 'Ve la vista previa del texto formateado' },
      { label: 'Copia resultados:', text: 'Copia como texto plano o formato HTML' },
    ],
    title: 'Generador de texto para miniaturas',
    subtitle: 'Genera texto formateado para miniaturas de video',
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Genera texto formateado para miniaturas de video. Divide títulos en varias líneas con palabras por línea, colores, fuentes y alineación personalizables. Perfecto para YouTube, TikTok y otras plataformas de video.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Ingresa título:', text: 'Escribe o pega el título de tu video (ej. "Cómo cocinar pasta en 10 minutos")' },
      { label: 'Palabras por línea:', text: 'Elige cuántas palabras aparecen en cada línea (predeterminado: 3 palabras por línea)' },
      { label: 'Personaliza apariencia:', text: 'Ajusta tamaño de fuente (24-120px), color de texto, color de fondo y alineación (izquierda, centro, derecha)' },
      { label: 'Haz clic en "Generar"', text: 'para crear texto formateado' },
      { label: 'Revisa vista previa:', text: 'Ve cómo se ve el texto sobre el fondo de color, ajusta y regenera' },
      { label: 'Copia resultados:', text: 'Copiar texto (formato plano) o Copiar HTML (formato div HTML)' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Líneas formateadas - Título dividido en varias líneas',
      'Vista previa visual - Ve cómo se ve el texto sobre el fondo',
      'Estilo personalizable - Colores, tamaño, alineación',
      'Opciones de copia - Formato texto o HTML',
      'Listo para usar - Pega en tu editor de miniaturas',
    ],
    textSettings: 'Configuración de texto',
    titleLabel: 'Título',
    titlePlaceholder: 'Cómo cocinar pasta',
    wordsPerLine: 'Palabras por línea',
    fontSize: 'Tamaño de fuente',
    textColor: 'Color de texto',
    backgroundColor: 'Color de fondo',
    textAlignment: 'Alineación de texto',
    alignLeft: 'izquierda',
    alignCenter: 'centro',
    alignRight: 'derecha',
    generate: 'Generar',
    preview: 'Vista previa',
    copyText: 'Copiar texto',
    copyHtml: 'Copiar HTML',
    plainText: 'Texto plano',
    readyTitle: '¿Listo para generar?',
    readyBody: 'Ingresa un título y haz clic en "Generar" para crear texto formateado para miniaturas',
  },
}

function ThumbnailTextGeneratorContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [title, setTitle] = useState('')
  const [wordsPerLine, setWordsPerLine] = useState(3)
  const [result, setResult] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [fontSize, setFontSize] = useState(48)
  const [textColor, setTextColor] = useState('#ffffff')
  const [bgColor, setBgColor] = useState('#000000')
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center')

  const alignLabels = {
    left: c.alignLeft,
    center: c.alignCenter,
    right: c.alignRight,
  }

  const generate = () => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setResult([])
      return
    }

    const words = trimmedTitle.split(' ')
    const lines: string[] = []

    for (let i = 0; i < words.length; i += wordsPerLine) {
      lines.push(words.slice(i, i + wordsPerLine).join(' '))
    }

    setResult(lines)
  }

  const copyText = () => {
    const text = result.join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyHTML = () => {
    const html = result.map((line) => `<div>${line}</div>`).join('\n')
    navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-accent-600 rounded-2xl">
              <Type className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-3">{c.title}</h1>
          <p className="text-xl text-mono-600 dark:text-mono-400">{c.subtitle}</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
              <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">{c.textSettings}</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">{c.titleLabel}</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={c.titlePlaceholder}
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">{c.wordsPerLine}</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={wordsPerLine}
                    onChange={(e) => setWordsPerLine(parseInt(e.target.value) || 3)}
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">{c.fontSize}</label>
                  <input
                    type="number"
                    min="24"
                    max="120"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value) || 48)}
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">{c.textColor}</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-12 border border-mono-300 dark:border-mono-700 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">{c.backgroundColor}</label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full h-12 border border-mono-300 dark:border-mono-700 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">{c.textAlignment}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => setTextAlign(align)}
                        className={`px-4 py-3 rounded-lg font-semibold transition-all capitalize ${
                          textAlign === align
                            ? 'bg-accent-600 text-white shadow-lg'
                            : 'bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 hover:bg-mono-200 dark:hover:bg-mono-700'
                        }`}
                      >
                        {alignLabels[align]}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={generate}
                  disabled={!title.trim()}
                  className="w-full px-6 py-4 bg-accent-600 text-white rounded-xl font-bold text-lg hover:bg-accent-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Type size={24} />
                  {c.generate}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {result.length > 0 ? (
              <>
                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50">{c.preview}</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={copyText}
                        className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 text-mono-700 dark:text-mono-300 text-sm"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {c.copyText}
                      </button>
                      <button
                        onClick={copyHTML}
                        className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 text-mono-700 dark:text-mono-300 text-sm"
                      >
                        <Copy size={16} />
                        {c.copyHtml}
                      </button>
                    </div>
                  </div>
                  <div
                    className="rounded-lg p-8 min-h-[300px] flex flex-col justify-center"
                    style={{
                      backgroundColor: bgColor,
                      textAlign: textAlign,
                    }}
                  >
                    {result.map((line, idx) => (
                      <div
                        key={idx}
                        className="font-bold mb-2"
                        style={{
                          fontSize: `${fontSize}px`,
                          color: textColor,
                          lineHeight: 1.2,
                        }}
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <h3 className="text-lg font-bold text-mono-950 dark:text-mono-50 mb-4">{c.plainText}</h3>
                  <pre className="bg-mono-100 dark:bg-mono-800 rounded-lg p-4 text-mono-950 dark:text-mono-50 whitespace-pre-wrap">
                    {result.join('\n')}
                  </pre>
                </div>
              </>
            ) : (
              <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-12 text-center h-full flex flex-col justify-center border border-mono-200 dark:border-mono-700">
                <Type className="mx-auto text-mono-300 dark:text-mono-700 mb-4" size={64} />
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

export default function ThumbnailTextGenerator() {
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
      toolSlug="thumbnail-text-generator"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <ThumbnailTextGeneratorContent />
    </ToolAccessGate>
  )
}
