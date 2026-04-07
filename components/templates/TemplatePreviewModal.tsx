'use client'

import { useState, useEffect } from 'react'
import { X, Copy, Tag, Calendar, Hash, BarChart3, Clock, User } from 'lucide-react'
import { extractTemplateText, getDifficultyColor } from '@/lib/template-utils'

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

interface TemplatePreviewModalProps {
  template: Template | null
  isOpen: boolean
  onClose: () => void
  onCopy: (template: Template) => void
}

export default function TemplatePreviewModal({
  template,
  isOpen,
  onClose,
  onCopy
}: TemplatePreviewModalProps) {
  const [copied, setCopied] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      document.body.style.overflow = 'hidden'
    } else {
      setTimeout(() => setIsAnimating(false), 300)
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleCopy = async () => {
    if (!template) return

    try {
      const templateText = extractTemplateText(template.template_data, template.template_type)
      await navigator.clipboard.writeText(templateText)
      setCopied(true)
      onCopy(template)
      
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isAnimating) return null

  const templateContent = template ? extractTemplateText(template.template_data, template.template_type) : ''
  const wordCount = templateContent.split(/\s+/).filter(word => word.length > 0).length
  const charCount = templateContent.length
  const lineCount = templateContent.split('\n').length

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-mono-900 rounded-lg shadow-2xl border border-mono-200 dark:border-mono-700 transform transition-all duration-300 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-mono-200 dark:border-mono-700">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
              {template?.name || 'Template Preview'}
            </h2>
            <p className="text-sm text-mono-600 dark:text-mono-400 mt-1">
              {template?.description || 'Preview and copy template content'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-mono-500 hover:text-mono-700 hover:bg-mono-100 dark:text-mono-400 dark:hover:text-mono-200 dark:hover:bg-mono-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row h-[calc(90vh-200px)]">
          {/* Metadata Sidebar */}
          <div className="lg:w-80 p-6 border-r border-mono-200 dark:border-mono-700 bg-mono-50 dark:bg-mono-800/50 overflow-y-auto">
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-sm font-semibold text-mono-700 dark:text-mono-300 mb-3 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Template Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-mono-500 dark:text-mono-400">Platform</label>
                    <p className="text-sm text-mono-900 dark:text-mono-50 flex items-center mt-1">
                      <span className="mr-1">{template?.platform_icon}</span>
                      {template?.platform_display}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-mono-500 dark:text-mono-400">Niche</label>
                    <p className="text-sm text-mono-900 dark:text-mono-50 flex items-center mt-1">
                      <span className="mr-1">{template?.niche_icon}</span>
                      {template?.niche_display}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-mono-500 dark:text-mono-400">Voice</label>
                    <p className="text-sm text-mono-900 dark:text-mono-50 flex items-center mt-1">
                      <span className="mr-1">{template?.voice_icon}</span>
                      {template?.voice_display}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-mono-500 dark:text-mono-400">Type</label>
                    <p className="text-sm text-mono-900 dark:text-mono-50 flex items-center mt-1">
                      <span className="mr-1">{template?.template_type_icon}</span>
                      {template?.template_type_display}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-mono-500 dark:text-mono-400">Difficulty</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(template?.difficulty_level || '')}`}>
                        {template?.difficulty_level}
                      </span>
                    </div>
                  </div>
                  {template?.platform_max_length && (
                    <div>
                      <label className="text-xs font-medium text-mono-500 dark:text-mono-400">Max Length</label>
                      <p className="text-sm text-mono-900 dark:text-mono-50 mt-1">
                        {template.platform_max_length} characters
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-mono-500 dark:text-mono-400">Estimated Time</label>
                    <p className="text-sm text-mono-900 dark:text-mono-50 flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {template?.estimated_time_minutes} minutes
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {template?.tags && template.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-mono-700 dark:text-mono-300 mb-3 flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-mono-100 text-mono-700 dark:bg-mono-800 dark:text-mono-300"
                      >
                        <Hash className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div>
                <h3 className="text-sm font-semibold text-mono-700 dark:text-mono-300 mb-3 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Statistics
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-mono-600 dark:text-mono-400">Usage</span>
                    <span className="text-mono-900 dark:text-mono-50 font-medium">{template?.usage_count || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-mono-600 dark:text-mono-400">Likes</span>
                    <span className="text-mono-900 dark:text-mono-50 font-medium">{template?.likes_count || 0}</span>
                  </div>
                </div>
              </div>

              {/* Created Date */}
              <div>
                <h3 className="text-sm font-semibold text-mono-700 dark:text-mono-300 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Created
                </h3>
                <p className="text-sm text-mono-900 dark:text-mono-50">
                  {template?.created_at ? new Date(template.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t border-mono-200 dark:border-mono-700">
                <button
                  onClick={handleCopy}
                  disabled={!template}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    copied
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-accent-600 hover:bg-accent-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {copied ? (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Content</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Content Preview */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-sm font-semibold text-mono-700 dark:text-mono-300 mb-4 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Content Preview
            </h3>
            
            <div className="bg-mono-50 dark:bg-mono-800 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
              <pre className="whitespace-pre-wrap text-sm text-mono-900 dark:text-mono-50 font-mono leading-relaxed">
                {templateContent || 'No content available'}
              </pre>
            </div>

            {/* Content Stats */}
            <div className="mt-4 flex items-center justify-between text-sm text-mono-500 dark:text-mono-400">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {wordCount} words
                </span>
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {charCount} characters
                </span>
              </div>
              <div className="text-xs">
                {lineCount} lines
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-mono-200 dark:border-mono-700 bg-mono-50 dark:bg-mono-800/30">
          <div className="text-sm text-mono-500 dark:text-mono-400">
            {template && (
              <span>
                Previewing template from <span className="font-medium">{template.niche_display}</span> niche
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-800 text-mono-700 dark:text-mono-300 hover:bg-mono-100 dark:hover:bg-mono-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              disabled={!template}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                copied
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-accent-600 hover:bg-accent-700 text-white'
              }`}
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Copy Content'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
