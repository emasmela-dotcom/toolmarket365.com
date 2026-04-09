'use client'

import { useState, useCallback } from 'react'
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadResult {
  success: boolean
  data?: {
    secure_url: string
    public_id: string
    format: string
    width?: number
    height?: number
  }
  message?: string
}

interface UploadWidgetProps {
  onUploadComplete: (result: UploadResult) => void
  preset?: string
  multiple?: boolean
  maxFiles?: number
}

export function UploadWidget({ 
  onUploadComplete, 
  preset = 'gallery',
  multiple = false,
  maxFiles = 5 
}: UploadWidgetProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<UploadResult[]>([])

  const handleFileSelect = useCallback(async (files: FileList) => {
    if (files.length === 0) return

    setUploading(true)
    setProgress(0)
    setResults([])

    const formData = new FormData()
    
    if (multiple) {
      Array.from(files).slice(0, maxFiles).forEach(file => {
        formData.append('files', file)
      })
    } else {
      formData.append('file', files[0])
    }
    
    formData.append('preset', preset)

    try {
      const endpoint = multiple ? '/api/upload/multiple' : '/api/upload'
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        if (multiple) {
          setResults(result.data.successful.map((file: any) => ({
            success: true,
            data: file,
            message: 'Upload successful'
          })))
          
          // Handle failed uploads
          if (result.data.failed.length > 0) {
            result.data.failed.forEach((failed: any) => {
              setResults(prev => [...prev, {
                success: false,
                message: failed.error || 'Upload failed'
              }])
            })
          }
        } else {
          setResults([{
            success: true,
            data: result.data,
            message: result.message
          }])
        }
        
        onUploadComplete(result)
      } else {
        setResults([{
          success: false,
          message: result.error || 'Upload failed'
        }])
      }
    } catch (error) {
      setResults([{
        success: false,
        message: 'Network error occurred'
      }])
    } finally {
      setUploading(false)
      setProgress(100)
    }
  }, [multiple, maxFiles, preset, onUploadComplete])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    handleFileSelect(files)
  }, [handleFileSelect])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) handleFileSelect(files)
  }

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 mb-2">
          {multiple 
            ? `Drop files here or click to select up to ${maxFiles} files`
            : 'Drop file here or click to select'
          }
        </p>
        <input
          type="file"
          onChange={handleFileInput}
          accept="image/*,video/*"
          multiple={multiple}
          className="hidden"
          id="file-upload"
        />
        <label 
          htmlFor="file-upload" 
          className="inline-block px-4 py-2 bg-accent-600 text-white rounded cursor-pointer hover:bg-accent-700 transition-colors text-sm font-medium"
        >
          Choose Files
        </label>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all" style={{width: `${progress}%`}}></div>
          </div>
          <p className="text-sm text-gray-600 text-center">Uploading...</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg flex items-center space-x-2 ${
                result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`text-sm ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.message}
                </p>
                {result.data && (
                  <p className="text-xs text-gray-600 mt-1">
                    {result.data.width && result.data.height && `${result.data.width}x${result.data.height} • `}{result.data.format}
                  </p>
                )}
              </div>
              {result.success && result.data && (
                <a
                  href={result.data.secure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  View
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
