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
      brandName,
      description,
      industry,
      website,
      location,
      companySize,
      annualRevenue,
      targetAudience,
      contentGoals,
      budgetRange,
      preferredPlatforms,
      campaignTypes
    } = body

    // Validate required fields
    if (!brandName || !description || !industry) {
      return NextResponse.json(
        { error: 'Brand name, description, and industry are required' },
        { status: 400 }
      )
    }

    // Check if brand profile already exists
    const existing = await sql`
      SELECT id FROM brands WHERE user_id = ${userId}
    `
    
    if (existing.length > 0) {
      // Update existing brand
      const updated = await sql`
        UPDATE brands SET
          name = ${brandName},
          description = ${description},
          industry = ${industry},
          website = ${website || null},
          location = ${location || null},
          company_size = ${companySize || null},
          target_demographics = ${targetAudience ? JSON.stringify({ targetAudience }) : null},
          brand_values = ${contentGoals ? JSON.stringify(contentGoals) : null},
          budget_range = ${budgetRange || null},
          preferred_platforms = ${preferredPlatforms ? JSON.stringify(preferredPlatforms) : null},
          campaign_types = ${campaignTypes ? JSON.stringify(campaignTypes) : null},
          updated_at = NOW()
        WHERE user_id = ${userId}
        RETURNING *
      `
      
      return NextResponse.json({ brand: updated[0] })
    }

    // Create brand profile
    const brand = await sql`
      INSERT INTO brands (
        user_id,
        name,
        description,
        industry,
        website,
        location,
        company_size,
        target_demographics,
        brand_values,
        budget_range,
        preferred_platforms,
        campaign_types,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${userId},
        ${brandName},
        ${description},
        ${industry},
        ${website || null},
        ${location || null},
        ${companySize || null},
        ${targetAudience ? JSON.stringify({ targetAudience }) : null},
        ${contentGoals ? JSON.stringify(contentGoals) : null},
        ${budgetRange || null},
        ${preferredPlatforms ? JSON.stringify(preferredPlatforms) : null},
        ${campaignTypes ? JSON.stringify(campaignTypes) : null},
        'active',
        NOW(),
        NOW()
      )
      RETURNING *
    `

    return NextResponse.json({ brand: brand[0] })

  } catch (error) {
    console.error('Error creating brand profile:', error)
    return NextResponse.json(
      { error: 'Failed to create brand profile' },
      { status: 500 }
    )
  }
}
