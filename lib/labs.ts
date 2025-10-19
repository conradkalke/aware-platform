// Lab data for AWARE platform - CAN BE DELETED TOMORROW
import { getTotalRaisedForLab } from './donations'

export interface Lab {
  id: string
  name: string
  description: string
  longDescription?: string
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
    id: "neuro-lab",
    name: "Neuroplasticity Research Lab",
    description: "Investigating brain adaptation mechanisms in neurological disorders",
    longDescription: "Our lab focuses on understanding how the brain adapts and reorganizes itself following injury or disease. We use cutting-edge imaging techniques and behavioral assessments to study neuroplasticity in patients with stroke, traumatic brain injury, and neurodegenerative diseases.",
    institution: "University of California, San Francisco",
    image: "/lab-scientist-1.jpg",
    progress: 0,
    raised: 0,
    goal: 500000,
    updates: 23,
    impact: "Our research could lead to new rehabilitation strategies that help patients recover lost brain function and improve quality of life for millions affected by neurological conditions.",
    team: [
      {
        name: "Dr. Sarah Chen",
        role: "Principal Investigator",
        bio: "Dr. Chen is a neurologist with over 15 years of experience in neuroplasticity research. She has published over 50 peer-reviewed articles and received multiple NIH grants.",
        image: "/placeholder-user.jpg"
      },
      {
        name: "Dr. Michael Rodriguez",
        role: "Postdoctoral Fellow",
        bio: "Dr. Rodriguez specializes in functional MRI analysis and has developed novel techniques for tracking brain reorganization patterns.",
        image: "/placeholder-user.jpg"
      }
    ],
    budget: [
      {
        category: "Equipment",
        amount: 150000,
        description: "High-field MRI scanner upgrades and specialized neuroimaging software"
      },
      {
        category: "Personnel",
        amount: 200000,
        description: "Graduate student stipends and research technician salaries"
      },
      {
        category: "Supplies",
        amount: 100000,
        description: "Research reagents, participant compensation, and data storage"
      },
      {
        category: "Travel",
        amount: 50000,
        description: "Conference presentations and collaboration meetings"
      }
        ]
  },
  {
    id: "cancer-research",
    name: "Cancer Immunotherapy Lab",
    description: "Developing personalized cancer treatments using immune system engineering",
    longDescription: "We're pioneering new approaches to cancer treatment by engineering the body's own immune system to recognize and destroy cancer cells. Our work focuses on CAR-T cell therapy and checkpoint inhibitors for various cancer types.",
    institution: "Memorial Sloan Kettering Cancer Center",
    image: "/lab-scientist-2.jpg",
    progress: 0,
    raised: 0,
    goal: 500000,
    updates: 18,
    impact: "Our immunotherapy research could revolutionize cancer treatment, offering hope for patients with previously untreatable cancers and reducing the side effects of traditional chemotherapy.",
    team: [
      {
        name: "Dr. Emily Watson",
        role: "Principal Investigator",
        bio: "Dr. Watson is a leading expert in cancer immunology with over 20 years of experience. She has led several clinical trials and holds multiple patents in immunotherapy.",
        image: "/placeholder-user.jpg"
      },
      {
        name: "Dr. James Park",
        role: "Research Scientist",
        bio: "Dr. Park specializes in T-cell engineering and has developed novel methods for enhancing CAR-T cell persistence and efficacy.",
        image: "/placeholder-user.jpg"
      }
    ],
    budget: [
      {
        category: "Laboratory Equipment",
        amount: 180000,
        description: "Flow cytometers, cell culture equipment, and specialized bioreactors"
      },
      {
        category: "Personnel",
        amount: 220000,
        description: "Research scientists, lab technicians, and clinical coordinators"
      },
      {
        category: "Supplies",
        amount: 80000,
        description: "Cell culture media, antibodies, and laboratory consumables"
      },
      {
        category: "Clinical Trials",
        amount: 20000,
        description: "Patient recruitment and trial management costs"
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