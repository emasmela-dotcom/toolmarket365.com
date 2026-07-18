'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Globe, Target, Users, DollarSign, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext'

const contentGoalsOptions = [
  'Brand Awareness', 'Lead Generation', 'Sales', 'Engagement',
  'Community Building', 'Product Launch', 'Event Promotion', 'User Generated Content'
]

const platformOptions = [
  'Instagram', 'YouTube', 'TikTok', 'Twitter', 'LinkedIn', 'Facebook', 'Pinterest', 'Snapchat'
]

const campaignTypeOptions = [
  'Sponsored Posts', 'Product Reviews', 'Giveaways', 'Brand Ambassadorship',
  'Event Coverage', 'Storytelling', 'Tutorials', 'Unboxing'
]

const copy = {
  en: {
    title: 'Brand Profile Setup',
    subtitle: 'Complete your brand profile to start collaborating with creators',
    basicInfo: 'Basic Information',
    basicInfoDesc: 'Tell us about your brand',
    uploadLogo: 'Upload Logo',
    brandName: 'Brand Name *',
    brandNamePlaceholder: 'Your brand name',
    industry: 'Industry *',
    selectIndustry: 'Select your industry',
    industries: {
      fashion: 'Fashion', beauty: 'Beauty', tech: 'Technology',
      food: 'Food & Beverage', health: 'Health & Wellness',
      home: 'Home & Garden', sports: 'Sports & Fitness', automotive: 'Automotive',
    },
    location: 'Location',
    locationPlaceholder: 'City, Country',
    website: 'Website',
    websitePlaceholder: 'www.yourbrand.com',
    brandDescription: 'Brand Description *',
    brandDescriptionPlaceholder: 'Describe your brand, products, and mission...',
    businessDetails: 'Business Details',
    businessDetailsDesc: 'Information about your company size and target market',
    companySize: 'Company Size',
    selectSize: 'Select size',
    companySizes: {
      '1-10': '1-10 employees', '11-50': '11-50 employees', '51-200': '51-200 employees',
      '201-500': '201-500 employees', '500+': '500+ employees',
    },
    annualRevenue: 'Annual Revenue',
    selectRange: 'Select range',
    revenueRanges: {
      '<1m': 'Under $1M', '1m-10m': '$1M - $10M', '10m-50m': '$10M - $50M',
      '50m-100m': '$50M - $100M', '100m+': '$100M+',
    },
    budgetRange: 'Budget Range',
    perCampaign: 'Per campaign',
    budgetRanges: {
      '<1k': 'Under $1K', '1k-5k': '$1K - $5K', '5k-10k': '$5K - $10K',
      '10k-25k': '$10K - $25K', '25k+': '$25K+',
    },
    contentGoals: 'Content Goals',
    contentGoalsDesc: 'What do you want to achieve with creator collaborations?',
    contentGoalLabels: {
      'Brand Awareness': 'Brand Awareness', 'Lead Generation': 'Lead Generation', Sales: 'Sales',
      Engagement: 'Engagement', 'Community Building': 'Community Building',
      'Product Launch': 'Product Launch', 'Event Promotion': 'Event Promotion',
      'User Generated Content': 'User Generated Content',
    },
    preferredPlatforms: 'Preferred Platforms',
    preferredPlatformsDesc: 'Which platforms do you prefer for collaborations?',
    campaignTypes: 'Campaign Types',
    campaignTypesDesc: 'What types of campaigns are you interested in?',
    campaignTypeLabels: {
      'Sponsored Posts': 'Sponsored Posts', 'Product Reviews': 'Product Reviews',
      Giveaways: 'Giveaways', 'Brand Ambassadorship': 'Brand Ambassadorship',
      'Event Coverage': 'Event Coverage', Storytelling: 'Storytelling',
      Tutorials: 'Tutorials', Unboxing: 'Unboxing',
    },
    cancel: 'Cancel',
    settingUp: 'Setting up...',
    completeSetup: 'Complete Setup',
    setupFailed: 'Setup failed',
  },
  es: {
    title: 'Configuración de Perfil de Marca',
    subtitle: 'Completa tu perfil de marca para empezar a colaborar con creadores',
    basicInfo: 'Información Básica',
    basicInfoDesc: 'Cuéntanos sobre tu marca',
    uploadLogo: 'Subir Logo',
    brandName: 'Nombre de Marca *',
    brandNamePlaceholder: 'Nombre de tu marca',
    industry: 'Industria *',
    selectIndustry: 'Selecciona tu industria',
    industries: {
      fashion: 'Moda', beauty: 'Belleza', tech: 'Tecnología',
      food: 'Alimentos y Bebidas', health: 'Salud y Bienestar',
      home: 'Hogar y Jardín', sports: 'Deportes y Fitness', automotive: 'Automotriz',
    },
    location: 'Ubicación',
    locationPlaceholder: 'Ciudad, País',
    website: 'Sitio Web',
    websitePlaceholder: 'www.tumarca.com',
    brandDescription: 'Descripción de la Marca *',
    brandDescriptionPlaceholder: 'Describe tu marca, productos y misión...',
    businessDetails: 'Detalles del Negocio',
    businessDetailsDesc: 'Información sobre el tamaño de tu empresa y mercado objetivo',
    companySize: 'Tamaño de la Empresa',
    selectSize: 'Seleccionar tamaño',
    companySizes: {
      '1-10': '1-10 empleados', '11-50': '11-50 empleados', '51-200': '51-200 empleados',
      '201-500': '201-500 empleados', '500+': '500+ empleados',
    },
    annualRevenue: 'Ingresos Anuales',
    selectRange: 'Seleccionar rango',
    revenueRanges: {
      '<1m': 'Menos de $1M', '1m-10m': '$1M - $10M', '10m-50m': '$10M - $50M',
      '50m-100m': '$50M - $100M', '100m+': '$100M+',
    },
    budgetRange: 'Rango de Presupuesto',
    perCampaign: 'Por campaña',
    budgetRanges: {
      '<1k': 'Menos de $1K', '1k-5k': '$1K - $5K', '5k-10k': '$5K - $10K',
      '10k-25k': '$10K - $25K', '25k+': '$25K+',
    },
    contentGoals: 'Objetivos de Contenido',
    contentGoalsDesc: '¿Qué quieres lograr con las colaboraciones con creadores?',
    contentGoalLabels: {
      'Brand Awareness': 'Reconocimiento de Marca', 'Lead Generation': 'Generación de Leads', Sales: 'Ventas',
      Engagement: 'Interacción', 'Community Building': 'Construcción de Comunidad',
      'Product Launch': 'Lanzamiento de Producto', 'Event Promotion': 'Promoción de Evento',
      'User Generated Content': 'Contenido Generado por Usuarios',
    },
    preferredPlatforms: 'Plataformas Preferidas',
    preferredPlatformsDesc: '¿En qué plataformas prefieres colaborar?',
    campaignTypes: 'Tipos de Campaña',
    campaignTypesDesc: '¿Qué tipos de campañas te interesan?',
    campaignTypeLabels: {
      'Sponsored Posts': 'Publicaciones Patrocinadas', 'Product Reviews': 'Reseñas de Producto',
      Giveaways: 'Sorteos', 'Brand Ambassadorship': 'Embajador de Marca',
      'Event Coverage': 'Cobertura de Evento', Storytelling: 'Narrativa',
      Tutorials: 'Tutoriales', Unboxing: 'Unboxing',
    },
    cancel: 'Cancelar',
    settingUp: 'Configurando...',
    completeSetup: 'Completar Configuración',
    setupFailed: 'Error en la configuración',
  },
}

export default function BrandSetupPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const c = copy[language]
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    brandName: '',
    description: '',
    industry: '',
    website: '',
    location: '',
    companySize: '',
    annualRevenue: '',
    targetAudience: '',
    contentGoals: [] as string[],
    budgetRange: '',
    preferredPlatforms: [] as string[],
    campaignTypes: [] as string[]
  })

  const handleContentGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      contentGoals: prev.contentGoals.includes(goal)
        ? prev.contentGoals.filter(g => g !== goal)
        : [...prev.contentGoals, goal]
    }))
  }

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      preferredPlatforms: prev.preferredPlatforms.includes(platform)
        ? prev.preferredPlatforms.filter(p => p !== platform)
        : [...prev.preferredPlatforms, platform]
    }))
  }

  const handleCampaignTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      campaignTypes: prev.campaignTypes.includes(type)
        ? prev.campaignTypes.filter(t => t !== type)
        : [...prev.campaignTypes, type]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/growth-suite/brand/setup', {
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
                  {formData.brandName.charAt(0).toUpperCase() || 'B'}
                </div>
                <button type="button" className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800">
                  <Camera className="w-4 h-4 inline mr-2" />
                  {c.uploadLogo}
                </button>
              </div>

              <div>
                <label htmlFor="brandName" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">{c.brandName}</label>
                <input
                  id="brandName"
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
                  placeholder={c.brandNamePlaceholder}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">{c.industry}</label>
                  <select
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                    required
                  >
                    <option value="">{c.selectIndustry}</option>
                    {Object.entries(c.industries).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">{c.location}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mono-500" />
                    <input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder={c.locationPlaceholder}
                      className="w-full px-3 py-2 pl-10 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">{c.website}</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mono-500" />
                  <input
                    id="website"
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder={c.websitePlaceholder}
                    className="w-full px-3 py-2 pl-10 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">{c.brandDescription}</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={c.brandDescriptionPlaceholder}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 min-h-[100px]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border border-mono-200 dark:border-mono-800 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">{c.businessDetails}</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">{c.businessDetailsDesc}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">
                  <Users className="w-4 h-4" />
                  <span>{c.companySize}</span>
                </label>
                <select
                  value={formData.companySize}
                  onChange={(e) => setFormData(prev => ({ ...prev, companySize: e.target.value }))}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                >
                  <option value="">{c.selectSize}</option>
                  {Object.entries(c.companySizes).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{c.annualRevenue}</span>
                </label>
                <select
                  value={formData.annualRevenue}
                  onChange={(e) => setFormData(prev => ({ ...prev, annualRevenue: e.target.value }))}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                >
                  <option value="">{c.selectRange}</option>
                  {Object.entries(c.revenueRanges).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">
                  <Target className="w-4 h-4" />
                  <span>{c.budgetRange}</span>
                </label>
                <select
                  value={formData.budgetRange}
                  onChange={(e) => setFormData(prev => ({ ...prev, budgetRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                >
                  <option value="">{c.perCampaign}</option>
                  {Object.entries(c.budgetRanges).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border border-mono-200 dark:border-mono-800 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">{c.contentGoals}</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">{c.contentGoalsDesc}</p>
            <div className="flex flex-wrap gap-2">
              {contentGoalsOptions.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => handleContentGoalToggle(goal)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.contentGoals.includes(goal)
                      ? 'bg-accent-600 text-white hover:bg-accent-700'
                      : 'border border-mono-300 dark:border-mono-700 text-mono-700 dark:text-mono-300 hover:bg-mono-100 dark:hover:bg-mono-800'
                  }`}
                >
                  {c.contentGoalLabels[goal as keyof typeof c.contentGoalLabels] || goal}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-mono-200 dark:border-mono-800 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">{c.preferredPlatforms}</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">{c.preferredPlatformsDesc}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {platformOptions.map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => handlePlatformToggle(platform)}
                  className={`px-3 py-2 rounded-lg text-center text-sm transition-colors ${
                    formData.preferredPlatforms.includes(platform)
                      ? 'bg-accent-600 text-white hover:bg-accent-700'
                      : 'border border-mono-300 dark:border-mono-700 text-mono-700 dark:text-mono-300 hover:bg-mono-100 dark:hover:bg-mono-800'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-mono-200 dark:border-mono-800 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">{c.campaignTypes}</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">{c.campaignTypesDesc}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {campaignTypeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleCampaignTypeToggle(type)}
                  className={`px-3 py-2 rounded-lg text-center text-sm transition-colors ${
                    formData.campaignTypes.includes(type)
                      ? 'bg-accent-600 text-white hover:bg-accent-700'
                      : 'border border-mono-300 dark:border-mono-700 text-mono-700 dark:text-mono-300 hover:bg-mono-100 dark:hover:bg-mono-800'
                  }`}
                >
                  {c.campaignTypeLabels[type as keyof typeof c.campaignTypeLabels] || type}
                </button>
              ))}
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
