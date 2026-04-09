'use client'

import { useState } from 'react'
import { Eye, Heart, Share2, Download, Copy, Edit, Trash2, X, FileText, Image, Video, Music, File } from 'lucide-react';

interface ContentItem {
  id: string
  title: string
  description: string | null
  content_type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'template'
  content_data: Record<string, any>
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  is_favorite: boolean
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  published_at: string | null
  view_count: number
  like_count: number
  share_count: number
}

interface ContentPreviewProps {
  item: ContentItem
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ContentPreview({ item, isOpen, onClose, onEdit, onDelete }: ContentPreviewProps) {
  const [activeTab, setActiveTab] = useState('content')

  const contentTypeIcons = {
    text: FileText,
    image: Image,
    video: Video,
    audio: Music,
    document: File,
    template: Copy
  }

  const contentTypeColors = {
    text: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    image: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    video: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    audio: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    document: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    template: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
  }

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    archived: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  const renderContentData = () => {
    switch (item.content_type) {
      case 'text':
        return (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {item.content_data?.text ? (
              <div className="whitespace-pre-wrap">{item.content_data.text}</div>
            ) : (
              <p className="text-mono-500">No text content</p>
            )}
          </div>
        )
      
      case 'image':
        return (
          <div className="space-y-4">
            {item.content_data?.image_url ? (
              <img 
                src={item.content_data.image_url} 
                alt={item.title}
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-mono-100 dark:bg-mono-800 rounded-lg flex items-center justify-center">
                <Image className="w-16 h-16 text-mono-400" />
              </div>
            )}
            {item.content_data?.caption && (
              <p className="text-mono-600 dark:text-mono-400">{item.content_data.caption}</p>
            )}
          </div>
        )
      
      case 'video':
        return (
          <div className="space-y-4">
            {item.content_data?.video_url ? (
              <video 
                src={item.content_data.video_url}
                controls
                className="w-full rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-mono-100 dark:bg-mono-800 rounded-lg flex items-center justify-center">
                <Video className="w-16 h-16 text-mono-400" />
              </div>
            )}
            {item.content_data?.description && (
              <p className="text-mono-600 dark:text-mono-400">{item.content_data.description}</p>
            )}
          </div>
        )
      
      case 'audio':
        return (
          <div className="space-y-4">
            {item.content_data?.audio_url ? (
              <audio 
                src={item.content_data.audio_url}
                controls
                className="w-full"
              />
            ) : (
              <div className="w-full h-32 bg-mono-100 dark:bg-mono-800 rounded-lg flex items-center justify-center">
                <Music className="w-16 h-16 text-mono-400" />
              </div>
            )}
            {item.content_data?.description && (
              <p className="text-mono-600 dark:text-mono-400">{item.content_data.description}</p>
            )}
          </div>
        )
      
      default:
        return (
          <pre className="bg-mono-100 dark:bg-mono-800 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(item.content_data, null, 2)}
          </pre>
        )
    }
  }

  const handleDuplicate = () => {
    // This would trigger a duplicate action
    alert('Duplicate functionality coming soon')
  }

  const handleExport = () => {
    // Export content as JSON
    const dataStr = JSON.stringify(item, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${item.title.replace(/[^a-z0-9]/gi, '_')}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description || '',
        url: window.location.href
      }).catch(() => {
        // Fallback to copy
        navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard')
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard')
    }
  }

  if (!isOpen) return null

  const IconComponent = contentTypeIcons[item.content_type]
  const typeColor = contentTypeColors[item.content_type]
  const statusColor = statusColors[item.status]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-mono-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-mono-200 dark:border-mono-700">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
              <div className="flex items-center space-x-2 flex-wrap">
                {item.is_favorite && (
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                )}
                <span className={`px-2 py-1 rounded text-xs font-medium ${typeColor}`}>
                  {item.content_type}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>
                  {item.status}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-mono-100 dark:hover:bg-mono-800 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="border-b border-mono-200 dark:border-mono-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab('content')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'content'
                    ? 'border-b-2 border-accent-600 text-accent-600'
                    : 'text-mono-600 dark:text-mono-400 hover:text-mono-950 dark:hover:text-mono-50'
                }`}
              >
                Content
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'details'
                    ? 'border-b-2 border-accent-600 text-accent-600'
                    : 'text-mono-600 dark:text-mono-400 hover:text-mono-950 dark:hover:text-mono-50'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-b-2 border-accent-600 text-accent-600'
                    : 'text-mono-600 dark:text-mono-400 hover:text-mono-950 dark:hover:text-mono-50'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('metadata')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'metadata'
                    ? 'border-b-2 border-accent-600 text-accent-600'
                    : 'text-mono-600 dark:text-mono-400 hover:text-mono-950 dark:hover:text-mono-50'
                }`}
              >
                Metadata
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'content' && (
              <div className="space-y-4">
                {item.description && (
                  <div className="p-4 bg-mono-50 dark:bg-mono-800 rounded-lg">
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-mono-700 dark:text-mono-300">{item.description}</p>
                  </div>
                )}
                
                <div className="p-4 border border-mono-200 dark:border-mono-700 rounded-lg">
                  <h4 className="font-semibold mb-4">Content</h4>
                  {renderContentData()}
                </div>

                {item.tags.length > 0 && (
                  <div className="p-4 bg-mono-50 dark:bg-mono-800 rounded-lg">
                    <h4 className="font-semibold mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-mono-200 dark:bg-mono-700 rounded text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Content Type</h4>
                    <p className="text-mono-700 dark:text-mono-300 capitalize">{item.content_type}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Status</h4>
                    <p className="text-mono-700 dark:text-mono-300 capitalize">{item.status}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Created</h4>
                    <p className="text-mono-700 dark:text-mono-300">
                      {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Updated</h4>
                    <p className="text-mono-700 dark:text-mono-300">
                      {new Date(item.updated_at).toLocaleDateString()} at {new Date(item.updated_at).toLocaleTimeString()}
                    </p>
                  </div>
                  {item.published_at && (
                    <div>
                      <h4 className="font-semibold mb-2">Published</h4>
                      <p className="text-mono-700 dark:text-mono-300">
                        {new Date(item.published_at).toLocaleDateString()} at {new Date(item.published_at).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {item.view_count || 0}
                    </div>
                    <div className="text-sm text-mono-600 dark:text-mono-400 mt-1">Views</div>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {item.like_count || 0}
                    </div>
                    <div className="text-sm text-mono-600 dark:text-mono-400 mt-1">Likes</div>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {item.share_count || 0}
                    </div>
                    <div className="text-sm text-mono-600 dark:text-mono-400 mt-1">Shares</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'metadata' && (
              <div className="space-y-4">
                <div className="p-4 bg-mono-50 dark:bg-mono-800 rounded-lg">
                  <h4 className="font-semibold mb-2">Metadata</h4>
                  <pre className="text-sm overflow-auto text-mono-700 dark:text-mono-300">
                    {JSON.stringify(item.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-mono-200 dark:border-mono-700 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDuplicate}
            className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors flex items-center space-x-2"
          >
            <Copy className="w-4 h-4" />
            <span>Duplicate</span>
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors flex items-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}
