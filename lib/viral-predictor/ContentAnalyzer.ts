import type {
  TextAnalysis,
  VisualAnalysis,
  EngagementHook,
  ContentFeatures
} from './types'

export class ContentAnalyzer {
  
  async analyzeTextContent(text: string, platform: string): Promise<TextAnalysis> {
    // Emotional analysis
    const emotions = this.detectEmotions(text)
    const sentiment = this.analyzeSentiment(text)
    const readability = this.calculateReadability(text)
    const engagementHooks = this.identifyEngagementHooks(text)
    
    // Platform-specific optimization
    const platformOptimization = this.optimizeForPlatform(text, platform)
    
    return {
      emotions,
      sentiment,
      readability,
      engagementHooks,
      platformOptimization,
      wordCount: text.split(/\s+/).filter(w => w.length > 0).length,
      characterCount: text.length,
      hashtagCount: (text.match(/#/g) || []).length,
      mentionCount: (text.match(/@/g) || []).length
    }
  }

  async analyzeVisualContent(mediaUrl: string): Promise<VisualAnalysis> {
    // For now, return default analysis
    // In production, this would analyze actual media files
    return {
      attentionScore: 60,
      colorPsychologyScore: 65,
      compositionScore: 70,
      thumbnailEffectiveness: 75,
      textReadability: 80,
      brandConsistency: 70,
      accessibilityScore: 75
    }
  }

  detectEmotions(text: string): string[] {
    const emotions: string[] = []
    const lowerText = text.toLowerCase()
    
    const emotionPatterns: Record<string, RegExp[]> = {
      joy: [/(happy|joy|excited|amazing|wow|love|great|wonderful)/g],
      sadness: [/(sad|disappointed|upset|frustrated|down|depressed)/g],
      anger: [/(angry|mad|furious|annoyed|frustrated)/g],
      surprise: [/(surprised|shocked|unexpected|wow|incredible)/g],
      fear: [/(scared|afraid|worried|anxious|nervous)/g],
      gratitude: [/(grateful|thankful|blessed|appreciate|thanks)/g],
      anticipation: [/(wait|coming|soon|excited|can't wait)/g]
    }
    
    Object.entries(emotionPatterns).forEach(([emotion, patterns]) => {
      const found = patterns.some(pattern => pattern.test(lowerText))
      if (found) emotions.push(emotion)
    })
    
    return emotions.length > 0 ? emotions : ['neutral']
  }

  analyzeSentiment(text: string): number {
    const positiveWords = [
      'great', 'amazing', 'wonderful', 'excellent', 'fantastic', 'love', 'best', 
      'awesome', 'perfect', 'incredible', 'beautiful', 'happy', 'joy', 'excited'
    ]
    const negativeWords = [
      'bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointing', 
      'frustrating', 'sad', 'angry', 'mad', 'upset'
    ]
    
    const lowerText = text.toLowerCase()
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length
    
    const wordCount = text.split(/\s+/).length
    const score = ((positiveCount - negativeCount) / Math.max(wordCount, 1)) * 100
    
    return Math.max(-100, Math.min(100, score * 20))
  }

  calculateReadability(text: string): number {
    const words = text.split(/\s+/).filter(w => w.length > 0)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const avgWordsPerSentence = words.length / Math.max(sentences.length, 1)
    const avgCharsPerWord = text.replace(/\s/g, '').length / Math.max(words.length, 1)
    
    // Flesch Reading Ease approximation
    // Higher score = easier to read
    let score = 100
    score -= avgWordsPerSentence * 1.015
    score -= avgCharsPerWord * 0.846
    
    return Math.max(0, Math.min(100, score))
  }

  identifyEngagementHooks(text: string): EngagementHook[] {
    const hooks = [
      { pattern: /^(did you know|guess what|you'll never believe|wait until)/i, type: 'curiosity', score: 8 },
      { pattern: /(stop scrolling|wait for it|watch until the end|don't skip)/i, type: 'attention', score: 9 },
      { pattern: /(tag a friend|share if you|comment below|save this|follow)/i, type: 'engagement', score: 7 },
      { pattern: /(shocking|incredible|mind-blowing|unbelievable|you won't believe)/i, type: 'emotion', score: 8 },
      { pattern: /(how to|step by step|tutorial|guide|tips|trick)/i, type: 'educational', score: 6 },
      { pattern: /(before you|if you're|for anyone who|when you)/i, type: 'targeted', score: 7 },
      { pattern: /(this changed|game changer|life hack|secret)/i, type: 'value', score: 8 },
      { pattern: /(POV|relatable|me when|when you realize)/i, type: 'relatability', score: 7 }
    ]

    return hooks
      .filter(hook => hook.pattern.test(text))
      .map(hook => ({
        type: hook.type,
        score: hook.score,
        matched: text.match(hook.pattern)?.[0] || ''
      }))
  }

  optimizeForPlatform(text: string, platform: string): string {
    const optimizations: Record<string, string> = {
      instagram: 'Use 5-10 hashtags, include emojis, ask questions in caption',
      tiktok: 'Keep it short and punchy, use trending sounds, hook in first 3 seconds',
      twitter: 'Keep under 280 chars, use threads for longer content, engage with replies',
      linkedin: 'Professional tone, longer form content, industry insights',
      youtube: 'SEO-optimized titles, engaging thumbnails, clear value proposition'
    }
    
    return optimizations[platform] || 'Optimize for your target audience'
  }

  calculateViralProbability(features: ContentFeatures): number {
    // Weighted scoring algorithm
    const weights = {
      emotionalImpact: 0.25,
      visualAppeal: 0.20,
      timing: 0.15,
      engagementHooks: 0.15,
      platformOptimization: 0.10,
      hashtagStrategy: 0.10,
      competitorGap: 0.05
    }

    let score = 0
    
    // Emotional impact (25%)
    score += features.emotionalIntensity * weights.emotionalImpact
    
    // Visual appeal (20%)
    score += features.visualScore * weights.visualAppeal
    
    // Timing (15%)
    score += features.timingScore * weights.timing
    
    // Engagement hooks (15%)
    score += features.hookScore * weights.engagementHooks
    
    // Platform optimization (10%)
    score += features.platformScore * weights.platformOptimization
    
    // Hashtag strategy (10%)
    score += features.hashtagScore * weights.hashtagStrategy
    
    // Competitor gap (5%)
    score += features.competitorGap * weights.competitorGap

    return Math.min(Math.round(score), 100)
  }
}
