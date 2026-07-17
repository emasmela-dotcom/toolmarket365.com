'use client'

import React, { useState, useRef } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

type Copy = {
  toolName: string
  toolDescription: string
  howToUse: { label: string; text: string }[]
  howToUseTitle: string
  whatItDoes: string
  whatItDoesBody: string
  howToUseInner: string
  howToUseSteps: { label: string; text: string }[]
  expectedOutcome: string
  expectedOutcomes: string[]
  title: string
  uploadLabel: string
  preview: string
  extractedPalette: string
  clickToCopy: (color: string) => string
  clickColorHint: string
  emptyState: string
  imageFileAlert: string
  uploadedAlt: string
}

const copy: Record<'en' | 'es', Copy> = {
  en: {
    toolName: 'Color Palette Extractor',
    toolDescription:
      'Extracts dominant colors from uploaded images. Analyzes image pixels to identify the top 5 most frequent colors and displays them as a color palette with hex codes.',
    howToUse: [
      { label: 'Upload image:', text: 'Click "Choose Image" or drag and drop an image file' },
      { label: 'View palette:', text: 'See the top 5 dominant colors extracted from your image' },
      { label: 'Copy colors:', text: 'Click on any color swatch to copy its hex code to clipboard' },
      { label: 'Use colors:', text: 'Use the extracted colors for your brand kit, design projects, or content creation' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Extracts the dominant colors from any uploaded image. Analyzes the image and identifies the top 5 most frequent colors, perfect for creating color palettes from photos, designs, or inspiration images.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Upload an image:', text: 'Click "Choose Image" or drag and drop an image file' },
      { label: 'Wait for processing:', text: 'The tool analyzes the image pixels' },
      { label: 'View extracted colors:', text: 'See the top 5 dominant colors displayed as color swatches' },
      { label: 'Copy color codes:', text: 'Click any color to copy its hex code to clipboard' },
      { label: 'Use the palette:', text: 'Use the extracted colors in your designs, brand kit, or content' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Top 5 dominant colors from your image',
      'Visual color swatches for each color',
      'Hex color codes for each color',
      'One-click copy functionality for color codes',
      'Image preview showing the analyzed image',
    ],
    title: 'Color Palette Extractor',
    uploadLabel: 'Upload an image to extract its color palette',
    preview: 'Preview',
    extractedPalette: 'Extracted Color Palette (Top 5)',
    clickToCopy: (color) => `Click to copy: ${color}`,
    clickColorHint: 'Click on any color to copy its hex code',
    emptyState: 'Upload an image to extract its dominant colors',
    imageFileAlert: 'Please select an image file',
    uploadedAlt: 'Uploaded',
  },
  es: {
    toolName: 'Extractor de paleta de colores',
    toolDescription:
      'Extrae los colores dominantes de imágenes subidas. Analiza los píxeles para identificar los 5 colores más frecuentes y los muestra como una paleta con códigos hex.',
    howToUse: [
      { label: 'Sube una imagen:', text: 'Haz clic en "Elegir imagen" o arrastra y suelta un archivo de imagen' },
      { label: 'Ver paleta:', text: 'Mira los 5 colores dominantes extraídos de tu imagen' },
      { label: 'Copiar colores:', text: 'Haz clic en cualquier muestra de color para copiar su código hex' },
      { label: 'Usar colores:', text: 'Usa los colores extraídos para tu kit de marca, diseños o contenido' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Extrae los colores dominantes de cualquier imagen subida. Analiza la imagen e identifica los 5 colores más frecuentes, ideal para crear paletas a partir de fotos, diseños o imágenes de inspiración.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Sube una imagen:', text: 'Haz clic en "Elegir imagen" o arrastra y suelta un archivo de imagen' },
      { label: 'Espera el procesamiento:', text: 'La herramienta analiza los píxeles de la imagen' },
      { label: 'Ver colores extraídos:', text: 'Mira los 5 colores dominantes mostrados como muestras' },
      { label: 'Copiar códigos de color:', text: 'Haz clic en cualquier color para copiar su código hex' },
      { label: 'Usar la paleta:', text: 'Usa los colores extraídos en tus diseños, kit de marca o contenido' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Los 5 colores dominantes de tu imagen',
      'Muestras visuales para cada color',
      'Códigos hex para cada color',
      'Copia con un clic de los códigos de color',
      'Vista previa de la imagen analizada',
    ],
    title: 'Extractor de paleta de colores',
    uploadLabel: 'Sube una imagen para extraer su paleta de colores',
    preview: 'Vista previa',
    extractedPalette: 'Paleta de colores extraída (Top 5)',
    clickToCopy: (color) => `Clic para copiar: ${color}`,
    clickColorHint: 'Haz clic en cualquier color para copiar su código hex',
    emptyState: 'Sube una imagen para extraer sus colores dominantes',
    imageFileAlert: 'Por favor selecciona un archivo de imagen',
    uploadedAlt: 'Subida',
  },
}

function ColorPaletteExtractorContent({ c }: { c: Copy }) {
  const [palette, setPalette] = useState<string[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const extractColors = (imageFile: File) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) return

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        const freq: Record<string, number> = {}

        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i]
          const g = imageData[i + 1]
          const b = imageData[i + 2]
          const hex = '#' + [r, g, b]
            .map(x => x.toString(16).padStart(2, '0'))
            .join('')

          freq[hex] = (freq[hex] || 0) + 1
        }

        const top = Object.entries(freq)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([hex]) => hex)

        setPalette(top)
      }

      img.src = e.target?.result as string
      setImagePreview(e.target?.result as string)
    }

    reader.readAsDataURL(imageFile)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert(c.imageFileAlert)
      return
    }

    extractColors(file)
  }

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color)
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
                  <li key={i}>
                    <strong>{step.label}</strong> {step.text}
                  </li>
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

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          {c.title}
        </h1>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            {c.uploadLabel}
          </label>
          <input
            ref={fileInputRef}
            type="file"
            id="img"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700
              cursor-pointer"
          />
        </div>

        {imagePreview && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              {c.preview}
            </h2>
            <img
              src={imagePreview}
              alt={c.uploadedAlt}
              className="max-w-full h-auto rounded-lg border border-gray-300 dark:border-gray-600"
            />
          </div>
        )}

        {palette.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {c.extractedPalette}
            </h2>
            <div className="flex gap-4 flex-wrap">
              {palette.map((color, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center group"
                >
                  <div
                    className="w-20 h-20 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer hover:scale-110 transition-transform shadow-lg"
                    style={{ backgroundColor: color }}
                    onClick={() => copyColor(color)}
                    title={c.clickToCopy(color)}
                  />
                  <span className="mt-2 text-sm font-mono text-gray-700 dark:text-gray-300">
                    {color}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {c.clickColorHint}
            </p>
          </div>
        )}

        {palette.length === 0 && !imagePreview && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>{c.emptyState}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ColorPaletteExtractor() {
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
      toolSlug="color-palette-extractor"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <ColorPaletteExtractorContent c={c} />
    </ToolAccessGate>
  )
}
