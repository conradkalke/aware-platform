"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

type LabSaveButtonProps = {
  labSlug: string
  initialLabId: string | null
}

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export function LabSaveButton({ labSlug, initialLabId }: LabSaveButtonProps) {
  const router = useRouter()
  const [labId, setLabId] = useState<string | null>(initialLabId)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setLabId(initialLabId)
  }, [initialLabId])

  const refreshSaved = useCallback(async (resolvedLabId: string) => {
    if (!hasSupabaseEnv()) {
      setSaved(false)
      setLoading(false)
      return
    }
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.user) {
      setSaved(false)
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from("saved_labs")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("lab_id", resolvedLabId)
      .maybeSingle()
    setSaved(Boolean(data))
    setLoading(false)
  }, [])

  useEffect(() => {
    if (initialLabId) return
    if (!hasSupabaseEnv()) {
      setLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      const { data } = await createClient()
        .from("labs")
        .select("id")
        .eq("slug", labSlug)
        .maybeSingle()
      if (cancelled) return
      if (data?.id) {
        setLabId(data.id)
      } else {
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [labSlug, initialLabId])

  useEffect(() => {
    if (!labId) return
    if (!hasSupabaseEnv()) {
      setLoading(false)
      return
    }
    void refreshSaved(labId)
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void refreshSaved(labId)
    })
    return () => subscription.unsubscribe()
  }, [labId, refreshSaved])

  async function handleClick() {
    if (!labId) return
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.user) {
      router.push("/auth")
      return
    }
    setBusy(true)
    if (saved) {
      const { error } = await supabase
        .from("saved_labs")
        .delete()
        .eq("user_id", session.user.id)
        .eq("lab_id", labId)
      if (!error) setSaved(false)
    } else {
      const { error } = await supabase.from("saved_labs").insert({
        user_id: session.user.id,
        lab_id: labId,
      })
      if (!error) setSaved(true)
    }
    setBusy(false)
    router.refresh()
  }

  const disabled = busy || loading || !labId || !hasSupabaseEnv()

  return (
    <Button
      type="button"
      variant={saved ? "default" : "outline"}
      className={
        saved
          ? "flex-1 bg-rose-600 hover:bg-rose-700 text-primary-foreground"
          : "flex-1"
      }
      onClick={handleClick}
      disabled={disabled}
    >
      {loading ? "…" : saved ? "Saved" : "Save Lab"}
    </Button>
  )
}
