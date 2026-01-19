export interface ContentItem {
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
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
  view_count: number;
  like_count: number;
  share_count: number;
}

export interface ContentCollection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  item_count: number;
  is_public: boolean;
  tags: string[];
  metadata: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface ContentTemplate {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  template_data: Record<string, any>;
  template_type: 'content' | 'design' | 'workflow';
  tags: string[];
  is_public: boolean;
  usage_count: number;
  rating: number;
  metadata: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface SearchFilters {
  query?: string;
  tags?: string[];
  content_type?: ContentItem['content_type'][];
  status?: ContentItem['status'][];
  collection_id?: string;
  date_range?: {
    start: Date;
    end: Date;
  };
  is_favorite?: boolean;
  sort_by?: 'created_at' | 'updated_at' | 'title' | 'view_count' | 'like_count';
  sort_order?: 'asc' | 'desc';
}
