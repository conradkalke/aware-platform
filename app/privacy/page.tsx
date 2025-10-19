import Link from "next/link"
import { Button } from "@/components/ui/button"
export const metadata = {
  title: 'Privacy Policy — AWARE',
  description: 'Learn how AWARE collects, uses, and protects your personal information.'
}
import { Shield, Eye, Lock, Database, Mail } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-rose-600 sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground">
            Your privacy is important to us. Here's how we protect your information.
          </p>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-rose-600">Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect information you provide directly to us, such as when you create an account, make a donation, or contact us.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Contact information (name, email address)</li>
              <li>Donation information and payment details</li>
              <li>Communication preferences</li>
              <li>Usage information about how you interact with our platform</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-rose-600">How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use the information we collect to provide, maintain, and improve our services.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Process donations and provide receipts</li>
              <li>Send updates about research progress</li>
              <li>Improve our platform and user experience</li>
              <li>Communicate with you about AWARE services</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-rose-600">Information Sharing</h2>
            <p className="text-muted-foreground">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-rose-600">Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-rose-600">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-rose-600" />
              <span>privacy@aware-platform.com</span>
            </div>
          </section>

          <div className="pt-8">
            <Button asChild className="bg-rose-600 hover:bg-rose-700">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

