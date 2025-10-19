// Simple donations tracking - CAN BE DELETED TOMORROW
// In a real app, this would be stored in a database

export interface Donation {
  id: string
  labId: string
  amount: number
  donorName?: string
  donorEmail?: string
  milestone?: string
  note?: string
  timestamp: Date
}

// In-memory storage for demo purposes
let donations: Donation[] = []

// Function to clear all donations (for testing/reset purposes)
export function clearAllDonations(): void {
  donations = []
}

export function addDonation(donation: Omit<Donation, 'id' | 'timestamp'>): Donation {
  const newDonation: Donation = {
    ...donation,
    id: `donation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date()
  }
  
  donations.push(newDonation)
  return newDonation
}

export function getDonationsForLab(labId: string): Donation[] {
  return donations.filter(d => d.labId === labId)
}

export function getTotalRaisedForLab(labId: string): number {
  return donations
    .filter(d => d.labId === labId)
    .reduce((total, donation) => total + donation.amount, 0)
}

export function getAllDonations(): Donation[] {
  return donations
}

export function getTotalRaised(): number {
  return donations.reduce((total, donation) => total + donation.amount, 0)
}
