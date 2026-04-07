// Database Schema - Adapted for Neon/PostgreSQL
export interface ViralPrediction {
  id: string
  user_id: string
  content: {
    text: string
    media_urls: string[]
    media_type: 'image' | 'video' | 'carousel' | 'reel'
    platform: 'tiktok' | 'instagram' | 'youtube' | 'twitter' | 'linkedin'
  }
  analysis: {
    viral_score: number // 0-100
    confidence: number // 0-100
    emotional_analysis: EmotionalAnalysis
    visual_analysis: VisualAnalysis
    timing_analysis: TimingAnalysis
    competitor_analysis: CompetitorAnalysis
    hashtag_analysis: HashtagAnalysis
    risk_factors: string[]
    opportunities: string[]
  }
  prediction: {
    expected_engagement: {
      likes: number
      comments: number
      shares: number
      views: number
      engagement_rate: number
    }
    viral_probability: number // 0-100
    optimal_posting_time: string // ISO date string
    recommended_hashtags: string[]
    similar_viral_content: SimilarContent[]
  }
  performance?: {
    actual_engagement: ActualEngagement
    accuracy_score: number
    feedback: string
  }
  created_at: string
  scheduled_for?: string
}

export interface EmotionalAnalysis {
  primary_emotions: string[]
  emotional_intensity: number // 0-100
  sentiment_score: number // -100 to 100
  empathy_score: number // 0-100
  surprise_factor: number // 0-100
  controversy_risk: number // 0-100
  shareability_score: number // 0-100
}

export interface VisualAnalysis {
  attention_score: number // 0-100
  color_psychology_score: number // 0-100
  composition_score: number // 0-100
  thumbnail_effectiveness: number // 0-100
  text_readability: number // 0-100
  brand_consistency: number // 0-100
  accessibility_score: number // 0-100
}

export interface TimingAnalysis {
  current_trending_score: number // 0-100
  seasonal_relevance: number // 0-100
  day_of_week_score: number // 0-100
  time_of_day_score: number // 0-100
  timezone_optimization: string[]
  competitor_activity: number // 0-100
}

export interface CompetitorAnalysis {
  similar_content_performance: ContentPerformance[]
  content_gap_opportunities: string[]
  trending_hashtags_in_niche: string[]
  engagement_benchmarks: EngagementBenchmarks
  viral_threshold: number
}

export interface HashtagAnalysis {
  overall_score: number
  recommended_hashtags: string[]
  trending_hashtags: string[]
  niche_hashtags: string[]
  viral_potential_hashtags: string[]
}

export interface ContentPerformance {
  content_id: string
  platform: string
  engagement_rate: number
  views: number
  likes: number
  shares: number
}

export interface EngagementBenchmarks {
  average_engagement_rate: number
  top_performer_rate: number
  viral_threshold: number
}

export interface SimilarContent {
  content_id: string
  platform: string
  similarity_score: number
  engagement_rate: number
  url?: string
}

export interface ActualEngagement {
  likes: number
  comments: number
  shares: number
  views: number
  engagement_rate: number
}

export interface PredictionAlgorithm {
  id: string
  name: string
  platform: string
  accuracy: number
  last_trained: string
  features: string[]
  weights: Record<string, number>
}

export interface ContentInput {
  text: string
  mediaUrls?: string[]
  mediaType: 'image' | 'video' | 'carousel' | 'reel'
  platform: 'tiktok' | 'instagram' | 'youtube' | 'twitter' | 'linkedin'
}

export interface AnalysisResults {
  emotionalAnalysis: EmotionalAnalysis
  visualAnalysis: VisualAnalysis
  timingAnalysis: TimingAnalysis
  competitorAnalysis: CompetitorAnalysis
  hashtagAnalysis: HashtagAnalysis
}

export interface Prediction {
  expectedEngagement: {
    likes: number
    comments: number
    shares: number
    views: number
    engagementRate: number
  }
  viralProbability: number
  optimalPostingTime: Date
  recommendedHashtags: string[]
  similarViralContent: SimilarContent[]
}

export interface TextAnalysis {
  emotions: string[]
  sentiment: number
  readability: number
  engagementHooks: EngagementHook[]
  platformOptimization: string
  wordCount: number
  characterCount: number
  hashtagCount: number
  mentionCount: number
}

export interface EngagementHook {
  type: string
  score: number
  matched: string
}

export interface ContentFeatures {
  emotionalIntensity: number
  visualScore: number
  timingScore: number
  hookScore: number
  platformScore: number
  hashtagScore: number
  competitorGap: number
}

export interface VisualEnhancements {
  brightness: number
  contrast: number
  saturation: number
  warmth: number
  vibrance: number
  sharpness: number
  textColor: string
  textBackground: string
  fontSize: number
}

export interface AccuracyMetrics {
  overall: number
  likes: number
  comments: number
  shares: number
  engagementRate: number
}

export interface UserInsights {
  averageViralScore: number
  predictionAccuracy: number
  bestPerformingContent: ViralPrediction[]
  improvementAreas: string[]
  trendingTopics: string[]
  optimalPostingTimes: string[]
  contentRecommendations: string[]
}

export interface IndustryBenchmarks {
  averageEngagementRate: number
  viralThreshold: number
  topPerformerMetrics: {
    engagementRate: number
    views: number
    shares: number
  }
  trendingHashtags: string[]
  optimalContentLength: number
  bestPostingTimes: string[]
  contentTypePerformance: Record<string, number>
}
