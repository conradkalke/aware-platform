"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageSquare, Share2, BookOpen, Video, Microscope } from 'lucide-react'

export default function FeedPage() {
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({})

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-rose-600">Stories & Updates</h1>
          <p className="text-muted-foreground">
            Discover the latest from research labs around the world
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="educational">Educational</TabsTrigger>
          <TabsTrigger value="personal">Personal Stories</TabsTrigger>
          <TabsTrigger value="updates">Project Updates</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <FeedCard 
                key={post.id} 
                post={post} 
                isLiked={!!likedPosts[post.id]} 
                onLike={() => toggleLike(post.id)} 
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="educational" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts
              .filter(post => post.type === "educational")
              .map((post) => (
                <FeedCard 
                  key={post.id} 
                  post={post} 
                  isLiked={!!likedPosts[post.id]} 
                  onLike={() => toggleLike(post.id)} 
                />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="personal" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts
              .filter(post => post.type === "personal")
              .map((post) => (
                <FeedCard 
                  key={post.id} 
                  post={post} 
                  isLiked={!!likedPosts[post.id]} 
                  onLike={() => toggleLike(post.id)} 
                />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="updates" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts
              .filter(post => post.type === "update")
              .map((post) => (
                <FeedCard 
                  key={post.id} 
                  post={post} 
                  isLiked={!!likedPosts[post.id]} 
                  onLike={() => toggleLike(post.id)} 
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface Post {
  id: string
  lab: {
    id: string
    name: string
    institution: string
  }
  title: string
  content: string
  image: string
  type: "educational" | "personal" | "update"
  likes: number
  comments: number
  date: string
}

interface FeedCardProps {
  post: Post
  isLiked: boolean
  onLike: () => void
}

function FeedCard({ post, isLiked, onLike }: FeedCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <div className="relative">
        <Image
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          width={600}
          height={400}
          className="aspect-video w-full object-cover"
        />
        <div className="absolute top-2 right-2 rounded-full bg-background/80 p-1 backdrop-blur">
          {post.type === "educational" ? (
            <BookOpen className="h-4 w-4 text-rose-600" />
          ) : post.type === "update" ? (
            <Microscope className="h-4 w-4 text-rose-600" />
          ) : (
            <Video className="h-4 w-4 text-rose-600" />
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{post.lab.name}</span>
          <span>•</span>
          <span>{post.date}</span>
        </div>
        <h3 className="mt-2 font-semibold">{post.title}</h3>
        <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
          {post.content}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onLike}
              className="flex items-center gap-1 text-sm"
            >
              <Heart 
                className={`h-4 w-4 ${isLiked ? 'fill-rose-600 text-rose-600' : 'text-muted-foreground'}`} 
              />
              <span>{isLiked ? post.likes + 1 : post.likes}</span>
            </button>
            <button className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments}</span>
            </button>
          </div>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

const posts: Post[] = [
  {
    id: "post1",
    lab: {
      id: "neuro-lab",
      name: "Neurodegeneration Research Lab",
      institution: "Yale University"
    },
    title: "How Proteins Misfold in Alzheimer's Disease",
    content: "In this educational video, we explain the basic mechanisms of protein misfolding in Alzheimer's disease. Understanding this process is crucial for developing effective treatments that can target the root cause of neurodegeneration.",
    image: "/placeholder.svg?height=400&width=600",
    type: "educational",
    likes: 45,
    comments: 12,
    date: "2 days ago"
  },
  {
    id: "post2",
    lab: {
      id: "cancer-research",
      name: "Precision Oncology Lab",
      institution: "Stanford Medical"
    },
    title: "A Day in the Life of a Cancer Researcher",
    content: "Follow Dr. Aisha Johnson as she takes you through her typical day in our lab. From morning meetings to afternoon experiments, get a behind-the-scenes look at what cancer research really involves.",
    image: "/placeholder.svg?height=400&width=600",
    type: "personal",
    likes: 78,
    comments: 23,
    date: "1 week ago"
  },
  {
    id: "post3",
    lab: {
      id: "rare-disease",
      name: "Rare Genetic Disorders Lab",
      institution: "Boston Children's Hospital"
    },
    title: "Breakthrough in Gene Therapy for Rare Disorders",
    content: "We're excited to announce a significant breakthrough in our gene therapy research. Our team has successfully developed a new delivery method that shows promising results in preclinical studies for treating a rare genetic disorder affecting children.",
    image: "/placeholder.svg?height=400&width=600",
    type: "update",
    likes: 132,
    comments: 45,
    date: "3 days ago"
  },
  {
    id: "post4",
    lab: {
      id: "infectious-disease",
      name: "Emerging Infectious Disease Lab",
      institution: "Johns Hopkins"
    },
    title: "Understanding Viral Mutations: A Simple Guide",
    content: "In this educational post, we break down how viruses mutate and what that means for vaccine development. Using simple analogies and clear visuals, we explain complex concepts in a way anyone can understand.",
    image: "/placeholder.svg?height=400&width=600",
    type: "educational",
    likes: 67,
    comments: 19,
    date: "5 days ago"
  },
  {
    id: "post5",
    lab: {
      id: "regenerative-med",
      name: "Regenerative Medicine Lab",
      institution: "UCSF"
    },
    title: "Meet the Patient: Sarah's Story",
    content: "Sarah was diagnosed with a degenerative muscle condition at age 12. Now 25, she shares her journey and why she's hopeful about our stem cell research. This personal story highlights the real impact of medical research on people's lives.",
    image: "/placeholder.svg?height=400&width=600",
    type: "personal",
    likes: 215,
    comments: 87,
    date: "1 day ago"
  },
  {
    id: "post6",
    lab: {
      id: "immunology",
      name: "Autoimmune Research Lab",
      institution: "Mayo Clinic"
    },
    title: "New Equipment Arrival Thanks to Your Support",
    content: "Thanks to your generous donations, we've been able to purchase a state-of-the-art flow cytometer! This equipment will dramatically accelerate our research into autoimmune disorders. See it being installed and learn how it works.",
    image: "/placeholder.svg?height=400&width=600",
    type: "update",
    likes: 93,
    comments: 31,
    date: "4 days ago"
  }
]
