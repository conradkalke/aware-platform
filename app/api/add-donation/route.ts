import { NextRequest, NextResponse } from 'next/server'
import { addDonation } from '@/lib/donations'

export async function POST(req: NextRequest) {
  try {
    const { labId, amount, donorName, donorEmail, milestone, note } = await req.json()

    if (!labId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const donation = addDonation({
      labId,
      amount: Number(amount),
      donorName,
      donorEmail,
      milestone,
      note
    })

    return NextResponse.json({ 
      success: true, 
      donation,
      message: `Donation of $${amount} added to lab ${labId}`
    })
  } catch (error) {
    console.error('Error adding donation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
