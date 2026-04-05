"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ChevronLeft } from "lucide-react"

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

function slugifyLabSlug(name) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  const suffix = Math.random().toString(36).slice(2, 10)
  return (base || "lab") + "-" + suffix
}

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState("sign-in")
  const [signupStep, setSignupStep] = useState("choose")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [labName, setLabName] = useState("")
  const [institution, setInstitution] = useState("")
  const [location, setLocation] = useState("")
  const [researchFocus, setResearchFocus] = useState("")

  const [error, setError] = useState(null)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [signupSuccessKind, setSignupSuccessKind] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetSignupFlow = () => {
    setSignupStep("choose")
    setLabName("")
    setInstitution("")
    setLocation("")
    setResearchFocus("")
  }

  const handleTabChange = (value) => {
    setMode(value)
    setError(null)
    setSignupSuccess(false)
    setSignupSuccessKind(null)
    if (value === "sign-up") {
      resetSignupFlow()
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setError(null)
    setSignupSuccess(false)
    if (!hasSupabaseEnv()) {
      setError(
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      )
      return
    }
    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })
      if (signInError) {
        setError(signInError.message)
        setIsSubmitting(false)
        return
      }
      if (!signInData.user) {
        setError("Could not sign in. Please try again.")
        setIsSubmitting(false)
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", signInData.user.id)
        .maybeSingle()

      const destination =
        profile?.user_type === "lab"
          ? "/dashboard/lab"
          : "/dashboard/donor"

      setIsSubmitting(false)
      router.push(destination)
      router.refresh()
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleSignUpDonor = async (e) => {
    e.preventDefault()
    setError(null)
    setSignupSuccess(false)
    if (!hasSupabaseEnv()) {
      setError(
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      )
      return
    }
    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            user_type: "donor",
          },
        },
      })
      if (signUpError) {
        setError(signUpError.message)
        setIsSubmitting(false)
        return
      }
      if (!data.user) {
        setError("Could not create account. Please try again.")
        setIsSubmitting(false)
        return
      }

      if (data.session) {
        const { error: profileError } = await supabase.from("profiles").upsert(
          { id: data.user.id, user_type: "donor" },
          { onConflict: "id", ignoreDuplicates: true }
        )
        if (profileError) {
          setError(profileError.message)
          setIsSubmitting(false)
          return
        }
      }

      setSignupSuccessKind("donor")
      setSignupSuccess(true)
      setIsSubmitting(false)
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleSignUpLab = async (e) => {
    e.preventDefault()
    setError(null)
    setSignupSuccess(false)
    if (!hasSupabaseEnv()) {
      setError(
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      )
      return
    }
    setIsSubmitting(true)
    try {
      const slug = slugifyLabSlug(labName)
      const supabase = createClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            user_type: "lab",
            lab_name: labName.trim(),
            lab_slug: slug,
            institution: institution.trim(),
            location: location.trim(),
            research_focus: researchFocus.trim(),
          },
        },
      })
      if (signUpError) {
        setError(signUpError.message)
        setIsSubmitting(false)
        return
      }
      if (!data.user) {
        setError("Could not create account. Please try again.")
        setIsSubmitting(false)
        return
      }

      if (data.session) {
        const { error: profileError } = await supabase.from("profiles").upsert(
          { id: data.user.id, user_type: "lab" },
          { onConflict: "id", ignoreDuplicates: true }
        )
        if (profileError) {
          setError(profileError.message)
          setIsSubmitting(false)
          return
        }

        const { error: labError } = await supabase.from("labs").upsert(
          {
            owner_id: data.user.id,
            slug,
            name: labName.trim(),
            institution: institution.trim() || null,
            location: location.trim() || null,
            research_focus: researchFocus.trim() || null,
            status: "pending",
            is_published: false,
          },
          { onConflict: "slug", ignoreDuplicates: true }
        )
        if (labError) {
          setError(labError.message)
          setIsSubmitting(false)
          return
        }

        const { data: labRow } = await supabase
          .from("labs")
          .select("id")
          .eq("slug", slug)
          .single()

        if (labRow?.id) {
          const { error: mgrError } = await supabase.from("lab_managers").upsert(
            { lab_id: labRow.id, user_id: data.user.id },
            { onConflict: "lab_id,user_id", ignoreDuplicates: true }
          )
          if (mgrError) {
            setError(mgrError.message)
            setIsSubmitting(false)
            return
          }
        }
      }

      setSignupSuccessKind("lab")
      setSignupSuccess(true)
      setIsSubmitting(false)
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.")
      setIsSubmitting(false)
    }
  }

  const cardMaxClass =
    mode === "sign-up" && signupStep === "lab"
      ? "max-w-lg"
      : "max-w-md"

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <div
        className={cn(
          "w-full space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm",
          cardMaxClass
        )}
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-rose-600">
            Welcome to AWARE
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in or create an account to continue.
          </p>
        </div>

        <Tabs value={mode} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Sign in</TabsTrigger>
            <TabsTrigger value="sign-up">Create account</TabsTrigger>
          </TabsList>

          <TabsContent value="sign-in" className="space-y-4 pt-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sign-in-email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="sign-in-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sign-in-password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="sign-in-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-rose-600" role="alert">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="sign-up" className="space-y-4 pt-6">
            {signupStep === "choose" && !signupSuccess && (
              <div className="space-y-4">
                <p className="text-center text-sm text-muted-foreground">
                  How will you use AWARE?
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto flex-col gap-1 border-border py-5 text-center hover:border-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    onClick={() => {
                      setSignupStep("donor")
                      setError(null)
                    }}
                  >
                    <span className="text-sm font-semibold">I am a Donor</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      Support research with donations
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto flex-col gap-1 border-border py-5 text-center hover:border-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    onClick={() => {
                      setSignupStep("lab")
                      setError(null)
                    }}
                  >
                    <span className="text-sm font-semibold">I am a Lab</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      Apply to list your research
                    </span>
                  </Button>
                </div>
              </div>
            )}

            {signupStep === "donor" && !signupSuccess && (
              <form onSubmit={handleSignUpDonor} className="space-y-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="-mt-1 -ml-2 h-8 px-2 text-muted-foreground hover:text-rose-600"
                  onClick={() => {
                    setSignupStep("choose")
                    setError(null)
                  }}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" aria-hidden />
                  Back
                </Button>
                <div className="space-y-2">
                  <Label htmlFor="donor-email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="donor-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donor-password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="donor-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-rose-600" role="alert">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
              </form>
            )}

            {signupStep === "lab" && !signupSuccess && (
              <form onSubmit={handleSignUpLab} className="space-y-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="-mt-1 -ml-2 h-8 px-2 text-muted-foreground hover:text-rose-600"
                  onClick={() => {
                    setSignupStep("choose")
                    setError(null)
                  }}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" aria-hidden />
                  Back
                </Button>
                <div className="space-y-2">
                  <Label htmlFor="lab-email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="lab-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lab-password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="lab-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lab-name" className="text-sm font-medium">
                    Lab name
                  </Label>
                  <Input
                    id="lab-name"
                    value={labName}
                    onChange={(e) => setLabName(e.target.value)}
                    placeholder="e.g. Verhaak Brain Cancer Lab"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lab-institution" className="text-sm font-medium">
                    Institution
                  </Label>
                  <Input
                    id="lab-institution"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. Yale University"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lab-location" className="text-sm font-medium">
                    Location
                  </Label>
                  <Input
                    id="lab-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New Haven, CT"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lab-focus" className="text-sm font-medium">
                    Research focus
                  </Label>
                  <Textarea
                    id="lab-focus"
                    value={researchFocus}
                    onChange={(e) => setResearchFocus(e.target.value)}
                    placeholder="Briefly describe your research focus"
                    required
                    className="min-h-[100px]"
                  />
                </div>
                {error && (
                  <p className="text-sm text-rose-600" role="alert">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting application..." : "Submit application"}
                </Button>
              </form>
            )}

            {signupSuccess && (
              <div
                className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800"
                role="status"
              >
                {signupSuccessKind === "lab"
                  ? "Your application is under review. We will notify you when you are approved."
                  : "Check your email to confirm your account."}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/" className="text-rose-600 hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
