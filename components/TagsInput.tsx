'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Plus, Hash, Search } from 'lucide-react';
import { cn } from '@/lib/utils'
import { useDebounce } from '@/lib/hooks/use-debounce'

interface Tag {
  id: string
  name: string
  category?: string
  color?: string
  description?: string
}

interface TagsInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  allowCreate?: boolean
  suggestions?: Tag[]
  className?: string
}

export function TagsInput({
  value,
  onChange,
  placeholder = "Add tags...",
  maxTags = 10,
  allowCreate = true,
  suggestions = [],
  className
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<Tag[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debouncedInput = useDebounce(inputValue, 300)

  useEffect(() => {
    if (debouncedInput && suggestions.length > 0) {
      const filtered = suggestions.filter(tag => 
        tag.name.toLowerCase().includes(debouncedInput.toLowerCase()) &&
        !value.includes(tag.name)
      )
      setFilteredSuggestions(filtered.slice(0, 8))
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [debouncedInput, suggestions, value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addTag = (tagName: string) => {
    if (!tagName.trim() || value.includes(tagName.trim())) return
    
    if (value.length >= maxTags) {
      return
    }

    const newTags = [...value, tagName.trim()]
    onChange(newTags)
    setInputValue('')
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = value.filter(tag => tag !== tagToRemove)
    onChange(newTags)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions && filteredSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % filteredSuggestions.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (selectedIndex >= 0) {
          addTag(filteredSuggestions[selectedIndex].name)
        } else {
          handleCreateTag()
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false)
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleCreateTag()
    }
  }

  const handleCreateTag = () => {
    if (inputValue.trim()) {
      addTag(inputValue)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setSelectedIndex(-1)
  }

  const getTagColor = (tagName: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-yellow-100 text-yellow-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-red-100 text-red-800',
      'bg-orange-100 text-orange-800'
    ]
    
    const index = tagName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[index]
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className={cn(
        "flex flex-wrap items-center gap-2 p-2 border rounded-md bg-white",
        "focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent",
        className
      )}>
        {value.map((tag, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-1 px-2 py-1 text-sm rounded-full",
              getTagColor(tag)
            )}
          >
            <Hash className="w-3 h-3" />
            {tag}
            <button
              type="button"
              className="ml-1 hover:opacity-70"
              onClick={() => removeTag(tag)}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        
        {value.length < maxTags && (
          <div className="flex-1 min-w-[120px]">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="border-0 focus:ring-0 focus:ring-offset-0 h-8 w-full outline-none"
            />
          </div>
        )}
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              type="button"
              className={cn(
                "w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2",
                selectedIndex === index && "bg-blue-50"
              )}
              onClick={() => addTag(suggestion.name)}
            >
              <Hash className="w-4 h-4 text-gray-400" />
              <span className="flex-1">{suggestion.name}</span>
              {suggestion.category && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                  {suggestion.category}
                </span>
              )}
            </button>
          ))}
          
          {allowCreate && inputValue && !filteredSuggestions.some(s => s.name.toLowerCase() === inputValue.toLowerCase()) && (
            <button
              type="button"
              className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2 border-t"
              onClick={handleCreateTag}
            >
              <Plus className="w-4 h-4 text-gray-400" />
              <span>Create "{inputValue}"</span>
            </button>
          )}
        </div>
      )}

      <div className="mt-1 text-xs text-gray-500">
        {value.length}/{maxTags} tags
      </div>
    </div>
  )
}
