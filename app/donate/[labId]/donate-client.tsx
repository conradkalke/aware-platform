"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, CircleDollarSign, CheckCircle2 } from 'lucide-react'
import { getLabById, labs as allLabs } from "@/lib/labs"

export function DonatePageClient({ labId }: { labId: string }) {
  const lab = getLabById(labId) || allLabs[0]
  
  const [donationAmount, setDonationAmount] = useState<string>("25")
  const [customAmount, setCustomAmount] = useState<string>("")
  const [note, setNote] = useState<string>("")
  const [step, setStep] = useState<number>(1)
  const [isComplete, setIsComplete] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const handleAmountChange = (value: string) => {
    setDonationAmount(value)
    if (value !== "custom") {
      setCustomAmount("")
    }
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value)
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    if (Number.isNaN(actualAmount) || actualAmount <= 0) {
      setErrorMessage("Please enter a valid donation amount greater than $0.")
      return
    }
    setStep(2)
  }

  const handleConfirm = async () => {
    try {
      setErrorMessage("")
      // Create checkout session with Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: actualAmount,
          labId: labId,
          labName: lab.name,
          note: note,
        }),
      })

      const json = await response.json()
      const sessionId = json?.id
      
      if (response.ok && sessionId) {
        // Redirect to Stripe Checkout
        const stripe = await import('@stripe/stripe-js').then(mod => mod.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!))
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId })
        }
      } else {
        setErrorMessage(json?.error || 'Unable to start checkout. Please try again.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setErrorMessage('Something went wrong contacting payments. Please try again.')
    }
  }

  const actualAmount = donationAmount === "custom" ? 
    (customAmount ? parseInt(customAmount) : 0) : 
    parseInt(donationAmount)

  return (
    <div className="container py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/labs" className="hover:text-foreground">
          Labs
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/labs/${lab.id}`} className="hover:text-foreground">
          {lab.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Donate</span>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_350px]">
        <div>
          {isComplete ? (
            <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border bg-background p-8 text-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">Thank You for Your Support!</h2>
              <p className="text-muted-foreground">
                Your donation of ${actualAmount} to {lab.name} has been processed successfully.
              </p>
              <div className="pt-4">
                <Button asChild className="bg-rose-600 hover:bg-rose-700">
                  <Link href={`/labs/${lab.id}`}>
                    Return to Lab Profile
                  </Link>
                </Button>
              </div>
            </div>
          ) : step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-8 rounded-lg border bg-background p-6">
              <div>
                <h2 className="text-2xl font-bold">Support {lab.name}</h2>
                <p className="mt-2 text-muted-foreground">
                  Your donation helps advance critical research in {lab.description.split(" ").slice(0, 5).join(" ").toLowerCase()}...
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-base">Choose an amount</Label>
                  <RadioGroup
                    value={donationAmount}
                    onValueChange={handleAmountChange}
                    className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4"
                  >
                    <div>
                      <RadioGroupItem
                        value="10"
                        id="amount-10"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="amount-10"
                        className="flex cursor-pointer items-center justify-center rounded-md border border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-rose-600 peer-data-[state=checked]:bg-rose-50 peer-data-[state=checked]:text-rose-600"
                      >
                        $10
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="25"
                        id="amount-25"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="amount-25"
                        className="flex cursor-pointer items-center justify-center rounded-md border border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-rose-600 peer-data-[state=checked]:bg-rose-50 peer-data-[state=checked]:text-rose-600"
                      >
                        $25
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="50"
                        id="amount-50"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="amount-50"
                        className="flex cursor-pointer items-center justify-center rounded-md border border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-rose-600 peer-data-[state=checked]:bg-rose-50 peer-data-[state=checked]:text-rose-600"
                      >
                        $50
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="custom"
                        id="amount-custom"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="amount-custom"
                        className="flex cursor-pointer items-center justify-center rounded-md border border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-rose-600 peer-data-[state=checked]:bg-rose-50 peer-data-[state=checked]:text-rose-600"
                      >
                        Custom
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {donationAmount === "custom" && (
                  <div>
                    <Label htmlFor="custom-amount">Enter amount</Label>
                    <div className="relative mt-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="custom-amount"
                        type="number"
                        min="1"
                        placeholder="Enter custom amount"
                        className="pl-7"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                      />
                    </div>
                  </div>
                )}
                </div>


              <div>
                <Label htmlFor="note">Add a note (optional)</Label>
                <Textarea
                  id="note"
                  placeholder="Leave a message for the lab or dedicate this donation to someone"
                  className="mt-1"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              {errorMessage && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={Number.isNaN(actualAmount) || actualAmount <= 0}>
                Continue to Payment
              </Button>
            </form>
          ) : (
            <div className="space-y-8 rounded-lg border bg-background p-6">
              <div>
                <h2 className="text-2xl font-bold">Review Your Donation</h2>
                <p className="mt-2 text-muted-foreground">
                  You will be redirected to a secure Stripe Checkout to complete payment.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">${actualAmount}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Lab:</span>
                  <span className="font-medium">{lab.name}</span>
                </div>
                {note && (
                  <div className="flex flex-col border-b pb-2">
                    <span className="text-muted-foreground">Note:</span>
                    <span className="font-medium">{note}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleConfirm} className="flex-1 bg-rose-600 hover:bg-rose-700">
                  Confirm & Continue to Stripe
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-lg">
                <Image
                  src={lab.image || "/placeholder.svg"}
                  alt={lab.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{lab.name}</h3>
                <p className="text-sm text-muted-foreground">{lab.institution}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>${lab.raised.toLocaleString()} raised</span>
                <span className="font-medium">${lab.goal.toLocaleString()} goal</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-rose-600"
                  style={{ width: `${lab.progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium">Why Your Support Matters</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-rose-100 p-1.5">
                  <CircleDollarSign className="h-4 w-4 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Your donation is transparent. You'll see exactly how your contribution is used.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-rose-100 p-1.5">
                  <CircleDollarSign className="h-4 w-4 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    100% of your donation goes directly to the lab's research efforts.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-rose-100 p-1.5">
                  <CircleDollarSign className="h-4 w-4 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    You'll receive updates on the research progress your donation helps enable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
