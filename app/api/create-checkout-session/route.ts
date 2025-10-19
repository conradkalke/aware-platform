import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

// Initialize Stripe lazily to avoid issues if key is missing in build preview
const getStripe = () => {
  if (!stripeSecretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable')
  }
  return new Stripe(stripeSecretKey, { apiVersion: '2025-07-30.basil' })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      amount, // number in USD dollars
      labId,
      labName,
      milestone,
      note,
    }: {
      amount: number
      labId: string
      labName?: string
      milestone?: string | null
      note?: string | null
    } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }
    if (!labId) {
      return NextResponse.json({ error: 'Missing labId' }, { status: 400 })
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const stripe = getStripe()

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: labName ? `Donation to ${labName}` : 'Donation',
              metadata: {
                labId,
              },
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/donate/${encodeURIComponent(labId)}?success=1`,
      cancel_url: `${origin}/donate/${encodeURIComponent(labId)}?canceled=1`,
      metadata: {
        labId,
        milestone: milestone || '',
        note: note || '',
      },
    })

    return NextResponse.json({ id: session.id })
  } catch (error: any) {
    console.error('Stripe session error', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}





