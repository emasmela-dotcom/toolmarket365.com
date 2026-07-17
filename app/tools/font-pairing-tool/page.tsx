'use client'

import React, { useState, useEffect } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const fonts = [
  'Arial',
  'Georgia',
  'Times',
  'Verdana',
  'Courier',
  'Impact',
  'Inter',
  'Roboto',
  'Poppins',
  'Lato',
  'Open Sans',
  'Montserrat'
]

const copy = {
  en: {
    toolName: 'Font Pairing Tool',
    toolDescription:
      'Helps you find the perfect font combinations for headings and body text. Preview different font pairings in real-time to create visually appealing and readable content designs.',
    howToUse: [
      { label: 'Select heading font:', text: 'Choose a font for your headings from the dropdown' },
      { label: 'Select body font:', text: 'Choose a font for your body text' },
      { label: 'Click "Apply":', text: 'See the font pairing preview with sample text' },
      { label: 'Experiment:', text: 'Try different combinations to find the perfect pairing' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Helps you find the perfect font combinations for headings and body text. Preview different font pairings in real-time to see how they look together before using them in your designs.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Select heading font:', text: 'Choose a font from the dropdown for your headings/titles' },
      { label: 'Select body font:', text: 'Choose a font from the dropdown for your body text' },
      { label: 'Preview the pairing:', text: 'See how the fonts look together in the preview section' },
      { label: 'Try different combinations:', text: 'Experiment with different font pairs to find the best match' },
      { label: 'Use in your designs:', text: 'Apply the font pairings to your content, websites, or graphics' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Real-time preview of font pairings',
      'Heading and body text examples showing the fonts together',
      'Wide selection of fonts to choose from',
      'Easy comparison of different font combinations',
      'Professional font pairings ready to use',
    ],
    title: 'Font Pairing Tool',
    headingFont: 'Heading Font',
    bodyFont: 'Body Font',
    apply: 'Apply',
    sampleHeading: 'Almost before we knew it, we had left the ground.',
    sampleBody:
      'By three methods we may learn wisdom: first, by reflection, which is noblest; second, by imitation, which is easiest; and third by experience, which is the bitterest.',
    tipLabel: 'Tip:',
    tipBody:
      'Try different combinations to find the perfect pairing. Headings typically work well with bold, attention-grabbing fonts, while body text benefits from readable, comfortable fonts.',
  },
  es: {
    toolName: 'Herramienta de combinación de fuentes',
    toolDescription:
      'Te ayuda a encontrar las combinaciones perfectas de fuentes para títulos y texto principal. Previsualiza distintas parejas de fuentes en tiempo real para crear diseños atractivos y legibles.',
    howToUse: [
      { label: 'Selecciona fuente de título:', text: 'Elige una fuente para tus títulos en el menú desplegable' },
      { label: 'Selecciona fuente de cuerpo:', text: 'Elige una fuente para el texto principal' },
      { label: 'Haz clic en "Aplicar":', text: 'Ve la vista previa de la combinación con texto de ejemplo' },
      { label: 'Experimenta:', text: 'Prueba distintas combinaciones para encontrar la pareja perfecta' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Te ayuda a encontrar las combinaciones perfectas de fuentes para títulos y texto principal. Previsualiza distintas parejas de fuentes en tiempo real para ver cómo se ven juntas antes de usarlas en tus diseños.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Selecciona fuente de título:', text: 'Elige una fuente del menú para tus títulos' },
      { label: 'Selecciona fuente de cuerpo:', text: 'Elige una fuente del menú para el texto principal' },
      { label: 'Previsualiza la combinación:', text: 'Ve cómo se ven las fuentes juntas en la sección de vista previa' },
      { label: 'Prueba distintas combinaciones:', text: 'Experimenta con distintas parejas de fuentes para encontrar la mejor' },
      { label: 'Úsala en tus diseños:', text: 'Aplica las combinaciones a tu contenido, sitios web o gráficos' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Vista previa en tiempo real de combinaciones de fuentes',
      'Ejemplos de título y cuerpo mostrando las fuentes juntas',
      'Amplia selección de fuentes para elegir',
      'Comparación fácil de distintas combinaciones',
      'Combinaciones profesionales listas para usar',
    ],
    title: 'Herramienta de combinación de fuentes',
    headingFont: 'Fuente de título',
    bodyFont: 'Fuente de cuerpo',
    apply: 'Aplicar',
    sampleHeading: 'Casi antes de que lo supiéramos, habíamos despegado.',
    sampleBody:
      'Por tres métodos podemos aprender sabiduría: primero, por la reflexión, que es la más noble; segundo, por la imitación, que es la más fácil; y tercero, por la experiencia, que es la más amarga.',
    tipLabel: 'Consejo:',
    tipBody:
      'Prueba distintas combinaciones para encontrar la pareja perfecta. Los títulos suelen funcionar bien con fuentes llamativas y en negrita, mientras que el texto principal se beneficia de fuentes legibles y cómodas.',
  },
}

function FontPairingToolContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [headingFont, setHeadingFont] = useState(fonts[0])
  const [bodyFont, setBodyFont] = useState(fonts[1])

  useEffect(() => {
    applyFonts()
  }, [headingFont, bodyFont])

  const applyFonts = () => {
    // Fonts are applied via inline styles in the JSX
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
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.headingFont}
            </label>
            <select
              id="h"
              value={headingFont}
              onChange={(e) => setHeadingFont(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {fonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.bodyFont}
            </label>
            <select
              id="b"
              value={bodyFont}
              onChange={(e) => setBodyFont(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {fonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={applyFonts}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {c.apply}
          </button>
        </div>

        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h1
            id="hd"
            className="text-4xl font-bold mb-4 text-gray-900 dark:text-white"
            style={{ fontFamily: headingFont }}
          >
            {c.sampleHeading}
          </h1>
          <p
            id="bd"
            className="text-lg leading-relaxed text-gray-700 dark:text-gray-300"
            style={{ fontFamily: bodyFont }}
          >
            {c.sampleBody}
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>{c.tipLabel}</strong> {c.tipBody}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FontPairingTool() {
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
      toolSlug="font-pairing-tool"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <FontPairingToolContent />
    </ToolAccessGate>
  )
}
