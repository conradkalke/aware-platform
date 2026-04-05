"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { Microscope, Menu, X } from 'lucide-react'
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    if (!hasSupabaseEnv()) return

    const supabase = createClient()

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    if (!hasSupabaseEnv()) return
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Microscope className="h-6 w-6 text-rose-600" />
          <span className="text-xl font-bold text-rose-600">AWARE</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/labs" className="text-sm font-medium hover:text-rose-600 transition-colors">
            Explore Labs
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-rose-600 transition-colors">
            About
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:text-rose-600 transition-colors">
                Dashboard
              </Link>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-sm font-medium"
                onClick={handleSignOut}
              >
                Log Out
              </Button>
            </>
          ) : (
            <Button asChild className="bg-rose-600 hover:bg-rose-700 text-sm font-medium">
              <Link href="/auth">Log In</Link>
            </Button>
          )}
        </nav>
        
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
        {isMenuOpen && (
          <div id="mobile-menu" className="container md:hidden py-4 pb-6">
            <nav className="flex flex-col gap-4">
              <Link
                href="/labs"
                className="text-sm font-medium hover:text-rose-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore Labs
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium hover:text-rose-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium hover:text-rose-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-fit text-sm font-medium"
                    onClick={handleSignOut}
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <Button asChild className="w-fit bg-rose-600 hover:bg-rose-700 text-sm font-medium">
                  <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                    Log In
                  </Link>
                </Button>
              )}
            </nav>
          </div>
        )}
    </header>
  )
}
