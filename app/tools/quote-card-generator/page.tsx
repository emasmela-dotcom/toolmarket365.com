'use client'

import { useState, useEffect, useRef } from 'react'
import { Download, Image as ImageIcon } from 'lucide-react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    toolName: 'Quote Card Generator',
    toolDescription:
      'Creates beautiful quote cards for social media. Customize quotes, authors, themes, colors, sizes, and add logos to generate professional quote graphics ready for download.',
    howToUse: [
      { label: 'Enter quote:', text: 'Type or paste the quote text' },
      { label: 'Enter author (optional):', text: "Add the quote author's name" },
      { label: 'Choose theme:', text: 'Select a visual theme (minimal, bold, elegant, etc.)' },
      { label: 'Customize colors:', text: 'Adjust text and background colors' },
      { label: 'Set size:', text: 'Choose image dimensions (1080x1080, 1920x1080, etc.)' },
      { label: 'Add logo (optional):', text: 'Upload a logo to include on the card' },
      { label: 'Download:', text: 'Click "Download" to save your quote card' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Creates visually appealing quote cards with customizable quotes, author names, themes, colors, sizes, and optional logos. Perfect for social media posts, blog graphics, or marketing materials.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter quote:', text: 'Type or paste your quote text' },
      { label: 'Enter author (optional):', text: "Add the quote author's name" },
      { label: 'Select theme:', text: 'Choose Minimal, Bold, Elegant, or Modern' },
      { label: 'Customize colors:', text: 'Choose text color and background color' },
      { label: 'Select size:', text: 'Choose 1080×1080 (Square), 1200×675 (Landscape), or 1080×1920 (Story)' },
      { label: 'Upload logo (optional):', text: 'Add your logo to the quote card' },
      { label: 'Download:', text: 'Click "Download" to save your quote card as PNG' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Visual quote card with your quote and author',
      'Customizable theme and colors',
      'Multiple size options for different platforms',
      'Optional logo integration',
      'Downloadable PNG image ready to use',
    ],
    title: 'Quote Card Generator',
    quote: 'Quote',
    authorOptional: 'Author (optional)',
    authorPlaceholder: 'Steve Jobs',
    theme: 'Theme',
    themeMinimal: 'Minimal',
    themeBrush: 'Brush',
    themeNeon: 'Neon',
    themeRetro: 'Retro',
    themeDark: 'Dark',
    textColour: 'Text colour',
    backgroundColour: 'Background colour',
    size: 'Size',
    sizeInstagram: 'Instagram 1080×1080',
    sizeTwitter: 'Twitter 1200×675',
    sizeStory: 'Story 1080×1920',
    logoOptional: 'Logo / avatar (optional)',
    chooseImage: 'Choose Image',
    downloadPng: 'Download PNG',
    defaultQuote: 'Stay hungry, stay foolish.',
  },
  es: {
    toolName: 'Generador de tarjetas de citas',
    toolDescription:
      'Crea hermosas tarjetas de citas para redes sociales. Personaliza citas, autores, temas, colores, tamaños y añade logos para generar gráficos profesionales listos para descargar.',
    howToUse: [
      { label: 'Ingresa la cita:', text: 'Escribe o pega el texto de la cita' },
      { label: 'Ingresa autor (opcional):', text: 'Añade el nombre del autor de la cita' },
      { label: 'Elige tema:', text: 'Selecciona un tema visual (minimal, bold, elegant, etc.)' },
      { label: 'Personaliza colores:', text: 'Ajusta los colores del texto y fondo' },
      { label: 'Define tamaño:', text: 'Elige dimensiones (1080x1080, 1920x1080, etc.)' },
      { label: 'Añade logo (opcional):', text: 'Sube un logo para incluir en la tarjeta' },
      { label: 'Descargar:', text: 'Haz clic en "Descargar" para guardar tu tarjeta de cita' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Crea tarjetas de citas visualmente atractivas con citas, nombres de autor, temas, colores, tamaños y logos opcionales personalizables. Perfecto para publicaciones en redes, gráficos de blog o materiales de marketing.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Ingresa la cita:', text: 'Escribe o pega el texto de tu cita' },
      { label: 'Ingresa autor (opcional):', text: 'Añade el nombre del autor de la cita' },
      { label: 'Selecciona tema:', text: 'Elige Minimal, Bold, Elegant o Modern' },
      { label: 'Personaliza colores:', text: 'Elige color de texto y color de fondo' },
      { label: 'Selecciona tamaño:', text: 'Elige 1080×1080 (Cuadrado), 1200×675 (Horizontal) o 1080×1920 (Story)' },
      { label: 'Sube logo (opcional):', text: 'Añade tu logo a la tarjeta de cita' },
      { label: 'Descargar:', text: 'Haz clic en "Descargar" para guardar tu tarjeta como PNG' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Tarjeta de cita visual con tu cita y autor',
      'Tema y colores personalizables',
      'Varias opciones de tamaño para distintas plataformas',
      'Integración opcional de logo',
      'Imagen PNG descargable lista para usar',
    ],
    title: 'Generador de tarjetas de citas',
    quote: 'Cita',
    authorOptional: 'Autor (opcional)',
    authorPlaceholder: 'Steve Jobs',
    theme: 'Tema',
    themeMinimal: 'Minimal',
    themeBrush: 'Pincel',
    themeNeon: 'Neón',
    themeRetro: 'Retro',
    themeDark: 'Oscuro',
    textColour: 'Color del texto',
    backgroundColour: 'Color de fondo',
    size: 'Tamaño',
    sizeInstagram: 'Instagram 1080×1080',
    sizeTwitter: 'Twitter 1200×675',
    sizeStory: 'Story 1080×1920',
    logoOptional: 'Logo / avatar (opcional)',
    chooseImage: 'Elegir imagen',
    downloadPng: 'Descargar PNG',
    defaultQuote: 'Mantente hambriento, mantente alocado.',
  },
}

function QuoteCardGeneratorContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [quote, setQuote] = useState(c.defaultQuote)
  const [author, setAuthor] = useState('')
  const [theme, setTheme] = useState('minimal')
  const [textColor, setTextColor] = useState('#111111')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [size, setSize] = useState('1080')
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeMap: Record<string, [number, number]> = {
    '1080': [1080, 1080],
    '1200': [1200, 675],
    story: [1080, 1920],
  }

  useEffect(() => {
    draw()
  }, [quote, author, theme, textColor, bgColor, size, logoImg])

  const setCanvasSize = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const [w, h] = sizeMap[size]
    canvas.width = w
    canvas.height = h
  }

  useEffect(() => {
    setCanvasSize()
    draw()
  }, [size])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        setLogoImg(img)
      }
      img.src = ev.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height

    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, w, h)

    switch (theme) {
      case 'brush':
        ctx.globalAlpha = 0.08
        for (let i = 0; i < 5; i++) {
          ctx.beginPath()
          ctx.arc(
            Math.random() * w,
            Math.random() * h,
            Math.random() * w / 3,
            0,
            Math.PI * 2
          )
          ctx.fillStyle = 'rgba(0,0,0,.1)'
          ctx.fill()
        }
        ctx.globalAlpha = 1
        break
      case 'neon':
        ctx.strokeStyle = textColor
        ctx.lineWidth = 4
        ctx.strokeRect(30, 30, w - 60, h - 60)
        break
      case 'retro':
        ctx.fillStyle = 'rgba(255,255,0,.15)'
        ctx.fillRect(0, 0, w, h)
        break
      case 'dark':
        ctx.fillStyle = '#111'
        ctx.fillRect(0, 0, w, h)
        break
    }

    if (logoImg) {
      const s = Math.min(w, h) / 6
      ctx.drawImage(logoImg, w - s - 40, 40, s, s)
    }

    const maxW = w * 0.8
    let fontSize = Math.min(h / 6, 120)
    ctx.font = `${fontSize}px "Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif`
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const fit = (text: string) => {
      const lines = text.split('\n')
      for (let i = 0; i < lines.length; i++) {
        let m = ctx.measureText(lines[i])
        while (m.width > maxW && fontSize > 20) {
          fontSize--
          ctx.font = `${fontSize}px "Inter",sans-serif`
          m = ctx.measureText(lines[i])
        }
      }
    }

    const txt = quote + (author ? '\n\n— ' + author : '')
    fit(txt)
    const lines = txt.split('\n')
    const lineH = fontSize * 1.2
    const startY = h / 2 - (lines.length - 1) * lineH / 2

    lines.forEach((line, i) => {
      ctx.fillText(line, w / 2, startY + i * lineH)
    })
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (!blob) return
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'quote-card.png'
      a.click()
    })
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
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

        <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-6 text-center">{c.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">{c.quote}</label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">{c.authorOptional}</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder={c.authorPlaceholder}
                className="w-full px-4 py-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">{c.theme}</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-4 py-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              >
                <option value="minimal">{c.themeMinimal}</option>
                <option value="brush">{c.themeBrush}</option>
                <option value="neon">{c.themeNeon}</option>
                <option value="retro">{c.themeRetro}</option>
                <option value="dark">{c.themeDark}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">{c.textColour}</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-12 border border-mono-300 dark:border-mono-700 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">{c.backgroundColour}</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-12 border border-mono-300 dark:border-mono-700 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">{c.size}</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-4 py-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              >
                <option value="1080">{c.sizeInstagram}</option>
                <option value="1200">{c.sizeTwitter}</option>
                <option value="story">{c.sizeStory}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">{c.logoOptional}</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 hover:bg-mono-100 dark:hover:bg-mono-800 flex items-center justify-center gap-2"
              >
                <ImageIcon size={18} />
                {c.chooseImage}
              </button>
            </div>

            <button
              onClick={handleDownload}
              className="w-full px-6 py-4 bg-accent-600 text-white rounded-lg font-semibold hover:bg-accent-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={20} />
              {c.downloadPng}
            </button>
          </section>

          <section className="flex items-center justify-center">
            <div className="w-full max-w-[500px]">
              <canvas
                ref={canvasRef}
                className="w-full rounded-lg shadow-lg border border-mono-200 dark:border-mono-700"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default function QuoteCardGenerator() {
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
      toolSlug="quote-card-generator"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <QuoteCardGeneratorContent />
    </ToolAccessGate>
  )
}
