'use client'

import { useState } from 'react'
import { Eye, FileText, ImageIcon, Video, Music, File, ExternalLink } from 'lucide-react'
import { ContentViewer } from './ContentViewer'

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

interface PreviewCardProps {
  content: ContentItem
  className?: string
}

export function PreviewCard({ content, className }: PreviewCardProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false)

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

  const Icon = getContentIcon(content.type)

  const getContentPreview = () => {
    switch (content.type) {
      case 'text':
        return <p className="text-sm text-gray-700 line-clamp-3">{content.content}</p>
      
      case 'image':
        return (
          content.thumbnail_url ? (
            <img 
              src={content.thumbnail_url} 
              alt={content.title}
              className="w-full h-40 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
              <Icon className="w-8 h-8 text-gray-400" />
            </div>
          )
        )
      
      case 'video':
      case 'audio':
        return (
          <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
            <Icon className="w-8 h-8 text-gray-400" />
          </div>
        )
      
      default:
        return (
          <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
            <Icon className="w-8 h-8 text-gray-400" />
          </div>
        )
    }
  }

  return (
    <>
      <div className={`border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow ${className}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 truncate">{content.title}</h3>
            {content.description && (
              <p className="text-sm text-gray-500 line-clamp-1 mt-1">{content.description}</p>
            )}
          </div>
          <button
            onClick={() => setIsViewerOpen(true)}
            className="ml-2 p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {getContentPreview()}

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span className="inline-block px-2 py-1 bg-gray-100 rounded text-gray-700 font-medium">
            {content.type}
          </span>
          <button
            onClick={() => setIsViewerOpen(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View
          </button>
        </div>
      </div>

      <ContentViewer
        content={content}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </>
  )
}
