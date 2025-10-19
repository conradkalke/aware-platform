import { LabsPageClient } from "./labs-client"
import { listLabs } from "@/lib/labs"

export const metadata = {
  title: 'Explore Labs — AWARE',
  description: 'Browse and search medical research labs to support with transparent donations.'
}

export default function LabsPage() {
  return <LabsPageClient />
}
