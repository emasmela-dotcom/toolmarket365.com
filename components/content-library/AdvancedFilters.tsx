'use client'

import { useState } from 'react'
import { CalendarIcon, Filter, X } from 'lucide-react';

interface AdvancedFiltersProps {
  filters: {
    content_type: string[]
    status: string[]
    collection_id: string
    date_range: {
      start: Date | null
      end: Date | null
    }
    sort_by: string
    sort_order: 'asc' | 'desc'
    is_favorite: boolean
  }
  onFilterChange: (key: string, value: any) => void
  collections: Array<{
    id: string
    name: string
    item_count: number
  }>
  onClose?: () => void
}

export function AdvancedFilters({ filters, onFilterChange, collections, onClose }: AdvancedFiltersProps) {
  const [localDateRange, setLocalDateRange] = useState<{
    from: Date | null
    to: Date | null
  }>({
    from: filters.date_range.start,
    to: filters.date_range.end
  })

  const contentTypes = ['text', 'image', 'video', 'audio', 'document', 'template']
  const statuses = ['draft', 'published', 'archived']
  const sortOptions = [
    { value: 'created_at', label: 'Created Date' },
    { value: 'updated_at', label: 'Updated Date' },
    { value: 'title', label: 'Title' },
    { value: 'view_count', label: 'View Count' },
    { value: 'like_count', label: 'Like Count' }
  ]

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const handleDateChange = (type: 'from' | 'to', date: Date | null) => {
    const newRange = { ...localDateRange, [type]: date }
    setLocalDateRange(newRange)
    
    if (type === 'from') {
      onFilterChange('date_range.start', date)
    } else {
      onFilterChange('date_range.end', date)
    }
  }

  const clearAllFilters = () => {
    onFilterChange('content_type', [])
    onFilterChange('status', [])
    onFilterChange('collection_id', '')
    onFilterChange('date_range.start', null)
    onFilterChange('date_range.end', null)
    onFilterChange('sort_by', 'created_at')
    onFilterChange('sort_order', 'desc')
    onFilterChange('is_favorite', false)
    setLocalDateRange({ from: null, to: null })
  }

  return (
    <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Advanced Filters
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-mono-100 dark:hover:bg-mono-800 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Date Range</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <input
                type="date"
                value={localDateRange.from ? localDateRange.from.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null
                  handleDateChange('from', date)
                }}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
            
            <div className="relative">
              <input
                type="date"
                value={localDateRange.to ? localDateRange.to.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null
                  if (date && localDateRange.from && date < localDateRange.from) {
                    alert('End date must be after start date')
                    return
                  }
                  handleDateChange('to', date)
                }}
                min={localDateRange.from ? localDateRange.from.toISOString().split('T')[0] : undefined}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
          </div>
          {(localDateRange.from || localDateRange.to) && (
            <div className="mt-2 text-sm text-mono-600 dark:text-mono-400">
              {localDateRange.from && localDateRange.to 
                ? `${formatDate(localDateRange.from)} - ${formatDate(localDateRange.to)}`
                : localDateRange.from 
                  ? `From: ${formatDate(localDateRange.from)}`
                  : `To: ${formatDate(localDateRange.to)}`
              }
            </div>
          )}
        </div>

        {/* Content Type Multi-Select */}
        <div>
          <label className="block text-sm font-medium mb-2">Content Types</label>
          <div className="space-y-2">
            {contentTypes.map(type => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.content_type.includes(type)}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...filters.content_type, type]
                      : filters.content_type.filter(t => t !== type)
                    onFilterChange('content_type', newTypes)
                  }}
                  className="rounded"
                />
                <span className="text-sm capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status Multi-Select */}
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <div className="space-y-2">
            {statuses.map(status => (
              <label key={status} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={(e) => {
                    const newStatus = e.target.checked
                      ? [...filters.status, status]
                      : filters.status.filter(s => s !== status)
                    onFilterChange('status', newStatus)
                  }}
                  className="rounded"
                />
                <span className="text-sm capitalize">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Collection Select */}
        <div>
          <label className="block text-sm font-medium mb-2">Collection</label>
          <select
            value={filters.collection_id}
            onChange={(e) => onFilterChange('collection_id', e.target.value)}
            className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="">All Collections</option>
            {collections.map(collection => (
              <option key={collection.id} value={collection.id}>
                {collection.name} ({collection.item_count})
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium mb-2">Sort By</label>
          <div className="flex space-x-2">
            <select
              value={filters.sort_by}
              onChange={(e) => onFilterChange('sort_by', e.target.value)}
              className="flex-1 px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <select
              value={filters.sort_order}
              onChange={(e) => onFilterChange('sort_order', e.target.value)}
              className="px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Favorite Filter */}
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.is_favorite}
              onChange={(e) => onFilterChange('is_favorite', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">Favorites Only</span>
          </label>
        </div>

        {/* Active Filters Summary */}
        {(filters.content_type.length > 0 || 
          filters.status.length > 0 || 
          filters.collection_id || 
          localDateRange.from || 
          localDateRange.to ||
          filters.is_favorite) && (
          <div className="p-3 bg-mono-50 dark:bg-mono-800 rounded-lg">
            <div className="text-sm font-medium mb-2">Active Filters:</div>
            <div className="flex flex-wrap gap-2">
              {filters.content_type.map(type => (
                <span key={type} className="px-2 py-1 bg-accent-100 dark:bg-accent-900 text-accent-800 dark:text-accent-200 rounded text-xs capitalize">
                  {type}
                </span>
              ))}
              {filters.status.map(status => (
                <span key={status} className="px-2 py-1 bg-accent-100 dark:bg-accent-900 text-accent-800 dark:text-accent-200 rounded text-xs capitalize">
                  {status}
                </span>
              ))}
              {filters.collection_id && (
                <span className="px-2 py-1 bg-accent-100 dark:bg-accent-900 text-accent-800 dark:text-accent-200 rounded text-xs">
                  Collection: {collections.find(c => c.id === filters.collection_id)?.name}
                </span>
              )}
              {(localDateRange.from || localDateRange.to) && (
                <span className="px-2 py-1 bg-accent-100 dark:bg-accent-900 text-accent-800 dark:text-accent-200 rounded text-xs">
                  Date Range
                </span>
              )}
              {filters.is_favorite && (
                <span className="px-2 py-1 bg-accent-100 dark:bg-accent-900 text-accent-800 dark:text-accent-200 rounded text-xs">
                  Favorites
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between space-x-2 pt-4 border-t border-mono-200 dark:border-mono-700">
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
          >
            Clear All
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
            >
              Apply Filters
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
