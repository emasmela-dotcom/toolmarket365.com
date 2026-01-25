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
      name,
      companyName,
      description,
      website,
      industry,
      companySize,
      location,
      targetAudience,
      brandValues,
      collaborationBudget,
      collaborationTypes,
      contactEmail,
      contactPhone,
      socialLinks
    } = body

    // Validate required fields
    if (!name || !description || !website || !industry) {
      return NextResponse.json(
        { error: 'Name, description, website, and industry are required' },
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
          name = ${name},
          company_name = ${companyName || null},
          description = ${description},
          website = ${website},
          industry = ${industry},
          location = ${location || null},
          target_demographics = ${targetAudience ? JSON.stringify(targetAudience) : null},
          brand_values = ${brandValues ? JSON.stringify(brandValues) : null},
          budget_range = ${collaborationBudget ? JSON.stringify(collaborationBudget) : null},
          campaign_types = ${collaborationTypes ? JSON.stringify(collaborationTypes) : null},
          contact_email = ${contactEmail || null},
          contact_phone = ${contactPhone || null},
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
        company_name,
        description,
        website,
        industry,
        company_size,
        location,
        target_demographics,
        brand_values,
        budget_range,
        campaign_types,
        contact_email,
        contact_phone,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${userId},
        ${name},
        ${companyName || null},
        ${description},
        ${website},
        ${industry},
        ${companySize || null},
        ${location || null},
        ${targetAudience ? JSON.stringify(targetAudience) : null},
        ${brandValues ? JSON.stringify(brandValues) : null},
        ${collaborationBudget ? JSON.stringify(collaborationBudget) : null},
        ${collaborationTypes ? JSON.stringify(collaborationTypes) : null},
        ${contactEmail || null},
        ${contactPhone || null},
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
