import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Share2, Heart, MessageSquare, Users, ChevronRight, Clock, CheckCircle2, CircleDollarSign, BookOpen, Video } from 'lucide-react'

export default function LabProfile({ params }: { params: { id: string } }) {
  // In a real app, we would fetch the lab data based on the ID
  const lab = labs.find(l => l.id === params.id) || labs[0]

  return (
    <div className="container py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/labs" className="hover:text-foreground">
          Labs
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">{lab.name}</span>
      </div>

      {/* Lab Header */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={lab.image || "/placeholder.svg"}
              alt={lab.name}
              fill
              className="object-cover"
              priority
            />
            {lab.institution && (
              <div className="absolute bottom-4 right-4 rounded-md bg-background/80 px-3 py-1.5 text-sm font-medium backdrop-blur">
                {lab.institution}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between space-y-6 rounded-lg border bg-card p-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">{lab.name}</h1>
            <p className="text-muted-foreground">{lab.description}</p>
            
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{lab.supporters} supporters</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{lab.updates} updates</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>${lab.raised.toLocaleString()} raised</span>
                <span className="font-medium">${lab.goal.toLocaleString()} goal</span>
              </div>
              <Progress value={lab.progress} className="h-2" />
            </div>

            <Button asChild className="w-full bg-rose-600 hover:bg-rose-700">
              <Link href={`/donate/${lab.id}`}>
                Donate Now
              </Link>
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Heart className="mr-2 h-4 w-4" />
                Follow
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lab Content */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="space-y-6 pt-6">
              <div>
                <h2 className="text-xl font-bold">Research Focus</h2>
                <p className="mt-2 text-muted-foreground">
                  {lab.longDescription}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold">Why This Matters</h2>
                <p className="mt-2 text-muted-foreground">
                  {lab.impact}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold">Current Funding Status</h2>
                <p className="mt-2 text-muted-foreground">
                  Our lab received initial funding through a university start-up package, which covered basic equipment and one year of supplies. However, to continue our promising research, we need additional support for:
                </p>
                <ul className="mt-2 list-disc pl-6 text-muted-foreground">
                  <li>Specialized reagents and antibodies</li>
                  <li>Graduate student stipends</li>
                  <li>Equipment maintenance and upgrades</li>
                  <li>Publication costs for open-access journals</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="updates" className="space-y-6 pt-6">
              {lab.updates > 0 && (
                <div className="space-y-6">
                  {[...Array(lab.updates)].map((_, i) => (
                    <div key={i} className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                          {i % 2 === 0 ? (
                            <Video className="h-5 w-5 text-rose-600" />
                          ) : (
                            <BookOpen className="h-5 w-5 text-rose-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {i % 2 === 0 ? "New video update" : "Research progress"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-muted-foreground">
                        {i % 2 === 0 
                          ? "We've just uploaded a new video showing our latest experimental results. Check it out to see how your support is making a difference!"
                          : "We're excited to share that we've made significant progress in our research. Our latest findings suggest a promising new direction for treatment."}
                      </p>
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          View Full Update
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="milestones" className="space-y-6 pt-6">
              <div className="space-y-4">
                {lab.milestones.map((milestone, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 h-6 w-6 rounded-full flex items-center justify-center ${milestone.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {milestone.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{milestone.title}</h3>
                          <span className={`text-sm font-medium ${milestone.completed ? 'text-green-600' : 'text-rose-600'}`}>
                            ${milestone.amount.toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {milestone.description}
                        </p>
                        {!milestone.completed && (
                          <div className="mt-3">
                            <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                              Fund This Milestone
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="team" className="space-y-6 pt-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {lab.team.map((member, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden">
                      <Image
                        src={`/placeholder.svg?height=100&width=100&query=portrait of ${member.role}`}
                        alt={member.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium">Transparent Budgeting</h3>
            <div className="mt-4 space-y-3">
              {lab.budget.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm">{item.category}</span>
                  <span className="text-sm font-medium">{item.percentage}%</span>
                </div>
              ))}
              <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100 mt-2">
                {lab.budget.map((item, i) => {
                  // Calculate the width and offset for this segment
                  const width = item.percentage
                  const offset = lab.budget.slice(0, i).reduce((sum, b) => sum + b.percentage, 0)
                  
                  return (
                    <div
                      key={i}
                      className="h-full float-left"
                      style={{ 
                        width: `${width}%`,
                        backgroundColor: budgetColors[i % budgetColors.length]
                      }}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium">Student Explorer</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Subscribe to this lab to receive weekly micro-lessons and Q&As with scientists.
            </p>
            <div className="mt-4">
              <Button className="w-full" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Subscribe as Student
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium">Community Challenge</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              If we reach 100 donors this month, our lab will host a virtual tour and Q&A session!
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{lab.supporters} supporters</span>
                <span className="font-medium">100 goal</span>
              </div>
              <Progress value={(lab.supporters / 100) * 100} className="h-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const budgetColors = [
  "#f43f5e", // rose-500
  "#ec4899", // pink-500
  "#d946ef", // fuchsia-500
  "#a855f7", // purple-500
  "#8b5cf6", // violet-500
]

const labs = [
  {
    id: "neuro-lab",
    name: "Neurodegeneration Research Lab",
    description: "Investigating novel treatments for Alzheimer's disease through targeted protein therapy.",
    longDescription: "Our lab focuses on understanding the molecular mechanisms behind neurodegenerative diseases, particularly Alzheimer's. We're investigating how misfolded proteins contribute to neuronal death and developing targeted therapies to prevent or reverse this process. Our innovative approach combines computational modeling with experimental validation to identify potential drug targets.",
    impact: "Alzheimer's disease affects over 6 million Americans and is projected to reach nearly 13 million by 2050. Current treatments only address symptoms without slowing disease progression. Our research aims to develop therapies that target the root causes of neurodegeneration, potentially stopping or reversing the disease process.",
    institution: "Yale University",
    image: "/placeholder.svg?height=400&width=600",
    progress: 65,
    raised: 32500,
    goal: 50000,
    supporters: 128,
    updates: 7,
    milestones: [
      {
        title: "Purchase specialized antibodies",
        description: "These antibodies are essential for detecting specific protein conformations in our experiments.",
        amount: 5000,
        completed: true
      },
      {
        title: "Fund graduate student research",
        description: "Support a graduate student researcher for one semester to advance our protein analysis work.",
        amount: 15000,
        completed: true
      },
      {
        title: "Upgrade imaging equipment",
        description: "Enhance our microscopy capabilities to better visualize protein aggregates in neural tissue.",
        amount: 12500,
        completed: true
      },
      {
        title: "Pilot study with novel compound",
        description: "Test our most promising compound in cellular models of neurodegeneration.",
        amount: 10000,
        completed: false
      },
      {
        title: "Conference presentation",
        description: "Present our findings at the International Neurodegeneration Conference.",
        amount: 7500,
        completed: false
      }
    ],
    team: [
      {
        name: "Dr. Sarah Chen",
        role: "Principal Investigator",
        bio: "Neuroscientist with 15 years of experience in protein misfolding disorders."
      },
      {
        name: "Dr. Michael Rodriguez",
        role: "Postdoctoral Fellow",
        bio: "Specializes in computational modeling of protein interactions."
      },
      {
        name: "Jennifer Kim",
        role: "Graduate Student",
        bio: "Researching novel biomarkers for early Alzheimer's detection."
      },
      {
        name: "David Patel",
        role: "Lab Technician",
        bio: "Expert in cellular imaging and tissue culture techniques."
      }
    ],
    budget: [
      { category: "Research Supplies", percentage: 45 },
      { category: "Student Support", percentage: 30 },
      { category: "Equipment", percentage: 15 },
      { category: "Publication Costs", percentage: 10 }
    ]
  },
  {
    id: "cancer-research",
    name: "Precision Oncology Lab",
    description: "Developing personalized cancer treatments based on genetic profiling and immunotherapy.",
    longDescription: "Our laboratory is at the forefront of precision oncology, developing targeted therapies based on individual genetic profiles. We use cutting-edge genomic sequencing and bioinformatics to identify specific mutations driving cancer growth, then design treatments that precisely target these alterations while sparing healthy cells.",
    impact: "Cancer remains one of the leading causes of death worldwide. While treatments have improved, many patients still face poor outcomes due to one-size-fits-all approaches. Our precision medicine strategy aims to dramatically improve efficacy while reducing side effects by tailoring treatments to each patient's unique cancer profile.",
    institution: "Stanford Medical",
    image: "/placeholder.svg?height=400&width=600",
    progress: 42,
    raised: 21000,
    goal: 50000,
    supporters: 94,
    updates: 5,
    milestones: [
      {
        title: "Genomic sequencing equipment",
        description: "Purchase next-generation sequencing supplies for tumor analysis.",
        amount: 12000,
        completed: true
      },
      {
        title: "Bioinformatics software licenses",
        description: "Access to specialized software for analyzing genetic mutations.",
        amount: 8000,
        completed: true
      },
      {
        title: "Patient sample collection",
        description: "Establish a biobank of diverse cancer samples for testing.",
        amount: 15000,
        completed: false
      },
      {
        title: "Drug screening platform",
        description: "Test candidate compounds against patient-derived cancer cells.",
        amount: 10000,
        completed: false
      },
      {
        title: "Clinical trial preparation",
        description: "Prepare regulatory documentation for initial clinical testing.",
        amount: 5000,
        completed: false
      }
    ],
    team: [
      {
        name: "Dr. James Wilson",
        role: "Principal Investigator",
        bio: "Oncologist specializing in genomic medicine and targeted therapies."
      },
      {
        name: "Dr. Aisha Johnson",
        role: "Clinical Research Director",
        bio: "Translates laboratory findings into clinical applications."
      },
      {
        name: "Robert Chang",
        role: "Bioinformatics Specialist",
        bio: "Develops algorithms to identify actionable genetic mutations."
      },
      {
        name: "Maria Gonzalez",
        role: "Graduate Researcher",
        bio: "Investigating immune response to personalized cancer vaccines."
      }
    ],
    budget: [
      { category: "Genomic Analysis", percentage: 35 },
      { category: "Lab Supplies", percentage: 25 },
      { category: "Personnel", percentage: 30 },
      { category: "Clinical Coordination", percentage: 10 }
    ]
  }
]
