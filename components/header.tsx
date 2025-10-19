"use client"

import Link from "next/link"
import { useState } from "react"
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
          <Link href="/about" className="text-sm font-medium hover:text-rose-600 transition-colors">
            About
          </Link>
        </nav>
        
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
        {isMenuOpen && (
          <div id="mobile-menu" className="container md:hidden py-4 pb-6">
            <nav className="flex flex-col gap-4">
              <Link
                href="/labs"
                className="text-sm font-medium hover:text-rose-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore Labs
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium hover:text-rose-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </nav>
          </div>
        )}
    </header>
  )
}
