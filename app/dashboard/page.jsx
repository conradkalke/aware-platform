import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-rose-600 md:text-4xl">
        Dashboard
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        You&apos;re signed in. This is your AWARE dashboard.
      </p>
      <p className="mt-6 text-sm text-muted-foreground">
        <Link href="/labs" className="text-rose-600 hover:underline">
          Explore labs
        </Link>
        {" · "}
        <Link href="/" className="text-rose-600 hover:underline">
          Home
        </Link>
      </p>
    </div>
  )
}
