import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  let supabase
  try {
    supabase = await createServerSupabaseClient()
  } catch {
    redirect("/auth")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .maybeSingle()

  const userType = profile?.user_type
  if (userType === "lab") {
    redirect("/dashboard/lab")
  }
  if (userType === "donor") {
    redirect("/dashboard/donor")
  }

  redirect("/dashboard/donor")
}
