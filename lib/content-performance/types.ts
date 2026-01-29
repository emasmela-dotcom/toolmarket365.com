// Database Schema - Adapted for Neon/PostgreSQL
export interface ContentPerformance {
  id: string
  user_id: string
  prediction_id: string
  content: {
    id: string
    platform: string
    type: 'image' | 'video' | 'carousel' | 'text'
    text: string
    media_urls: string[]
    hashtags: string[]
    posting_time: string // ISO date string
  }
  prediction: {
    viral_score: number
    expected_engagement: {
      likes: number
      comments: number
      shares: number
      views: number
      engagement_rate: number
    }
    confidence: number
    recommendations: string[]
  }
  actual: {
    likes: number
    comments: number
    shares: number
    views: number
    engagement_rate: number
    reached?: number
    saved?: number
    profile_visits?: number
    website_clicks?: number
  }
  accuracy: {
    overall: number
    likes: number
    comments: number
    shares: number
    views: number
  }
  ab_test?: {
    test_id: string
    variant: 'A' | 'B'
    is_winner: boolean
    improvement: number
  }
  created_at: string
  updated_at: string
}

export interface UserPerformanceMetrics {
  user_id: string
  period: string // 'daily' | 'weekly' | 'monthly'
  date: string
  total_predictions: number
  accurate_predictions: number
  average_accuracy: number
  best_performing_content: string[]
  worst_performing_content: string[]
  content_patterns: ContentPattern[]
  roi: number
  engagement_growth: number
  viral_content_count: number
}

export interface ABTest {
  id: string
  user_id: string
  name: string
  hypothesis: string
  content_id: string
  variants: ABTestVariant[]
  status: 'running' | 'completed' | 'paused'
  start_date: string
  end_date?: string
  winner?: string
  confidence: number
  traffic_split: number // 50 for 50/50 split
  minimum_sample_size: number
  success_metric: 'engagement' | 'reach' | 'viral' | 'conversion'
  results?: ABTestResults
  created_at: string
}

export interface ABTestVariant {
  id: string
  name: string
  content: any
  participants: number
  conversion_rate: number
  engagement_rate: number
  performance_data: any[]
}

export interface ABTestResults {
  variant_a_performance: number
  variant_b_performance: number
  improvement: number
  confidence: number
  statistical_significance: number
}

export interface ContentPattern {
  type: 'emotional' | 'visual' | 'timing' | 'hashtag' | 'format'
  pattern: string
  frequency: number
  average_performance: number
  success_rate: number
  confidence: number
  examples: string[]
}

export interface DashboardData {
  performance: PerformanceData
  accuracy: AccuracyData
  insights: InsightsData
  abTests: ABTestData
  roi: ROIData
}

export interface PerformanceData {
  totalContent: number
  overallAccuracy: number
  accuratePredictions: number
  topPerforming: any[]
  platformBreakdown: any[]
  contentTypeStats: any[]
  performanceTrend: any[]
  insights: {
    working: string[]
    improvement: string[]
  }
  viralRate: number
  contentGrowth: number
}

export interface AccuracyData {
  overallAccuracy: number
  accuracyTrend: number
  averageConfidence: number
  highConfidencePredictions: number
  likesAccuracy: number
  commentsAccuracy: number
  sharesAccuracy: number
  viewsAccuracy: number
  accuracyTrendSeries: any[]
  metricBreakdown: any[]
  confidenceCorrelation: any[]
  highAccuracyFactors: string[]
  improvementAreas: string[]
}

export interface InsightsData {
  patternAnalysis: any[]
  winningContent: any[]
  timingInsights: any[]
  hashtagPerformance: any[]
  recommendations: any[]
}

export interface ABTestData {
  activeTests: any[]
  completedTests: any[]
  activeTestsCount?: number
  completedTestsCount?: number
  averageImprovement: number
  confidence: number
  testInsights: any[]
}

export interface ROIData {
  totalROI: number
  roiTrend: number
  totalRevenue: number
  totalCost: number
  netProfit: number
  efficiencyScore: number
  totalPredictions: number
  successfulPredictions: number
  roiTrendSeries?: any[]
  costBreakdown: any[]
  revenueSources: any[]
  highROIContent: any[]
  mediumROIContent: any[]
  lowROIContent: any[]
  monthlyPredictions: number
  monthlySuccesses: number
  monthlyRevenue: number
  monthlyROI: number
}
