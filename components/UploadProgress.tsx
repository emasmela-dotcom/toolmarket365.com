'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, X, CheckCircle, AlertCircle, FileText, Image as ImageIcon, Video, Music, File } from 'lucide-react';
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

interface FileUpload {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
  url?: string
}

interface UploadProgressProps {
  maxFiles?: number
  maxSizeMB?: number
  acceptedTypes?: string[]
  onUploadComplete?: (urls: string[]) => void
}

export function UploadProgress({ 
  maxFiles = 10, 
  maxSizeMB = 100, 
  acceptedTypes = ['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx'],
  onUploadComplete 
}: UploadProgressProps) {
  const [files, setFiles] = useState<FileUpload[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />
    if (type.startsWith('video/')) return <Video className="w-4 h-4" />
    if (type.startsWith('audio/')) return <Music className="w-4 h-4" />
    if (type.includes('pdf')) return <FileText className="w-4 h-4" />
    return <File className="w-4 h-4" />
  }

  const validateFile = (file: File): string | null => {
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxSizeMB}MB limit`
    }
    
    if (acceptedTypes.length > 0) {
      const isAccepted = acceptedTypes.some(type => {
        if (type.includes('/')) {
          return file.type.startsWith(type.split('/')[0])
        }
        return file.name.toLowerCase().endsWith(type.toLowerCase())
      })
      
      if (!isAccepted) {
        return 'File type not accepted'
      }
    }
    
    return null
  }

  const updateFileProgress = (id: string, progress: number, status: FileUpload['status'], url?: string, error?: string) => {
    setFiles(prev => prev.map(file => 
      file.id === id 
        ? { ...file, progress, status, url, error }
        : file
    ))
  }

  const handleFileUpload = async (fileUpload: FileUpload) => {
    const xhr = new XMLHttpRequest()
    
    xhr.upload.addEventListener('loadstart', () => {
      updateFileProgress(fileUpload.id, 0, 'uploading')
    })

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100)
        updateFileProgress(fileUpload.id, progress, 'uploading')
      }
    })

    xhr.upload.addEventListener('load', () => {
      updateFileProgress(fileUpload.id, 100, 'uploading')
    })

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText)
          updateFileProgress(fileUpload.id, 100, 'completed', data.data?.secure_url || data.url)
        } catch (error) {
          updateFileProgress(fileUpload.id, 0, 'error', undefined, 'Failed to parse response')
        }
      } else {
        updateFileProgress(fileUpload.id, 0, 'error', undefined, 'Upload failed')
      }
    })

    xhr.addEventListener('error', () => {
      updateFileProgress(fileUpload.id, 0, 'error', undefined, 'Network error')
    })

    xhr.addEventListener('abort', () => {
      updateFileProgress(fileUpload.id, 0, 'error', undefined, 'Upload cancelled')
    })

    const formData = new FormData()
    formData.append('file', fileUpload.file)
    formData.append('preset', 'gallery')

    xhr.open('POST', '/api/upload', true)
    xhr.send(formData)
  }

  const processFiles = (newFiles: File[]) => {
    const availableSlots = maxFiles - files.filter(f => f.status !== 'completed').length
    
    if (availableSlots <= 0) {
      alert(`You can only upload ${maxFiles} files at a time`)
      return
    }

    const filesToProcess = newFiles.slice(0, availableSlots)
    
    const fileUploads: FileUpload[] = filesToProcess.map(file => {
      const error = validateFile(file)
      
      return {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        progress: 0,
        status: error ? 'error' : 'pending',
        error: error ?? undefined
      }
    })

    setFiles(prev => [...prev, ...fileUploads])

    fileUploads.forEach(fileUpload => {
      if (fileUpload.status === 'pending') {
        setTimeout(() => handleFileUpload(fileUpload), 100)
      }
    })
  }

  const handleFileSelect = (selectedFiles: FileList) => {
    const filesArray = Array.from(selectedFiles)
    processFiles(filesArray)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }, [files, maxFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id))
  }

  const retryUpload = (id: string) => {
    const fileUpload = files.find(f => f.id === id)
    if (fileUpload && fileUpload.status === 'error') {
      updateFileProgress(id, 0, 'pending')
      setTimeout(() => handleFileUpload(fileUpload), 100)
    }
  }

  const clearCompleted = () => {
    setFiles(prev => prev.filter(file => file.status !== 'completed'))
  }

  useEffect(() => {
    const completedUrls = files
      .filter(f => f.status === 'completed' && f.url)
      .map(f => f.url!)

    if (completedUrls.length > 0 && onUploadComplete) {
      onUploadComplete(completedUrls)
    }
  }, [files, onUploadComplete])

  const completedCount = files.filter(f => f.status === 'completed').length
  const uploadingCount = files.filter(f => f.status === 'uploading').length
  const errorCount = files.filter(f => f.status === 'error').length

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
          'hover:border-blue-400 hover:bg-blue-50',
          isDragging && 'border-blue-400 bg-blue-50',
          'bg-white'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          {isDragging ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          or click to browse
        </p>
        <p className="text-xs text-gray-400">
          Max {maxFiles} files • {maxSizeMB}MB per file
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Accepted: {acceptedTypes.join(', ')}
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-700">
              Upload Queue ({files.length})
            </h3>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Clear Completed
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {files.map((fileUpload) => (
              <div
                key={fileUpload.id}
                className={cn(
                  'border rounded-lg p-3 bg-white',
                  fileUpload.status === 'error' && 'border-red-200 bg-red-50',
                  fileUpload.status === 'completed' && 'border-green-200 bg-green-50'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {getFileIcon(fileUpload.file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {fileUpload.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {fileUpload.status === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {fileUpload.status === 'error' && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    {fileUpload.status === 'uploading' && (
                      <span className="text-xs text-blue-600 font-medium">
                        {fileUpload.progress}%
                      </span>
                    )}
                    
                    <button
                      onClick={() => removeFile(fileUpload.id)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                {(fileUpload.status === 'uploading' || fileUpload.status === 'completed') && (
                  <div className="mb-2">
                    <Progress value={fileUpload.progress} max={100} className="h-2" />
                  </div>
                )}

                {/* Status Message */}
                {fileUpload.status === 'error' && fileUpload.error && (
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-red-600">{fileUpload.error}</p>
                    <button
                      onClick={() => retryUpload(fileUpload.id)}
                      className="text-xs text-blue-600 hover:text-blue-700 h-6"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {files.length > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex space-x-4">
            {uploadingCount > 0 && (
              <span className="text-blue-600">
                Uploading: {uploadingCount}
              </span>
            )}
            {completedCount > 0 && (
              <span className="text-green-600">
                Completed: {completedCount}
              </span>
            )}
            {errorCount > 0 && (
              <span className="text-red-600">
                Failed: {errorCount}
              </span>
            )}
          </div>
          <span>
            {files.filter(f => f.status === 'completed').length} / {files.length} uploaded
          </span>
        </div>
      )}
    </div>
  )
}
