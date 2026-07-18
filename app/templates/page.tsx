'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Filter, Heart, Copy, Clock, TrendingUp, Users, FileText, Hash, Lightbulb, List, X, Plus } from 'lucide-react';
import { extractTemplateText, getDifficultyColor } from '@/lib/template-utils'
import { getLocalStorageFavorites } from '@/lib/templates/favorites'
import TemplatePreviewModal from '@/components/templates/TemplatePreviewModal'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    loadingLibrary: 'Loading template library...',
    pageTitle: 'Content Template Library',
    pageDescription:
      'Discover professionally crafted templates for every platform, niche, and voice. Copy, customize, and create engaging content in minutes.',
    searchPlaceholder: 'Search templates by name, description, or tags...',
    filters: 'Filters',
    niche: 'Niche',
    platform: 'Platform',
    voice: 'Voice',
    type: 'Type',
    sortBy: 'Sort By',
    allNiches: 'All Niches',
    allPlatforms: 'All Platforms',
    allVoices: 'All Voices',
    allTypes: 'All Types',
    sortPopular: 'Most Popular',
    sortNewest: 'Newest First',
    sortMostUsed: 'Most Used',
    sortMostLiked: 'Most Liked',
    clearAllFilters: 'Clear All Filters',
    showingResults: (shown: number, total: number) => `Showing ${shown} of ${total} templates`,
    favorites: (count: number) => `Favorites (${count})`,
    uses: (count: number) => `${count} uses`,
    min: (count: number) => `${count} min`,
    maxChars: (count: number) => `Max: ${count} chars`,
    copy: 'Copy',
    copied: 'Copied!',
    noFavoritesYet: 'No favorites yet',
    noTemplatesFound: 'No templates found',
    noFavoritesHint:
      'Start adding templates to your favorites by clicking the heart icon on any template.',
    noTemplatesMatchSearch: (query: string) => `No templates match "${query}"`,
    noTemplatesMatchFilters: 'No templates match your current filters',
    browseAllTemplates: 'Browse All Templates',
    clearFilters: 'Clear Filters',
    loading: 'Loading...',
    loadMore: 'Load More Templates',
    copyFailed: 'Failed to copy template',
  },
  es: {
    loadingLibrary: 'Cargando biblioteca de plantillas...',
    pageTitle: 'Biblioteca de plantillas de contenido',
    pageDescription:
      'Descubre plantillas creadas por profesionales para cada plataforma, nicho y tono. Copia, personaliza y crea contenido atractivo en minutos.',
    searchPlaceholder: 'Buscar plantillas por nombre, descripción o etiquetas...',
    filters: 'Filtros',
    niche: 'Nicho',
    platform: 'Plataforma',
    voice: 'Tono',
    type: 'Tipo',
    sortBy: 'Ordenar por',
    allNiches: 'Todos los nichos',
    allPlatforms: 'Todas las plataformas',
    allVoices: 'Todos los tonos',
    allTypes: 'Todos los tipos',
    sortPopular: 'Más populares',
    sortNewest: 'Más recientes primero',
    sortMostUsed: 'Más usados',
    sortMostLiked: 'Más gustados',
    clearAllFilters: 'Borrar todos los filtros',
    showingResults: (shown: number, total: number) => `Mostrando ${shown} de ${total} plantillas`,
    favorites: (count: number) => `Favoritos (${count})`,
    uses: (count: number) => `${count} usos`,
    min: (count: number) => `${count} min`,
    maxChars: (count: number) => `Máx.: ${count} caracteres`,
    copy: 'Copiar',
    copied: '¡Copiado!',
    noFavoritesYet: 'Aún no hay favoritos',
    noTemplatesFound: 'No se encontraron plantillas',
    noFavoritesHint:
      'Empieza a añadir plantillas a tus favoritos haciendo clic en el icono del corazón en cualquier plantilla.',
    noTemplatesMatchSearch: (query: string) => `Ninguna plantilla coincide con "${query}"`,
    noTemplatesMatchFilters: 'Ninguna plantilla coincide con tus filtros actuales',
    browseAllTemplates: 'Ver todas las plantillas',
    clearFilters: 'Borrar filtros',
    loading: 'Cargando...',
    loadMore: 'Cargar más plantillas',
    copyFailed: 'No se pudo copiar la plantilla',
  },
}

interface Template {
  id: string
  name: string
  description: string
  template_data: any
  niche: string
  platform: string
  voice: string
  template_type: string
  usage_count: number
  likes_count: number
  tags: string[]
  difficulty_level: string
  estimated_time_minutes: number
  created_at: string
  niche_display: string
  niche_icon: string
  platform_display: string
  platform_icon: string
  platform_max_length: number | null
  voice_display: string
  voice_icon: string
  template_type_display: string
  template_type_icon: string
}

interface FilterOptions {
  niches: Array<{ name: string; display_name: string; icon: string }>
  platforms: Array<{ name: string; display_name: string; icon: string; max_length: number | null }>
  voices: Array<{ name: string; display_name: string; icon: string }>
  templateTypes: Array<{ name: string; display_name: string; icon: string }>
}

export default function TemplateLibraryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language } = useLanguage()
  const c = copy[language]
  
  const [templates, setTemplates] = useState<Template[]>([])
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    niches: [],
    platforms: [],
    voices: [],
    templateTypes: []
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    niche: 'all',
    platform: 'all',
    voice: 'all',
    template_type: 'all',
    sort_by: 'popular'
  })
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false
  })
  const [showFilters, setShowFilters] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  useEffect(() => {
    const urlNiche = searchParams.get('niche') || 'all'
    const urlPlatform = searchParams.get('platform') || 'all'
    const urlVoice = searchParams.get('voice') || 'all'
    const urlTemplateType = searchParams.get('template_type') || 'all'
    const urlSearch = searchParams.get('search') || ''
    const urlSortBy = searchParams.get('sort_by') || 'popular'

    setFilters({
      niche: urlNiche,
      platform: urlPlatform,
      voice: urlVoice,
      template_type: urlTemplateType,
      sort_by: urlSortBy
    })
    setSearchQuery(urlSearch)
  }, [searchParams])

  useEffect(() => {
    fetchTemplates()
    fetchFavorites()
  }, [filters, searchQuery])

  useEffect(() => {
    // Sync with localStorage on mount
    const localFavorites = getLocalStorageFavorites()
    setFavorites(new Set(localFavorites))
  }, [])

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/templates/favorites')
      if (response.ok) {
        const data = await response.json()
        const favoriteIds = data.favorites?.map((fav: any) => fav.template_id || fav.id) || []
        setFavorites(new Set(favoriteIds))
        
        // Also sync to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('template_favorites', JSON.stringify(favoriteIds))
        }
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
      // Fallback to localStorage
      if (typeof window !== 'undefined') {
        const localFavorites = getLocalStorageFavorites()
        setFavorites(new Set(localFavorites))
      }
    }
  }

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams()
      if (filters.niche !== 'all') params.set('niche', filters.niche)
      if (filters.platform !== 'all') params.set('platform', filters.platform)
      if (filters.voice !== 'all') params.set('voice', filters.voice)
      if (filters.template_type !== 'all') params.set('template_type', filters.template_type)
      if (searchQuery) params.set('search', searchQuery)
      if (filters.sort_by !== 'popular') params.set('sort_by', filters.sort_by)
      params.set('limit', pagination.limit.toString())
      params.set('offset', pagination.offset.toString())

      const response = await fetch(`/api/templates/public?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch templates')
      }

      const data = await response.json()
      
      setTemplates(data.templates || [])
      setFilterOptions(data.filterOptions || { niches: [], platforms: [], voices: [], templateTypes: [] })
      setPagination(data.pagination || { total: 0, limit: 20, offset: 0, hasMore: false })

    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateURL = (newFilters: Partial<typeof filters>, newSearch?: string) => {
    const params = new URLSearchParams()
    
    Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
      if (value !== 'all' && value !== 'popular') {
        params.set(key, value)
      }
    })
    
    if (newSearch !== undefined ? newSearch : searchQuery) {
      params.set('search', newSearch !== undefined ? newSearch : searchQuery)
    }
    
    const newUrl = `/templates${params.toString() ? '?' + params.toString() : ''}`
    router.push(newUrl, { scroll: false })
  }

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, offset: 0 }))
    updateURL(newFilters)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setPagination(prev => ({ ...prev, offset: 0 }))
    updateURL(filters, value)
  }

  const clearFilters = () => {
    const clearedFilters = {
      niche: 'all',
      platform: 'all',
      voice: 'all',
      template_type: 'all',
      sort_by: 'popular'
    }
    setFilters(clearedFilters)
    setSearchQuery('')
    setPagination(prev => ({ ...prev, offset: 0 }))
    updateURL(clearedFilters, '')
  }

  const copyTemplate = async (template: Template) => {
    try {
      await fetch('/api/templates/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template.id })
      })

      const templateText = extractTemplateText(template.template_data, template.template_type)
      await navigator.clipboard.writeText(templateText)
      
      setCopiedId(template.id)
      setTimeout(() => setCopiedId(null), 2000)
      
    } catch (error) {
      console.error('Error copying template:', error)
      alert(c.copyFailed)
    }
  }

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template)
    setIsPreviewOpen(true)
  }

  const handlePreviewCopy = async (template: Template) => {
    await copyTemplate(template)
  }

  const handleClosePreview = () => {
    setIsPreviewOpen(false)
    setPreviewTemplate(null)
  }

  const handleFavoriteToggle = (templateId: string, isFavorited: boolean) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (isFavorited) {
        newFavorites.add(templateId)
      } else {
        newFavorites.delete(templateId)
      }
      return newFavorites
    })
  }

  const getTemplateIcon = (templateType: string) => {
    const icons: Record<string, any> = {
      caption: FileText,
      hashtag: Hash,
      content_idea: Lightbulb,
      blog_outline: List,
      script: FileText,
      headline: FileText,
      description: FileText,
      bio: FileText
    }
    return icons[templateType] || FileText
  }

  if (loading && templates.length === 0) {
    return (
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto mb-4"></div>
          <p className="text-mono-600 dark:text-mono-400">{c.loadingLibrary}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950">
      {/* Header */}
      <div className="bg-white dark:bg-mono-900 border-b border-mono-200 dark:border-mono-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              {c.pageTitle}
            </h1>
            <p className="text-xl text-mono-600 dark:text-mono-400 max-w-3xl mx-auto">
              {c.pageDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-mono-900 rounded-lg shadow-sm p-6 mb-8 border border-mono-200 dark:border-mono-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={c.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-700 dark:text-mono-300 hover:bg-mono-100 dark:hover:bg-mono-700 flex items-center justify-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              {c.filters}
            </button>
          </div>

          {/* Filter Controls */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
            {/* Niche Filter */}
            <div>
              <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">{c.niche}</label>
              <select
                value={filters.niche}
                onChange={(e) => handleFilterChange('niche', e.target.value)}
                className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">{c.allNiches}</option>
                {filterOptions.niches.map(niche => (
                  <option key={niche.name} value={niche.name}>
                    {niche.icon} {niche.display_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Platform Filter */}
            <div>
              <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">{c.platform}</label>
              <select
                value={filters.platform}
                onChange={(e) => handleFilterChange('platform', e.target.value)}
                className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">{c.allPlatforms}</option>
                {filterOptions.platforms.map(platform => (
                  <option key={platform.name} value={platform.name}>
                    {platform.icon} {platform.display_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Voice Filter */}
            <div>
              <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">{c.voice}</label>
              <select
                value={filters.voice}
                onChange={(e) => handleFilterChange('voice', e.target.value)}
                className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">{c.allVoices}</option>
                {filterOptions.voices.map(voice => (
                  <option key={voice.name} value={voice.name}>
                    {voice.icon} {voice.display_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Template Type Filter */}
            <div>
              <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">{c.type}</label>
              <select
                value={filters.template_type}
                onChange={(e) => handleFilterChange('template_type', e.target.value)}
                className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">{c.allTypes}</option>
                {filterOptions.templateTypes.map(type => (
                  <option key={type.name} value={type.name}>
                    {type.icon} {type.display_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">{c.sortBy}</label>
              <select
                value={filters.sort_by}
                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="popular">{c.sortPopular}</option>
                <option value="newest">{c.sortNewest}</option>
                <option value="most_used">{c.sortMostUsed}</option>
                <option value="most_liked">{c.sortMostLiked}</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(filters.niche !== 'all' || filters.platform !== 'all' || filters.voice !== 'all' || 
            filters.template_type !== 'all' || searchQuery) && (
            <div className="mt-4">
              <button
                onClick={clearFilters}
                className="text-sm text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300"
              >
                {c.clearAllFilters}
              </button>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-mono-600 dark:text-mono-400">
              {c.showingResults(
                showFavoritesOnly ? templates.filter(t => favorites.has(t.id)).length : templates.length,
                pagination.total
              )}
            </p>
            {favorites.size > 0 && (
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center ${
                  showFavoritesOnly
                    ? 'bg-accent-600 text-white'
                    : 'bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 hover:bg-mono-200 dark:hover:bg-mono-700'
                }`}
              >
                <Heart className={`w-4 h-4 mr-1 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                {c.favorites(favorites.size)}
              </button>
            )}
          </div>
        </div>

        {/* Template Grid */}
        {templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates
              .filter(template => !showFavoritesOnly || favorites.has(template.id))
              .map((template) => {
              const TemplateIcon = getTemplateIcon(template.template_type)
              return (
                <div
                  key={template.id}
                  className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{template.template_type_icon}</span>
                      <h3 className="text-lg font-semibold text-mono-950 dark:text-mono-50">{template.name}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(template.difficulty_level)}`}>
                      {template.difficulty_level}
                    </span>
                  </div>
                  
                  <p className="text-mono-600 dark:text-mono-400 mb-4 text-sm line-clamp-2">
                    {template.description}
                  </p>

                  {/* Platform and Niche Info */}
                  <div className="flex items-center space-x-4 mb-3 text-sm text-mono-600 dark:text-mono-400">
                    <span className="flex items-center space-x-1">
                      <span>{template.platform_icon}</span>
                      <span>{template.platform_display}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>{template.niche_icon}</span>
                      <span>{template.niche_display}</span>
                    </span>
                  </div>

                  {/* Voice and Type Info */}
                  <div className="flex items-center space-x-4 mb-3 text-sm text-mono-600 dark:text-mono-400">
                    <span className="flex items-center space-x-1">
                      <span>{template.voice_icon}</span>
                      <span>{template.voice_display}</span>
                    </span>
                    <span>{template.template_type_display}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-mono-500 dark:text-mono-500 mb-4">
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{c.uses(template.usage_count)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{c.min(template.estimated_time_minutes)}</span>
                    </span>
                    {template.platform_max_length && (
                      <span className="text-xs bg-mono-100 dark:bg-mono-800 px-2 py-1 rounded">
                        {c.maxChars(template.platform_max_length)}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {template.tags && template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="px-2 py-1 border border-mono-300 dark:border-mono-700 text-mono-600 dark:text-mono-400 rounded text-xs">
                          +{template.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyTemplate(template)}
                      className="flex-1 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors flex items-center justify-center text-sm"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      {copiedId === template.id ? c.copied : c.copy}
                    </button>
                    <button className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 flex items-center justify-center text-sm text-mono-700 dark:text-mono-300">
                      <Heart className="w-4 h-4 mr-1" />
                      {template.likes_count}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-mono-100 dark:bg-mono-800 rounded-full flex items-center justify-center mx-auto mb-4">
              {showFavoritesOnly ? (
                <Heart className="w-8 h-8 text-mono-400" />
              ) : (
                <Search className="w-8 h-8 text-mono-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-mono-900 dark:text-mono-50 mb-2">
              {showFavoritesOnly ? c.noFavoritesYet : c.noTemplatesFound}
            </h3>
            <p className="text-mono-600 dark:text-mono-400 mb-4">
              {showFavoritesOnly 
                ? c.noFavoritesHint
                : searchQuery 
                  ? c.noTemplatesMatchSearch(searchQuery)
                  : c.noTemplatesMatchFilters}
            </p>
            {showFavoritesOnly ? (
              <button
                onClick={() => setShowFavoritesOnly(false)}
                className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
              >
                {c.browseAllTemplates}
              </button>
            ) : (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
              >
                {c.clearFilters}
              </button>
            )}
          </div>
        )}

        {/* Load More */}
        {pagination.hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => {
                const newOffset = pagination.offset + pagination.limit
                setPagination(prev => ({ ...prev, offset: newOffset }))
                fetchTemplates()
              }}
              disabled={loading}
              className="px-6 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-700 dark:text-mono-300 hover:bg-mono-100 dark:hover:bg-mono-700 transition-colors disabled:opacity-50"
            >
              {loading ? c.loading : c.loadMore}
            </button>
          </div>
        )}

        {/* Preview Modal */}
        <TemplatePreviewModal
          template={previewTemplate}
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          onCopy={handlePreviewCopy}
        />
      </div>
    </div>
  )
}
