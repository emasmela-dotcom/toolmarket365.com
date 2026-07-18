'use client'

import { useState } from 'react'
import { Check, ArrowRight, Play, BookOpen, Zap, Target } from 'lucide-react';
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Tutorial {
  id: string
  title: string
  description: string
  duration: string
  steps: Array<{ title: string; content: string; toolLink?: string }>
  category: string
}

const copy = {
  en: {
    pageTitle: 'ToolMarket365 Tutorials',
    pageDescription:
      'Learn how to use ToolMarket365 to create amazing content. All tutorials are interactive and guide you step-by-step.',
    stepOf: 'Step',
    of: 'of',
    completeLabel: 'Complete',
    tryThisTool: 'Try This Tool',
    previous: 'Previous',
    next: 'Next',
    complete: 'Complete',
    start: 'Start',
    quickLinks: 'Quick Links',
    browseAllTools: 'Browse All Tools',
    viewPricing: 'View Pricing',
    comparePlans: 'Compare Plans',
    categories: {
      Basics: 'Basics',
      Workflow: 'Workflow',
      Automation: 'Automation',
      Analytics: 'Analytics',
      AI: 'AI',
      Billing: 'Billing',
    },
    tutorials: [
      {
        id: 'getting-started',
        title: 'Getting Started with ToolMarket365',
        description: 'Learn the basics of using ToolMarket365 to create and manage your content',
        duration: '5 min',
        category: 'Basics',
        steps: [
          {
            title: 'Welcome to ToolMarket365',
            content:
              'ToolMarket365 is your all-in-one platform for content creation. You have access to 53+ tools to help you create, optimize, and schedule content.',
          },
          {
            title: 'Explore Tools',
            content:
              'Browse the Tools page to see all available tools. Each tool is designed for specific content creation tasks.',
            toolLink: '/home',
          },
          {
            title: 'Create Your First Content',
            content:
              "Start with the AI Caption Generator to create your first social media caption. It's quick and easy!",
            toolLink: '/tools/ai-caption-generator',
          },
          {
            title: 'Save to Content Library',
            content:
              'All content you create can be saved to your Content Library for easy access later.',
            toolLink: '/tools/content-library',
          },
        ],
      },
      {
        id: 'content-creation',
        title: 'Content Creation Workflow',
        description: 'Master the complete content creation process from idea to posting',
        duration: '10 min',
        category: 'Workflow',
        steps: [
          {
            title: 'Generate Content Ideas',
            content:
              'Use the Content Idea Generator to brainstorm new content topics based on your niche.',
            toolLink: '/tools/content-idea-generator',
          },
          {
            title: 'Create Captions',
            content:
              'Use the AI Caption Generator to create engaging captions for your content.',
            toolLink: '/tools/ai-caption-generator',
          },
          {
            title: 'Research Hashtags',
            content: 'Find the best hashtags for your content using Hashtag Research tool.',
            toolLink: '/tools/hashtag-research',
          },
          {
            title: 'Predict Viral Potential',
            content:
              'Use Viral Content Predictor to see how your content might perform before posting.',
            toolLink: '/tools/viral-content-predictor',
          },
          {
            title: 'Schedule Your Post',
            content: 'Schedule your content at optimal times using the Post Scheduler.',
            toolLink: '/tools/post-scheduler',
          },
        ],
      },
      {
        id: 'workflow-automation',
        title: 'Automate Your Workflow',
        description: 'Learn how to create automated workflows to save time',
        duration: '8 min',
        category: 'Automation',
        steps: [
          {
            title: 'What is Workflow Automation?',
            content:
              'Workflow Automation lets you chain multiple tools together so one click executes your entire content creation process.',
          },
          {
            title: 'Create Your First Workflow',
            content:
              'Go to Workflow Automation and create a workflow that chains: Content Idea → Caption → Hashtags → Schedule.',
            toolLink: '/tools/workflow-automation',
          },
          {
            title: 'Execute Workflows',
            content:
              'Once created, you can execute entire workflows with one click, saving hours of manual work.',
          },
        ],
      },
      {
        id: 'analytics',
        title: 'Understanding Analytics',
        description: 'Learn how to track and improve your content performance',
        duration: '7 min',
        category: 'Analytics',
        steps: [
          {
            title: 'View Your Analytics',
            content:
              'Check the Analytics Dashboard to see your page views, unique visitors, and top performing content.',
            toolLink: '/tools/analytics-dashboard',
          },
          {
            title: 'Performance Benchmarks',
            content:
              "Compare your performance to industry averages. See if you're in the top 10%, 25%, or need improvement.",
          },
          {
            title: 'Improve Your Content',
            content:
              'Use analytics insights to identify what content performs best and create more of it.',
          },
        ],
      },
      {
        id: 'personalization',
        title: 'AI Personalization',
        description: 'Learn how AI personalization helps you create better content',
        duration: '6 min',
        category: 'AI',
        steps: [
          {
            title: 'What is AI Personalization?',
            content:
              'The system learns from your usage patterns to suggest the best tone, platform, and posting times for you.',
          },
          {
            title: 'View Your Insights',
            content:
              'Check Personalization Insights to see recommendations based on your usage.',
            toolLink: '/tools/personalization-insights',
          },
          {
            title: 'Use Recommendations',
            content: 'Apply AI recommendations to your content creation for better results.',
          },
        ],
      },
      {
        id: 'pricing',
        title: 'Understanding Pricing & Credits',
        description: 'Learn about plans, credits, and how to get the most value',
        duration: '5 min',
        category: 'Billing',
        steps: [
          {
            title: 'Choose Your Plan',
            content:
              'Select a plan that matches your creator level. Starter for beginners, Professional for serious creators.',
            toolLink: '/pricing',
          },
          {
            title: 'Free Credits',
            content:
              'All plans include 25 free credits during your first month to try premium tools. After that, purchase credits to continue accessing premium tools beyond your plan.',
          },
          {
            title: 'Buy More Credits',
            content:
              'Purchase additional credits ($10 per 100) if you need more. Purchased credits roll over month to month.',
            toolLink: '/pricing',
          },
          {
            title: 'Tool Costs',
            content:
              'Premium tools cost 5-15 credits per use. Check each tool page to see the cost per use.',
          },
        ],
      },
    ] as Tutorial[],
  },
  es: {
    pageTitle: 'Tutoriales de ToolMarket365',
    pageDescription:
      'Aprende a usar ToolMarket365 para crear contenido increíble. Todos los tutoriales son interactivos y te guían paso a paso.',
    stepOf: 'Paso',
    of: 'de',
    completeLabel: 'Completado',
    tryThisTool: 'Probar esta herramienta',
    previous: 'Anterior',
    next: 'Siguiente',
    complete: 'Completar',
    start: 'Comenzar',
    quickLinks: 'Enlaces rápidos',
    browseAllTools: 'Ver todas las herramientas',
    viewPricing: 'Ver precios',
    comparePlans: 'Comparar planes',
    categories: {
      Basics: 'Fundamentos',
      Workflow: 'Flujo de trabajo',
      Automation: 'Automatización',
      Analytics: 'Analítica',
      AI: 'IA',
      Billing: 'Facturación',
    },
    tutorials: [
      {
        id: 'getting-started',
        title: 'Primeros pasos con ToolMarket365',
        description:
          'Aprende lo básico de usar ToolMarket365 para crear y gestionar tu contenido',
        duration: '5 min',
        category: 'Basics',
        steps: [
          {
            title: 'Bienvenido a ToolMarket365',
            content:
              'ToolMarket365 es tu plataforma todo en uno para la creación de contenido. Tienes acceso a más de 53 herramientas para crear, optimizar y programar contenido.',
          },
          {
            title: 'Explorar herramientas',
            content:
              'Explora la página de Herramientas para ver todas las herramientas disponibles. Cada herramienta está diseñada para tareas específicas de creación de contenido.',
            toolLink: '/home',
          },
          {
            title: 'Crea tu primer contenido',
            content:
              'Comienza con el Generador de subtítulos con IA para crear tu primera leyenda en redes sociales. ¡Es rápido y fácil!',
            toolLink: '/tools/ai-caption-generator',
          },
          {
            title: 'Guardar en la biblioteca de contenido',
            content:
              'Todo el contenido que crees puede guardarse en tu Biblioteca de contenido para acceder fácilmente más tarde.',
            toolLink: '/tools/content-library',
          },
        ],
      },
      {
        id: 'content-creation',
        title: 'Flujo de trabajo de creación de contenido',
        description: 'Domina el proceso completo de creación de contenido, de la idea a la publicación',
        duration: '10 min',
        category: 'Workflow',
        steps: [
          {
            title: 'Generar ideas de contenido',
            content:
              'Usa el Generador de ideas de contenido para idear nuevos temas según tu nicho.',
            toolLink: '/tools/content-idea-generator',
          },
          {
            title: 'Crear subtítulos',
            content:
              'Usa el Generador de subtítulos con IA para crear leyendas atractivas para tu contenido.',
            toolLink: '/tools/ai-caption-generator',
          },
          {
            title: 'Investigar hashtags',
            content:
              'Encuentra los mejores hashtags para tu contenido con la herramienta de Investigación de hashtags.',
            toolLink: '/tools/hashtag-research',
          },
          {
            title: 'Predecir potencial viral',
            content:
              'Usa el Predictor de contenido viral para ver cómo podría rendir tu contenido antes de publicarlo.',
            toolLink: '/tools/viral-content-predictor',
          },
          {
            title: 'Programar tu publicación',
            content:
              'Programa tu contenido en los mejores horarios con el Programador de publicaciones.',
            toolLink: '/tools/post-scheduler',
          },
        ],
      },
      {
        id: 'workflow-automation',
        title: 'Automatiza tu flujo de trabajo',
        description: 'Aprende a crear flujos de trabajo automatizados para ahorrar tiempo',
        duration: '8 min',
        category: 'Automation',
        steps: [
          {
            title: '¿Qué es la automatización de flujos de trabajo?',
            content:
              'La automatización de flujos de trabajo te permite encadenar varias herramientas para que un solo clic ejecute todo tu proceso de creación de contenido.',
          },
          {
            title: 'Crea tu primer flujo de trabajo',
            content:
              'Ve a Automatización de flujos de trabajo y crea un flujo que encadene: Idea de contenido → Subtítulo → Hashtags → Programación.',
            toolLink: '/tools/workflow-automation',
          },
          {
            title: 'Ejecutar flujos de trabajo',
            content:
              'Una vez creados, puedes ejecutar flujos de trabajo completos con un solo clic, ahorrando horas de trabajo manual.',
          },
        ],
      },
      {
        id: 'analytics',
        title: 'Entender la analítica',
        description: 'Aprende a seguir y mejorar el rendimiento de tu contenido',
        duration: '7 min',
        category: 'Analytics',
        steps: [
          {
            title: 'Ver tu analítica',
            content:
              'Consulta el Panel de analítica para ver visitas a la página, visitantes únicos y el contenido con mejor rendimiento.',
            toolLink: '/tools/analytics-dashboard',
          },
          {
            title: 'Referencias de rendimiento',
            content:
              'Compara tu rendimiento con los promedios del sector. Mira si estás en el 10 %, 25 % superior o si necesitas mejorar.',
          },
          {
            title: 'Mejorar tu contenido',
            content:
              'Usa los datos analíticos para identificar qué contenido rinde mejor y crea más de ese tipo.',
          },
        ],
      },
      {
        id: 'personalization',
        title: 'Personalización con IA',
        description: 'Aprende cómo la personalización con IA te ayuda a crear mejor contenido',
        duration: '6 min',
        category: 'AI',
        steps: [
          {
            title: '¿Qué es la personalización con IA?',
            content:
              'El sistema aprende de tus patrones de uso para sugerirte el mejor tono, plataforma y horarios de publicación.',
          },
          {
            title: 'Ver tus insights',
            content:
              'Consulta Insights de personalización para ver recomendaciones basadas en tu uso.',
            toolLink: '/tools/personalization-insights',
          },
          {
            title: 'Usar recomendaciones',
            content:
              'Aplica las recomendaciones de IA a tu creación de contenido para obtener mejores resultados.',
          },
        ],
      },
      {
        id: 'pricing',
        title: 'Entender precios y créditos',
        description: 'Aprende sobre planes, créditos y cómo obtener el máximo valor',
        duration: '5 min',
        category: 'Billing',
        steps: [
          {
            title: 'Elige tu plan',
            content:
              'Selecciona un plan acorde a tu nivel como creador. Starter para principiantes, Professional para creadores serios.',
            toolLink: '/pricing',
          },
          {
            title: 'Créditos gratis',
            content:
              'Todos los planes incluyen 25 créditos gratis durante tu primer mes para probar herramientas premium. Después, compra créditos para seguir accediendo a herramientas premium más allá de tu plan.',
          },
          {
            title: 'Comprar más créditos',
            content:
              'Compra créditos adicionales ($10 por 100) si necesitas más. Los créditos comprados se acumulan mes a mes.',
            toolLink: '/pricing',
          },
          {
            title: 'Costos de herramientas',
            content:
              'Las herramientas premium cuestan entre 5 y 15 créditos por uso. Consulta cada página de herramienta para ver el costo por uso.',
          },
        ],
      },
    ] as Tutorial[],
  },
}

function OnboardingPage() {
  const { language } = useLanguage()
  const c = copy[language]
  const tutorials = c.tutorials

  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedTutorials, setCompletedTutorials] = useState<Set<string>>(new Set())

  const startTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (selectedTutorial && currentStep < selectedTutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else if (selectedTutorial) {
      // Tutorial complete
      setCompletedTutorials(new Set([...completedTutorials, selectedTutorial.id]))
      setSelectedTutorial(null)
      setCurrentStep(0)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const categories = Array.from(new Set(tutorials.map(t => t.category)))

  if (selectedTutorial) {
    const step = selectedTutorial.steps[currentStep]
    const progress = ((currentStep + 1) / selectedTutorial.steps.length) * 100

    return (
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-mono-600 dark:text-mono-400 mb-2">
              <span>{c.stepOf} {currentStep + 1} {c.of} {selectedTutorial.steps.length}</span>
              <span>{Math.round(progress)}% {c.completeLabel}</span>
            </div>
            <div className="w-full bg-mono-200 dark:bg-mono-800 rounded-full h-2">
              <div 
                className="bg-accent-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Tutorial Content */}
          <div className="bg-white dark:bg-mono-900 rounded-lg p-8 border border-mono-200 dark:border-mono-700 mb-6">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-2">{selectedTutorial.title}</h2>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-3">{step.title}</h3>
              <p className="text-mono-700 dark:text-mono-300 leading-relaxed">{step.content}</p>
            </div>

            {step.toolLink && (
              <Link
                href={step.toolLink}
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700"
              >
                <Play className="h-4 w-4" />
                {c.tryThisTool}
              </Link>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-2 bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 rounded-lg hover:bg-mono-200 dark:hover:bg-mono-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {c.previous}
            </button>
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 flex items-center gap-2"
            >
              {currentStep === selectedTutorial.steps.length - 1 ? c.complete : c.next}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.pageTitle}</h1>
          <p className="text-mono-600 dark:text-mono-400">
            {c.pageDescription}
          </p>
        </div>

        {/* Tutorial Categories */}
        {categories.map(category => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.categories[category as keyof typeof c.categories]}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tutorials
                .filter(t => t.category === category)
                .map(tutorial => (
                  <div
                    key={tutorial.id}
                    className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700 hover:border-accent-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-mono-950 dark:text-mono-50 mb-2">{tutorial.title}</h3>
                        <p className="text-sm text-mono-600 dark:text-mono-400 mb-3">{tutorial.description}</p>
                      </div>
                      {completedTutorials.has(tutorial.id) && (
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-mono-500 dark:text-mono-500">{tutorial.duration}</span>
                      <button
                        onClick={() => startTutorial(tutorial)}
                        className="px-4 py-2 bg-accent-600 text-white rounded hover:bg-accent-700 text-sm flex items-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        {c.start}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* Quick Links */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-8">
          <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-3">{c.quickLinks}</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/home" className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200">
              <BookOpen className="h-4 w-4" />
              {c.browseAllTools}
            </Link>
            <Link href="/pricing" className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200">
              <Target className="h-4 w-4" />
              {c.viewPricing}
            </Link>
            <Link href="/compare" className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200">
              <Zap className="h-4 w-4" />
              {c.comparePlans}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage
