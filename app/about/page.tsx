import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
export const metadata = {
  title: 'About — AWARE',
  description: 'AWARE connects supporters directly with medical research labs through transparent funding and storytelling.'
}
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
              AWARE connects medical researchers with people who want to support their work. We make it easy for anyone to donate directly to research projects they care about.
            </p>
            <p className="text-muted-foreground">
              Instead of complex funding systems, we create direct connections between researchers and supporters, making research funding simple and transparent.
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
                We believe in making science accessible to everyone.
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



      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-rose-600">Founder</h2>
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
        <div className="grid gap-8 md:grid-cols-2">
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
    name: "Conrad Kalke",
    role: "Founder & CEO",
    bio: "After seeing vital medical research slowed by funding shortages, I set out to help close the gap. My goal is to connect people directly with the scientists working to save lives."
  }
] 