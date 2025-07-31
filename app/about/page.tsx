import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Heart, BookOpen, Award, Globe, Shield, TrendingUp } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container py-8 md:py-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-rose-600 sm:text-5xl">
          About AWARE
        </h1>
        <p className="max-w-3xl mx-auto text-xl text-muted-foreground">
          We're reimagining medical research funding through transparency, storytelling, and direct connection between labs and supporters.
        </p>
      </div>

      {/* Mission Section */}
      <section className="mb-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-rose-600">Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              AWARE exists to bridge the gap between medical research and public support. We believe that every breakthrough, no matter how small, deserves a chance to flourish.
            </p>
            <p className="text-muted-foreground">
              By connecting labs directly with donors, students, and the public, we're creating a new model for research funding that's transparent, engaging, and effective.
            </p>
            <div className="flex gap-4">
              <Button asChild className="bg-rose-600 hover:bg-rose-700">
                <Link href="/labs">Explore Labs</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Medical researchers collaborating"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-rose-600">Our Values</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto rounded-full bg-rose-100 p-3 w-fit">
                <Target className="h-6 w-6 text-rose-600" />
              </div>
              <CardTitle>Transparency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Every dollar is tracked and reported, so you know exactly how your support is making a difference.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto rounded-full bg-rose-100 p-3 w-fit">
                <Heart className="h-6 w-6 text-rose-600" />
              </div>
              <CardTitle>Connection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Direct relationships between labs and supporters create meaningful impact and lasting change.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto rounded-full bg-rose-100 p-3 w-fit">
                <BookOpen className="h-6 w-6 text-rose-600" />
              </div>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                We believe in making science accessible to everyone, from students to lifelong learners.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto rounded-full bg-rose-100 p-3 w-fit">
                <TrendingUp className="h-6 w-6 text-rose-600" />
              </div>
              <CardTitle>Innovation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Supporting cutting-edge research that pushes the boundaries of what's possible in medicine.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Impact Section */}
      <section className="mb-16">
        <div className="rounded-lg bg-rose-50 p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-rose-600">Our Impact</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-rose-600 mb-2">$2.3M</div>
              <p className="text-muted-foreground">Raised for research</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-rose-600 mb-2">156</div>
              <p className="text-muted-foreground">Labs supported</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-rose-600 mb-2">12,450</div>
              <p className="text-muted-foreground">Active supporters</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-rose-600">Our Team</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <Card key={member.name}>
              <CardHeader className="text-center">
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full">
                  <Image
                    src={`/placeholder.svg?height=100&width=100&query=portrait of ${member.name}`}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardTitle>{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  {member.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-rose-600">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center space-y-4">
            <div className="mx-auto rounded-full bg-rose-100 p-4 w-fit">
              <Users className="h-8 w-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold">For Labs</h3>
            <p className="text-muted-foreground">
              Create detailed profiles, set funding goals, and share your research story with the world.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="mx-auto rounded-full bg-rose-100 p-4 w-fit">
              <Heart className="h-8 w-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold">For Donors</h3>
            <p className="text-muted-foreground">
              Find causes you care about, follow progress, and make transparent donations with real impact.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="mx-auto rounded-full bg-rose-100 p-4 w-fit">
              <BookOpen className="h-8 w-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold">For Students</h3>
            <p className="text-muted-foreground">
              Learn directly from researchers, get career insights, and become part of the scientific community.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 rounded-lg bg-rose-50 p-8">
        <h2 className="text-3xl font-bold text-rose-600">Join the Movement</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We're building something that science desperately needs—and it starts with you.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-700">
            <Link href="/labs">Explore Labs</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

const team = [
  {
    name: "Dr. Sarah Johnson",
    role: "CEO & Co-Founder",
    bio: "Former research scientist with 15 years in academic medicine. Passionate about democratizing research funding."
  },
  {
    name: "Michael Chen",
    role: "CTO & Co-Founder",
    bio: "Tech entrepreneur with expertise in building platforms that connect communities and drive impact."
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Head of Research Relations",
    bio: "Ph.D. in biomedical sciences with experience helping labs navigate funding challenges and public engagement."
  },
  {
    name: "David Kim",
    role: "Head of Product",
    bio: "Product leader focused on creating intuitive experiences that make science accessible to everyone."
  },
  {
    name: "Lisa Thompson",
    role: "Head of Community",
    bio: "Community builder with experience growing engaged audiences around meaningful causes and education."
  },
  {
    name: "Dr. James Wilson",
    role: "Scientific Advisor",
    bio: "Distinguished professor and researcher who provides guidance on scientific integrity and research standards."
  }
] 