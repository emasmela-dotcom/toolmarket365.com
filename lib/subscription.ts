import { sql } from '@/lib/db'
import { SESSION_COOKIE_NAME, sha256Hex } from '@/lib/auth'
import { NextRequest } from 'next/server'

export interface SubscriptionStatus {
  hasAccess: boolean
  status: 'trial' | 'active' | 'expired' | 'canceled' | 'none'
  planName: string | null
  planDisplayName: string | null
  trialEndsAt: string | null
  subscriptionEndsAt: string | null
  canAccessTool: boolean
  reason?: string
}

/**
 * Get user ID from request (from session cookie)
 */
export async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  if (!sql) return null
  
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value || ''
  if (!token) return null

  try {
    const tokenHash = sha256Hex(token)
    const rows = await sql`
      SELECT u.id
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ${tokenHash}
        AND s.expires_at > NOW()
      LIMIT 1
    `
    return rows[0]?.id || null
  } catch {
    return null
  }
}

/**
 * Get user's subscription status
 */
export async function getUserSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
  if (!sql) {
    return {
      hasAccess: false,
      status: 'none',
      planName: null,
      planDisplayName: null,
      trialEndsAt: null,
      subscriptionEndsAt: null,
      canAccessTool: false,
      reason: 'Database not configured'
    }
  }

  try {
    const rows = await sql`
      SELECT 
        us.status,
        us.trial_ends_at,
        us.subscription_ends_at,
        p.name as plan_name,
        p.display_name as plan_display_name
      FROM user_subscriptions us
      JOIN plans p ON p.id = us.plan_id
      WHERE us.user_id = ${userId}
        AND us.status IN ('trial', 'active')
      LIMIT 1
    `

    if (rows.length === 0) {
      return {
        hasAccess: false,
        status: 'none',
        planName: null,
        planDisplayName: null,
        trialEndsAt: null,
        subscriptionEndsAt: null,
        canAccessTool: false,
        reason: 'No active subscription or trial'
      }
    }

    const sub = rows[0]
    const now = new Date()
    const trialEndsAt = sub.trial_ends_at ? new Date(sub.trial_ends_at) : null
    const subscriptionEndsAt = sub.subscription_ends_at ? new Date(sub.subscription_ends_at) : null

    // Check if trial/subscription is still valid
    if (sub.status === 'trial' && trialEndsAt && trialEndsAt < now) {
      return {
        hasAccess: false,
        status: 'expired',
        planName: sub.plan_name,
        planDisplayName: sub.plan_display_name,
        trialEndsAt: sub.trial_ends_at,
        subscriptionEndsAt: sub.subscription_ends_at,
        canAccessTool: false,
        reason: 'Trial has expired'
      }
    }

    if (sub.status === 'active' && subscriptionEndsAt && subscriptionEndsAt < now) {
      return {
        hasAccess: false,
        status: 'expired',
        planName: sub.plan_name,
        planDisplayName: sub.plan_display_name,
        trialEndsAt: sub.trial_ends_at,
        subscriptionEndsAt: sub.subscription_ends_at,
        canAccessTool: false,
        reason: 'Subscription has expired'
      }
    }

    return {
      hasAccess: true,
      status: sub.status,
      planName: sub.plan_name,
      planDisplayName: sub.plan_display_name,
      trialEndsAt: sub.trial_ends_at,
      subscriptionEndsAt: sub.subscription_ends_at,
      canAccessTool: true
    }
  } catch (error) {
    console.error('Error getting subscription status:', error)
    return {
      hasAccess: false,
      status: 'none',
      planName: null,
      planDisplayName: null,
      trialEndsAt: null,
      subscriptionEndsAt: null,
      canAccessTool: false,
      reason: 'Error checking subscription'
    }
  }
}

/**
 * Check if user can access a specific tool
 */
export async function canUserAccessTool(userId: string, toolSlug: string): Promise<{
  canAccess: boolean
  reason: string
  planName: string | null
}> {
  if (!sql) {
    return {
      canAccess: false,
      reason: 'Database not configured',
      planName: null
    }
  }

  try {
    // Get user's plan
    const subRows = await sql`
      SELECT p.name, p.display_name, p.tool_slugs, us.status
      FROM user_subscriptions us
      JOIN plans p ON p.id = us.plan_id
      WHERE us.user_id = ${userId}
        AND us.status IN ('trial', 'active')
      LIMIT 1
    `

    if (subRows.length === 0) {
      return {
        canAccess: false,
        reason: 'No active subscription or trial',
        planName: null
      }
    }

    const plan = subRows[0]
    
    // Check if tool is in plan's tool_slugs array
    const toolSlugs = plan.tool_slugs || []
    const hasTool = toolSlugs.includes(toolSlug)

    if (!hasTool) {
      return {
        canAccess: false,
        reason: `Tool "${toolSlug}" is not included in your ${plan.display_name} plan`,
        planName: plan.name
      }
    }

    // Check if trial/subscription is still valid
    const statusRows = await sql`
      SELECT trial_ends_at, subscription_ends_at, status
      FROM user_subscriptions
      WHERE user_id = ${userId}
        AND status IN ('trial', 'active')
      LIMIT 1
    `

    if (statusRows.length === 0) {
      return {
        canAccess: false,
        reason: 'No active subscription or trial',
        planName: plan.name
      }
    }

    const status = statusRows[0]
    const now = new Date()

    if (status.status === 'trial' && status.trial_ends_at) {
      const trialEndsAt = new Date(status.trial_ends_at)
      if (trialEndsAt < now) {
        return {
          canAccess: false,
          reason: 'Trial has expired',
          planName: plan.name
        }
      }
    }

    if (status.status === 'active' && status.subscription_ends_at) {
      const subscriptionEndsAt = new Date(status.subscription_ends_at)
      if (subscriptionEndsAt < now) {
        return {
          canAccess: false,
          reason: 'Subscription has expired',
          planName: plan.name
        }
      }
    }

    return {
      canAccess: true,
      reason: 'Access granted',
      planName: plan.name
    }
  } catch (error) {
    console.error('Error checking tool access:', error)
    return {
      canAccess: false,
      reason: 'Error checking access',
      planName: null
    }
  }
}
