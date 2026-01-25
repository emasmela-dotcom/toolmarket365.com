import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/subscription'

export const runtime = 'nodejs'

// GET /api/growth-suite/brands - Get user's brand profile or list all brands
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({ brand: null, brands: [] })
    }

    const { searchParams } = new URL(request.url)
    const listAll = searchParams.get('list') === 'true'

    if (listAll) {
      // List all brands for marketplace
      const brands = await sql`
        SELECT 
          id,
          name,
          email,
          company_name,
          website,
          industry,
          description,
          budget_range,
          preferred_creator_types,
          campaign_types,
          status,
          logo_url,
          is_verified,
          created_at,
          updated_at
        FROM brands 
        WHERE status = 'active'
        ORDER BY created_at DESC
      `
      
      // Parse JSONB arrays
      const formattedBrands = (brands || []).map((brand: any) => {
        let preferred_creator_types = []
        let campaign_types = []
        
        try {
          if (brand.preferred_creator_types) {
            preferred_creator_types = typeof brand.preferred_creator_types === 'string' 
              ? JSON.parse(brand.preferred_creator_types) 
              : brand.preferred_creator_types
          }
        } catch {}
        
        try {
          if (brand.campaign_types) {
            campaign_types = typeof brand.campaign_types === 'string' 
              ? JSON.parse(brand.campaign_types) 
              : brand.campaign_types
          }
        } catch {}
        
        return {
          ...brand,
          preferred_creator_types,
          campaign_types
        }
      })
      
      return NextResponse.json({ brands: formattedBrands })
    } else {
      // Get user's own brand
      const result = await sql`
        SELECT 
          id,
          name,
          email,
          company_name,
          website,
          industry,
          description,
          budget_range,
          preferred_creator_types,
          campaign_types,
          status,
          logo_url,
          is_verified,
          created_at,
          updated_at
        FROM brands 
        WHERE user_id = ${userId}
        LIMIT 1
      `

      if (result.length === 0) {
        return NextResponse.json({ brand: null })
      }

      const brand = result[0]
      
      // Parse JSONB arrays
      let preferred_creator_types = []
      let campaign_types = []
      
      try {
        if (brand.preferred_creator_types) {
          preferred_creator_types = typeof brand.preferred_creator_types === 'string' 
            ? JSON.parse(brand.preferred_creator_types) 
            : brand.preferred_creator_types
        }
      } catch {}
      
      try {
        if (brand.campaign_types) {
          campaign_types = typeof brand.campaign_types === 'string' 
            ? JSON.parse(brand.campaign_types) 
            : brand.campaign_types
        }
      } catch {}
      
      const formattedBrand = {
        ...brand,
        preferred_creator_types,
        campaign_types
      }

      return NextResponse.json({ brand: formattedBrand })
    }

  } catch (error) {
    console.error('Error fetching brand:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brand profile', brand: null },
      { status: 500 }
    )
  }
}

// POST /api/growth-suite/brands - Create/update brand profile
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
      email,
      companyName,
      website,
      budgetRange,
      preferredCreatorTypes,
      campaignTypes,
      logoUrl
    } = body

    // Validate required fields
    if (!name || !email || !companyName) {
      return NextResponse.json(
        { error: 'Name, email, and company name are required' },
        { status: 400 }
      )
    }

    // Check if brand already exists
    const existingResult = await sql`
      SELECT id FROM brands WHERE user_id = ${userId}
    `

    let brand
    if (existingResult.length > 0) {
      // Update existing brand
      const updateResult = await sql`
        UPDATE brands 
        SET 
          name = ${name},
          email = ${email},
          company_name = ${companyName},
          website = ${website || null},
          budget_range = ${budgetRange || null},
          preferred_creator_types = ${preferredCreatorTypes ? JSON.stringify(preferredCreatorTypes) : null},
          campaign_types = ${campaignTypes ? JSON.stringify(campaignTypes) : null},
          logo_url = ${logoUrl || null},
          updated_at = NOW()
        WHERE user_id = ${userId}
        RETURNING *
      `
      brand = updateResult[0]
    } else {
      // Create new brand
      const insertResult = await sql`
        INSERT INTO brands (
          user_id,
          name,
          email,
          company_name,
          website,
          budget_range,
          preferred_creator_types,
          campaign_types,
          logo_url,
          status,
          created_at,
          updated_at
        ) VALUES (
          ${userId},
          ${name},
          ${email},
          ${companyName},
          ${website || null},
          ${budgetRange || null},
          ${preferredCreatorTypes ? JSON.stringify(preferredCreatorTypes) : null},
          ${campaignTypes ? JSON.stringify(campaignTypes) : null},
          ${logoUrl || null},
          'active',
          NOW(),
          NOW()
        )
        RETURNING *
      `
      brand = insertResult[0]
    }

    // Parse JSONB arrays for response
    let preferred_creator_types = []
    let campaign_types = []
    
    try {
      if (brand.preferred_creator_types) {
        preferred_creator_types = typeof brand.preferred_creator_types === 'string' 
          ? JSON.parse(brand.preferred_creator_types) 
          : brand.preferred_creator_types
      }
    } catch {}
    
    try {
      if (brand.campaign_types) {
        campaign_types = typeof brand.campaign_types === 'string' 
          ? JSON.parse(brand.campaign_types) 
          : brand.campaign_types
      }
    } catch {}
    
    const formattedBrand = {
      ...brand,
      preferred_creator_types,
      campaign_types
    }

    return NextResponse.json({ brand: formattedBrand })

  } catch (error) {
    console.error('Error creating/updating brand:', error)
    return NextResponse.json(
      { error: 'Failed to create/update brand profile' },
      { status: 500 }
    )
  }
}
