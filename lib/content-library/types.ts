// Enhanced Content Library Types
export interface ContentLibraryItem {
  id: string
  user_id: string
  title: string
  description?: string
  content_type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'url' | 'post' | 'template' | 'collection'
  content_data: {
    text?: string
    media_urls?: string[]
    url?: string
    platform?: string
    hashtags?: string[]
    caption?: string
    [key: string]: any
  }
  tags: string[]
  category?: string
  collection_id?: string
  template_id?: string
  metadata?: {
    file_size?: number
    file_type?: string
    dimensions?: { width: number; height: number }
    duration?: number
    author?: string
    source?: string
    [key: string]: any
  }
  performance_data?: {
    views?: number
    likes?: number
    shares?: number
    engagement_rate?: number
    viral_score?: number
    [key: string]: any
  }
  viral_prediction_id?: string
  status: 'draft' | 'published' | 'archived' | 'scheduled'
  is_favorite: boolean
  is_template: boolean
  version: number
  parent_id?: string
  created_at: string
  updated_at: string
  published_at?: string
  scheduled_for?: string
}

export interface ContentCollection {
  id: string
  user_id: string
  name: string
  description?: string
  color?: string
  icon?: string
  is_public: boolean
  created_at: string
  updated_at: string
  item_count?: number
}

export interface ContentTemplate {
  id: string
  user_id: string
  name: string
  description?: string
  template_data: any
  category?: string
  tags: string[]
  is_public: boolean
  usage_count: number
  created_at: string
  updated_at: string
}

export interface ContentVersion {
  id: string
  content_id: string
  version_number: number
  content_data: any
  change_summary?: string
  created_by?: string
  created_at: string
}

export interface ContentRelationship {
  id: string
  source_content_id: string
  target_content_id: string
  relationship_type: 'repurposed_from' | 'variant_of' | 'related_to' | 'part_of' | 'inspired_by'
  created_at: string
}

export interface ContentLibraryFilters {
  search?: string
  content_type?: string
  tags?: string[]
  category?: string
  collection_id?: string
  status?: string
  is_favorite?: boolean
  date_range?: { start: string; end: string }
  sort_by?: 'created_at' | 'updated_at' | 'title' | 'performance'
  sort_order?: 'asc' | 'desc'
}

export interface ContentLibraryStats {
  total_items: number
  by_type: Record<string, number>
  by_status: Record<string, number>
  total_size: number
  favorite_count: number
  collection_count: number
  template_count: number
}
