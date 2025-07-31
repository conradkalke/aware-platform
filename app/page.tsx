import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Microscope, Heart, BookOpen, Users, BarChart3 } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-rose-600">
                  AWARE
                </h1>
                <p className="text-xl text-gray-500 md:text-2xl">
                  Reimagining Medical Research Funding Through Transparency and Storytelling
                </p>
                <p className="text-gray-500 md:text-xl">
                  Giving every medical research lab—no matter how small—a voice, visibility, and the public support it needs to push science forward.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-700">
                  <Link href="/labs">
                    Explore Labs
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/about">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
            <Image
              src="/placeholder.svg?height=550&width=550"
              width={550}
              height={550}
              alt="Medical researchers in a laboratory"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-rose-600">The Problem</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                <span className="font-semibold">"Only 1 in 10 grant applications are funded… now it's more like 1 in 20."</span>
              </p>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Labs can't grow, hire, or innovate without sustainable support. The public doesn't understand how science gets funded, and existing platforms aren't designed for scientific research.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-rose-100 p-3">
                <BarChart3 className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold">Shrinking Grants</h3>
              <p className="text-center text-gray-500">
                Government funding for research is becoming increasingly restricted and competitive.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-rose-100 p-3">
                <Users className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold">Disconnected Public</h3>
              <p className="text-center text-gray-500">
                The general public is disconnected from the scientific process and uninformed about research needs.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-rose-100 p-3">
                <Heart className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold">Inadequate Platforms</h3>
              <p className="text-center text-gray-500">
                Current donation platforms aren't designed for scientific labs and their unique needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-rose-600">The Solution</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                AWARE is a funding and engagement platform tailored for science with direct support, milestone-based donations, and public storytelling.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <Image
              src="/placeholder.svg?height=400&width=600"
              width={600}
              height={400}
              alt="Scientist explaining research to donors"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
            />
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-rose-100 p-2">
                  <Microscope className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Lab Profiles</h3>
                  <p className="text-gray-500">
                    Detailed profiles with research focus, funding goals, and transparent milestones.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-rose-100 p-2">
                  <Heart className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Milestone-Based Donations</h3>
                  <p className="text-gray-500">
                    Fund specific stages of research with clear visibility into progress.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-rose-100 p-2">
                  <BookOpen className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Education Integration</h3>
                  <p className="text-gray-500">
                    Students subscribe to labs for micro-lessons and career insights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-rose-600">How It Works</h2>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="rounded-full bg-rose-100 p-4">
                <Microscope className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold">For Labs</h3>
              <p className="text-gray-500">
                Sign up, set up milestones, share your story, and receive transparent funding.
              </p>
              <Button asChild variant="outline" className="mt-2">
                <Link href="/for-labs">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="rounded-full bg-rose-100 p-4">
                <Heart className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold">For Donors</h3>
              <p className="text-gray-500">
                Find causes you care about, follow labs, and make small or recurring donations.
              </p>
              <Button asChild variant="outline" className="mt-2">
                <Link href="/for-donors">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="rounded-full bg-rose-100 p-4">
                <BookOpen className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold">For Students</h3>
              <p className="text-gray-500">
                Get educated, follow research progress, and become future donors or researchers.
              </p>
              <Button asChild variant="outline" className="mt-2">
                <Link href="/for-students">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-rose-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-rose-600">
                Join the Movement
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We're building something that science desperately needs—and it starts now.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-700">
                <Link href="/labs">
                  Explore Labs
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
