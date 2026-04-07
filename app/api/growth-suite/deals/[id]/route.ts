import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/subscription'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/growth-suite/deals/[id] - Get single deal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const dealId = params.id

    const dealResult = await sql`
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
        b.logo_url as brand_logo_url,
        b.is_verified as brand_is_verified,
        cp.display_name as creator_name,
        cp.niche as creator_niche,
        cp.profile_image_url as creator_avatar_url
      FROM deals d
      LEFT JOIN brands b ON d.brand_id = b.id
      LEFT JOIN creator_profiles cp ON d.creator_id = cp.user_id
      WHERE d.id = ${dealId}
      LIMIT 1
    `

    if (dealResult.length === 0) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    const deal = dealResult[0]

    // Parse deliverables if needed
    let deliverables: string[] = []
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

    // Return deal with flat brand_name and creator_name fields
    const dealWithNames = {
      id: deal.id,
      brand_id: deal.brand_id,
      creator_id: deal.creator_id,
      deal_type: deal.deal_type,
      platform: deal.platform,
      budget: parseFloat(deal.budget) || 0,
      currency: 'USD',
      deadline: deal.deadline,
      requirements: deal.requirements || '', // String, not array
      deliverables: deliverables, // Array
      status: deal.status,
      brand_name: deal.brand_name || deal.company_name || 'Unknown Brand',
      creator_name: deal.creator_name || 'Unknown Creator',
      created_at: deal.created_at,
      updated_at: deal.updated_at,
      // Also include nested objects for detail page
      brand: deal.brand_id ? {
        id: deal.brand_id,
        name: deal.brand_name,
        company_name: deal.company_name,
        logo_url: deal.brand_logo_url,
        is_verified: deal.brand_is_verified || false
      } : null,
      creator: deal.creator_id ? {
        id: deal.creator_id,
        display_name: deal.creator_name,
        niche: deal.creator_niche,
        avatar_url: deal.creator_avatar_url
      } : null
    }

    return NextResponse.json({ deal: dealWithNames })

  } catch (error) {
    console.error('Error fetching deal:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deal' },
      { status: 500 }
    )
  }
}

// PUT /api/growth-suite/deals/[id] - Update deal
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const dealId = params.id
    const body = await request.json()

    const {
      deal_type,
      platform,
      budget,
      deadline,
      requirements,
      deliverables,
      status
    } = body

    // Update deal using Neon serverless sql template literals
    // Use COALESCE to only update provided fields
    const updated = await sql`
      UPDATE deals SET
        deal_type = COALESCE(${deal_type || null}, deal_type),
        platform = COALESCE(${platform || null}, platform),
        budget = COALESCE(${budget !== undefined ? parseFloat(budget) : null}, budget),
        deadline = COALESCE(${deadline ? new Date(deadline) : null}, deadline),
        requirements = COALESCE(${requirements || null}, requirements),
        deliverables = COALESCE(${deliverables ? JSON.stringify(deliverables) : null}, deliverables),
        status = COALESCE(${status || null}, status),
        updated_at = NOW()
      WHERE id = ${dealId}
      AND EXISTS (
        SELECT 1 FROM brands 
        WHERE brands.id = deals.brand_id 
        AND brands.user_id = ${userId}
      )
      RETURNING *
    `

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Deal not found or unauthorized' }, { status: 404 })
    }

    const updatedDeal = updated[0]

    // Get brand and creator names
    const brandResult = await sql`
      SELECT name, company_name FROM brands WHERE id = ${updatedDeal.brand_id}
    `
    
    let creatorName = null
    if (updatedDeal.creator_id) {
      const creatorResult = await sql`
        SELECT display_name FROM creator_profiles WHERE user_id = ${updatedDeal.creator_id} LIMIT 1
      `
      creatorName = creatorResult[0]?.display_name || null
    }

    // Parse deliverables
    let deliverablesParsed: string[] = []
    if (updatedDeal.deliverables) {
      if (typeof updatedDeal.deliverables === 'string') {
        try {
          deliverablesParsed = JSON.parse(updatedDeal.deliverables)
        } catch {
          deliverablesParsed = []
        }
      } else if (Array.isArray(updatedDeal.deliverables)) {
        deliverablesParsed = updatedDeal.deliverables
      }
    }

    const dealWithNames = {
      id: updatedDeal.id,
      brand_id: updatedDeal.brand_id,
      creator_id: updatedDeal.creator_id,
      deal_type: updatedDeal.deal_type,
      platform: updatedDeal.platform,
      budget: parseFloat(updatedDeal.budget),
      deadline: updatedDeal.deadline,
      requirements: updatedDeal.requirements || '',
      deliverables: deliverablesParsed,
      status: updatedDeal.status,
      brand_name: brandResult[0]?.name || brandResult[0]?.company_name || 'Unknown Brand',
      creator_name: creatorName || 'Unknown Creator',
      created_at: updatedDeal.created_at,
      updated_at: updatedDeal.updated_at
    }

    return NextResponse.json({ deal: dealWithNames })

  } catch (error) {
    console.error('Error updating deal:', error)
    return NextResponse.json(
      { error: 'Failed to update deal' },
      { status: 500 }
    )
  }
}

// DELETE /api/growth-suite/deals/[id] - Delete deal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const dealId = params.id

    // Verify user has access to this deal
    const accessCheck = await sql`
      SELECT 1 FROM deals 
      WHERE id = ${dealId} 
      AND (brand_id IN (SELECT id FROM brands WHERE user_id = ${userId})
           OR creator_id IN (SELECT user_id FROM creator_profiles WHERE user_id = ${userId}))
      LIMIT 1
    `

    if (accessCheck.length === 0) {
      return NextResponse.json({ error: 'Deal not found or access denied' }, { status: 403 })
    }

    // Delete the deal
    const deleted = await sql`
      DELETE FROM deals WHERE id = ${dealId} RETURNING id
    `

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting deal:', error)
    return NextResponse.json(
      { error: 'Failed to delete deal' },
      { status: 500 }
    )
  }
}
