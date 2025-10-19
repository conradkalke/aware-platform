import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Share2, MessageSquare, Users, ChevronRight, CircleDollarSign, BookOpen, Video } from 'lucide-react'
import { getLabById, labs as allLabs } from "@/lib/labs"
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const lab = getLabById(id) || allLabs[0]
  const title = `${lab.name} — AWARE`
  const description = lab.description
  const images = lab.image ? [lab.image] : ['/placeholder.svg']
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images
    }
  }
}

export default async function LabProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lab = getLabById(id) || allLabs[0]

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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="space-y-6 pt-6">
              <div>
                <h2 className="text-xl font-bold">Research Focus</h2>
                <p className="mt-2 text-muted-foreground">
                  {lab.longDescription || lab.description}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold">Why This Matters</h2>
                <p className="mt-2 text-muted-foreground">
                  {lab.impact || "This research addresses an important unmet medical need with potential for real-world impact."}
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
            <TabsContent value="team" className="space-y-6 pt-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {(lab.team ?? []).map((member, i) => (
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
              {(lab.budget ?? []).map((item, i) => {
                const total = (lab.budget ?? []).reduce((sum, b) => sum + b.amount, 0)
                const percentage = total > 0 ? Math.round((item.amount / total) * 100) : 0
                return (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm">{item.category}</span>
                    <span className="text-sm font-medium">{percentage}%</span>
                  </div>
                )
              })}
              <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100 mt-2">
                {(lab.budget ?? []).map((item, i) => {
                  const total = (lab.budget ?? []).reduce((sum, b) => sum + b.amount, 0)
                  const width = total > 0 ? Math.round((item.amount / total) * 100) : 0
                  
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
            <h3 className="font-medium">Community Challenge</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              If we reach 100 donors this month, our lab will host a virtual tour and Q&A session!
            </p>
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
