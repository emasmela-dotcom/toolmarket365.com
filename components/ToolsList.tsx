'use client'

import { useState, useEffect } from 'react'
import { Clock, Tag, Layers, Wrench } from 'lucide-react';
import { SearchFilter } from './SearchFilter'

interface Tool {
  id: string
  name: string
  description: string
  type: string
  category: string
  tags: string[]
  created_at: string
  updated_at: string
}

interface ToolsListProps {
  availableTypes?: string[]
  availableTags?: string[]
  availableCategories?: string[]
}

export function ToolsList({ 
  availableTypes = [], 
  availableTags = [], 
  availableCategories = [] 
}: ToolsListProps) {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false
  })

  const fetchTools = async (filters: Record<string, any> = {}) => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && Array.isArray(value) ? value.length > 0 : value) {
          params.set(key, Array.isArray(value) ? value.join(',') : value)
        }
      })

      const response = await fetch(`/api/tools/search?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch tools')
      
      const data = await response.json()
      setTools(data.tools)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching tools:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filters: Record<string, any>) => {
    fetchTools(filters)
  }

  const loadMore = () => {
    if (pagination.hasMore && !loading) {
      fetchTools({ offset: pagination.offset + pagination.limit })
    }
  }

  useEffect(() => {
    fetchTools()
  }, [])

  if (loading && tools.length === 0) {
    return (
      <div className="space-y-4">
        <SearchFilter
          availableTypes={availableTypes}
          availableTags={availableTags}
          availableCategories={availableCategories}
          onFilterChange={handleFilterChange}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SearchFilter
        availableTypes={availableTypes}
        availableTags={availableTags}
        availableCategories={availableCategories}
        onFilterChange={handleFilterChange}
      />

      {tools.length === 0 ? (
        <div className="border border-gray-200 rounded-lg p-12 text-center bg-gray-50">
          <Wrench className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tools found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
          <button
            onClick={() => handleFilterChange({})}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <div key={tool.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                    {tool.type}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{tool.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <Layers className="w-4 h-4 mr-1" />
                      {tool.category}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(tool.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {tool.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tool.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                      {tool.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                          +{tool.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {pagination.hasMore && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
