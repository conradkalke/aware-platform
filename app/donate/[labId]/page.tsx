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

export default function DonatePage({ params }: { params: { labId: string } }) {
  // In a real app, we would fetch the lab data based on the ID
  const lab = labs.find(l => l.id === params.labId) || labs[0]
  
  const [donationAmount, setDonationAmount] = useState<string>("25")
  const [customAmount, setCustomAmount] = useState<string>("")
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null)
  const [note, setNote] = useState<string>("")
  const [step, setStep] = useState<number>(1)
  const [isComplete, setIsComplete] = useState<boolean>(false)

  const handleAmountChange = (value: string) => {
    setDonationAmount(value)
    if (value !== "custom") {
      setCustomAmount("")
    }
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value)
  }

  const handleMilestoneSelect = (id: string) => {
    setSelectedMilestone(id === selectedMilestone ? null : id)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleConfirm = () => {
    // In a real app, this would process the payment
    setIsComplete(true)
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

              <div className="space-y-4">
                <div>
                  <Label className="text-base">Support a specific milestone (optional)</Label>
                  <div className="mt-2 space-y-3">
                    {lab.milestones
                      .filter(m => !m.completed)
                      .map((milestone) => (
                        <div
                          key={milestone.title}
                          onClick={() => handleMilestoneSelect(milestone.title)}
                          className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                            selectedMilestone === milestone.title
                              ? "border-rose-600 bg-rose-50"
                              : "hover:bg-accent"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{milestone.title}</h3>
                            <span className="font-medium text-rose-600">
                              ${milestone.amount.toLocaleString()}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {milestone.description}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
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

              <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700">
                Continue to Payment
              </Button>
            </form>
          ) : (
            <div className="space-y-8 rounded-lg border bg-background p-6">
              <div>
                <h2 className="text-2xl font-bold">Review Your Donation</h2>
                <p className="mt-2 text-muted-foreground">
                  Please review your donation details before confirming.
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
                {selectedMilestone && (
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-muted-foreground">Milestone:</span>
                    <span className="font-medium">{selectedMilestone}</span>
                  </div>
                )}
                {note && (
                  <div className="flex flex-col border-b pb-2">
                    <span className="text-muted-foreground">Note:</span>
                    <span className="font-medium">{note}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="name">Name on Card</Label>
                  <Input id="name" placeholder="John Doe" className="mt-1" />
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleConfirm} className="flex-1 bg-rose-600 hover:bg-rose-700">
                  Confirm Donation
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

const labs = [
  {
    id: "neuro-lab",
    name: "Neurodegeneration Research Lab",
    description: "Investigating novel treatments for Alzheimer's disease through targeted protein therapy.",
    institution: "Yale University",
    image: "/placeholder.svg?height=400&width=600",
    progress: 65,
    raised: 32500,
    goal: 50000,
    supporters: 128,
    updates: 7,
    milestones: [
      {
        title: "Purchase specialized antibodies",
        description: "These antibodies are essential for detecting specific protein conformations in our experiments.",
        amount: 5000,
        completed: true
      },
      {
        title: "Fund graduate student research",
        description: "Support a graduate student researcher for one semester to advance our protein analysis work.",
        amount: 15000,
        completed: true
      },
      {
        title: "Upgrade imaging equipment",
        description: "Enhance our microscopy capabilities to better visualize protein aggregates in neural tissue.",
        amount: 12500,
        completed: true
      },
      {
        title: "Pilot study with novel compound",
        description: "Test our most promising compound in cellular models of neurodegeneration.",
        amount: 10000,
        completed: false
      },
      {
        title: "Conference presentation",
        description: "Present our findings at the International Neurodegeneration Conference.",
        amount: 7500,
        completed: false
      }
    ]
  },
  {
    id: "cancer-research",
    name: "Precision Oncology Lab",
    description: "Developing personalized cancer treatments based on genetic profiling and immunotherapy.",
    institution: "Stanford Medical",
    image: "/placeholder.svg?height=400&width=600",
    progress: 42,
    raised: 21000,
    goal: 50000,
    supporters: 94,
    updates: 5,
    milestones: [
      {
        title: "Genomic sequencing equipment",
        description: "Purchase next-generation sequencing supplies for tumor analysis.",
        amount: 12000,
        completed: true
      },
      {
        title: "Bioinformatics software licenses",
        description: "Access to specialized software for analyzing genetic mutations.",
        amount: 8000,
        completed: true
      },
      {
        title: "Patient sample collection",
        description: "Establish a biobank of diverse cancer samples for testing.",
        amount: 15000,
        completed: false
      },
      {
        title: "Drug screening platform",
        description: "Test candidate compounds against patient-derived cancer cells.",
        amount: 10000,
        completed: false
      },
      {
        title: "Clinical trial preparation",
        description: "Prepare regulatory documentation for initial clinical testing.",
        amount: 5000,
        completed: false
      }
    ]
  }
]
