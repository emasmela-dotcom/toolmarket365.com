'use client'

import React, { useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { Copy, Check, Globe, Music } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface PlatformOutput {
  platform: string
  format: string
  content: string
  characterCount: number
  copied: boolean
}

const platformLimits: Record<string, number> = {
  instagram: 2200,
  tiktok: 2200,
  youtube: 5000,
  twitter: 280,
  linkedin: 3000,
  facebook: 63206,
}

const platformFormats: Record<string, string[]> = {
  instagram: ['Feed Post', 'Carousel', 'Reel', 'Story', 'Caption Only'],
  tiktok: ['Short Video Script', 'Caption & Hashtags'],
  youtube: ['Short', 'Community Post', 'Title + Description', 'Thumbnail Prompt'],
  twitter: ['Single Tweet', 'Thread', 'Quote Tweet'],
  linkedin: ['Long-form Post', 'Short Post', 'DM Outreach'],
  facebook: ['Feed Post', 'Group Post', 'Ad Copy Prompt'],
}

const copy = {
  en: {
    toolName: 'Multi-Platform Content Generator',
    toolDescription:
      'Generate formatted content for multiple social media platforms from a single input. Get Instagram captions, TikTok scripts, YouTube descriptions, Twitter threads, LinkedIn posts, and Facebook posts all at once.',
    howToUse: [
      { label: 'Enter your content:', text: 'Paste your blog post, article, idea, or any content' },
      { label: 'Select tone:', text: 'Choose professional, casual, or inspirational' },
      { label: 'Choose platforms:', text: 'Check the platforms you want content for' },
      { label: 'Select formats:', text: 'Choose specific formats per platform (e.g., Instagram Feed, Reel, Story)' },
      { label: 'Generate:', text: 'Click to create formatted versions for your selections' },
      { label: 'Copy & use:', text: 'Copy individual platform formats or all at once' },
    ],
    title: 'Multi-Platform Content Generator',
    subtitle: 'Enter your content once, get formatted versions for all platforms instantly',
    contentTone: 'Content Tone',
    toneProfessional: 'Professional',
    toneCasual: 'Casual',
    toneInspirational: 'Inspirational',
    yourContent: 'Your Content',
    contentPlaceholder: 'Paste your content here... (blog post, article, idea, etc.)',
    characters: 'characters',
    selectPlatforms: 'Select Platforms',
    selectFormats: 'Select Formats (per platform)',
    generating: 'Generating...',
    generateFor: (n: number) => `Generate for ${n} Platform${n !== 1 ? 's' : ''}`,
    generatedContent: 'Generated Content',
    copyAll: 'Copy All',
    overLimit: 'Over limit',
    withinLimit: '✓ Within limit',
    copied: 'Copied',
    copy: 'Copy',
    howItWorks: 'How It Works',
    howItWorksSteps: [
      'Enter your content once (blog post, article, idea, etc.)',
      'Select your preferred tone (professional, casual, inspirational)',
      'Choose which platforms you want content for',
      'Select specific formats per platform (e.g., Instagram Feed, Reel, Story)',
      "Get automatically formatted content optimized for each platform's style and limits",
      'Copy individual platform formats or all at once',
    ],
    alertEnterContent: 'Please enter some content first',
    alertSelectPlatform: 'Please select at least one platform',
    alertCopiedAll: 'All content copied to clipboard!',
    formatLabels: {
      'Feed Post': 'Feed Post',
      Carousel: 'Carousel',
      Reel: 'Reel',
      Story: 'Story',
      'Caption Only': 'Caption Only',
      'Short Video Script': 'Short Video Script',
      'Caption & Hashtags': 'Caption & Hashtags',
      Short: 'Short',
      'Community Post': 'Community Post',
      'Title + Description': 'Title + Description',
      'Thumbnail Prompt': 'Thumbnail Prompt',
      'Single Tweet': 'Single Tweet',
      Thread: 'Thread',
      'Quote Tweet': 'Quote Tweet',
      'Long-form Post': 'Long-form Post',
      'Short Post': 'Short Post',
      'DM Outreach': 'DM Outreach',
      'Group Post': 'Group Post',
      'Ad Copy Prompt': 'Ad Copy Prompt',
    } as Record<string, string>,
  },
  es: {
    toolName: 'Generador de contenido multiplataforma',
    toolDescription:
      'Genera contenido formateado para múltiples redes sociales desde una sola entrada. Obtén captions de Instagram, guiones de TikTok, descripciones de YouTube, hilos de Twitter, publicaciones de LinkedIn y posts de Facebook de una sola vez.',
    howToUse: [
      { label: 'Ingresa tu contenido:', text: 'Pega tu blog, artículo, idea o cualquier contenido' },
      { label: 'Selecciona tono:', text: 'Elige profesional, informal o inspirador' },
      { label: 'Elige plataformas:', text: 'Marca las plataformas para las que quieres contenido' },
      { label: 'Selecciona formatos:', text: 'Elige formatos específicos por plataforma (ej., Feed de Instagram, Reel, Story)' },
      { label: 'Generar:', text: 'Haz clic para crear versiones formateadas para tus selecciones' },
      { label: 'Copiar y usar:', text: 'Copia formatos individuales o todo a la vez' },
    ],
    title: 'Generador de contenido multiplataforma',
    subtitle: 'Ingresa tu contenido una vez y obtén versiones formateadas para todas las plataformas al instante',
    contentTone: 'Tono del contenido',
    toneProfessional: 'Profesional',
    toneCasual: 'Informal',
    toneInspirational: 'Inspirador',
    yourContent: 'Tu contenido',
    contentPlaceholder: 'Pega tu contenido aquí... (blog, artículo, idea, etc.)',
    characters: 'caracteres',
    selectPlatforms: 'Seleccionar plataformas',
    selectFormats: 'Seleccionar formatos (por plataforma)',
    generating: 'Generando...',
    generateFor: (n: number) => `Generar para ${n} plataforma${n !== 1 ? 's' : ''}`,
    generatedContent: 'Contenido generado',
    copyAll: 'Copiar todo',
    overLimit: 'Supera el límite',
    withinLimit: '✓ Dentro del límite',
    copied: 'Copiado',
    copy: 'Copiar',
    howItWorks: 'Cómo funciona',
    howItWorksSteps: [
      'Ingresa tu contenido una vez (blog, artículo, idea, etc.)',
      'Selecciona tu tono preferido (profesional, informal, inspirador)',
      'Elige para qué plataformas quieres contenido',
      'Selecciona formatos específicos por plataforma (ej., Feed de Instagram, Reel, Story)',
      'Obtén contenido formateado automáticamente optimizado para el estilo y límites de cada plataforma',
      'Copia formatos individuales o todo a la vez',
    ],
    alertEnterContent: 'Por favor ingresa contenido primero',
    alertSelectPlatform: 'Por favor selecciona al menos una plataforma',
    alertCopiedAll: '¡Todo el contenido copiado al portapapeles!',
    formatLabels: {
      'Feed Post': 'Publicación de feed',
      Carousel: 'Carrusel',
      Reel: 'Reel',
      Story: 'Story',
      'Caption Only': 'Solo caption',
      'Short Video Script': 'Guion de video corto',
      'Caption & Hashtags': 'Caption y hashtags',
      Short: 'Short',
      'Community Post': 'Publicación de comunidad',
      'Title + Description': 'Título + descripción',
      'Thumbnail Prompt': 'Prompt de miniatura',
      'Single Tweet': 'Tweet único',
      Thread: 'Hilo',
      'Quote Tweet': 'Tweet citado',
      'Long-form Post': 'Publicación larga',
      'Short Post': 'Publicación corta',
      'DM Outreach': 'Mensaje directo',
      'Group Post': 'Publicación de grupo',
      'Ad Copy Prompt': 'Prompt de anuncio',
    } as Record<string, string>,
  },
}

function MultiPlatformGeneratorContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const formatLabel = (format: string) => c.formatLabels[format] ?? format
  const [input, setInput] = useState('')
  const [tone, setTone] = useState('professional')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'tiktok', 'youtube', 'twitter', 'linkedin', 'facebook'])
  const [selectedFormats, setSelectedFormats] = useState<Record<string, string[]>>({
    instagram: ['Feed Post'],
    tiktok: ['Short Video Script'],
    youtube: ['Title + Description'],
    twitter: ['Single Tweet'],
    linkedin: ['Long-form Post'],
    facebook: ['Feed Post'],
  })
  const [outputs, setOutputs] = useState<PlatformOutput[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handlePlatformToggle = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform))
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform])
      // Set default format if platform is newly selected
      if (!selectedFormats[platform]) {
        setSelectedFormats({
          ...selectedFormats,
          [platform]: [platformFormats[platform][0]],
        })
      }
    }
  }

  const handleFormatToggle = (platform: string, format: string) => {
    const currentFormats = selectedFormats[platform] || []
    if (currentFormats.includes(format)) {
      // Don't allow removing the last format
      if (currentFormats.length > 1) {
        setSelectedFormats({
          ...selectedFormats,
          [platform]: currentFormats.filter((f) => f !== format),
        })
      }
    } else {
      setSelectedFormats({
        ...selectedFormats,
        [platform]: [...currentFormats, format],
      })
    }
  }

  const generateContent = () => {
    if (!input.trim()) {
      alert(c.alertEnterContent)
      return
    }

    if (selectedPlatforms.length === 0) {
      alert(c.alertSelectPlatform)
      return
    }

    setIsGenerating(true)

    // Simulate processing
    setTimeout(() => {
      const content = input.trim()
      const words = content.split(/\s+/)
      const summary = words.slice(0, Math.ceil(words.length * 0.3)).join(' ')

      const newOutputs: PlatformOutput[] = []

      // Generate content only for selected platforms and formats
      selectedPlatforms.forEach((platform) => {
        const formats = selectedFormats[platform] || []
        formats.forEach((format) => {
          let generatedContent = ''
          
          switch (platform) {
            case 'instagram':
              generatedContent = generateInstagramContent(content, summary, tone, format)
              break
            case 'tiktok':
              generatedContent = generateTikTokContent(content, summary, tone, format)
              break
            case 'youtube':
              generatedContent = generateYouTubeContent(content, summary, tone, format)
              break
            case 'twitter':
              generatedContent = generateTwitterContent(content, summary, tone, format)
              break
            case 'linkedin':
              generatedContent = generateLinkedInContent(content, summary, tone, format)
              break
            case 'facebook':
              generatedContent = generateFacebookContent(content, summary, tone, format)
              break
          }

          newOutputs.push({
            platform,
            format,
            content: generatedContent,
            characterCount: generatedContent.length,
            copied: false,
          })
        })
      })

      setOutputs(newOutputs)
      setIsGenerating(false)
    }, 1000)
  }

  const generateInstagramContent = (full: string, summary: string, tone: string, format: string): string => {
    const hooks = {
      professional: ['💡 Pro tip:', '✨ Here\'s how:', '📊 The data shows:'],
      casual: ['Just a thought 💭', 'Real talk:', 'Okay but hear me out 👂'],
      inspirational: ['Let this sink in 🌟', 'Remember:', 'You got this 💪'],
    }

    const hook = hooks[tone as keyof typeof hooks]?.[Math.floor(Math.random() * 3)] || hooks.professional[0]
    const hashtags = extractHashtags(full)

    switch (format) {
      case 'Feed Post':
        return `${hook}\n\n${summary.slice(0, 150)}\n\n${summary.slice(150, 300)}\n\n💬 What do you think?\n\n${hashtags.slice(0, 5).join(' ')}`
      case 'Carousel':
        return `CAROUSEL CAPTION:\n\n${hook}\n\n${summary.slice(0, 200)}\n\nSwipe to learn more 👉\n\n${hashtags.slice(0, 5).join(' ')}`
      case 'Reel':
        return `REEL CAPTION:\n\n${hook}\n\n${summary.slice(0, 100)}\n\nSave this post! 📌\n\n${hashtags.slice(0, 8).join(' ')}`
      case 'Story':
        return `STORY TEXT:\n\n${summary.slice(0, 50)}\n\nTap for more 👆`
      case 'Caption Only':
        return `${hook}\n\n${summary.slice(0, 200)}\n\n${hashtags.slice(0, 5).join(' ')}`
      default:
        return `${hook}\n\n${summary.slice(0, 150)}\n\n${hashtags.slice(0, 5).join(' ')}`
    }
  }

  const generateTikTokContent = (full: string, summary: string, tone: string, format: string): string => {
    const hooks = {
      professional: ['POV: You just learned', 'Tell me you know', 'When someone asks'],
      casual: ['No one talks about', 'Unpopular opinion:', 'Can we normalize'],
      inspirational: ['If you\'re struggling with', 'You deserve to know', 'This changed everything'],
    }

    const hook = hooks[tone as keyof typeof hooks]?.[Math.floor(Math.random() * 3)] || hooks.professional[0]
    const hashtags = extractHashtags(full)

    switch (format) {
      case 'Short Video Script':
        return `HOOK (0-3s):\n${hook} ${summary.slice(0, 50)}\n\nSCENE 1 (3-15s):\n${summary.slice(50, 150)}\n\nSCENE 2 (15-45s):\n${summary.slice(150, 300)}\n\nCTA (45-60s):\nFollow for more tips!\n\n${hashtags.slice(0, 3).join(' ')}`
      case 'Caption & Hashtags':
        return `${hook}\n\n${summary.slice(0, 150)}\n\n${hashtags.slice(0, 5).join(' ')}`
      default:
        return `HOOK (0-3s):\n${hook} ${summary.slice(0, 50)}\n\n${hashtags.slice(0, 3).join(' ')}`
    }
  }

  const generateYouTubeContent = (full: string, summary: string, tone: string, format: string): string => {
    const hashtags = extractHashtags(full)

    switch (format) {
      case 'Short':
        return `SHORT TITLE:\n${summary.slice(0, 60)}\n\nSHORT DESCRIPTION:\n${summary.slice(0, 150)}\n\n${hashtags.slice(0, 3).join(' ')}`
      case 'Community Post':
        return `COMMUNITY POST:\n\n${summary.slice(0, 200)}\n\nWhat do you think? Drop a comment below! 👇`
      case 'Title + Description':
        return `TITLE:\n${summary.slice(0, 60)}\n\nDESCRIPTION:\n${summary}\n\nIn this video, we'll cover:\n• ${summary.split(' ').slice(0, 10).join(' ')}\n• ${summary.split(' ').slice(10, 20).join(' ')}\n• ${summary.split(' ').slice(20, 30).join(' ')}\n\n${hashtags.slice(0, 5).join(' ')}\n\nTIMESTAMPS:\n0:00 - Introduction\n0:30 - Main Content\n2:00 - Key Takeaways\n2:30 - Conclusion`
      case 'Thumbnail Prompt':
        return `THUMBNAIL TEXT:\n${summary.slice(0, 40)}\n\nTHUMBNAIL DESCRIPTION:\nBold text overlay with ${summary.split(' ').slice(0, 5).join(' ')}. Eye-catching colors. Clear, readable font.`
      default:
        return `TITLE:\n${summary.slice(0, 60)}\n\nDESCRIPTION:\n${summary}\n\n${hashtags.slice(0, 5).join(' ')}`
    }
  }

  const generateTwitterContent = (full: string, summary: string, tone: string, format: string): string => {
    const shortSummary = summary.slice(0, 200)
    const hashtags = extractHashtags(full)

    switch (format) {
      case 'Single Tweet':
        return `${shortSummary.slice(0, 250)}\n\n${hashtags.slice(0, 2).join(' ')}`
      case 'Thread':
        const parts = splitIntoThread(shortSummary)
        return parts.map((part, i) => `${i + 1}/${parts.length} ${part}`).join('\n\n')
      case 'Quote Tweet':
        return `QUOTE TWEET:\n\n"${shortSummary.slice(0, 200)}"\n\n${hashtags.slice(0, 2).join(' ')}`
      default:
        return `${shortSummary.slice(0, 250)}\n\n${hashtags.slice(0, 2).join(' ')}`
    }
  }

  const generateLinkedInContent = (full: string, summary: string, tone: string, format: string): string => {
    const hooks = {
      professional: ['🚀 Here\'s what I learned:', '💡 Key insight:', '📊 The data reveals:'],
      casual: ['Quick thought:', 'Sharing something:', 'Had to get this off my chest:'],
      inspirational: ['Let me share this:', 'This resonated with me:', 'Worth sharing:'],
    }

    const hook = hooks[tone as keyof typeof hooks]?.[Math.floor(Math.random() * 3)] || hooks.professional[0]

    switch (format) {
      case 'Long-form Post':
        return `${hook}\n\n${summary}\n\nKey takeaways:\n• ${summary.split(' ').slice(0, 15).join(' ')}\n• ${summary.split(' ').slice(15, 30).join(' ')}\n• ${summary.split(' ').slice(30, 45).join(' ')}\n\nWhat's your experience with this? Let's discuss in the comments 👇`
      case 'Short Post':
        return `${hook}\n\n${summary.slice(0, 300)}\n\nThoughts?`
      case 'DM Outreach':
        return `Hi [Name],\n\nI noticed [context]. ${summary.slice(0, 150)}\n\nWould love to connect!\n\nBest,\n[Your Name]`
      default:
        return `${hook}\n\n${summary}\n\nWhat's your experience with this? 👇`
    }
  }

  const generateFacebookContent = (full: string, summary: string, tone: string, format: string): string => {
    const hashtags = extractHashtags(full)

    switch (format) {
      case 'Feed Post':
        return `${summary}\n\n${full.slice(0, 500)}\n\n💬 What are your thoughts?\n\n${hashtags.slice(0, 3).join(' ')}`
      case 'Group Post':
        return `GROUP POST:\n\n${summary.slice(0, 300)}\n\nWhat do you all think about this?\n\n${hashtags.slice(0, 2).join(' ')}`
      case 'Ad Copy Prompt':
        return `AD HEADLINE:\n${summary.slice(0, 40)}\n\nAD COPY:\n${summary.slice(0, 200)}\n\nCTA: Learn More\n\n${hashtags.slice(0, 2).join(' ')}`
      default:
        return `${summary}\n\n${hashtags.slice(0, 3).join(' ')}`
    }
  }

  const extractHashtags = (text: string): string[] => {
    const words = text.split(/\s+/).filter((w) => w.length > 4)
    return words.slice(0, 10).map((w) => `#${w.replace(/[^a-z0-9]/gi, '').toLowerCase()}`)
  }

  const splitIntoThread = (text: string, maxLength: number = 250): string[] => {
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text]
    const parts: string[] = []
    let current = ''

    sentences.forEach((sentence) => {
      if ((current + sentence).length <= maxLength) {
        current += sentence
      } else {
        if (current) parts.push(current.trim())
        current = sentence
      }
    })

    if (current) parts.push(current.trim())
    return parts.length > 0 ? parts : [text]
  }

  const handleCopy = async (platform: string) => {
    const output = outputs.find((o) => o.platform === platform)
    if (output) {
      await navigator.clipboard.writeText(output.content)
      setOutputs(
        outputs.map((o) => (o.platform === platform ? { ...o, copied: true } : o))
      )
      setTimeout(() => {
        setOutputs(
          outputs.map((o) => (o.platform === platform ? { ...o, copied: false } : o))
        )
      }, 2000)
    }
  }

  const handleCopyAll = async () => {
    const allContent = outputs
      .map((o) => `=== ${o.platform.toUpperCase()} ===\n\n${o.content}\n\n`)
      .join('\n')
    await navigator.clipboard.writeText(allContent)
    alert(c.alertCopiedAll)
  }

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, typeof Copy> = {
      instagram: Globe,
      tiktok: Music,
      youtube: Globe,
      twitter: Globe,
      linkedin: Globe,
      facebook: Globe,
    }
    return icons[platform] || Copy
  }

  const getPlatformColor = (platform: string): string => {
    const colors: Record<string, string> = {
      instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
      tiktok: 'bg-black',
      youtube: 'bg-red-600',
      twitter: 'bg-blue-400',
      linkedin: 'bg-blue-700',
      facebook: 'bg-blue-600',
    }
    return colors[platform] || 'bg-gray-500'
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 text-mono-950 dark:text-mono-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{c.title}</h1>
          <p className="text-mono-600 dark:text-mono-400">{c.subtitle}</p>
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">{c.contentTone}</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-2 border border-mono-300 dark:border-mono-700 rounded bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50"
            >
              <option value="professional">{c.toneProfessional}</option>
              <option value="casual">{c.toneCasual}</option>
              <option value="inspirational">{c.toneInspirational}</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">{c.yourContent}</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={c.contentPlaceholder}
              rows={8}
              className="w-full p-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-800 text-mono-950 dark:text-mono-50 resize-y"
            />
            <p className="text-xs text-mono-500 mt-1">{input.length} {c.characters}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-3">{c.selectPlatforms}</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.keys(platformFormats).map((platform) => {
                const Icon = getPlatformIcon(platform)
                const isSelected = selectedPlatforms.includes(platform)
                return (
                  <label
                    key={platform}
                    className={`flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20'
                        : 'border-mono-200 dark:border-mono-700 hover:border-mono-300 dark:hover:border-mono-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handlePlatformToggle(platform)}
                      className="w-4 h-4 text-accent-600 rounded focus:ring-accent-500"
                    />
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium capitalize">{platform}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Format Selection per Platform */}
          {selectedPlatforms.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-3">{c.selectFormats}</label>
              <div className="space-y-4">
                {selectedPlatforms.map((platform) => {
                  const formats = platformFormats[platform] || []
                  const selectedFormatsForPlatform = selectedFormats[platform] || []
                  return (
                    <div key={platform} className="border border-mono-200 dark:border-mono-700 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        {React.createElement(getPlatformIcon(platform), { className: 'h-4 w-4' })}
                        <span className="text-sm font-semibold capitalize">{platform}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formats.map((format) => {
                          const isSelected = selectedFormatsForPlatform.includes(format)
                          return (
                            <label
                              key={format}
                              className={`flex items-center space-x-1 px-3 py-1.5 text-xs border rounded cursor-pointer transition-colors ${
                                isSelected
                                  ? 'border-accent-500 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300'
                                  : 'border-mono-300 dark:border-mono-600 hover:border-mono-400 dark:hover:border-mono-500'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleFormatToggle(platform, format)}
                                className="w-3 h-3 text-accent-600 rounded focus:ring-accent-500"
                              />
                              <span>{formatLabel(format)}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <button
            onClick={generateContent}
            disabled={isGenerating || !input.trim() || selectedPlatforms.length === 0}
            className="w-full py-3 bg-accent-600 text-white rounded-lg font-semibold hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating
              ? c.generating
              : c.generateFor(selectedPlatforms.length)}
          </button>
        </div>

        {/* Output Section */}
        {outputs.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{c.generatedContent}</h2>
              <button
                onClick={handleCopyAll}
                className="px-4 py-2 bg-mono-200 dark:bg-mono-700 rounded-lg hover:bg-mono-300 dark:hover:bg-mono-600 text-sm font-medium"
              >
                {c.copyAll}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {outputs.map((output, index) => {
                const Icon = getPlatformIcon(output.platform)
                const colorClass = getPlatformColor(output.platform)
                const isOverLimit = output.characterCount > platformLimits[output.platform]

                return (
                  <div
                    key={`${output.platform}-${output.format}-${index}`}
                    className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 overflow-hidden"
                  >
                    {/* Platform Header */}
                    <div className={`${colorClass} text-white p-3 flex items-center justify-between`}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        <div className="flex flex-col">
                          <span className="font-semibold capitalize">{output.platform}</span>
                          <span className="text-xs opacity-90">{formatLabel(output.format)}</span>
                        </div>
                      </div>
                      <span className="text-xs">
                        {output.characterCount}/{platformLimits[output.platform]}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="bg-mono-50 dark:bg-mono-800 rounded p-3 mb-3 min-h-[200px] max-h-[300px] overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-mono-700 dark:text-mono-300 font-sans">
                          {output.content}
                        </pre>
                      </div>

                      {/* Status & Copy */}
                      <div className="flex items-center justify-between">
                        {isOverLimit && (
                          <span className="text-xs text-red-600 dark:text-red-400">
                            {c.overLimit}
                          </span>
                        )}
                        {!isOverLimit && (
                          <span className="text-xs text-green-600 dark:text-green-400">
                            {c.withinLimit}
                          </span>
                        )}
                        <button
                          onClick={() => handleCopy(output.platform)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-mono-100 dark:bg-mono-800 rounded hover:bg-mono-200 dark:hover:bg-mono-700 text-sm"
                        >
                          {output.copied ? (
                            <>
                              <Check className="h-4 w-4" />
                              {c.copied}
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              {c.copy}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            {c.howItWorks}
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
            {c.howItWorksSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function MultiPlatformGenerator() {
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
      toolSlug="multi-platform-generator"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <MultiPlatformGeneratorContent />
    </ToolAccessGate>
  )
}
