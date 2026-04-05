import { NextRequest, NextResponse } from "next/server"
import { adminForbidden, getAdminAuth } from "@/lib/admin-auth"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAdminAuth()
  if (!auth.authorized) {
    return adminForbidden()
  }

  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  let body: { action?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const action = body.action
  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  try {
    const service = createServiceRoleClient()
    const updates =
      action === "approve"
        ? { status: "approved" as const, is_published: true }
        : { status: "rejected" as const, is_published: false }

    const { data, error } = await service
      .from("labs")
      .update(updates)
      .eq("id", id)
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
