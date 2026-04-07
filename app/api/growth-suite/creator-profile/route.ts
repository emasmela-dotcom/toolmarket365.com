import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/subscription'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/growth-suite/creator-profile - Get creator profile
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({ profile: null })
    }

    const { searchParams } = new URL(request.url)
    const creatorId = searchParams.get('id')

    let profile
    if (creatorId) {
      profile = await sql`
        SELECT 
          cp.id,
          cp.user_id,
          cp.display_name,
          cp.profile_image_url,
          cp.bio,
          cp.location,
          cp.niche,
          cp.total_followers,
          cp.average_engagement_rate,
          cp.rates,
          cp.portfolio_urls,
          cp.platforms,
          cp.is_verified,
          cp.created_at,
          cp.updated_at,
          u.email as user_email
        FROM creator_profiles cp
        LEFT JOIN users u ON cp.user_id = u.id
        WHERE cp.id = ${creatorId}
        LIMIT 1
      `
    } else {
      profile = await sql`
        SELECT 
          cp.id,
          cp.user_id,
          cp.display_name,
          cp.profile_image_url,
          cp.bio,
          cp.location,
          cp.niche,
          cp.total_followers,
          cp.average_engagement_rate,
          cp.rates,
          cp.portfolio_urls,
          cp.platforms,
          cp.is_verified,
          cp.created_at,
          cp.updated_at,
          u.email as user_email
        FROM creator_profiles cp
        LEFT JOIN users u ON cp.user_id = u.id
        WHERE cp.user_id = ${userId}
        LIMIT 1
      `
    }

    if (profile.length === 0) {
      return NextResponse.json({ profile: null })
    }

    const row = profile[0]

    // Parse JSONB fields properly
    let rates = null
    let platforms = null
    let portfolio_urls: string[] = []

    try {
      if (row.rates) {
        rates = typeof row.rates === 'string' ? JSON.parse(row.rates) : row.rates
      }
    } catch (e) {
      console.error('Error parsing rates:', e)
    }

    try {
      if (row.platforms) {
        platforms = typeof row.platforms === 'string' ? JSON.parse(row.platforms) : row.platforms
      }
    } catch (e) {
      console.error('Error parsing platforms:', e)
    }

    try {
      if (row.portfolio_urls) {
        if (typeof row.portfolio_urls === 'string') {
          portfolio_urls = JSON.parse(row.portfolio_urls)
        } else if (Array.isArray(row.portfolio_urls)) {
          portfolio_urls = row.portfolio_urls
        }
      }
    } catch (e) {
      console.error('Error parsing portfolio_urls:', e)
    }

    // Return profile with correct field names matching CreatorProfile component
    const profileData = {
      id: row.id,
      user_id: row.user_id,
      display_name: row.display_name,
      profile_image_url: row.profile_image_url,
      bio: row.bio,
      location: row.location,
      niche: row.niche, // Single string, not array
      total_followers: row.total_followers || 0,
      average_engagement_rate: parseFloat(row.average_engagement_rate) || 0,
      rates: rates || {}, // JSONB object
      portfolio_urls: portfolio_urls, // Array of strings
      platforms: platforms || {}, // JSONB object
      is_verified: row.is_verified || false,
      created_at: row.created_at,
      updated_at: row.updated_at,
      email: row.user_email
    }

    return NextResponse.json({ profile: profileData })

  } catch (error) {
    console.error('Error fetching creator profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch creator profile', profile: null },
      { status: 500 }
    )
  }
}

// POST /api/growth-suite/creator-profile - Create/update creator profile
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
      profile_image_url,
      bio,
      location,
      niche,
      total_followers,
      average_engagement_rate,
      rates,
      portfolio_urls,
      platforms,
      is_available = true
    } = body

    // Validate required fields
    if (!displayName || !niche) {
      return NextResponse.json(
        { error: 'Display name and niche are required' },
        { status: 400 }
      )
    }

    // Check if profile already exists
    const existing = await sql`
      SELECT id FROM creator_profiles WHERE user_id = ${userId} LIMIT 1
    `

    if (existing.length > 0) {
      // Update existing profile
      const updated = await sql`
        UPDATE creator_profiles SET
          display_name = ${displayName},
          profile_image_url = ${profile_image_url || null},
          bio = ${bio || null},
          location = ${location || null},
          niche = ${niche},
          total_followers = ${total_followers || 0},
          average_engagement_rate = ${average_engagement_rate || 0},
          rates = ${rates ? JSON.stringify(rates) : null},
          portfolio_urls = ${portfolio_urls ? JSON.stringify(portfolio_urls) : null},
          platforms = ${platforms ? JSON.stringify(platforms) : null},
          updated_at = NOW()
        WHERE user_id = ${userId}
        RETURNING *
      `

      const updatedProfile = updated[0]

      // Parse JSONB fields for response
      let ratesParsed = null
      let platformsParsed = null
      let portfolio_urlsParsed: string[] = []

      try {
        if (updatedProfile.rates) {
          ratesParsed = typeof updatedProfile.rates === 'string' ? JSON.parse(updatedProfile.rates) : updatedProfile.rates
        }
      } catch (e) {}
      
      try {
        if (updatedProfile.platforms) {
          platformsParsed = typeof updatedProfile.platforms === 'string' ? JSON.parse(updatedProfile.platforms) : updatedProfile.platforms
        }
      } catch (e) {}
      
      try {
        if (updatedProfile.portfolio_urls) {
          if (typeof updatedProfile.portfolio_urls === 'string') {
            portfolio_urlsParsed = JSON.parse(updatedProfile.portfolio_urls)
          } else if (Array.isArray(updatedProfile.portfolio_urls)) {
            portfolio_urlsParsed = updatedProfile.portfolio_urls
          }
        }
      } catch (e) {}

      const profileWithParsedData = {
        id: updatedProfile.id,
        user_id: updatedProfile.user_id,
        display_name: updatedProfile.display_name,
        profile_image_url: updatedProfile.profile_image_url,
        bio: updatedProfile.bio,
        location: updatedProfile.location,
        niche: updatedProfile.niche,
        total_followers: updatedProfile.total_followers || 0,
        average_engagement_rate: parseFloat(updatedProfile.average_engagement_rate) || 0,
        rates: ratesParsed || {},
        platforms: platformsParsed || {},
        portfolio_urls: portfolio_urlsParsed,
        is_verified: updatedProfile.is_verified || false,
        created_at: updatedProfile.created_at,
        updated_at: updatedProfile.updated_at
      }

      return NextResponse.json({ profile: profileWithParsedData })

    } else {
      // Create new profile
      const newProfile = await sql`
        INSERT INTO creator_profiles (
          user_id,
          display_name,
          profile_image_url,
          bio,
          location,
          niche,
          total_followers,
          average_engagement_rate,
          rates,
          portfolio_urls,
          platforms,
          is_public,
          created_at,
          updated_at
        ) VALUES (
          ${userId},
          ${displayName},
          ${profile_image_url || null},
          ${bio || null},
          ${location || null},
          ${niche},
          ${total_followers || 0},
          ${average_engagement_rate || 0},
          ${rates ? JSON.stringify(rates) : null},
          ${portfolio_urls ? JSON.stringify(portfolio_urls) : null},
          ${platforms ? JSON.stringify(platforms) : null},
          true,
          NOW(),
          NOW()
        )
        RETURNING *
      `

      const profile = newProfile[0]

      // Parse JSONB fields for response
      let ratesParsed = null
      let platformsParsed = null
      let portfolio_urlsParsed: string[] = []

      try {
        if (profile.rates) {
          ratesParsed = typeof profile.rates === 'string' ? JSON.parse(profile.rates) : profile.rates
        }
      } catch (e) {}
      
      try {
        if (profile.platforms) {
          platformsParsed = typeof profile.platforms === 'string' ? JSON.parse(profile.platforms) : profile.platforms
        }
      } catch (e) {}
      
      try {
        if (profile.portfolio_urls) {
          if (typeof profile.portfolio_urls === 'string') {
            portfolio_urlsParsed = JSON.parse(profile.portfolio_urls)
          } else if (Array.isArray(profile.portfolio_urls)) {
            portfolio_urlsParsed = profile.portfolio_urls
          }
        }
      } catch (e) {}

      const profileWithParsedData = {
        id: profile.id,
        user_id: profile.user_id,
        display_name: profile.display_name,
        profile_image_url: profile.profile_image_url,
        bio: profile.bio,
        location: profile.location,
        niche: profile.niche,
        total_followers: profile.total_followers || 0,
        average_engagement_rate: parseFloat(profile.average_engagement_rate) || 0,
        rates: ratesParsed || {},
        platforms: platformsParsed || {},
        portfolio_urls: portfolio_urlsParsed,
        is_verified: profile.is_verified || false,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }

      return NextResponse.json({ profile: profileWithParsedData })
    }

  } catch (error) {
    console.error('Error saving creator profile:', error)
    return NextResponse.json(
      { error: 'Failed to save creator profile' },
      { status: 500 }
    )
  }
}
