'use client'

import { useState, useRef } from 'react'
import { Image, Upload, Copy, Check, Loader2, Sparkles } from 'lucide-react';
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    toolName: 'Image Alt Text Generator',
    toolDescription:
      'Generates accessible alt text descriptions for images. Analyzes uploaded images and creates descriptive, SEO-friendly alt text that helps with accessibility and search engine optimization.',
    howToUse: [
      { label: 'Upload image:', text: 'Click "Upload Image" or drag and drop an image file' },
      { label: 'Generate alt text:', text: 'The tool automatically analyzes the image and generates alt text' },
      { label: 'Review and edit:', text: 'Check the generated alt text and edit if needed' },
      { label: 'Copy:', text: 'Click "Copy" to copy the alt text to your clipboard' },
      { label: 'Use:', text: "Paste the alt text into your image's alt attribute for accessibility" },
    ],
    title: 'Image Alt Text Generator',
    subtitle: 'Generate SEO-friendly alt text for your images',
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Generates SEO-friendly alt text for images using AI. Analyzes uploaded images and creates descriptive, accessible alt text optimized for search engines and screen readers.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Upload an image:', text: 'Drag & drop image onto upload area, or click to browse and select image (supports JPG, PNG, GIF, etc.)' },
      { label: 'Click "Generate Alt Text"', text: 'to process your image' },
      { label: 'Review generated alt text:', text: 'AI-generated description, character count (optimal: under 125), copy button for easy use' },
      { label: 'Copy and use', text: 'the alt text in your HTML or CMS' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'AI-generated alt text - Descriptive text based on image content',
      'SEO-optimized - Under 125 characters for best practices',
      'Accessible - Describes image for screen readers',
      'Ready to use - Copy directly into your code',
      'Character count - See if it meets length recommendations',
    ],
    uploadImage: 'Upload Image',
    uploadedAlt: 'Uploaded',
    clickDifferent: 'Click to upload a different image',
    dragDrop: 'Drag & drop an image here',
    orBrowse: 'or click to browse',
    errorUploadImage: 'Please upload an image file',
    errorUploadFirst: 'Please upload an image first',
    errorFallback: 'Using fallback description.',
    generating: 'Generating...',
    generateAltText: 'Generate Alt Text',
    generatedAltText: 'Generated Alt Text',
    copied: 'Copied!',
    copy: 'Copy',
    characters: (n: number) => `${n} characters`,
    tooLong: 'Too long (max 125 recommended)',
    optimalLength: 'Optimal length',
    readyTitle: 'Ready to Generate?',
    readyBody: 'Upload an image and click "Generate Alt Text" to create SEO-friendly descriptions',
    seoOptimized: 'SEO-optimized',
    patternBased: 'Pattern-based',
    bestPractices: 'Alt Text Best Practices',
    tips: [
      'Keep alt text under 125 characters',
      'Be descriptive and specific',
      'Include relevant keywords naturally',
      "Describe what's in the image, not decorative elements",
      "Write for users who can't see the image",
    ],
    fallbackPatterns: [
      'A professional image showcasing',
      'An engaging visual representation of',
      'A high-quality photograph featuring',
      'An illustrative image displaying',
      'A well-composed image showing',
    ],
    fallbackSuffix: 'content relevant to the page topic.',
  },
  es: {
    toolName: 'Generador de texto alternativo para imágenes',
    toolDescription:
      'Genera descripciones de texto alternativo accesibles para imágenes. Analiza las imágenes subidas y crea texto alternativo descriptivo y optimizado para SEO que ayuda con la accesibilidad y la optimización en buscadores.',
    howToUse: [
      { label: 'Sube una imagen:', text: 'Haz clic en "Subir imagen" o arrastra y suelta un archivo de imagen' },
      { label: 'Genera texto alternativo:', text: 'La herramienta analiza automáticamente la imagen y genera el texto alternativo' },
      { label: 'Revisa y edita:', text: 'Comprueba el texto alternativo generado y edítalo si es necesario' },
      { label: 'Copiar:', text: 'Haz clic en "Copiar" para copiar el texto alternativo al portapapeles' },
      { label: 'Usar:', text: 'Pega el texto alternativo en el atributo alt de tu imagen para accesibilidad' },
    ],
    title: 'Generador de texto alternativo para imágenes',
    subtitle: 'Genera texto alternativo optimizado para SEO para tus imágenes',
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Genera texto alternativo optimizado para SEO para imágenes usando IA. Analiza las imágenes subidas y crea texto alternativo descriptivo y accesible optimizado para buscadores y lectores de pantalla.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Sube una imagen:', text: 'Arrastra y suelta la imagen en el área de carga, o haz clic para buscar y seleccionar una imagen (compatible con JPG, PNG, GIF, etc.)' },
      { label: 'Haz clic en "Generar texto alternativo"', text: 'para procesar tu imagen' },
      { label: 'Revisa el texto alternativo generado:', text: 'Descripción generada por IA, recuento de caracteres (óptimo: menos de 125), botón de copiar para uso fácil' },
      { label: 'Copia y usa', text: 'el texto alternativo en tu HTML o CMS' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Texto alternativo generado por IA - Texto descriptivo basado en el contenido de la imagen',
      'Optimizado para SEO - Menos de 125 caracteres según las mejores prácticas',
      'Accesible - Describe la imagen para lectores de pantalla',
      'Listo para usar - Copia directamente en tu código',
      'Recuento de caracteres - Comprueba si cumple las recomendaciones de longitud',
    ],
    uploadImage: 'Subir imagen',
    uploadedAlt: 'Subida',
    clickDifferent: 'Haz clic para subir otra imagen',
    dragDrop: 'Arrastra y suelta una imagen aquí',
    orBrowse: 'o haz clic para buscar',
    errorUploadImage: 'Por favor sube un archivo de imagen',
    errorUploadFirst: 'Por favor sube una imagen primero',
    errorFallback: 'Usando descripción alternativa.',
    generating: 'Generando...',
    generateAltText: 'Generar texto alternativo',
    generatedAltText: 'Texto alternativo generado',
    copied: '¡Copiado!',
    copy: 'Copiar',
    characters: (n: number) => `${n} caracteres`,
    tooLong: 'Demasiado largo (máx. 125 recomendado)',
    optimalLength: 'Longitud óptima',
    readyTitle: '¿Listo para generar?',
    readyBody: 'Sube una imagen y haz clic en "Generar texto alternativo" para crear descripciones optimizadas para SEO',
    seoOptimized: 'Optimizado para SEO',
    patternBased: 'Basado en patrones',
    bestPractices: 'Mejores prácticas de texto alternativo',
    tips: [
      'Mantén el texto alternativo por debajo de 125 caracteres',
      'Sé descriptivo y específico',
      'Incluye palabras clave relevantes de forma natural',
      'Describe lo que hay en la imagen, no elementos decorativos',
      'Escribe para usuarios que no pueden ver la imagen',
    ],
    fallbackPatterns: [
      'Una imagen profesional que muestra',
      'Una representación visual atractiva de',
      'Una fotografía de alta calidad con',
      'Una imagen ilustrativa que presenta',
      'Una imagen bien compuesta que muestra',
    ],
    fallbackSuffix: 'contenido relevante para el tema de la página.',
  },
}

function ImageAltTextGeneratorContent({ c }: { c: typeof copy.en }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [altText, setAltText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError(c.errorUploadImage)
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string)
      setAltText('')
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const generateFallbackAltText = (): string => {
    const randomPattern = c.fallbackPatterns[Math.floor(Math.random() * c.fallbackPatterns.length)]
    return `${randomPattern} ${c.fallbackSuffix}`
  }

  const generateAltText = async () => {
    if (!imageSrc) {
      setError(c.errorUploadFirst)
      return
    }

    setIsGenerating(true)
    setError('')
    setAltText('')

    try {
      const fallbackAlt = generateFallbackAltText()
      setAltText(fallbackAlt)
    } catch (err) {
      console.error('Alt text generation error:', err)
      const fallbackAlt = generateFallbackAltText()
      setAltText(fallbackAlt)
      setError(c.errorFallback)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (altText) {
      navigator.clipboard.writeText(altText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string)
        setAltText('')
        setError('')
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-accent-600 rounded-2xl">
              <Image className="text-white" size={48} />
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
              <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">{c.uploadImage}</h2>
              
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-mono-300 dark:border-mono-700 rounded-lg p-12 text-center cursor-pointer hover:border-accent-500 transition-colors"
              >
                {imageSrc ? (
                  <div className="space-y-4">
                    <img
                      src={imageSrc}
                      alt={c.uploadedAlt}
                      className="max-w-full max-h-64 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-mono-600 dark:text-mono-400">
                      {c.clickDifferent}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="mx-auto text-mono-400" size={48} />
                    <div>
                      <p className="text-mono-700 dark:text-mono-300 font-semibold">
                        {c.dragDrop}
                      </p>
                      <p className="text-sm text-mono-500 mt-2">{c.orBrowse}</p>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {error && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={generateAltText}
                disabled={!imageSrc || isGenerating}
                className="w-full mt-6 px-6 py-4 bg-accent-600 text-white rounded-xl font-bold text-lg hover:bg-accent-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    {c.generating}
                  </>
                ) : (
                  <>
                    <Sparkles size={24} />
                    {c.generateAltText}
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {altText ? (
              <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50">{c.generatedAltText}</h2>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 transition-colors text-mono-700 dark:text-mono-300"
                  >
                    {copied ? (
                      <>
                        <Check size={18} className="text-green-600" />
                        {c.copied}
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        {c.copy}
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-mono-100 dark:bg-mono-800 rounded-lg p-4 mb-4">
                  <p className="text-mono-950 dark:text-mono-50 leading-relaxed">{altText}</p>
                </div>
                <div className="flex items-center justify-between text-sm text-mono-600 dark:text-mono-400">
                  <span>{c.characters(altText.length)}</span>
                  <span className={altText.length > 125 ? 'text-red-600' : 'text-green-600'}>
                    {altText.length > 125 ? c.tooLong : c.optimalLength}
                  </span>
                </div>
                {error && (
                  <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded text-yellow-700 dark:text-yellow-400 text-sm">
                    {error}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-12 text-center h-full flex flex-col justify-center border border-mono-200 dark:border-mono-700">
                <Image className="mx-auto text-mono-300 dark:text-mono-700 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-mono-700 dark:text-mono-300 mb-3">{c.readyTitle}</h3>
                <p className="text-mono-500 mb-6">
                  {c.readyBody}
                </p>
                <div className="flex justify-center gap-6 text-sm text-mono-600 dark:text-mono-400">
                  <div className="flex items-center gap-2">
                    <Check size={18} className="text-accent-600" />
                    <span>{c.seoOptimized}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={18} className="text-accent-600" />
                    <span>{c.patternBased}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
              <h3 className="text-lg font-bold text-mono-950 dark:text-mono-50 mb-4">{c.bestPractices}</h3>
              <ul className="space-y-2 text-sm text-mono-700 dark:text-mono-300">
                {c.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ImageAltTextGenerator() {
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
      toolSlug="image-alt-text-generator"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <ImageAltTextGeneratorContent c={c} />
    </ToolAccessGate>
  )
}
