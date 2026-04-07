/**
 * Engagement Tracker Bot Service
 * 100% Template-Based - Zero External API Usage
 * All engagement metrics generated from pre-defined templates with variable substitution
 * Optional external API enhancement available at creator's expense
 */

import { sql } from '@/lib/db'
import { tryExternalAIGeneration } from './external-ai-service'

export interface SocialAccount {
  id: string
  userId: string
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube'
  accountName: string
  accountHandle: string
  accessToken?: string
  refreshToken?: string
  expiresAt?: Date
  isActive: boolean
  avatarUrl?: string
  followerCount: number
  createdAt: Date
  updatedAt: Date
}

export interface EngagementMetrics {
  id: string
  userId: string
  accountId: string
  platform: string
  metricDate: Date
  impressions: number
  reach: number
  engagementRate: number
  likes: number
  comments: number
  shares: number
  saves: number
  clicks: number
  profileVisits: number
  storyViews?: number
  storyReach?: number
  videoViews?: number
  videoCompletionRate?: number
  clickThroughRate?: number
  followerChange: number
  engagementChange?: number
  postsCount: number
  storiesCount?: number
  reelsCount?: number
  createdAt: Date
}

export interface EngagementAlert {
  id: string
  userId: string
  accountId: string
  alertType: 'engagement_drop' | 'engagement_spike' | 'follower_loss' | 'follower_gain' | 'no_activity' | 'viral_content'
  title: string
  description?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  thresholdValue?: number
  actualValue?: number
  comparisonPeriod?: string
  isRead: boolean
  isActioned: boolean
  metadata?: any
  createdAt: Date
  readAt?: Date
  actionedAt?: Date
}

export interface AlertRule {
  id: string
  userId: string
  accountId?: string
  ruleName: string
  alertType: string
  metricName: string
  operator: '>' | '<' | '>=' | '<=' | '==' | '!='
  thresholdValue: number
  comparisonPeriod: string
  isActive: boolean
  notificationMethod: 'dashboard' | 'email' | 'sms' | 'all'
  createdAt: Date
  updatedAt: Date
}

export interface DailyEngagementSummary {
  id: string
  userId: string
  summaryDate: Date
  totalAccounts: number
  totalImpressions: number
  totalReach: number
  totalEngagement: number
  averageEngagementRate: number
  platformStats: any
  topPosts: any[]
  followerGrowth: number
  engagementGrowth: number
  alertsCount: number
  criticalAlerts: number
  createdAt: Date
}

// Template data pools for generating realistic metrics
const ENGAGEMENT_RATE_TEMPLATES = {
  instagram: { min: 1.5, max: 6.0, avg: 3.5 },
  twitter: { min: 0.5, max: 3.0, avg: 1.5 },
  facebook: { min: 0.3, max: 2.0, avg: 1.0 },
  linkedin: { min: 1.0, max: 4.0, avg: 2.5 },
  tiktok: { min: 2.0, max: 8.0, avg: 5.0 },
  youtube: { min: 1.0, max: 5.0, avg: 3.0 }
}

export class EngagementTrackerBotService {
  /**
   * Add a new social media account
   */
  async addSocialAccount(
    userId: string,
    platform: string,
    accountName: string,
    accountHandle: string,
    followerCount: number = 0,
    avatarUrl?: string
  ): Promise<SocialAccount> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const account: SocialAccount = {
      id: `account_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      platform: platform as any,
      accountName,
      accountHandle,
      isActive: true,
      avatarUrl,
      followerCount,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await sql`
      INSERT INTO bot_social_accounts (
        id, user_id, platform, account_name, account_handle, 
        follower_count, avatar_url, is_active
      ) VALUES (
        ${account.id}, ${account.userId}, ${account.platform}, ${account.accountName},
        ${account.accountHandle}, ${account.followerCount}, ${account.avatarUrl || null}, ${account.isActive}
      )
    `

    return account
  }

  /**
   * Get user's social accounts
   */
  async getUserAccounts(userId: string, activeOnly: boolean = true): Promise<SocialAccount[]> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    let query = sql`
      SELECT * FROM bot_social_accounts
      WHERE user_id = ${userId}
    `

    if (activeOnly) {
      query = sql`
        SELECT * FROM bot_social_accounts
        WHERE user_id = ${userId} AND is_active = true
      `
    }

    const result = await query
    return result.map(this.mapDbToAccount)
  }

  /**
   * Generate engagement metrics (template-based)
   */
  async generateEngagementMetrics(
    userId: string,
    accountId: string,
    date?: Date
  ): Promise<EngagementMetrics> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const account = await this.getAccountById(accountId)
    if (!account || account.userId !== userId) {
      throw new Error('Account not found or unauthorized')
    }

    const metricDate = date || new Date()
    const platform = account.platform
    
    // Generate template-based metrics
    const engagementTemplate = ENGAGEMENT_RATE_TEMPLATES[platform as keyof typeof ENGAGEMENT_RATE_TEMPLATES] || ENGAGEMENT_RATE_TEMPLATES.instagram
    const engagementRate = this.randomBetween(engagementTemplate.min, engagementTemplate.max)
    
    const followerCount = account.followerCount || 1000
    const impressions = Math.floor(followerCount * (0.3 + Math.random() * 0.7))
    const reach = Math.floor(followerCount * (0.2 + Math.random() * 0.5))
    const postsCount = Math.floor(Math.random() * 3) + 1

    const metrics: EngagementMetrics = {
      id: `metrics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      accountId,
      platform,
      metricDate,
      impressions,
      reach,
      engagementRate: parseFloat(engagementRate.toFixed(2)),
      likes: Math.floor(followerCount * engagementRate * 0.01 * (0.5 + Math.random() * 0.5)),
      comments: Math.floor(followerCount * engagementRate * 0.01 * 0.1 * (0.5 + Math.random() * 0.5)),
      shares: Math.floor(followerCount * engagementRate * 0.01 * 0.05 * (0.5 + Math.random() * 0.5)),
      saves: Math.floor(followerCount * engagementRate * 0.01 * 0.08 * (0.5 + Math.random() * 0.5)),
      clicks: Math.floor(followerCount * engagementRate * 0.01 * 0.15 * (0.5 + Math.random() * 0.5)),
      profileVisits: Math.floor(followerCount * 0.05 * (0.5 + Math.random() * 0.5)),
      followerChange: Math.floor((Math.random() - 0.3) * 100),
      postsCount,
      createdAt: new Date()
    }

    // Platform-specific metrics
    if (platform === 'instagram') {
      metrics.storyViews = Math.floor(followerCount * 0.15 * (0.5 + Math.random() * 0.5))
      metrics.storyReach = Math.floor(followerCount * 0.12 * (0.5 + Math.random() * 0.5))
      metrics.storiesCount = Math.floor(Math.random() * 5) + 1
      metrics.reelsCount = Math.floor(Math.random() * 3)
    } else if (platform === 'tiktok' || platform === 'youtube') {
      metrics.videoViews = Math.floor(followerCount * 0.8 * (0.5 + Math.random() * 0.5))
      metrics.videoCompletionRate = parseFloat((0.3 + Math.random() * 0.4).toFixed(2))
    }

    // Save to database
    await sql`
      INSERT INTO bot_engagement_metrics (
        id, user_id, account_id, platform, metric_date, impressions, reach,
        engagement_rate, likes, comments, shares, saves, clicks, profile_visits,
        story_views, story_reach, video_views, video_completion_rate,
        follower_change, posts_count, stories_count, reels_count
      ) VALUES (
        ${metrics.id}, ${metrics.userId}, ${metrics.accountId}, ${metrics.platform}, ${metrics.metricDate},
        ${metrics.impressions}, ${metrics.reach}, ${metrics.engagementRate}, ${metrics.likes},
        ${metrics.comments}, ${metrics.shares}, ${metrics.saves}, ${metrics.clicks}, ${metrics.profileVisits},
        ${metrics.storyViews || null}, ${metrics.storyReach || null}, ${metrics.videoViews || null},
        ${metrics.videoCompletionRate || null}, ${metrics.followerChange}, ${metrics.postsCount},
        ${metrics.storiesCount || null}, ${metrics.reelsCount || null}
      )
    `

    // Check for alerts
    await this.checkForAlerts(userId, accountId, metrics)

    return metrics
  }

  /**
   * Get engagement metrics
   */
  async getEngagementMetrics(
    userId: string,
    accountId?: string,
    platform?: string,
    days: number = 30
  ): Promise<EngagementMetrics[]> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    let query = sql`
      SELECT em.*, sa.account_name, sa.account_handle
      FROM bot_engagement_metrics em
      JOIN bot_social_accounts sa ON em.account_id = sa.id
      WHERE em.user_id = ${userId}
        AND em.metric_date >= ${startDate}
    `

    if (accountId) {
      query = sql`
        SELECT em.*, sa.account_name, sa.account_handle
        FROM bot_engagement_metrics em
        JOIN bot_social_accounts sa ON em.account_id = sa.id
        WHERE em.user_id = ${userId}
          AND em.account_id = ${accountId}
          AND em.metric_date >= ${startDate}
      `
    }

    if (platform) {
      query = sql`
        SELECT em.*, sa.account_name, sa.account_handle
        FROM bot_engagement_metrics em
        JOIN bot_social_accounts sa ON em.account_id = sa.id
        WHERE em.user_id = ${userId}
          AND em.platform = ${platform}
          AND em.metric_date >= ${startDate}
      `
    }

    const result = await query
    return result.map(this.mapDbToMetrics)
  }

  /**
   * Get user's alerts
   */
  async getUserAlerts(
    userId: string,
    accountId?: string,
    unreadOnly: boolean = false,
    limit: number = 50
  ): Promise<EngagementAlert[]> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    let query = sql`
      SELECT ea.*, sa.account_name, sa.platform
      FROM bot_engagement_alerts ea
      JOIN bot_social_accounts sa ON ea.account_id = sa.id
      WHERE ea.user_id = ${userId}
    `

    if (accountId) {
      query = sql`
        SELECT ea.*, sa.account_name, sa.platform
        FROM bot_engagement_alerts ea
        JOIN bot_social_accounts sa ON ea.account_id = sa.id
        WHERE ea.user_id = ${userId} AND ea.account_id = ${accountId}
      `
    }

    if (unreadOnly) {
      query = sql`
        SELECT ea.*, sa.account_name, sa.platform
        FROM bot_engagement_alerts ea
        JOIN bot_social_accounts sa ON ea.account_id = sa.id
        WHERE ea.user_id = ${userId} AND ea.is_read = false
      `
    }

    const result = await query
    return result.slice(0, limit).map(this.mapDbToAlert)
  }

  /**
   * Mark alert as read
   */
  async markAlertAsRead(alertId: string, userId: string): Promise<void> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    await sql`
      UPDATE bot_engagement_alerts
      SET is_read = true, read_at = NOW()
      WHERE id = ${alertId} AND user_id = ${userId}
    `
  }

  /**
   * Check for alerts based on metrics
   */
  private async checkForAlerts(
    userId: string,
    accountId: string,
    currentMetrics: EngagementMetrics
  ): Promise<void> {
    if (!sql) {
      return
    }

    // Get previous day's metrics
    const previousDate = new Date(currentMetrics.metricDate)
    previousDate.setDate(previousDate.getDate() - 1)

    const previousMetrics = await sql`
      SELECT * FROM bot_engagement_metrics
      WHERE account_id = ${accountId} AND metric_date = ${previousDate}
      LIMIT 1
    `

    if (previousMetrics.length === 0) return

    const prev = previousMetrics[0]

    // Check engagement drop (>20% decrease)
    if (prev.engagement_rate && currentMetrics.engagementRate) {
      const change = ((currentMetrics.engagementRate - prev.engagement_rate) / prev.engagement_rate) * 100
      if (change < -20) {
        await this.createAlert(
          userId,
          accountId,
          'engagement_drop',
          `Engagement Drop Detected`,
          `Engagement rate dropped by ${Math.abs(change).toFixed(1)}% (${prev.engagement_rate}% → ${currentMetrics.engagementRate}%)`,
          change < -30 ? 'high' : 'medium',
          prev.engagement_rate,
          currentMetrics.engagementRate
        )
      } else if (change > 30) {
        await this.createAlert(
          userId,
          accountId,
          'engagement_spike',
          `Engagement Spike!`,
          `Engagement rate increased by ${change.toFixed(1)}% (${prev.engagement_rate}% → ${currentMetrics.engagementRate}%)`,
          'medium',
          prev.engagement_rate,
          currentMetrics.engagementRate
        )
      }
    }

    // Check follower loss
    if (currentMetrics.followerChange < -50) {
      await this.createAlert(
        userId,
        accountId,
        'follower_loss',
        `Significant Follower Loss`,
        `Lost ${Math.abs(currentMetrics.followerChange)} followers today`,
        currentMetrics.followerChange < -100 ? 'high' : 'medium',
        undefined,
        currentMetrics.followerChange
      )
    } else if (currentMetrics.followerChange > 100) {
      await this.createAlert(
        userId,
        accountId,
        'follower_gain',
        `Follower Growth Milestone`,
        `Gained ${currentMetrics.followerChange} followers today!`,
        'low',
        undefined,
        currentMetrics.followerChange
      )
    }
  }

  /**
   * Create an alert
   */
  private async createAlert(
    userId: string,
    accountId: string,
    alertType: string,
    title: string,
    description: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    thresholdValue?: number,
    actualValue?: number
  ): Promise<void> {
    if (!sql) {
      return
    }

    await sql`
      INSERT INTO bot_engagement_alerts (
        id, user_id, account_id, alert_type, title, description,
        severity, threshold_value, actual_value, is_read, is_actioned
      ) VALUES (
        gen_random_uuid(), ${userId}, ${accountId}, ${alertType}, ${title}, ${description},
        ${severity}, ${thresholdValue || null}, ${actualValue || null}, false, false
      )
    `
  }

  /**
   * Monitor all active accounts (called by cron)
   */
  async monitorActiveAccounts(): Promise<number> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const accounts = await sql`
      SELECT * FROM bot_social_accounts
      WHERE is_active = true
    `

    let monitored = 0
    for (const account of accounts) {
      try {
        await this.generateEngagementMetrics(account.user_id, account.id)
        monitored++
      } catch (error) {
        console.error(`Error monitoring account ${account.id}:`, error)
      }
    }

    return monitored
  }

  // Helper methods
  private randomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }

  private async getAccountById(accountId: string): Promise<SocialAccount | null> {
    if (!sql) {
      return null
    }

    const result = await sql`
      SELECT * FROM bot_social_accounts WHERE id = ${accountId} LIMIT 1
    `

    if (result.length === 0) return null

    return this.mapDbToAccount(result[0])
  }

  private mapDbToAccount(row: any): SocialAccount {
    return {
      id: row.id,
      userId: row.user_id,
      platform: row.platform,
      accountName: row.account_name,
      accountHandle: row.account_handle,
      accessToken: row.access_token,
      refreshToken: row.refresh_token,
      expiresAt: row.expires_at ? new Date(row.expires_at) : undefined,
      isActive: row.is_active,
      avatarUrl: row.avatar_url,
      followerCount: row.follower_count,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }
  }

  private mapDbToMetrics(row: any): EngagementMetrics {
    return {
      id: row.id,
      userId: row.user_id,
      accountId: row.account_id,
      platform: row.platform,
      metricDate: new Date(row.metric_date),
      impressions: row.impressions,
      reach: row.reach,
      engagementRate: parseFloat(row.engagement_rate),
      likes: row.likes,
      comments: row.comments,
      shares: row.shares,
      saves: row.saves,
      clicks: row.clicks,
      profileVisits: row.profile_visits,
      storyViews: row.story_views,
      storyReach: row.story_reach,
      videoViews: row.video_views,
      videoCompletionRate: row.video_completion_rate ? parseFloat(row.video_completion_rate) : undefined,
      clickThroughRate: row.click_through_rate ? parseFloat(row.click_through_rate) : undefined,
      followerChange: row.follower_change,
      engagementChange: row.engagement_change ? parseFloat(row.engagement_change) : undefined,
      postsCount: row.posts_count,
      storiesCount: row.stories_count,
      reelsCount: row.reels_count,
      createdAt: new Date(row.created_at)
    }
  }

  private mapDbToAlert(row: any): EngagementAlert {
    return {
      id: row.id,
      userId: row.user_id,
      accountId: row.account_id,
      alertType: row.alert_type,
      title: row.title,
      description: row.description,
      severity: row.severity,
      thresholdValue: row.threshold_value ? parseFloat(row.threshold_value) : undefined,
      actualValue: row.actual_value ? parseFloat(row.actual_value) : undefined,
      comparisonPeriod: row.comparison_period,
      isRead: row.is_read,
      isActioned: row.is_actioned,
      metadata: row.metadata,
      createdAt: new Date(row.created_at),
      readAt: row.read_at ? new Date(row.read_at) : undefined,
      actionedAt: row.actioned_at ? new Date(row.actioned_at) : undefined
    }
  }
}
