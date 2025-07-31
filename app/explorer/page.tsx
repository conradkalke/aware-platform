"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Video, Microscope, GraduationCap, Clock, CheckCircle2, Calendar } from 'lucide-react'

export default function ExplorerPage() {
  const [subscribedLabs, setSubscribedLabs] = useState<string[]>([])

  const toggleSubscription = (labId: string) => {
    setSubscribedLabs(prev => 
      prev.includes(labId) 
        ? prev.filter(id => id !== labId)
        : [...prev, labId]
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-rose-600">Student Explorer</h1>
          <p className="text-muted-foreground">
            Learn directly from scientists and follow cutting-edge research
          </p>
        </div>
      </div>

      <Tabs defaultValue="featured" className="mt-6">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="featured">Featured Content</TabsTrigger>
          <TabsTrigger value="subscriptions">My Subscriptions</TabsTrigger>
          <TabsTrigger value="labs">Labs to Follow</TabsTrigger>
        </TabsList>
        <TabsContent value="featured" className="mt-6 space-y-8">
          <section>
            <h2 className="text-2xl font-bold">This Week's Lessons</h2>
            <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {lessons.slice(0, 3).map((lesson) => (
                <Card key={lesson.id}>
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <Image
                      src={lesson.image || "/placeholder.svg"}
                      alt={lesson.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <Badge className="bg-rose-600 hover:bg-rose-700">
                        {lesson.level}
                      </Badge>
                      <Badge variant="outline" className="bg-black/50 text-white border-none">
                        {lesson.duration} min
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{lesson.lab}</span>
                      <span>•</span>
                      <span>{lesson.date}</span>
                    </div>
                    <CardTitle>{lesson.title}</CardTitle>
                    <CardDescription>{lesson.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full bg-rose-600 hover:bg-rose-700">
                      {lesson.type === "video" ? (
                        <Video className="mr-2 h-4 w-4" />
                      ) : (
                        <BookOpen className="mr-2 h-4 w-4" />
                      )}
                      Start Lesson
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">Upcoming Live Q&As</h2>
            <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-rose-50 text-rose-600 hover:bg-rose-50">
                        <Calendar className="mr-1 h-3 w-3" />
                        {event.date}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{event.time}</span>
                    </div>
                    <CardTitle className="mt-2">{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full">
                        <Image
                          src={`/placeholder.svg?height=100&width=100&query=portrait of ${event.speaker.role}`}
                          alt={event.speaker.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{event.speaker.name}</p>
                        <p className="text-sm text-muted-foreground">{event.speaker.role}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Set Reminder
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">Career Spotlights</h2>
            <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {careers.map((career) => (
                <Card key={career.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-full">
                        <Image
                          src={`/placeholder.svg?height=100&width=100&query=portrait of ${career.role}`}
                          alt={career.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle>{career.name}</CardTitle>
                        <CardDescription>{career.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{career.description}</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-md bg-muted p-2">
                        <p className="text-xs font-medium">Education</p>
                        <p className="text-sm">{career.education}</p>
                      </div>
                      <div className="rounded-md bg-muted p-2">
                        <p className="text-xs font-medium">Experience</p>
                        <p className="text-sm">{career.experience}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Read Full Interview
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-6">
          {subscribedLabs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {labs
                .filter(lab => subscribedLabs.includes(lab.id))
                .map(lab => (
                  <Card key={lab.id}>
                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                      <Image
                        src={lab.image || "/placeholder.svg"}
                        alt={lab.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-3 right-3">
                        <Badge className="bg-green-600 hover:bg-green-700">
                          Subscribed
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{lab.name}</CardTitle>
                      </div>
                      <CardDescription>{lab.institution}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Next lesson:</span>
                          <span>Tomorrow, 4:00 PM</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Completed:</span>
                          <span>2 of 5 lessons</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-rose-600"
                            style={{ width: "40%" }}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        View Lessons
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleSubscription(lab.id)}
                      >
                        Unsubscribe
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border bg-background p-8 text-center">
              <GraduationCap className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-medium">No Subscriptions Yet</h3>
              <p className="mt-2 text-muted-foreground">
                Subscribe to labs to receive weekly lessons and participate in Q&A sessions.
              </p>
              <Button 
                className="mt-4 bg-rose-600 hover:bg-rose-700"
                onClick={() => document.querySelector('[data-value="labs"]')?.click()}
              >
                Explore Labs
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="labs" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {labs.map((lab) => (
              <Card key={lab.id}>
                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                  <Image
                    src={lab.image || "/placeholder.svg"}
                    alt={lab.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{lab.name}</CardTitle>
                  </div>
                  <CardDescription>{lab.institution}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{lab.description}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{lab.lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <span>{lab.videos} videos</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${
                      subscribedLabs.includes(lab.id)
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-rose-600 hover:bg-rose-700"
                    }`}
                    onClick={() => toggleSubscription(lab.id)}
                  >
                    {subscribedLabs.includes(lab.id) ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Subscribed
                      </>
                    ) : (
                      <>
                        <GraduationCap className="mr-2 h-4 w-4" />
                        Subscribe
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

const lessons = [
  {
    id: "lesson1",
    title: "Introduction to Protein Misfolding",
    description: "Learn the basics of how proteins fold and what happens when they misfold in diseases like Alzheimer's.",
    lab: "Neurodegeneration Research Lab",
    image: "/placeholder.svg?height=400&width=600",
    level: "Beginner",
    duration: 15,
    type: "video",
    date: "2 days ago"
  },
  {
    id: "lesson2",
    title: "Understanding Cancer Genomics",
    description: "Explore how genetic mutations lead to cancer and how we can target them with precision medicine.",
    lab: "Precision Oncology Lab",
    image: "/placeholder.svg?height=400&width=600",
    level: "Intermediate",
    duration: 20,
    type: "article",
    date: "1 week ago"
  },
  {
    id: "lesson3",
    title: "The Immune System and Autoimmunity",
    description: "Discover how the immune system works and what happens when it attacks the body's own tissues.",
    lab: "Autoimmune Research Lab",
    image: "/placeholder.svg?height=400&width=600",
    level: "Beginner",
    duration: 18,
    type: "video",
    date: "3 days ago"
  }
]

const events = [
  {
    id: "event1",
    title: "Ask Me Anything: Alzheimer's Research",
    description: "Join Dr. Sarah Chen for a live Q&A session about the latest in Alzheimer's research.",
    date: "July 25",
    time: "4:00 PM EST",
    speaker: {
      name: "Dr. Sarah Chen",
      role: "Principal Investigator"
    }
  },
  {
    id: "event2",
    title: "Career Paths in Cancer Research",
    description: "Learn about different career opportunities in the field of cancer research and treatment.",
    date: "July 27",
    time: "2:00 PM EST",
    speaker: {
      name: "Dr. James Wilson",
      role: "Principal Investigator"
    }
  },
  {
    id: "event3",
    title: "Lab Tour: Inside a Genetics Lab",
    description: "Take a virtual tour of our rare genetic disorders lab and see our equipment in action.",
    date: "July 30",
    time: "1:00 PM EST",
    speaker: {
      name: "Dr. Emily Taylor",
      role: "Lab Director"
    }
  }
]

const careers = [
  {
    id: "career1",
    name: "Dr. Sarah Chen",
    role: "Principal Investigator",
    description: "As a PI, I lead a team of researchers, secure funding, and set the direction for our lab's investigations into neurodegenerative diseases.",
    education: "Ph.D. in Neuroscience",
    experience: "15+ years"
  },
  {
    id: "career2",
    name: "Michael Rodriguez",
    role: "Postdoctoral Fellow",
    description: "I conduct independent research projects while developing skills to eventually lead my own lab in computational biology.",
    education: "Ph.D. in Computational Biology",
    experience: "3 years"
  },
  {
    id: "career3",
    name: "Jennifer Kim",
    role: "Graduate Student",
    description: "I'm working on my dissertation research while learning laboratory techniques and scientific communication skills.",
    education: "B.S. in Biology, pursuing Ph.D.",
    experience: "2 years"
  }
]

const labs = [
  {
    id: "neuro-lab",
    name: "Neurodegeneration Research Lab",
    description: "Learn about Alzheimer's disease, protein misfolding, and cutting-edge treatment approaches.",
    institution: "Yale University",
    image: "/placeholder.svg?height=400&width=600",
    lessons: 12,
    videos: 8
  },
  {
    id: "cancer-research",
    name: "Precision Oncology Lab",
    description: "Explore cancer genomics, personalized medicine, and the future of cancer treatment.",
    institution: "Stanford Medical",
    image: "/placeholder.svg?height=400&width=600",
    lessons: 10,
    videos: 6
  },
  {
    id: "rare-disease",
    name: "Rare Genetic Disorders Lab",
    description: "Discover the world of rare diseases, genetic testing, and innovative therapies.",
    institution: "Boston Children's Hospital",
    image: "/placeholder.svg?height=400&width=600",
    lessons: 8,
    videos: 5
  },
  {
    id: "infectious-disease",
    name: "Emerging Infectious Disease Lab",
    description: "Learn about viral pathogens, pandemic preparedness, and vaccine development.",
    institution: "Johns Hopkins",
    image: "/placeholder.svg?height=400&width=600",
    lessons: 14,
    videos: 9
  },
  {
    id: "regenerative-med",
    name: "Regenerative Medicine Lab",
    description: "Explore stem cells, tissue engineering, and the future of organ transplantation.",
    institution: "UCSF",
    image: "/placeholder.svg?height=400&width=600",
    lessons: 9,
    videos: 7
  },
  {
    id: "immunology",
    name: "Autoimmune Research Lab",
    description: "Understand the immune system, autoimmune disorders, and immunotherapy approaches.",
    institution: "Mayo Clinic",
    image: "/placeholder.svg?height=400&width=600",
    lessons: 11,
    videos: 6
  }
]
