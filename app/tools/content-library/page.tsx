'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdvancedFilters } from '@/components/content-library/AdvancedFilters'
import { BulkActions } from '@/components/content-library/BulkActions'
import { ContentPreview } from '@/components/content-library/ContentPreview'
import { 
  Search, 
  Plus, 
  Grid, 
  List, 
  Filter, 
  Heart, 
  Share2, 
  MoreVertical,
  Folder,
  FileText,
  Image,
  Video,
  Music,
  File,
  Calendar,
  Eye,
  ThumbsUp,
  Tag,
  Clock,
  Star,
  Archive,
  Edit,
  Trash2,
  Download,
  Copy,
  EyeOff,
  X,
  Check,
  Sparkles
} from 'lucide-react'

// Types
interface ContentItem {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  content_type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'template';
  content_data: Record<string, any>;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  collection_id: string | null;
  is_favorite: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  view_count: number;
  like_count: number;
  share_count: number;
}

interface ContentCollection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  item_count: number;
  is_public: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface SearchFilters {
  query: string;
  content_type: string[];
  status: string[];
  tags: string[];
  collection_id: string;
  is_favorite: boolean;
  sort_by: 'created_at' | 'updated_at' | 'title' | 'view_count' | 'like_count';
  sort_order: 'asc' | 'desc';
  date_range: {
    start: Date | null;
    end: Date | null;
  };
}

// Main Component
export default function ContentLibraryPage() {
  // State Management
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [collections, setCollections] = useState<ContentCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    content_type: [],
    status: [],
    tags: [],
    collection_id: '',
    is_favorite: false,
    sort_by: 'created_at',
    sort_order: 'desc',
    date_range: {
      start: null,
      end: null
    }
  })
  const [pagination, setPagination] = useState({
    limit: 24,
    offset: 0,
    total: 0,
    has_more: false
  })
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null)
  const [previewItem, setPreviewItem] = useState<ContentItem | null>(null)
  const [showDropdown, setShowDropdown] = useState<string | null>(null)
  const [usingLocalStorage, setUsingLocalStorage] = useState(false)

  // Content Type Icons
  const contentTypeIcons = {
    text: FileText,
    image: Image,
    video: Video,
    audio: Music,
    document: File,
    template: Copy
  }

  // Content Type Colors
  const contentTypeColors = {
    text: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    image: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    video: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    audio: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    document: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    template: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
  }

  // Status Colors
  const statusColors = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    archived: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  // API Functions
  const fetchContentItems = useCallback(async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString(),
        sort_by: searchFilters.sort_by,
        sort_order: searchFilters.sort_order
      })

      if (searchFilters.query) params.append('search', searchFilters.query)
      if (searchFilters.content_type.length > 0) params.append('content_type', searchFilters.content_type.join(','))
      if (searchFilters.status.length > 0) params.append('status', searchFilters.status.join(','))
      if (searchFilters.tags.length > 0) params.append('tags', searchFilters.tags.join(','))
      if (searchFilters.collection_id) params.append('collection_id', searchFilters.collection_id)
      if (searchFilters.is_favorite) params.append('is_favorite', 'true')

      const response = await fetch(`/api/content-library?${params}`)
      const data = await response.json()

      if (data.success) {
        setContentItems(data.data || [])
        setPagination(prev => ({
          ...prev,
          total: data.pagination?.total || 0,
          has_more: data.pagination?.has_more || false
        }))
        
        // If database not configured, fallback to localStorage
        if (data.message && data.message.includes('local storage')) {
          // Load from localStorage as fallback
          const localData = localStorage.getItem('content_library_fallback')
          if (localData) {
            try {
              const localItems = JSON.parse(localData)
              setContentItems(localItems)
              setPagination(prev => ({
                ...prev,
                total: localItems.length,
                has_more: false
              }))
            } catch (e) {
              console.error('Failed to parse localStorage data:', e)
            }
          }
        }
      } else {
        // Silently handle - don't show error to user
        console.warn('Content library API issue:', data.error)
        // Try localStorage fallback
        const localData = localStorage.getItem('content_library_fallback')
        if (localData) {
          try {
            const localItems = JSON.parse(localData)
            setContentItems(localItems)
            setPagination(prev => ({
              ...prev,
              total: localItems.length,
              has_more: false
            }))
          } catch (e) {
            console.error('Failed to parse localStorage data:', e)
          }
        }
      }
    } catch (error) {
      // Silently handle - don't show error to user
      console.warn('Content library fetch error:', error)
      // Try localStorage fallback
      const localData = localStorage.getItem('content_library_fallback')
      if (localData) {
        try {
          const localItems = JSON.parse(localData)
          setContentItems(localItems)
          setPagination(prev => ({
            ...prev,
            total: localItems.length,
            has_more: false
          }))
        } catch (e) {
          console.error('Failed to parse localStorage data:', e)
        }
      }
    } finally {
      setLoading(false)
    }
  }, [searchFilters, pagination.limit, pagination.offset])

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/content-library/collections?include_item_count=true')
      const data = await response.json()
      
      if (data.success) {
        setCollections(data.data || [])
        
        // If database not configured, use localStorage fallback
        if (data.message && data.message.includes('local storage')) {
          const localCollections = localStorage.getItem('content_collections_fallback')
          if (localCollections) {
            try {
              const collections = JSON.parse(localCollections)
              setCollections(collections)
            } catch (e) {
              console.error('Failed to parse localStorage collections:', e)
            }
          }
        }
      } else {
        // Try localStorage fallback
        const localCollections = localStorage.getItem('content_collections_fallback')
        if (localCollections) {
          try {
            const collections = JSON.parse(localCollections)
            setCollections(collections)
          } catch (e) {
            console.error('Failed to parse localStorage collections:', e)
          }
        }
      }
    } catch (error) {
      // Try localStorage fallback
      const localCollections = localStorage.getItem('content_collections_fallback')
      if (localCollections) {
        try {
          const collections = JSON.parse(localCollections)
          setCollections(collections)
        } catch (e) {
          console.error('Failed to parse localStorage collections:', e)
        }
      }
      console.error('Failed to fetch collections:', error)
    }
  }

  // Event Handlers
  const handleSearch = (query: string) => {
    setSearchFilters(prev => ({ ...prev, query }))
    setPagination(prev => ({ ...prev, offset: 0 }))
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setSearchFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, offset: 0 }))
  }

  const handleCreateContent = async (data: any) => {
    try {
      const response = await fetch('/api/content-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        // If database not configured, save to localStorage
        if (result.message && result.message.includes('local storage')) {
          const localData = localStorage.getItem('content_library_fallback') || '[]'
          const localItems = JSON.parse(localData)
          localItems.push({
            ...result.data,
            id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          })
          localStorage.setItem('content_library_fallback', JSON.stringify(localItems))
        }
        setShowCreateModal(false)
        fetchContentItems()
        fetchCollections()
      } else {
        // Fallback to localStorage
        const localData = localStorage.getItem('content_library_fallback') || '[]'
        const localItems = JSON.parse(localData)
        localItems.push({
          ...data,
          id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          user_id: 'anonymous',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          published_at: data.status === 'published' ? new Date().toISOString() : null,
          view_count: 0,
          like_count: 0,
          share_count: 0
        })
        localStorage.setItem('content_library_fallback', JSON.stringify(localItems))
        setShowCreateModal(false)
        fetchContentItems()
      }
    } catch (error) {
      // Fallback to localStorage
      const localData = localStorage.getItem('content_library_fallback') || '[]'
      const localItems = JSON.parse(localData)
      localItems.push({
        ...data,
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: 'anonymous',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: data.status === 'published' ? new Date().toISOString() : null,
        view_count: 0,
        like_count: 0,
        share_count: 0
      })
      localStorage.setItem('content_library_fallback', JSON.stringify(localItems))
      setShowCreateModal(false)
      fetchContentItems()
    }
  }

  const handleUpdateContent = async (id: string, data: any) => {
    try {
      const response = await fetch(`/api/content-library/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        // If database not configured, update localStorage
        if (result.message && result.message.includes('local storage') || id.startsWith('local_')) {
          const localData = localStorage.getItem('content_library_fallback') || '[]'
          const localItems = JSON.parse(localData)
          const index = localItems.findIndex((item: any) => item.id === id)
          if (index !== -1) {
            localItems[index] = { ...localItems[index], ...data, updated_at: new Date().toISOString() }
            localStorage.setItem('content_library_fallback', JSON.stringify(localItems))
          }
        }
        setEditingItem(null)
        setShowCreateModal(false)
        fetchContentItems()
      } else {
        // Fallback to localStorage
        if (id.startsWith('local_')) {
          const localData = localStorage.getItem('content_library_fallback') || '[]'
          const localItems = JSON.parse(localData)
          const index = localItems.findIndex((item: any) => item.id === id)
          if (index !== -1) {
            localItems[index] = { ...localItems[index], ...data, updated_at: new Date().toISOString() }
            localStorage.setItem('content_library_fallback', JSON.stringify(localItems))
            setEditingItem(null)
            setShowCreateModal(false)
            fetchContentItems()
          }
        }
      }
    } catch (error) {
      // Fallback to localStorage
      if (id.startsWith('local_')) {
        const localData = localStorage.getItem('content_library_fallback') || '[]'
        const localItems = JSON.parse(localData)
        const index = localItems.findIndex((item: any) => item.id === id)
        if (index !== -1) {
          localItems[index] = { ...localItems[index], ...data, updated_at: new Date().toISOString() }
          localStorage.setItem('content_library_fallback', JSON.stringify(localItems))
          setEditingItem(null)
          setShowCreateModal(false)
          fetchContentItems()
        }
      }
      console.error('Update error:', error)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return

    try {
      const response = await fetch(`/api/content-library/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        // If database not configured or local item, delete from localStorage
        if (result.message && result.message.includes('local storage') || id.startsWith('local_')) {
          const localData = localStorage.getItem('content_library_fallback') || '[]'
          const localItems = JSON.parse(localData)
          const filtered = localItems.filter((item: any) => item.id !== id)
          localStorage.setItem('content_library_fallback', JSON.stringify(filtered))
        }
        fetchContentItems()
        fetchCollections()
      } else {
        // Fallback to localStorage
        if (id.startsWith('local_')) {
          const localData = localStorage.getItem('content_library_fallback') || '[]'
          const localItems = JSON.parse(localData)
          const filtered = localItems.filter((item: any) => item.id !== id)
          localStorage.setItem('content_library_fallback', JSON.stringify(filtered))
          fetchContentItems()
          fetchCollections()
        }
      }
    } catch (error) {
      // Fallback to localStorage
      if (id.startsWith('local_')) {
        const localData = localStorage.getItem('content_library_fallback') || '[]'
        const localItems = JSON.parse(localData)
        const filtered = localItems.filter((item: any) => item.id !== id)
        localStorage.setItem('content_library_fallback', JSON.stringify(filtered))
        fetchContentItems()
        fetchCollections()
      }
      console.error('Delete error:', error)
    }
  }

  const handleToggleFavorite = async (id: string, currentValue: boolean) => {
    try {
      const response = await fetch(`/api/content-library/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_favorite: !currentValue })
      })

      const result = await response.json()

      if (result.success) {
        // If database not configured or local item, update localStorage
        if (result.message && result.message.includes('local storage') || id.startsWith('local_')) {
          const localData = localStorage.getItem('content_library_fallback') || '[]'
          const localItems = JSON.parse(localData)
          const index = localItems.findIndex((item: any) => item.id === id)
          if (index !== -1) {
            localItems[index].is_favorite = !currentValue
            localStorage.setItem('content_library_fallback', JSON.stringify(localItems))
          }
        }
        fetchContentItems()
      } else {
        // Fallback to localStorage
        if (id.startsWith('local_')) {
          const localData = localStorage.getItem('content_library_fallback') || '[]'
          const localItems = JSON.parse(localData)
          const index = localItems.findIndex((item: any) => item.id === id)
          if (index !== -1) {
            localItems[index].is_favorite = !currentValue
            localStorage.setItem('content_library_fallback', JSON.stringify(localItems))
            fetchContentItems()
          }
        }
      }
    } catch (error) {
      // Fallback to localStorage
      if (id.startsWith('local_')) {
        const localData = localStorage.getItem('content_library_fallback') || '[]'
        const localItems = JSON.parse(localData)
        const index = localItems.findIndex((item: any) => item.id === id)
        if (index !== -1) {
          localItems[index].is_favorite = !currentValue
          localStorage.setItem('content_library_fallback', JSON.stringify(localItems))
          fetchContentItems()
        }
      }
      console.error('Failed to toggle favorite:', error)
    }
  }


  // Effects
  useEffect(() => {
    fetchContentItems()
    fetchCollections()
  }, [fetchContentItems])

  // Check if using localStorage fallback
  useEffect(() => {
    // Check if we're using localStorage by checking if API returned the message
    const checkStorageMode = async () => {
      try {
        const response = await fetch('/api/content-library?limit=1')
        const data = await response.json()
        if (data.message && data.message.includes('local storage')) {
          setUsingLocalStorage(true)
        } else {
          setUsingLocalStorage(false)
        }
      } catch {
        setUsingLocalStorage(true)
      }
    }
    checkStorageMode()
  }, [])

  // Loading State
  if (loading && contentItems.length === 0) {
  return (
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
          </div>
    )
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 text-mono-950 dark:text-mono-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* localStorage Notice */}
        {usingLocalStorage && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                  Data Stored Locally in Your Browser
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                  <strong>Good news:</strong> All tools work instantly with local storage—no setup required! <strong>However:</strong> Your content is currently stored in your browser's local storage, which means your data is only on this device, won't sync across devices, and may be lost if you clear browser data. <strong>For full benefits and full functionality</strong> (cloud sync, cross-device access, data backup), set up a database connection. <strong>One database setup works for all tools</strong>—configure it once and enjoy cloud storage across your entire CreatorFlow365 toolkit.
                </p>
                <div className="mt-3">
                  <a
                    href="https://neon.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Set up Neon Database (Free)
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">📚 Content Library</h1>
            <p className="text-mono-600 dark:text-mono-400">Manage and organize your content</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setEditingItem(null)
                setShowCreateModal(true)
              }}
              className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Content</span>
            </button>
            
            <BulkActions
              selectedItems={selectedItems}
              collections={collections}
              onActionComplete={() => {
                setSelectedItems([])
                fetchContentItems()
                fetchCollections()
              }}
            />
        </div>
      </div>

        {/* Search and Filters Bar */}
        <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700">
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 w-4 h-4" />
        <input
          type="text"
                  placeholder="Search content, tags, descriptions..."
                  value={searchFilters.query}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-accent-600 text-white' 
                      : 'bg-mono-200 dark:bg-mono-800 hover:bg-mono-300 dark:hover:bg-mono-700'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-accent-600 text-white' 
                      : 'bg-mono-200 dark:bg-mono-800 hover:bg-mono-300 dark:hover:bg-mono-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="p-4 bg-mono-50 dark:bg-mono-900 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {/* Content Type Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Content Type</label>
                    <div className="space-y-2">
                      {['text', 'image', 'video', 'audio', 'document', 'template'].map(type => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={searchFilters.content_type.includes(type)}
                            onChange={(e) => {
                              const newTypes = e.target.checked
                                ? [...searchFilters.content_type, type]
                                : searchFilters.content_type.filter(t => t !== type)
                              handleFilterChange('content_type', newTypes)
                            }}
                            className="rounded"
                          />
                          <span className="text-sm capitalize">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <div className="space-y-2">
                      {['draft', 'published', 'archived'].map(status => (
                        <label key={status} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={searchFilters.status.includes(status)}
                            onChange={(e) => {
                              const newStatus = e.target.checked
                                ? [...searchFilters.status, status]
                                : searchFilters.status.filter(s => s !== status)
                              handleFilterChange('status', newStatus)
                            }}
                            className="rounded"
                          />
                          <span className="text-sm capitalize">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Collection Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Collection</label>
        <select
                      value={searchFilters.collection_id}
                      onChange={(e) => handleFilterChange('collection_id', e.target.value)}
                      className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                    >
                      <option value="">All Collections</option>
                      {collections.map(collection => (
                        <option key={collection.id} value={collection.id}>
                          {collection.name}
                        </option>
          ))}
        </select>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Sort By</label>
                    <select
                      value={searchFilters.sort_by}
                      onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                      className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                    >
                      <option value="created_at">Created Date</option>
                      <option value="updated_at">Updated Date</option>
                      <option value="title">Title</option>
                      <option value="view_count">Views</option>
                      <option value="like_count">Likes</option>
                    </select>
                  </div>

                  {/* Other Filters */}
          <div>
                    <label className="block text-sm font-medium mb-2">Other</label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={searchFilters.is_favorite}
                        onChange={(e) => handleFilterChange('is_favorite', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Favorites Only</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
        <button
                    onClick={() => {
                      setSearchFilters({
                        query: '',
                        content_type: [],
                        status: [],
                        tags: [],
                        collection_id: '',
                        is_favorite: false,
                        sort_by: 'created_at',
                        sort_order: 'desc',
                        date_range: {
                          start: null,
                          end: null
                        }
                      })
                    }}
                    className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
                  >
                    Clear Filters
        </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Collections */}
          <div className="lg:col-span-1 space-y-6">
            {/* Collections */}
            <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700">
              <h3 className="font-semibold mb-4 flex items-center">
                <Folder className="w-5 h-5 mr-2" />
                Collections
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
        <button
                  onClick={() => handleFilterChange('collection_id', '')}
                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                    searchFilters.collection_id === '' 
                      ? 'bg-accent-100 dark:bg-accent-900 text-accent-800 dark:text-accent-200' 
                      : 'hover:bg-mono-100 dark:hover:bg-mono-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>All Content</span>
                    <span className="text-xs bg-mono-200 dark:bg-mono-800 px-2 py-1 rounded">
                      {pagination.total}
                    </span>
                  </div>
        </button>
                
                {collections.map(collection => (
        <button
                    key={collection.id}
                    onClick={() => handleFilterChange('collection_id', collection.id)}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      searchFilters.collection_id === collection.id 
                        ? 'bg-accent-100 dark:bg-accent-900 text-accent-800 dark:text-accent-200' 
                        : 'hover:bg-mono-100 dark:hover:bg-mono-800'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate">{collection.name}</span>
                      <span className="text-xs bg-mono-200 dark:bg-mono-800 px-2 py-1 rounded">
                        {collection.item_count}
                      </span>
                    </div>
        </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700">
              <h3 className="font-semibold mb-4">📊 Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-mono-600 dark:text-mono-400">Total Items</span>
                  <span className="font-semibold">{pagination.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-mono-600 dark:text-mono-400">Published</span>
                  <span className="font-semibold">
                    {contentItems.filter(item => item.status === 'published').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-mono-600 dark:text-mono-400">Favorites</span>
                  <span className="font-semibold">
                    {contentItems.filter(item => item.is_favorite).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-mono-600 dark:text-mono-400">This Week</span>
                  <span className="font-semibold">
                    {contentItems.filter(item => {
                      const itemDate = new Date(item.created_at)
                      const weekAgo = new Date()
                      weekAgo.setDate(weekAgo.getDate() - 7)
                      return itemDate >= weekAgo
                    }).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid/List */}
          <div className="lg:col-span-3">
            {/* View Mode Toggle */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-mono-600 dark:text-mono-400">
                Showing {contentItems.length} of {pagination.total} items
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ 
                    ...prev, 
                    offset: Math.max(0, prev.offset - prev.limit) 
                  }))}
                  disabled={pagination.offset === 0}
                  className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <button
                  onClick={() => setPagination(prev => ({ 
                    ...prev, 
                    offset: prev.offset + prev.limit 
                  }))}
                  disabled={!pagination.has_more}
                  className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Content Grid */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contentItems.map(item => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    isSelected={selectedItems.includes(item.id)}
                    onSelect={(id) => {
                      setSelectedItems(prev => 
                        prev.includes(id) 
                          ? prev.filter(i => i !== id)
                          : [...prev, id]
                      )
                    }}
                    onEdit={() => {
                      setEditingItem(item)
                      setShowCreateModal(true)
                    }}
                    onDelete={() => handleDeleteItem(item.id)}
                    onToggleFavorite={() => handleToggleFavorite(item.id, item.is_favorite)}
                    onPreview={() => setPreviewItem(item)}
                    contentTypeIcons={contentTypeIcons}
                    contentTypeColors={contentTypeColors}
                    statusColors={statusColors}
                    showDropdown={showDropdown}
                    setShowDropdown={setShowDropdown}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {contentItems.map(item => (
                  <ContentListItem
                    key={item.id}
                    item={item}
                    isSelected={selectedItems.includes(item.id)}
                    onSelect={(id) => {
                      setSelectedItems(prev => 
                        prev.includes(id) 
                          ? prev.filter(i => i !== id)
                          : [...prev, id]
                      )
                    }}
                    onEdit={() => {
                      setEditingItem(item)
                      setShowCreateModal(true)
                    }}
                    onDelete={() => handleDeleteItem(item.id)}
                    onToggleFavorite={() => handleToggleFavorite(item.id, item.is_favorite)}
                    onPreview={() => setPreviewItem(item)}
                    contentTypeIcons={contentTypeIcons}
                    contentTypeColors={contentTypeColors}
                    statusColors={statusColors}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {contentItems.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-mono-400 mb-4">
                  <FileText className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-mono-600 dark:text-mono-400 mb-2">No content found</h3>
                <p className="text-mono-500 mb-4">
                  {searchFilters.query || Object.values(searchFilters).some(v => 
                    Array.isArray(v) ? v.length > 0 : 
                    typeof v === 'boolean' ? v : 
                    typeof v === 'string' ? v !== '' : false
                  ) 
                    ? "Try adjusting your search or filter criteria"
                    : "Start by creating your first piece of content"
                  }
                </p>
                <button
                  onClick={() => {
                    setEditingItem(null)
                    setShowCreateModal(true)
                  }}
                  className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Content</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Create/Edit Modal */}
        <CreateEditModal
          isOpen={showCreateModal}
          item={editingItem}
          collections={collections}
          onClose={() => {
            setShowCreateModal(false)
            setEditingItem(null)
          }}
          onSave={editingItem 
            ? (data) => handleUpdateContent(editingItem.id, data)
            : handleCreateContent
          }
        />

        {/* Content Preview Modal */}
        {previewItem && (
          <ContentPreview
            item={previewItem}
            isOpen={!!previewItem}
            onClose={() => setPreviewItem(null)}
            onEdit={() => {
              setPreviewItem(null)
              setEditingItem(previewItem)
              setShowCreateModal(true)
            }}
            onDelete={() => {
              handleDeleteItem(previewItem.id)
              setPreviewItem(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

// Content Card Component
function ContentCard({ 
  item, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete,
  onToggleFavorite,
  onPreview,
  contentTypeIcons,
  contentTypeColors,
  statusColors,
  showDropdown,
  setShowDropdown
}: { 
  item: ContentItem
  isSelected: boolean
  onSelect: (id: string) => void
  onEdit: () => void
  onDelete: () => void
  onToggleFavorite: () => void
  onPreview: () => void
  contentTypeIcons: Record<string, any>
  contentTypeColors: Record<string, string>
  statusColors: Record<string, string>
  showDropdown: string | null
  setShowDropdown: (id: string | null) => void
}) {
  const IconComponent = contentTypeIcons[item.content_type]
  const typeColor = contentTypeColors[item.content_type]
  const statusColor = statusColors[item.status]

  return (
    <div className={`bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700 transition-all hover:shadow-lg relative ${isSelected ? 'ring-2 ring-accent-500' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${typeColor}`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>
            {item.status}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={onToggleFavorite}
            className="p-1 hover:bg-mono-100 dark:hover:bg-mono-800 rounded transition-colors"
          >
            <Heart className={`w-4 h-4 ${item.is_favorite ? 'text-red-500 fill-current' : 'text-mono-400'}`} />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(showDropdown === item.id ? null : item.id)}
              className="p-1 hover:bg-mono-100 dark:hover:bg-mono-800 rounded transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showDropdown === item.id && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-mono-900 rounded-lg shadow-lg border border-mono-200 dark:border-mono-700 z-10">
                <button
                  onClick={() => {
                    onPreview()
                    setShowDropdown(null)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-mono-100 dark:hover:bg-mono-800 flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
          </button>
          <button
                  onClick={() => {
                    onEdit()
                    setShowDropdown(null)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-mono-100 dark:hover:bg-mono-800 flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    onSelect(item.id)
                    setShowDropdown(null)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-mono-100 dark:hover:bg-mono-800 flex items-center space-x-2"
                >
                  {isSelected ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span>Deselect</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>Select</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    onDelete()
                    setShowDropdown(null)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-mono-100 dark:hover:bg-mono-800 text-red-600 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
          </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <h3 
        className="font-semibold text-lg mb-2 line-clamp-2 cursor-pointer hover:text-accent-600 transition-colors"
        onClick={onPreview}
      >
        {item.title}
      </h3>
      {/* Tool Name Badge */}
      {item.metadata?.tool && (
        <div className="mb-2">
          <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
            <Sparkles className="w-3 h-3 mr-1" />
            {item.metadata.tool.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
          </span>
        </div>
      )}
      {item.description && (
        <p 
          className="text-sm text-mono-600 dark:text-mono-400 mb-3 line-clamp-3 cursor-pointer hover:text-accent-600 transition-colors"
          onClick={onPreview}
        >
          {item.description}
        </p>
      )}
      
      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-1 bg-mono-200 dark:bg-mono-800 rounded text-xs">
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="px-2 py-1 bg-mono-200 dark:bg-mono-800 rounded text-xs">
              +{item.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-mono-500">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <Eye className="w-3 h-3 mr-1" />
            {item.view_count || 0}
          </div>
          <div className="flex items-center">
            <ThumbsUp className="w-3 h-3 mr-1" />
            {item.like_count || 0}
          </div>
          <div className="flex items-center">
            <Share2 className="w-3 h-3 mr-1" />
            {item.share_count || 0}
          </div>
        </div>
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(item.created_at).toLocaleDateString()}
        </div>
      </div>

      {/* Selection Checkbox */}
      <div className="absolute top-2 left-2">
      <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(item.id)}
          className="w-4 h-4 rounded"
        />
      </div>
    </div>
  )
}

// Content List Item Component
function ContentListItem({ 
  item, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete,
  onToggleFavorite,
  onPreview,
  contentTypeIcons,
  contentTypeColors,
  statusColors
}: { 
  item: ContentItem
  isSelected: boolean
  onSelect: (id: string) => void
  onEdit: () => void
  onDelete: () => void
  onToggleFavorite: () => void
  onPreview: () => void
  contentTypeIcons: Record<string, any>
  contentTypeColors: Record<string, string>
  statusColors: Record<string, string>
}) {
  const IconComponent = contentTypeIcons[item.content_type]
  const typeColor = contentTypeColors[item.content_type]
  const statusColor = statusColors[item.status]

  return (
    <div className={`flex items-center p-4 border border-mono-200 dark:border-mono-700 rounded-lg transition-all hover:bg-mono-50 dark:hover:bg-mono-800 ${isSelected ? 'ring-2 ring-accent-500 bg-accent-50 dark:bg-accent-900/20' : 'bg-white dark:bg-mono-900'}`}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(item.id)}
        className="mr-4 w-4 h-4 rounded"
      />
      
      <div className={`p-2 rounded-lg ${typeColor} mr-4`}>
        <IconComponent className="w-5 h-5" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <h3 
            className="font-semibold cursor-pointer hover:text-accent-600 transition-colors"
            onClick={onPreview}
          >
            {item.title}
          </h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>
            {item.status}
          </span>
          {item.is_favorite && <Heart className="w-4 h-4 text-red-500 fill-current" />}
          {item.metadata?.tool && (
            <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
              <Sparkles className="w-3 h-3 mr-1" />
              {item.metadata.tool.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </span>
          )}
            </div>
        
        {item.description && (
          <p 
            className="text-sm text-mono-600 dark:text-mono-400 mb-2 line-clamp-2 cursor-pointer hover:text-accent-600 transition-colors"
            onClick={onPreview}
          >
            {item.description}
          </p>
        )}
        
        <div className="flex items-center space-x-4 text-sm text-mono-500">
          <div className="flex items-center">
            <Eye className="w-3 h-3 mr-1" />
            {item.view_count || 0}
          </div>
          <div className="flex items-center">
            <ThumbsUp className="w-3 h-3 mr-1" />
            {item.like_count || 0}
          </div>
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(item.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {item.tags.slice(0, 2).map(tag => (
          <span key={tag} className="px-2 py-1 bg-mono-200 dark:bg-mono-800 rounded text-xs">
                  {tag}
                </span>
              ))}
        {item.tags.length > 2 && (
          <span className="px-2 py-1 bg-mono-200 dark:bg-mono-800 rounded text-xs">
            +{item.tags.length - 2}
          </span>
        )}
            </div>

      <div className="flex items-center space-x-1 ml-4">
        <button
          onClick={onToggleFavorite}
          className="p-1 hover:bg-mono-100 dark:hover:bg-mono-800 rounded transition-colors"
        >
          <Heart className={`w-4 h-4 ${item.is_favorite ? 'text-red-500 fill-current' : 'text-mono-400'}`} />
        </button>
        <button
          onClick={onEdit}
          className="p-1 hover:bg-mono-100 dark:hover:bg-mono-800 rounded transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 hover:bg-mono-100 dark:hover:bg-mono-800 rounded transition-colors text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
          </div>
    </div>
  )
}

// Create/Edit Modal Component
function CreateEditModal({
  isOpen,
  onClose,
  item,
  collections,
  onSave
}: {
  isOpen: boolean
  onClose: () => void
  item: ContentItem | null
  collections: ContentCollection[]
  onSave: (data: any) => void
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: 'text' as ContentItem['content_type'],
    content_data: {},
    tags: [] as string[],
    status: 'draft' as ContentItem['status'],
    collection_id: '',
    is_favorite: false,
    metadata: {}
  })

  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description || '',
        content_type: item.content_type,
        content_data: item.content_data,
        tags: item.tags,
        status: item.status,
        collection_id: item.collection_id || '',
        is_favorite: item.is_favorite,
        metadata: item.metadata
      })
    } else {
      setFormData({
        title: '',
        description: '',
        content_type: 'text',
        content_data: {},
        tags: [],
        status: 'draft',
        collection_id: '',
        is_favorite: false,
        metadata: {}
      })
    }
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault()
    if (!formData.title.trim()) {
      alert('Please enter a title')
      return
    }
    onSave(formData)
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-mono-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{item ? 'Edit Content' : 'Create New Content'}</h2>
          <button
              onClick={onClose}
              className="p-2 hover:bg-mono-100 dark:hover:bg-mono-800 rounded transition-colors"
            >
              <X className="w-5 h-5" />
          </button>
        </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter content title"
                  required
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
      </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter content description"
                  rows={3}
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Content Type</label>
                  <select
                    value={formData.content_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_type: e.target.value as ContentItem['content_type'] }))}
                    className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  >
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="document">Document</option>
                    <option value="template">Template</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ContentItem['status'] }))}
                    className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Collection</label>
                  <select
                    value={formData.collection_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, collection_id: e.target.value }))}
                    className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  >
                    <option value="">No Collection</option>
                    {collections.map(collection => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
      </div>

                <div className="flex items-center space-x-2 pt-8">
                  <input
                    type="checkbox"
                    id="is_favorite"
                    checked={formData.is_favorite}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_favorite: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="is_favorite" className="text-sm">Mark as favorite</label>
        </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-mono-200 dark:bg-mono-800 rounded-lg flex items-center gap-2">
                  {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-mono-300 dark:hover:bg-mono-700 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                </span>
              ))}
            </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
                >
                  Add Tag
                </button>
          </div>
      </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t border-mono-200 dark:border-mono-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
              >
                {item ? 'Update' : 'Create'} Content
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
