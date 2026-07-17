'use client'

import React, { useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    toolName: 'Content Gap Analyzer',
    toolDescription:
      "Identifies content topics your competitors cover that you don't. Helps discover content opportunities and gaps in your content strategy by comparing topic lists.",
    howToUse: [
      { label: 'Enter your topics:', text: 'List your content topics (one per line) in the first field' },
      { label: 'Enter competitor topics:', text: "List your competitor's content topics (one per line) in the second field" },
      { label: 'Click "Find Gaps"', text: "to identify topics your competitor covers that you don't" },
      { label: 'Review gaps:', text: 'See the list of content opportunities' },
      { label: 'Copy gaps:', text: 'Use "Copy Gaps" to copy the list for your content planning' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      "Identifies content topics that your competitor covers but you don't. Helps you discover content opportunities and gaps in your content strategy.",
    howToUseInner: 'How to Use',
    howToUseSteps: [
      {
        label: 'Enter your topics:',
        text: 'List your content topics, one per line (e.g., "social media tips", "content creation")',
      },
      { label: 'Enter competitor topics:', text: "List your competitor's content topics, one per line" },
      { label: 'Click "Find Gaps"', text: "to identify topics your competitor covers that you don't" },
      { label: 'Review gaps:', text: 'See list of content opportunities, copy all gaps to clipboard' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      "List of topics your competitor covers that you don't",
      'Count of content gaps found',
      'Copy button to export all gaps',
      'Clear all button to reset and start over',
      'Topic counter showing how many topics entered in each field',
    ],
    title: 'Content Gap Analyzer',
    yourTopicsLabel: 'Your topics (line-by-line)',
    yourTopicsPlaceholder:
      'Enter your content topics, one per line\nExample:\nsocial media tips\ncontent creation\nmarketing strategies',
    competitorTopicsLabel: 'Competitor topics (line-by-line)',
    competitorTopicsPlaceholder:
      "Enter competitor's content topics, one per line\nExample:\nsocial media tips\ncontent creation\nemail marketing\nSEO optimization",
    topicsEntered: (n: number) => `${n} topics entered`,
    findGaps: 'Find Gaps',
    clearAll: 'Clear All',
    alertBothFields: 'Please enter topics in both fields',
    alertCopied: 'Content gaps copied to clipboard!',
    gapsFoundTitle: 'Content Gaps Found',
    copyAll: 'Copy All',
    gapsSummary: (n: number) =>
      n === 1
        ? "1 topic your competitor covers that you don't:"
        : `${n} topics your competitor covers that you don't:`,
    tip: 'Tip:',
    tipBody:
      'These are content opportunities! Consider creating content on these topics to compete more effectively.',
    noGapsFound: "No gaps found. You're covering all the topics your competitor covers!",
    emptyHowToTitle: 'How to Use:',
    emptyHowToSteps: [
      'Enter your content topics (one per line) in the first field',
      "Enter your competitor's content topics (one per line) in the second field",
      'Click "Find Gaps" to identify topics your competitor covers that you don\'t',
      'Use the gaps as content opportunities for your strategy',
    ],
  },
  es: {
    toolName: 'Analizador de brechas de contenido',
    toolDescription:
      'Identifica temas de contenido que cubren tus competidores y tú no. Ayuda a descubrir oportunidades y brechas en tu estrategia de contenido comparando listas de temas.',
    howToUse: [
      { label: 'Ingresa tus temas:', text: 'Lista tus temas de contenido (uno por línea) en el primer campo' },
      { label: 'Ingresa temas del competidor:', text: 'Lista los temas del competidor (uno por línea) en el segundo campo' },
      { label: 'Haz clic en "Encontrar brechas"', text: 'para identificar temas que el competidor cubre y tú no' },
      { label: 'Revisa brechas:', text: 'Consulta la lista de oportunidades de contenido' },
      { label: 'Copia brechas:', text: 'Usa "Copiar todo" para copiar la lista y planificar contenido' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Identifica temas de contenido que cubre tu competidor y tú no. Te ayuda a descubrir oportunidades y brechas en tu estrategia de contenido.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      {
        label: 'Ingresa tus temas:',
        text: 'Lista tus temas de contenido, uno por línea (p. ej., "consejos de redes sociales", "creación de contenido")',
      },
      { label: 'Ingresa temas del competidor:', text: 'Lista los temas del competidor, uno por línea' },
      { label: 'Haz clic en "Encontrar brechas"', text: 'para identificar temas que el competidor cubre y tú no' },
      { label: 'Revisa brechas:', text: 'Consulta la lista de oportunidades y copia todas las brechas al portapapeles' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Lista de temas que cubre tu competidor y tú no',
      'Recuento de brechas de contenido encontradas',
      'Botón para copiar todas las brechas',
      'Botón para borrar todo y empezar de nuevo',
      'Contador de temas ingresados en cada campo',
    ],
    title: 'Analizador de brechas de contenido',
    yourTopicsLabel: 'Tus temas (línea por línea)',
    yourTopicsPlaceholder:
      'Ingresa tus temas de contenido, uno por línea\nEjemplo:\nconsejos de redes sociales\ncreación de contenido\nestrategias de marketing',
    competitorTopicsLabel: 'Temas del competidor (línea por línea)',
    competitorTopicsPlaceholder:
      'Ingresa los temas del competidor, uno por línea\nEjemplo:\nconsejos de redes sociales\ncreación de contenido\nemail marketing\noptimización SEO',
    topicsEntered: (n: number) => `${n} temas ingresados`,
    findGaps: 'Encontrar brechas',
    clearAll: 'Borrar todo',
    alertBothFields: 'Ingresa temas en ambos campos',
    alertCopied: '¡Brechas de contenido copiadas al portapapeles!',
    gapsFoundTitle: 'Brechas de contenido encontradas',
    copyAll: 'Copiar todo',
    gapsSummary: (n: number) =>
      n === 1
        ? '1 tema que cubre tu competidor y tú no:'
        : `${n} temas que cubre tu competidor y tú no:`,
    tip: 'Consejo:',
    tipBody:
      '¡Estas son oportunidades de contenido! Considera crear contenido sobre estos temas para competir de forma más efectiva.',
    noGapsFound: 'No se encontraron brechas. ¡Cubres todos los temas que cubre tu competidor!',
    emptyHowToTitle: 'Cómo usar:',
    emptyHowToSteps: [
      'Ingresa tus temas de contenido (uno por línea) en el primer campo',
      'Ingresa los temas del competidor (uno por línea) en el segundo campo',
      'Haz clic en "Encontrar brechas" para identificar temas que el competidor cubre y tú no',
      'Usa las brechas como oportunidades de contenido para tu estrategia',
    ],
  },
}

type Copy = (typeof copy)[keyof typeof copy]

function ContentGapAnalyzerContent({ c }: { c: Copy }) {
  const [yourTopics, setYourTopics] = useState('')
  const [competitorTopics, setCompetitorTopics] = useState('')
  const [gaps, setGaps] = useState<string[]>([])

  const findGaps = () => {
    const yourTopicsList = yourTopics
      .toLowerCase()
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean)
    const competitorTopicsList = competitorTopics
      .toLowerCase()
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean)

    if (yourTopicsList.length === 0 || competitorTopicsList.length === 0) {
      alert(c.alertBothFields)
      return
    }

    const yourSet = new Set(yourTopicsList)
    const competitorSet = new Set(competitorTopicsList)
    const gapsList = [...competitorSet].filter((x) => !yourSet.has(x))
    setGaps(gapsList)
  }

  const clearAll = () => {
    setYourTopics('')
    setCompetitorTopics('')
    setGaps([])
  }

  const copyGaps = () => {
    if (gaps.length > 0) {
      navigator.clipboard.writeText(gaps.join('\n'))
      alert(c.alertCopied)
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
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.yourTopicsLabel}
            </label>
            <textarea
              id="mine"
              value={yourTopics}
              onChange={(e) => setYourTopics(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
              rows={6}
              placeholder={c.yourTopicsPlaceholder}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {c.topicsEntered(yourTopics.split('\n').filter((x) => x.trim()).length)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.competitorTopicsLabel}
            </label>
            <textarea
              id="comp"
              value={competitorTopics}
              onChange={(e) => setCompetitorTopics(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
              rows={6}
              placeholder={c.competitorTopicsPlaceholder}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {c.topicsEntered(competitorTopics.split('\n').filter((x) => x.trim()).length)}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={findGaps}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              {c.findGaps}
            </button>
            <button
              onClick={clearAll}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
            >
              {c.clearAll}
            </button>
          </div>
        </div>

        {gaps.length > 0 && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{c.gapsFoundTitle}</h2>
              <button
                onClick={copyGaps}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
              >
                {c.copyAll}
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{c.gapsSummary(gaps.length)}</p>
            <ul className="space-y-2">
              {gaps.map((gap, index) => (
                <li
                  key={index}
                  className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                >
                  <span className="font-medium">{gap}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>{c.tip}</strong> {c.tipBody}
              </p>
            </div>
          </div>
        )}

        {gaps.length === 0 && (yourTopics || competitorTopics) && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">{c.noGapsFound}</p>
          </div>
        )}

        {!yourTopics && !competitorTopics && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">{c.emptyHowToTitle}</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {c.emptyHowToSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ContentGapAnalyzer() {
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
      toolSlug="content-gap-analyzer"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <ContentGapAnalyzerContent c={c} />
    </ToolAccessGate>
  )
}
