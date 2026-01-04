'use client'

import { useState, useEffect, useRef } from 'react'
import { Download, Image as ImageIcon } from 'lucide-react'

export default function QuoteCardGenerator() {
  const [quote, setQuote] = useState('Stay hungry, stay foolish.')
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
    'story': [1080, 1920]
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

    // Background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, w, h)

    // Theme overlay
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

    // Logo
    if (logoImg) {
      const s = Math.min(w, h) / 6
      ctx.drawImage(logoImg, w - s - 40, 40, s, s)
    }

    // Text
    const maxW = w * 0.8
    let fontSize = Math.min(h / 6, 120)
    ctx.font = `${fontSize}px "Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif`
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Auto-shrink
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
        {/* Documentation Section */}
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-8 border border-mono-200 dark:border-mono-700">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">How to Use This Tool</h2>
          <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">What It Does</h3>
              <p>Creates visually appealing quote cards with customizable quotes, author names, themes, colors, sizes, and optional logos. Perfect for social media posts, blog graphics, or marketing materials.</p>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Enter quote:</strong> Type or paste your quote text</li>
                <li><strong>Enter author (optional):</strong> Add the quote author's name</li>
                <li><strong>Select theme:</strong> Choose Minimal, Bold, Elegant, or Modern</li>
                <li><strong>Customize colors:</strong> Choose text color and background color</li>
                <li><strong>Select size:</strong> Choose 1080×1080 (Square), 1200×675 (Landscape), or 1080×1920 (Story)</li>
                <li><strong>Upload logo (optional):</strong> Add your logo to the quote card</li>
                <li><strong>Download:</strong> Click "Download" to save your quote card as PNG</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Visual quote card with your quote and author</li>
                <li>Customizable theme and colors</li>
                <li>Multiple size options for different platforms</li>
                <li>Optional logo integration</li>
                <li>Downloadable PNG image ready to use</li>
              </ul>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-6 text-center">
          Quote Card Generator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <section className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                Quote
              </label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                Author (optional)
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Steve Jobs"
                className="w-full px-4 py-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-4 py-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              >
                <option value="minimal">Minimal</option>
                <option value="brush">Brush</option>
                <option value="neon">Neon</option>
                <option value="retro">Retro</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                Text colour
              </label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-12 border border-mono-300 dark:border-mono-700 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                Background colour
              </label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-12 border border-mono-300 dark:border-mono-700 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                Size
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-4 py-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              >
                <option value="1080">Instagram 1080×1080</option>
                <option value="1200">Twitter 1200×675</option>
                <option value="story">Story 1080×1920</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                Logo / avatar (optional)
              </label>
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
                Choose Image
              </button>
            </div>

            <button
              onClick={handleDownload}
              className="w-full px-6 py-4 bg-accent-600 text-white rounded-lg font-semibold hover:bg-accent-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Download PNG
            </button>
          </section>

          {/* Canvas Preview */}
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


