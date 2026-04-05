"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Microscope } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

function numOrNull(v) {
  if (v === "" || v === null || v === undefined) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

export default function LabDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [gate, setGate] = useState(null)
  /** @type {null | { id: string; slug: string; name: string; status: string; [key: string]: unknown }} */
  const [lab, setLab] = useState(null)
  const [totalRaised, setTotalRaised] = useState(0)
  /** @type {Array<{ id: string; name: string; title: string; bio: string | null }>} */
  const [teamMembers, setTeamMembers] = useState([])

  const [profileForm, setProfileForm] = useState({
    name: "",
    description: "",
    research_focus: "",
    why_it_matters: "",
    funding_status: "",
    funding_goal: "",
    image_url: "",
    budget_sequencing: "",
    budget_computational: "",
    budget_personnel: "",
    budget_supplies: "",
  })
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState(null)

  const [updateTitle, setUpdateTitle] = useState("")
  const [updateContent, setUpdateContent] = useState("")
  const [postingUpdate, setPostingUpdate] = useState(false)
  const [updatePosted, setUpdatePosted] = useState(false)

  const [newMember, setNewMember] = useState({
    name: "",
    title: "",
    bio: "",
  })
  const [addingMember, setAddingMember] = useState(false)

  const loadDashboard = useCallback(async () => {
    if (!hasSupabaseEnv()) {
      setGate("no_env")
      setLoading(false)
      return
    }

    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      setGate("unauth")
      setLoading(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", session.user.id)
      .maybeSingle()

    if (profileError) {
      setGate("error")
      setLoading(false)
      return
    }

    if (!profile || profile.user_type !== "lab") {
      setGate("not_lab")
      setLoading(false)
      return
    }

    const { data: managerRows, error: mgrError } = await supabase
      .from("lab_managers")
      .select("lab_id")
      .eq("user_id", session.user.id)
      .limit(1)

    if (mgrError || !managerRows?.length) {
      setGate("no_lab")
      setLoading(false)
      return
    }

    const labId = managerRows[0].lab_id

    const { data: labRow, error: labError } = await supabase
      .from("labs")
      .select("*")
      .eq("id", labId)
      .single()

    if (labError || !labRow) {
      setGate("error")
      setLoading(false)
      return
    }

    setLab(labRow)

    if (labRow.status === "pending") {
      setGate("pending")
      setLoading(false)
      return
    }

    if (labRow.status !== "approved") {
      setGate("rejected")
      setLoading(false)
      return
    }

    const { data: donations } = await supabase
      .from("donations")
      .select("amount")
      .eq("lab_id", labId)

    const sum =
      donations?.reduce((acc, row) => acc + Number(row.amount || 0), 0) ?? 0
    setTotalRaised(sum)

    const { data: team } = await supabase
      .from("team_members")
      .select("id, name, title, bio")
      .eq("lab_id", labId)
      .order("created_at", { ascending: true })

    setTeamMembers(team ?? [])

    setProfileForm({
      name: labRow.name ?? "",
      description: labRow.description ?? "",
      research_focus: labRow.research_focus ?? "",
      why_it_matters: labRow.why_it_matters ?? "",
      funding_status: labRow.funding_status ?? "",
      funding_goal:
        labRow.funding_goal !== null && labRow.funding_goal !== undefined
          ? String(labRow.funding_goal)
          : "",
      image_url: labRow.image_url ?? "",
      budget_sequencing:
        labRow.budget_sequencing !== null &&
        labRow.budget_sequencing !== undefined
          ? String(labRow.budget_sequencing)
          : "",
      budget_computational:
        labRow.budget_computational !== null &&
        labRow.budget_computational !== undefined
          ? String(labRow.budget_computational)
          : "",
      budget_personnel:
        labRow.budget_personnel !== null &&
        labRow.budget_personnel !== undefined
          ? String(labRow.budget_personnel)
          : "",
      budget_supplies:
        labRow.budget_supplies !== null &&
        labRow.budget_supplies !== undefined
          ? String(labRow.budget_supplies)
          : "",
    })

    setGate("dashboard")
    setLoading(false)
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  useEffect(() => {
    if (gate === "unauth") {
      router.replace("/auth")
    }
  }, [gate, router])

  const handleLogout = async () => {
    if (!hasSupabaseEnv()) return
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!lab?.id) return
    setSavingProfile(true)
    setProfileMessage(null)
    const supabase = createClient()
    const { data, error } = await supabase
      .from("labs")
      .update({
        name: profileForm.name.trim(),
        description: profileForm.description.trim() || null,
        research_focus: profileForm.research_focus.trim() || null,
        why_it_matters: profileForm.why_it_matters.trim() || null,
        funding_status: profileForm.funding_status.trim() || null,
        funding_goal: numOrNull(profileForm.funding_goal),
        image_url: profileForm.image_url.trim() || null,
        budget_sequencing: numOrNull(profileForm.budget_sequencing),
        budget_computational: numOrNull(profileForm.budget_computational),
        budget_personnel: numOrNull(profileForm.budget_personnel),
        budget_supplies: numOrNull(profileForm.budget_supplies),
      })
      .eq("id", lab.id)
      .select()
      .single()

    setSavingProfile(false)
    if (error) {
      setProfileMessage({ type: "error", text: error.message })
      return
    }
    if (data) setLab((prev) => ({ ...prev, ...data }))
    setProfileMessage({ type: "ok", text: "Profile saved." })
  }

  const handlePostUpdate = async (e) => {
    e.preventDefault()
    if (!lab?.id || !updateTitle.trim() || !updateContent.trim()) return
    setPostingUpdate(true)
    setUpdatePosted(false)
    const supabase = createClient()
    const { error } = await supabase.from("lab_updates").insert({
      lab_id: lab.id,
      title: updateTitle.trim(),
      content: updateContent.trim(),
    })
    setPostingUpdate(false)
    if (error) {
      setProfileMessage({ type: "error", text: error.message })
      return
    }
    setUpdateTitle("")
    setUpdateContent("")
    setUpdatePosted(true)
  }

  const handleDeleteMember = async (memberId) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", memberId)
    if (error) {
      setProfileMessage({ type: "error", text: error.message })
      return
    }
    setTeamMembers((prev) => prev.filter((m) => m.id !== memberId))
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    if (!lab?.id || !newMember.name.trim() || !newMember.title.trim()) return
    setAddingMember(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from("team_members")
      .insert({
        lab_id: lab.id,
        name: newMember.name.trim(),
        title: newMember.title.trim(),
        bio: newMember.bio.trim() || null,
      })
      .select("id, name, title, bio")
      .single()

    setAddingMember(false)
    if (error) {
      setProfileMessage({ type: "error", text: error.message })
      return
    }
    if (data) setTeamMembers((prev) => [...prev, data])
    setNewMember({ name: "", title: "", bio: "" })
  }

  if (loading || gate === "unauth") {
    return (
      <div className="container py-12">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (gate === "no_env") {
    return (
      <div className="container py-12">
        <p className="text-sm text-muted-foreground">
          Supabase is not configured.
        </p>
      </div>
    )
  }

  if (gate === "not_lab") {
    return (
      <div className="container flex min-h-[50vh] flex-col items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-rose-600">Lab dashboard</CardTitle>
            <CardDescription>
              This page is only available for lab accounts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Back to home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gate === "no_lab") {
    return (
      <div className="container flex min-h-[50vh] flex-col items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-rose-600">No lab linked</CardTitle>
            <CardDescription>
              No lab is linked to your account yet. If you just signed up,
              finish confirming your email and try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild variant="outline">
              <Link href="/auth">Account</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gate === "error") {
    return (
      <div className="container py-12">
        <p className="text-sm text-rose-600">Could not load your lab data.</p>
        <Button className="mt-4 bg-rose-600 hover:bg-rose-700" onClick={loadDashboard}>
          Retry
        </Button>
      </div>
    )
  }

  if (gate === "pending" && lab) {
    return (
      <div className="container flex min-h-[70vh] flex-col items-center justify-center py-12">
        <div className="w-full max-w-md space-y-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2"
          >
            <Microscope className="h-12 w-12 text-rose-600" />
            <span className="text-3xl font-bold text-rose-600">AWARE</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your application is under review. We will notify you when you are
            approved.
          </p>
          <Button
            type="button"
            variant="outline"
            className="text-sm font-medium"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </div>
    )
  }

  if (gate === "rejected") {
    return (
      <div className="container flex min-h-[50vh] flex-col items-center justify-center py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-rose-600">Application status</CardTitle>
            <CardDescription>
              This lab application is not active. Contact support if you need
              help.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={handleLogout}>
              Log out
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gate !== "dashboard" || !lab) {
    return null
  }

  return (
    <div className="container space-y-8 py-8 md:py-12">
      {profileMessage?.type === "error" && (
        <p className="text-sm text-rose-600" role="alert">
          {profileMessage.text}
        </p>
      )}

      <div className="flex flex-col gap-4 border-b border-border pb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-rose-600 md:text-4xl">
            {lab.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Lab dashboard</p>
        </div>
        <Button asChild className="w-full bg-rose-600 hover:bg-rose-700 md:w-auto">
          <Link href={`/labs/${lab.slug}`}>View Live Page</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Fundraising</CardTitle>
          <CardDescription>Total raised from recorded donations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold tracking-tight text-rose-600">
            ${totalRaised.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Edit Lab Profile</CardTitle>
          <CardDescription>
            Update how your lab appears on AWARE. Save when you&apos;re done.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pf-name" className="text-sm font-medium">
                Lab name
              </Label>
              <Input
                id="pf-name"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-desc" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="pf-desc"
                value={profileForm.description}
                onChange={(e) =>
                  setProfileForm((f) => ({ ...f, description: e.target.value }))
                }
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-focus" className="text-sm font-medium">
                Research focus
              </Label>
              <Textarea
                id="pf-focus"
                value={profileForm.research_focus}
                onChange={(e) =>
                  setProfileForm((f) => ({
                    ...f,
                    research_focus: e.target.value,
                  }))
                }
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-why" className="text-sm font-medium">
                Why it matters
              </Label>
              <Textarea
                id="pf-why"
                value={profileForm.why_it_matters}
                onChange={(e) =>
                  setProfileForm((f) => ({
                    ...f,
                    why_it_matters: e.target.value,
                  }))
                }
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-funding-status" className="text-sm font-medium">
                Funding status
              </Label>
              <Textarea
                id="pf-funding-status"
                value={profileForm.funding_status}
                onChange={(e) =>
                  setProfileForm((f) => ({
                    ...f,
                    funding_status: e.target.value,
                  }))
                }
                className="min-h-[60px]"
                placeholder="Describe your current funding situation"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-goal" className="text-sm font-medium">
                Funding goal ($)
              </Label>
              <Input
                id="pf-goal"
                type="number"
                min="0"
                step="0.01"
                value={profileForm.funding_goal}
                onChange={(e) =>
                  setProfileForm((f) => ({
                    ...f,
                    funding_goal: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-image" className="text-sm font-medium">
                Image URL
              </Label>
              <Input
                id="pf-image"
                type="url"
                value={profileForm.image_url}
                onChange={(e) =>
                  setProfileForm((f) => ({ ...f, image_url: e.target.value }))
                }
                placeholder="https://…"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pf-b-seq" className="text-sm font-medium">
                  Budget — sequencing ($)
                </Label>
                <Input
                  id="pf-b-seq"
                  type="number"
                  min="0"
                  step="0.01"
                  value={profileForm.budget_sequencing}
                  onChange={(e) =>
                    setProfileForm((f) => ({
                      ...f,
                      budget_sequencing: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pf-b-comp" className="text-sm font-medium">
                  Budget — computational ($)
                </Label>
                <Input
                  id="pf-b-comp"
                  type="number"
                  min="0"
                  step="0.01"
                  value={profileForm.budget_computational}
                  onChange={(e) =>
                    setProfileForm((f) => ({
                      ...f,
                      budget_computational: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pf-b-per" className="text-sm font-medium">
                  Budget — personnel ($)
                </Label>
                <Input
                  id="pf-b-per"
                  type="number"
                  min="0"
                  step="0.01"
                  value={profileForm.budget_personnel}
                  onChange={(e) =>
                    setProfileForm((f) => ({
                      ...f,
                      budget_personnel: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pf-b-sup" className="text-sm font-medium">
                  Budget — supplies ($)
                </Label>
                <Input
                  id="pf-b-sup"
                  type="number"
                  min="0"
                  step="0.01"
                  value={profileForm.budget_supplies}
                  onChange={(e) =>
                    setProfileForm((f) => ({
                      ...f,
                      budget_supplies: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            {profileMessage?.type === "ok" && (
              <p className="text-sm text-green-700">{profileMessage.text}</p>
            )}
            <Button
              type="submit"
              className="bg-rose-600 hover:bg-rose-700"
              disabled={savingProfile}
            >
              {savingProfile ? "Saving…" : "Save profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Post Update</CardTitle>
          <CardDescription>Share news with supporters</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePostUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="upd-title" className="text-sm font-medium">
                Title
              </Label>
              <Input
                id="upd-title"
                value={updateTitle}
                onChange={(e) => setUpdateTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="upd-content" className="text-sm font-medium">
                Content
              </Label>
              <Textarea
                id="upd-content"
                value={updateContent}
                onChange={(e) => setUpdateContent(e.target.value)}
                className="min-h-[120px]"
                required
              />
            </div>
            {updatePosted && (
              <p className="text-sm text-green-700">Update posted.</p>
            )}
            <Button
              type="submit"
              className="bg-rose-600 hover:bg-rose-700"
              disabled={postingUpdate}
            >
              {postingUpdate ? "Publishing…" : "Publish update"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Team Members</CardTitle>
          <CardDescription>People featured on your lab page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {teamMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No team members yet.</p>
          ) : (
            <ul className="space-y-4">
              {teamMembers.map((m) => (
                <li
                  key={m.id}
                  className="flex flex-col gap-2 rounded-md border border-border p-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-sm text-muted-foreground">{m.title}</p>
                    {m.bio && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {m.bio}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    onClick={() => handleDeleteMember(m.id)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-border pt-6">
            <p className="mb-4 text-sm font-medium">Add team member</p>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tm-name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="tm-name"
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember((n) => ({ ...n, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tm-title" className="text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="tm-title"
                  value={newMember.title}
                  onChange={(e) =>
                    setNewMember((n) => ({ ...n, title: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tm-bio" className="text-sm font-medium">
                  Bio
                </Label>
                <Textarea
                  id="tm-bio"
                  value={newMember.bio}
                  onChange={(e) =>
                    setNewMember((n) => ({ ...n, bio: e.target.value }))
                  }
                  className="min-h-[80px]"
                />
              </div>
              <Button
                type="submit"
                variant="outline"
                className="border-rose-200 text-rose-700 hover:bg-rose-50"
                disabled={addingMember}
              >
                {addingMember ? "Adding…" : "Add member"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
