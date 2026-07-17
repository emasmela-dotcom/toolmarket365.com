'use client'

import React, { useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    toolName: 'Style Guide Creator',
    toolDescription:
      'Creates comprehensive brand style guides including brand name, logo, colors, typography, voice and tone, and usage guidelines. Generates a complete style guide document for brand consistency.',
    howToUse: [
      { label: 'Enter brand name:', text: 'Type your brand or business name' },
      { label: 'Add logo URL (optional):', text: 'Enter your logo image URL' },
      { label: 'Select colors:', text: 'Choose primary and secondary brand colors' },
      { label: 'Define voice:', text: "Describe your brand's voice and tone" },
      { label: 'Add guidelines:', text: 'Enter usage guidelines and rules' },
      { label: 'Generate guide:', text: 'Create and download your style guide' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Creates a professional brand style guide in Markdown format. Generates a document with your brand name, logo, colors, and voice & tone guidelines that you can use for your team or reference.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter brand name:', text: 'Type your brand or business name' },
      { label: 'Enter logo URL (optional):', text: 'Add a URL to your logo image' },
      { label: 'Select primary color:', text: 'Choose your main brand color' },
      { label: 'Select secondary color:', text: 'Choose your secondary brand color' },
      { label: 'Enter voice & tone:', text: 'Describe your brand\'s voice and tone (e.g., "Friendly, concise, professional")' },
      { label: 'Click "Build Style Guide"', text: 'to generate the guide' },
      { label: 'Copy or download:', text: 'Copy to clipboard or download as Markdown file' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Professional style guide in Markdown format',
      'Brand name, logo, colors, and voice & tone sections',
      'Formatted document ready to share with your team',
      'Copy to clipboard functionality',
      'Download as .md file option',
    ],
    title: 'Style Guide Creator',
    brandName: 'Brand name',
    brandNamePlaceholder: 'Enter your brand name',
    logoUrl: 'Logo URL',
    primaryColour: 'Primary colour',
    secondaryColour: 'Secondary colour',
    voiceTone: 'Voice & tone',
    voiceTonePlaceholder: "Describe your brand's voice and tone...",
    defaultVoiceTone: 'Friendly, concise, professional.',
    buildGuide: 'Build Guide',
    generatedGuide: 'Generated Style Guide',
    copy: 'Copy',
    downloadMd: 'Download .md',
    copiedAlert: 'Style guide copied to clipboard!',
    defaultBrand: 'Your Brand',
    guideLogo: 'Logo',
    guideColours: 'Colours',
    guidePrimary: 'Primary',
    guideSecondary: 'Secondary',
    guideVoiceTone: 'Voice & Tone',
  },
  es: {
    toolName: 'Creador de guía de estilo',
    toolDescription:
      'Crea guías de estilo de marca completas con nombre, logo, colores, tipografía, voz y tono, y pautas de uso. Genera un documento completo para mantener la consistencia de marca.',
    howToUse: [
      { label: 'Ingresa nombre de marca:', text: 'Escribe el nombre de tu marca o negocio' },
      { label: 'Agrega URL del logo (opcional):', text: 'Ingresa la URL de la imagen de tu logo' },
      { label: 'Selecciona colores:', text: 'Elige colores primario y secundario de marca' },
      { label: 'Define la voz:', text: 'Describe la voz y tono de tu marca' },
      { label: 'Agrega pautas:', text: 'Ingresa pautas y reglas de uso' },
      { label: 'Genera la guía:', text: 'Crea y descarga tu guía de estilo' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Crea una guía de estilo de marca profesional en formato Markdown. Genera un documento con nombre, logo, colores y pautas de voz y tono que puedes usar con tu equipo o como referencia.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Ingresa nombre de marca:', text: 'Escribe el nombre de tu marca o negocio' },
      { label: 'Ingresa URL del logo (opcional):', text: 'Agrega una URL a la imagen de tu logo' },
      { label: 'Selecciona color primario:', text: 'Elige tu color principal de marca' },
      { label: 'Selecciona color secundario:', text: 'Elige tu color secundario de marca' },
      { label: 'Ingresa voz y tono:', text: 'Describe la voz y tono de tu marca (ej. "Amigable, conciso, profesional")' },
      { label: 'Haz clic en "Crear guía de estilo"', text: 'para generar la guía' },
      { label: 'Copia o descarga:', text: 'Copia al portapapeles o descarga como archivo Markdown' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Guía de estilo profesional en formato Markdown',
      'Secciones de nombre, logo, colores, y voz y tono',
      'Documento formateado listo para compartir con tu equipo',
      'Función de copiar al portapapeles',
      'Opción de descargar como archivo .md',
    ],
    title: 'Creador de guía de estilo',
    brandName: 'Nombre de marca',
    brandNamePlaceholder: 'Ingresa el nombre de tu marca',
    logoUrl: 'URL del logo',
    primaryColour: 'Color primario',
    secondaryColour: 'Color secundario',
    voiceTone: 'Voz y tono',
    voiceTonePlaceholder: 'Describe la voz y tono de tu marca...',
    defaultVoiceTone: 'Amigable, conciso, profesional.',
    buildGuide: 'Crear guía',
    generatedGuide: 'Guía de estilo generada',
    copy: 'Copiar',
    downloadMd: 'Descargar .md',
    copiedAlert: '¡Guía de estilo copiada al portapapeles!',
    defaultBrand: 'Tu marca',
    guideLogo: 'Logo',
    guideColours: 'Colores',
    guidePrimary: 'Primario',
    guideSecondary: 'Secundario',
    guideVoiceTone: 'Voz y tono',
  },
}

function StyleGuideCreatorContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [brandName, setBrandName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#0a66c2')
  const [secondaryColor, setSecondaryColor] = useState('#16a34a')
  const [voiceTone, setVoiceTone] = useState(c.defaultVoiceTone)
  const [guide, setGuide] = useState<string | null>(null)

  const buildGuide = () => {
    const styleGuide = `# ${brandName || c.defaultBrand} Style Guide

## ${c.guideLogo}
![Logo](${logoUrl || 'https://example.com/logo.png'})

## ${c.guideColours}
- ${c.guidePrimary}: \`${primaryColor}\`
- ${c.guideSecondary}: \`${secondaryColor}\`

## ${c.guideVoiceTone}
${voiceTone}
`
    setGuide(styleGuide)
  }

  const copyToClipboard = () => {
    if (guide) {
      navigator.clipboard.writeText(guide)
      alert(c.copiedAlert)
    }
  }

  const downloadMarkdown = () => {
    if (guide) {
      const blob = new Blob([guide], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${brandName || 'style-guide'}-style-guide.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
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

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{c.title}</h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{c.brandName}</label>
            <input
              id="b"
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              placeholder={c.brandNamePlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{c.logoUrl}</label>
            <input
              id="l"
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{c.primaryColour}</label>
            <div className="flex gap-3 items-center">
              <input
                id="c1"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-20 h-12 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
              />
              <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{primaryColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{c.secondaryColour}</label>
            <div className="flex gap-3 items-center">
              <input
                id="c2"
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-20 h-12 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
              />
              <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{secondaryColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{c.voiceTone}</label>
            <textarea
              id="v"
              value={voiceTone}
              onChange={(e) => setVoiceTone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical placeholder:text-gray-500 dark:placeholder:text-gray-400"
              rows={4}
              placeholder={c.voiceTonePlaceholder}
            />
          </div>

          <button
            onClick={buildGuide}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {c.buildGuide}
          </button>
        </div>

        {guide && (
          <div
            id="out"
            className="mt-6 p-6 border-2 rounded-lg bg-gray-50 dark:bg-gray-800"
            style={{ borderColor: primaryColor }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{c.generatedGuide}</h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm transition-colors"
                >
                  {c.copy}
                </button>
                <button
                  onClick={downloadMarkdown}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
                >
                  {c.downloadMd}
                </button>
              </div>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono bg-white dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
              {guide}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default function StyleGuideCreator() {
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
      toolSlug="style-guide-creator"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <StyleGuideCreatorContent />
    </ToolAccessGate>
  )
}
