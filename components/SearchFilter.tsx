'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, X, ChevronDown, Tag, Layers } from 'lucide-react'

interface SearchFilterProps {
  availableTypes?: string[]
  availableTags?: string[]
  availableCategories?: string[]
  onFilterChange?: (filters: FilterState) => void
}

interface FilterState {
  search: string
  types: string[]
  tags: string[]
  category: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export function SearchFilter({ 
  availableTypes = [], 
  availableTags = [], 
  availableCategories = [],
  onFilterChange 
}: SearchFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    types: [],
    tags: [],
    category: '',
    sortBy: 'name',
    sortOrder: 'asc'
  })

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Initialize filters from URL
  useEffect(() => {
    const search = searchParams.get('search') || ''
    const types = searchParams.get('types')?.split(',').filter(Boolean) || []
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []
    const category = searchParams.get('category') || ''
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'

    setFilters({
      search,
      types,
      tags,
      category,
      sortBy,
      sortOrder
    })
  }, [searchParams])

  // Update URL when filters change
  const updateURL = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams()
    
    if (newFilters.search) params.set('search', newFilters.search)
    if (newFilters.types.length > 0) params.set('types', newFilters.types.join(','))
    if (newFilters.tags.length > 0) params.set('tags', newFilters.tags.join(','))
    if (newFilters.category) params.set('category', newFilters.category)
    if (newFilters.sortBy !== 'name') params.set('sortBy', newFilters.sortBy)
    if (newFilters.sortOrder !== 'asc') params.set('sortOrder', newFilters.sortOrder)

    const queryString = params.toString()
    router.push(`/tools${queryString ? `?${queryString}` : ''}`)
  }, [router])

  // Handle filter changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL(filters)
      onFilterChange?.(filters)
    }, 300)

    return () => clearTimeout(timer)
  }, [filters, updateURL, onFilterChange])

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }))
  }

  const handleTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }))
  }

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category }))
  }

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder }))
  }

  const clearAllFilters = () => {
    setFilters({
      search: '',
      types: [],
      tags: [],
      category: '',
      sortBy: 'name',
      sortOrder: 'asc'
    })
  }

  const removeFilter = (type: 'type' | 'tag' | 'category', value: string) => {
    if (type === 'type') {
      setFilters(prev => ({
        ...prev,
        types: prev.types.filter(t => t !== value)
      }))
    } else if (type === 'tag') {
      setFilters(prev => ({
        ...prev,
        tags: prev.tags.filter(t => t !== value)
      }))
    } else if (type === 'category') {
      setFilters(prev => ({ ...prev, category: '' }))
    }
  }

  const activeFilterCount = filters.types.length + filters.tags.length + (filters.category ? 1 : 0)

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search tools by name, description, or tags..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-4">
          
          {/* Type Filter */}
          {availableTypes.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center text-gray-900">
                <Layers className="w-4 h-4 mr-2" />
                Types
              </h4>
              <div className="flex flex-wrap gap-2">
                {availableTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => handleTypeToggle(type)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filters.types.includes(type)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tag Filter */}
          {availableTags.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center text-gray-900">
                <Tag className="w-4 h-4 mr-2" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filters.tags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Filter */}
          {availableCategories.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 text-gray-900">Categories</h4>
              <select
                value={filters.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}

          {/* Sort Options */}
          <div>
            <h4 className="font-medium mb-2 text-gray-900">Sort By</h4>
            <div className="space-y-2">
              <button
                onClick={() => handleSortChange('name', 'asc')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${
                  filters.sortBy === 'name' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Name (A-Z)
              </button>
              <button
                onClick={() => handleSortChange('created_at', 'desc')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${
                  filters.sortBy === 'created_at' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Newest First
              </button>
              <button
                onClick={() => handleSortChange('updated_at', 'desc')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${
                  filters.sortBy === 'updated_at' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Recently Updated
              </button>
            </div>
          </div>

          <div className="border-t pt-4">
            <button
              onClick={clearAllFilters}
              className="w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(filters.types.length > 0 || filters.tags.length > 0 || filters.category) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.types.map(type => (
            <span key={type} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              {type}
              <X
                className="w-3 h-3 cursor-pointer hover:text-blue-600"
                onClick={() => removeFilter('type', type)}
              />
            </span>
          ))}
          {filters.tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              {tag}
              <X
                className="w-3 h-3 cursor-pointer hover:text-blue-600"
                onClick={() => removeFilter('tag', tag)}
              />
            </span>
          ))}
          {filters.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              {filters.category}
              <X
                className="w-3 h-3 cursor-pointer hover:text-blue-600"
                onClick={() => removeFilter('category', filters.category)}
              />
            </span>
          )}
        </div>
      )}
    </div>
  )
}
