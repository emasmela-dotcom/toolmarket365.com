'use client'

import { useState } from 'react'
import { 
  Eye, 
  Download, 
  Share2, 
  Copy, 
  X,
  FileText,
  ImageIcon,
  Video,
  Music,
  File,
  ExternalLink,
  Calendar,
  User,
  Tag
} from 'lucide-react'

interface ContentViewerProps {
  content: ContentItem
  isOpen: boolean
  onClose: () => void
}

interface ContentItem {
  id: string
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'url'
  title: string
  content: string
  description?: string
  metadata?: any
  url?: string
  thumbnail_url?: string
}

export function ContentViewer({ content, isOpen, onClose }: ContentViewerProps) {
  const [activeTab, setActiveTab] = useState('content')

  if (!isOpen) return null

  const getContentIcon = (type: string) => {
    const icons = {
      text: FileText,
      image: ImageIcon,
      video: Video,
      audio: Music,
      document: File,
      url: ExternalLink
    }
    return icons[type as keyof typeof icons] || File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(content.content)
    } catch (err) {
      console.error('Failed to copy content:', err)
    }
  }

  const renderContent = () => {
    const Icon = getContentIcon(content.type)

    switch (content.type) {
      case 'text':
        return (
          <div className="whitespace-pre-wrap text-sm text-gray-700">
            {content.content}
          </div>
        )

      case 'image':
        return (
          <div className="space-y-4">
            {content.thumbnail_url && (
              <img 
                src={content.thumbnail_url} 
                alt={content.title}
                className="w-full max-h-96 object-contain rounded-lg"
              />
            )}
          </div>
        )

      case 'video':
        return (
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              {content.url ? (
                <video 
                  src={content.url} 
                  controls 
                  className="w-full h-full"
                  poster={content.thumbnail_url}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  <Video className="w-16 h-16 opacity-50" />
                </div>
              )}
            </div>
          </div>
        )

      case 'audio':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
              <Music className="w-16 h-16 text-gray-400" />
            </div>
            {content.url && (
              <audio controls className="w-full">
                <source src={content.url} />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        )

      case 'document':
        return (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 flex items-center space-x-4">
              <File className="w-12 h-12 text-blue-500" />
              <div>
                <h3 className="font-semibold">{content.title}</h3>
                {content.metadata?.size && (
                  <p className="text-sm text-gray-500">
                    Size: {formatFileSize(content.metadata.size)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )

      case 'url':
        return (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <a 
                href={content.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {content.url}
              </a>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{content.title}</h2>
              {content.description && (
                <p className="text-sm text-gray-500">{content.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {content.type === 'text' && (
              <button
                onClick={handleCopyContent}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Copy content"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
            
            {content.url && content.type !== 'text' && (
              <a
                href={content.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </a>
            )}
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b flex">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'content'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Content
          </button>
          {content.metadata && Object.keys(content.metadata).length > 0 && (
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'details'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              Details
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'content' && renderContent()}
          
          {activeTab === 'details' && (
            <div className="space-y-4">
              {content.metadata?.author && (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    <span className="font-medium">Author:</span> {content.metadata.author}
                  </span>
                </div>
              )}
              
              {content.metadata?.createdAt && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    <span className="font-medium">Created:</span> {new Date(content.metadata.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {content.metadata?.tags && content.metadata.tags.length > 0 && (
                <div className="flex items-start space-x-2">
                  <Tag className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {content.metadata.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
