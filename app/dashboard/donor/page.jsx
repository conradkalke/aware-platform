"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export default function DonorDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [savedRows, setSavedRows] = useState([])
  const [donationRows, setDonationRows] = useState([])

  const load = useCallback(async () => {
    if (!hasSupabaseEnv()) {
      setLoading(false)
      return
    }

    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      setLoading(false)
      router.replace("/auth")
      return
    }

    setEmail(session.user.email ?? "")

    const uid = session.user.id

    const { data: saved } = await supabase
      .from("saved_labs")
      .select(
        `
        lab_id,
        labs (
          name,
          institution,
          slug
        )
      `
      )
      .eq("user_id", uid)

    setSavedRows(saved ?? [])

    const { data: donations } = await supabase
      .from("donations")
      .select(
        `
        id,
        amount,
        created_at,
        labs (
          name
        )
      `
      )
      .eq("donor_id", uid)
      .order("created_at", { ascending: false })

    setDonationRows(donations ?? [])
    setLoading(false)
  }, [router])

  useEffect(() => {
    load()
  }, [load])

  const handleLogout = async () => {
    if (!hasSupabaseEnv()) return
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="container py-12">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (!hasSupabaseEnv()) {
    return (
      <div className="container py-12">
        <p className="text-sm text-muted-foreground">
          Supabase is not configured.
        </p>
      </div>
    )
  }

  const savedWithLabs = savedRows.filter((row) => row.labs?.slug)

  return (
    <div className="container space-y-10 py-8 md:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-rose-600 md:text-4xl">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            {email || "Signed in"}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="shrink-0 self-start sm:self-auto text-sm font-medium"
          onClick={handleLogout}
        >
          Log out
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-rose-600">
            Saved Labs
          </CardTitle>
          <CardDescription>Labs you&apos;ve bookmarked</CardDescription>
        </CardHeader>
        <CardContent>
          {savedWithLabs.length === 0 ? (
            <div className="space-y-4 text-center sm:text-left">
              <p className="text-sm text-muted-foreground">
                You have not saved any labs yet. Explore labs to get started.
              </p>
              <Button
                asChild
                className="bg-rose-600 hover:bg-rose-700"
              >
                <Link href="/labs">Explore labs</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {savedWithLabs.map((row) => {
                const lab = row.labs
                return (
                  <div
                    key={row.lab_id}
                    className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm"
                  >
                    <div>
                      <p className="font-semibold">{lab.name}</p>
                      {lab.institution && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {lab.institution}
                        </p>
                      )}
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto border-rose-200 text-rose-700 hover:bg-rose-50"
                    >
                      <Link href={`/labs/${lab.slug}`}>View Lab</Link>
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-rose-600">
            Donation History
          </CardTitle>
          <CardDescription>Your recorded contributions</CardDescription>
        </CardHeader>
        <CardContent>
          {donationRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You have not made any donations yet.
            </p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {donationRows.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {d.labs?.name ?? "Lab"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {d.created_at
                        ? new Date(d.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : ""}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-rose-600">
                    $
                    {Number(d.amount).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
