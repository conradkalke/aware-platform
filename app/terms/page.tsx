import Link from "next/link"
import { Button } from "@/components/ui/button"
export const metadata = {
  title: 'Terms of Service — AWARE',
  description: 'Read the terms and conditions for using the AWARE platform.'
}
import { FileText, Scale, Users, AlertTriangle } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-rose-600 sm:text-5xl">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground">
            Please read these terms carefully before using our platform.
          </p>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-rose-600">Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using AWARE, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-rose-600">Use License</h2>
            <p className="text-muted-foreground">
              Permission is granted to temporarily download one copy of AWARE for personal, non-commercial transitory viewing only.
            </p>
            <p className="text-muted-foreground">
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-rose-600">Donations</h2>
            <p className="text-muted-foreground">
              All donations made through AWARE are final and non-refundable unless otherwise specified. Donations are processed securely through our payment partners.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-rose-600">User Accounts</h2>
            <p className="text-muted-foreground">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-rose-600">Prohibited Uses</h2>
            <p className="text-muted-foreground">
              You may not use our service:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-rose-600">Disclaimer</h2>
            <p className="text-muted-foreground">
              The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, AWARE excludes all representations, warranties, conditions and terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-rose-600">Contact Information</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: conradjulian18@gmail.com</p>
              <p>Phone: +1 (860) 372-8039</p>
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

