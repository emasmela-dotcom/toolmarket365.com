'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Upload, Plus, X, Globe } from 'lucide-react';

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

// lucide-react does not ship brand icons (Instagram, etc.); use Globe for all rows.
const PLATFORMS = [
  { value: 'instagram', label: 'Instagram', icon: Globe },
  { value: 'youtube', label: 'YouTube', icon: Globe },
  { value: 'twitter', label: 'Twitter', icon: Globe },
  { value: 'facebook', label: 'Facebook', icon: Globe },
]

export default function CreatorSetupPage() {
  const router = useRouter()
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
      setError('Display name, bio, and niche are required')
      return
    }

    if (formData.platforms.length === 0) {
      setError('Please add at least one platform')
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
        throw new Error(errorData.error || 'Failed to save profile')
      }
    } catch (error) {
      console.error('Error saving creator profile:', error)
      setError(error instanceof Error ? error.message : 'Failed to save profile')
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
            {existingProfile ? 'Update Creator Profile' : 'Create Creator Profile'}
          </h1>
          <p className="text-mono-600 dark:text-mono-400 mt-1">
            Set up your creator profile to connect with brands and opportunities
          </p>
        </div>
        <Link
          href="/growth-suite"
          className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">Profile Information</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Avatar */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-accent-100 dark:bg-accent-900 flex items-center justify-center text-accent-600 font-bold text-2xl">
              {formData.displayName?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  // Handle file upload - would need to implement upload API
                  console.log('File upload not implemented yet')
                }}
                className="hidden"
                id="avatar-upload"
              />
              <label htmlFor="avatar-upload">
                <span className="inline-block px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload Avatar
                </span>
              </label>
            </div>
          </div>

          {/* Display Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-mono-900 dark:text-mono-100 mb-2">
              Display Name *
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder="Your creator name"
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              required
            />
          </div>

          {/* Bio */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-mono-900 dark:text-mono-100 mb-2">
              Bio *
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself and what you create..."
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 min-h-[120px] resize-none"
              required
              maxLength={500}
            />
            <p className="text-sm text-mono-500 mt-1">{formData.bio.length}/500 characters</p>
          </div>

          {/* Niche */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-mono-900 dark:text-mono-100 mb-2">
              Niche *
            </label>
            <select
              value={formData.niche}
              onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              required
            >
              <option value="">Select your primary niche</option>
              {NICHES.map(niche => (
                <option key={niche} value={niche}>{niche}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-mono-900 dark:text-mono-100 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, Country"
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
            />
          </div>

          {/* Audience Size */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-mono-900 dark:text-mono-100 mb-2">
              Total Audience Size
            </label>
            <input
              type="number"
              value={formData.audienceSize}
              onChange={(e) => setFormData({ ...formData, audienceSize: e.target.value })}
              placeholder="100000"
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
            />
            <p className="text-sm text-mono-500 mt-1">Combined followers across all platforms</p>
          </div>

          {/* Engagement Rate */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-mono-900 dark:text-mono-100 mb-2">
              Average Engagement Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.engagementRate}
              onChange={(e) => setFormData({ ...formData, engagementRate: e.target.value })}
              placeholder="3.5"
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
            />
          </div>

          {/* Rate Range */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-mono-900 dark:text-mono-100 mb-2">
              Rate Range
            </label>
            <input
              type="text"
              value={formData.rateRange}
              onChange={(e) => setFormData({ ...formData, rateRange: e.target.value })}
              placeholder="$500 - $2000 per post"
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
            />
            <p className="text-sm text-mono-500 mt-1">Your typical rates for brand collaborations</p>
          </div>

          {/* Platforms */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-mono-900 dark:text-mono-100 mb-2">
              Social Platforms *
            </label>
            <div className="space-y-3">
              {formData.platforms.map((platform, index) => (
                <div key={index} className="border border-mono-200 dark:border-mono-700 rounded-lg p-4 bg-mono-50 dark:bg-mono-900">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-mono-600 dark:text-mono-400 mb-1">Platform</label>
                      <select
                        value={platform.platform}
                        onChange={(e) => updatePlatform(index, 'platform', e.target.value)}
                        className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 text-sm"
                      >
                        <option value="">Select platform</option>
                        {PLATFORMS.map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-mono-600 dark:text-mono-400 mb-1">Handle</label>
                      <input
                        type="text"
                        value={platform.handle}
                        onChange={(e) => updatePlatform(index, 'handle', e.target.value)}
                        placeholder="@username"
                        className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-mono-600 dark:text-mono-400 mb-1">Followers</label>
                      <input
                        type="number"
                        value={platform.followers}
                        onChange={(e) => updatePlatform(index, 'followers', e.target.value)}
                        placeholder="10000"
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
                Add Platform
              </button>
            </div>
          </div>

          {/* Portfolio URL */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-mono-900 dark:text-mono-100 mb-2">
              Portfolio URL
            </label>
            <input
              type="url"
              value={formData.portfolioUrl}
              onChange={(e => setFormData({ ...formData, portfolioUrl: e.target.value }))}
              placeholder="https://your-portfolio.com"
              className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
            />
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
            disabled={loading}
            className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : existingProfile ? 'Update Profile' : 'Create Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}
