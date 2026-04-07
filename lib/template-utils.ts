export interface TemplateData {
  caption?: string
  text?: string
  hashtags?: string[]
  title?: string
  introduction?: string
  features?: string[]
  call_to_action?: string
  best_posting_time?: string
  idea?: string
  outline?: string[]
  script?: string
  headline?: string
  description?: string
  bio?: string
  [key: string]: any
}

export interface TemplateFilters {
  niche?: string
  platform?: string
  voice?: string
  template_type?: string
  search?: string
  sort_by?: 'popular' | 'newest' | 'most_used' | 'most_liked'
}

export const NICHE_OPTIONS = [
  { value: 'fitness', label: 'Fitness & Health', icon: '💪' },
  { value: 'tech', label: 'Technology', icon: '💻' },
  { value: 'cooking', label: 'Cooking & Food', icon: '🍳' },
  { value: 'fashion', label: 'Fashion & Beauty', icon: '👗' },
  { value: 'business', label: 'Business & Finance', icon: '💼' },
  { value: 'travel', label: 'Travel & Adventure', icon: '✈️' },
  { value: 'education', label: 'Education & Learning', icon: '📚' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'general', label: 'General', icon: '🌟' }
]

export const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram', icon: '📸', maxLength: 2200 },
  { value: 'tiktok', label: 'TikTok', icon: '🎵', maxLength: 150 },
  { value: 'youtube', label: 'YouTube', icon: '📺', maxLength: 5000 },
  { value: 'twitter', label: 'Twitter', icon: '🐦', maxLength: 280 },
  { value: 'facebook', label: 'Facebook', icon: '📘', maxLength: 63206 },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼', maxLength: 3000 },
  { value: 'universal', label: 'Universal', icon: '🌐', maxLength: null }
]

export const VOICE_OPTIONS = [
  { value: 'professional', label: 'Professional', icon: '👔' },
  { value: 'casual', label: 'Casual', icon: '😊' },
  { value: 'humorous', label: 'Humorous', icon: '😄' },
  { value: 'educational', label: 'Educational', icon: '🎓' },
  { value: 'inspirational', label: 'Inspirational', icon: '✨' },
  { value: 'enthusiastic', label: 'Enthusiastic', icon: '🚀' }
]

export const TEMPLATE_TYPE_OPTIONS = [
  { value: 'caption', label: 'Caption', icon: '📝' },
  { value: 'content_idea', label: 'Content Idea', icon: '💡' },
  { value: 'hashtag', label: 'Hashtag', icon: '#️⃣' },
  { value: 'blog_outline', label: 'Blog Outline', icon: '📄' },
  { value: 'script', label: 'Script', icon: '🎬' },
  { value: 'headline', label: 'Headline', icon: '📰' },
  { value: 'description', label: 'Description', icon: '🏷️' },
  { value: 'bio', label: 'Bio', icon: '👤' }
]

export const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
  { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' }
]

export function extractTemplateText(templateData: TemplateData, templateType: string): string {
  switch (templateType) {
    case 'caption':
      return templateData.caption || templateData.text || ''
    case 'hashtag':
      return templateData.hashtags?.join(' ') || ''
    case 'blog_outline':
      return templateData.title || templateData.introduction || ''
    case 'content_idea':
      return templateData.idea || templateData.title || ''
    case 'script':
      return templateData.script || templateData.text || ''
    case 'headline':
      return templateData.headline || templateData.title || ''
    case 'description':
      return templateData.description || templateData.text || ''
    case 'bio':
      return templateData.bio || templateData.text || ''
    default:
      return templateData.text || templateData.caption || JSON.stringify(templateData)
  }
}

export function getTemplatePreview(templateData: TemplateData, templateType: string, maxLength: number = 100): string {
  const fullText = extractTemplateText(templateData, templateType)
  
  if (fullText.length <= maxLength) return fullText
  
  return fullText.substring(0, maxLength) + '...'
}

export function getDifficultyColor(level: string): string {
  const colors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  }
  return colors[level] || 'bg-mono-100 text-mono-800 dark:bg-mono-800 dark:text-mono-300'
}
