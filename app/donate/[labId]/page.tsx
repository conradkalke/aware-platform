import { DonatePageClient } from "./donate-client"
import { getLabById, labs as allLabs } from "@/lib/labs"
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ labId: string }> }): Promise<Metadata> {
  const { labId } = await params
  const lab = getLabById(labId) || allLabs[0]
  const title = `Donate to ${lab.name} — AWARE`
  const description = `Support ${lab.name} at ${lab.institution}. Transparent, milestone-based donations.`
  return {
    title,
    description
  }
}

export default async function DonatePage({ params }: { params: Promise<{ labId: string }> }) {
  const { labId } = await params
  return <DonatePageClient labId={labId} />
}
