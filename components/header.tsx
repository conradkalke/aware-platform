"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Microscope, Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
          <Link href="/feed" className="text-sm font-medium hover:text-rose-600 transition-colors">
            Stories
          </Link>
          <Link href="/explorer" className="text-sm font-medium hover:text-rose-600 transition-colors">
            Student Explorer
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-rose-600 transition-colors">
            About
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild className="bg-rose-600 hover:bg-rose-700">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      {isMenuOpen && (
        <div className="container md:hidden py-4 pb-6">
          <nav className="flex flex-col gap-4">
            <Link
              href="/labs"
              className="text-sm font-medium hover:text-rose-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore Labs
            </Link>
            <Link
              href="/feed"
              className="text-sm font-medium hover:text-rose-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Stories
            </Link>
            <Link
              href="/explorer"
              className="text-sm font-medium hover:text-rose-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Student Explorer
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-rose-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="flex flex-col gap-2 mt-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  Log In
                </Link>
              </Button>
              <Button asChild className="w-full bg-rose-600 hover:bg-rose-700">
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
