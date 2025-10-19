import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { addDonation } from '@/lib/donations'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    // Extract donation details from session metadata
    const labId = session.metadata?.labId
    const milestone = session.metadata?.milestone
    const note = session.metadata?.note
    
    if (labId && session.amount_total) {
      // Add the donation to our tracking system
      addDonation({
        labId,
        amount: session.amount_total / 100, // Convert from cents to dollars
        donorEmail: session.customer_email || undefined,
        milestone: milestone || undefined,
        note: note || undefined
      })
      
      console.log(`Donation recorded: $${session.amount_total / 100} to lab ${labId}`)
    }
  }

  return NextResponse.json({ received: true })
}
