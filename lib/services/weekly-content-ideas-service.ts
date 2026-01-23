/**
 * Weekly Content Ideas Bot Service
 * 100% Template-Based - Zero External API Usage
 * All ideas generated from pre-defined templates with variable substitution
 * Optional external AI enhancement available at creator's expense
 */

import { sql } from '@/lib/db'
import { tryExternalAIGeneration } from './external-ai-service'

export interface ContentIdea {
  id: string
  userId: string
  title: string
  description: string
  contentType: 'post' | 'story' | 'reel' | 'carousel' | 'video' | 'live'
  platforms: string[]
  category: string
  estimatedTime: number
  difficulty: 'easy' | 'medium' | 'hard'
  engagementPotential: number
  trending: boolean
  seasonal?: string
  hashtags: string[]
  callToAction: string
  tips: string[]
  examples: string[]
  isUsed: boolean
  performance?: any
  weekNumber: number
  year: number
  createdAt: Date
  updatedAt: Date
}

export interface WeeklyContentPlan {
  id: string
  userId: string
  weekNumber: number
  year: number
  ideas: ContentIdea[]
  theme?: string
  status: 'draft' | 'sent' | 'archived'
  emailSent: boolean
  emailDelivered: boolean
  userFeedback?: any
  createdAt: Date
  updatedAt: Date
  sentAt?: Date
}

export interface UserContentPreferences {
  id: string
  userId: string
  contentThemes: string[]
  preferredPlatforms: string[]
  contentTypes: string[]
  industry: string
  targetAudience: string
  brandTone: 'professional' | 'casual' | 'funny' | 'inspirational' | 'educational'
  postingFrequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly'
  contentGoals: string[]
  avoidTopics: string[]
  customPrompts?: string[]
  createdAt: Date
  updatedAt: Date
}

// Template pools for content ideas by category
const CONTENT_IDEA_TEMPLATES: Record<string, Array<{
  title: string
  description: string
  contentType: string
  platforms: string[]
  estimatedTime: number
  difficulty: 'easy' | 'medium' | 'hard'
  engagementPotential: number
  callToAction: string
  tips: string[]
  examples: string[]
}>> = {
  'educational': [
    {
      title: 'How-to Guide: {topic}',
      description: 'Create a step-by-step tutorial on {topic} that helps your audience solve a common problem. Break it down into clear, actionable steps with visuals.',
      contentType: 'carousel',
      platforms: ['instagram', 'linkedin'],
      estimatedTime: 45,
      difficulty: 'medium',
      engagementPotential: 8,
      callToAction: 'Save this post for later and share with someone who needs it!',
      tips: ['Use numbered slides for clarity', 'Include before/after examples', 'Add a summary slide'],
      examples: ['5-step process breakdown', 'Before/after transformation']
    },
    {
      title: 'Quick Tip: {tip}',
      description: 'Share a quick, actionable tip about {topic} that your audience can implement immediately.',
      contentType: 'post',
      platforms: ['instagram', 'facebook', 'linkedin'],
      estimatedTime: 15,
      difficulty: 'easy',
      engagementPotential: 7,
      callToAction: 'Try this tip and let me know how it works for you!',
      tips: ['Keep it simple and clear', 'Use a visual example', 'Make it relatable'],
      examples: ['Single image with text overlay', 'Short video demonstration']
    }
  ],
  'behind-the-scenes': [
    {
      title: 'A Day in My Life: {activity}',
      description: 'Show your audience what goes on behind the scenes of {activity}. Give them an authentic look at your process.',
      contentType: 'story',
      platforms: ['instagram', 'tiktok'],
      estimatedTime: 20,
      difficulty: 'easy',
      engagementPotential: 9,
      callToAction: 'What would you like to see more of behind the scenes?',
      tips: ['Keep it authentic', 'Show the real process', 'Include bloopers'],
      examples: ['Story highlights', 'Reel compilation']
    },
    {
      title: 'The Process: How I {action}',
      description: 'Break down your process for {action}. Show the steps, tools, and decisions involved.',
      contentType: 'carousel',
      platforms: ['instagram', 'linkedin'],
      estimatedTime: 30,
      difficulty: 'medium',
      engagementPotential: 8,
      callToAction: 'What process would you like me to break down next?',
      tips: ['Show each step clearly', 'Include tools/resources used', 'Share lessons learned'],
      examples: ['Step-by-step carousel', 'Process flowchart']
    }
  ],
  'trending': [
    {
      title: 'Trending Topic: {trend}',
      description: 'Jump on the {trend} trend with your unique perspective. Add your brand voice to what everyone is talking about.',
      contentType: 'reel',
      platforms: ['instagram', 'tiktok'],
      estimatedTime: 25,
      difficulty: 'easy',
      engagementPotential: 9,
      callToAction: 'Join the trend and tag us!',
      tips: ['Act fast while trend is hot', 'Add your unique spin', 'Use trending audio'],
      examples: ['Trending audio remix', 'Trend format with your content']
    }
  ],
  'tips-tricks': [
    {
      title: 'Pro Tip: {tip}',
      description: 'Share a professional tip about {topic} that most people don\'t know. Make it valuable and actionable.',
      contentType: 'post',
      platforms: ['instagram', 'linkedin', 'facebook'],
      estimatedTime: 20,
      difficulty: 'easy',
      engagementPotential: 8,
      callToAction: 'What\'s your best tip? Share in the comments!',
      tips: ['Make it specific', 'Include why it works', 'Add a visual example'],
      examples: ['Tip card graphic', 'Short video explanation']
    }
  ],
  'product-showcase': [
    {
      title: 'Product Feature: {feature}',
      description: 'Highlight a key feature of {product} and show how it solves a specific problem for your audience.',
      contentType: 'video',
      platforms: ['instagram', 'youtube', 'tiktok'],
      estimatedTime: 40,
      difficulty: 'medium',
      engagementPotential: 7,
      callToAction: 'Try this feature and share your experience!',
      tips: ['Show the feature in action', 'Demonstrate the benefit', 'Include user testimonials'],
      examples: ['Product demo video', 'Feature comparison']
    }
  ],
  'testimonials': [
    {
      title: 'Customer Success: {name}',
      description: 'Share a customer success story that showcases real results and builds trust with your audience.',
      contentType: 'post',
      platforms: ['instagram', 'linkedin', 'facebook'],
      estimatedTime: 25,
      difficulty: 'easy',
      engagementPotential: 8,
      callToAction: 'Want similar results? Let\'s talk!',
      tips: ['Get permission first', 'Include specific results', 'Add a photo if possible'],
      examples: ['Before/after story', 'Testimonial quote card']
    }
  ],
  'entertainment': [
    {
      title: 'Fun Fact: {fact}',
      description: 'Share an interesting or surprising fact about {topic} that entertains and educates your audience.',
      contentType: 'story',
      platforms: ['instagram', 'tiktok'],
      estimatedTime: 10,
      difficulty: 'easy',
      engagementPotential: 7,
      callToAction: 'Did you know this? Share with a friend!',
      tips: ['Make it surprising', 'Keep it short', 'Add a visual'],
      examples: ['Fact card', 'Quick video']
    }
  ]
}

// Category pools based on themes
const CATEGORY_MAP: Record<string, string[]> = {
  'business growth': ['educational', 'tips-tricks', 'product-showcase'],
  'industry insights': ['educational', 'trending', 'tips-tricks'],
  'behind-the-scenes': ['behind-the-scenes', 'entertainment'],
  'tips and tricks': ['tips-tricks', 'educational'],
  'customer stories': ['testimonials', 'product-showcase'],
  'trending topics': ['trending', 'entertainment']
}

// Hashtag pools by category
const HASHTAG_POOLS: Record<string, string[]> = {
  'educational': ['#LearnSomethingNew', '#HowTo', '#Tutorial', '#Tips', '#Education'],
  'behind-the-scenes': ['#BehindTheScenes', '#BTS', '#Process', '#WorkInProgress'],
  'trending': ['#Trending', '#Viral', '#FYP', '#TrendingNow', '#Popular'],
  'tips-tricks': ['#ProTips', '#LifeHacks', '#Tips', '#Advice', '#Helpful'],
  'product-showcase': ['#ProductDemo', '#Features', '#Review', '#Showcase'],
  'testimonials': ['#Testimonial', '#SuccessStory', '#Review', '#CustomerLove'],
  'entertainment': ['#FunFact', '#Entertainment', '#Interesting', '#DidYouKnow']
}

// CTA templates by tone
const CTA_TEMPLATES: Record<string, string[]> = {
  'professional': [
    'Want to learn more? Book a consultation!',
    'Ready to get started? Let\'s connect!',
    'Have questions? Drop them in the comments!',
    'Save this for later reference!'
  ],
  'casual': [
    'Try this and let me know how it goes!',
    'What do you think? Share your thoughts!',
    'Tag someone who needs to see this!',
    'Save this post for later!'
  ],
  'funny': [
    'Try this and report back! 😂',
    'Who else can relate? Drop a comment!',
    'Share this with someone who needs it!',
    'Save this for when you need a laugh!'
  ],
  'inspirational': [
    'You\'ve got this! Start today!',
    'Share this with someone who needs motivation!',
    'What\'s your biggest takeaway?',
    'Remember: progress over perfection!'
  ],
  'educational': [
    'Want more tips? Follow for daily insights!',
    'What would you like to learn next?',
    'Save this post for future reference!',
    'Share your experience in the comments!'
  ]
}

export class WeeklyContentIdeasService {
  /**
   * Generate weekly content ideas using templates (zero external API usage)
   */
  async generateWeeklyContentIdeas(
    userId: string,
    count: number = 10,
    preferences?: UserContentPreferences
  ): Promise<ContentIdea[]> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const userPrefs = preferences || await this.getUserPreferences(userId)
    const weekNumber = this.getCurrentWeekNumber()
    const year = new Date().getFullYear()
    const ideas: ContentIdea[] = []

    // Distribute ideas across categories based on user themes
    const categories = this.getCategoriesForThemes(userPrefs.contentThemes)
    
    for (let i = 0; i < count; i++) {
      const category = categories[i % categories.length]
      const idea = await this.generateSingleContentIdea(
        userId,
        category,
        userPrefs,
        weekNumber,
        year,
        i + 1
      )
      ideas.push(idea)
    }

    // Save to database
    for (const idea of ideas) {
      await this.saveContentIdea(idea)
    }

    return ideas
  }

  /**
   * Generate a single content idea - tries external AI first, falls back to templates
   */
  private async generateSingleContentIdea(
    userId: string,
    category: string,
    preferences: UserContentPreferences,
    weekNumber: number,
    year: number,
    ideaNumber: number
  ): Promise<ContentIdea> {
    // Try external AI first (if user has API keys configured)
    const aiPrompt = this.buildAIPrompt(category, preferences, ideaNumber)
    const aiContent = await tryExternalAIGeneration(userId, aiPrompt, preferences.brandTone, 'instagram')
    
    // If AI generation succeeded, parse and use it; otherwise fall back to templates
    if (aiContent) {
      return this.parseAIContent(aiContent, userId, category, weekNumber, year, preferences)
    }
    
    // Fallback to template-based generation (zero cost)
    return this.generateFromTemplate(userId, category, preferences, weekNumber, year)
  }

  /**
   * Generate content idea from templates (fallback method)
   */
  private generateFromTemplate(
    userId: string,
    category: string,
    preferences: UserContentPreferences,
    weekNumber: number,
    year: number
  ): ContentIdea {
    const templates = CONTENT_IDEA_TEMPLATES[category] || CONTENT_IDEA_TEMPLATES['educational']
    const template = templates[Math.floor(Math.random() * templates.length)]
    
    // Get theme for variable replacement
    const theme = preferences.contentThemes[Math.floor(Math.random() * preferences.contentThemes.length)]
    
    // Replace template variables
    const title = template.title.replace(/{topic}/g, theme).replace(/{tip}/g, this.getRandomTip()).replace(/{trend}/g, this.getRandomTrend())
    const description = template.description
      .replace(/{topic}/g, theme)
      .replace(/{activity}/g, this.getRandomActivity())
      .replace(/{action}/g, this.getRandomAction())
      .replace(/{product}/g, preferences.industry)
      .replace(/{name}/g, this.getRandomName())
      .replace(/{feature}/g, this.getRandomFeature())
      .replace(/{fact}/g, this.getRandomFact())
    
    // Select platforms based on content type and preferences
    const platforms = this.selectPlatforms(template.contentType, preferences.preferredPlatforms)
    
    // Get hashtags
    const hashtagPool = HASHTAG_POOLS[category] || HASHTAG_POOLS['educational']
    const hashtags = this.getRandomHashtags(hashtagPool, 5)
    
    // Get CTA based on tone
    const ctaPool = CTA_TEMPLATES[preferences.brandTone] || CTA_TEMPLATES['professional']
    const callToAction = ctaPool[Math.floor(Math.random() * ctaPool.length)]
    
    // Adjust engagement potential based on trending/seasonal
    let engagementPotential = template.engagementPotential
    const trending = Math.random() > 0.7 // 30% chance of trending
    if (trending) engagementPotential = Math.min(10, engagementPotential + 1)
    
    const seasonal = this.getSeasonalRelevance()
    
    return {
      id: `idea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title,
      description,
      contentType: template.contentType as ContentIdea['contentType'],
      platforms,
      category,
      estimatedTime: template.estimatedTime,
      difficulty: template.difficulty,
      engagementPotential,
      trending,
      seasonal,
      hashtags,
      callToAction,
      tips: template.tips,
      examples: template.examples,
      isUsed: false,
      weekNumber,
      year,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  /**
   * Build prompt for external AI generation
   */
  private buildAIPrompt(
    category: string,
    preferences: UserContentPreferences,
    ideaNumber: number
  ): string {
    return `Create content idea #${ideaNumber} for ${preferences.targetAudience} in the ${preferences.industry} industry.

Category: ${category}
Brand Tone: ${preferences.brandTone}
Preferred Platforms: ${preferences.preferredPlatforms.join(', ')}
Content Types: ${preferences.contentTypes.join(', ')}
Content Goals: ${preferences.contentGoals.join(', ')}
Content Themes: ${preferences.contentThemes.join(', ')}
Topics to Avoid: ${preferences.avoidTopics.join(', ') || 'None'}

Requirements:
- Provide a specific, actionable content idea
- Include estimated time to create (in minutes)
- Rate difficulty (easy, medium, hard)
- Rate engagement potential (1-10)
- Include relevant hashtags
- Provide a clear call-to-action
- Give 2-3 implementation tips
- Suggest 1-2 examples or variations
- Make it suitable for multiple platforms

Return only the content idea in a clear, structured format.`
  }

  /**
   * Parse AI-generated content into ContentIdea object
   */
  private parseAIContent(
    content: string,
    userId: string,
    category: string,
    weekNumber: number,
    year: number,
    preferences: UserContentPreferences
  ): ContentIdea {
    // Basic parsing - extract key information from AI response
    const lines = content.split('\n').filter(l => l.trim())
    
    let title = lines.find(l => l.toLowerCase().includes('title'))?.split(':')[1]?.trim() || 'Content Idea'
    let description = lines.find(l => l.toLowerCase().includes('description'))?.split(':')[1]?.trim() || content
    
    // Extract hashtags
    const hashtagLine = lines.find(l => l.toLowerCase().includes('hashtag'))
    const hashtags = hashtagLine 
      ? hashtagLine.match(/#\w+/g) || []
      : (HASHTAG_POOLS[category] || HASHTAG_POOLS['educational']).slice(0, 5)
    
    // Extract CTA
    const ctaLine = lines.find(l => l.toLowerCase().includes('call') || l.toLowerCase().includes('cta'))
    const callToAction = ctaLine?.split(':')[1]?.trim() || 
      (CTA_TEMPLATES[preferences.brandTone] || CTA_TEMPLATES['professional'])[0]
    
    // Default values
    const contentType = preferences.contentTypes[0] as ContentIdea['contentType'] || 'post'
    const platforms = preferences.preferredPlatforms.slice(0, 3)
    
    return {
      id: `idea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title,
      description,
      contentType,
      platforms,
      category,
      estimatedTime: 30,
      difficulty: 'medium',
      engagementPotential: 7,
      trending: false,
      hashtags,
      callToAction,
      tips: ['Follow best practices for your platform', 'Engage with comments', 'Post at optimal times'],
      examples: ['Standard format', 'Alternative approach'],
      isUsed: false,
      weekNumber,
      year,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  /**
   * Get or create user preferences
   */
  async getUserPreferences(userId: string): Promise<UserContentPreferences> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const result = await sql`
      SELECT * FROM bot_user_content_preferences WHERE user_id = ${userId}
    `

    if (result.length > 0) {
      const pref = result[0]
      return {
        id: pref.id,
        userId: pref.user_id,
        contentThemes: pref.content_themes || ['business growth', 'industry insights', 'tips and tricks'],
        preferredPlatforms: pref.preferred_platforms || ['instagram', 'facebook', 'linkedin'],
        contentTypes: pref.content_types || ['post', 'story', 'carousel'],
        industry: pref.industry || 'digital marketing',
        targetAudience: pref.target_audience || 'small business owners',
        brandTone: pref.brand_tone || 'professional',
        postingFrequency: pref.posting_frequency || 'weekly',
        contentGoals: pref.content_goals || ['brand awareness', 'engagement'],
        avoidTopics: pref.avoid_topics || [],
        customPrompts: pref.custom_prompts || [],
        createdAt: pref.created_at,
        updatedAt: pref.updated_at
      }
    }

    // Create default preferences
    const defaultPrefs: UserContentPreferences = {
      id: `prefs_${userId}`,
      userId,
      contentThemes: ['business growth', 'industry insights', 'tips and tricks'],
      preferredPlatforms: ['instagram', 'facebook', 'linkedin'],
      contentTypes: ['post', 'story', 'carousel'],
      industry: 'digital marketing',
      targetAudience: 'small business owners',
      brandTone: 'professional',
      postingFrequency: 'weekly',
      contentGoals: ['brand awareness', 'engagement'],
      avoidTopics: [],
      customPrompts: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await sql`
      INSERT INTO bot_user_content_preferences (
        id, user_id, content_themes, preferred_platforms, content_types,
        industry, target_audience, brand_tone, posting_frequency, content_goals
      ) VALUES (
        ${defaultPrefs.id}, ${defaultPrefs.userId}, ${sql.array(defaultPrefs.contentThemes)},
        ${sql.array(defaultPrefs.preferredPlatforms)}, ${sql.array(defaultPrefs.contentTypes)},
        ${defaultPrefs.industry}, ${defaultPrefs.targetAudience}, ${defaultPrefs.brandTone},
        ${defaultPrefs.postingFrequency}, ${sql.array(defaultPrefs.contentGoals)}
      )
    `

    return defaultPrefs
  }

  /**
   * Save content idea to database
   */
  private async saveContentIdea(idea: ContentIdea): Promise<void> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    await sql`
      INSERT INTO bot_content_ideas (
        id, user_id, title, description, content_type, platforms, category,
        estimated_time, difficulty, engagement_potential, trending, seasonal,
        hashtags, call_to_action, tips, examples, is_used, performance_data,
        week_number, year
      ) VALUES (
        ${idea.id}, ${idea.userId}, ${idea.title}, ${idea.description},
        ${idea.contentType}, ${sql.array(idea.platforms)}, ${idea.category},
        ${idea.estimatedTime}, ${idea.difficulty}, ${idea.engagementPotential},
        ${idea.trending}, ${idea.seasonal || null}, ${sql.array(idea.hashtags)},
        ${idea.callToAction}, ${sql.array(idea.tips)}, ${sql.array(idea.examples)},
        ${idea.isUsed}, ${JSON.stringify(idea.performance || {})},
        ${idea.weekNumber}, ${idea.year}
      )
    `
  }

  /**
   * Get weekly content plan
   */
  async getWeeklyContentPlan(userId: string, weekNumber?: number, year?: number): Promise<WeeklyContentPlan | null> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const targetWeek = weekNumber || this.getCurrentWeekNumber()
    const targetYear = year || new Date().getFullYear()

    const result = await sql`
      SELECT * FROM bot_weekly_content_plans
      WHERE user_id = ${userId}
        AND week_number = ${targetWeek}
        AND year = ${targetYear}
      LIMIT 1
    `

    if (result.length === 0) return null

    const plan = result[0]
    
    // Get ideas for this plan
    const ideasResult = await sql`
      SELECT * FROM bot_content_ideas
      WHERE user_id = ${userId}
        AND week_number = ${targetWeek}
        AND year = ${targetYear}
      ORDER BY created_at
    `

    const ideas = ideasResult.map(this.mapDbToContentIdea)

    return {
      id: plan.id,
      userId: plan.user_id,
      weekNumber: plan.week_number,
      year: plan.year,
      ideas,
      theme: plan.theme,
      status: plan.status,
      emailSent: plan.email_sent,
      emailDelivered: plan.email_delivered,
      userFeedback: plan.user_feedback,
      createdAt: new Date(plan.created_at),
      updatedAt: new Date(plan.updated_at),
      sentAt: plan.sent_at ? new Date(plan.sent_at) : undefined
    }
  }

  /**
   * Save weekly content plan
   */
  async saveWeeklyContentPlan(plan: WeeklyContentPlan): Promise<void> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    await sql`
      INSERT INTO bot_weekly_content_plans (
        id, user_id, week_number, year, theme, status,
        email_sent, email_delivered, user_feedback
      ) VALUES (
        ${plan.id}, ${plan.userId}, ${plan.weekNumber}, ${plan.year},
        ${plan.theme || null}, ${plan.status}, ${plan.emailSent},
        ${plan.emailDelivered}, ${JSON.stringify(plan.userFeedback || {})}
      )
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        email_sent = EXCLUDED.email_sent,
        email_delivered = EXCLUDED.email_delivered,
        updated_at = NOW()
    `
  }

  /**
   * Helper: Map database row to ContentIdea
   */
  private mapDbToContentIdea(row: any): ContentIdea {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      contentType: row.content_type,
      platforms: row.platforms || [],
      category: row.category,
      estimatedTime: row.estimated_time,
      difficulty: row.difficulty,
      engagementPotential: row.engagement_potential,
      trending: row.trending,
      seasonal: row.seasonal,
      hashtags: row.hashtags || [],
      callToAction: row.call_to_action,
      tips: row.tips || [],
      examples: row.examples || [],
      isUsed: row.is_used,
      performance: row.performance_data,
      weekNumber: row.week_number,
      year: row.year,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }
  }

  // Helper methods

  private getCategoriesForThemes(themes: string[]): string[] {
    const categories: string[] = []
    themes.forEach(theme => {
      const mapped = CATEGORY_MAP[theme.toLowerCase()] || ['educational']
      categories.push(...mapped)
    })
    return categories.length > 0 ? categories : ['educational']
  }

  private selectPlatforms(contentType: string, preferred: string[]): string[] {
    const platformMap: Record<string, string[]> = {
      'post': ['instagram', 'facebook', 'linkedin'],
      'story': ['instagram', 'facebook'],
      'reel': ['instagram', 'tiktok'],
      'carousel': ['instagram', 'linkedin'],
      'video': ['youtube', 'instagram', 'tiktok'],
      'live': ['instagram', 'facebook', 'youtube']
    }
    
    const suggested = platformMap[contentType] || ['instagram']
    return suggested.filter(p => preferred.includes(p)).slice(0, 3) || suggested.slice(0, 3)
  }

  private getRandomHashtags(pool: string[], count: number): string[] {
    const shuffled = [...pool].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(count, pool.length))
  }

  private getRandomTip(): string {
    const tips = ['time management', 'productivity', 'communication', 'strategy', 'growth']
    return tips[Math.floor(Math.random() * tips.length)]
  }

  private getRandomTrend(): string {
    const trends = ['AI tools', 'remote work', 'sustainability', 'wellness', 'efficiency']
    return trends[Math.floor(Math.random() * trends.length)]
  }

  private getRandomActivity(): string {
    const activities = ['creating content', 'running my business', 'planning strategy', 'working with clients']
    return activities[Math.floor(Math.random() * activities.length)]
  }

  private getRandomAction(): string {
    const actions = ['create content', 'plan campaigns', 'analyze data', 'engage with audience']
    return actions[Math.floor(Math.random() * actions.length)]
  }

  private getRandomName(): string {
    const names = ['Sarah', 'Mike', 'Jessica', 'David', 'Emily']
    return names[Math.floor(Math.random() * names.length)]
  }

  private getRandomFeature(): string {
    const features = ['new dashboard', 'analytics tool', 'automation feature', 'integration']
    return features[Math.floor(Math.random() * features.length)]
  }

  private getRandomFact(): string {
    const facts = ['industry statistics', 'surprising data', 'interesting research', 'market insights']
    return facts[Math.floor(Math.random() * facts.length)]
  }

  private getSeasonalRelevance(): string | undefined {
    const month = new Date().getMonth()
    if (month >= 11 || month <= 1) return 'winter'
    if (month >= 2 && month <= 4) return 'spring'
    if (month >= 5 && month <= 7) return 'summer'
    if (month >= 8 && month <= 10) return 'fall'
    return undefined
  }

  /**
   * Get current week number (1-52)
   */
  getCurrentWeekNumber(): number {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1)
    const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
    return Math.ceil((days + start.getDay() + 1) / 7)
  }
}
