import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getStripePriceId } from '@/lib/stripe-config'

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 503 }
    )
  }

  let body: { type: 'subscription' | 'credits'; planId?: string; bundleId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const { type, planId, bundleId } = body
  if (!type || (type !== 'subscription' && type !== 'credits')) {
    return NextResponse.json(
      { error: 'Body must include type: "subscription" or "credits"' },
      { status: 400 }
    )
  }

  const isSubscription = type === 'subscription'
  const id = isSubscription ? planId : bundleId
  if (!id) {
    return NextResponse.json(
      { error: isSubscription ? 'planId required' : 'bundleId required' },
      { status: 400 }
    )
  }

  const priceId = getStripePriceId(type, id)
  if (!priceId) {
    return NextResponse.json(
      { error: `No Stripe price configured for ${type}: ${id}` },
      { status: 400 }
    )
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? 'subscription' : 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout session error:', err)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
