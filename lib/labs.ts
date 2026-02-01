// Lab data for AWARE platform - CAN BE DELETED TOMORROW
import { getTotalRaisedForLab } from './donations'

export interface Lab {
  id: string
  name: string
  description: string
  longDescription?: string
  updatesList?: Array<{
    date: string
    title: string
    summary: string
  }>
  institution: string
  image?: string
  progress: number
  raised: number
  goal: number
  updates: number
  impact?: string
  team?: Array<{
    name: string
    role: string
    bio: string
    image?: string
  }>
  budget?: Array<{
    category: string
    amount: number
    description: string
  }>
}

export const labs: Lab[] = [
  {
    id: "verhaak-brain-cancer",
    name: "Verhaak Brain Cancer Lab",
    description: "Studying brain tumors, therapy resistance, and extrachromosomal DNA amplifications",
    longDescription: "We are a cancer biology lab focused on brain tumors and extrachromosomal oncogene DNA amplification. We study tumor evolution and therapy resistance using high-throughput sequencing, computational analysis, and functional studies.",
    updatesList: [
      {
        date: "2025-05-14",
        title: "Refining glioblastoma cell states",
        summary: "A multi-lab consortium used single-cell sequencing across many patient tumors to map glioblastoma cell types and how they change under treatment."
      },
      {
        date: "2024-10-07",
        title: "ecDNA amplifications drive progression",
        summary: "A new Nature Genetics paper shows how extrachromosomal DNA amplifications can fuel metastasis and tumor growth."
      }
    ],
    institution: "Yale University, New Haven",
    image: "/yalefree.jpg",
    progress: 0,
    raised: 0,
    goal: 10000,
    updates: 2,
    impact: "Our research aims to explain how brain tumors evolve and resist therapy, enabling more durable, targeted treatments.",
    team: [
      {
        name: "Roel Verhaak",
        role: "Principal Investigator",
        bio: "Roel Verhaak leads the lab's research on brain tumors, tumor evolution, and therapy resistance.",
        image: "/placeholder-user.jpg"
      }
    ],
    budget: [
      {
        category: "Sequencing",
        amount: 4000,
        description: "Single-cell and bulk sequencing for tumor profiling"
      },
      {
        category: "Computational Analysis",
        amount: 2500,
        description: "Cloud compute, storage, and analysis tooling"
      },
      {
        category: "Personnel",
        amount: 2500,
        description: "Research support and technician time"
      },
      {
        category: "Supplies",
        amount: 1000,
        description: "Reagents, tissue processing, and lab consumables"
      }
    ]
  }
]

export function getLabById(id: string): Lab | undefined {
  const lab = labs.find(lab => lab.id === id)
  if (lab) {
    // Update the raised amount based on actual donations
    const raised = getTotalRaisedForLab(id)
    const progress = Math.min((raised / lab.goal) * 100, 100)
    return {
      ...lab,
      raised,
      progress
    }
  }
  return lab
}

export function listLabs(): Lab[] {
  return labs.map(lab => {
    const raised = getTotalRaisedForLab(lab.id)
    const progress = Math.min((raised / lab.goal) * 100, 100)
    return {
      ...lab,
      raised,
      progress
    }
  })
}