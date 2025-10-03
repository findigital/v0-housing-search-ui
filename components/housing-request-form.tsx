"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Sparkles, Send } from "lucide-react"
import { api } from "@/lib/api"

interface HousingRequestFormProps {
  onSearchStart: (searchId: string) => void
}

export function HousingRequestForm({ onSearchStart }: HousingRequestFormProps) {
  const [request, setRequest] = useState("")
  const [location, setLocation] = useState("")
  const [budget, setBudget] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const { searchId } = await api.startSearch({
        request,
        location,
        budget,
      })

      console.log("[v0] Search started with ID:", searchId)
      onSearchStart(searchId)
    } catch (err) {
      console.error("[v0] Failed to start search:", err)
      setError(err instanceof Error ? err.message : "Failed to start search")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
          <Sparkles className="h-6 w-6 text-[var(--color-primary)]" />
        </div>
        <h2 className="mb-2 text-3xl font-bold text-[var(--color-text-primary)]">Start Your Housing Search</h2>
        <p className="text-balance text-[var(--color-text-secondary)]">
          Describe your ideal home and let our AI agents find the perfect match
        </p>
      </div>

      <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="request" className="text-[var(--color-text-primary)]">
              Housing Request
            </Label>
            <Textarea
              id="request"
              placeholder="Example: I'm looking for a 3-bedroom house with a backyard in a quiet neighborhood, close to good schools. I need a modern kitchen and prefer homes built after 2010..."
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              className="min-h-32 resize-none border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]"
              required
            />
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Be as detailed as possible about your preferences, requirements, and priorities
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-[var(--color-text-primary)]">
                Location
              </Label>
              <Input
                id="location"
                placeholder="City, State or ZIP"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget" className="text-[var(--color-text-primary)]">
                Budget Range
              </Label>
              <Input
                id="budget"
                placeholder="e.g., $300k - $500k"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]"
                required
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600">{error}</div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full gap-2 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Starting Search...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Start AI Search
              </>
            )}
          </Button>
        </form>
      </Card>

      <div className="mt-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <h3 className="mb-2 text-sm font-medium text-[var(--color-text-primary)]">What happens next?</h3>
        <ul className="space-y-1 text-sm text-[var(--color-text-secondary)]">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-primary)]">•</span>
            <span>LangChain agents analyze your request and extract search criteria</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-primary)]">•</span>
            <span>Mapbox processes location data and defines search boundaries</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-primary)]">•</span>
            <span>Apify actors search multiple listing sources</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-primary)]">•</span>
            <span>LLM evaluates each home and provides match scores</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
