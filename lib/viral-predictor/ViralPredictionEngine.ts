import { sql } from '@/lib/db'
import type {
  ContentInput,
  ViralPrediction,
  EmotionalAnalysis,
  VisualAnalysis,
  TimingAnalysis,
  CompetitorAnalysis,
  HashtagAnalysis,
  AnalysisResults,
  Prediction
} from './types'

export class ViralPredictionEngine {
  private platform: string

  constructor(platform: string) {
    this.platform = platform
  }

  async predictViralPotential(
    content: ContentInput,
    userId: string,
    niche: string = 'general'
  ): Promise<ViralPrediction> {
    
    // Parallel analysis for speed
    const [
      emotionalAnalysis,
      visualAnalysis,
      timingAnalysis,
      competitorAnalysis,
      hashtagAnalysis
    ] = await Promise.all([
      this.analyzeEmotionalTriggers(content),
      this.analyzeVisualElements(content),
      this.analyzeTimingFactors(content),
      this.analyzeCompetitorLandscape(content, niche),
      this.analyzeHashtagEffectiveness(content)
    ])

    // Calculate composite viral score
    const viralScore = this.calculateViralScore({
      emotionalAnalysis,
      visualAnalysis,
      timingAnalysis,
      competitorAnalysis,
      hashtagAnalysis
    })

    // Generate predictions
    const prediction = await this.generatePredictions(
      viralScore,
      content,
      {
        emotionalAnalysis,
        visualAnalysis,
        timingAnalysis,
        competitorAnalysis,
        hashtagAnalysis
      }
    )

    // Store prediction in database
    const predictionData = {
      user_id: userId,
      content: {
        text: content.text,
        media_urls: content.mediaUrls || [],
        media_type: content.mediaType,
        platform: content.platform
      },
      analysis: {
        viral_score: viralScore,
        confidence: this.calculateConfidence(prediction),
        emotional_analysis: emotionalAnalysis,
        visual_analysis: visualAnalysis,
        timing_analysis: timingAnalysis,
        competitor_analysis: competitorAnalysis,
        hashtag_analysis: hashtagAnalysis,
        risk_factors: this.identifyRiskFactors(prediction),
        opportunities: this.identifyOpportunities(prediction)
      },
      prediction: {
        expected_engagement: {
          likes: prediction.expectedEngagement.likes,
          comments: prediction.expectedEngagement.comments,
          shares: prediction.expectedEngagement.shares,
          views: prediction.expectedEngagement.views,
          engagement_rate: prediction.expectedEngagement.engagementRate
        },
        viral_probability: prediction.viralProbability,
        optimal_posting_time: prediction.optimalPostingTime.toISOString(),
        recommended_hashtags: prediction.recommendedHashtags,
        similar_viral_content: prediction.similarViralContent
      },
      created_at: new Date().toISOString()
    }

    // Store in database if available
    if (sql) {
      try {
        // Neon's sql template tag automatically converts JavaScript objects to JSONB
        // Pass objects directly - Neon handles JSONB conversion
        const result = await sql`
          INSERT INTO viral_predictions (
            user_id, content, analysis, prediction, created_at
          ) VALUES (
            ${predictionData.user_id},
            ${JSON.stringify(predictionData.content)}::jsonb,
            ${JSON.stringify(predictionData.analysis)}::jsonb,
            ${JSON.stringify(predictionData.prediction)}::jsonb,
            ${predictionData.created_at}
          )
          RETURNING id
        `
        return {
          id: result[0].id,
          ...predictionData
        } as ViralPrediction
      } catch (error) {
        console.error('Database error:', error)
        // Return without database ID if storage fails
      }
    }
    
    return {
      id: `temp-${Date.now()}`,
      ...predictionData
    } as ViralPrediction
  }

  private async analyzeEmotionalTriggers(content: ContentInput): Promise<EmotionalAnalysis> {
    // Analyze text for emotional triggers
    const text = content.text.toLowerCase()
    
    // Detect primary emotions
    const emotions: string[] = []
    if (text.match(/(happy|joy|excited|amazing|wow|love)/)) emotions.push('joy')
    if (text.match(/(sad|disappointed|upset|frustrated)/)) emotions.push('sadness')
    if (text.match(/(angry|mad|furious|annoyed)/)) emotions.push('anger')
    if (text.match(/(surprised|shocked|unexpected|wow)/)) emotions.push('surprise')
    if (text.match(/(scared|afraid|worried|anxious)/)) emotions.push('fear')
    if (text.match(/(grateful|thankful|blessed|appreciate)/)) emotions.push('gratitude')
    
    // Calculate scores based on content analysis
    const emotionalIntensity = this.calculateEmotionalIntensity(text)
    const sentimentScore = this.calculateSentiment(text)
    const empathyScore = this.calculateEmpathyScore(text)
    const surpriseFactor = this.calculateSurpriseFactor(text)
    const controversyRisk = this.calculateControversyRisk(text)
    const shareabilityScore = this.calculateShareability(text, emotionalIntensity, surpriseFactor)

    return {
      primaryEmotions: emotions.length > 0 ? emotions : ['neutral'],
      emotionalIntensity,
      sentimentScore,
      empathyScore,
      surpriseFactor,
      controversyRisk,
      shareabilityScore
    }
  }

  private calculateEmotionalIntensity(text: string): number {
    const intensityWords = text.match(/(very|extremely|incredibly|absolutely|totally|completely)/g) || []
    const exclamations = (text.match(/!/g) || []).length
    const capsWords = (text.match(/\b[A-Z]{3,}\b/g) || []).length
    
    return Math.min(100, 40 + (intensityWords.length * 10) + (exclamations * 5) + (capsWords * 8))
  }

  private calculateSentiment(text: string): number {
    const positiveWords = (text.match(/(great|amazing|wonderful|excellent|fantastic|love|best|awesome|perfect|incredible)/g) || []).length
    const negativeWords = (text.match(/(bad|terrible|awful|hate|worst|horrible|disappointing|frustrating)/g) || []).length
    
    const score = ((positiveWords - negativeWords) / Math.max(text.split(' ').length, 1)) * 100
    return Math.max(-100, Math.min(100, score * 10))
  }

  private calculateEmpathyScore(text: string): number {
    const empathyTriggers = (text.match(/(feel|understand|relate|experience|struggle|challenge|journey)/g) || []).length
    const questionCount = (text.match(/\?/g) || []).length
    const personalPronouns = (text.match(/(you|your|we|our|us)/g) || []).length
    
    return Math.min(100, 30 + (empathyTriggers * 15) + (questionCount * 10) + (personalPronouns * 5))
  }

  private calculateSurpriseFactor(text: string): number {
    const surpriseWords = (text.match(/(unexpected|surprising|shocking|never|didn't know|reveal|secret)/g) || []).length
    const numbers = (text.match(/\d+/g) || []).length
    const questions = (text.match(/\?/g) || []).length
    
    return Math.min(100, 20 + (surpriseWords * 20) + (numbers * 5) + (questions * 8))
  }

  private calculateControversyRisk(text: string): number {
    const controversialWords = (text.match(/(controversial|debate|argument|disagree|against|oppose)/g) || []).length
    const strongOpinions = (text.match(/(should|must|always|never|everyone|nobody)/g) || []).length
    
    return Math.min(100, controversialWords * 25 + strongOpinions * 10)
  }

  private calculateShareability(text: string, emotionalIntensity: number, surpriseFactor: number): number {
    const callToAction = (text.match(/(share|tag|comment|save|follow|like)/g) || []).length
    const hashtags = (text.match(/#/g) || []).length
    
    return Math.min(100, 
      (emotionalIntensity * 0.4) + 
      (surpriseFactor * 0.3) + 
      (callToAction * 10) + 
      (hashtags * 5)
    )
  }

  private async analyzeVisualElements(content: ContentInput): Promise<VisualAnalysis> {
    if (!content.mediaUrls || content.mediaUrls.length === 0) {
      return this.getDefaultVisualAnalysis()
    }

    // For now, return simulated analysis based on content type
    // In production, this would analyze actual media files
    const mediaTypeMultiplier = {
      video: 1.2,
      reel: 1.3,
      carousel: 1.1,
      image: 1.0
    }

    const multiplier = mediaTypeMultiplier[content.mediaType] || 1.0

    return {
      attentionScore: Math.min(100, 50 + Math.random() * 30 * multiplier),
      colorPsychologyScore: Math.min(100, 60 + Math.random() * 25 * multiplier),
      compositionScore: Math.min(100, 55 + Math.random() * 30 * multiplier),
      thumbnailEffectiveness: Math.min(100, 50 + Math.random() * 35 * multiplier),
      textReadability: Math.min(100, 70 + Math.random() * 20),
      brandConsistency: Math.min(100, 60 + Math.random() * 25),
      accessibilityScore: Math.min(100, 65 + Math.random() * 25)
    }
  }

  private getDefaultVisualAnalysis(): VisualAnalysis {
    return {
      attentionScore: 50,
      colorPsychologyScore: 50,
      compositionScore: 50,
      thumbnailEffectiveness: 50,
      textReadability: 75,
      brandConsistency: 50,
      accessibilityScore: 60
    }
  }

  private async analyzeTimingFactors(content: ContentInput): Promise<TimingAnalysis> {
    const now = new Date()
    
    // Get trending data
    const trendingScore = await this.getTrendingScore(content)
    const seasonalScore = await this.getSeasonalRelevance(content)
    
    // Calculate optimal posting times
    const optimalTimes = await this.calculateOptimalPostingTimes(content)
    
    return {
      currentTrendingScore: trendingScore,
      seasonalRelevance: seasonalScore,
      dayOfWeekScore: this.getDayOfWeekScore(now),
      timeOfDayScore: this.getTimeOfDayScore(now),
      timezoneOptimization: optimalTimes.timezones,
      competitorActivity: await this.getCompetitorActivityScore(content)
    }
  }

  private async getTrendingScore(content: ContentInput): Promise<number> {
    // Check for trending keywords in content
    const trendingKeywords = ['viral', 'trending', 'now', 'latest', 'new', '2024', '2025']
    const text = content.text.toLowerCase()
    const matches = trendingKeywords.filter(keyword => text.includes(keyword)).length
    
    return Math.min(100, 40 + (matches * 15))
  }

  private async getSeasonalRelevance(content: ContentInput): Promise<number> {
    const now = new Date()
    const month = now.getMonth() + 1
    const text = content.text.toLowerCase()
    
    const seasonalTerms: Record<number, string[]> = {
      12: ['christmas', 'holiday', 'winter', 'new year'],
      1: ['new year', 'resolution', 'fresh start', 'winter'],
      2: ['valentine', 'love', 'february'],
      3: ['spring', 'march', 'st patrick'],
      4: ['easter', 'spring', 'april'],
      5: ['mother', 'may', 'spring'],
      6: ['summer', 'father', 'june'],
      7: ['summer', 'july', 'independence'],
      8: ['summer', 'august', 'back to school'],
      9: ['fall', 'september', 'back to school'],
      10: ['halloween', 'october', 'fall'],
      11: ['thanksgiving', 'november', 'fall']
    }
    
    const currentTerms = seasonalTerms[month] || []
    const matches = currentTerms.filter(term => text.includes(term)).length
    
    return Math.min(100, 50 + (matches * 20))
  }

  private async calculateOptimalPostingTimes(content: ContentInput): Promise<{ timezones: string[] }> {
    // Platform-specific optimal times
    const platformTimes: Record<string, string[]> = {
      instagram: ['9:00 AM', '12:00 PM', '5:00 PM', '7:00 PM'],
      tiktok: ['6:00 AM', '10:00 AM', '7:00 PM', '9:00 PM'],
      twitter: ['8:00 AM', '12:00 PM', '3:00 PM', '5:00 PM'],
      linkedin: ['8:00 AM', '12:00 PM', '5:00 PM'],
      youtube: ['2:00 PM', '8:00 PM', '10:00 PM']
    }
    
    return {
      timezones: platformTimes[content.platform] || ['12:00 PM', '6:00 PM']
    }
  }

  private getDayOfWeekScore(date: Date): number {
    const day = date.getDay()
    // Tuesday-Thursday typically perform better
    const dayScores: Record<number, number> = {
      0: 60, // Sunday
      1: 75, // Monday
      2: 85, // Tuesday
      3: 90, // Wednesday
      4: 85, // Thursday
      5: 70, // Friday
      6: 65  // Saturday
    }
    return dayScores[day] || 70
  }

  private getTimeOfDayScore(date: Date): number {
    const hour = date.getHours()
    // Peak hours: 9-11 AM, 12-2 PM, 5-7 PM
    if ((hour >= 9 && hour <= 11) || (hour >= 12 && hour <= 14) || (hour >= 17 && hour <= 19)) {
      return 85
    }
    if (hour >= 6 && hour <= 22) {
      return 70
    }
    return 50
  }

  private async getCompetitorActivityScore(content: ContentInput): Promise<number> {
    // Simulated competitor activity score
    // In production, this would analyze competitor posting patterns
    return 60 + Math.random() * 20
  }

  private async analyzeCompetitorLandscape(content: ContentInput, niche: string): Promise<CompetitorAnalysis> {
    return {
      similarContentPerformance: [],
      contentGapOpportunities: this.generateContentGapOpportunities(content),
      trendingHashtagsInNiche: this.extractHashtags(content.text),
      engagementBenchmarks: {
        averageEngagementRate: 3.5,
        topPerformerRate: 8.5,
        viralThreshold: 10.0
      },
      viralThreshold: 10.0
    }
  }

  private generateContentGapOpportunities(content: ContentInput): string[] {
    const opportunities = []
    if (!content.text.includes('?')) {
      opportunities.push('Add engaging questions to increase comments')
    }
    if ((content.text.match(/#/g) || []).length < 5) {
      opportunities.push('Add more relevant hashtags (5-10 recommended)')
    }
    if (content.text.length < 100) {
      opportunities.push('Consider longer captions for better engagement')
    }
    if (!content.text.match(/(tag|share|comment|save)/i)) {
      opportunities.push('Include a call-to-action to boost engagement')
    }
    return opportunities
  }

  private extractHashtags(text: string): string[] {
    const hashtags = text.match(/#\w+/g) || []
    return hashtags.map(tag => tag.substring(1))
  }

  private async analyzeHashtagEffectiveness(content: ContentInput): Promise<HashtagAnalysis> {
    const hashtags = this.extractHashtags(content.text)
    const recommended = this.generateRecommendedHashtags(content)
    
    return {
      overallScore: Math.min(100, 50 + (hashtags.length * 5) + (recommended.length * 3)),
      recommendedHashtags: recommended,
      trendingHashtags: this.getTrendingHashtags(content.platform),
      nicheHashtags: this.getNicheHashtags(content.platform),
      viralPotentialHashtags: recommended.slice(0, 5)
    }
  }

  private generateRecommendedHashtags(content: ContentInput): string[] {
    const baseHashtags = []
    const text = content.text.toLowerCase()
    
    // Extract keywords
    const words = text.split(/\s+/).filter(w => w.length > 4)
    words.forEach(word => {
      if (!word.startsWith('#') && !word.startsWith('@')) {
        baseHashtags.push(word.replace(/[^a-z0-9]/g, ''))
      }
    })
    
    // Platform-specific hashtags
    const platformTags: Record<string, string[]> = {
      instagram: ['instagood', 'photooftheday', 'instadaily', 'picoftheday', 'beautiful'],
      tiktok: ['fyp', 'foryou', 'viral', 'trending', 'foryoupage'],
      twitter: ['trending', 'viral', 'news', 'breaking'],
      linkedin: ['leadership', 'business', 'innovation', 'professional', 'career'],
      youtube: ['subscribe', 'youtube', 'video', 'content', 'creator']
    }
    
    return [...baseHashtags.slice(0, 5), ...(platformTags[content.platform] || [])].slice(0, 10)
  }

  private getTrendingHashtags(platform: string): string[] {
    const trending: Record<string, string[]> = {
      instagram: ['reels', 'viral', 'trending', 'fyp', 'explore'],
      tiktok: ['fyp', 'viral', 'trending', 'foryou', 'foryoupage'],
      twitter: ['trending', 'viral', 'breaking', 'news'],
      linkedin: ['innovation', 'leadership', 'business', 'career'],
      youtube: ['shorts', 'viral', 'trending', 'subscribe']
    }
    return trending[platform] || []
  }

  private getNicheHashtags(platform: string): string[] {
    // Generic niche hashtags - in production, this would be niche-specific
    return ['content', 'creator', 'socialmedia', 'marketing', 'digital']
  }

  private calculateViralScore(analyses: AnalysisResults): number {
    const weights = {
      emotional: 0.25,
      visual: 0.20,
      timing: 0.20,
      competitor: 0.15,
      hashtag: 0.10,
      platform: 0.10
    }

    const scores = {
      emotional: analyses.emotionalAnalysis.shareabilityScore,
      visual: this.averageVisualScore(analyses.visualAnalysis),
      timing: this.averageTimingScore(analyses.timingAnalysis),
      competitor: Math.max(0, 100 - analyses.competitorAnalysis.viralThreshold * 10),
      hashtag: analyses.hashtagAnalysis.overallScore,
      platform: this.getPlatformOptimizationScore()
    }

    return Math.round(Object.entries(weights).reduce((total, [key, weight]) => {
      return total + (scores[key as keyof typeof scores] * weight)
    }, 0))
  }

  private averageVisualScore(visual: VisualAnalysis): number {
    return (
      visual.attentionScore +
      visual.colorPsychologyScore +
      visual.compositionScore +
      visual.thumbnailEffectiveness +
      visual.textReadability +
      visual.brandConsistency +
      visual.accessibilityScore
    ) / 7
  }

  private averageTimingScore(timing: TimingAnalysis): number {
    return (
      timing.currentTrendingScore +
      timing.seasonalRelevance +
      timing.dayOfWeekScore +
      timing.timeOfDayScore +
      timing.competitorActivity
    ) / 5
  }

  private getPlatformOptimizationScore(): number {
    // Platform-specific optimization score
    const platformScores: Record<string, number> = {
      tiktok: 85,
      instagram: 80,
      youtube: 75,
      twitter: 70,
      linkedin: 75
    }
    return platformScores[this.platform] || 70
  }

  private async generatePredictions(
    viralScore: number,
    content: ContentInput,
    analyses: AnalysisResults
  ): Promise<Prediction> {
    // Generate engagement predictions based on score
    const baseEngagement = await this.getBaseEngagementPrediction(content)
    const viralMultiplier = viralScore / 50 // Normalize to 0-2x multiplier
    
    return {
      expectedEngagement: {
        likes: Math.round(baseEngagement.likes * viralMultiplier),
        comments: Math.round(baseEngagement.comments * viralMultiplier),
        shares: Math.round(baseEngagement.shares * viralMultiplier),
        views: Math.round(baseEngagement.views * viralMultiplier),
        engagementRate: Math.min(100, baseEngagement.engagementRate * viralMultiplier)
      },
      viralProbability: Math.min(viralScore, 95), // Cap at 95%
      optimalPostingTime: this.calculateOptimalPostingTime(analyses.timingAnalysis),
      recommendedHashtags: analyses.hashtagAnalysis.recommendedHashtags,
      similarViralContent: await this.findSimilarViralContent(content)
    }
  }

  private async getBaseEngagementPrediction(content: ContentInput): Promise<{
    likes: number
    comments: number
    shares: number
    views: number
    engagementRate: number
  }> {
    // Base engagement varies by platform
    const platformBases: Record<string, { likes: number; comments: number; shares: number; views: number; engagementRate: number }> = {
      instagram: { likes: 500, comments: 50, shares: 25, views: 1000, engagementRate: 5.0 },
      tiktok: { likes: 1000, comments: 100, shares: 200, views: 5000, engagementRate: 8.0 },
      youtube: { likes: 200, comments: 30, shares: 50, views: 2000, engagementRate: 4.0 },
      twitter: { likes: 100, comments: 20, shares: 50, views: 500, engagementRate: 3.0 },
      linkedin: { likes: 150, comments: 40, shares: 30, views: 800, engagementRate: 5.5 }
    }
    
    return platformBases[content.platform] || { likes: 300, comments: 40, shares: 30, views: 1000, engagementRate: 4.5 }
  }

  private calculateOptimalPostingTime(timingAnalysis: TimingAnalysis): Date {
    // Calculate optimal posting time based on analysis
    const now = new Date()
    // Add hours to get to optimal time (e.g., 5 PM)
    now.setHours(17, 0, 0, 0)
    return now
  }

  private async findSimilarViralContent(content: ContentInput): Promise<any[]> {
    // In production, this would search for similar viral content
    return []
  }

  private calculateConfidence(prediction: Prediction): number {
    // Confidence based on prediction strength
    const engagementVariance = (
      Math.abs(prediction.expectedEngagement.likes - prediction.expectedEngagement.comments) +
      Math.abs(prediction.expectedEngagement.comments - prediction.expectedEngagement.shares)
    ) / Math.max(prediction.expectedEngagement.likes, 1)
    
    return Math.max(50, Math.min(100, 100 - (engagementVariance * 10)))
  }

  private identifyRiskFactors(prediction: Prediction): string[] {
    const risks: string[] = []
    
    if (prediction.viralProbability < 50) {
      risks.push('Low viral probability - content may need optimization')
    }
    if (prediction.expectedEngagement.engagementRate < 3) {
      risks.push('Low expected engagement rate')
    }
    if (prediction.recommendedHashtags.length < 5) {
      risks.push('Insufficient hashtag strategy')
    }
    
    return risks
  }

  private identifyOpportunities(prediction: Prediction): string[] {
    const opportunities: string[] = []
    
    if (prediction.viralProbability > 70) {
      opportunities.push('High viral potential - consider boosting this content')
    }
    if (prediction.expectedEngagement.engagementRate > 5) {
      opportunities.push('Strong engagement potential - engage with comments quickly')
    }
    if (prediction.recommendedHashtags.length > 7) {
      opportunities.push('Good hashtag coverage - maximize reach')
    }
    
    return opportunities
  }
}
