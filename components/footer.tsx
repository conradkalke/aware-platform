import Link from "next/link"
import { Microscope } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
        <div className="flex items-center space-x-2">
          <Microscope className="h-5 w-5 text-rose-600" />
          <span className="text-lg font-bold text-rose-600">AWARE</span>
        </div>
        <nav className="flex gap-4 md:gap-6">
          <Link href="/about" className="text-xs md:text-sm text-muted-foreground hover:underline underline-offset-4">
            About
          </Link>
          <Link href="/privacy" className="text-xs md:text-sm text-muted-foreground hover:underline underline-offset-4">
            Privacy
          </Link>
          <Link href="/terms" className="text-xs md:text-sm text-muted-foreground hover:underline underline-offset-4">
            Terms
          </Link>
          <Link href="/contact" className="text-xs md:text-sm text-muted-foreground hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>
        <div className="md:ml-auto text-center md:text-right text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} AWARE. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
