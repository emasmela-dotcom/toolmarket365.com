'use client'

import { useState } from 'react'
import { Search, Copy, TrendingUp, BarChart3, Users, Zap, Check } from 'lucide-react';
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Hashtag {
  tag: string
  volume: string
  engagement: 'High' | 'Medium' | 'Low'
  competition: 'High' | 'Medium' | 'Low'
  trending: boolean
}

const copy = {
  en: {
    toolName: 'Hashtag Research',
    toolDescription:
      'Research and discover the best hashtags for your content. Find trending hashtags, analyze engagement levels, competition, and volume to optimize your social media posts.',
    howToUse: [
      { label: 'Enter search term:', text: 'Type a keyword or topic related to your content' },
      { label: 'Select platform:', text: 'Choose Instagram, TikTok, Twitter, or LinkedIn' },
      { label: 'Click "Search Hashtags"', text: 'to find relevant hashtags' },
      { label: 'Review results:', text: 'See hashtag volume, engagement levels, competition, and trending status' },
      { label: 'Copy hashtags:', text: 'Click the copy button to use hashtags in your posts' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Discovers the best hashtags for your content based on topics and keywords. Shows volume, engagement potential, competition level, and trending status. Organizes hashtags into optimal mixes, trending tags, and niche opportunities.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter a topic or keyword:', text: 'Type a topic (e.g., fitness, travel, food, fashion, tech)' },
      { label: 'Select platform:', text: 'Choose Instagram, TikTok, or Twitter' },
      { label: 'Click "Search"', text: 'to find relevant hashtags' },
      { label: 'Review results:', text: 'Stats overview (total found, trending count, average engagement), Optimal Mix (top 3 high-competition hashtags), Trending Now (currently trending hashtags), Niche Opportunities (lower competition hashtags), Full table (all related hashtags with details)' },
      { label: 'Copy hashtags:', text: 'Click "Copy All" on any section' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      '10+ related hashtags for your topic',
      'Volume data - Post count for each hashtag',
      'Engagement ratings - High, Medium, or Low',
      'Competition levels - High, Medium, or Low',
      'Trending indicators - Which hashtags are hot right now',
      'Organized categories: Optimal mix for maximum reach, Trending tags for current visibility, Niche opportunities for less competition',
    ],
    title: 'Hashtag Research Tool',
    subtitle: 'Discover the best hashtags to boost your content reach',
    supportedPlatforms: 'Supported Platforms:',
    searchPlaceholder: 'Enter topic or keyword (e.g., fitness, travel, food)...',
    searching: 'Searching...',
    search: 'Search',
    totalFound: 'Total Found',
    relatedHashtags: 'Related hashtags',
    trending: 'Trending',
    hotRightNow: 'Hot right now',
    avgEngagement: 'Avg Engagement',
    expectedReach: 'Expected reach',
    optimalMix: 'Optimal Mix (High Competition)',
    trendingNow: 'Trending Now',
    nicheOpportunities: 'Niche Opportunities (Lower Competition)',
    copyAll: 'Copy All',
    copied: 'Copied!',
    allRelated: 'All Related Hashtags',
    colHashtag: 'Hashtag',
    colVolume: 'Volume',
    colEngagement: 'Engagement',
    colCompetition: 'Competition',
    colStatus: 'Status',
    trendingLabel: 'Trending',
    startResearch: 'Start Your Hashtag Research',
    startBody: 'Enter a topic or keyword to discover the best hashtags for your content',
    levelLabels: { High: 'High', Medium: 'Medium', Low: 'Low' } as Record<string, string>,
  },
  es: {
    toolName: 'Investigación de hashtags',
    toolDescription:
      'Investiga y descubre los mejores hashtags para tu contenido. Encuentra hashtags en tendencia, analiza niveles de interacción, competencia y volumen para optimizar tus publicaciones en redes sociales.',
    howToUse: [
      { label: 'Ingresa término de búsqueda:', text: 'Escribe una palabra clave o tema relacionado con tu contenido' },
      { label: 'Selecciona plataforma:', text: 'Elige Instagram, TikTok, Twitter o LinkedIn' },
      { label: 'Haz clic en "Buscar hashtags"', text: 'para encontrar hashtags relevantes' },
      { label: 'Revisa resultados:', text: 'Ve volumen, niveles de interacción, competencia y estado de tendencia' },
      { label: 'Copia hashtags:', text: 'Haz clic en el botón copiar para usarlos en tus publicaciones' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Descubre los mejores hashtags para tu contenido según temas y palabras clave. Muestra volumen, potencial de interacción, nivel de competencia y estado de tendencia. Organiza hashtags en mezclas óptimas, etiquetas en tendencia y oportunidades de nicho.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Ingresa un tema o palabra clave:', text: 'Escribe un tema (ej., fitness, viajes, comida, moda, tech)' },
      { label: 'Selecciona plataforma:', text: 'Elige Instagram, TikTok o Twitter' },
      { label: 'Haz clic en "Buscar"', text: 'para encontrar hashtags relevantes' },
      { label: 'Revisa resultados:', text: 'Resumen (total encontrados, en tendencia, interacción promedio), Mezcla óptima (top 3 de alta competencia), En tendencia ahora, Oportunidades de nicho (menor competencia), Tabla completa con detalles' },
      { label: 'Copia hashtags:', text: 'Haz clic en "Copiar todo" en cualquier sección' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Más de 10 hashtags relacionados para tu tema',
      'Datos de volumen: cantidad de publicaciones por hashtag',
      'Calificaciones de interacción: Alto, Medio o Bajo',
      'Niveles de competencia: Alto, Medio o Bajo',
      'Indicadores de tendencia: qué hashtags están de moda ahora',
      'Categorías organizadas: mezcla óptima para máximo alcance, etiquetas en tendencia para visibilidad actual, oportunidades de nicho con menos competencia',
    ],
    title: 'Herramienta de investigación de hashtags',
    subtitle: 'Descubre los mejores hashtags para aumentar el alcance de tu contenido',
    supportedPlatforms: 'Plataformas compatibles:',
    searchPlaceholder: 'Ingresa tema o palabra clave (ej., fitness, viajes, comida)...',
    searching: 'Buscando...',
    search: 'Buscar',
    totalFound: 'Total encontrados',
    relatedHashtags: 'Hashtags relacionados',
    trending: 'En tendencia',
    hotRightNow: 'De moda ahora',
    avgEngagement: 'Interacción prom.',
    expectedReach: 'Alcance esperado',
    optimalMix: 'Mezcla óptima (alta competencia)',
    trendingNow: 'En tendencia ahora',
    nicheOpportunities: 'Oportunidades de nicho (menor competencia)',
    copyAll: 'Copiar todo',
    copied: '¡Copiado!',
    allRelated: 'Todos los hashtags relacionados',
    colHashtag: 'Hashtag',
    colVolume: 'Volumen',
    colEngagement: 'Interacción',
    colCompetition: 'Competencia',
    colStatus: 'Estado',
    trendingLabel: 'En tendencia',
    startResearch: 'Comienza tu investigación de hashtags',
    startBody: 'Ingresa un tema o palabra clave para descubrir los mejores hashtags para tu contenido',
    levelLabels: { High: 'Alto', Medium: 'Medio', Low: 'Bajo' } as Record<string, string>,
  },
}

function HashtagResearchToolContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [searchTerm, setSearchTerm] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [results, setResults] = useState<{
    query: string
    hashtags: Hashtag[]
    optimal: Hashtag[]
    growing: Hashtag[]
    niche: Hashtag[]
  } | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const hashtagDatabase: Record<string, Hashtag[]> = {
    fitness: [
      { tag: 'fitness', volume: '487M', engagement: 'High', competition: 'High', trending: true },
      { tag: 'fitnessjourney', volume: '89M', engagement: 'High', competition: 'Medium', trending: true },
      { tag: 'fitnessmotivation', volume: '156M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'fitnesslife', volume: '45M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'fitnessaddict', volume: '23M', engagement: 'Medium', competition: 'Low', trending: false },
      { tag: 'fitfam', volume: '67M', engagement: 'High', competition: 'Medium', trending: true },
      { tag: 'gymlife', volume: '134M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'workout', volume: '289M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'gains', volume: '78M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'fitnessgirl', volume: '92M', engagement: 'High', competition: 'Medium', trending: false }
    ],
    travel: [
      { tag: 'travel', volume: '567M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'travelgram', volume: '178M', engagement: 'High', competition: 'High', trending: true },
      { tag: 'travelphotography', volume: '234M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'wanderlust', volume: '145M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'traveltheworld', volume: '89M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'instatravel', volume: '198M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'travelblogger', volume: '76M', engagement: 'Medium', competition: 'Medium', trending: true },
      { tag: 'traveladdict', volume: '34M', engagement: 'Medium', competition: 'Low', trending: false },
      { tag: 'explore', volume: '456M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'adventure', volume: '312M', engagement: 'High', competition: 'High', trending: false }
    ],
    food: [
      { tag: 'food', volume: '456M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'foodie', volume: '234M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'foodporn', volume: '289M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'foodstagram', volume: '167M', engagement: 'High', competition: 'High', trending: true },
      { tag: 'instafood', volume: '198M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'yummy', volume: '145M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'delicious', volume: '123M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'foodblogger', volume: '87M', engagement: 'Medium', competition: 'Medium', trending: true },
      { tag: 'homemade', volume: '92M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'foodphotography', volume: '76M', engagement: 'High', competition: 'Medium', trending: false }
    ],
    fashion: [
      { tag: 'fashion', volume: '523M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'fashionista', volume: '167M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'style', volume: '289M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'ootd', volume: '378M', engagement: 'High', competition: 'High', trending: true },
      { tag: 'fashionblogger', volume: '134M', engagement: 'High', competition: 'Medium', trending: false },
      { tag: 'instafashion', volume: '156M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'outfitoftheday', volume: '198M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'stylish', volume: '89M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'fashionstyle', volume: '67M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'lookbook', volume: '54M', engagement: 'Medium', competition: 'Low', trending: true }
    ],
    tech: [
      { tag: 'technology', volume: '123M', engagement: 'Medium', competition: 'High', trending: false },
      { tag: 'tech', volume: '178M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'innovation', volume: '89M', engagement: 'Medium', competition: 'Medium', trending: true },
      { tag: 'ai', volume: '234M', engagement: 'High', competition: 'High', trending: true },
      { tag: 'coding', volume: '67M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'programming', volume: '54M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'developer', volume: '76M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'techie', volume: '23M', engagement: 'Low', competition: 'Low', trending: false },
      { tag: 'startup', volume: '145M', engagement: 'High', competition: 'High', trending: true },
      { tag: 'gadgets', volume: '45M', engagement: 'Medium', competition: 'Medium', trending: false }
    ]
  }

  const getRelevantHashtags = (term: string): Hashtag[] => {
    const lowerTerm = term.toLowerCase()
    for (const [key, hashtags] of Object.entries(hashtagDatabase)) {
      if (key.includes(lowerTerm) || lowerTerm.includes(key)) {
        return hashtags
      }
    }
    return hashtagDatabase.fitness
  }

  const handleSearch = () => {
    if (!searchTerm.trim()) return
    
    setIsSearching(true)
    
    setTimeout(() => {
      const hashtags = getRelevantHashtags(searchTerm)
      
      setResults({
        query: searchTerm,
        hashtags: hashtags,
        optimal: hashtags.slice(0, 3),
        growing: hashtags.filter(h => h.trending).slice(0, 3),
        niche: hashtags.filter(h => h.competition === 'Low' || h.competition === 'Medium').slice(0, 4)
      })
      
      setIsSearching(false)
    }, 800)
  }

  const copyToClipboard = (tags: Hashtag[], index: string) => {
    const tagString = tags.map(h => `#${h.tag}`).join(' ')
    navigator.clipboard.writeText(tagString)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const getEngagementColor = (engagement: string) => {
    switch(engagement) {
      case 'High': return 'text-accent-600'
      case 'Medium': return 'text-mono-600'
      case 'Low': return 'text-mono-500'
      default: return 'text-mono-600'
    }
  }

  const getCompetitionColor = (competition: string) => {
    switch(competition) {
      case 'High': return 'bg-mono-200 text-mono-700'
      case 'Medium': return 'bg-mono-100 text-mono-600'
      case 'Low': return 'bg-accent-100 text-accent-700'
      default: return 'bg-mono-100 text-mono-600'
    }
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-8 border border-mono-200 dark:border-mono-700">
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

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-2">{c.title}</h1>
          <p className="text-mono-600 dark:text-mono-400 mb-4">{c.subtitle}</p>
          
          <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-xs font-semibold text-mono-700 dark:text-mono-300 mb-2">{c.supportedPlatforms}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">📸 Instagram</span>
              <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">🎵 TikTok</span>
              <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">🐦 Twitter/X</span>
            </div>
          </div>
        </div>

        <div className="bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-700 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={c.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-3 border border-mono-300 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200 bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="px-4 py-3 border border-mono-300 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200 text-mono-950 dark:text-mono-50 bg-mono-50 dark:bg-mono-900"
              >
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="twitter">Twitter</option>
              </select>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="px-6 py-3 bg-accent-600 text-white rounded-lg font-medium hover:bg-accent-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search size={20} />
                {isSearching ? c.searching : c.search}
              </button>
            </div>
          </div>
        </div>

        {results && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                    <BarChart3 className="text-accent-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-mono-950 dark:text-mono-50">{c.totalFound}</h3>
                </div>
                <p className="text-3xl font-bold text-mono-950 dark:text-mono-50">{results.hashtags.length}</p>
                <p className="text-sm text-mono-500 dark:text-mono-500 mt-1">{c.relatedHashtags}</p>
              </div>

              <div className="bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                    <TrendingUp className="text-accent-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-mono-950 dark:text-mono-50">{c.trending}</h3>
                </div>
                <p className="text-3xl font-bold text-mono-950 dark:text-mono-50">{results.hashtags.filter(h => h.trending).length}</p>
                <p className="text-sm text-mono-500 dark:text-mono-500 mt-1">{c.hotRightNow}</p>
              </div>

              <div className="bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                    <Zap className="text-accent-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-mono-950 dark:text-mono-50">{c.avgEngagement}</h3>
                </div>
                <p className="text-3xl font-bold text-mono-950 dark:text-mono-50">{c.levelLabels.High}</p>
                <p className="text-sm text-mono-500 dark:text-mono-500 mt-1">{c.expectedReach}</p>
              </div>
            </div>

            <div className="bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-700 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 flex items-center gap-2">
                  <Zap className="text-accent-600" size={24} />
                  {c.optimalMix}
                </h2>
                <button
                  onClick={() => copyToClipboard(results.optimal, 'optimal')}
                  className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 transition-colors text-mono-700 dark:text-mono-300"
                >
                  {copiedIndex === 'optimal' ? <Check size={18} className="text-accent-600" /> : <Copy size={18} />}
                  {copiedIndex === 'optimal' ? c.copied : c.copyAll}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {results.optimal.map((hashtag, idx) => (
                  <div key={idx} className="px-4 py-2 bg-accent-100 dark:bg-accent-900/30 border border-accent-200 dark:border-accent-800 rounded-lg">
                    <span className="font-semibold text-accent-700 dark:text-accent-400">#{hashtag.tag}</span>
                    <span className="text-sm text-mono-600 dark:text-mono-400 ml-2">({hashtag.volume})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-700 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 flex items-center gap-2">
                  <TrendingUp className="text-accent-600" size={24} />
                  {c.trendingNow}
                </h2>
                <button
                  onClick={() => copyToClipboard(results.growing, 'growing')}
                  className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 transition-colors text-mono-700 dark:text-mono-300"
                >
                  {copiedIndex === 'growing' ? <Check size={18} className="text-accent-600" /> : <Copy size={18} />}
                  {copiedIndex === 'growing' ? c.copied : c.copyAll}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {results.growing.map((hashtag, idx) => (
                  <div key={idx} className="px-4 py-2 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg">
                    <span className="font-semibold text-accent-700 dark:text-accent-400">#{hashtag.tag}</span>
                    <span className="text-sm text-mono-600 dark:text-mono-400 ml-2">({hashtag.volume})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-700 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 flex items-center gap-2">
                  <Users className="text-accent-600" size={24} />
                  {c.nicheOpportunities}
                </h2>
                <button
                  onClick={() => copyToClipboard(results.niche, 'niche')}
                  className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 transition-colors text-mono-700 dark:text-mono-300"
                >
                  {copiedIndex === 'niche' ? <Check size={18} className="text-accent-600" /> : <Copy size={18} />}
                  {copiedIndex === 'niche' ? c.copied : c.copyAll}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {results.niche.map((hashtag, idx) => (
                  <div key={idx} className="px-4 py-2 bg-mono-50 dark:bg-mono-800 border border-mono-200 dark:border-mono-700 rounded-lg">
                    <span className="font-semibold text-mono-700 dark:text-mono-300">#{hashtag.tag}</span>
                    <span className="text-sm text-mono-600 dark:text-mono-400 ml-2">({hashtag.volume})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-700 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.allRelated}</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b-2 border-mono-200 dark:border-mono-700">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-mono-700 dark:text-mono-300">{c.colHashtag}</th>
                      <th className="text-left py-3 px-4 font-semibold text-mono-700 dark:text-mono-300">{c.colVolume}</th>
                      <th className="text-left py-3 px-4 font-semibold text-mono-700 dark:text-mono-300">{c.colEngagement}</th>
                      <th className="text-left py-3 px-4 font-semibold text-mono-700 dark:text-mono-300">{c.colCompetition}</th>
                      <th className="text-left py-3 px-4 font-semibold text-mono-700 dark:text-mono-300">{c.colStatus}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.hashtags.map((hashtag, idx) => (
                      <tr key={idx} className="border-b border-mono-100 dark:border-mono-800 hover:bg-mono-50 dark:hover:bg-mono-800 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-semibold text-accent-600">#{hashtag.tag}</span>
                        </td>
                        <td className="py-3 px-4 text-mono-700 dark:text-mono-300">{hashtag.volume}</td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${getEngagementColor(hashtag.engagement)}`}>
                            {c.levelLabels[hashtag.engagement]}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCompetitionColor(hashtag.competition)}`}>
                            {c.levelLabels[hashtag.competition]}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {hashtag.trending && (
                            <span className="flex items-center gap-1 text-accent-600 text-sm font-medium">
                              <TrendingUp size={16} />
                              {c.trendingLabel}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {!results && (
          <div className="bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-700 rounded-lg shadow-sm p-12 text-center">
            <Search className="mx-auto text-mono-300 dark:text-mono-700 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-mono-700 dark:text-mono-300 mb-2">{c.startResearch}</h3>
            <p className="text-mono-500">{c.startBody}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function HashtagResearchTool() {
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
      toolSlug="hashtag-research"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <HashtagResearchToolContent />
    </ToolAccessGate>
  )
}
