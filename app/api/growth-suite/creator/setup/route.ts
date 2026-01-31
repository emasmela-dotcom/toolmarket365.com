import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/subscription'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const {
      displayName,
      bio,
      niche,
      location,
      website,
      audienceSize,
      engagementRate,
      contentTypes,
      socialLinks,
      pricing,
      availability
    } = body

    // Validate required fields
    if (!displayName || !bio || !niche) {
      return NextResponse.json(
        { error: 'Display name, bio, and niche are required' },
        { status: 400 }
      )
    }

    // Check if creator profile already exists
    const existing = await sql`
      SELECT id FROM creator_profiles WHERE user_id = ${userId}
    `
    
    if (existing.length > 0) {
      // Update existing profile
      const updated = await sql`
        UPDATE creator_profiles SET
          display_name = ${displayName},
          bio = ${bio},
          location = ${location || null},
          website = ${website || null},
          niche = ${niche},
          total_followers = ${audienceSize ? parseInt(audienceSize) : 0},
          average_engagement_rate = ${engagementRate ? parseFloat(engagementRate) : 0},
          content_types = ${contentTypes ? JSON.stringify(contentTypes) : null},
          platforms = ${socialLinks ? JSON.stringify(socialLinks) : null},
          rates = ${pricing ? JSON.stringify(pricing) : null},
          availability_status = ${availability || 'available'},
          updated_at = NOW()
        WHERE user_id = ${userId}
        RETURNING *
      `
      
      return NextResponse.json({ profile: updated[0] })
    }

    // Create creator profile
    const profile = await sql`
      INSERT INTO creator_profiles (
        user_id,
        display_name,
        bio,
        location,
        website,
        niche,
        total_followers,
        average_engagement_rate,
        content_types,
        platforms,
        rates,
        availability_status,
        created_at,
        updated_at
      ) VALUES (
        ${userId},
        ${displayName},
        ${bio},
        ${location || null},
        ${website || null},
        ${niche},
        ${audienceSize ? parseInt(audienceSize) : 0},
        ${engagementRate ? parseFloat(engagementRate) : 0},
        ${contentTypes ? JSON.stringify(contentTypes) : null},
        ${socialLinks ? JSON.stringify(socialLinks) : null},
        ${pricing ? JSON.stringify(pricing) : null},
        ${availability || 'available'},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    return NextResponse.json({ profile: profile[0] })

  } catch (error) {
    console.error('Error creating creator profile:', error)
    return NextResponse.json(
      { error: 'Failed to create creator profile' },
      { status: 500 }
    )
  }
}
