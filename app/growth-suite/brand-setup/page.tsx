'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Upload, Building2, DollarSign, Users, Target } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext'

const BUDGET_RANGES = [
  { value: 'under-1k', labelKey: 'under1k' as const },
  { value: '1k-5k', labelKey: '1k5k' as const },
  { value: '5k-10k', labelKey: '5k10k' as const },
  { value: '10k-25k', labelKey: '10k25k' as const },
  { value: '25k-50k', labelKey: '25k50k' as const },
  { value: '50k-plus', labelKey: '50kPlus' as const },
]

const CREATOR_TYPES = [
  'Lifestyle', 'Fashion', 'Beauty', 'Fitness', 'Food', 'Travel',
  'Tech', 'Business', 'Parenting', 'Gaming', 'Art', 'Music'
]

const CAMPAIGN_TYPES = [
  'Sponsored Post', 'Product Review', 'Brand Ambassador', 'Event Coverage',
  'Giveaway', 'Tutorial', 'Unboxing', 'Story Series', 'Reel/TikTok',
  'Blog Post', 'YouTube Video', 'Podcast'
]

const copy = {
  en: {
    loading: 'Loading brand profile...',
    title: 'Brand Profile Setup',
    subtitle: 'Create your brand profile to start collaborating with creators',
    basicInfo: 'Basic Information',
    basicInfoDesc: 'Tell us about your brand',
    brandName: 'Brand Name *',
    brandNamePlaceholder: 'Your brand name',
    contactEmail: 'Contact Email *',
    contactEmailPlaceholder: 'contact@yourbrand.com',
    companyName: 'Company Name *',
    companyNamePlaceholder: 'Your company name',
    website: 'Website',
    websitePlaceholder: 'https://yourwebsite.com',
    logo: 'Logo',
    uploadLogo: 'Upload Logo',
    budgetPreferences: 'Budget & Preferences',
    budgetPreferencesDesc: 'Help us match you with the right creators',
    budgetRange: 'Budget Range *',
    preferredCreatorTypes: 'Preferred Creator Types',
    campaignTypes: 'Campaign Types',
    cancel: 'Cancel',
    saving: 'Saving...',
    createProfile: 'Create Profile',
    errorRequired: 'Name, email, and company name are required',
    errorSaveFailed: 'Failed to save profile',
    budgetLabels: {
      under1k: 'Under $1,000',
      '1k5k': '$1,000 - $5,000',
      '5k10k': '$5,000 - $10,000',
      '10k25k': '$10,000 - $25,000',
      '25k50k': '$25,000 - $50,000',
      '50kPlus': '$50,000+',
    },
    creatorTypeLabels: {
      Lifestyle: 'Lifestyle', Fashion: 'Fashion', Beauty: 'Beauty', Fitness: 'Fitness',
      Food: 'Food', Travel: 'Travel', Tech: 'Tech', Business: 'Business',
      Parenting: 'Parenting', Gaming: 'Gaming', Art: 'Art', Music: 'Music',
    },
    campaignTypeLabels: {
      'Sponsored Post': 'Sponsored Post', 'Product Review': 'Product Review',
      'Brand Ambassador': 'Brand Ambassador', 'Event Coverage': 'Event Coverage',
      Giveaway: 'Giveaway', Tutorial: 'Tutorial', Unboxing: 'Unboxing',
      'Story Series': 'Story Series', 'Reel/TikTok': 'Reel/TikTok',
      'Blog Post': 'Blog Post', 'YouTube Video': 'YouTube Video', Podcast: 'Podcast',
    },
  },
  es: {
    loading: 'Cargando perfil de marca...',
    title: 'Configuración de Perfil de Marca',
    subtitle: 'Crea tu perfil de marca para empezar a colaborar con creadores',
    basicInfo: 'Información Básica',
    basicInfoDesc: 'Cuéntanos sobre tu marca',
    brandName: 'Nombre de Marca *',
    brandNamePlaceholder: 'Nombre de tu marca',
    contactEmail: 'Correo de Contacto *',
    contactEmailPlaceholder: 'contacto@tumarca.com',
    companyName: 'Nombre de la Empresa *',
    companyNamePlaceholder: 'Nombre de tu empresa',
    website: 'Sitio Web',
    websitePlaceholder: 'https://tusitio.com',
    logo: 'Logo',
    uploadLogo: 'Subir Logo',
    budgetPreferences: 'Presupuesto y Preferencias',
    budgetPreferencesDesc: 'Ayúdanos a conectarte con los creadores adecuados',
    budgetRange: 'Rango de Presupuesto *',
    preferredCreatorTypes: 'Tipos de Creador Preferidos',
    campaignTypes: 'Tipos de Campaña',
    cancel: 'Cancelar',
    saving: 'Guardando...',
    createProfile: 'Crear Perfil',
    errorRequired: 'Nombre, correo y nombre de empresa son obligatorios',
    errorSaveFailed: 'Error al guardar el perfil',
    budgetLabels: {
      under1k: 'Menos de $1,000',
      '1k5k': '$1,000 - $5,000',
      '5k10k': '$5,000 - $10,000',
      '10k25k': '$10,000 - $25,000',
      '25k50k': '$25,000 - $50,000',
      '50kPlus': '$50,000+',
    },
    creatorTypeLabels: {
      Lifestyle: 'Estilo de Vida', Fashion: 'Moda', Beauty: 'Belleza', Fitness: 'Fitness',
      Food: 'Comida', Travel: 'Viajes', Tech: 'Tecnología', Business: 'Negocios',
      Parenting: 'Crianza', Gaming: 'Videojuegos', Art: 'Arte', Music: 'Música',
    },
    campaignTypeLabels: {
      'Sponsored Post': 'Publicación Patrocinada', 'Product Review': 'Reseña de Producto',
      'Brand Ambassador': 'Embajador de Marca', 'Event Coverage': 'Cobertura de Evento',
      Giveaway: 'Sorteo', Tutorial: 'Tutorial', Unboxing: 'Unboxing',
      'Story Series': 'Serie de Historias', 'Reel/TikTok': 'Reel/TikTok',
      'Blog Post': 'Entrada de Blog', 'YouTube Video': 'Video de YouTube', Podcast: 'Podcast',
    },
  },
}

export default function BrandSetupPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const c = copy[language]
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    companyName: '',
    website: '',
    budgetRange: '',
    preferredCreatorTypes: [] as string[],
    campaignTypes: [] as string[],
    logoUrl: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchExistingProfile()
  }, [])

  const fetchExistingProfile = async () => {
    try {
      const response = await fetch('/api/growth-suite/brands')
      if (response.ok) {
        const data = await response.json()
        if (data.brand) {
          setProfile({
            name: data.brand.name || '',
            email: data.brand.email || '',
            companyName: data.brand.company_name || '',
            website: data.brand.website || '',
            budgetRange: data.brand.budget_range || '',
            preferredCreatorTypes: data.brand.preferred_creator_types || [],
            campaignTypes: data.brand.campaign_types || [],
            logoUrl: data.brand.logo_url || ''
          })
        }
      }
    } catch (error) {
      console.error('Error fetching brand profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayField = (field: 'preferredCreatorTypes' | 'campaignTypes', value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    console.log('Logo upload not implemented yet')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!profile.name || !profile.email || !profile.companyName) {
      setError(c.errorRequired)
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/growth-suite/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          companyName: profile.companyName,
          website: profile.website,
          budgetRange: profile.budgetRange,
          preferredCreatorTypes: profile.preferredCreatorTypes,
          campaignTypes: profile.campaignTypes,
          logoUrl: profile.logoUrl
        })
      })

      if (response.ok) {
        router.push('/growth-suite')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || c.errorSaveFailed)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      setError(error instanceof Error ? error.message : c.errorSaveFailed)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600 mx-auto mb-4"></div>
          <p className="text-mono-600 dark:text-mono-400">{c.loading}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-2">{c.title}</h1>
          <p className="text-mono-600 dark:text-mono-400">{c.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2 flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>{c.basicInfo}</span>
            </h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">{c.basicInfoDesc}</p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">{c.brandName}</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={c.brandNamePlaceholder}
                  required
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:border-accent-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">{c.contactEmail}</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={c.contactEmailPlaceholder}
                  required
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:border-accent-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">{c.companyName}</label>
                <input
                  type="text"
                  value={profile.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder={c.companyNamePlaceholder}
                  required
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:border-accent-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">{c.website}</label>
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder={c.websitePlaceholder}
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:border-accent-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">{c.logo}</label>
                <div className="flex items-center space-x-4">
                  {profile.logoUrl && (
                    <div className="w-16 h-16 rounded-full bg-accent-100 dark:bg-accent-900 flex items-center justify-center text-accent-600 font-bold">
                      {profile.name?.charAt(0).toUpperCase() || 'B'}
                    </div>
                  )}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <span className="inline-block px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors">
                      <Upload className="w-4 h-4 inline mr-2" />
                      {c.uploadLogo}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2 flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>{c.budgetPreferences}</span>
            </h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">{c.budgetPreferencesDesc}</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-3">{c.budgetRange}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {BUDGET_RANGES.map((range) => (
                    <button
                      key={range.value}
                      type="button"
                      onClick={() => handleInputChange('budgetRange', range.value)}
                      className={`px-4 py-2 rounded-lg text-left transition-colors ${
                        profile.budgetRange === range.value
                          ? 'bg-accent-600 hover:bg-accent-700 text-white'
                          : 'border border-mono-300 dark:border-mono-700 text-mono-700 dark:text-mono-300 hover:bg-mono-100 dark:hover:bg-mono-800'
                      }`}
                    >
                      {c.budgetLabels[range.labelKey]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-3 flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{c.preferredCreatorTypes}</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {CREATOR_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleArrayField('preferredCreatorTypes', type)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        profile.preferredCreatorTypes.includes(type)
                          ? 'bg-accent-600 hover:bg-accent-700 text-white'
                          : 'border border-mono-300 dark:border-mono-700 text-mono-700 dark:text-mono-300 hover:bg-mono-100 dark:hover:bg-mono-800'
                      }`}
                    >
                      {c.creatorTypeLabels[type as keyof typeof c.creatorTypeLabels] || type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-3 flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>{c.campaignTypes}</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {CAMPAIGN_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleArrayField('campaignTypes', type)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        profile.campaignTypes.includes(type)
                          ? 'bg-accent-600 hover:bg-accent-700 text-white'
                          : 'border border-mono-300 dark:border-mono-700 text-mono-700 dark:text-mono-300 hover:bg-mono-100 dark:hover:bg-mono-800'
                      }`}
                    >
                      {c.campaignTypeLabels[type as keyof typeof c.campaignTypeLabels] || type}
                    </button>
                  ))}
                </div>
              </div>
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
              disabled={saving}
              className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? c.saving : c.createProfile}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
