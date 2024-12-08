'use client'

import { useState } from 'react'
import { ArrowLeft, Info, Send, Users, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

const clubData = {
  name: "Classic Literature Club",
  memberCount: "41K",
  onlineCount: 9,
  rank: "Top 3%",
  created: "Aug 4, 2011",
  type: "Public",
  rules: [
    {
      id: 1,
      title: "Be Respectful",
      description: "Treat all members with respect. No harassment, bullying, or hate speech."
    },
    {
      id: 2,
      title: "Stay on Topic",
      description: "Keep discussions relevant to literature and book-related topics."
    },
    {
      id: 3,
      title: "No Spam",
      description: "No excessive self-promotion or repetitive content."
    },
    {
      id: 4,
      title: "No Personal Details",
      description: "Do not share personal or identifying information."
    },
    {
      id: 5,
      title: "Use Search",
      description: "Check if your question has been answered before posting."
    }
  ]
}

export default function ContactModerators() {
  const [reason, setReason] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC] text-[#8B4513]">
      <header className="bg-[#E6D8B5] border-b border-[#8B4513] p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <Link
              href="/discussion/1"
              className="flex items-center text-[#8B4513] hover:text-[#A0522D] transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Discussion
            </Link>
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-[#8B4513]" />
              <h1 className="text-2xl font-bold text-[#8B4513]">LitCircle</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {submitted && (
            <Alert className="bg-[#E6D8B5] border-[#8B4513] text-[#8B4513]">
              <Info className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Your message has been sent to the moderators. They will respond as soon as possible.
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border border-[#8B4513] bg-[#E6D8B5] p-6">
            <h2 className="text-2xl font-bold mb-4">Contact Moderators</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#8B4513]">Reason for Contact</label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="bg-[#F5F5DC] border-[#8B4513] text-[#8B4513]">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#F5F5DC] border-[#8B4513]">
                    <SelectItem value="rule-violation">Report Rule Violation</SelectItem>
                    <SelectItem value="question">Question About Rules</SelectItem>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#8B4513]">Message</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="min-h-[200px] bg-[#F5F5DC] border-[#8B4513] text-[#8B4513] resize-none placeholder-[#A0522D]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#8B4513] hover:bg-[#A0522D] text-[#F5F5DC]"
                disabled={!reason || !message}
              >
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-[#8B4513] bg-[#E6D8B5] p-4">
            <h2 className="text-xl font-bold mb-4">{clubData.name}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-[#A0522D]">Members</div>
                <div className="font-medium">{clubData.memberCount}</div>
              </div>
              <div>
                <div className="text-[#A0522D]">Online</div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="font-medium">{clubData.onlineCount}</span>
                </div>
              </div>
              <div>
                <div className="text-[#A0522D]">Rank</div>
                <div className="font-medium">{clubData.rank}</div>
              </div>
              <div>
                <div className="text-[#A0522D]">Type</div>
                <div className="font-medium">{clubData.type}</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#8B4513] text-sm text-[#A0522D]">
              Created {clubData.created}
            </div>
          </div>

          <div className="rounded-lg border border-[#8B4513] bg-[#E6D8B5] p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Rules</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {clubData.rules.map((rule) => (
                <AccordionItem key={rule.id} value={`rule-${rule.id}`} className="border-[#8B4513]">
                  <AccordionTrigger className="hover:text-[#A0522D]">
                    {rule.id}. {rule.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#A0522D]">
                    {rule.description}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
    </div>
  )
}