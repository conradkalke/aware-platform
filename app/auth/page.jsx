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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ChevronLeft, Heart, Microscope } from "lucide-react"

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

/** Postgres unique_violation — row may already exist from the auth trigger */
function isDuplicateKeyError(error) {
  return error?.code === "23505"
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

      if (signInData.session) {
        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: signInData.session.access_token,
          refresh_token: signInData.session.refresh_token,
        })
        console.log("[sign-in] setSession after signInWithPassword", {
          userId: signInData.user.id,
          error: setSessionError?.message ?? null,
        })
      }

      const { data: sessionCheck } = await supabase.auth.getSession()
      console.log("[sign-in] getSession before profiles fetch", {
        hasSession: Boolean(sessionCheck.session),
        sessionUserId: sessionCheck.session?.user?.id ?? null,
      })

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", signInData.user.id)
        .maybeSingle()

      const rawUserType = profile?.user_type
      const normalizedUserType =
        typeof rawUserType === "string"
          ? rawUserType.trim().toLowerCase()
          : null

      console.log("[sign-in] profiles row from Supabase", {
        userId: signInData.user.id,
        profileRow: profile ?? null,
        rawUserType: rawUserType ?? null,
        normalizedUserType,
        profileError: profileError
          ? {
              message: profileError.message,
              code: profileError.code,
              details: profileError.details,
            }
          : null,
      })

      const destination =
        normalizedUserType === "lab"
          ? "/dashboard/lab"
          : "/dashboard/donor"

      console.log("[sign-in] redirect", { destination })

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
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          user_type: "donor",
        })
        if (profileError && !isDuplicateKeyError(profileError)) {
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
      console.log("[lab signup] 1 start", {
        slug,
        labName: labName.trim(),
        email: email.trim(),
      })

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

      console.log("[lab signup] 2 signUp response", {
        userId: data?.user?.id ?? null,
        hasSessionFromResponse: Boolean(data?.session),
        signUpError: signUpError?.message ?? null,
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
        console.log("[lab signup] 3 applying session to client (setSession)")
        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        })
        console.log("[lab signup] 4 setSession result", {
          error: setSessionError?.message ?? null,
        })
      } else {
        console.log(
          "[lab signup] 3 no session on signUp response (often email confirmation required)"
        )
      }

      let activeSession = null
      for (let attempt = 0; attempt < 5; attempt++) {
        const { data: sessionData, error: getSessionError } =
          await supabase.auth.getSession()
        activeSession = sessionData.session
        console.log("[lab signup] 5 getSession attempt", {
          attempt,
          hasSession: Boolean(activeSession),
          userId: activeSession?.user?.id ?? null,
          getSessionError: getSessionError?.message ?? null,
        })
        if (activeSession?.user?.id === data.user.id) break
        await new Promise((r) => setTimeout(r, 120))
      }

      if (!activeSession || activeSession.user?.id !== data.user.id) {
        console.warn(
          "[lab signup] 6 skip client DB writes — no authenticated session for new user. Profile/lab should be created by the handle_new_user_profile_lab trigger on auth.users; apply migrations (including labs_select_if_owner) if rows are missing."
        )
        setSignupSuccessKind("lab")
        setSignupSuccess(true)
        setIsSubmitting(false)
        return
      }

      console.log("[lab signup] 6 inserting profiles row")
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        user_type: "lab",
      })
      console.log("[lab signup] 7 profiles insert", {
        error: profileError
          ? {
              message: profileError.message,
              code: profileError.code,
              details: profileError.details,
              hint: profileError.hint,
            }
          : null,
        duplicateIgnored: Boolean(
          profileError && isDuplicateKeyError(profileError)
        ),
      })
      if (profileError && !isDuplicateKeyError(profileError)) {
        setError(profileError.message)
        setIsSubmitting(false)
        return
      }

      const labPayload = {
        created_by: data.user.id,
        slug,
        name: labName.trim(),
        institution: institution.trim() || null,
        location: location.trim() || null,
        research_focus: researchFocus.trim() || null,
        status: "pending",
        is_published: false,
      }
      console.log("[lab signup] 8 inserting labs row", { slug, labPayload })

      const { error: labError } = await supabase.from("labs").insert(labPayload)
      console.log("[lab signup] 9 labs insert", {
        error: labError
          ? {
              message: labError.message,
              code: labError.code,
              details: labError.details,
              hint: labError.hint,
            }
          : null,
        duplicateIgnored: Boolean(labError && isDuplicateKeyError(labError)),
      })
      if (labError && !isDuplicateKeyError(labError)) {
        setError(labError.message)
        setIsSubmitting(false)
        return
      }

      console.log("[lab signup] 10 selecting lab by slug for lab_managers")
      const { data: labRow, error: labSelectError } = await supabase
        .from("labs")
        .select("id")
        .eq("slug", slug)
        .maybeSingle()
      console.log("[lab signup] 11 lab select", {
        labId: labRow?.id ?? null,
        error: labSelectError
          ? {
              message: labSelectError.message,
              code: labSelectError.code,
            }
          : null,
      })

      if (labRow?.id) {
        console.log("[lab signup] 12 inserting lab_managers row")
        const { error: mgrError } = await supabase
          .from("lab_managers")
          .insert({ lab_id: labRow.id, user_id: data.user.id })
        console.log("[lab signup] 13 lab_managers insert", {
          error: mgrError
            ? {
                message: mgrError.message,
                code: mgrError.code,
                details: mgrError.details,
              }
            : null,
          duplicateIgnored: Boolean(
            mgrError && isDuplicateKeyError(mgrError)
          ),
        })
        if (mgrError && !isDuplicateKeyError(mgrError)) {
          setError(mgrError.message)
          setIsSubmitting(false)
          return
        }
      } else {
        console.warn(
          "[lab signup] 12 skipped lab_managers — no lab id (check RLS: labs_select_if_owner migration must be applied)"
        )
      }

      console.log("[lab signup] 14 done")
      setSignupSuccessKind("lab")
      setSignupSuccess(true)
      setIsSubmitting(false)
    } catch (err) {
      console.error("[lab signup] catch", err)
      setError(err?.message || "Something went wrong. Please try again.")
      setIsSubmitting(false)
    }
  }

  const cardMaxClass =
    mode === "sign-up" && signupStep === "lab"
      ? "max-w-lg"
      : "max-w-md"

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <div className="text-center space-y-4 mb-10 md:mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-rose-600 sm:text-5xl">
            Welcome to AWARE
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 md:text-xl">
            Sign in or create an account to explore labs, donate, or list your
            research.
          </p>
        </div>

        <Card
          className={cn(
            "mx-auto w-full shadow-md border bg-white",
            cardMaxClass
          )}
        >
          <CardHeader className="space-y-2 pb-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-rose-600">
              {mode === "sign-in" ? "Sign in" : "Create an account"}
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              {mode === "sign-in"
                ? "Use the email and password for your AWARE account."
                : "Choose donor signup or submit a lab application — same transparency as the rest of the platform."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs value={mode} onValueChange={handleTabChange}>
              <TabsList className="grid h-11 w-full grid-cols-2 rounded-lg bg-gray-100 p-1">
                <TabsTrigger
                  value="sign-in"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm data-[state=active]:font-semibold"
                >
                  Sign in
                </TabsTrigger>
                <TabsTrigger
                  value="sign-up"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm data-[state=active]:font-semibold"
                >
                  Create account
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sign-in" className="mt-6 space-y-0">
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="sign-in-email">Email</Label>
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
                    <Label htmlFor="sign-in-password">Password</Label>
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
                    <p
                      className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700"
                      role="alert"
                    >
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

              <TabsContent value="sign-up" className="mt-6 space-y-0">
                {signupStep === "choose" && !signupSuccess && (
                  <div className="space-y-6">
                    <p className="text-center text-base text-gray-600">
                      How will you use AWARE?
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-auto flex-col gap-3 rounded-lg border bg-white py-6 text-center shadow-sm transition-all hover:border-rose-600 hover:bg-rose-50 hover:shadow-md hover:text-rose-800"
                        onClick={() => {
                          setSignupStep("donor")
                          setError(null)
                        }}
                      >
                        <div className="rounded-full bg-rose-100 p-3">
                          <Heart className="h-6 w-6 text-rose-600" />
                        </div>
                        <span className="text-base font-bold">
                          I am a Donor
                        </span>
                        <span className="text-sm font-normal text-gray-500">
                          Support research with donations
                        </span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-auto flex-col gap-3 rounded-lg border bg-white py-6 text-center shadow-sm transition-all hover:border-rose-600 hover:bg-rose-50 hover:shadow-md hover:text-rose-800"
                        onClick={() => {
                          setSignupStep("lab")
                          setError(null)
                        }}
                      >
                        <div className="rounded-full bg-rose-100 p-3">
                          <Microscope className="h-6 w-6 text-rose-600" />
                        </div>
                        <span className="text-base font-bold">I am a Lab</span>
                        <span className="text-sm font-normal text-gray-500">
                          Apply to list your research
                        </span>
                      </Button>
                    </div>
                  </div>
                )}

                {signupStep === "donor" && !signupSuccess && (
                  <form onSubmit={handleSignUpDonor} className="space-y-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="-ml-2 h-8 px-2 text-gray-500 hover:bg-rose-50 hover:text-rose-600"
                      onClick={() => {
                        setSignupStep("choose")
                        setError(null)
                      }}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" aria-hidden />
                      Back
                    </Button>
                    <div className="space-y-2">
                      <Label htmlFor="donor-email">Email</Label>
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
                      <Label htmlFor="donor-password">Password</Label>
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
                      <p
                        className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700"
                        role="alert"
                      >
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
                  <form onSubmit={handleSignUpLab} className="space-y-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="-ml-2 h-8 px-2 text-gray-500 hover:bg-rose-50 hover:text-rose-600"
                      onClick={() => {
                        setSignupStep("choose")
                        setError(null)
                      }}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" aria-hidden />
                      Back
                    </Button>
                    <div className="space-y-2">
                      <Label htmlFor="lab-email">Email</Label>
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
                      <Label htmlFor="lab-password">Password</Label>
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
                      <Label htmlFor="lab-name">Lab name</Label>
                      <Input
                        id="lab-name"
                        value={labName}
                        onChange={(e) => setLabName(e.target.value)}
                        placeholder="e.g. Verhaak Brain Cancer Lab"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lab-institution">Institution</Label>
                      <Input
                        id="lab-institution"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="e.g. Yale University"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lab-location">Location</Label>
                      <Input
                        id="lab-location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. New Haven, CT"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lab-focus">Research focus</Label>
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
                      <p
                        className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700"
                        role="alert"
                      >
                        {error}
                      </p>
                    )}
                    <Button
                      type="submit"
                      className="w-full bg-rose-600 hover:bg-rose-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Submitting application..."
                        : "Submit application"}
                    </Button>
                  </form>
                )}

                {signupSuccess && (
                  <div
                    className="rounded-lg border border-green-200 bg-green-50 p-4 text-center text-sm text-green-800 shadow-sm"
                    role="status"
                  >
                    {signupSuccessKind === "lab"
                      ? "Your application is under review. We will notify you when you are approved."
                      : "Check your email to confirm your account."}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col border-t bg-gray-50/80 pt-6">
            <p className="text-center text-sm text-gray-500">
              <Link
                href="/"
                className="font-medium text-rose-600 hover:underline"
              >
                Back to home
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
