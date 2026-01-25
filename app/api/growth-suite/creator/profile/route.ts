import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/subscription'

export const runtime = 'nodejs'

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
      location,
      website,
      category,
      audienceSize,
      engagementRate,
      contentFocus,
      collaborationTypes,
      rateRange,
      availabilityStatus,
      socialLinks
    } = body

    // Validate required fields
    if (!displayName || !bio || !category) {
      return NextResponse.json(
        { error: 'Display name, bio, and category are required' },
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
          niche = ${category},
          total_followers = ${audienceSize || 0},
          average_engagement_rate = ${engagementRate || 0},
          content_types = ${contentFocus ? JSON.stringify(contentFocus) : null},
          platforms = ${socialLinks ? JSON.stringify(socialLinks) : null},
          rates = ${rateRange ? JSON.stringify(rateRange) : null},
          availability_status = ${availabilityStatus || 'available'},
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
        ${category},
        ${audienceSize || 0},
        ${engagementRate || 0},
        ${contentFocus ? JSON.stringify(contentFocus) : null},
        ${socialLinks ? JSON.stringify(socialLinks) : null},
        ${rateRange ? JSON.stringify(rateRange) : null},
        ${availabilityStatus || 'available'},
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
