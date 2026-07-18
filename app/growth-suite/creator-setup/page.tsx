'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Upload, Plus, X, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext'

const NICHES = [
  'Fashion & Beauty',
  'Fitness & Health',
  'Food & Cooking',
  'Travel & Lifestyle',
  'Technology & Gadgets',
  'Business & Finance',
  'Art & Design',
  'Photography',
  'Gaming',
  'Music & Entertainment',
  'Education & Learning',
  'Parenting & Family',
  'Sports & Outdoors',
  'Home & Garden',
  'Personal Development'
]

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram', icon: Globe },
  { value: 'youtube', label: 'YouTube', icon: Globe },
  { value: 'twitter', label: 'Twitter', icon: Globe },
  { value: 'facebook', label: 'Facebook', icon: Globe },
]

const copy = {
  en: {
    updateTitle: 'Update Creator Profile',
    createTitle: 'Create Creator Profile',
    subtitle: 'Set up your creator profile to connect with brands and opportunities',
    cancel: 'Cancel',
    profileInfo: 'Profile Information',
    uploadAvatar: 'Upload Avatar',
    displayName: 'Display Name *',
    displayNamePlaceholder: 'Your creator name',
    bio: 'Bio *',
    bioPlaceholder: 'Tell us about yourself and what you create...',
    characters: 'characters',
    niche: 'Niche *',
    selectNiche: 'Select your primary niche',
    location: 'Location',
    locationPlaceholder: 'City, Country',
    audienceSize: 'Total Audience Size',
    audienceSizePlaceholder: '100000',
    audienceSizeHint: 'Combined followers across all platforms',
    engagementRate: 'Average Engagement Rate (%)',
    engagementRatePlaceholder: '3.5',
    rateRange: 'Rate Range',
    rateRangePlaceholder: '$500 - $2000 per post',
    rateRangeHint: 'Your typical rates for brand collaborations',
    socialPlatforms: 'Social Platforms *',
    platform: 'Platform',
    selectPlatform: 'Select platform',
    handle: 'Handle',
    handlePlaceholder: '@username',
    followers: 'Followers',
    followersPlaceholder: '10000',
    addPlatform: 'Add Platform',
    portfolioUrl: 'Portfolio URL',
    portfolioPlaceholder: 'https://your-portfolio.com',
    saving: 'Saving...',
    updateProfile: 'Update Profile',
    createProfile: 'Create Profile',
    errorRequired: 'Display name, bio, and niche are required',
    errorPlatform: 'Please add at least one platform',
    errorSaveFailed: 'Failed to save profile',
    niches: {
      'Fashion & Beauty': 'Fashion & Beauty',
      'Fitness & Health': 'Fitness & Health',
      'Food & Cooking': 'Food & Cooking',
      'Travel & Lifestyle': 'Travel & Lifestyle',
      'Technology & Gadgets': 'Technology & Gadgets',
      'Business & Finance': 'Business & Finance',
      'Art & Design': 'Art & Design',
      Photography: 'Photography',
      Gaming: 'Gaming',
      'Music & Entertainment': 'Music & Entertainment',
      'Education & Learning': 'Education & Learning',
      'Parenting & Family': 'Parenting & Family',
      'Sports & Outdoors': 'Sports & Outdoors',
      'Home & Garden': 'Home & Garden',
      'Personal Development': 'Personal Development',
    },
  },
  es: {
    updateTitle: 'Actualizar Perfil de Creador',
    createTitle: 'Crear Perfil de Creador',
    subtitle: 'Configura tu perfil de creador para conectar con marcas y oportunidades',
    cancel: 'Cancelar',
    profileInfo: 'Información del Perfil',
    uploadAvatar: 'Subir Avatar',
    displayName: 'Nombre para Mostrar *',
    displayNamePlaceholder: 'Tu nombre de creador',
    bio: 'Biografía *',
    bioPlaceholder: 'Cuéntanos sobre ti y lo que creas...',
    characters: 'caracteres',
    niche: 'Nicho *',
    selectNiche: 'Selecciona tu nicho principal',
    location: 'Ubicación',
    locationPlaceholder: 'Ciudad, País',
    audienceSize: 'Tamaño Total de Audiencia',
    audienceSizePlaceholder: '100000',
    audienceSizeHint: 'Seguidores combinados en todas las plataformas',
    engagementRate: 'Tasa de Interacción Promedio (%)',
    engagementRatePlaceholder: '3.5',
    rateRange: 'Rango de Tarifas',
    rateRangePlaceholder: '$500 - $2000 por publicación',
    rateRangeHint: 'Tus tarifas habituales para colaboraciones con marcas',
    socialPlatforms: 'Plataformas Sociales *',
    platform: 'Plataforma',
    selectPlatform: 'Seleccionar plataforma',
    handle: 'Usuario',
    handlePlaceholder: '@usuario',
    followers: 'Seguidores',
    followersPlaceholder: '10000',
    addPlatform: 'Agregar Plataforma',
    portfolioUrl: 'URL del Portafolio',
    portfolioPlaceholder: 'https://tu-portafolio.com',
    saving: 'Guardando...',
    updateProfile: 'Actualizar Perfil',
    createProfile: 'Crear Perfil',
    errorRequired: 'Nombre, biografía y nicho son obligatorios',
    errorPlatform: 'Agrega al menos una plataforma',
    errorSaveFailed: 'Error al guardar el perfil',
    niches: {
      'Fashion & Beauty': 'Moda y Belleza',
      'Fitness & Health': 'Fitness y Salud',
      'Food & Cooking': 'Comida y Cocina',
      'Travel & Lifestyle': 'Viajes y Estilo de Vida',
      'Technology & Gadgets': 'Tecnología y Gadgets',
      'Business & Finance': 'Negocios y Finanzas',
      'Art & Design': 'Arte y Diseño',
      Photography: 'Fotografía',
      Gaming: 'Videojuegos',
      'Music & Entertainment': 'Música y Entretenimiento',
      'Education & Learning': 'Educación y Aprendizaje',
      'Parenting & Family': 'Crianza y Familia',
      'Sports & Outdoors': 'Deportes y Aire Libre',
      'Home & Garden': 'Hogar y Jardín',
      'Personal Development': 'Desarrollo Personal',
    },
  },
}

export default function CreatorSetupPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const c = copy[language]
  const [loading, setLoading] = useState(false)
  const [existingProfile, setExistingProfile] = useState<any>(null)
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    niche: '',
    location: '',
    audienceSize: '',
    engagementRate: '',
    rateRange: '',
    platforms: [] as Array<{ platform: string; handle: string; followers: string; url?: string }>,
    portfolioUrl: '',
    avatarUrl: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCreatorProfile()
  }, [])

  const fetchCreatorProfile = async () => {
    try {
      const response = await fetch('/api/growth-suite/creator-profile')
      if (response.ok) {
        const data = await response.json()
        if (data.profile) {
          setExistingProfile(data.profile)
          setFormData({
            displayName: data.profile.display_name || '',
            bio: data.profile.bio || '',
            niche: data.profile.niche || '',
            location: data.profile.location || '',
            audienceSize: data.profile.audience_size?.toString() || '',
            engagementRate: data.profile.engagement_rate?.toString() || '',
            rateRange: data.profile.rate_range || '',
            platforms: data.profile.platforms || [],
            portfolioUrl: data.profile.portfolio_url || '',
            avatarUrl: data.profile.avatar_url || ''
          })
        }
      }
    } catch (error) {
      console.error('Error fetching creator profile:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.displayName || !formData.bio || !formData.niche) {
      setError(c.errorRequired)
      return
    }

    if (formData.platforms.length === 0) {
      setError(c.errorPlatform)
      return
    }

    try {
      setLoading(true)
      
      const response = await fetch('/api/growth-suite/creator-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: formData.displayName,
          bio: formData.bio,
          niche: formData.niche,
          location: formData.location,
          audienceSize: formData.audienceSize ? parseInt(formData.audienceSize) : undefined,
          engagementRate: formData.engagementRate ? parseFloat(formData.engagementRate) : undefined,
          rateRange: formData.rateRange,
          platforms: formData.platforms,
          portfolioUrl: formData.portfolioUrl,
          avatarUrl: formData.avatarUrl
        })
      })

      if (response.ok) {
        router.push('/growth-suite')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || c.errorSaveFailed)
      }
    } catch (error) {
      console.error('Error saving creator profile:', error)
      setError(error instanceof Error ? error.message : c.errorSaveFailed)
    } finally {
      setLoading(false)
    }
  }

  const addPlatform = () => {
    setFormData({
      ...formData,
      platforms: [...formData.platforms, { platform: '', handle: '', followers: '' }]
    })
  }

  const removePlatform = (index: number) => {
    setFormData({
      ...formData,
      platforms: formData.platforms.filter((_, i) => i !== index)
    })
  }

  const updatePlatform = (index: number, field: string, value: string) => {
    const updated = [...formData.platforms]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, platforms: updated })
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">
            {existingProfile ? c.updateTitle : c.createTitle}
          </h1>
          <p className="text-mono-600 dark:text-mono-400 mt-1">
            {c.subtitle}
          </p>
        </div>
        <Link
          href="/growth-suite"
          className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
        >
          {c.cancel}
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.profileInfo}</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-accent-100 dark:bg-accent-900 flex items-center justify-center text-accent-600 font-bold text-2xl">
              {formData.displayName?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  console.log('File upload not implemented yet')
                }}
                className="hidden"
                id="avatar-upload"
              />
              <label htmlFor="avatar-upload">
                <span className="inline-block px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 inline mr-2" />
                  {c.uploadAvatar}
                </span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-mono-900 dark:text-mono-100 mb-2">
              {c.displayName}
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder={c.displayNamePlaceholder}
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-mono-900 dark:text-mono-100 mb-2">
              {c.bio}
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder={c.bioPlaceholder}
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 min-h-[120px] resize-none"
              required
              maxLength={500}
            />
            <p className="text-sm text-mono-500 mt-1">{formData.bio.length}/500 {c.characters}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-mono-900 dark:text-mono-100 mb-2">
              {c.niche}
            </label>
            <select
              value={formData.niche}
              onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              required
            >
              <option value="">{c.selectNiche}</option>
              {NICHES.map(niche => (
                <option key={niche} value={niche}>{c.niches[niche as keyof typeof c.niches] || niche}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-mono-900 dark:text-mono-100 mb-2">
              {c.location}
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder={c.locationPlaceholder}
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-mono-900 dark:text-mono-100 mb-2">
              {c.audienceSize}
            </label>
            <input
              type="number"
              value={formData.audienceSize}
              onChange={(e) => setFormData({ ...formData, audienceSize: e.target.value })}
              placeholder={c.audienceSizePlaceholder}
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
            />
            <p className="text-sm text-mono-500 mt-1">{c.audienceSizeHint}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-mono-900 dark:text-mono-100 mb-2">
              {c.engagementRate}
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.engagementRate}
              onChange={(e) => setFormData({ ...formData, engagementRate: e.target.value })}
              placeholder={c.engagementRatePlaceholder}
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-mono-900 dark:text-mono-100 mb-2">
              {c.rateRange}
            </label>
            <input
              type="text"
              value={formData.rateRange}
              onChange={(e) => setFormData({ ...formData, rateRange: e.target.value })}
              placeholder={c.rateRangePlaceholder}
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
            />
            <p className="text-sm text-mono-500 mt-1">{c.rateRangeHint}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-mono-900 dark:text-mono-100 mb-2">
              {c.socialPlatforms}
            </label>
            <div className="space-y-3">
              {formData.platforms.map((platform, index) => (
                <div key={index} className="border border-mono-200 dark:border-mono-700 rounded-lg p-4 bg-mono-50 dark:bg-mono-900">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-mono-600 dark:text-mono-400 mb-1">{c.platform}</label>
                      <select
                        value={platform.platform}
                        onChange={(e) => updatePlatform(index, 'platform', e.target.value)}
                        className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 text-sm"
                      >
                        <option value="">{c.selectPlatform}</option>
                        {PLATFORMS.map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-mono-600 dark:text-mono-400 mb-1">{c.handle}</label>
                      <input
                        type="text"
                        value={platform.handle}
                        onChange={(e) => updatePlatform(index, 'handle', e.target.value)}
                        placeholder={c.handlePlaceholder}
                        className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-mono-600 dark:text-mono-400 mb-1">{c.followers}</label>
                      <input
                        type="number"
                        value={platform.followers}
                        onChange={(e) => updatePlatform(index, 'followers', e.target.value)}
                        placeholder={c.followersPlaceholder}
                        className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 text-sm"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removePlatform(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addPlatform}
                className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                {c.addPlatform}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-mono-900 dark:text-mono-100 mb-2">
              {c.portfolioUrl}
            </label>
            <input
              type="url"
              value={formData.portfolioUrl}
              onChange={(e => setFormData({ ...formData, portfolioUrl: e.target.value }))}
              placeholder={c.portfolioPlaceholder}
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/growth-suite"
            className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
          >
            {c.cancel}
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50"
          >
            {loading ? c.saving : existingProfile ? c.updateProfile : c.createProfile}
          </button>
        </div>
      </form>
    </div>
  )
}
