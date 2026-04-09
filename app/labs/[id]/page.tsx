import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Share2, MessageSquare, ChevronRight, BookOpen, Video } from 'lucide-react'
import { getLabById, type Lab } from "@/lib/labs"
import { LabSaveButton } from "@/components/lab-save-button"
import {
  createServerSupabaseClientNoStore,
} from "@/lib/supabase/server"
import type { Metadata } from 'next'

export const dynamic = "force-dynamic"
export const revalidate = 0

type LabsRow = {
  id: string
  slug: string
  name: string
  institution: string | null
  location: string | null
  description: string | null
  research_focus: string | null
  why_it_matters: string | null
  funding_goal: number | string | null
  image_url: string | null
  budget_sequencing: number | string | null
  budget_computational: number | string | null
  budget_personnel: number | string | null
  budget_supplies: number | string | null
}

function budgetFromRow(row: LabsRow): Lab["budget"] {
  const out: NonNullable<Lab["budget"]> = []
  const push = (category: string, v: unknown) => {
    const n = typeof v === "number" ? v : v != null ? Number(v) : NaN
    if (Number.isFinite(n) && n > 0) {
      out.push({ category, amount: n, description: "" })
    }
  }
  push("Sequencing", row.budget_sequencing)
  push("Computational Analysis", row.budget_computational)
  push("Personnel", row.budget_personnel)
  push("Supplies", row.budget_supplies)
  return out.length ? out : undefined
}

async function loadLabPageData(
  slug: string
): Promise<{ lab: Lab; initialLabId: string | null } | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    const staticLab = getLabById(slug)
    if (!staticLab) return null
    return { lab: staticLab, initialLabId: null }
  }

  try {
    const supabase = await createServerSupabaseClientNoStore()

    const { data: row, error: labError } = await supabase
      .from("labs")
      .select(
        [
          "id",
          "slug",
          "name",
          "institution",
          "location",
          "description",
          "research_focus",
          "why_it_matters",
          "funding_goal",
          "image_url",
          "budget_sequencing",
          "budget_computational",
          "budget_personnel",
          "budget_supplies",
        ].join(", ")
      )
      .eq("slug", slug)
      .maybeSingle()

    if (labError || !row) return null

    const r = row as unknown as LabsRow
    const labUuid = r.id

    const [donRes, updatesRes, teamRes] = await Promise.all([
      supabase.from("donations").select("amount").eq("lab_id", labUuid),
      supabase
        .from("lab_updates")
        .select("title, content, created_at")
        .eq("lab_id", labUuid)
        .order("created_at", { ascending: false }),
      supabase
        .from("team_members")
        .select("name, title, bio")
        .eq("lab_id", labUuid),
    ])

    const donationRows = donRes.data ?? []
    const raised = donationRows.reduce(
      (s, d: { amount: number | string }) => s + Number(d.amount),
      0
    )
    const goalRaw = r.funding_goal != null ? Number(r.funding_goal) : 0
    const goal = goalRaw > 0 ? goalRaw : 10000
    const progress = Math.min((raised / goal) * 100, 100)

    const updateRows = updatesRes.data ?? []
    const updatesList =
      updateRows.length > 0
        ? updateRows.map(
            (u: {
              title: string
              content: string
              created_at: string
            }) => ({
              date: (u.created_at ?? "").split("T")[0] || "",
              title: u.title,
              summary: u.content,
            })
          )
        : undefined

    const teamRows = teamRes.data ?? []
    const team =
      teamRows.length > 0
        ? teamRows.map(
            (m: { name: string; title: string; bio: string | null }) => ({
              name: m.name,
              role: m.title,
              bio: m.bio ?? "",
            })
          )
        : undefined

    const description =
      (r.description && r.description.trim()) ||
      (r.research_focus && r.research_focus.trim()) ||
      ""
    const longDescription =
      (r.research_focus && r.research_focus.trim()) ||
      (r.description && r.description.trim()) ||
      undefined

    const lab: Lab = {
      id: r.slug,
      name: r.name,
      description,
      longDescription,
      institution:
        (r.institution && r.institution.trim()) ||
        (r.location && r.location.trim()) ||
        "",
      image: r.image_url?.trim() || "/placeholder.svg",
      progress,
      raised,
      goal,
      updates: updatesList?.length ?? 0,
      updatesList,
      impact: r.why_it_matters?.trim() || undefined,
      team,
      budget: budgetFromRow(r),
    }

    return { lab, initialLabId: labUuid }
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const data = await loadLabPageData(id)
  if (!data) {
    return { title: "Lab — AWARE" }
  }
  const { lab } = data
  const name = lab.name
  const description = lab.description
  const image = lab.image
  const title = `${name} — AWARE`
  const images = image ? [image] : ['/placeholder.svg']
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

export default async function LabProfile({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const loaded = await loadLabPageData(id)
  if (!loaded) {
    notFound()
  }
  const { lab, initialLabId } = loaded

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
              <LabSaveButton
                key={lab.id}
                labSlug={lab.id}
                initialLabId={initialLabId}
              />
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
              {lab.updatesList && lab.updatesList.length > 0 ? (
                <div className="space-y-6">
                  {lab.updatesList.map((update, i) => (
                    <div key={`${update.date}-${i}`} className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                          {i % 2 === 0 ? (
                            <Video className="h-5 w-5 text-rose-600" />
                          ) : (
                            <BookOpen className="h-5 w-5 text-rose-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{update.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(update.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-muted-foreground">{update.summary}</p>
                    </div>
                  ))}
                </div>
              ) : lab.updates > 0 ? (
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
              ) : null}
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
