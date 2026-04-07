import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/subscription'
import { saveUserAPIKey, deleteUserAPIKey, getUserAPIKey } from '@/lib/services/external-ai-service'
import { sql } from '@/lib/db'

// Use Node.js runtime (required for crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Get user's API keys (masked for security)
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const result = await sql`
      SELECT 
        service_name,
        is_active,
        last_used_at,
        usage_count,
        created_at
      FROM user_api_keys
      WHERE user_id = ${userId}
        AND is_active = true
      ORDER BY service_name
    `

    // Create a map of service names to their status
    const keysMap: Record<string, boolean> = {}
    result.forEach(row => {
      keysMap[row.service_name] = row.is_active
    })

    return NextResponse.json({
      success: true,
      keys: result.map(row => ({
        service: row.service_name,
        isActive: row.is_active,
        lastUsedAt: row.last_used_at,
        usageCount: row.usage_count,
        createdAt: row.created_at
      })),
      // Also return as a simple map for easy checking
      keysMap
    })
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    )
  }
}

// Save/update API key
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { service, apiKey } = body

    if (!service || !apiKey) {
      return NextResponse.json(
        { error: 'Service and API key are required' },
        { status: 400 }
      )
    }

    if (!['openai', 'anthropic', 'google'].includes(service)) {
      return NextResponse.json(
        { error: 'Invalid service name' },
        { status: 400 }
      )
    }

    const success = await saveUserAPIKey(userId, service as 'openai' | 'anthropic' | 'google', apiKey)

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'API key saved successfully'
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to save API key' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error saving API key:', error)
    return NextResponse.json(
      { error: 'Failed to save API key' },
      { status: 500 }
    )
  }
}

// Delete API key
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const service = searchParams.get('service')

    if (!service || !['openai', 'anthropic', 'google'].includes(service)) {
      return NextResponse.json(
        { error: 'Valid service name is required' },
        { status: 400 }
      )
    }

    const success = await deleteUserAPIKey(userId, service as 'openai' | 'anthropic' | 'google')

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'API key deleted successfully'
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to delete API key' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error deleting API key:', error)
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    )
  }
}
