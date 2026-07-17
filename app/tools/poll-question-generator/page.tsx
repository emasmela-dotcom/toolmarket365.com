'use client'

import React, { useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    toolName: 'Poll Question Generator',
    toolDescription:
      'Generates engaging poll questions for social media stories and posts. Creates topic-specific or general poll questions to boost engagement and interaction with your audience.',
    howToUse: [
      { label: 'Enter topic (optional):', text: 'Type a topic like "coffee", "fitness", or "food" for topic-specific questions' },
      { label: 'Leave blank for general:', text: 'Leave topic empty for general engagement questions' },
      { label: 'Click "Generate":', text: 'Get a list of poll questions perfect for stories and posts' },
      { label: 'Copy and use:', text: 'Copy the questions and use them in your social media polls' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Generates poll questions and engagement questions for social media. Provides topic-specific questions for coffee, fitness, food, or general topics to boost engagement on your posts.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter topic:', text: 'Type a topic like "coffee", "fitness", "food", or leave blank for general questions' },
      { label: 'Click "Generate"', text: 'to get a list of questions' },
      { label: 'Review questions:', text: 'See generated poll questions for your topic' },
      { label: 'Copy questions:', text: 'Click on any question to copy it to clipboard' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'List of poll questions tailored to your topic',
      'Questions optimized for engagement',
      'One-click copy functionality for each question',
      'Topic-specific questions (coffee, fitness, food) or general questions',
    ],
    title: 'Poll / Question Generator',
    topic: 'Topic',
    topicPlaceholder: 'Coffee, Fitness, Food, or leave blank for general',
    topicHint: 'Try: coffee, fitness, food, or leave blank for general questions',
    generate: 'Generate',
    generatedQuestions: 'Generated Questions',
    copy: 'Copy',
    howItWorks: 'How it works:',
    howItWorksBody:
      'Enter a topic (coffee, fitness, food) or leave blank for general questions. Click Generate to get engagement questions perfect for polls and stories.',
    copiedAlert: 'Question copied to clipboard!',
    pools: {
      coffee: [
        'How do you drink your coffee?',
        "What's your go-to milk?",
        'Espresso or filter?',
        'Hot or iced?',
        'Favorite coffee shop?',
      ],
      general: [
        "What's your favourite season?",
        'iOS or Android?',
        'Book or movie?',
        'Morning person or night owl?',
        'Beach or mountains?',
      ],
      fitness: [
        'Gym or home workout?',
        'Cardio or weights?',
        'Favorite workout time?',
        'Pre-workout or post-workout meal?',
      ],
      food: [
        'Sweet or savory?',
        'Favorite cuisine?',
        'Cooking or ordering in?',
        'Coffee or tea?',
      ],
    },
  },
  es: {
    toolName: 'Generador de preguntas para encuestas',
    toolDescription:
      'Genera preguntas atractivas para encuestas en historias y publicaciones. Crea preguntas por tema o generales para aumentar la interacción con tu audiencia.',
    howToUse: [
      { label: 'Ingresa un tema (opcional):', text: 'Escribe un tema como "coffee", "fitness" o "food" para preguntas específicas' },
      { label: 'Déjalo en blanco para general:', text: 'Sin tema obtienes preguntas generales de engagement' },
      { label: 'Haz clic en "Generar":', text: 'Obtén una lista de preguntas ideales para historias y publicaciones' },
      { label: 'Copia y usa:', text: 'Copia las preguntas y úsalas en tus encuestas' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Genera preguntas para encuestas y engagement en redes. Ofrece preguntas por tema (café, fitness, comida) o generales para impulsar la interacción.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Ingresa el tema:', text: 'Escribe "coffee", "fitness", "food", o déjalo en blanco para preguntas generales' },
      { label: 'Haz clic en "Generar"', text: 'para obtener una lista de preguntas' },
      { label: 'Revisa las preguntas:', text: 'Mira las preguntas generadas para tu tema' },
      { label: 'Copia las preguntas:', text: 'Haz clic en cualquier pregunta para copiarla' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Lista de preguntas de encuesta según tu tema',
      'Preguntas pensadas para el engagement',
      'Copia con un clic para cada pregunta',
      'Preguntas por tema (coffee, fitness, food) o generales',
    ],
    title: 'Generador de encuestas / preguntas',
    topic: 'Tema',
    topicPlaceholder: 'Coffee, Fitness, Food, o déjalo en blanco para general',
    topicHint: 'Prueba: coffee, fitness, food, o déjalo en blanco para preguntas generales',
    generate: 'Generar',
    generatedQuestions: 'Preguntas generadas',
    copy: 'Copiar',
    howItWorks: 'Cómo funciona:',
    howItWorksBody:
      'Ingresa un tema (coffee, fitness, food) o déjalo en blanco para preguntas generales. Haz clic en Generar para obtener preguntas ideales para encuestas e historias.',
    copiedAlert: '¡Pregunta copiada al portapapeles!',
    pools: {
      coffee: [
        '¿Cómo tomas el café?',
        '¿Cuál es tu leche favorita?',
        '¿Espresso o filtro?',
        '¿Caliente o con hielo?',
        '¿Tu cafetería favorita?',
      ],
      general: [
        '¿Cuál es tu estación favorita?',
        '¿iOS o Android?',
        '¿Libro o película?',
        '¿Madrugador o noctámbulo?',
        '¿Playa o montaña?',
      ],
      fitness: [
        '¿Gimnasio o entrenar en casa?',
        '¿Cardio o pesas?',
        '¿Tu hora favorita para entrenar?',
        '¿Comida antes o después del entrenamiento?',
      ],
      food: [
        '¿Dulce o salado?',
        '¿Tu cocina favorita?',
        '¿Cocinar o pedir a domicilio?',
        '¿Café o té?',
      ],
    },
  },
}

function PollQuestionGeneratorContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [topic, setTopic] = useState('')
  const [questions, setQuestions] = useState<string[]>([])

  const generate = () => {
    const topicLower = topic.trim().toLowerCase()
    const arr = c.pools[topicLower as keyof typeof c.pools] || c.pools.general
    setQuestions(arr)
  }

  const copyQuestion = (question: string) => {
    navigator.clipboard.writeText(question)
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

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          {c.title}
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.topic}
            </label>
            <input
              id="t"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={c.topicPlaceholder}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              onKeyPress={(e) => {
                if (e.key === 'Enter') generate()
              }}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {c.topicHint}
            </p>
          </div>

          <button
            onClick={generate}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {c.generate}
          </button>
        </div>

        {questions.length > 0 && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {c.generatedQuestions}
            </h2>
            <ul className="space-y-3">
              {questions.map((question, index) => (
                <li
                  key={index}
                  className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex justify-between items-center"
                >
                  <span className="text-gray-900 dark:text-white">{question}</span>
                  <button
                    onClick={() => copyQuestion(question)}
                    className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                  >
                    {c.copy}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {questions.length === 0 && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              {c.howItWorks}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {c.howItWorksBody}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PollQuestionGenerator() {
  const { language } = useLanguage()
  const c = copy[language]
  const howToUse = (
    <div>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        {c.howToUse.map((step, i) => (
          <li key={i}><strong>{step.label}</strong> {step.text}</li>
        ))}
      </ol>
    </div>
  )

  return (
    <ToolAccessGate
      toolSlug="poll-question-generator"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <PollQuestionGeneratorContent />
    </ToolAccessGate>
  )
}
