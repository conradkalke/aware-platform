import { NextRequest, NextResponse } from "next/server"
import { adminForbidden, getAdminAuth } from "@/lib/admin-auth"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

function slugify(name: string) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  const suffix = Math.random().toString(36).slice(2, 10)
  return (base || "lab") + "-" + suffix
}

export async function GET() {
  const auth = await getAdminAuth()
  if (!auth.authorized) {
    return adminForbidden()
  }

  try {
    const service = createServiceRoleClient()
    const { data, error } = await service
      .from("labs")
      .select(
        "id, name, institution, location, research_focus, status, is_published, slug, created_at"
      )
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ labs: data ?? [] })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await getAdminAuth()
  if (!auth.authorized || !auth.userId) {
    return adminForbidden()
  }

  try {
    const body = await request.json()
    const {
      name,
      institution,
      location,
      description,
      research_focus,
      why_it_matters,
      funding_goal,
    } = body as Record<string, unknown>

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const goal =
      funding_goal === "" || funding_goal === null || funding_goal === undefined
        ? null
        : Number(funding_goal)

    const service = createServiceRoleClient()
    const slug = slugify(name)

    const { data, error } = await service
      .from("labs")
      .insert({
        owner_id: auth.userId,
        slug,
        name: name.trim(),
        institution:
          typeof institution === "string" && institution.trim()
            ? institution.trim()
            : null,
        location:
          typeof location === "string" && location.trim()
            ? location.trim()
            : null,
        description:
          typeof description === "string" && description.trim()
            ? description.trim()
            : null,
        research_focus:
          typeof research_focus === "string" && research_focus.trim()
            ? research_focus.trim()
            : null,
        why_it_matters:
          typeof why_it_matters === "string" && why_it_matters.trim()
            ? why_it_matters.trim()
            : null,
        funding_goal: Number.isFinite(goal) ? goal : null,
        status: "approved",
        is_published: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ lab: data })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
