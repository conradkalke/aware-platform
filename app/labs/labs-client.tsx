"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from 'lucide-react'
import { createClient } from "@/lib/supabase"

type LabView = {
  id: string
  slug: string
  name: string
  description: string
  institution: string
  location: string
  image: string | null
  progress: number
  raised: number
  goal: number
  updates: number
  supporters: number
}

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export function LabsPageClient() {
  const [searchTerm, setSearchTerm] = useState("")
  const [labs, setLabs] = useState<LabView[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadLabs() {
      if (!hasSupabaseEnv()) {
        setLabs([])
        setLoading(false)
        return
      }

      setLoadError(null)
      try {
        const supabase = createClient()
        const { data: labRows, error: labsError } = await supabase
          .from("labs")
          .select(
            "id, slug, name, institution, location, description, funding_goal, image_url"
          )
          .eq("is_published", true)
          .eq("status", "approved")
          .order("created_at", { ascending: false })

        if (labsError) {
          if (!cancelled) {
            setLoadError(labsError.message)
            setLabs([])
          }
          return
        }

        const rows = labRows ?? []
        const labIds = rows.map((r) => r.id).filter(Boolean)

        const raisedByLab: Record<string, number> = {}
        const distinctDonorsByLab: Record<string, Set<string>> = {}
        const anonymousDonationCountByLab: Record<string, number> = {}

        if (labIds.length > 0) {
          const { data: donationRows, error: donError } = await supabase
            .from("donations")
            .select("lab_id, amount, donor_id")
            .in("lab_id", labIds)

          if (!donError && donationRows) {
            for (const d of donationRows) {
              const lid = d.lab_id as string
              raisedByLab[lid] =
                (raisedByLab[lid] ?? 0) + Number(d.amount ?? 0)

              if (d.donor_id == null || d.donor_id === "") {
                anonymousDonationCountByLab[lid] =
                  (anonymousDonationCountByLab[lid] ?? 0) + 1
              } else {
                if (!distinctDonorsByLab[lid]) {
                  distinctDonorsByLab[lid] = new Set()
                }
                distinctDonorsByLab[lid].add(String(d.donor_id))
              }
            }
          }
        }

        if (cancelled) return

        const mapped: LabView[] = rows.map((row) => {
          const goal = Number(row.funding_goal ?? 0)
          const raised = raisedByLab[row.id] ?? 0
          const progress =
            goal > 0 ? Math.min((raised / goal) * 100, 100) : 0
          const uniqueDonors = distinctDonorsByLab[row.id]?.size ?? 0
          const anonymousRows = anonymousDonationCountByLab[row.id] ?? 0
          const supporters = uniqueDonors + anonymousRows

          return {
            id: row.slug,
            slug: row.slug,
            name: row.name ?? "",
            description: row.description ?? "",
            institution: row.institution ?? "",
            location: row.location ?? "",
            image: row.image_url ?? null,
            progress,
            raised,
            goal,
            updates: 0,
            supporters,
          }
        })

        setLabs(mapped)
      } catch (e) {
        if (!cancelled) {
          setLoadError(
            e instanceof Error ? e.message : "Failed to load labs"
          )
          setLabs([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadLabs()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredLabs = useMemo(
    () =>
      labs.filter(
        (lab) =>
          lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lab.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lab.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lab.location.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [labs, searchTerm]
  )

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-rose-600">Explore Labs</h1>
          <p className="text-muted-foreground">
            Discover and support innovative medical research labs
          </p>
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search labs..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>

      {loadError && (
        <p className="pt-6 text-sm text-rose-600" role="alert">
          {loadError}
        </p>
      )}

      <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-sm text-muted-foreground">Loading…</p>
        ) : labs.length === 0 ? (
          <p className="col-span-full text-center text-sm text-muted-foreground">
            No labs available yet.
          </p>
        ) : filteredLabs.length === 0 ? (
          <p className="col-span-full text-center text-sm text-muted-foreground">
            No matching labs.
          </p>
        ) : (
          filteredLabs.map((lab) => (
            <Link key={lab.slug} href={`/labs/${lab.slug}`} className="group">
              <div className="overflow-hidden rounded-lg border bg-background transition-colors hover:bg-accent/50">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={lab.image || "/placeholder.svg"}
                    alt={lab.name}
                    width={600}
                    height={400}
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {lab.institution && (
                    <div className="absolute bottom-2 right-2 rounded-md bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur">
                      {lab.institution}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{lab.name}</h3>
                  {lab.location && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {lab.location}
                    </p>
                  )}
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {lab.description}
                  </p>
                  <div className="mt-4">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-rose-600"
                        style={{ width: `${lab.progress}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span>${lab.raised.toLocaleString()}</span>
                      <span className="font-medium">${lab.goal.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{lab.supporters} supporters</span>
                    <span>•</span>
                    <span>{lab.updates} updates</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
