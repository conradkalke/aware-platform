"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
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

export default function AdminPage() {
  const [phase, setPhase] = useState("loading")
  const [labs, setLabs] = useState([])
  const [error, setError] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const [createForm, setCreateForm] = useState({
    name: "",
    institution: "",
    location: "",
    description: "",
    research_focus: "",
    why_it_matters: "",
    funding_goal: "",
  })
  const [creating, setCreating] = useState(false)

  const [assignEmail, setAssignEmail] = useState("")
  const [assignLabId, setAssignLabId] = useState("")
  const [assigning, setAssigning] = useState(false)
  const [assignMessage, setAssignMessage] = useState(null)

  const loadLabs = useCallback(async () => {
    setError(null)
    const res = await fetch("/api/admin/labs", { credentials: "same-origin" })
    if (res.status === 403) {
      setPhase("denied")
      return
    }
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      setError(j.error || "Failed to load labs")
      setPhase("ready")
      return
    }
    const j = await res.json()
    setLabs(j.labs ?? [])
    setPhase("ready")
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const res = await fetch("/api/admin/check", { credentials: "same-origin" })
      const j = await res.json().catch(() => ({}))
      if (cancelled) return
      if (!j.authorized) {
        setPhase("denied")
        return
      }
      await loadLabs()
    })()
    return () => {
      cancelled = true
    }
  }, [loadLabs])

  const handleApprove = async (id) => {
    setBusyId(id)
    setError(null)
    const res = await fetch(`/api/admin/labs/${id}`, {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve" }),
    })
    setBusyId(null)
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      setError(j.error || "Approve failed")
      return
    }
    await loadLabs()
  }

  const handleReject = async (id) => {
    setBusyId(id)
    setError(null)
    const res = await fetch(`/api/admin/labs/${id}`, {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject" }),
    })
    setBusyId(null)
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      setError(j.error || "Reject failed")
      return
    }
    await loadLabs()
  }

  const handleCreateLab = async (e) => {
    e.preventDefault()
    setCreating(true)
    setError(null)
    const res = await fetch("/api/admin/labs", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm),
    })
    setCreating(false)
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      setError(j.error || "Create failed")
      return
    }
    setCreateForm({
      name: "",
      institution: "",
      location: "",
      description: "",
      research_focus: "",
      why_it_matters: "",
      funding_goal: "",
    })
    await loadLabs()
  }

  const handleAssignManager = async (e) => {
    e.preventDefault()
    setAssigning(true)
    setAssignMessage(null)
    setError(null)
    const res = await fetch("/api/admin/lab-managers", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: assignEmail, lab_id: assignLabId }),
    })
    const j = await res.json().catch(() => ({}))
    setAssigning(false)
    if (!res.ok) {
      setError(j.error || "Assignment failed")
      return
    }
    setAssignMessage(j.message || "Lab manager assigned.")
    setAssignEmail("")
    setAssignLabId("")
  }

  if (phase === "loading") {
    return (
      <div className="container py-12">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (phase === "denied") {
    return (
      <div className="container flex min-h-[50vh] items-center justify-center py-12">
        <p className="text-center text-sm text-muted-foreground">Not authorized.</p>
      </div>
    )
  }

  const pendingLabs = labs.filter((l) => l.status === "pending")

  const statusBadge = (status) => {
    if (status === "approved") {
      return (
        <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-800">
          approved
        </span>
      )
    }
    if (status === "pending") {
      return (
        <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900">
          pending
        </span>
      )
    }
    return (
      <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-800">
        rejected
      </span>
    )
  }

  return (
    <div className="container space-y-10 py-8 md:py-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-rose-600 md:text-4xl">
            Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage lab applications and directory
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="w-fit">
          <Link href="/">Home</Link>
        </Button>
      </div>

      {error && (
        <p className="text-sm text-rose-600" role="alert">
          {error}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-rose-600">
            Pending Applications
          </CardTitle>
          <CardDescription>Labs awaiting review</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingLabs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending applications.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pendingLabs.map((lab) => (
                <div
                  key={lab.id}
                  className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <p className="font-semibold">{lab.name}</p>
                    {lab.institution && (
                      <p className="text-sm text-muted-foreground">
                        {lab.institution}
                      </p>
                    )}
                    {lab.location && (
                      <p className="text-sm text-muted-foreground">
                        {lab.location}
                      </p>
                    )}
                    {lab.research_focus && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {lab.research_focus}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      className="bg-rose-600 hover:bg-rose-700"
                      disabled={busyId === lab.id}
                      onClick={() => handleApprove(lab.id)}
                    >
                      {busyId === lab.id ? "…" : "Approve"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      disabled={busyId === lab.id}
                      onClick={() => handleReject(lab.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-rose-600">
            All Labs
          </CardTitle>
          <CardDescription>Every lab record</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {labs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No labs yet.</p>
            ) : (
              labs.map((lab) => (
                <div
                  key={lab.id}
                  className="flex flex-col gap-2 rounded-lg border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{lab.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {lab.institution || "—"}
                    </p>
                  </div>
                  <div className="shrink-0">{statusBadge(lab.status)}</div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-rose-600">
            Create New Lab
          </CardTitle>
          <CardDescription>
            Creates an approved, published lab (you will be set as owner)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateLab} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ad-name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="ad-name"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ad-inst" className="text-sm font-medium">
                  Institution
                </Label>
                <Input
                  id="ad-inst"
                  value={createForm.institution}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, institution: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad-loc" className="text-sm font-medium">
                  Location
                </Label>
                <Input
                  id="ad-loc"
                  value={createForm.location}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, location: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ad-desc" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="ad-desc"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, description: e.target.value }))
                }
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ad-focus" className="text-sm font-medium">
                Research focus
              </Label>
              <Textarea
                id="ad-focus"
                value={createForm.research_focus}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, research_focus: e.target.value }))
                }
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ad-why" className="text-sm font-medium">
                Why it matters
              </Label>
              <Textarea
                id="ad-why"
                value={createForm.why_it_matters}
                onChange={(e) =>
                  setCreateForm((f) => ({
                    ...f,
                    why_it_matters: e.target.value,
                  }))
                }
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ad-goal" className="text-sm font-medium">
                Funding goal ($)
              </Label>
              <Input
                id="ad-goal"
                type="number"
                min="0"
                step="0.01"
                value={createForm.funding_goal}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, funding_goal: e.target.value }))
                }
              />
            </div>
            <Button
              type="submit"
              className="bg-rose-600 hover:bg-rose-700"
              disabled={creating}
            >
              {creating ? "Creating…" : "Create lab"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-rose-600">
            Assign Lab Manager
          </CardTitle>
          <CardDescription>
            Link a Supabase Auth user (by email) to a lab
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAssignManager} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ad-email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="ad-email"
                type="email"
                value={assignEmail}
                onChange={(e) => setAssignEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ad-lab" className="text-sm font-medium">
                Lab
              </Label>
              <select
                id="ad-lab"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={assignLabId}
                onChange={(e) => setAssignLabId(e.target.value)}
                required
              >
                <option value="">Select a lab…</option>
                {labs.map((lab) => (
                  <option key={lab.id} value={lab.id}>
                    {lab.name}
                  </option>
                ))}
              </select>
            </div>
            {assignMessage && (
              <p className="text-sm text-green-700">{assignMessage}</p>
            )}
            <Button
              type="submit"
              variant="outline"
              className="border-rose-200 text-rose-700 hover:bg-rose-50"
              disabled={assigning}
            >
              {assigning ? "Assigning…" : "Assign manager"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
