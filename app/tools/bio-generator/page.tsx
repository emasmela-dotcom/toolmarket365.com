'use client'

import React, { useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    toolName: 'Bio Generator',
    toolDescription:
      'Generate professional social media bios instantly. Create compelling bios for Instagram, Twitter, LinkedIn, and other platforms based on what you do and who you help.',
    howToUse: [
      { label: 'Enter what you do:', text: 'Describe your profession, business, or expertise' },
      { label: 'Enter who you help:', text: 'Describe your target audience or customers' },
      { label: 'Add emoji (optional):', text: 'Include an emoji to personalize your bio' },
      { label: 'Click "Generate"', text: 'to create multiple bio variations' },
      { label: 'Copy your favorite:', text: 'Select and copy the bio that best fits your brand' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Generates professional social media bios based on what you do, who you help, and optional emoji. Creates multiple bio variations using proven templates.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter "What you do":', text: 'Describe your profession or service (e.g., "content creator", "marketing consultant")' },
      { label: 'Enter "Who you help":', text: 'Describe your target audience (e.g., "small businesses", "content creators")' },
      { label: 'Add emoji (optional):', text: 'Include an emoji to personalize your bio' },
      { label: 'Click "Generate Bio"', text: 'for a single bio or "Generate 3 Bios" for multiple variations' },
      { label: 'Copy and use:', text: 'Click any generated bio to copy it to clipboard' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Professional bio tailored to your profession and audience',
      'Multiple bio variations using different templates',
      'History of last 5 generated bios',
      'One-click copy functionality',
      'Ready-to-use bios for social media profiles',
    ],
    title: 'Bio Generator',
    supportedPlatforms: 'Supported Platforms:',
    whatYouDo: 'What you do',
    whatYouDoPlaceholder: 'e.g., create content, design websites, write code',
    whoYouHelp: 'Who you help',
    whoYouHelpPlaceholder: 'e.g., small businesses, creators, entrepreneurs',
    emojiOptional: 'Emoji (optional)',
    emojiHint: 'Add 1-2 emojis to make your bio more engaging',
    generate: 'Generate',
    generate3: 'Generate 3 Options',
    generatedBio: 'Generated Bio',
    copy: 'Copy',
    characters: (n: number) => `${n} characters`,
    allOptions: 'All Generated Options',
    useAndCopy: 'Use & Copy',
    howItWorks: 'How it works:',
    howItWorksBody:
      'Fill in what you do and who you help, optionally add an emoji, then click Generate to create a professional bio for your social media profiles.',
    fillFieldsAlert: 'Please fill in "What you do" and "Who you help" fields',
    copiedAlert: 'Bio copied to clipboard!',
    templates: [
      '{em} I help {who} {do}',
      '{do} | empowering {who}',
      '{em} {do} for {who}',
      '{em} {do} specialist helping {who}',
      'Building {do} solutions for {who} {em}',
      '{em} {do} expert | Helping {who} succeed',
    ],
  },
  es: {
    toolName: 'Generador de bios',
    toolDescription:
      'Genera bios profesionales para redes al instante. Crea bios atractivas para Instagram, Twitter, LinkedIn y más según lo que haces y a quién ayudas.',
    howToUse: [
      { label: 'Ingresa lo que haces:', text: 'Describe tu profesión, negocio o experiencia' },
      { label: 'Ingresa a quién ayudas:', text: 'Describe tu audiencia o clientes' },
      { label: 'Agrega emoji (opcional):', text: 'Incluye un emoji para personalizar tu bio' },
      { label: 'Haz clic en "Generar"', text: 'para crear varias variaciones de bio' },
      { label: 'Copia tu favorita:', text: 'Elige y copia la bio que mejor encaje con tu marca' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Genera bios profesionales para redes según lo que haces, a quién ayudas y un emoji opcional. Crea varias variaciones con plantillas probadas.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Ingresa "Lo que haces":', text: 'Describe tu profesión o servicio (ej. "creador de contenido", "consultor de marketing")' },
      { label: 'Ingresa "A quién ayudas":', text: 'Describe tu audiencia (ej. "pequeños negocios", "creadores de contenido")' },
      { label: 'Agrega emoji (opcional):', text: 'Incluye un emoji para personalizar tu bio' },
      { label: 'Haz clic en "Generar"', text: 'para una bio o en "Generar 3 opciones" para varias variaciones' },
      { label: 'Copia y usa:', text: 'Haz clic en cualquier bio generada para copiarla' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Bio profesional adaptada a tu profesión y audiencia',
      'Varias variaciones con distintas plantillas',
      'Historial de las últimas 5 bios generadas',
      'Copia con un clic',
      'Bios listas para usar en perfiles',
    ],
    title: 'Generador de bios',
    supportedPlatforms: 'Plataformas compatibles:',
    whatYouDo: 'Lo que haces',
    whatYouDoPlaceholder: 'ej. crear contenido, diseñar sitios web, programar',
    whoYouHelp: 'A quién ayudas',
    whoYouHelpPlaceholder: 'ej. pequeños negocios, creadores, emprendedores',
    emojiOptional: 'Emoji (opcional)',
    emojiHint: 'Agrega 1-2 emojis para que tu bio sea más atractiva',
    generate: 'Generar',
    generate3: 'Generar 3 opciones',
    generatedBio: 'Bio generada',
    copy: 'Copiar',
    characters: (n: number) => `${n} caracteres`,
    allOptions: 'Todas las opciones generadas',
    useAndCopy: 'Usar y copiar',
    howItWorks: 'Cómo funciona:',
    howItWorksBody:
      'Completa lo que haces y a quién ayudas, agrega un emoji si quieres y haz clic en Generar para crear una bio profesional para tus perfiles.',
    fillFieldsAlert: 'Completa los campos "Lo que haces" y "A quién ayudas"',
    copiedAlert: '¡Bio copiada al portapapeles!',
    templates: [
      '{em} Ayudo a {who} a {do}',
      '{do} | impulsando a {who}',
      '{em} {do} para {who}',
      '{em} Especialista en {do} ayudando a {who}',
      'Creando soluciones de {do} para {who} {em}',
      '{em} Experto en {do} | Ayudando a {who} a triunfar',
    ],
  },
}

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function BioGeneratorContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [whatYouDo, setWhatYouDo] = useState('')
  const [whoYouHelp, setWhoYouHelp] = useState('')
  const [emoji, setEmoji] = useState('')
  const [generatedBio, setGeneratedBio] = useState<string | null>(null)
  const [generatedBios, setGeneratedBios] = useState<string[]>([])

  const generate = () => {
    if (!whatYouDo.trim() || !whoYouHelp.trim()) {
      alert(c.fillFieldsAlert)
      return
    }

    const template = rand(c.templates)
    const bio = template
      .replace('{do}', whatYouDo.trim())
      .replace('{who}', whoYouHelp.trim())
      .replace('{em}', emoji.trim() || '')
      .trim()

    setGeneratedBio(bio)
    setGeneratedBios((prev) => [bio, ...prev].slice(0, 5)) // Keep last 5
  }

  const generateMultiple = () => {
    if (!whatYouDo.trim() || !whoYouHelp.trim()) {
      alert(c.fillFieldsAlert)
      return
    }

    const bios: string[] = []
    const usedTemplates = new Set<number>()

    // Generate 3 unique bios
    while (bios.length < 3 && usedTemplates.size < c.templates.length) {
      const randomIndex = Math.floor(Math.random() * c.templates.length)
      if (!usedTemplates.has(randomIndex)) {
        usedTemplates.add(randomIndex)
        const template = c.templates[randomIndex]
        const bio = template
          .replace('{do}', whatYouDo.trim())
          .replace('{who}', whoYouHelp.trim())
          .replace('{em}', emoji.trim() || '')
          .trim()
        bios.push(bio)
      }
    }

    setGeneratedBios(bios)
    setGeneratedBio(bios[0])
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert(c.copiedAlert)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Documentation Section */}
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
                  <li key={i}><strong>{step.label}</strong> {step.text}</li>
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

        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          {c.title}
        </h1>

        {/* Supported Platforms */}
        <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-4 mb-6">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">{c.supportedPlatforms}</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">📸 Instagram</span>
            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">🎵 TikTok</span>
            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">💼 LinkedIn</span>
            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">🐦 Twitter/X</span>
            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">📘 Facebook</span>
            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">📺 YouTube</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.whatYouDo}
            </label>
            <input
              id="do"
              type="text"
              value={whatYouDo}
              onChange={(e) => setWhatYouDo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder={c.whatYouDoPlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.whoYouHelp}
            </label>
            <input
              id="who"
              type="text"
              value={whoYouHelp}
              onChange={(e) => setWhoYouHelp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder={c.whoYouHelpPlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.emojiOptional}
            </label>
            <input
              id="em"
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
              maxLength={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="🎯 ✨ 💡"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {c.emojiHint}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={generate}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              {c.generate}
            </button>
            <button
              onClick={generateMultiple}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              {c.generate3}
            </button>
          </div>
        </div>

        {generatedBio && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {c.generatedBio}
              </h2>
              <button
                onClick={() => copyToClipboard(generatedBio)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm transition-colors"
              >
                {c.copy}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-lg text-gray-800 dark:text-gray-200 font-medium bg-white dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700">
              {generatedBio}
            </pre>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {c.characters(generatedBio.length)}
            </p>
          </div>
        )}

        {generatedBios.length > 1 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {c.allOptions}
            </h3>
            <div className="space-y-3">
              {generatedBios.map((bio, index) => (
                <div
                  key={index}
                  className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex justify-between items-center"
                >
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    {bio}
                  </p>
                  <button
                    onClick={() => {
                      setGeneratedBio(bio)
                      copyToClipboard(bio)
                    }}
                    className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                  >
                    {c.useAndCopy}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!generatedBio && (
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-blue-800 dark:text-blue-200">
              <strong>{c.howItWorks}</strong> {c.howItWorksBody}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BioGenerator() {
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
      toolSlug="bio-generator"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <BioGeneratorContent />
    </ToolAccessGate>
  )
}
