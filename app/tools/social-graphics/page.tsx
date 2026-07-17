'use client'

import { useEffect, useRef, useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { Download, Undo, Redo, Type, Square, Circle, Image as ImageIcon, Trash2, Palette, XCircle, CheckCircle } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

let fabric: any = null
let ChromePicker: any = null

if (typeof window !== 'undefined') {
  import('fabric').then((f) => {
    fabric = (f as { default?: unknown }).default
  })
  import('react-colorful').then((rc) => {
    ChromePicker = (rc as { ChromePicker?: unknown; HexColorPicker?: unknown }).ChromePicker ?? (rc as { HexColorPicker?: unknown }).HexColorPicker
  })
}

const copy = {
  en: {
    toolName: 'Social Media Graphics Tool',
    toolDescription:
      'Create professional social media graphics with drag-and-drop canvas, text, shapes, images, and platform-specific sizing. Export as PNG instantly.',
    howToUse: [
      { label: 'Select your platform', text: '(Instagram, Facebook, Twitter, LinkedIn, TikTok).' },
      { label: 'Add text, shapes, or images.', text: '' },
      { label: 'Customize colors and styles.', text: '' },
      { label: 'Export as PNG when done.', text: '' },
    ],
    title: 'Social Media Graphics Tool',
    supportedPlatforms: 'Supported Platforms:',
    error: 'Error',
    errorLoadEditor: 'Failed to load graphics editor. Please refresh the page.',
    errorLoadPicker: 'Failed to load color picker. Some features may not work.',
    canvasNotReady: 'Canvas not ready. Please wait for the editor to load.',
    errorAddShape: 'Failed to add shape. Please try again.',
    canvasNotReadyShort: 'Canvas not ready.',
    noSelection: 'No elements selected to delete.',
    errorDelete: 'Failed to delete element. Please try again.',
    undo: 'Undo',
    redo: 'Redo',
    addText: 'Add Text',
    rectangle: 'Rectangle',
    circle: 'Circle',
    addImage: 'Add Image',
    delete: 'Delete',
    exportPng: 'Export PNG',
    color: 'Color:',
    defaultText: 'Your Text',
    platforms: {
      instagram: 'Instagram Post',
      facebook: 'Facebook Post',
      twitter: 'Twitter Post',
      linkedin: 'LinkedIn Post',
      tiktok: 'TikTok Video Cover',
    },
  },
  es: {
    toolName: 'Herramienta de gráficos para redes sociales',
    toolDescription:
      'Crea gráficos profesionales para redes sociales con lienzo de arrastrar y soltar, texto, formas, imágenes y tamaños específicos por plataforma. Exporta como PNG al instante.',
    howToUse: [
      { label: 'Selecciona tu plataforma', text: '(Instagram, Facebook, Twitter, LinkedIn, TikTok).' },
      { label: 'Agrega texto, formas o imágenes.', text: '' },
      { label: 'Personaliza colores y estilos.', text: '' },
      { label: 'Exporta como PNG cuando termines.', text: '' },
    ],
    title: 'Herramienta de gráficos para redes sociales',
    supportedPlatforms: 'Plataformas compatibles:',
    error: 'Error',
    errorLoadEditor: 'No se pudo cargar el editor de gráficos. Por favor actualiza la página.',
    errorLoadPicker: 'No se pudo cargar el selector de color. Algunas funciones pueden no funcionar.',
    canvasNotReady: 'El lienzo no está listo. Espera a que cargue el editor.',
    errorAddShape: 'No se pudo agregar la forma. Inténtalo de nuevo.',
    canvasNotReadyShort: 'El lienzo no está listo.',
    noSelection: 'No hay elementos seleccionados para eliminar.',
    errorDelete: 'No se pudo eliminar el elemento. Inténtalo de nuevo.',
    undo: 'Deshacer',
    redo: 'Rehacer',
    addText: 'Agregar texto',
    rectangle: 'Rectángulo',
    circle: 'Círculo',
    addImage: 'Agregar imagen',
    delete: 'Eliminar',
    exportPng: 'Exportar PNG',
    color: 'Color:',
    defaultText: 'Tu texto',
    platforms: {
      instagram: 'Publicación de Instagram',
      facebook: 'Publicación de Facebook',
      twitter: 'Publicación de Twitter',
      linkedin: 'Publicación de LinkedIn',
      tiktok: 'Portada de video TikTok',
    },
  },
}

const platformSizes = {
  instagram: { width: 1080, height: 1080 },
  facebook: { width: 1200, height: 630 },
  twitter: { width: 1200, height: 675 },
  linkedin: { width: 1200, height: 627 },
  tiktok: { width: 1080, height: 1920 },
}

type PlatformKey = keyof typeof platformSizes

function SocialGraphicsToolContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = useState<any>(null)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [color, setColor] = useState('#ffffff')
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformKey>('instagram')
  const [fabricLoaded, setFabricLoaded] = useState(false)
  const [pickerLoaded, setPickerLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    import('fabric')
      .then((f) => {
        fabric = (f as { default?: unknown }).default
        setFabricLoaded(true)
        setError(null)
      })
      .catch((err) => {
        console.error('Error loading fabric:', err)
        setError(c.errorLoadEditor)
      })

    import('react-colorful')
      .then((rc) => {
        ChromePicker = (rc as { ChromePicker?: unknown; HexColorPicker?: unknown }).ChromePicker ?? (rc as { HexColorPicker?: unknown }).HexColorPicker
        setPickerLoaded(true)
      })
      .catch((err) => {
        console.error('Error loading color picker:', err)
        setError(c.errorLoadPicker)
      })
  }, [c.errorLoadEditor, c.errorLoadPicker])

  useEffect(() => {
    if (!canvasRef.current || !fabricLoaded || !fabric) return

    const cvs = new fabric.Canvas(canvasRef.current, {
      width: platformSizes[selectedPlatform].width,
      height: platformSizes[selectedPlatform].height,
      backgroundColor: '#ffffff',
    })
    setCanvas(cvs)
    return () => cvs.dispose()
  }, [selectedPlatform, fabricLoaded])

  const saveState = () => {
    if (!canvas) return
    const json = JSON.stringify(canvas.toJSON())
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(json)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (!canvas || historyIndex <= 0) return
    const prev = history[historyIndex - 1]
    canvas.loadFromJSON(prev, () => canvas.renderAll())
    setHistoryIndex(historyIndex - 1)
  }

  const redo = () => {
    if (!canvas || historyIndex >= history.length - 1) return
    const next = history[historyIndex + 1]
    canvas.loadFromJSON(next, () => canvas.renderAll())
    setHistoryIndex(historyIndex + 1)
  }

  const addText = () => {
    if (!canvas || !fabric) return
    const text = new fabric.IText(c.defaultText, {
      left: 50,
      top: 50,
      fontSize: 40,
      fill: '#000',
    })
    canvas.add(text)
    canvas.setActiveObject(text)
    saveState()
  }

  const addShape = (shape: 'rect' | 'circle') => {
    if (!canvas || !fabric) {
      setError(c.canvasNotReady)
      return
    }
    try {
      const obj =
        shape === 'rect'
          ? new fabric.Rect({ width: 100, height: 100, fill: color, left: 100, top: 100 })
          : new fabric.Circle({ radius: 50, fill: color, left: 100, top: 100 })
      canvas.add(obj)
      canvas.setActiveObject(obj)
      saveState()
      setError(null)
    } catch (err) {
      console.error('Error adding shape:', err)
      setError(c.errorAddShape)
    }
  }

  const addImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file || !canvas || !fabric) return
      const reader = new FileReader()
      reader.onload = (f) => {
        fabric.Image.fromURL(f.target?.result as string, (img: any) => {
          img.scaleToWidth(300)
          canvas.add(img)
          canvas.setActiveObject(img)
          saveState()
        })
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  const deleteSelected = () => {
    if (!canvas) {
      setError(c.canvasNotReadyShort)
      return
    }
    try {
      const active = canvas.getActiveObjects()
      if (active.length === 0) {
        setError(c.noSelection)
        setTimeout(() => setError(null), 2000)
        return
      }
      active.forEach((obj: any) => canvas.remove(obj))
      canvas.discardActiveObject()
      canvas.renderAll()
      saveState()
      setError(null)
    } catch (err) {
      console.error('Error deleting element:', err)
      setError(c.errorDelete)
    }
  }

  const exportPNG = () => {
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `${selectedPlatform}-graphic.png`
    link.href = canvas.toDataURL({ format: 'png' })
    link.click()
  }

  if (!fabricLoaded || !pickerLoaded) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 text-mono-950 dark:text-mono-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-mono-950 dark:text-mono-50">{c.title}</h1>

        <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-4 mb-6">
          <p className="text-xs font-semibold text-mono-700 dark:text-mono-300 mb-2">{c.supportedPlatforms}</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">📸 Instagram</span>
            <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">📘 Facebook</span>
            <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">🐦 Twitter/X</span>
            <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">💼 LinkedIn</span>
            <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">🎵 TikTok</span>
          </div>
        </div>

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-green-800 dark:text-green-200 font-medium">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div>
                <p className="text-red-800 dark:text-red-200 font-medium">{c.error}</p>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-4 flex-wrap">
          <select
            className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as PlatformKey)}
          >
            {(Object.keys(platformSizes) as PlatformKey[]).map((key) => (
              <option key={key} value={key}>
                {c.platforms[key]}
              </option>
            ))}
          </select>

          <button
            onClick={undo}
            className="flex items-center gap-2 px-3 py-2 bg-mono-200 dark:bg-mono-800 rounded-lg hover:bg-mono-300 dark:hover:bg-mono-700 transition-colors text-mono-950 dark:text-mono-50"
          >
            <Undo size={16} /> {c.undo}
          </button>
          <button
            onClick={redo}
            className="flex items-center gap-2 px-3 py-2 bg-mono-200 dark:bg-mono-800 rounded-lg hover:bg-mono-300 dark:hover:bg-mono-700 transition-colors text-mono-950 dark:text-mono-50"
          >
            <Redo size={16} /> {c.redo}
          </button>
          <button
            onClick={addText}
            className="flex items-center gap-2 px-3 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
          >
            <Type size={16} /> {c.addText}
          </button>
          <button
            onClick={() => addShape('rect')}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Square size={16} /> {c.rectangle}
          </button>
          <button
            onClick={() => addShape('circle')}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Circle size={16} /> {c.circle}
          </button>
          <button
            onClick={addImage}
            className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <ImageIcon size={16} /> {c.addImage}
          </button>
          <button
            onClick={deleteSelected}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 size={16} /> {c.delete}
          </button>
          <button
            onClick={exportPNG}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download size={16} /> {c.exportPng}
          </button>
        </div>

        <div className="flex gap-4 items-center mb-4">
          <label className="flex items-center gap-2 text-mono-700 dark:text-mono-300">
            <Palette size={20} /> {c.color}
          </label>
          {ChromePicker && <ChromePicker color={color} onChange={setColor} />}
        </div>

        <div className="bg-white dark:bg-mono-900 border border-mono-200 dark:border-mono-700 rounded-lg shadow overflow-auto">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  )
}

export default function SocialGraphicsTool() {
  const { language } = useLanguage()
  const c = copy[language]

  const howToUse = (
    <ol className="list-decimal list-inside space-y-1 ml-2">
      {c.howToUse.map((step, i) => (
        <li key={i}>
          <strong>{step.label}</strong>
          {step.text ? ` ${step.text}` : ''}
        </li>
      ))}
    </ol>
  )

  return (
    <ToolAccessGate
      toolSlug="social-graphics"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <SocialGraphicsToolContent />
    </ToolAccessGate>
  )
}
