import { NextResponse } from 'next/server'
import { clearAllDonations } from '@/lib/donations'

export async function POST() {
  try {
    clearAllDonations()
    return NextResponse.json({ message: 'All donations cleared successfully' }, { status: 200 })
  } catch (error: any) {
    console.error('Error clearing donations:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
