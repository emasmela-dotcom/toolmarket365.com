'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Instagram, Youtube, Twitter, Globe, Plus, X } from 'lucide-react'

export default function CreatorSetupPage() {
  const router = useRouter()
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

  const contentTypeOptions = [
    'Fashion', 'Beauty', 'Lifestyle', 'Tech', 'Food', 'Travel', 'Fitness', 
    'Photography', 'Art', 'Music', 'Gaming', 'Education', 'Business', 'Parenting'
  ]

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
        alert(error.error || 'Setup failed')
      }
    } catch (error) {
      alert('Setup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">Creator Profile Setup</h1>
          <p className="text-mono-600 dark:text-mono-400 mt-2">
            Complete your profile to start collaborating with brands
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="border border-mono-200 dark:border-mono-800 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">Basic Information</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">Tell us about yourself and your content</p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-accent-600 flex items-center justify-center text-white text-2xl">
                  {formData.displayName.charAt(0).toUpperCase() || 'C'}
                </div>
                <button type="button" className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800">
                  <Camera className="w-4 h-4 inline mr-2" />
                  Upload Photo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">Display Name *</label>
                  <input
                    id="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Your creator name"
                    className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">Location</label>
                  <input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, Country"
                    className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">Bio *</label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell brands about yourself and your content..."
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 min-h-[100px]"
                  required
                />
              </div>

              <div>
                <label htmlFor="niche" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">Primary Niche *</label>
                <select
                  id="niche"
                  value={formData.niche}
                  onChange={(e) => setFormData(prev => ({ ...prev, niche: e.target.value }))}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  required
                >
                  <option value="">Select your primary niche</option>
                  <option value="fashion">Fashion</option>
                  <option value="beauty">Beauty</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="tech">Tech</option>
                  <option value="food">Food</option>
                  <option value="travel">Travel</option>
                  <option value="fitness">Fitness</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content Types */}
          <div className="border border-mono-200 dark:border-mono-800 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">Content Types</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">Select the types of content you create</p>
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
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Social Media Links */}
          <div className="border border-mono-200 dark:border-mono-800 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">Social Media</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">Link your social media profiles</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">
                  <Instagram className="w-4 h-4" />
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
                  <Youtube className="w-4 h-4" />
                  <span>YouTube</span>
                </label>
                <input
                  type="text"
                  value={formData.socialLinks.youtube}
                  onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                  placeholder="Channel URL"
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">
                  <Twitter className="w-4 h-4" />
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
                  <span>Website</span>
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="yourwebsite.com"
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>
            </div>
          </div>

          {/* Audience & Metrics */}
          <div className="border border-mono-200 dark:border-mono-800 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">Audience & Metrics</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">Your current audience size and engagement</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="audienceSize" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">Total Audience Size</label>
                <select
                  id="audienceSize"
                  value={formData.audienceSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, audienceSize: e.target.value }))}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                >
                  <option value="">Select range</option>
                  <option value="1k-10k">1K - 10K</option>
                  <option value="10k-50k">10K - 50K</option>
                  <option value="50k-100k">50K - 100K</option>
                  <option value="100k-500k">100K - 500K</option>
                  <option value="500k-1m">500K - 1M</option>
                  <option value="1m+">1M+</option>
                </select>
              </div>

              <div>
                <label htmlFor="engagementRate" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">Average Engagement Rate</label>
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

          {/* Pricing */}
          <div className="border border-mono-200 dark:border-mono-800 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">Pricing (Optional)</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">Your typical rates for different types of collaborations</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">Instagram Post</label>
                <input
                  type="number"
                  placeholder="500"
                  value={formData.pricing.post}
                  onChange={(e) => handlePricingChange('post', e.target.value)}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">Instagram Story</label>
                <input
                  type="number"
                  placeholder="200"
                  value={formData.pricing.story}
                  onChange={(e) => handlePricingChange('story', e.target.value)}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">Instagram Reel</label>
                <input
                  type="number"
                  placeholder="800"
                  value={formData.pricing.reel}
                  onChange={(e) => handlePricingChange('reel', e.target.value)}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">YouTube Video</label>
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

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/growth-suite')}
              className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Setting up...' : 'Complete Setup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
