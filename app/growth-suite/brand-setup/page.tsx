'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Upload, Building2, Globe, DollarSign, Users, Target } from 'lucide-react';

const BUDGET_RANGES = [
  { value: 'under-1k', label: 'Under $1,000' },
  { value: '1k-5k', label: '$1,000 - $5,000' },
  { value: '5k-10k', label: '$5,000 - $10,000' },
  { value: '10k-25k', label: '$10,000 - $25,000' },
  { value: '25k-50k', label: '$25,000 - $50,000' },
  { value: '50k-plus', label: '$50,000+' }
]

const CREATOR_TYPES = [
  'Lifestyle',
  'Fashion',
  'Beauty',
  'Fitness',
  'Food',
  'Travel',
  'Tech',
  'Business',
  'Parenting',
  'Gaming',
  'Art',
  'Music'
]

const CAMPAIGN_TYPES = [
  'Sponsored Post',
  'Product Review',
  'Brand Ambassador',
  'Event Coverage',
  'Giveaway',
  'Tutorial',
  'Unboxing',
  'Story Series',
  'Reel/TikTok',
  'Blog Post',
  'YouTube Video',
  'Podcast'
]

export default function BrandSetupPage() {
  const router = useRouter()
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

    // TODO: Implement file upload API
    console.log('Logo upload not implemented yet')
    // const formData = new FormData()
    // formData.append('file', file)
    // const response = await fetch('/api/upload', { method: 'POST', body: formData })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!profile.name || !profile.email || !profile.companyName) {
      setError('Name, email, and company name are required')
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
        throw new Error(errorData.error || 'Failed to save profile')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      setError(error instanceof Error ? error.message : 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600 mx-auto mb-4"></div>
          <p className="text-mono-600 dark:text-mono-400">Loading brand profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-2">Brand Profile Setup</h1>
          <p className="text-mono-600 dark:text-mono-400">Create your brand profile to start collaborating with creators</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2 flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Basic Information</span>
            </h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">Tell us about your brand</p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">Brand Name *</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your brand name"
                  required
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:border-accent-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">Contact Email *</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="contact@yourbrand.com"
                  required
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:border-accent-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">Company Name *</label>
                <input
                  type="text"
                  value={profile.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Your company name"
                  required
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:border-accent-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">Website</label>
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:border-accent-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">Logo</label>
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
                      Upload Logo
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Budget & Preferences */}
          <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2 flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Budget & Preferences</span>
            </h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">Help us match you with the right creators</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-3">Budget Range *</label>
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
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-3 flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Preferred Creator Types</span>
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
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-3 flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Campaign Types</span>
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
                      {type}
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
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
