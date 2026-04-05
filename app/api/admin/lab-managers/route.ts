import { NextRequest, NextResponse } from "next/server"
import { adminForbidden, getAdminAuth } from "@/lib/admin-auth"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

async function findUserIdByEmail(
  service: ReturnType<typeof createServiceRoleClient>,
  email: string
): Promise<string | null> {
  const normalized = email.trim().toLowerCase()
  for (let page = 1; page <= 25; page++) {
    const { data, error } = await service.auth.admin.listUsers({
      page,
      perPage: 200,
    })
    if (error || !data?.users?.length) {
      return null
    }
    const found = data.users.find(
      (u) => u.email?.toLowerCase() === normalized
    )
    if (found?.id) {
      return found.id
    }
    if (data.users.length < 200) {
      break
    }
  }
  return null
}

export async function POST(request: NextRequest) {
  const auth = await getAdminAuth()
  if (!auth.authorized) {
    return adminForbidden()
  }

  let body: { email?: string; lab_id?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const email = typeof body.email === "string" ? body.email : ""
  const labId = typeof body.lab_id === "string" ? body.lab_id : ""

  if (!email.trim() || !labId) {
    return NextResponse.json(
      { error: "Email and lab are required" },
      { status: 400 }
    )
  }

  try {
    const service = createServiceRoleClient()
    const userId = await findUserIdByEmail(service, email)
    if (!userId) {
      return NextResponse.json(
        { error: "No user found with that email" },
        { status: 404 }
      )
    }

    const { data, error } = await service
      .from("lab_managers")
      .insert({ lab_id: labId, user_id: userId })
      .select()
      .maybeSingle()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({
          ok: true,
          message: "User is already a manager for this lab.",
        })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ lab_manager: data })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
