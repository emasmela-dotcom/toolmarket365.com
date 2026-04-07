import { neon, neonConfig } from '@neondatabase/serverless'

// Configure connection pooling for better performance under load
// This enables connection caching and reuse
neonConfig.fetchConnectionCache = true
neonConfig.pipelineConnect = 'password'

const connectionString = process.env.DATABASE_URL || ''

if (!connectionString) {
  console.warn('DATABASE_URL environment variable is not set. Database operations will fail.')
}

// IMPORTANT: Ensure your DATABASE_URL uses the pooler endpoint
// Format: ...@host-pooler.region.aws.neon.tech/...
// NOT: ...@host.region.aws.neon.tech/...
// The pooler handles connection pooling automatically for high-traffic scenarios

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


