/**
 * Daily Caption Bot Service
 * 100% Template-Based - Zero External API Usage
 * All captions generated from pre-defined templates with variable substitution
 */

import { sql } from '@/lib/db'
import { tryExternalAIGeneration } from './external-ai-service'

export interface Caption {
  id: string
  userId: string
  content: string
  tone: 'professional' | 'casual' | 'funny' | 'inspirational' | 'educational'
  theme: string
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok'
  hashtags: string[]
  emojis: string[]
  category: string
  isGenerated: boolean
  isUsed: boolean
  performanceData?: any
  scheduledFor?: Date
  createdAt: Date
  updatedAt: Date
}

export interface UserPreferences {
  id: string
  userId: string
  contentThemes: string[]
  brandTone: 'professional' | 'casual' | 'funny' | 'inspirational' | 'educational'
  targetAudience: string
  industry: string
  preferredPlatforms: string[]
  postingSchedule: {
    instagram?: boolean
    facebook?: boolean
    twitter?: boolean
    linkedin?: boolean
    tiktok?: boolean
  }
  customPrompts?: string[]
  dailyGenerationEnabled: boolean
  generationTime: string
  createdAt: Date
  updatedAt: Date
}

// Template pools for each tone/platform combination
const CAPTION_TEMPLATES: Record<string, Record<string, string[]>> = {
  professional: {
    instagram: [
      "Behind the scenes: {theme} optimized for peak performance 📈 #Tech #Efficiency",
      "{theme} workflow that saves 3 hrs/week — link in bio 🔗 #Productivity",
      "Case study: how {theme} increased ROI by 27% 📊 #Marketing",
      "Quick tip: {theme} strategy that works every time 💡 #BusinessTips",
      "Three ways {theme} transforms your workflow 🚀 #Innovation"
    ],
    linkedin: [
      "💡 Business Tip: {theme} This has helped us achieve {benefit}. What strategies work for you? #BusinessGrowth",
      "Whitepaper: {theme} as a disruptive model in 2026 📄 #IndustryInsights",
      "Webinar recap — 5 ways {theme} transforms customer experience 🎥 #CX",
      "Three lessons from {theme}: 1. {lesson1} 2. {lesson2} 3. {lesson3} What would you add? #ProfessionalGrowth",
      "Benchmark report: {theme} adoption up 34% YoY 📈 #Data"
    ],
    twitter: [
      "Thread 🧵: Why {theme} matters for SaaS growth ⬇️ #Startup",
      "1/ {theme} reduces churn by 18% — here's the data 📊",
      "Pro tip: schedule {theme} posts at 9am local for max reach ⏰ #SocialMedia"
    ],
    facebook: [
      "Live demo tomorrow: {theme} automation in action 🖥️ Set reminder!",
      "Survey: 62% marketers plan to invest more in {theme} this year 📊 #Analytics",
      "Free checklist — 7 steps to master {theme} 🔗 Download below!"
    ],
    tiktok: [
      "Quick tip: use {theme} to level-up your content game 🎯 #CreatorTips",
      "{theme} hack nobody taught you 🛠️ #TechTok",
      "Stop scrolling — {theme} strategy in 30s ⏱️ #BusinessTok"
    ]
  },
  casual: {
    instagram: [
      "Current mood: {theme} and chill 🌴😌 #SundayFunday",
      "{theme} hits different today ✨ #SimplePleasures",
      "Serving {theme} realness 🥂 #NoFilter",
      "Just {theme} things 🌟 #LivingMyBestLife",
      "When {theme} is the vibe ✨ #GoodVibes"
    ],
    linkedin: [
      "Quick thought: {theme} in the wild 🎯 #RealTalk",
      "Honest take on {theme} — what's your experience? 💭 #Discussion",
      "{theme} but make it Monday motivation ☕️ #MondayVibes"
    ],
    twitter: [
      "{theme} > coffee ☕️ Change my mind. #MondayMotivation",
      "Hot take: {theme} should be an Olympic sport 🔥 #RandomThoughts",
      "{theme} hits different at 3 am 🌙 #NightOwls"
    ],
    facebook: [
      "Throwback to when {theme} made my day! 🌞 Drop a ❤️ if you agree.",
      "Good vibes only: {theme} edition ✨ Share if you feel it!",
      "Who else thinks {theme} needs more love? 👇 #Community"
    ],
    tiktok: [
      "POV: {theme} just ended everyone else's career 💅 #FYP #Trending",
      "{theme} speed-run → watch till the end 😂 #TikTokMadeMeBuyIt",
      "When {theme} is life but you're the main character 🎬✨ #ForYou"
    ]
  },
  funny: {
    instagram: [
      "Just {theme} things 🌟🤪 #LivingMyBestLife #GoodVibes",
      "{theme} called — it wants its spotlight back 📸✨ #OwnIt #Funny",
      "Proof that {theme} > therapy (and cheaper) 😂💸 #LOL #Relatable",
      "POV: {theme} but you're the main character 😂 #MainCharacterEnergy",
      "When {theme} hits different 😅 #Relatable"
    ],
    linkedin: [
      "What {theme} taught me about agile problem-solving 🚀 #Innovation #Leadership",
      "Leveraging {theme} to drive stakeholder engagement 💡 #ProfessionalGrowth",
      "How {theme} boosts team morale — data-driven insights below 📊 #HR"
    ],
    twitter: [
      "{theme} > coffee ☕️ Change my mind. #MondayMotivation",
      "Hot take: {theme} should be an Olympic sport 🔥 #RandomThoughts",
      "{theme} hits different at 3 am 🌙 #NightOwls"
    ],
    facebook: [
      "Throwback to when {theme} made my day! 🌞 Drop a ❤️ if you agree.",
      "Good vibes only: {theme} edition ✨ Share if you feel it!",
      "Who else thinks {theme} needs more love? 👇 #Community"
    ],
    tiktok: [
      "POV: {theme} just ended everyone else's career 💅 #FYP #Trending",
      "{theme} speed-run → watch till the end 😂 #TikTokMadeMeBuyIt",
      "When {theme} is life but you're the main character 🎬✨ #ForYou"
    ]
  },
  inspirational: {
    instagram: [
      "Let {theme} remind you: magic is real if you believe ✨💫 #Motivation #Inspire",
      "Your next chapter starts with {theme} — write boldly 🌅📝 #Mindset",
      "{theme} is proof the best stories are still being written 🌠 #KeepGoing",
      "Start your week strong! 💪 {theme} Remember: every journey begins with a single step {hashtags}",
      "{theme} energy = manifest-everything kind of vibe 🌈 #SpiritualTok"
    ],
    linkedin: [
      "{theme} as a metaphor: iterate, adapt, ascend 🧗‍♂️ #GrowthMindset",
      "From idea to impact — {theme} shows the power of persistence 🚀 #Success",
      "Channel {theme} to unlock creative breakthroughs at work 🎨 #Innovation"
    ],
    twitter: [
      "{theme} is the sign you were waiting for — start today 🌱 #Quote",
      "Let {theme} fuel your hustle 🔥 #ThursdayThoughts",
      "Reminder: you're 1 {theme} away from a new reality ✨ #Mindset"
    ],
    facebook: [
      "Spreading positivity with {theme} 🌻 Tag someone who needs this today!",
      "If {theme} doesn't inspire you, nothing will 🙌 #ShareTheLove",
      "Rise, shine, repeat — {theme} edition ☀️ #GoodMorning"
    ],
    tiktok: [
      "{theme} energy = manifest-everything kind of vibe 🌈 #SpiritualTok",
      "Watch {theme} turn dreams into plans ⏳✨ #GoalGetter",
      "{theme} but make it self-love journey 💖 #HealingTok"
    ]
  },
  educational: {
    instagram: [
      "Did you know? {theme} Here's why it matters: {explanation} 📚 #LearnSomethingNew",
      "Quick lesson: {theme} explained in 60 seconds ⏱️ #Education",
      "Breaking down {theme} for beginners 🎓 #HowTo"
    ],
    linkedin: [
      "Deep dive: {theme} and its impact on modern business 📊 #IndustryInsights",
      "Educational thread: Understanding {theme} 🧵 #ProfessionalDevelopment",
      "Case study analysis: {theme} in practice 📈 #Learning"
    ],
    twitter: [
      "🧵 Thread: Everything you need to know about {theme}",
      "Quick fact: {theme} affects 73% of businesses 📊",
      "Educational moment: {theme} explained simply 💡"
    ],
    facebook: [
      "Learn something new: {theme} basics explained 📖",
      "Educational post: Understanding {theme} 🎓",
      "Knowledge share: {theme} tips and tricks 💡"
    ],
    tiktok: [
      "POV: You're learning about {theme} 🎓 #EduTok",
      "{theme} explained in 30 seconds ⏱️ #LearnOnTikTok",
      "Quick lesson: {theme} basics 📚 #Education"
    ]
  }
}

// Hashtag pools by category
const HASHTAG_POOLS: Record<string, string[]> = {
  business: ['#Business', '#Entrepreneur', '#Startup', '#Marketing', '#Growth', '#Success'],
  motivation: ['#Motivation', '#Inspiration', '#Mindset', '#Goals', '#Success', '#Growth'],
  tips: ['#Tips', '#HowTo', '#Advice', '#Learn', '#Education', '#ProTips'],
  'behind-the-scenes': ['#BehindTheScenes', '#BTS', '#Process', '#WorkInProgress', '#MakingOf'],
  general: ['#Content', '#Creator', '#SocialMedia', '#Digital', '#Online', '#Community']
}

// Emoji pools by tone
const EMOJI_POOLS: Record<string, string[]> = {
  professional: ['💼', '📊', '📈', '💡', '🚀', '🎯', '⚡', '📱'],
  casual: ['✨', '🌟', '😌', '🌴', '🥂', '💫', '🎉', '🌈'],
  funny: ['😂', '🤪', '😅', '💸', '🎬', '🔥', '✨', '😎'],
  inspirational: ['💪', '✨', '🌟', '🌅', '🌠', '🌈', '💫', '🔥'],
  educational: ['📚', '🎓', '💡', '📊', '📈', '🧵', '⏱️', '📖']
}

export class CaptionBotService {
  /**
   * Generate captions using templates (zero external API usage)
   */
  async generateCaptions(
    userId: string,
    count: number = 5,
    themes?: string[],
    tone?: string,
    platforms?: string[]
  ): Promise<Caption[]> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const preferences = await this.getUserPreferences(userId)
    const selectedThemes = themes || preferences.contentThemes
    const selectedTone = (tone || preferences.brandTone) as keyof typeof CAPTION_TEMPLATES
    const selectedPlatforms = platforms || preferences.preferredPlatforms

    const captions: Caption[] = []

    for (let i = 0; i < count; i++) {
      const theme = selectedThemes[Math.floor(Math.random() * selectedThemes.length)]
      const platform = selectedPlatforms[Math.floor(Math.random() * selectedPlatforms.length)] as keyof typeof CAPTION_TEMPLATES[typeof selectedTone]
      
      const caption = await this.generateSingleCaption(
        userId,
        theme,
        selectedTone,
        platform,
        preferences
      )
      captions.push(caption)
    }

    // Save to database
    for (const caption of captions) {
      await this.saveCaption(caption)
    }

    return captions
  }

  /**
   * Generate a single caption - tries external AI first, falls back to templates
   */
  private async generateSingleCaption(
    userId: string,
    theme: string,
    tone: keyof typeof CAPTION_TEMPLATES,
    platform: string,
    preferences: UserPreferences
  ): Promise<Caption> {
    // Try external AI first (if user has API keys configured)
    const aiPrompt = this.buildAIPrompt(theme, tone, platform, preferences)
    const aiContent = await tryExternalAIGeneration(userId, aiPrompt, tone, platform)
    
    // If AI generation succeeded, use it; otherwise fall back to templates
    if (aiContent) {
      return this.parseAIContent(aiContent, userId, theme, tone, platform)
    }
    
    // Fallback to template-based generation (zero cost)
    return this.generateFromTemplate(userId, theme, tone, platform, preferences)
  }

  /**
   * Generate caption from templates (fallback method)
   */
  private generateFromTemplate(
    userId: string,
    theme: string,
    tone: keyof typeof CAPTION_TEMPLATES,
    platform: string,
    preferences: UserPreferences
  ): Caption {
    const templates = CAPTION_TEMPLATES[tone]?.[platform] || CAPTION_TEMPLATES[tone]?.instagram || []
    const template = templates[Math.floor(Math.random() * templates.length)]
    
    // Replace template variables
    let content = template
      .replace(/{theme}/g, theme)
      .replace(/{benefit}/g, this.getRandomBenefit())
      .replace(/{lesson1}/g, this.getRandomLesson())
      .replace(/{lesson2}/g, this.getRandomLesson())
      .replace(/{lesson3}/g, this.getRandomLesson())
      .replace(/{explanation}/g, this.getRandomExplanation())
      .replace(/{hashtags}/g, '') // Will add hashtags separately

    // Extract existing hashtags from template
    const existingHashtags = content.match(/#\w+/g) || []
    
    // Add more hashtags based on category
    const category = this.getCategoryForTheme(theme)
    const hashtagPool = HASHTAG_POOLS[category] || HASHTAG_POOLS.general
    const additionalHashtags = this.getRandomHashtags(hashtagPool, 3 - existingHashtags.length)
    const allHashtags = [...existingHashtags, ...additionalHashtags]

    // Add emojis
    const emojiPool = EMOJI_POOLS[tone] || EMOJI_POOLS.casual
    const emojis = this.getRandomEmojis(emojiPool, 2)

    // Add hashtags to content if not already present
    if (allHashtags.length > 0 && !content.includes('#')) {
      content += ' ' + allHashtags.slice(0, 3).join(' ')
    }

    return {
      id: `caption_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      content,
      tone,
      theme,
      platform: platform as Caption['platform'],
      hashtags: allHashtags,
      emojis,
      category,
      isGenerated: true,
      isUsed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  /**
   * Get or create user preferences
   */
  async getUserPreferences(userId: string): Promise<UserPreferences> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const result = await sql`
      SELECT * FROM bot_user_preferences WHERE user_id = ${userId}
    `

    if (result.length > 0) {
      const pref = result[0]
      return {
        id: pref.id,
        userId: pref.user_id,
        contentThemes: pref.content_themes || ['business', 'motivation', 'tips', 'behind-the-scenes'],
        brandTone: pref.brand_tone || 'professional',
        targetAudience: pref.target_audience || 'small business owners',
        industry: pref.industry || 'digital marketing',
        preferredPlatforms: pref.preferred_platforms || ['instagram', 'facebook', 'linkedin'],
        postingSchedule: pref.posting_schedule || {
          instagram: true,
          facebook: true,
          linkedin: true,
          twitter: false,
          tiktok: false
        },
        customPrompts: pref.custom_prompts || [],
        dailyGenerationEnabled: pref.daily_generation_enabled ?? true,
        generationTime: pref.generation_time || '06:00:00',
        createdAt: pref.created_at,
        updatedAt: pref.updated_at
      }
    }

    // Create default preferences
    const defaultPrefs: UserPreferences = {
      id: `prefs_${userId}`,
      userId,
      contentThemes: ['business', 'motivation', 'tips', 'behind-the-scenes'],
      brandTone: 'professional',
      targetAudience: 'small business owners',
      industry: 'digital marketing',
      preferredPlatforms: ['instagram', 'facebook', 'linkedin'],
      postingSchedule: {
        instagram: true,
        facebook: true,
        linkedin: true,
        twitter: false,
        tiktok: false
      },
      customPrompts: [],
      dailyGenerationEnabled: true,
      generationTime: '06:00:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await sql`
      INSERT INTO bot_user_preferences (
        id, user_id, content_themes, brand_tone, target_audience, industry,
        preferred_platforms, posting_schedule, daily_generation_enabled, generation_time
      ) VALUES (
        ${defaultPrefs.id}, ${defaultPrefs.userId}, ${sql.array(defaultPrefs.contentThemes)}, 
        ${defaultPrefs.brandTone}, ${defaultPrefs.targetAudience}, ${defaultPrefs.industry},
        ${sql.array(defaultPrefs.preferredPlatforms)}, ${JSON.stringify(defaultPrefs.postingSchedule)},
        ${defaultPrefs.dailyGenerationEnabled}, ${defaultPrefs.generationTime}
      )
    `

    return defaultPrefs
  }

  /**
   * Save caption to database
   */
  private async saveCaption(caption: Caption): Promise<void> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    await sql`
      INSERT INTO bot_captions (
        id, user_id, content, tone, theme, platform, hashtags, emojis,
        category, is_generated, is_used, performance_data
      ) VALUES (
        ${caption.id}, ${caption.userId}, ${caption.content}, ${caption.tone},
        ${caption.theme}, ${caption.platform}, ${sql.array(caption.hashtags)},
        ${sql.array(caption.emojis)}, ${caption.category}, ${caption.isGenerated},
        ${caption.isUsed}, ${JSON.stringify(caption.performanceData || {})}
      )
    `
  }

  /**
   * Get daily captions for a user
   */
  async getDailyCaptions(userId: string, date: Date): Promise<Caption[]> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const result = await sql`
      SELECT * FROM bot_captions
      WHERE user_id = ${userId}
        AND created_at >= ${startOfDay.toISOString()}
        AND created_at <= ${endOfDay.toISOString()}
      ORDER BY created_at DESC
    `

    return result.map(this.mapDbToCaption)
  }

  /**
   * Get unused captions
   */
  async getUnusedCaptions(userId: string, limit: number = 10): Promise<Caption[]> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const result = await sql`
      SELECT * FROM bot_captions
      WHERE user_id = ${userId} AND is_used = false
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    return result.map(this.mapDbToCaption)
  }

  /**
   * Mark caption as used
   */
  async markCaptionAsUsed(captionId: string): Promise<void> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    await sql`
      UPDATE bot_captions
      SET is_used = true, updated_at = NOW()
      WHERE id = ${captionId}
    `
  }

  /**
   * Helper: Map database row to Caption object
   */
  private mapDbToCaption(row: any): Caption {
    return {
      id: row.id,
      userId: row.user_id,
      content: row.content,
      tone: row.tone,
      theme: row.theme,
      platform: row.platform,
      hashtags: row.hashtags || [],
      emojis: row.emojis || [],
      category: row.category || 'general',
      isGenerated: row.is_generated ?? true,
      isUsed: row.is_used ?? false,
      performanceData: row.performance_data,
      scheduledFor: row.scheduled_for ? new Date(row.scheduled_for) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }
  }

  // Helper methods for template variable replacement
  private getRandomBenefit(): string {
    const benefits = ['save time', 'increase engagement', 'boost productivity', 'grow faster', 'scale efficiently']
    return benefits[Math.floor(Math.random() * benefits.length)]
  }

  private getRandomLesson(): string {
    const lessons = ['consistency matters', 'quality over quantity', 'know your audience', 'test and iterate', 'stay authentic']
    return lessons[Math.floor(Math.random() * lessons.length)]
  }

  private getRandomExplanation(): string {
    const explanations = [
      'it drives better results',
      'it helps you stand out',
      'it builds trust with your audience',
      'it creates lasting impact',
      'it sets you apart from competitors'
    ]
    return explanations[Math.floor(Math.random() * explanations.length)]
  }

  private getCategoryForTheme(theme: string): string {
    const themeLower = theme.toLowerCase()
    if (themeLower.includes('business') || themeLower.includes('work')) return 'business'
    if (themeLower.includes('motiv') || themeLower.includes('inspire')) return 'motivation'
    if (themeLower.includes('tip') || themeLower.includes('how')) return 'tips'
    if (themeLower.includes('behind') || themeLower.includes('bts')) return 'behind-the-scenes'
    return 'general'
  }

  private getRandomHashtags(pool: string[], count: number): string[] {
    const shuffled = [...pool].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(count, pool.length))
  }

  private getRandomEmojis(pool: string[], count: number): string[] {
    const shuffled = [...pool].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(count, pool.length))
  }

  /**
   * Build prompt for external AI generation
   */
  private buildAIPrompt(
    theme: string,
    tone: string,
    platform: string,
    preferences: UserPreferences
  ): string {
    const toneDescriptions: Record<string, string> = {
      professional: 'professional, authoritative, trustworthy',
      casual: 'casual, friendly, conversational',
      funny: 'humorous, witty, entertaining',
      inspirational: 'motivational, uplifting, encouraging',
      educational: 'informative, helpful, teaching'
    }

    return `Create a ${tone} caption for ${platform} about "${theme}" for ${preferences.targetAudience} in the ${preferences.industry} industry.

Requirements:
- Tone: ${toneDescriptions[tone] || tone}
- Platform: ${platform} (follow best practices and character limits)
- Include 3-5 relevant hashtags
- Include appropriate emojis (2-4 max)
- Make it engaging and actionable
- Consider ${preferences.targetAudience} audience
- Keep it authentic and brand-aligned

Return only the caption text with hashtags and emojis included.`
  }

  /**
   * Parse AI-generated content into Caption object
   */
  private parseAIContent(
    content: string,
    userId: string,
    theme: string,
    tone: string,
    platform: string
  ): Caption {
    // Extract hashtags
    const hashtags = content.match(/#\w+/g) || []
    
    // Extract emojis (basic emoji regex)
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu
    const emojis = content.match(emojiRegex) || []

    // Remove hashtags and emojis from content for cleaner text
    let cleanContent = content
    hashtags.forEach(tag => {
      cleanContent = cleanContent.replace(tag, '').trim()
    })

    return {
      id: `caption_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      content: cleanContent.trim(),
      tone: tone as Caption['tone'],
      theme,
      platform: platform as Caption['platform'],
      hashtags: hashtags.slice(0, 5), // Limit to 5 hashtags
      emojis: emojis.slice(0, 4), // Limit to 4 emojis
      category: this.getCategoryForTheme(theme),
      isGenerated: true,
      isUsed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
}
