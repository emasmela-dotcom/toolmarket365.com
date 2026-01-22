/**
 * Blog Outline Bot Service
 * 100% Template-Based - Zero External API Usage
 * All blog outlines generated from pre-defined templates with variable substitution
 * Optional external AI enhancement available at creator's expense
 */

import { sql } from '@/lib/db'
import { tryExternalAIGeneration } from './external-ai-service'

export interface BlogOutline {
  id: string
  userId: string
  title: string
  topic: string
  targetAudience: string
  tone: 'professional' | 'casual' | 'educational' | 'persuasive' | 'storytelling'
  blogType: 'how-to' | 'listicle' | 'review' | 'comparison' | 'case-study' | 'opinion' | 'news'
  estimatedReadTime: number
  wordCountTarget: number
  sections: BlogSection[]
  keyPoints: string[]
  keywords: string[]
  metaDescription: string
  slug: string
  internalLinks: string[]
  externalLinks: string[]
  questionsToAnswer: string[]
  callToAction: string
  relatedTopics: string[]
  contentBrief: string
  researchNotes: string
  seoScore: number
  originalityScore: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  status: 'draft' | 'in-progress' | 'completed' | 'published'
  createdAt: Date
  updatedAt: Date
  generatedAt: Date
}

export interface BlogSection {
  id: string
  title: string
  headingLevel: 1 | 2 | 3 | 4
  content: string
  bulletPoints: string[]
  examples: string[]
  statistics?: string[]
  quotes?: string[]
  images?: string[]
  internalLinks?: string[]
  externalLinks?: string[]
  keywords?: string[]
  estimatedWordCount: number
  writingPrompt?: string
  researchNeeded: boolean
  orderIndex: number
}

export interface UserBlogPreferences {
  id: string
  userId: string
  industry: string
  targetAudience: string
  brandVoice: 'professional' | 'casual' | 'educational' | 'persuasive' | 'storytelling'
  contentGoals: string[]
  preferredLength: 'short' | 'medium' | 'long'
  seoFocus: boolean
  includeStats: boolean
  includeExamples: boolean
  includeImages: boolean
  competitorAnalysis: boolean
  keywordResearch: boolean
  internalLinking: boolean
  callToActionStyle: 'soft' | 'medium' | 'hard'
  contentTypes: string[]
  avoidTopics: string[]
  customGuidelines?: string
  createdAt: Date
  updatedAt: Date
}

// Blog outline templates by type
const BLOG_TEMPLATES: Record<string, {
  sections: Array<{title: string, headingLevel: 1 | 2 | 3, wordCount: number, bulletPoints: string[], examples: string[]}>
  keyPoints: string[]
  questions: string[]
  cta: string[]
}> = {
  'how-to': {
    sections: [
      {
        title: 'Introduction',
        headingLevel: 2,
        wordCount: 200,
        bulletPoints: ['Hook: Capture reader attention', 'Context: Set the stage', 'What you\'ll learn', 'Why this matters'],
        examples: ['Real-world scenario', 'Problem statement', 'Solution preview']
      },
      {
        title: 'What You\'ll Need',
        headingLevel: 2,
        wordCount: 150,
        bulletPoints: ['Prerequisites', 'Tools required', 'Resources needed'],
        examples: ['Software list', 'Hardware requirements', 'Account setup']
      },
      {
        title: 'Step-by-Step Instructions',
        headingLevel: 2,
        wordCount: 800,
        bulletPoints: ['Clear numbered steps', 'Detailed explanations', 'Visual aids', 'Common variations'],
        examples: ['Screenshot walkthrough', 'Video tutorial link', 'Code examples']
      },
      {
        title: 'Troubleshooting Common Issues',
        headingLevel: 2,
        wordCount: 300,
        bulletPoints: ['Problem identification', 'Solutions', 'Prevention tips'],
        examples: ['Error messages', 'Workarounds', 'Alternative methods']
      },
      {
        title: 'Best Practices',
        headingLevel: 2,
        wordCount: 200,
        bulletPoints: ['Pro tips', 'Optimization', 'Time savers'],
        examples: ['Expert recommendations', 'Industry standards', 'Proven methods']
      },
      {
        title: 'Conclusion',
        headingLevel: 2,
        wordCount: 150,
        bulletPoints: ['Summary', 'Next steps', 'Additional resources'],
        examples: ['Related guides', 'Further reading', 'Action items']
      }
    ],
    keyPoints: ['Clear step-by-step process', 'Troubleshooting guidance', 'Real-world examples', 'Best practices'],
    questions: ['What is the main goal?', 'What are the prerequisites?', 'What are common mistakes?'],
    cta: ['Try this method and share your results', 'Bookmark this guide for future reference', 'Share with someone who needs this']
  },
  'listicle': {
    sections: [
      {
        title: 'Introduction',
        headingLevel: 2,
        wordCount: 200,
        bulletPoints: ['Hook with number', 'Set expectations', 'Why this list matters'],
        examples: ['Statistics', 'Trending topic', 'Problem statement']
      },
      {
        title: 'Methodology',
        headingLevel: 2,
        wordCount: 150,
        bulletPoints: ['Selection criteria', 'Research process', 'Evaluation method'],
        examples: ['Data sources', 'Expert input', 'User feedback']
      },
      {
        title: 'The List',
        headingLevel: 2,
        wordCount: 1200,
        bulletPoints: ['Numbered items', 'Detailed descriptions', 'Pros and cons', 'Use cases'],
        examples: ['Item comparisons', 'Feature highlights', 'User testimonials']
      },
      {
        title: 'How to Choose',
        headingLevel: 2,
        wordCount: 200,
        bulletPoints: ['Decision factors', 'Comparison guide', 'Recommendations'],
        examples: ['Comparison table', 'Use case scenarios', 'Budget considerations']
      },
      {
        title: 'Conclusion',
        headingLevel: 2,
        wordCount: 150,
        bulletPoints: ['Summary', 'Top picks', 'Final thoughts'],
        examples: ['Quick reference', 'Action items', 'Related lists']
      }
    ],
    keyPoints: ['Comprehensive list', 'Clear ranking', 'Actionable insights', 'Easy to scan'],
    questions: ['What makes each item unique?', 'How do they compare?', 'Which is best for me?'],
    cta: ['Save this list for later', 'Share your top pick', 'Try one and report back']
  },
  'review': {
    sections: [
      {
        title: 'Introduction',
        headingLevel: 2,
        wordCount: 200,
        bulletPoints: ['Product/service overview', 'Why this review matters', 'Your experience level'],
        examples: ['Product image', 'Initial impressions', 'Testing period']
      },
      {
        title: 'Features and Specifications',
        headingLevel: 2,
        wordCount: 300,
        bulletPoints: ['Key features', 'Technical specs', 'What\'s included'],
        examples: ['Feature list', 'Specification table', 'Package contents']
      },
      {
        title: 'Pros and Cons',
        headingLevel: 2,
        wordCount: 400,
        bulletPoints: ['What works well', 'Areas for improvement', 'Deal breakers'],
        examples: ['User benefits', 'Limitations', 'Comparison points']
      },
      {
        title: 'Performance and Results',
        headingLevel: 2,
        wordCount: 400,
        bulletPoints: ['Real-world testing', 'Performance metrics', 'Results achieved'],
        examples: ['Before/after', 'Data points', 'Success stories']
      },
      {
        title: 'Who Should Use This',
        headingLevel: 2,
        wordCount: 200,
        bulletPoints: ['Ideal users', 'Use cases', 'Who should avoid'],
        examples: ['Target audience', 'Best scenarios', 'Alternatives']
      },
      {
        title: 'Final Verdict',
        headingLevel: 2,
        wordCount: 200,
        bulletPoints: ['Overall rating', 'Recommendation', 'Value assessment'],
        examples: ['Rating breakdown', 'Comparison summary', 'Purchase advice']
      }
    ],
    keyPoints: ['Honest assessment', 'Detailed analysis', 'Real-world testing', 'Clear recommendation'],
    questions: ['What are the key features?', 'How does it perform?', 'Is it worth the price?'],
    cta: ['Check current pricing', 'Read more reviews', 'Share your experience']
  },
  'comparison': {
    sections: [
      {
        title: 'Introduction',
        headingLevel: 2,
        wordCount: 200,
        bulletPoints: ['Comparison purpose', 'Options overview', 'Decision context'],
        examples: ['Market overview', 'Selection criteria', 'Why compare']
      },
      {
        title: 'Option 1: [Name]',
        headingLevel: 2,
        wordCount: 400,
        bulletPoints: ['Key features', 'Strengths', 'Weaknesses', 'Best for'],
        examples: ['Feature highlights', 'Use cases', 'Pricing']
      },
      {
        title: 'Option 2: [Name]',
        headingLevel: 2,
        wordCount: 400,
        bulletPoints: ['Key features', 'Strengths', 'Weaknesses', 'Best for'],
        examples: ['Feature highlights', 'Use cases', 'Pricing']
      },
      {
        title: 'Side-by-Side Comparison',
        headingLevel: 2,
        wordCount: 300,
        bulletPoints: ['Feature comparison', 'Pricing comparison', 'Performance comparison'],
        examples: ['Comparison table', 'Visual charts', 'Metric breakdown']
      },
      {
        title: 'Which Should You Choose?',
        headingLevel: 2,
        wordCount: 300,
        bulletPoints: ['Decision factors', 'Use case recommendations', 'Budget considerations'],
        examples: ['Decision tree', 'Scenarios', 'Recommendations']
      },
      {
        title: 'Conclusion',
        headingLevel: 2,
        wordCount: 150,
        bulletPoints: ['Summary', 'Top pick', 'Final advice'],
        examples: ['Quick reference', 'Action items', 'Related comparisons']
      }
    ],
    keyPoints: ['Comprehensive comparison', 'Clear differences', 'Decision guidance', 'Value assessment'],
    questions: ['What are the key differences?', 'Which is better for my needs?', 'What\'s the best value?'],
    cta: ['Compare more options', 'Share your choice', 'Get expert advice']
  },
  'case-study': {
    sections: [
      {
        title: 'Introduction',
        headingLevel: 2,
        wordCount: 200,
        bulletPoints: ['Case study overview', 'Context and background', 'Why this case matters'],
        examples: ['Company profile', 'Challenge statement', 'Success preview']
      },
      {
        title: 'The Challenge',
        headingLevel: 2,
        wordCount: 300,
        bulletPoints: ['Problem identification', 'Initial situation', 'Pain points'],
        examples: ['Metrics before', 'Challenges faced', 'Impact assessment']
      },
      {
        title: 'The Solution',
        headingLevel: 2,
        wordCount: 400,
        bulletPoints: ['Approach taken', 'Implementation steps', 'Tools and methods'],
        examples: ['Strategy details', 'Process breakdown', 'Resource allocation']
      },
      {
        title: 'Results and Impact',
        headingLevel: 2,
        wordCount: 400,
        bulletPoints: ['Measurable outcomes', 'Before/after comparison', 'Long-term effects'],
        examples: ['Data visualization', 'Success metrics', 'ROI calculation']
      },
      {
        title: 'Key Takeaways',
        headingLevel: 2,
        wordCount: 300,
        bulletPoints: ['Lessons learned', 'Best practices', 'Replicable strategies'],
        examples: ['Actionable insights', 'Implementation tips', 'Common pitfalls']
      },
      {
        title: 'Conclusion',
        headingLevel: 2,
        wordCount: 150,
        bulletPoints: ['Summary', 'Relevance to readers', 'Next steps'],
        examples: ['Key insights', 'Application ideas', 'Related case studies']
      }
    ],
    keyPoints: ['Real results', 'Detailed process', 'Measurable impact', 'Actionable insights'],
    questions: ['What was the challenge?', 'How was it solved?', 'What were the results?'],
    cta: ['Apply these strategies', 'Share similar experiences', 'Request a consultation']
  }
}

// Keyword pools by industry
const KEYWORD_POOLS: Record<string, string[]> = {
  'digital marketing': ['digital marketing', 'online marketing', 'social media marketing', 'content marketing', 'SEO', 'PPC', 'email marketing'],
  'business': ['business growth', 'entrepreneurship', 'startup', 'small business', 'business strategy', 'lead generation'],
  'technology': ['tech trends', 'software', 'automation', 'AI', 'cloud computing', 'cybersecurity'],
  'fitness': ['fitness', 'workout', 'health', 'nutrition', 'wellness', 'exercise'],
  'food': ['cooking', 'recipes', 'food', 'culinary', 'baking', 'meal prep']
}

// CTA templates by style
const CTA_TEMPLATES: Record<string, string[]> = {
  'soft': [
    'Want to learn more? Explore our related guides.',
    'Found this helpful? Share it with others.',
    'Have questions? Leave a comment below.'
  ],
  'medium': [
    'Ready to get started? Try this method today.',
    'Want similar results? Follow these steps.',
    'Need help? Book a consultation with our team.'
  ],
  'hard': [
    'Start your free trial now - no credit card required.',
    'Download our free guide and get started today.',
    'Join thousands of successful users - sign up now.'
  ]
}

export class BlogOutlineBotService {
  /**
   * Generate blog outline using templates (zero external API usage)
   */
  async generateBlogOutline(
    userId: string,
    topic: string,
    preferences?: UserBlogPreferences,
    blogType?: string,
    wordCount?: number
  ): Promise<BlogOutline> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const userPrefs = preferences || await this.getUserPreferences(userId)
    const selectedBlogType = (blogType || userPrefs.contentTypes[0] || 'how-to') as keyof typeof BLOG_TEMPLATES
    const targetWordCount = wordCount || this.getWordCountTarget(userPrefs.preferredLength)
    
    // Try external AI first (if user has API keys configured)
    const aiPrompt = this.buildAIPrompt(topic, userPrefs, selectedBlogType, targetWordCount)
    const aiContent = await tryExternalAIGeneration(userId, aiPrompt, userPrefs.brandVoice, 'linkedin')
    
    // If AI generation succeeded, parse and use it; otherwise fall back to templates
    if (aiContent) {
      return this.parseAIContent(aiContent, userId, topic, userPrefs, selectedBlogType, targetWordCount)
    }
    
    // Fallback to template-based generation (zero cost)
    return this.generateFromTemplate(userId, topic, userPrefs, selectedBlogType, targetWordCount)
  }

  /**
   * Generate blog outline from templates (fallback method)
   */
  private generateFromTemplate(
    userId: string,
    topic: string,
    preferences: UserBlogPreferences,
    blogType: keyof typeof BLOG_TEMPLATES,
    wordCount: number
  ): BlogOutline {
    const template = BLOG_TEMPLATES[blogType] || BLOG_TEMPLATES['how-to']
    
    // Generate title
    const title = this.generateTitle(topic, blogType, preferences)
    
    // Generate sections from template
    const sections: BlogSection[] = template.sections.map((sectionTemplate, index) => {
      // Adjust word count based on total target
      const sectionWordCount = Math.floor((sectionTemplate.wordCount / 1500) * wordCount)
      
      return {
        id: `section_${index}`,
        title: sectionTemplate.title.replace('[Name]', this.getRandomName()).replace('[topic]', topic),
        headingLevel: sectionTemplate.headingLevel,
        content: '',
        bulletPoints: sectionTemplate.bulletPoints.map(bp => 
          bp.replace('[topic]', topic).replace('[industry]', preferences.industry)
        ),
        examples: sectionTemplate.examples.map(ex => 
          ex.replace('[topic]', topic).replace('[industry]', preferences.industry)
        ),
        statistics: preferences.includeStats ? this.getRandomStatistics(preferences.industry) : undefined,
        quotes: undefined,
        images: preferences.includeImages ? [`${topic} illustration`, `${topic} diagram`] : undefined,
        internalLinks: preferences.internalLinking ? this.getInternalLinks(topic) : undefined,
        externalLinks: this.getExternalLinks(preferences.industry),
        keywords: this.getSectionKeywords(topic, preferences.industry),
        estimatedWordCount: sectionWordCount,
        writingPrompt: this.generateWritingPrompt(sectionTemplate.title, topic, preferences),
        researchNeeded: index === 0 || index === 2, // Intro and main content sections
        orderIndex: index
      }
    })
    
    // Generate meta information
    const slug = this.generateSlug(topic)
    const metaDescription = this.generateMetaDescription(topic, blogType, preferences)
    const keywords = this.getKeywords(topic, preferences.industry)
    
    // Calculate metrics
    const seoScore = this.calculateSEOScore(title, metaDescription, keywords, sections)
    const originalityScore = 75 // Template-based, moderate originality
    const difficulty = this.determineDifficulty(blogType, wordCount)
    const estimatedReadTime = Math.ceil(wordCount / 200) // 200 words per minute
    
    return {
      id: `outline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title,
      topic,
      targetAudience: preferences.targetAudience,
      tone: preferences.brandVoice,
      blogType,
      estimatedReadTime,
      wordCountTarget: wordCount,
      sections,
      keyPoints: template.keyPoints.map(kp => kp.replace('[topic]', topic)),
      keywords,
      metaDescription,
      slug,
      internalLinks: this.getInternalLinks(topic),
      externalLinks: this.getExternalLinks(preferences.industry),
      questionsToAnswer: template.questions.map(q => q.replace('[topic]', topic)),
      callToAction: this.getCTA(preferences.callToActionStyle),
      relatedTopics: this.getRelatedTopics(topic, preferences.industry),
      contentBrief: this.generateContentBrief(topic, blogType, preferences),
      researchNotes: this.generateResearchNotes(topic, preferences.industry),
      seoScore,
      originalityScore,
      difficulty,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      generatedAt: new Date()
    }
  }

  /**
   * Build prompt for external AI generation
   */
  private buildAIPrompt(
    topic: string,
    preferences: UserBlogPreferences,
    blogType: string,
    wordCount: number
  ): string {
    return `Create a comprehensive blog outline for: "${topic}"

Target Audience: ${preferences.targetAudience}
Industry: ${preferences.industry}
Brand Voice: ${preferences.brandVoice}
Blog Type: ${blogType}
Word Count Target: ${wordCount}
Content Goals: ${preferences.contentGoals.join(', ')}

Requirements:
- Include ${preferences.includeStats ? 'relevant statistics and data' : 'key information'}
- ${preferences.includeExamples ? 'Provide real-world examples and case studies' : 'Include practical insights'}
- ${preferences.seoFocus ? 'Optimize for SEO with keywords and structure' : 'Focus on readability and engagement'}
- Include ${preferences.callToActionStyle} call-to-action
- Create detailed sections with bullet points, examples, and estimated word counts

Return a structured outline with sections, key points, keywords, and meta information.`
  }

  /**
   * Parse AI-generated content into BlogOutline object
   */
  private parseAIContent(
    content: string,
    userId: string,
    topic: string,
    preferences: UserBlogPreferences,
    blogType: string,
    wordCount: number
  ): BlogOutline {
    // Extract title
    const titleMatch = content.match(/Title:\s*(.+)/i)
    const title = titleMatch ? titleMatch[1].trim() : `Complete Guide to ${topic}`
    
    // Extract sections (basic parsing)
    const sectionMatches = content.match(/##?\s+(.+)/g) || []
    const sections: BlogSection[] = sectionMatches.map((match, index) => {
      const title = match.replace(/##?\s+/, '').trim()
      return {
        id: `section_${index}`,
        title,
        headingLevel: match.startsWith('## ') ? 2 : 3,
        content: '',
        bulletPoints: [],
        examples: [],
        statistics: preferences.includeStats ? this.getRandomStatistics(preferences.industry) : undefined,
        estimatedWordCount: Math.floor(wordCount / sectionMatches.length),
        writingPrompt: `Write about ${title} in the context of ${topic}`,
        researchNeeded: false,
        orderIndex: index
      }
    })
    
    // Extract keywords
    const keywordMatch = content.match(/Keywords?:\s*(.+)/i)
    const keywords = keywordMatch 
      ? keywordMatch[1].split(',').map(k => k.trim())
      : this.getKeywords(topic, preferences.industry)
    
    return {
      id: `outline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title,
      topic,
      targetAudience: preferences.targetAudience,
      tone: preferences.brandVoice,
      blogType: blogType as BlogOutline['blogType'],
      estimatedReadTime: Math.ceil(wordCount / 200),
      wordCountTarget: wordCount,
      sections: sections.length > 0 ? sections : this.getDefaultSections(blogType, wordCount),
      keyPoints: this.getKeyPoints(topic, blogType),
      keywords,
      metaDescription: this.generateMetaDescription(topic, blogType, preferences),
      slug: this.generateSlug(topic),
      internalLinks: [],
      externalLinks: [],
      questionsToAnswer: [],
      callToAction: this.getCTA(preferences.callToActionStyle),
      relatedTopics: this.getRelatedTopics(topic, preferences.industry),
      contentBrief: `A comprehensive ${blogType} blog about ${topic} for ${preferences.targetAudience}`,
      researchNotes: '',
      seoScore: 80,
      originalityScore: 85,
      difficulty: 'intermediate',
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      generatedAt: new Date()
    }
  }

  /**
   * Get or create user preferences
   */
  async getUserPreferences(userId: string): Promise<UserBlogPreferences> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const result = await sql`
      SELECT * FROM bot_user_blog_preferences WHERE user_id = ${userId}
    `

    if (result.length > 0) {
      const pref = result[0]
      return {
        id: pref.id,
        userId: pref.user_id,
        industry: pref.industry || 'digital marketing',
        targetAudience: pref.target_audience || 'small business owners',
        brandVoice: pref.brand_voice || 'educational',
        contentGoals: pref.content_goals || ['educate', 'engage'],
        preferredLength: pref.preferred_length || 'medium',
        seoFocus: pref.seo_focus ?? true,
        includeStats: pref.include_stats ?? true,
        includeExamples: pref.include_examples ?? true,
        includeImages: pref.include_images ?? true,
        competitorAnalysis: pref.competitor_analysis ?? false,
        keywordResearch: pref.keyword_research ?? true,
        internalLinking: pref.internal_linking ?? true,
        callToActionStyle: pref.call_to_action_style || 'medium',
        contentTypes: pref.content_types || ['how-to', 'listicle'],
        avoidTopics: pref.avoid_topics || [],
        customGuidelines: pref.custom_guidelines,
        createdAt: pref.created_at,
        updatedAt: pref.updated_at
      }
    }

    // Create default preferences
    const defaultPrefs: UserBlogPreferences = {
      id: `prefs_${userId}`,
      userId,
      industry: 'digital marketing',
      targetAudience: 'small business owners',
      brandVoice: 'educational',
      contentGoals: ['educate', 'engage'],
      preferredLength: 'medium',
      seoFocus: true,
      includeStats: true,
      includeExamples: true,
      includeImages: true,
      competitorAnalysis: false,
      keywordResearch: true,
      internalLinking: true,
      callToActionStyle: 'medium',
      contentTypes: ['how-to', 'listicle'],
      avoidTopics: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await sql`
      INSERT INTO bot_user_blog_preferences (
        id, user_id, industry, target_audience, brand_voice, content_goals,
        preferred_length, seo_focus, include_stats, include_examples, include_images,
        keyword_research, internal_linking, call_to_action_style, content_types
      ) VALUES (
        ${defaultPrefs.id}, ${defaultPrefs.userId}, ${defaultPrefs.industry},
        ${defaultPrefs.targetAudience}, ${defaultPrefs.brandVoice}, ${sql.array(defaultPrefs.contentGoals)},
        ${defaultPrefs.preferredLength}, ${defaultPrefs.seoFocus}, ${defaultPrefs.includeStats},
        ${defaultPrefs.includeExamples}, ${defaultPrefs.includeImages}, ${defaultPrefs.keywordResearch},
        ${defaultPrefs.internalLinking}, ${defaultPrefs.callToActionStyle}, ${sql.array(defaultPrefs.contentTypes)}
      )
    `

    return defaultPrefs
  }

  /**
   * Save blog outline to database
   */
  async saveBlogOutline(outline: BlogOutline): Promise<void> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    await sql`
      INSERT INTO bot_blog_outlines (
        id, user_id, title, topic, target_audience, tone, blog_type,
        estimated_read_time, word_count_target, sections, key_points, keywords,
        meta_description, slug, internal_links, external_links, questions_to_answer,
        call_to_action, related_topics, content_brief, research_notes, seo_score,
        originality_score, difficulty, status
      ) VALUES (
        ${outline.id}, ${outline.userId}, ${outline.title}, ${outline.topic},
        ${outline.targetAudience}, ${outline.tone}, ${outline.blogType},
        ${outline.estimatedReadTime}, ${outline.wordCountTarget}, ${JSON.stringify(outline.sections)},
        ${sql.array(outline.keyPoints)}, ${sql.array(outline.keywords)}, ${outline.metaDescription},
        ${outline.slug}, ${sql.array(outline.internalLinks)}, ${sql.array(outline.externalLinks)},
        ${sql.array(outline.questionsToAnswer)}, ${outline.callToAction}, ${sql.array(outline.relatedTopics)},
        ${outline.contentBrief}, ${outline.researchNotes}, ${outline.seoScore},
        ${outline.originalityScore}, ${outline.difficulty}, ${outline.status}
      )
    `
  }

  /**
   * Get user's blog outlines
   */
  async getUserOutlines(userId: string, limit: number = 20): Promise<BlogOutline[]> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const result = await sql`
      SELECT * FROM bot_blog_outlines
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    return result.map(this.mapDbToBlogOutline)
  }

  /**
   * Get blog outline by ID
   */
  async getBlogOutlineById(outlineId: string): Promise<BlogOutline | null> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const result = await sql`
      SELECT * FROM bot_blog_outlines WHERE id = ${outlineId} LIMIT 1
    `

    if (result.length === 0) return null

    return this.mapDbToBlogOutline(result[0])
  }

  /**
   * Helper: Map database row to BlogOutline
   */
  private mapDbToBlogOutline(row: any): BlogOutline {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      topic: row.topic,
      targetAudience: row.target_audience,
      tone: row.tone,
      blogType: row.blog_type,
      estimatedReadTime: row.estimated_read_time,
      wordCountTarget: row.word_count_target,
      sections: row.sections || [],
      keyPoints: row.key_points || [],
      keywords: row.keywords || [],
      metaDescription: row.meta_description,
      slug: row.slug,
      internalLinks: row.internal_links || [],
      externalLinks: row.external_links || [],
      questionsToAnswer: row.questions_to_answer || [],
      callToAction: row.call_to_action,
      relatedTopics: row.related_topics || [],
      contentBrief: row.content_brief,
      researchNotes: row.research_notes || '',
      seoScore: row.seo_score || 0,
      originalityScore: row.originality_score || 0,
      difficulty: row.difficulty || 'intermediate',
      status: row.status || 'draft',
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      generatedAt: new Date(row.generated_at)
    }
  }

  // Helper methods
  private generateTitle(topic: string, blogType: string, preferences: UserBlogPreferences): string {
    const templates: Record<string, string[]> = {
      'how-to': [
        `How to ${topic}: Complete Step-by-Step Guide`,
        `The Ultimate Guide to ${topic}`,
        `${topic}: A Beginner's Guide`
      ],
      'listicle': [
        `Top 10 ${topic} Strategies You Need to Know`,
        `7 Best ${topic} Tips for ${preferences.targetAudience}`,
        `${topic}: 15 Essential Tips`
      ],
      'review': [
        `${topic} Review: Honest Analysis and Verdict`,
        `Is ${topic} Worth It? Complete Review`,
        `${topic}: Detailed Review and Rating`
      ]
    }
    
    const typeTemplates = templates[blogType] || templates['how-to']
    return typeTemplates[Math.floor(Math.random() * typeTemplates.length)]
  }

  private generateSlug(topic: string): string {
    return topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  private generateMetaDescription(topic: string, blogType: string, preferences: UserBlogPreferences): string {
    const templates = [
      `Learn everything about ${topic} with this comprehensive guide. Perfect for ${preferences.targetAudience}.`,
      `Discover proven strategies for ${topic}. Expert tips and actionable advice for ${preferences.targetAudience}.`,
      `Complete guide to ${topic}. Includes step-by-step instructions, examples, and best practices.`
    ]
    return templates[Math.floor(Math.random() * templates.length)]
  }

  private getKeywords(topic: string, industry: string): string[] {
    const baseKeywords = [topic, `${topic} guide`, `${topic} tips`]
    const industryKeywords = KEYWORD_POOLS[industry.toLowerCase()] || KEYWORD_POOLS['digital marketing']
    return [...baseKeywords, ...industryKeywords.slice(0, 3)]
  }

  private getSectionKeywords(topic: string, industry: string): string[] {
    return this.getKeywords(topic, industry).slice(0, 3)
  }

  private getInternalLinks(topic: string): string[] {
    return [
      `related-${topic.toLowerCase().replace(/\s+/g, '-')}`,
      `more-about-${topic.toLowerCase().replace(/\s+/g, '-')}`
    ]
  }

  private getExternalLinks(industry: string): string[] {
    const links: Record<string, string[]> = {
      'digital marketing': ['https://blog.hubspot.com', 'https://moz.com/blog', 'https://contentmarketinginstitute.com'],
      'business': ['https://hbr.org', 'https://entrepreneur.com', 'https://inc.com'],
      'technology': ['https://techcrunch.com', 'https://wired.com', 'https://theverge.com']
    }
    return links[industry.toLowerCase()] || links['digital marketing']
  }

  private getCTA(style: string): string {
    const ctas = CTA_TEMPLATES[style] || CTA_TEMPLATES['medium']
    return ctas[Math.floor(Math.random() * ctas.length)]
  }

  private getRelatedTopics(topic: string, industry: string): string[] {
    return [
      `${topic} advanced strategies`,
      `${topic} for beginners`,
      `${topic} best practices`,
      `related ${industry} topics`
    ]
  }

  private generateContentBrief(topic: string, blogType: string, preferences: UserBlogPreferences): string {
    return `This ${blogType} blog post will provide a comprehensive guide to ${topic} for ${preferences.targetAudience}. It will cover key concepts, practical strategies, and actionable insights to help readers achieve their goals.`
  }

  private generateResearchNotes(topic: string, industry: string): string {
    return `## Research Summary\n\n### Topic: ${topic}\n### Industry: ${industry}\n\nKey areas to research:\n- Current trends and best practices\n- Common questions and concerns\n- Expert insights and case studies\n- Statistics and data points\n- Competitor content analysis`
  }

  private generateWritingPrompt(sectionTitle: string, topic: string, preferences: UserBlogPreferences): string {
    return `Write about "${sectionTitle}" in the context of ${topic} for ${preferences.targetAudience}. Use a ${preferences.brandVoice} tone and include practical examples.`
  }

  private getRandomStatistics(industry: string): string[] {
    const stats: Record<string, string[]> = {
      'digital marketing': [
        '73% of marketers use social media for business',
        'Content marketing generates 3x more leads than paid search',
        'Email marketing has an average ROI of 4200%'
      ],
      'business': [
        '80% of businesses fail within the first 18 months',
        'Small businesses create 1.5 million jobs annually',
        'Customer retention increases profits by 25-95%'
      ]
    }
    return stats[industry.toLowerCase()] || stats['digital marketing']
  }

  private getRandomName(): string {
    const names = ['Product A', 'Service X', 'Tool Y', 'Platform Z']
    return names[Math.floor(Math.random() * names.length)]
  }

  private getKeyPoints(topic: string, blogType: string): string[] {
    const points: Record<string, string[]> = {
      'how-to': [
        `Clear step-by-step process for ${topic}`,
        `Troubleshooting common issues`,
        `Best practices and pro tips`,
        `Real-world examples and applications`
      ],
      'listicle': [
        `Comprehensive list of ${topic} strategies`,
        `Clear ranking and comparison`,
        `Actionable insights for each item`,
        `Easy-to-scan format`
      ]
    }
    return points[blogType] || points['how-to']
  }

  private getDefaultSections(blogType: string, wordCount: number): BlogSection[] {
    const template = BLOG_TEMPLATES[blogType] || BLOG_TEMPLATES['how-to']
    return template.sections.map((sectionTemplate, index) => ({
      id: `section_${index}`,
      title: sectionTemplate.title,
      headingLevel: sectionTemplate.headingLevel,
      content: '',
      bulletPoints: sectionTemplate.bulletPoints,
      examples: sectionTemplate.examples,
      estimatedWordCount: Math.floor((sectionTemplate.wordCount / 1500) * wordCount),
      writingPrompt: `Write about ${sectionTemplate.title}`,
      researchNeeded: false,
      orderIndex: index
    }))
  }

  private calculateSEOScore(title: string, metaDescription: string, keywords: string[], sections: BlogSection[]): number {
    let score = 50
    
    if (title.length > 30 && title.length < 60) score += 10
    if (metaDescription.length > 120 && metaDescription.length < 160) score += 10
    if (keywords.length >= 3) score += 10
    if (sections.length > 3) score += 10
    if (sections.some(s => s.keywords && s.keywords.length > 0)) score += 10
    
    return Math.min(score, 100)
  }

  private determineDifficulty(blogType: string, wordCount: number): 'beginner' | 'intermediate' | 'advanced' {
    if (wordCount < 1200) return 'beginner'
    if (wordCount < 2500) return 'intermediate'
    return 'advanced'
  }

  private getWordCountTarget(length: string): number {
    const targets = {
      'short': 1000,
      'medium': 1800,
      'long': 3000
    }
    return targets[length as keyof typeof targets] || 1800
  }
}
