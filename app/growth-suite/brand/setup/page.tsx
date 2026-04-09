'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Building2, Globe, Target, Users, DollarSign, MapPin, Plus, X } from 'lucide-react';

export default function BrandSetupPage() {
  const router = useRouter()
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
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">Brand Profile Setup</h1>
          <p className="text-mono-600 dark:text-mono-400 mt-2">
            Complete your brand profile to start collaborating with creators
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="border border-mono-200 dark:border-mono-800 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">Basic Information</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">Tell us about your brand</p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-accent-600 flex items-center justify-center text-white text-2xl">
                  {formData.brandName.charAt(0).toUpperCase() || 'B'}
                </div>
                <button type="button" className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800">
                  <Camera className="w-4 h-4 inline mr-2" />
                  Upload Logo
                </button>
              </div>

              <div>
                <label htmlFor="brandName" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">Brand Name *</label>
                <input
                  id="brandName"
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
                  placeholder="Your brand name"
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">Industry *</label>
                  <select
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                    required
                  >
                    <option value="">Select your industry</option>
                    <option value="fashion">Fashion</option>
                    <option value="beauty">Beauty</option>
                    <option value="tech">Technology</option>
                    <option value="food">Food & Beverage</option>
                    <option value="health">Health & Wellness</option>
                    <option value="home">Home & Garden</option>
                    <option value="sports">Sports & Fitness</option>
                    <option value="automotive">Automotive</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mono-500" />
                    <input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country"
                      className="w-full px-3 py-2 pl-10 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mono-500" />
                  <input
                    id="website"
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="www.yourbrand.com"
                    className="w-full px-3 py-2 pl-10 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">Brand Description *</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your brand, products, and mission..."
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 min-h-[100px]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="border border-mono-200 dark:border-mono-800 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">Business Details</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">Information about your company size and target market</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">
                  <Users className="w-4 h-4" />
                  <span>Company Size</span>
                </label>
                <select
                  value={formData.companySize}
                  onChange={(e) => setFormData(prev => ({ ...prev, companySize: e.target.value }))}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span>Annual Revenue</span>
                </label>
                <select
                  value={formData.annualRevenue}
                  onChange={(e) => setFormData(prev => ({ ...prev, annualRevenue: e.target.value }))}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                >
                  <option value="">Select range</option>
                  <option value="<1m">Under $1M</option>
                  <option value="1m-10m">$1M - $10M</option>
                  <option value="10m-50m">$10M - $50M</option>
                  <option value="50m-100m">$50M - $100M</option>
                  <option value="100m+">$100M+</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">
                  <Target className="w-4 h-4" />
                  <span>Budget Range</span>
                </label>
                <select
                  value={formData.budgetRange}
                  onChange={(e) => setFormData(prev => ({ ...prev, budgetRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                >
                  <option value="">Per campaign</option>
                  <option value="<1k">Under $1K</option>
                  <option value="1k-5k">$1K - $5K</option>
                  <option value="5k-10k">$5K - $10K</option>
                  <option value="10k-25k">$10K - $25K</option>
                  <option value="25k+">$25K+</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content Goals */}
          <div className="border border-mono-200 dark:border-mono-800 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">Content Goals</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">What do you want to achieve with creator collaborations?</p>
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
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Platforms */}
          <div className="border border-mono-200 dark:border-mono-800 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">Preferred Platforms</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">Which platforms do you prefer for collaborations?</p>
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

          {/* Campaign Types */}
          <div className="border border-mono-200 dark:border-mono-800 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
            <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">Campaign Types</h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">What types of campaigns are you interested in?</p>
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
                  {type}
                </button>
              ))}
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
