'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { 
  Image, 
  Video, 
  FileText, 
  File, 
  ChevronDown, 
  X,
  Upload,
  Folder
} from 'lucide-react'

interface FileType {
  value: string
  label: string
  icon: React.ReactNode
  extensions: string[]
  color: string
}

const fileTypes: FileType[] = [
  {
    value: 'image',
    label: 'Image',
    icon: <Image className="w-4 h-4" />,
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  {
    value: 'video',
    label: 'Video',
    icon: <Video className="w-4 h-4" />,
    extensions: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
    color: 'text-purple-600 bg-purple-50 border-purple-200'
  },
  {
    value: 'document',
    label: 'Document',
    icon: <FileText className="w-4 h-4" />,
    extensions: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
    color: 'text-green-600 bg-green-50 border-green-200'
  },
  {
    value: 'all',
    label: 'All Files',
    icon: <File className="w-4 h-4" />,
    extensions: ['*'],
    color: 'text-gray-600 bg-gray-50 border-gray-200'
  }
]

interface FileTypeSelectorProps {
  value?: string
  onChange?: (value: string) => void
  variant?: 'dropdown' | 'buttons' | 'cards' | 'compact'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  multiple?: boolean
  showIcons?: boolean
  showExtensions?: boolean
  className?: string
  placeholder?: string
}

export function FileTypeSelector({
  value = 'all',
  onChange,
  variant = 'dropdown',
  size = 'md',
  disabled = false,
  multiple = false,
  showIcons = true,
  showExtensions = false,
  className,
  placeholder = 'Select file type'
}: FileTypeSelectorProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    value === 'all' ? ['all'] : [value]
  )
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (typeValue: string) => {
    if (disabled) return

    let newSelection: string[]
    
    if (multiple) {
      if (typeValue === 'all') {
        newSelection = ['all']
      } else {
        newSelection = selectedTypes.includes('all') 
          ? [typeValue]
          : selectedTypes.includes(typeValue)
            ? selectedTypes.filter(t => t !== typeValue)
            : [...selectedTypes, typeValue]
      }
    } else {
      newSelection = [typeValue]
      setIsOpen(false)
    }

    setSelectedTypes(newSelection)
    onChange?.(typeValue)
  }

  const getSelectedType = () => {
    if (selectedTypes.includes('all')) {
      return fileTypes.find(t => t.value === 'all')
    }
    return fileTypes.find(t => t.value === selectedTypes[0])
  }

  const selectedType = getSelectedType()

  const sizeClasses = {
    sm: 'text-sm py-1 px-2',
    md: 'text-sm py-2 px-3',
    lg: 'text-base py-3 px-4'
  }

  const renderDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex items-center justify-between w-full rounded-md border bg-white',
          'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeClasses[size],
          selectedType?.color,
          className
        )}
      >
        <div className="flex items-center space-x-2">
          {showIcons && selectedType?.icon}
          <span className="font-medium">
            {multiple && selectedTypes.length > 1 
              ? `${selectedTypes.length} types selected`
              : selectedType?.label
            }
          </span>
        </div>
        <ChevronDown className={cn(
          'w-4 h-4 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {fileTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleSelect(type.value)}
              className={cn(
                'flex items-center space-x-3 w-full px-3 py-2 text-left',
                'hover:bg-gray-50 transition-colors',
                'border-b last:border-b-0',
                selectedTypes.includes(type.value) && 'bg-blue-50 text-blue-700'
              )}
            >
              {showIcons && type.icon}
              <div className="flex-1">
                <div className="font-medium">{type.label}</div>
                {showExtensions && (
                  <div className="text-xs text-gray-500">
                    {type.extensions.join(', ')}
                  </div>
                )}
              </div>
              {selectedTypes.includes(type.value) && (
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  const renderButtons = () => (
    <div className={cn(
      'flex flex-wrap gap-2',
      className
    )}>
      {fileTypes.map((type) => (
        <button
          key={type.value}
          onClick={() => handleSelect(type.value)}
          disabled={disabled}
          className={cn(
            'flex items-center space-x-2 px-3 py-2 rounded-md border transition-all',
            'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            selectedTypes.includes(type.value)
              ? type.color
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          )}
        >
          {showIcons && type.icon}
          <span className="font-medium">{type.label}</span>
          {showExtensions && (
            <span className="text-xs text-gray-500">
              ({type.extensions.slice(0, 3).join(', ')})
            </span>
          )}
        </button>
      ))}
    </div>
  )

  const renderCards = () => (
    <div className={cn(
      'grid grid-cols-2 md:grid-cols-4 gap-3',
      className
    )}>
      {fileTypes.map((type) => (
        <button
          key={type.value}
          onClick={() => handleSelect(type.value)}
          disabled={disabled}
          className={cn(
            'flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-all',
            'hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            selectedTypes.includes(type.value)
              ? type.color
              : 'bg-white border-gray-200 hover:border-gray-300'
          )}
        >
          {showIcons && <div className="text-2xl">{type.icon}</div>}
          <span className="font-medium text-sm">{type.label}</span>
          {showExtensions && (
            <span className="text-xs text-gray-500 text-center">
              {type.extensions.slice(0, 2).join(', ')}
            </span>
          )}
        </button>
      ))}
    </div>
  )

  const renderCompact = () => (
    <div className={cn(
      'flex items-center space-x-1 bg-white border rounded-lg p-1',
      className
    )}>
      {fileTypes.map((type) => (
        <button
          key={type.value}
          onClick={() => handleSelect(type.value)}
          disabled={disabled}
          className={cn(
            'flex items-center space-x-1 px-2 py-1 rounded text-xs transition-all',
            'hover:bg-gray-100 focus:outline-none',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            selectedTypes.includes(type.value)
              ? type.color
              : 'text-gray-600 hover:text-gray-800'
          )}
          title={type.label}
        >
          {showIcons && type.icon}
          <span className="hidden sm:inline">{type.label}</span>
        </button>
      ))}
    </div>
  )

  return (
    <div className="w-full">
      {variant === 'dropdown' && renderDropdown()}
      {variant === 'buttons' && renderButtons()}
      {variant === 'cards' && renderCards()}
      {variant === 'compact' && renderCompact()}
    </div>
  )
}

// Enhanced File Type Selector with Upload Capabilities
interface FileTypeUploadSelectorProps extends FileTypeSelectorProps {
  onFileSelect?: (files: FileList, type: string) => void
  maxFileSize?: number
  acceptedExtensions?: string[]
  dragAndDrop?: boolean
  showPreview?: boolean
}

export function FileTypeUploadSelector({
  onFileSelect,
  maxFileSize = 10,
  acceptedExtensions,
  dragAndDrop = true,
  showPreview = true,
  ...selectorProps
}: FileTypeUploadSelectorProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedType, setSelectedType] = useState('all')
  const [isDragOver, setIsDragOver] = useState(false)

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
  }

  const handleFileSelect = (files: FileList) => {
    const fileArray = Array.from(files)
    
    // Validate file types
    const validFiles = fileArray.filter(file => {
      if (selectedType === 'all') return true
      
      const extension = file.name.split('.').pop()?.toLowerCase()
      const typeConfig = fileTypes.find(t => t.value === selectedType)
      
      return typeConfig?.extensions.includes(extension || '') || false
    })

    // Validate file sizes
    const oversizedFiles = validFiles.filter(file => 
      file.size > maxFileSize * 1024 * 1024
    )

    if (oversizedFiles.length > 0) {
      alert(`Some files exceed the ${maxFileSize}MB size limit`)
      return
    }

    setSelectedFiles(validFiles)
    onFileSelect?.(fileArray as any, selectedType)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    handleFileSelect(files)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files)
    }
  }

  return (
    <div className="space-y-4">
      <FileTypeSelector
        {...selectorProps}
        value={selectedType}
        onChange={handleTypeChange}
      />

      {dragAndDrop && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-all',
            'hover:border-blue-400 hover:bg-blue-50',
            isDragOver && 'border-blue-500 bg-blue-50',
            'cursor-pointer'
          )}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-2">
            Drag and drop files here, or{' '}
            <label className="text-blue-600 hover:text-blue-800 cursor-pointer">
              browse
              <input
                type="file"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
                accept={acceptedExtensions?.join(',')}
              />
            </label>
          </p>
          <p className="text-sm text-gray-500">
            Max file size: {maxFileSize}MB
          </p>
        </div>
      )}

      {!dragAndDrop && (
        <div>
          <input
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            accept={acceptedExtensions?.join(',')}
          />
        </div>
      )}

      {showPreview && selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Selected Files:</h4>
          <div className="space-y-1">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="flex items-center space-x-2">
                  <Folder className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(1)}MB)
                  </span>
                </div>
                <button
                  onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== index))}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
