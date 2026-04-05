import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function getAdminAuth(): Promise<{
  authorized: boolean
  userId?: string
}> {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  if (!adminEmail) {
    return { authorized: false }
  }

  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
      return { authorized: false }
    }

    if (user.email.toLowerCase() !== adminEmail) {
      return { authorized: false }
    }

    return { authorized: true, userId: user.id }
  } catch {
    return { authorized: false }
  }
}

export function adminForbidden() {
  return NextResponse.json({ error: "Not authorized" }, { status: 403 })
}
