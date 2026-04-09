'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, X, Eye, Plus, Trash2 } from 'lucide-react';
import { extractTemplateText } from '@/lib/template-utils'

interface FilterOptions {
  niches: Array<{ name: string; display_name: string; icon: string }>
  platforms: Array<{ name: string; display_name: string; icon: string; max_length: number | null }>
  voices: Array<{ name: string; display_name: string; icon: string }>
  templateTypes: Array<{ name: string; display_name: string; icon: string }>
}

export default function CreateTemplatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    niches: [],
    platforms: [],
    voices: [],
    templateTypes: []
  })

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    niche: 'general',
    platform: 'universal',
    voice: 'professional',
    template_type: 'caption',
    difficulty_level: 'beginner',
    estimated_time_minutes: 15,
    tags: [] as string[],
    is_public: false,
    template_data: {
      caption: '',
      text: '',
      hashtags: [] as string[],
      title: '',
      introduction: '',
      call_to_action: '',
      best_posting_time: '',
      idea: ''
    }
  })

  const [newTag, setNewTag] = useState('')
  const [newHashtag, setNewHashtag] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    fetchFilterOptions()
  }, [])

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/templates/public?limit=1')
      if (response.ok) {
        const data = await response.json()
        setFilterOptions(data.filterOptions || { niches: [], platforms: [], voices: [], templateTypes: [] })
      }
    } catch (error) {
      console.error('Error fetching filter options:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleTemplateDataChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      template_data: {
        ...prev.template_data,
        [field]: value
      }
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const addHashtag = () => {
    if (newHashtag.trim() && !formData.template_data.hashtags.includes(newHashtag.trim())) {
      handleTemplateDataChange('hashtags', [...formData.template_data.hashtags, newHashtag.trim()])
      setNewHashtag('')
    }
  }

  const removeHashtag = (hashtag: string) => {
    handleTemplateDataChange('hashtags', formData.template_data.hashtags.filter(h => h !== hashtag))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Template name is required')
      return false
    }
    if (formData.name.length < 3) {
      setError('Template name must be at least 3 characters')
      return false
    }
    if (!formData.description.trim()) {
      setError('Description is required')
      return false
    }
    if (formData.description.length < 10) {
      setError('Description must be at least 10 characters')
      return false
    }
    
    // Validate template data based on type
    const templateText = extractTemplateText(formData.template_data, formData.template_type)
    if (!templateText.trim()) {
      setError('Template content is required')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/templates/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          niche: formData.niche,
          platform: formData.platform,
          voice: formData.voice,
          template_type: formData.template_type,
          difficulty_level: formData.difficulty_level,
          estimated_time_minutes: formData.estimated_time_minutes,
          tags: formData.tags,
          is_public: formData.is_public,
          category: 'content_creation',
          template_data: formData.template_data
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/templates')
        }, 1500)
      } else {
        setError(result.error || 'Failed to create template')
      }
    } catch (error) {
      console.error('Error creating template:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getTemplatePreview = () => {
    return extractTemplateText(formData.template_data, formData.template_type)
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">Create Template</h1>
            <p className="text-mono-600 dark:text-mono-400 mt-1">Design a reusable template for content creation</p>
          </div>
          <button
            onClick={() => router.push('/templates')}
            className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-700 dark:text-mono-300 hover:bg-mono-100 dark:hover:bg-mono-700 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200">
            Template created successfully! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-mono-900 rounded-lg shadow-sm p-6 border border-mono-200 dark:border-mono-700">
            <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
                  Template Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  placeholder="e.g., Instagram Product Launch Post"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  placeholder="Describe what this template is for and how to use it..."
                />
              </div>

              {/* Niche and Platform */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="niche" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
                    Niche *
                  </label>
                  <select
                    id="niche"
                    name="niche"
                    value={formData.niche}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    {filterOptions.niches.map(niche => (
                      <option key={niche.name} value={niche.name}>
                        {niche.icon} {niche.display_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="platform" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
                    Platform *
                  </label>
                  <select
                    id="platform"
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    {filterOptions.platforms.map(platform => (
                      <option key={platform.name} value={platform.name}>
                        {platform.icon} {platform.display_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Voice and Template Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="voice" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
                    Voice/Tone *
                  </label>
                  <select
                    id="voice"
                    name="voice"
                    value={formData.voice}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    {filterOptions.voices.map(voice => (
                      <option key={voice.name} value={voice.name}>
                        {voice.icon} {voice.display_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="template_type" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
                    Template Type *
                  </label>
                  <select
                    id="template_type"
                    name="template_type"
                    value={formData.template_type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    {filterOptions.templateTypes.map(type => (
                      <option key={type.name} value={type.name}>
                        {type.icon} {type.display_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Difficulty and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="difficulty_level" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
                    Difficulty Level *
                  </label>
                  <select
                    id="difficulty_level"
                    name="difficulty_level"
                    value={formData.difficulty_level}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="estimated_time_minutes" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
                    Estimated Time (minutes) *
                  </label>
                  <input
                    type="number"
                    id="estimated_time_minutes"
                    name="estimated_time_minutes"
                    value={formData.estimated_time_minutes}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    placeholder="Add a tag..."
                    className="flex-1 px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-mono-500 hover:text-mono-700 dark:hover:text-mono-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Public/Private */}
              <div className="flex items-center justify-between p-4 bg-mono-50 dark:bg-mono-800 rounded-lg">
                <div>
                  <label htmlFor="is_public" className="block text-sm font-medium text-mono-700 dark:text-mono-300">
                    Make Template Public
                  </label>
                  <p className="text-xs text-mono-500 dark:text-mono-400 mt-1">
                    Public templates can be discovered and used by other users
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="is_public"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleChange}
                  className="w-5 h-5 rounded"
                />
              </div>
            </div>
          </div>

          {/* Template Content */}
          <div className="bg-white dark:bg-mono-900 rounded-lg shadow-sm p-6 border border-mono-200 dark:border-mono-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-mono-950 dark:text-mono-50">Template Content</h2>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors flex items-center gap-2 text-sm"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>

            {showPreview ? (
              <div className="space-y-4">
                <div className="bg-mono-50 dark:bg-mono-800 rounded-lg p-4 border border-mono-200 dark:border-mono-700">
                  <pre className="whitespace-pre-wrap text-sm text-mono-900 dark:text-mono-50 font-mono">
                    {getTemplatePreview() || 'No content to preview'}
                  </pre>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="text-sm text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300"
                >
                  Edit Template
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Caption/Text */}
                {(formData.template_type === 'caption' || formData.template_type === 'script' || formData.template_type === 'description' || formData.template_type === 'bio') && (
                  <div>
                    <label htmlFor="caption" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
                      {formData.template_type === 'caption' ? 'Caption' : formData.template_type === 'script' ? 'Script' : formData.template_type === 'description' ? 'Description' : 'Bio'} *
                    </label>
                    <textarea
                      id="caption"
                      value={formData.template_data.caption || formData.template_data.text || ''}
                      onChange={(e) => {
                        if (formData.template_type === 'caption') {
                          handleTemplateDataChange('caption', e.target.value)
                        } else {
                          handleTemplateDataChange('text', e.target.value)
                        }
                      }}
                      required
                      rows={8}
                      className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500 font-mono text-sm"
                      placeholder="Enter your template content here. Use [VARIABLE] for placeholders..."
                    />
                  </div>
                )}

                {/* Blog Outline */}
                {formData.template_type === 'blog_outline' && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={formData.template_data.title || ''}
                        onChange={(e) => handleTemplateDataChange('title', e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                        placeholder="Blog post title..."
                      />
                    </div>
                    <div>
                      <label htmlFor="introduction" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
                        Introduction *
                      </label>
                      <textarea
                        id="introduction"
                        value={formData.template_data.introduction || ''}
                        onChange={(e) => handleTemplateDataChange('introduction', e.target.value)}
                        required
                        rows={6}
                        className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                        placeholder="Introduction paragraph..."
                      />
                    </div>
                  </div>
                )}

                {/* Content Idea */}
                {formData.template_type === 'content_idea' && (
                  <div>
                    <label htmlFor="idea" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
                      Content Idea *
                    </label>
                    <textarea
                      id="idea"
                      value={formData.template_data.idea || formData.template_data.title || ''}
                      onChange={(e) => handleTemplateDataChange('idea', e.target.value)}
                      required
                      rows={6}
                      className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="Describe your content idea..."
                    />
                  </div>
                )}

                {/* Hashtags */}
                {formData.template_type === 'hashtag' && (
                  <div>
                    <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
                      Hashtags *
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newHashtag}
                        onChange={(e) => setNewHashtag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addHashtag()
                          }
                        }}
                        placeholder="Add a hashtag (e.g., #fitness)"
                        className="flex-1 px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      />
                      <button
                        type="button"
                        onClick={addHashtag}
                        className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {formData.template_data.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.template_data.hashtags.map(hashtag => (
                          <span
                            key={hashtag}
                            className="px-3 py-1 bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 rounded-full text-sm flex items-center gap-2"
                          >
                            {hashtag}
                            <button
                              type="button"
                              onClick={() => removeHashtag(hashtag)}
                              className="text-mono-500 hover:text-mono-700 dark:hover:text-mono-200"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Additional Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="call_to_action" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
                      Call to Action
                    </label>
                    <input
                      type="text"
                      id="call_to_action"
                      value={formData.template_data.call_to_action || ''}
                      onChange={(e) => handleTemplateDataChange('call_to_action', e.target.value)}
                      className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="e.g., Click the link in bio"
                    />
                  </div>
                  <div>
                    <label htmlFor="best_posting_time" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
                      Best Posting Time
                    </label>
                    <input
                      type="text"
                      id="best_posting_time"
                      value={formData.template_data.best_posting_time || ''}
                      onChange={(e) => handleTemplateDataChange('best_posting_time', e.target.value)}
                      className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-800 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="e.g., 6-8 AM or 6-8 PM"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/templates')}
              className="px-6 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-700 dark:text-mono-300 hover:bg-mono-100 dark:hover:bg-mono-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Template
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
