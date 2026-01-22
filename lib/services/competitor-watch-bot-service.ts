/**
 * Competitor Watch Bot Service
 * 100% Template-Based - Zero External API Usage
 * All competitor data generated from pre-defined templates with variable substitution
 * Optional external API enhancement available at creator's expense
 */

import { sql } from '@/lib/db'
import { tryExternalAIGeneration } from './external-ai-service'

export interface Competitor {
  id: string
  userId: string
  name: string
  websiteUrl: string
  industry?: string
  companySize?: string
  foundedYear?: number
  headquartersLocation?: string
  description?: string
  status: 'active' | 'paused' | 'archived'
  monitoringFrequency: 'daily' | 'weekly' | 'monthly'
  createdAt: Date
  updatedAt: Date
  nextMonitoringAt?: Date
  lastMonitoredAt?: Date
}

export interface CompetitorMetrics {
  id: string
  competitorId: string
  userId: string
  metricDate: Date
  websiteTraffic?: number
  organicTraffic?: number
  paidTraffic?: number
  bounceRate?: number
  domainAuthority?: number
  backlinkCount?: number
  facebookFollowers?: number
  instagramFollowers?: number
  twitterFollowers?: number
  linkedinFollowers?: number
  blogPostsCount?: number
  estimatedAdSpend?: number
  createdAt: Date
}

export interface CompetitorAlert {
  id: string
  competitorId?: string
  userId: string
  alertType: string
  title: string
  description?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  isRead: boolean
  createdAt: Date
}

export interface CompetitorReport {
  id: string
  userId: string
  reportType: 'weekly' | 'monthly' | 'custom'
  title: string
  periodStartDate: Date
  periodEndDate: Date
  competitors: string[]
  executiveSummary?: string
  keyFindings?: any
  opportunities?: any[]
  threats?: any[]
  recommendations?: any[]
  status: 'pending' | 'generating' | 'completed' | 'failed'
  createdAt: Date
  updatedAt: Date
  generatedAt?: Date
}

// Template data pools
const TRAFFIC_TEMPLATES = {
  small: { min: 1000, max: 10000, avg: 5000 },
  medium: { min: 10000, max: 100000, avg: 50000 },
  large: { min: 100000, max: 1000000, avg: 500000 }
}

const FOLLOWER_TEMPLATES = {
  small: { min: 500, max: 5000, avg: 2500 },
  medium: { min: 5000, max: 50000, avg: 25000 },
  large: { min: 50000, max: 500000, avg: 250000 }
}

export class CompetitorWatchBotService {
  /**
   * Add a new competitor to track
   */
  async addCompetitor(
    userId: string,
    name: string,
    websiteUrl: string,
    industry?: string,
    companySize?: string,
    monitoringFrequency: 'daily' | 'weekly' | 'monthly' = 'weekly'
  ): Promise<Competitor> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const competitor: Competitor = {
      id: `competitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      name,
      websiteUrl,
      industry,
      companySize,
      status: 'active',
      monitoringFrequency,
      createdAt: new Date(),
      updatedAt: new Date(),
      nextMonitoringAt: this.calculateNextMonitoring(new Date(), monitoringFrequency)
    }

    await sql`
      INSERT INTO bot_competitors (
        id, user_id, name, website_url, industry, company_size,
        monitoring_frequency, status, next_monitoring_at
      ) VALUES (
        ${competitor.id}, ${competitor.userId}, ${competitor.name}, ${competitor.websiteUrl},
        ${competitor.industry || null}, ${competitor.companySize || null},
        ${competitor.monitoringFrequency}, ${competitor.status}, ${competitor.nextMonitoringAt}
      )
    `

    return competitor
  }

  /**
   * Get user's competitors
   */
  async getUserCompetitors(userId: string): Promise<Competitor[]> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const result = await sql`
      SELECT * FROM bot_competitors
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `

    return result.map(this.mapDbToCompetitor)
  }

  /**
   * Get competitor by ID
   */
  async getCompetitorById(competitorId: string): Promise<Competitor | null> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const result = await sql`
      SELECT * FROM bot_competitors WHERE id = ${competitorId} LIMIT 1
    `

    if (result.length === 0) return null

    return this.mapDbToCompetitor(result[0])
  }

  /**
   * Generate competitor metrics (template-based)
   */
  async generateCompetitorMetrics(
    userId: string,
    competitorId: string,
    date?: Date
  ): Promise<CompetitorMetrics> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const competitor = await this.getCompetitorById(competitorId)
    if (!competitor) {
      throw new Error('Competitor not found')
    }

    const metricDate = date || new Date()
    const companySize = competitor.companySize || 'medium'
    
    // Generate template-based metrics
    const trafficTemplate = TRAFFIC_TEMPLATES[companySize as keyof typeof TRAFFIC_TEMPLATES] || TRAFFIC_TEMPLATES.medium
    const followerTemplate = FOLLOWER_TEMPLATES[companySize as keyof typeof FOLLOWER_TEMPLATES] || FOLLOWER_TEMPLATES.medium

    const metrics: CompetitorMetrics = {
      id: `metrics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      competitorId,
      userId,
      metricDate,
      websiteTraffic: this.randomBetween(trafficTemplate.min, trafficTemplate.max),
      organicTraffic: this.randomBetween(Math.floor(trafficTemplate.min * 0.7), Math.floor(trafficTemplate.max * 0.7)),
      paidTraffic: this.randomBetween(Math.floor(trafficTemplate.min * 0.3), Math.floor(trafficTemplate.max * 0.3)),
      bounceRate: this.randomBetween(30, 70) / 100,
      domainAuthority: this.randomBetween(20, 80),
      backlinkCount: this.randomBetween(100, 10000),
      facebookFollowers: this.randomBetween(followerTemplate.min, followerTemplate.max),
      instagramFollowers: this.randomBetween(followerTemplate.min, followerTemplate.max),
      twitterFollowers: this.randomBetween(followerTemplate.min, followerTemplate.max),
      linkedinFollowers: this.randomBetween(followerTemplate.min, followerTemplate.max),
      blogPostsCount: this.randomBetween(2, 20),
      estimatedAdSpend: this.randomBetween(1000, 50000),
      createdAt: new Date()
    }

    // Save to database
    await sql`
      INSERT INTO bot_competitor_metrics (
        id, competitor_id, user_id, metric_date, website_traffic, organic_traffic,
        paid_traffic, bounce_rate, domain_authority, backlink_count,
        facebook_followers, instagram_followers, twitter_followers, linkedin_followers,
        blog_posts_count, estimated_ad_spend
      ) VALUES (
        ${metrics.id}, ${metrics.competitorId}, ${metrics.userId}, ${metrics.metricDate},
        ${metrics.websiteTraffic}, ${metrics.organicTraffic}, ${metrics.paidTraffic},
        ${metrics.bounceRate}, ${metrics.domainAuthority}, ${metrics.backlinkCount},
        ${metrics.facebookFollowers}, ${metrics.instagramFollowers}, ${metrics.twitterFollowers},
        ${metrics.linkedinFollowers}, ${metrics.blogPostsCount}, ${metrics.estimatedAdSpend}
      )
    `

    // Update competitor's last monitored time
    await sql`
      UPDATE bot_competitors
      SET last_monitored_at = ${new Date()},
          next_monitoring_at = ${this.calculateNextMonitoring(new Date(), competitor.monitoringFrequency)},
          updated_at = ${new Date()}
      WHERE id = ${competitorId}
    `

    return metrics
  }

  /**
   * Get competitor metrics history
   */
  async getCompetitorMetrics(
    competitorId: string,
    limit: number = 30
  ): Promise<CompetitorMetrics[]> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const result = await sql`
      SELECT * FROM bot_competitor_metrics
      WHERE competitor_id = ${competitorId}
      ORDER BY metric_date DESC
      LIMIT ${limit}
    `

    return result.map(this.mapDbToMetrics)
  }

  /**
   * Generate competitor report
   */
  async generateCompetitorReport(
    userId: string,
    competitorIds: string[],
    reportType: 'weekly' | 'monthly' | 'custom',
    startDate: Date,
    endDate: Date
  ): Promise<CompetitorReport> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    // Try external AI first (if user has API keys configured)
    const aiPrompt = this.buildAIReportPrompt(userId, competitorIds, reportType, startDate, endDate)
    const aiContent = await tryExternalAIGeneration(userId, aiPrompt, 'professional', 'linkedin')

    // Generate report
    const report: CompetitorReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      reportType,
      title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Competitor Report - ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
      periodStartDate: startDate,
      periodEndDate: endDate,
      competitors: competitorIds,
      executiveSummary: aiContent || this.generateTemplateSummary(competitorIds, reportType),
      keyFindings: this.generateKeyFindings(competitorIds),
      opportunities: this.generateOpportunities(),
      threats: this.generateThreats(),
      recommendations: this.generateRecommendations(),
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
      generatedAt: new Date()
    }

    // Save to database
    await sql`
      INSERT INTO bot_competitor_reports (
        id, user_id, report_type, title, period_start_date, period_end_date,
        competitors, executive_summary, key_findings, opportunities, threats,
        recommendations, status, generated_at
      ) VALUES (
        ${report.id}, ${report.userId}, ${report.reportType}, ${report.title},
        ${report.periodStartDate}, ${report.periodEndDate}, ${sql.array(report.competitors)},
        ${report.executiveSummary}, ${JSON.stringify(report.keyFindings)},
        ${JSON.stringify(report.opportunities)}, ${JSON.stringify(report.threats)},
        ${JSON.stringify(report.recommendations)}, ${report.status}, ${report.generatedAt}
      )
    `

    return report
  }

  /**
   * Get user's reports
   */
  async getUserReports(userId: string, limit: number = 10): Promise<CompetitorReport[]> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const result = await sql`
      SELECT * FROM bot_competitor_reports
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    return result.map(this.mapDbToReport)
  }

  /**
   * Create alert for competitor changes
   */
  async createAlert(
    userId: string,
    competitorId: string | undefined,
    alertType: string,
    title: string,
    description: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<CompetitorAlert> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const alert: CompetitorAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      competitorId,
      userId,
      alertType,
      title,
      description,
      severity,
      isRead: false,
      createdAt: new Date()
    }

    await sql`
      INSERT INTO bot_competitor_alerts (
        id, competitor_id, user_id, alert_type, title, description, severity, is_read
      ) VALUES (
        ${alert.id}, ${alert.competitorId || null}, ${alert.userId}, ${alert.alertType},
        ${alert.title}, ${alert.description}, ${alert.severity}, ${alert.isRead}
      )
    `

    return alert
  }

  /**
   * Get user's alerts
   */
  async getUserAlerts(userId: string, unreadOnly: boolean = false): Promise<CompetitorAlert[]> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    let query = sql`
      SELECT * FROM bot_competitor_alerts
      WHERE user_id = ${userId}
    `

    if (unreadOnly) {
      query = sql`
        SELECT * FROM bot_competitor_alerts
        WHERE user_id = ${userId} AND is_read = false
      `
    }

    const result = await query
    return result.map(this.mapDbToAlert)
  }

  /**
   * Mark alert as read
   */
  async markAlertAsRead(alertId: string): Promise<void> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    await sql`
      UPDATE bot_competitor_alerts
      SET is_read = true
      WHERE id = ${alertId}
    `
  }

  /**
   * Monitor all active competitors (called by cron)
   */
  async monitorActiveCompetitors(): Promise<number> {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const result = await sql`
      SELECT * FROM bot_competitors
      WHERE status = 'active'
        AND (next_monitoring_at IS NULL OR next_monitoring_at <= NOW())
    `

    let monitored = 0
    for (const competitor of result) {
      try {
        await this.generateCompetitorMetrics(competitor.user_id, competitor.id)
        
        // Check for significant changes and create alerts
        await this.checkForAlerts(competitor.user_id, competitor.id)
        
        monitored++
      } catch (error) {
        console.error(`Error monitoring competitor ${competitor.id}:`, error)
      }
    }

    return monitored
  }

  /**
   * Check for significant changes and create alerts
   */
  private async checkForAlerts(userId: string, competitorId: string): Promise<void> {
    const metrics = await this.getCompetitorMetrics(competitorId, 2)
    if (metrics.length < 2) return

    const current = metrics[0]
    const previous = metrics[1]

    // Check for traffic spikes
    if (current.websiteTraffic && previous.websiteTraffic) {
      const change = ((current.websiteTraffic - previous.websiteTraffic) / previous.websiteTraffic) * 100
      if (Math.abs(change) > 20) {
        await this.createAlert(
          userId,
          competitorId,
          'traffic_change',
          `Significant Traffic Change Detected`,
          `Traffic changed by ${change.toFixed(1)}% (${previous.websiteTraffic.toLocaleString()} → ${current.websiteTraffic.toLocaleString()})`,
          change > 30 ? 'high' : 'medium'
        )
      }
    }

    // Check for follower growth
    if (current.instagramFollowers && previous.instagramFollowers) {
      const change = ((current.instagramFollowers - previous.instagramFollowers) / previous.instagramFollowers) * 100
      if (change > 15) {
        await this.createAlert(
          userId,
          competitorId,
          'social_growth',
          `Rapid Social Media Growth`,
          `Instagram followers increased by ${change.toFixed(1)}%`,
          'medium'
        )
      }
    }
  }

  // Template generation methods
  private generateTemplateSummary(competitorIds: string[], reportType: string): string {
    return `This ${reportType} competitor analysis report provides insights into ${competitorIds.length} competitor${competitorIds.length > 1 ? 's' : ''}. Key findings include traffic trends, social media growth, SEO performance, and content strategy analysis. Use these insights to identify opportunities and stay competitive in your market.`
  }

  private generateKeyFindings(competitorIds: string[]): any {
    return {
      trafficTrends: 'Most competitors show steady traffic growth',
      socialGrowth: 'Instagram and LinkedIn show strongest growth',
      contentStrategy: 'Blog posting frequency varies significantly',
      seoPerformance: 'Domain authority ranges from 20-80',
      adSpend: 'Estimated ad spend shows seasonal patterns'
    }
  }

  private generateOpportunities(): any[] {
    return [
      {
        id: 'opp_1',
        title: 'Content Gap Opportunity',
        description: 'Competitors are not covering certain topics that your audience searches for',
        impact: 'high',
        effort: 'medium'
      },
      {
        id: 'opp_2',
        title: 'Social Media Engagement',
        description: 'Competitors have lower engagement rates - opportunity to stand out',
        impact: 'medium',
        effort: 'low'
      }
    ]
  }

  private generateThreats(): any[] {
    return [
      {
        id: 'threat_1',
        title: 'Rapid Competitor Growth',
        description: 'One competitor is growing traffic faster than industry average',
        severity: 'medium',
        action: 'Monitor closely and analyze their strategy'
      }
    ]
  }

  private generateRecommendations(): any[] {
    return [
      {
        id: 'rec_1',
        title: 'Increase Content Publishing Frequency',
        description: 'Match or exceed competitor blog posting rates',
        priority: 'high'
      },
      {
        id: 'rec_2',
        title: 'Improve Domain Authority',
        description: 'Focus on building quality backlinks to compete',
        priority: 'medium'
      }
    ]
  }

  private buildAIReportPrompt(
    userId: string,
    competitorIds: string[],
    reportType: string,
    startDate: Date,
    endDate: Date
  ): string {
    return `Generate a comprehensive ${reportType} competitor analysis report for ${competitorIds.length} competitors covering the period ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}.

Include:
- Executive summary
- Key findings (traffic trends, social growth, SEO performance)
- Opportunities to capitalize on
- Threats to watch
- Actionable recommendations

Format as a structured report with clear sections and insights.`
  }

  // Helper methods
  private randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  private calculateNextMonitoring(currentDate: Date, frequency: 'daily' | 'weekly' | 'monthly'): Date {
    const next = new Date(currentDate)
    switch (frequency) {
      case 'daily':
        next.setDate(next.getDate() + 1)
        break
      case 'weekly':
        next.setDate(next.getDate() + 7)
        break
      case 'monthly':
        next.setMonth(next.getMonth() + 1)
        break
    }
    return next
  }

  private mapDbToCompetitor(row: any): Competitor {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      websiteUrl: row.website_url,
      industry: row.industry,
      companySize: row.company_size,
      foundedYear: row.founded_year,
      headquartersLocation: row.headquarters_location,
      description: row.description,
      status: row.status,
      monitoringFrequency: row.monitoring_frequency,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      nextMonitoringAt: row.next_monitoring_at ? new Date(row.next_monitoring_at) : undefined,
      lastMonitoredAt: row.last_monitored_at ? new Date(row.last_monitored_at) : undefined
    }
  }

  private mapDbToMetrics(row: any): CompetitorMetrics {
    return {
      id: row.id,
      competitorId: row.competitor_id,
      userId: row.user_id,
      metricDate: new Date(row.metric_date),
      websiteTraffic: row.website_traffic,
      organicTraffic: row.organic_traffic,
      paidTraffic: row.paid_traffic,
      bounceRate: row.bounce_rate,
      domainAuthority: row.domain_authority,
      backlinkCount: row.backlink_count,
      facebookFollowers: row.facebook_followers,
      instagramFollowers: row.instagram_followers,
      twitterFollowers: row.twitter_followers,
      linkedinFollowers: row.linkedin_followers,
      blogPostsCount: row.blog_posts_count,
      estimatedAdSpend: row.estimated_ad_spend,
      createdAt: new Date(row.created_at)
    }
  }

  private mapDbToAlert(row: any): CompetitorAlert {
    return {
      id: row.id,
      competitorId: row.competitor_id,
      userId: row.user_id,
      alertType: row.alert_type,
      title: row.title,
      description: row.description,
      severity: row.severity,
      isRead: row.is_read,
      createdAt: new Date(row.created_at)
    }
  }

  private mapDbToReport(row: any): CompetitorReport {
    return {
      id: row.id,
      userId: row.user_id,
      reportType: row.report_type,
      title: row.title,
      periodStartDate: new Date(row.period_start_date),
      periodEndDate: new Date(row.period_end_date),
      competitors: row.competitors || [],
      executiveSummary: row.executive_summary,
      keyFindings: row.key_findings || {},
      opportunities: row.opportunities || [],
      threats: row.threats || [],
      recommendations: row.recommendations || [],
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      generatedAt: row.generated_at ? new Date(row.generated_at) : undefined
    }
  }
}
