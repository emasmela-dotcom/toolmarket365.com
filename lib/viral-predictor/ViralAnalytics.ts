import { sql } from '@/lib/db'
import type {
  ViralPrediction,
  ActualEngagement,
  AccuracyMetrics,
  UserInsights,
  IndustryBenchmarks
} from './types'

export class ViralAnalytics {
  
  async trackPredictionAccuracy(
    predictionId: string,
    actualPerformance: ActualEngagement
  ): Promise<void> {
    const prediction = await this.getPrediction(predictionId)
    if (!prediction) return
    
    const accuracy = this.calculateAccuracy(
      prediction.prediction.expected_engagement,
      actualPerformance
    )

    await this.updatePredictionAccuracy(predictionId, accuracy)
  }

  private async getPrediction(predictionId: string): Promise<ViralPrediction | null> {
    if (!sql) return null
    
    try {
      const result = await sql`
        SELECT * FROM viral_predictions WHERE id = ${predictionId}
      `
      return result[0] as ViralPrediction || null
    } catch (error) {
      console.error('Error fetching prediction:', error)
      return null
    }
  }

  private calculateAccuracy(
    predicted: {
      likes: number
      comments: number
      shares: number
      views: number
      engagement_rate: number
    },
    actual: ActualEngagement
  ): AccuracyMetrics {
    const likeAccuracy = 1 - Math.abs(predicted.likes - actual.likes) / Math.max(predicted.likes, 1)
    const commentAccuracy = 1 - Math.abs(predicted.comments - actual.comments) / Math.max(predicted.comments, 1)
    const shareAccuracy = 1 - Math.abs(predicted.shares - actual.shares) / Math.max(predicted.shares, 1)
    const engagementRateAccuracy = 1 - Math.abs(predicted.engagement_rate - actual.engagement_rate) / Math.max(predicted.engagement_rate, 0.1)

    return {
      overall: Math.max(0, Math.min(100, (likeAccuracy + commentAccuracy + shareAccuracy + engagementRateAccuracy) / 4 * 100)),
      likes: Math.max(0, Math.min(100, likeAccuracy * 100)),
      comments: Math.max(0, Math.min(100, commentAccuracy * 100)),
      shares: Math.max(0, Math.min(100, shareAccuracy * 100)),
      engagementRate: Math.max(0, Math.min(100, engagementRateAccuracy * 100))
    }
  }

  private async updatePredictionAccuracy(predictionId: string, accuracy: AccuracyMetrics): Promise<void> {
    if (!sql) return
    
    try {
      await sql`
        UPDATE viral_predictions
        SET performance = jsonb_set(
          COALESCE(performance, '{}'::jsonb),
          '{accuracy_score}',
          ${accuracy.overall}::text::jsonb
        )
        WHERE id = ${predictionId}
      `
    } catch (error) {
      console.error('Error updating prediction accuracy:', error)
    }
  }

  async generateUserInsights(userId: string): Promise<UserInsights> {
    const predictions = await this.getUserPredictions(userId)
    const performance = await this.getUserPerformance(userId)

    return {
      averageViralScore: this.calculateAverageViralScore(predictions),
      predictionAccuracy: this.calculateAverageAccuracy(predictions),
      bestPerformingContent: this.findBestContent(predictions),
      improvementAreas: this.identifyImprovementAreas(predictions),
      trendingTopics: this.analyzeTrendingTopics(predictions),
      optimalPostingTimes: this.calculateOptimalTimes(predictions),
      contentRecommendations: this.generateRecommendations(predictions, performance)
    }
  }

  private async getUserPredictions(userId: string): Promise<ViralPrediction[]> {
    if (!sql) return []
    
    try {
      const result = await sql`
        SELECT * FROM viral_predictions 
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT 100
      `
      return result as ViralPrediction[]
    } catch (error) {
      console.error('Error fetching user predictions:', error)
      return []
    }
  }

  private async getUserPerformance(userId: string): Promise<any> {
    // In production, this would fetch actual performance data
    return {}
  }

  private calculateAverageViralScore(predictions: ViralPrediction[]): number {
    if (predictions.length === 0) return 0
    const sum = predictions.reduce((acc, p) => acc + (p.analysis.viral_score || 0), 0)
    return Math.round(sum / predictions.length)
  }

  private calculateAverageAccuracy(predictions: ViralPrediction[]): number {
    const withAccuracy = predictions.filter(p => p.performance?.accuracy_score)
    if (withAccuracy.length === 0) return 0
    const sum = withAccuracy.reduce((acc, p) => acc + (p.performance!.accuracy_score || 0), 0)
    return Math.round(sum / withAccuracy.length)
  }

  private findBestContent(predictions: ViralPrediction[]): ViralPrediction[] {
    return predictions
      .filter(p => p.performance?.accuracy_score && p.performance.accuracy_score > 70)
      .sort((a, b) => (b.analysis.viral_score || 0) - (a.analysis.viral_score || 0))
      .slice(0, 5)
  }

  private identifyImprovementAreas(predictions: ViralPrediction[]): string[] {
    const areas: string[] = []
    
    const avgScore = this.calculateAverageViralScore(predictions)
    if (avgScore < 50) {
      areas.push('Overall viral score is low - focus on emotional triggers and engagement hooks')
    }
    
    const lowEmotional = predictions.filter(p => 
      (p.analysis.emotional_analysis?.shareability_score || 0) < 60
    ).length
    if (lowEmotional > predictions.length * 0.5) {
      areas.push('Emotional engagement needs improvement - add more relatable and surprising elements')
    }
    
    return areas
  }

  private analyzeTrendingTopics(predictions: ViralPrediction[]): string[] {
    // Extract common keywords from predictions
    const topics: string[] = []
    // In production, this would analyze text content
    return topics
  }

  private calculateOptimalTimes(predictions: ViralPrediction[]): string[] {
    const times = predictions
      .map(p => p.prediction.optimal_posting_time)
      .filter(Boolean)
      .slice(0, 5)
    return times
  }

  private generateRecommendations(predictions: ViralPrediction[], performance: any): string[] {
    const recommendations: string[] = []
    
    if (predictions.length < 10) {
      recommendations.push('Create more content to improve prediction accuracy')
    }
    
    recommendations.push('Post during optimal times for better engagement')
    recommendations.push('Use recommended hashtags to increase reach')
    
    return recommendations
  }

  async getIndustryBenchmarks(
    platform: string,
    niche: string
  ): Promise<IndustryBenchmarks> {
    // In production, this would calculate from actual data
    return {
      averageEngagementRate: 3.5,
      viralThreshold: 10.0,
      topPerformerMetrics: {
        engagementRate: 8.5,
        views: 100000,
        shares: 5000
      },
      trendingHashtags: ['viral', 'trending', 'fyp', 'explore'],
      optimalContentLength: 150,
      bestPostingTimes: ['9:00 AM', '12:00 PM', '5:00 PM', '7:00 PM'],
      contentTypePerformance: {
        video: 8.5,
        image: 5.2,
        carousel: 6.8,
        reel: 9.2
      }
    }
  }
}
