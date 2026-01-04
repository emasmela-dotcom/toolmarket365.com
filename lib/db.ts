import { neon } from '@neondatabase/serverless'

const connectionString = process.env.DATABASE_URL || ''

if (!connectionString) {
  console.warn('DATABASE_URL environment variable is not set. Database operations will fail.')
}

export const sql = connectionString ? neon(connectionString) : null

// Database types
export interface Comment {
  id: string
  name: string
  message: string
  created_at: string
  updated_at?: string
}

export interface AnalyticsEntry {
  id: string
  timestamp: string
  page: string
  referrer?: string
  device: string
  site?: string
  user_agent?: string
}

export interface ToolUsage {
  id: string
  tool_slug: string
  usage_count: number
  last_used: string
}

