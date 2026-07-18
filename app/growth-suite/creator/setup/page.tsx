'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext'

const contentTypeOptions = [
  'Fashion', 'Beauty', 'Lifestyle', 'Tech', 'Food', 'Travel', 'Fitness',
  'Photography', 'Art', 'Music', 'Gaming', 'Education', 'Business', 'Parenting'
]

const copy = {
  en: {
    title: 'Creator Profile Setup',
    subtitle: 'Complete your profile to start collaborating with brands',
    basicInfo: 'Basic Information',
    basicInfoDesc: 'Tell us about yourself and your content',
    uploadPhoto: 'Upload Photo',
    displayName: 'Display Name *',
    displayNamePlaceholder: 'Your creator name',
    location: 'Location',
    locationPlaceholder: 'City, Country',
    bio: 'Bio *',
    bioPlaceholder: 'Tell brands about yourself and your content...',
    primaryNiche: 'Primary Niche *',
    selectNiche: 'Select your primary niche',
    niches: {
      fashion: 'Fashion', beauty: 'Beauty', lifestyle: 'Lifestyle', tech: 'Tech',
      food: 'Food', travel: 'Travel', fitness: 'Fitness', business: 'Business',
    },
    contentTypes: 'Content Types',
    contentTypesDesc: 'Select the types of content you create',
    contentTypeLabels: {
      Fashion: 'Fashion', Beauty: 'Beauty', Lifestyle: 'Lifestyle', Tech: 'Tech',
      Food: 'Food', Travel: 'Travel', Fitness: 'Fitness', Photography: 'Photography',
      Art: 'Art', Music: 'Music', Gaming: 'Gaming', Education: 'Education',
      Business: 'Business', Parenting: 'Parenting',
    },
    socialMedia: 'Social Media',
    socialMediaDesc: 'Link your social media profiles',
    channelUrlPlaceholder: 'Channel URL',
    website: 'Website',
    websitePlaceholder: 'yourwebsite.com',
    audienceMetrics: 'Audience & Metrics',
    audienceMetricsDesc: 'Your current audience size and engagement',
    totalAudienceSize: 'Total Audience Size',
    selectRange: 'Select range',
    audienceRanges: {
      '1k-10k': '1K - 10K', '10k-50k': '10K - 50K', '50k-100k': '50K - 100K',
      '100k-500k': '100K - 500K', '500k-1m': '500K - 1M', '1m+': '1M+',
    },
    avgEngagementRate: 'Average Engagement Rate',
    pricingOptional: 'Pricing (Optional)',
    pricingDesc: 'Your typical rates for different types of collaborations',
    instagramPost: 'Instagram Post',
    instagramStory: 'Instagram Story',
    instagramReel: 'Instagram Reel',
    youtubeVideo: 'YouTube Video',
    cancel: 'Cancel',
    settingUp: 'Setting up...',
    completeSetup: 'Complete Setup',
    setupFailed: 'Setup failed',
  },
  es: {
    title: 'Configuración de Perfil de Creador',
    subtitle: 'Completa tu perfil para empezar a colaborar con marcas',
    basicInfo: 'Información Básica',
    basicInfoDesc: 'Cuéntanos sobre ti y tu contenido',
    uploadPhoto: 'Subir Foto',
    displayName: 'Nombre para Mostrar *',
    displayNamePlaceholder: 'Tu nombre de creador',
    location: 'Ubicación',
    locationPlaceholder: 'Ciudad, País',
    bio: 'Biografía *',
    bioPlaceholder: 'Cuéntale a las marcas sobre ti y tu contenido...',
    primaryNiche: 'Nicho Principal *',
    selectNiche: 'Selecciona tu nicho principal',
    niches: {
      fashion: 'Moda', beauty: 'Belleza', lifestyle: 'Estilo de Vida', tech: 'Tecnología',
      food: 'Comida', travel: 'Viajes', fitness: 'Fitness', business: 'Negocios',
    },
    contentTypes: 'Tipos de Contenido',
    contentTypesDesc: 'Selecciona los tipos de contenido que creas',
    contentTypeLabels: {
      Fashion: 'Moda', Beauty: 'Belleza', Lifestyle: 'Estilo de Vida', Tech: 'Tecnología',
      Food: 'Comida', Travel: 'Viajes', Fitness: 'Fitness', Photography: 'Fotografía',
      Art: 'Arte', Music: 'Música', Gaming: 'Videojuegos', Education: 'Educación',
      Business: 'Negocios', Parenting: 'Crianza',
    },
    socialMedia: 'Redes Sociales',
    socialMediaDesc: 'Vincula tus perfiles de redes sociales',
    channelUrlPlaceholder: 'URL del canal',
    website: 'Sitio Web',
    websitePlaceholder: 'tusitio.com',
    audienceMetrics: 'Audiencia y Métricas',
    audienceMetricsDesc: 'Tu tamaño de audiencia e interacción actual',
    totalAudienceSize: 'Tamaño Total de Audiencia',
    selectRange: 'Seleccionar rango',
    audienceRanges: {
      '1k-10k': '1K - 10K', '10k-50k': '10K - 50K', '50k-100k': '50K - 100K',
      '100k-500k': '100K - 500K', '500k-1m': '500K - 1M', '1m+': '1M+',
    },
    avgEngagementRate: 'Tasa de Interacción Promedio',
    pricingOptional: 'Precios (Opcional)',
    pricingDesc: 'Tus tarifas habituales para diferentes tipos de colaboraciones',
    instagramPost: 'Publicación de Instagram',
    instagramStory: 'Historia de Instagram',
    instagramReel: 'Reel de Instagram',
    youtubeVideo: 'Video de YouTube',
    cancel: 'Cancelar',
    settingUp: 'Configurando...',
    completeSetup: 'Completar Configuración',
    setupFailed: 'Error en la configuración',
  },
}

export default function CreatorSetupPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const c = copy[language]
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    niche: '',
    location: '',
    website: '',
    audienceSize: '',
    engagementRate: '',
    contentTypes: [] as string[],
    socialLinks: {
      instagram: '',
      youtube: '',
      twitter: '',
      tiktok: ''
    },
    pricing: {
      post: '',
      story: '',
      reel: '',
      video: ''
    },
    availability: 'available'
  })

  const handleContentTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(type)
        ? prev.contentTypes.filter(t => t !== type)
        : [...prev.contentTypes, type]
    }))
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }))
  }

  const handlePricingChange = (type: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [type]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/growth-suite/creator/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/growth-suite')
      } else {
        const error = await response.json()
        alert(error.error || c.setupFailed)
      }
    } catch (error) {
      alert(c.setupFailed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">{c.title}</h1>
          <p className="text-mono-600 dark:text-mono-400 mt-2">{c.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border border-mono-200 dark:border-mono-800 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">{c.basicInfo}</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">{c.basicInfoDesc}</p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-accent-600 flex items-center justify-center text-white text-2xl">
                  {formData.displayName.charAt(0).toUpperCase() || 'C'}
                </div>
                <button type="button" className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800">
                  <Camera className="w-4 h-4 inline mr-2" />
                  {c.uploadPhoto}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">{c.displayName}</label>
                  <input
                    id="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder={c.displayNamePlaceholder}
                    className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">{c.location}</label>
                  <input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder={c.locationPlaceholder}
                    className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">{c.bio}</label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder={c.bioPlaceholder}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 min-h-[100px]"
                  required
                />
              </div>

              <div>
                <label htmlFor="niche" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">{c.primaryNiche}</label>
                <select
                  id="niche"
                  value={formData.niche}
                  onChange={(e) => setFormData(prev => ({ ...prev, niche: e.target.value }))}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  required
                >
                  <option value="">{c.selectNiche}</option>
                  {Object.entries(c.niches).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border border-mono-200 dark:border-mono-800 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">{c.contentTypes}</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">{c.contentTypesDesc}</p>
            <div className="flex flex-wrap gap-2">
              {contentTypeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleContentTypeToggle(type)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.contentTypes.includes(type)
                      ? 'bg-accent-600 text-white hover:bg-accent-700'
                      : 'border border-mono-300 dark:border-mono-700 text-mono-700 dark:text-mono-300 hover:bg-mono-100 dark:hover:bg-mono-800'
                  }`}
                >
                  {c.contentTypeLabels[type as keyof typeof c.contentTypeLabels] || type}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-mono-200 dark:border-mono-800 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">{c.socialMedia}</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">{c.socialMediaDesc}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">
                  <Globe className="w-4 h-4" />
                  <span>Instagram</span>
                </label>
                <input
                  type="text"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                  placeholder="@username"
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">
                  <Globe className="w-4 h-4" />
                  <span>YouTube</span>
                </label>
                <input
                  type="text"
                  value={formData.socialLinks.youtube}
                  onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                  placeholder={c.channelUrlPlaceholder}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">
                  <Globe className="w-4 h-4" />
                  <span>Twitter</span>
                </label>
                <input
                  type="text"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  placeholder="@username"
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">
                  <Globe className="w-4 h-4" />
                  <span>{c.website}</span>
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder={c.websitePlaceholder}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>
            </div>
          </div>

          <div className="border border-mono-200 dark:border-mono-800 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">{c.audienceMetrics}</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">{c.audienceMetricsDesc}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="audienceSize" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">{c.totalAudienceSize}</label>
                <select
                  id="audienceSize"
                  value={formData.audienceSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, audienceSize: e.target.value }))}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                >
                  <option value="">{c.selectRange}</option>
                  {Object.entries(c.audienceRanges).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="engagementRate" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">{c.avgEngagementRate}</label>
                <input
                  id="engagementRate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.engagementRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, engagementRate: e.target.value }))}
                  placeholder="4.5"
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>
            </div>
          </div>

          <div className="border border-mono-200 dark:border-mono-800 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">{c.pricingOptional}</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">{c.pricingDesc}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">{c.instagramPost}</label>
                <input
                  type="number"
                  placeholder="500"
                  value={formData.pricing.post}
                  onChange={(e) => handlePricingChange('post', e.target.value)}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">{c.instagramStory}</label>
                <input
                  type="number"
                  placeholder="200"
                  value={formData.pricing.story}
                  onChange={(e) => handlePricingChange('story', e.target.value)}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">{c.instagramReel}</label>
                <input
                  type="number"
                  placeholder="800"
                  value={formData.pricing.reel}
                  onChange={(e) => handlePricingChange('reel', e.target.value)}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">{c.youtubeVideo}</label>
                <input
                  type="number"
                  placeholder="2000"
                  value={formData.pricing.video}
                  onChange={(e) => handlePricingChange('video', e.target.value)}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/growth-suite')}
              className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800"
            >
              {c.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? c.settingUp : c.completeSetup}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
