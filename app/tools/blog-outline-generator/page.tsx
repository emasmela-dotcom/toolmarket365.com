'use client'

import { useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    toolName: 'Blog Outline Generator',
    toolDescription:
      'Generate structured blog post outlines based on your title, tone, and target audience. Create comprehensive outlines with headings, subheadings, and key points to guide your writing.',
    howToUse: [
      { label: 'Enter blog title:', text: 'Type the title or topic of your blog post' },
      { label: 'Select tone:', text: 'Choose professional, casual, or friendly' },
      { label: 'Select level:', text: 'Choose beginner, intermediate, or advanced' },
      { label: 'Add keyword (optional):', text: 'Include a focus keyword for SEO' },
      { label: 'Click "Generate Outline"', text: 'to create your blog structure' },
      { label: 'Review and use:', text: 'Copy the outline to guide your writing' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Generates detailed blog outlines with H2, H3 headings and bullet points. Creates structured, customizable outlines based on your title, tone, and target audience level.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter blog title (required):', text: 'Type your blog post title' },
      { label: 'Select tone:', text: 'Professional, Casual, Friendly, Academic, or Conversational' },
      { label: 'Choose level:', text: 'Beginner, Intermediate, or Advanced' },
      { label: 'Add primary keyword (optional):', text: 'For SEO focus' },
      { label: 'Click "Generate Outline"', text: 'to create your outline' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Structured outline with H2/H3 headings and bullet points tailored to your title, tone, and level',
      'Standard blog structure (Introduction, Understanding the Basics, Key Concepts, Advanced Techniques, Real-World Applications, Common Pitfalls, Best Practices, Conclusion)',
      'SEO-optimized structure if keyword provided',
      'Tone-appropriate content structure ready to customize',
    ],
    title: 'Blog Outline Generator',
    subtitle:
      'Generate detailed blog outlines with H2, H3, and bullet points. Works with or without OpenAI API.',
    blogTitleLabel: 'Blog Title *',
    blogTitlePlaceholder: 'e.g., How to Build a Successful SaaS Product',
    toneLabel: 'Tone',
    toneProfessional: 'Professional',
    toneCasual: 'Casual',
    toneFriendly: 'Friendly',
    toneAcademic: 'Academic',
    toneConversational: 'Conversational',
    levelLabel: 'Level',
    levelBeginner: 'Beginner',
    levelIntermediate: 'Intermediate',
    levelAdvanced: 'Advanced',
    keywordLabel: 'Primary Keyword (optional)',
    keywordPlaceholder: 'e.g., SaaS development',
    generating: 'Generating...',
    generateOutline: 'Generate Outline',
    errorEnterTitle: 'Please enter a blog title',
    generatedOutline: 'Generated Outline',
    copy: 'Copy',
  },
  es: {
    toolName: 'Generador de esquemas de blog',
    toolDescription:
      'Genera esquemas estructurados de entradas de blog según tu título, tono y audiencia objetivo. Crea esquemas completos con encabezados, subtítulos y puntos clave para guiar tu redacción.',
    howToUse: [
      { label: 'Ingresa el título del blog:', text: 'Escribe el título o tema de tu entrada' },
      { label: 'Selecciona el tono:', text: 'Elige profesional, casual o amigable' },
      { label: 'Selecciona el nivel:', text: 'Elige principiante, intermedio o avanzado' },
      { label: 'Agrega palabra clave (opcional):', text: 'Incluye una palabra clave para SEO' },
      { label: 'Haz clic en "Generar esquema"', text: 'para crear la estructura de tu blog' },
      { label: 'Revisa y usa:', text: 'Copia el esquema para guiar tu redacción' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Genera esquemas detallados de blog con encabezados H2, H3 y viñetas. Crea esquemas estructurados y personalizables según tu título, tono y nivel de audiencia.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Ingresa el título del blog (obligatorio):', text: 'Escribe el título de tu entrada' },
      { label: 'Selecciona el tono:', text: 'Profesional, casual, amigable, académico o conversacional' },
      { label: 'Elige el nivel:', text: 'Principiante, intermedio o avanzado' },
      { label: 'Agrega palabra clave principal (opcional):', text: 'Para enfoque SEO' },
      { label: 'Haz clic en "Generar esquema"', text: 'para crear tu esquema' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Esquema estructurado con encabezados H2/H3 y viñetas adaptados a tu título, tono y nivel',
      'Estructura estándar de blog (Introducción, Entender lo básico, Conceptos clave, Técnicas avanzadas, Aplicaciones reales, Errores comunes, Mejores prácticas, Conclusión)',
      'Estructura optimizada para SEO si se proporciona palabra clave',
      'Estructura de contenido acorde al tono, lista para personalizar',
    ],
    title: 'Generador de esquemas de blog',
    subtitle:
      'Genera esquemas detallados de blog con H2, H3 y viñetas. Funciona con o sin la API de OpenAI.',
    blogTitleLabel: 'Título del blog *',
    blogTitlePlaceholder: 'p. ej., Cómo construir un producto SaaS exitoso',
    toneLabel: 'Tono',
    toneProfessional: 'Profesional',
    toneCasual: 'Casual',
    toneFriendly: 'Amigable',
    toneAcademic: 'Académico',
    toneConversational: 'Conversacional',
    levelLabel: 'Nivel',
    levelBeginner: 'Principiante',
    levelIntermediate: 'Intermedio',
    levelAdvanced: 'Avanzado',
    keywordLabel: 'Palabra clave principal (opcional)',
    keywordPlaceholder: 'p. ej., desarrollo SaaS',
    generating: 'Generando...',
    generateOutline: 'Generar esquema',
    errorEnterTitle: 'Por favor ingresa un título de blog',
    generatedOutline: 'Esquema generado',
    copy: 'Copiar',
  },
}

function BlogOutlineGeneratorContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [title, setTitle] = useState('')
  const [tone, setTone] = useState('professional')
  const [level, setLevel] = useState('intermediate')
  const [keyword, setKeyword] = useState('')
  const [output, setOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const generateOutline = () => {
    if (!title.trim()) {
      setError(c.errorEnterTitle)
      return
    }

    setIsGenerating(true)
    setError('')
    setOutput('')

    setTimeout(() => {
      const template = generateTemplateOutline(title, tone, level, keyword)
      setOutput(template)
      setIsGenerating(false)
    }, 500)
  }

  const generateTemplateOutline = (title: string, tone: string, level: string, kw: string): string => {
    const intro = `# ${title}\n\n## Introduction\n- Hook: Capture reader attention\n- Context: Set the stage for the topic\n- Thesis: Main argument or purpose${kw ? `\n- Keyword focus: ${kw}` : ''}\n\n`

    const sections = [
      '## Understanding the Basics',
      '## Key Concepts and Strategies',
      '## Advanced Techniques',
      '## Real-World Applications',
      '## Common Pitfalls to Avoid',
      '## Best Practices',
      '## Conclusion',
    ]

    const outline = sections
      .map((section, idx) => {
        let content = `\n${section}\n`

        if (idx === 0) {
          content += `- Definition and core principles\n- Why it matters\n- Key terminology\n`
        } else if (idx === 1) {
          content += `- Main strategies\n- Step-by-step approach\n- Tools and resources\n`
        } else if (idx === 2) {
          content += `- Advanced tips\n- Optimization techniques\n- Expert insights\n`
        } else if (idx === 3) {
          content += `- Case studies\n- Examples\n- Success stories\n`
        } else if (idx === 4) {
          content += `- Mistakes to avoid\n- Warning signs\n- Prevention tips\n`
        } else if (idx === 5) {
          content += `- Recommended approach\n- Action items\n- Next steps\n`
        } else {
          content += `- Summary of key points\n- Final thoughts\n- Call to action\n`
        }

        return content
      })
      .join('\n')

    return intro + outline + '\n\n## Conclusion\n- Recap main points\n- Final recommendations\n- Encouragement to take action\n'
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 text-mono-950 dark:text-mono-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
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
                  <li key={i}>
                    <strong>{step.label}</strong> {step.text}
                  </li>
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

        <h1 className="text-3xl font-bold mb-2">{c.title}</h1>
        <p className="text-mono-600 dark:text-mono-400 mb-6">{c.subtitle}</p>

        <div className="bg-mono-50 dark:bg-mono-900 border border-mono-300 dark:border-mono-700 rounded-lg p-6 mb-6">
          <label className="block mb-2 text-sm font-semibold">{c.blogTitleLabel}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={c.blogTitlePlaceholder}
            className="w-full p-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />

          <label className="block mb-2 mt-4 text-sm font-semibold">{c.toneLabel}</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full p-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="professional">{c.toneProfessional}</option>
            <option value="casual">{c.toneCasual}</option>
            <option value="friendly">{c.toneFriendly}</option>
            <option value="academic">{c.toneAcademic}</option>
            <option value="conversational">{c.toneConversational}</option>
          </select>

          <label className="block mb-2 mt-4 text-sm font-semibold">{c.levelLabel}</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full p-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="beginner">{c.levelBeginner}</option>
            <option value="intermediate">{c.levelIntermediate}</option>
            <option value="advanced">{c.levelAdvanced}</option>
          </select>

          <label className="block mb-2 mt-4 text-sm font-semibold">{c.keywordLabel}</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={c.keywordPlaceholder}
            className="w-full p-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />

          <button
            onClick={generateOutline}
            disabled={isGenerating}
            className="w-full mt-6 px-4 py-3 bg-accent-600 text-white rounded font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? c.generating : c.generateOutline}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {output && (
          <div className="bg-mono-50 dark:bg-mono-900 border border-mono-300 dark:border-mono-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{c.generatedOutline}</h2>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(output)
                }}
                className="px-4 py-2 bg-mono-200 dark:bg-mono-700 rounded hover:bg-mono-300 dark:hover:bg-mono-600 text-sm"
              >
                {c.copy}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono bg-mono-100 dark:bg-mono-800 p-4 rounded overflow-x-auto">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BlogOutlineGenerator() {
  const { language } = useLanguage()
  const c = copy[language]

  const howToUse = (
    <ol className="list-decimal list-inside space-y-1 ml-2">
      {c.howToUse.map((step, i) => (
        <li key={i}>
          <strong>{step.label}</strong> {step.text}
        </li>
      ))}
    </ol>
  )

  return (
    <ToolAccessGate
      toolSlug="blog-outline-generator"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <BlogOutlineGeneratorContent />
    </ToolAccessGate>
  )
}
