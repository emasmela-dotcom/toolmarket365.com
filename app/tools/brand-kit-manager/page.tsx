'use client'

import React, { useState, useEffect } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface BrandKit {
  name: string
  c1: string
  c2: string
  tag: string
}

const copy = {
  en: {
    toolName: 'Brand Kit Manager',
    toolDescription:
      'Stores and manages your brand kit including brand name, primary and secondary colors, and brand tagline. Saves your brand identity for easy reference and consistency across your content.',
    howToUse: [
      { label: 'Enter brand name:', text: 'Type your brand or business name' },
      { label: 'Select primary color:', text: 'Choose your main brand color using the color picker' },
      { label: 'Select secondary color:', text: 'Choose your secondary brand color' },
      { label: 'Enter tagline (optional):', text: 'Add your brand tagline or slogan' },
      { label: 'Click "Save Brand Kit"', text: 'to store your brand identity' },
      { label: 'View saved kit:', text: 'Your brand kit is automatically loaded and displayed when you return' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Stores and manages your brand kit including brand name, primary and secondary colors, and brand tagline. Saves your brand identity for easy reference and consistency across your content.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter brand name:', text: 'Type your brand or business name' },
      { label: 'Select primary color:', text: 'Choose your main brand color using the color picker' },
      { label: 'Select secondary color:', text: 'Choose your secondary brand color' },
      { label: 'Enter tagline (optional):', text: 'Add your brand tagline or slogan' },
      { label: 'Click "Save Brand Kit"', text: 'to store your brand identity' },
      { label: 'View saved kit:', text: 'Your brand kit is automatically loaded and displayed when you return' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Saved brand kit with name, colors, and tagline',
      'Visual preview of your brand colors',
      'Persistent storage - brand kit saved in browser',
      'Easy reference for consistent brand usage',
      'Color codes displayed in hex format',
    ],
    title: 'Brand Kit Manager',
    brandNameLabel: 'Brand name',
    brandNamePlaceholder: 'Enter brand name',
    primaryColourLabel: 'Primary colour',
    secondaryColourLabel: 'Secondary colour',
    taglineLabel: 'Tagline',
    taglinePlaceholder: 'Enter brand tagline',
    save: 'Save',
    load: 'Load',
  },
  es: {
    toolName: 'Gestor de kit de marca',
    toolDescription:
      'Almacena y gestiona tu kit de marca incluyendo nombre, colores primario y secundario, y eslogan. Guarda tu identidad de marca para referencia fácil y consistencia en tu contenido.',
    howToUse: [
      { label: 'Ingresa el nombre de marca:', text: 'Escribe el nombre de tu marca o negocio' },
      { label: 'Selecciona color primario:', text: 'Elige tu color principal con el selector de color' },
      { label: 'Selecciona color secundario:', text: 'Elige tu color secundario de marca' },
      { label: 'Ingresa eslogan (opcional):', text: 'Agrega el eslogan o slogan de tu marca' },
      { label: 'Haz clic en "Guardar kit de marca"', text: 'para almacenar tu identidad de marca' },
      { label: 'Ver kit guardado:', text: 'Tu kit de marca se carga y muestra automáticamente al regresar' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Almacena y gestiona tu kit de marca incluyendo nombre, colores primario y secundario, y eslogan. Guarda tu identidad de marca para referencia fácil y consistencia en tu contenido.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Ingresa el nombre de marca:', text: 'Escribe el nombre de tu marca o negocio' },
      { label: 'Selecciona color primario:', text: 'Elige tu color principal con el selector de color' },
      { label: 'Selecciona color secundario:', text: 'Elige tu color secundario de marca' },
      { label: 'Ingresa eslogan (opcional):', text: 'Agrega el eslogan o slogan de tu marca' },
      { label: 'Haz clic en "Guardar kit de marca"', text: 'para almacenar tu identidad de marca' },
      { label: 'Ver kit guardado:', text: 'Tu kit de marca se carga y muestra automáticamente al regresar' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Kit de marca guardado con nombre, colores y eslogan',
      'Vista previa visual de tus colores de marca',
      'Almacenamiento persistente: kit guardado en el navegador',
      'Referencia fácil para uso consistente de marca',
      'Códigos de color mostrados en formato hex',
    ],
    title: 'Gestor de kit de marca',
    brandNameLabel: 'Nombre de marca',
    brandNamePlaceholder: 'Ingresa el nombre de marca',
    primaryColourLabel: 'Color primario',
    secondaryColourLabel: 'Color secundario',
    taglineLabel: 'Eslogan',
    taglinePlaceholder: 'Ingresa el eslogan de marca',
    save: 'Guardar',
    load: 'Cargar',
  },
}

function BrandKitManagerContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [name, setName] = useState('')
  const [c1, setC1] = useState('#0a66c2')
  const [c2, setC2] = useState('#16a34a')
  const [tag, setTag] = useState('')
  const [kit, setKit] = useState<BrandKit | null>(null)

  useEffect(() => {
    load()
  }, [])

  const save = () => {
    const brandKit: BrandKit = {
      name,
      c1,
      c2,
      tag,
    }
    localStorage.setItem('brand', JSON.stringify(brandKit))
    setKit(brandKit)
  }

  const load = () => {
    const stored = localStorage.getItem('brand')
    if (stored) {
      const k: BrandKit = JSON.parse(stored)
      if (k.name) {
        setName(k.name)
        setC1(k.c1 || '#0a66c2')
        setC2(k.c2 || '#16a34a')
        setTag(k.tag || '')
        setKit(k)
      }
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
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
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{c.brandNameLabel}</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder={c.brandNamePlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{c.primaryColourLabel}</label>
            <input
              id="c1"
              type="color"
              value={c1}
              onChange={(e) => setC1(e.target.value)}
              className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{c.secondaryColourLabel}</label>
            <input
              id="c2"
              type="color"
              value={c2}
              onChange={(e) => setC2(e.target.value)}
              className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{c.taglineLabel}</label>
            <input
              id="tag"
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder={c.taglinePlaceholder}
            />
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button onClick={save} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
            {c.save}
          </button>
          <button onClick={load} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors">
            {c.load}
          </button>
        </div>

        {kit && (
          <div id="kit" className="mt-4 p-6 border-2 rounded-lg" style={{ borderColor: kit.c1 }}>
            <strong className="text-xl text-gray-900 dark:text-white block mb-2">{kit.name}</strong>
            <div className="mb-2">
              <span className="inline-block w-4 h-4 rounded mr-2" style={{ backgroundColor: kit.c1 }} />
              {kit.c1}{' '}
              <span className="inline-block w-4 h-4 rounded mr-2 ml-4" style={{ backgroundColor: kit.c2 }} />
              {kit.c2}
            </div>
            <em className="text-gray-600 dark:text-gray-400">{kit.tag}</em>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BrandKitManager() {
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
      toolSlug="brand-kit-manager"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <BrandKitManagerContent />
    </ToolAccessGate>
  )
}
