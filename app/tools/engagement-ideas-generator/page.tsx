'use client'

import React, { useState } from 'react'
import { Lightbulb, RefreshCw, Copy, Check } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    title: 'Engagement Ideas Generator',
    subtitle: 'Generate platform-specific engagement ideas to boost interaction and grow your audience.',
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Generates platform-specific content ideas designed to boost engagement, comments, shares, and saves. Each idea is tailored to what works best on that platform.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Select your platform:', text: 'Choose Instagram, TikTok, YouTube, etc.' },
      { label: 'View generated ideas:', text: 'See 5 engagement ideas automatically generated' },
      { label: 'Generate more:', text: 'Click "Generate New Ideas" for different suggestions' },
      { label: 'Copy ideas:', text: 'Click the copy button next to any idea you like' },
      { label: 'Use them:', text: 'Implement these ideas in your content strategy' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Fresh engagement ideas tailored to your platform',
      'Content concepts proven to boost interaction',
      "Inspiration when you're stuck on what to post",
      'Platform-specific strategies that work',
    ],
    selectPlatform: 'Select Platform',
    generateNew: 'Generate New Ideas',
    ideasFor: (platform: string) => `Engagement Ideas for ${platform}`,
    copyIdea: 'Copy idea',
    platformNames: {
      instagram: 'Instagram',
      tiktok: 'TikTok',
      youtube: 'YouTube',
      twitter: 'Twitter / X',
      linkedin: 'LinkedIn',
      facebook: 'Facebook',
    },
    ideas: {
      instagram: [
        'Post a "This or That" story poll',
        'Ask followers to share their favorite tip in comments',
        'Create a carousel with "Save this post" call-to-action',
        'Share a behind-the-scenes Reel',
        'Host a Q&A in Stories',
        'Run a "Caption this photo" contest',
        'Share user-generated content and tag creators',
        'Post a "Rate this 1-10" interactive sticker',
        'Create a "Tell me your..." question sticker',
        'Share a "Day in my life" Reel',
        'Post a "What should I post next?" poll',
        'Share a tutorial with "Save for later" reminder',
        'Create a "Before & After" comparison post',
        'Ask followers to share their biggest challenge',
        'Post a "Fill in the blank" story',
      ],
      tiktok: [
        'Create a "POV: You..." video',
        'Make a "Tell me without telling me" video',
        'Share a "Day in my life" vlog',
        'Create a "Get ready with me" video',
        'Make a "This vs That" comparison',
        'Share a "Storytime" video',
        'Create a "Try not to laugh" challenge',
        'Make a "Things that just make sense" video',
        'Share a "Tips that changed my life" video',
        'Create a "Rate my..." video',
        'Make a "Tell me your unpopular opinion" video',
        'Share a "Things I wish I knew" video',
        "Create a \"POV: You're...\" character video",
        'Make a "This is why..." educational video',
        'Share a "Day in my life" with transitions',
      ],
      youtube: [
        'Create a "10 Things I Wish I Knew" video',
        'Share a "Day in my life" vlog',
        'Make a "Reacting to..." video',
        'Create a "How I..." tutorial',
        'Share a "Storytime" video',
        'Make a "Testing..." experiment video',
        'Create a "Q&A" video',
        'Share a "Behind the scenes" video',
        'Make a "Things that changed my life" video',
        'Create a "Ranking..." video',
        'Share a "Get ready with me" video',
        'Make a "This vs That" comparison',
        'Create a "Tips for..." educational video',
        'Share a "My honest thoughts on..." video',
        'Make a "Trying..." challenge video',
      ],
      twitter: [
        'Post a "What\'s your unpopular opinion?" thread',
        'Share a "Things I wish I knew" thread',
        'Create a "Tell me without telling me" tweet',
        'Post a "Hot take:" controversial opinion',
        'Share a "This is why..." educational thread',
        "Create a \"POV: You're...\" relatable tweet",
        'Post a "Rate my..." poll',
        'Share a "Storytime" thread',
        'Create a "Things that just make sense" tweet',
        'Post a "What\'s your..." question',
        'Share a "Tips that changed my life" thread',
        'Create a "This vs That" comparison thread',
        'Post a "Tell me your..." question',
        'Share a "Things I learned..." thread',
        'Create a "POV:" character tweet',
      ],
      linkedin: [
        'Share a "Lessons learned" post',
        'Post a "What I wish I knew" article',
        'Create a "This is why..." educational post',
        'Share a "Behind the scenes" story',
        'Post a "Tips for..." professional advice',
        'Create a "Things that changed my career" post',
        'Share a "My honest thoughts on..." post',
        'Post a "What\'s your take?" question',
        'Create a "This vs That" comparison',
        'Share a "Storytime" professional experience',
        'Post a "Lessons from..." reflection',
        'Create a "Tips that helped me" post',
        'Share a "Things I learned" post',
        'Post a "What\'s your biggest challenge?" question',
        'Create a "This is how I..." tutorial post',
      ],
      facebook: [
        'Post a "What\'s your favorite..." question',
        'Share a "This is why..." educational post',
        'Create a "Tell me your..." discussion post',
        'Post a "Rate this 1-10" poll',
        'Share a "Things I learned" post',
        'Create a "Before & After" comparison',
        'Post a "What\'s your take?" question',
        'Share a "Tips that helped me" post',
        'Create a "This vs That" comparison',
        'Post a "Storytime" post',
        'Share a "Things that changed my life" post',
        'Create a "Tell me without telling me" post',
        'Post a "What\'s your biggest challenge?" question',
        'Share a "Lessons learned" post',
        "Create a \"POV: You're...\" relatable post",
      ],
    },
  },
  es: {
    title: 'Generador de ideas de engagement',
    subtitle: 'Genera ideas de engagement por plataforma para impulsar la interacción y hacer crecer tu audiencia.',
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Genera ideas de contenido específicas por plataforma para aumentar comentarios, compartidos y guardados. Cada idea está pensada para lo que mejor funciona en esa red.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Elige tu plataforma:', text: 'Instagram, TikTok, YouTube, etc.' },
      { label: 'Revisa las ideas:', text: 'Verás 5 ideas de engagement generadas automáticamente' },
      { label: 'Genera más:', text: 'Haz clic en "Generar nuevas ideas" para otras sugerencias' },
      { label: 'Copia ideas:', text: 'Haz clic en el botón de copiar junto a la idea que te guste' },
      { label: 'Úsalas:', text: 'Aplícalas en tu estrategia de contenido' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Ideas frescas de engagement según tu plataforma',
      'Conceptos de contenido que impulsan la interacción',
      'Inspiración cuando no sabes qué publicar',
      'Estrategias específicas por plataforma que funcionan',
    ],
    selectPlatform: 'Seleccionar plataforma',
    generateNew: 'Generar nuevas ideas',
    ideasFor: (platform: string) => `Ideas de engagement para ${platform}`,
    copyIdea: 'Copiar idea',
    platformNames: {
      instagram: 'Instagram',
      tiktok: 'TikTok',
      youtube: 'YouTube',
      twitter: 'Twitter / X',
      linkedin: 'LinkedIn',
      facebook: 'Facebook',
    },
    ideas: {
      instagram: [
        'Publica una encuesta "Esto o aquello" en Stories',
        'Pide a tus seguidores que compartan su tip favorito en comentarios',
        'Crea un carrusel con llamado a "Guarda esta publicación"',
        'Comparte un Reel detrás de cámaras',
        'Haz un Q&A en Stories',
        'Organiza un concurso "Ponle título a esta foto"',
        'Comparte contenido de usuarios y etiqueta a los creadores',
        'Publica un sticker interactivo "Califica del 1 al 10"',
        'Crea un sticker de pregunta "Cuéntame tu..."',
        'Comparte un Reel "Un día en mi vida"',
        'Publica una encuesta "¿Qué debería publicar después?"',
        'Comparte un tutorial con recordatorio "Guarda para después"',
        'Crea una publicación "Antes y después"',
        'Pide a tus seguidores que compartan su mayor reto',
        'Publica una historia "Completa la frase"',
      ],
      tiktok: [
        'Crea un video "POV: Tú..."',
        'Haz un video "Dímelo sin decirlo"',
        'Comparte un vlog "Un día en mi vida"',
        'Crea un video "Prepárate conmigo"',
        'Haz una comparación "Esto vs aquello"',
        'Comparte un video "Storytime"',
        'Crea un reto "Intenta no reír"',
        'Haz un video "Cosas que simplemente tienen sentido"',
        'Comparte "Tips que me cambiaron la vida"',
        'Crea un video "Califica mi..."',
        'Haz un video "Dime tu opinión impopular"',
        'Comparte "Cosas que ojalá hubiera sabido"',
        'Crea un video de personaje "POV: Eres..."',
        'Haz un video educativo "Por esto..."',
        'Comparte "Un día en mi vida" con transiciones',
      ],
      youtube: [
        'Crea un video "10 cosas que ojalá hubiera sabido"',
        'Comparte un vlog "Un día en mi vida"',
        'Haz un video "Reaccionando a..."',
        'Crea un tutorial "Cómo yo..."',
        'Comparte un video "Storytime"',
        'Haz un video de experimento "Probando..."',
        'Crea un video de "Q&A"',
        'Comparte un video "Detrás de cámaras"',
        'Haz un video "Cosas que me cambiaron la vida"',
        'Crea un video de "Ranking..."',
        'Comparte un "Prepárate conmigo"',
        'Haz una comparación "Esto vs aquello"',
        'Crea un video educativo "Tips para..."',
        'Comparte "Mi opinión sincera sobre..."',
        'Haz un video de reto "Probando..."',
      ],
      twitter: [
        'Publica un hilo "¿Cuál es tu opinión impopular?"',
        'Comparte un hilo "Cosas que ojalá hubiera sabido"',
        'Crea un tweet "Dímelo sin decirlo"',
        'Publica un "Hot take:" con opinión polémica',
        'Comparte un hilo educativo "Por esto..."',
        'Crea un tweet relatables "POV: Eres..."',
        'Publica una encuesta "Califica mi..."',
        'Comparte un hilo "Storytime"',
        'Crea un tweet "Cosas que simplemente tienen sentido"',
        'Publica una pregunta "¿Cuál es tu...?"',
        'Comparte un hilo "Tips que me cambiaron la vida"',
        'Crea un hilo de comparación "Esto vs aquello"',
        'Publica una pregunta "Cuéntame tu..."',
        'Comparte un hilo "Cosas que aprendí..."',
        'Crea un tweet de personaje "POV:"',
      ],
      linkedin: [
        'Comparte una publicación "Lecciones aprendidas"',
        'Publica un artículo "Lo que ojalá hubiera sabido"',
        'Crea una publicación educativa "Por esto..."',
        'Comparte una historia "Detrás de cámaras"',
        'Publica "Tips para..." con consejo profesional',
        'Crea una publicación "Cosas que cambiaron mi carrera"',
        'Comparte "Mi opinión sincera sobre..."',
        'Publica una pregunta "¿Cuál es tu punto de vista?"',
        'Crea una comparación "Esto vs aquello"',
        'Comparte un "Storytime" de experiencia profesional',
        'Publica una reflexión "Lecciones de..."',
        'Crea una publicación "Tips que me ayudaron"',
        'Comparte "Cosas que aprendí"',
        'Publica "¿Cuál es tu mayor reto?"',
        'Crea una publicación tutorial "Así es como yo..."',
      ],
      facebook: [
        'Publica una pregunta "¿Cuál es tu favorito...?"',
        'Comparte una publicación educativa "Por esto..."',
        'Crea una publicación de discusión "Cuéntame tu..."',
        'Publica una encuesta "Califica del 1 al 10"',
        'Comparte "Cosas que aprendí"',
        'Crea una comparación "Antes y después"',
        'Publica "¿Cuál es tu punto de vista?"',
        'Comparte "Tips que me ayudaron"',
        'Crea una comparación "Esto vs aquello"',
        'Publica un "Storytime"',
        'Comparte "Cosas que me cambiaron la vida"',
        'Crea una publicación "Dímelo sin decirlo"',
        'Publica "¿Cuál es tu mayor reto?"',
        'Comparte "Lecciones aprendidas"',
        'Crea una publicación relatable "POV: Eres..."',
      ],
    },
  },
}

function EngagementIdeasGeneratorContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram')
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  const generateIdeas = (count: number = 5) => {
    const ideas = c.ideas[selectedPlatform as keyof typeof c.ideas]
    if (!ideas) return

    const shuffled = [...ideas].sort(() => Math.random() - 0.5)
    setGeneratedIdeas(shuffled.slice(0, count))
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  React.useEffect(() => {
    generateIdeas(5)
  }, [selectedPlatform, language])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Lightbulb className="h-10 w-10 text-accent-600 dark:text-accent-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {c.title}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {c.subtitle}
          </p>
        </div>

        {/* Documentation */}
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

        {/* Platform Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {c.selectPlatform}
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(c.ideas).map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPlatform === platform
                    ? 'bg-accent-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {c.platformNames[platform as keyof typeof c.platformNames]}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="mb-6">
          <button
            onClick={() => generateIdeas(5)}
            className="flex items-center space-x-2 px-6 py-3 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            <span>{c.generateNew}</span>
          </button>
        </div>

        {/* Generated Ideas */}
        {generatedIdeas.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {c.ideasFor(c.platformNames[selectedPlatform as keyof typeof c.platformNames])}
            </h2>
            <div className="space-y-3">
              {generatedIdeas.map((idea, index) => {
                const ideaId = `${selectedPlatform}-${index}`
                return (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-start justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <p className="text-gray-900 dark:text-white flex-1 pr-4">{idea}</p>
                    <button
                      onClick={() => copyToClipboard(idea, ideaId)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors flex-shrink-0"
                      title={c.copyIdea}
                    >
                      {copied === ideaId ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <Copy className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function EngagementIdeasGeneratorPage() {
  return <EngagementIdeasGeneratorContent />
}
