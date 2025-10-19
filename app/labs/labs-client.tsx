"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from 'lucide-react'
import { listLabs } from "@/lib/labs"

export function LabsPageClient() {
  const [searchTerm, setSearchTerm] = useState("")
  const labs = listLabs()

  const filteredLabs = labs.filter(lab =>
    lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.institution.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-rose-600">Explore Labs</h1>
          <p className="text-muted-foreground">
            Discover and support innovative medical research labs
          </p>
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search labs..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredLabs.map((lab) => (
          <Link key={lab.id} href={`/labs/${lab.id}`} className="group">
            <div className="overflow-hidden rounded-lg border bg-background transition-colors hover:bg-accent/50">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={lab.image || "/placeholder.svg"}
                  alt={lab.name}
                  width={600}
                  height={400}
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {lab.institution && (
                  <div className="absolute bottom-2 right-2 rounded-md bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur">
                    {lab.institution}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{lab.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {lab.description}
                </p>
                <div className="mt-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-rose-600"
                      style={{ width: `${lab.progress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span>${lab.raised.toLocaleString()}</span>
                    <span className="font-medium">${lab.goal.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{lab.supporters} supporters</span>
                  <span>•</span>
                  <span>{lab.updates} updates</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
