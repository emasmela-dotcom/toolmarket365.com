import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/subscription'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/growth-suite/deals - List deals with filtering
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({ deals: [] })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const brandId = searchParams.get('brandId')
    const creatorId = searchParams.get('creatorId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query using conditional template literals (Neon doesn't support sql.unsafe)
    let deals
    if (status && brandId) {
      deals = await sql`
        SELECT 
          d.id,
          d.brand_id,
          d.creator_id,
          d.deal_type,
          d.platform,
          d.budget,
          d.deadline,
          d.requirements,
          d.deliverables,
          d.status,
          d.created_at,
          d.updated_at,
          b.name as brand_name,
          b.company_name,
          cp.display_name as creator_name
        FROM deals d
        LEFT JOIN brands b ON d.brand_id = b.id
        LEFT JOIN creator_profiles cp ON d.creator_id = cp.user_id
        WHERE d.status = ${status} AND d.brand_id = ${brandId}
        ORDER BY d.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (status && creatorId) {
      deals = await sql`
        SELECT 
          d.id,
          d.brand_id,
          d.creator_id,
          d.deal_type,
          d.platform,
          d.budget,
          d.deadline,
          d.requirements,
          d.deliverables,
          d.status,
          d.created_at,
          d.updated_at,
          b.name as brand_name,
          b.company_name,
          cp.display_name as creator_name
        FROM deals d
        LEFT JOIN brands b ON d.brand_id = b.id
        LEFT JOIN creator_profiles cp ON d.creator_id = cp.user_id
        WHERE d.status = ${status} AND d.creator_id = ${creatorId}
        ORDER BY d.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (status) {
      deals = await sql`
        SELECT 
          d.id,
          d.brand_id,
          d.creator_id,
          d.deal_type,
          d.platform,
          d.budget,
          d.deadline,
          d.requirements,
          d.deliverables,
          d.status,
          d.created_at,
          d.updated_at,
          b.name as brand_name,
          b.company_name,
          cp.display_name as creator_name
        FROM deals d
        LEFT JOIN brands b ON d.brand_id = b.id
        LEFT JOIN creator_profiles cp ON d.creator_id = cp.user_id
        WHERE d.status = ${status}
        ORDER BY d.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (brandId) {
      deals = await sql`
        SELECT 
          d.id,
          d.brand_id,
          d.creator_id,
          d.deal_type,
          d.platform,
          d.budget,
          d.deadline,
          d.requirements,
          d.deliverables,
          d.status,
          d.created_at,
          d.updated_at,
          b.name as brand_name,
          b.company_name,
          cp.display_name as creator_name
        FROM deals d
        LEFT JOIN brands b ON d.brand_id = b.id
        LEFT JOIN creator_profiles cp ON d.creator_id = cp.user_id
        WHERE d.brand_id = ${brandId}
        ORDER BY d.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (creatorId) {
      deals = await sql`
        SELECT 
          d.id,
          d.brand_id,
          d.creator_id,
          d.deal_type,
          d.platform,
          d.budget,
          d.deadline,
          d.requirements,
          d.deliverables,
          d.status,
          d.created_at,
          d.updated_at,
          b.name as brand_name,
          b.company_name,
          cp.display_name as creator_name
        FROM deals d
        LEFT JOIN brands b ON d.brand_id = b.id
        LEFT JOIN creator_profiles cp ON d.creator_id = cp.user_id
        WHERE d.creator_id = ${creatorId}
        ORDER BY d.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      // Get deals for current user (either as brand or creator)
      deals = await sql`
        SELECT 
          d.id,
          d.brand_id,
          d.creator_id,
          d.deal_type,
          d.platform,
          d.budget,
          d.deadline,
          d.requirements,
          d.deliverables,
          d.status,
          d.created_at,
          d.updated_at,
          b.name as brand_name,
          b.company_name,
          cp.display_name as creator_name
        FROM deals d
        LEFT JOIN brands b ON d.brand_id = b.id
        LEFT JOIN creator_profiles cp ON d.creator_id = cp.user_id
        WHERE d.brand_id IN (SELECT id FROM brands WHERE user_id = ${userId})
           OR d.creator_id IN (SELECT user_id FROM creator_profiles WHERE user_id = ${userId})
        ORDER BY d.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    // Transform results to match DealCard interface
    const formattedDeals = deals.map((deal: any) => {
      // Parse deliverables if it's a JSONB string
      let deliverables = []
      if (deal.deliverables) {
        if (typeof deal.deliverables === 'string') {
          try {
            deliverables = JSON.parse(deal.deliverables)
          } catch {
            deliverables = []
          }
        } else if (Array.isArray(deal.deliverables)) {
          deliverables = deal.deliverables
        }
      }

      return {
        id: deal.id,
        brand_id: deal.brand_id,
        creator_id: deal.creator_id,
        deal_type: deal.deal_type,
        platform: deal.platform,
        budget: parseFloat(deal.budget) || 0,
        deadline: deal.deadline,
        requirements: deal.requirements || '', // String, not array
        deliverables: deliverables, // Array
        status: deal.status,
        brand_name: deal.brand_name || deal.company_name || 'Unknown Brand',
        creator_name: deal.creator_name || 'Unknown Creator',
        created_at: deal.created_at,
        updated_at: deal.updated_at
      }
    })

    return NextResponse.json({ deals: formattedDeals })

  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deals', deals: [] },
      { status: 500 }
    )
  }
}

// POST /api/growth-suite/deals - Create new deal
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
      brand_id,
      creator_id,
      deal_type,
      platform,
      budget,
      deadline,
      requirements,
      deliverables,
      status = 'pending'
    } = body

    // Validate required fields
    if (!deal_type || !platform || !budget || !deadline || !requirements) {
      return NextResponse.json(
        { error: 'Deal type, platform, budget, deadline, and requirements are required' },
        { status: 400 }
      )
    }

    // If brand_id not provided, get user's brand
    let finalBrandId = brand_id
    if (!finalBrandId) {
      const brandResult = await sql`
        SELECT id FROM brands WHERE user_id = ${userId} LIMIT 1
      `
      if (brandResult.length === 0) {
        return NextResponse.json(
          { error: 'Brand profile required to create deals' },
          { status: 403 }
        )
      }
      finalBrandId = brandResult[0].id
    }

    // Insert new deal
    const newDeal = await sql`
      INSERT INTO deals (
        brand_id,
        creator_id,
        deal_type,
        platform,
        budget,
        deadline,
        requirements,
        deliverables,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${finalBrandId},
        ${creator_id || null},
        ${deal_type},
        ${platform},
        ${parseFloat(budget)},
        ${deadline ? new Date(deadline) : null},
        ${requirements},
        ${JSON.stringify(deliverables || [])},
        ${status},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    // Get brand and creator names
    const brandResult = await sql`
      SELECT name, company_name FROM brands WHERE id = ${finalBrandId}
    `
    
    let creatorName = null
    if (creator_id) {
      const creatorResult = await sql`
        SELECT display_name FROM creator_profiles WHERE user_id = ${creator_id} LIMIT 1
      `
      creatorName = creatorResult[0]?.display_name || null
    }

    // Parse deliverables
    let deliverablesParsed = []
    if (newDeal[0].deliverables) {
      if (typeof newDeal[0].deliverables === 'string') {
        try {
          deliverablesParsed = JSON.parse(newDeal[0].deliverables)
        } catch {
          deliverablesParsed = []
        }
      } else if (Array.isArray(newDeal[0].deliverables)) {
        deliverablesParsed = newDeal[0].deliverables
      }
    }

    const dealWithNames = {
      id: newDeal[0].id,
      brand_id: newDeal[0].brand_id,
      creator_id: newDeal[0].creator_id,
      deal_type: newDeal[0].deal_type,
      platform: newDeal[0].platform,
      budget: parseFloat(newDeal[0].budget),
      deadline: newDeal[0].deadline,
      requirements: newDeal[0].requirements,
      deliverables: deliverablesParsed,
      status: newDeal[0].status,
      brand_name: brandResult[0]?.name || brandResult[0]?.company_name || 'Unknown Brand',
      creator_name: creatorName || 'Unknown Creator',
      created_at: newDeal[0].created_at,
      updated_at: newDeal[0].updated_at
    }

    return NextResponse.json({ deal: dealWithNames })

  } catch (error) {
    console.error('Error creating deal:', error)
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    )
  }
}
