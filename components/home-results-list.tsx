"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Maximize,
  Star,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Loader2,
} from "lucide-react"
import { api } from "@/lib/api"
import type { Home } from "@/lib/types"

export function HomeResultsList({ searchId }: { searchId: string }) {
  const [homes, setHomes] = useState<Home[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        console.log("[v0] Fetching results for search:", searchId)
        const data = await api.getSearchResults(searchId)
        setHomes(data.homes || [])
        console.log("[v0] Loaded", data.homes?.length || 0, "homes")
      } catch (err) {
        console.error("[v0] Failed to fetch results:", err)
        setError(err instanceof Error ? err.message : "Failed to load results")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [searchId])

  if (loading) {
    return (
      <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 text-center">
        <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-[var(--color-text-tertiary)]" />
        <p className="text-[var(--color-text-secondary)]">Loading results...</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 text-center">
        <p className="text-red-600">{error}</p>
      </Card>
    )
  }

  if (homes.length === 0) {
    return (
      <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 text-center">
        <p className="text-[var(--color-text-secondary)]">No homes found matching your criteria</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{homes.length} Homes Found</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">Sorted by best match</p>
        </div>
        <Badge variant="outline" className="gap-1.5">
          <Star className="h-3.5 w-3.5" />
          AI Scored & Ranked
        </Badge>
      </div>

      {/* Home Cards */}
      <div className="space-y-4">
        {homes.map((home) => (
          <HomeCard key={home.id} home={home} />
        ))}
      </div>
    </div>
  )
}

function HomeCard({ home }: { home: Home }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % home.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + home.images.length) % home.images.length)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-500/10 border-green-500/20"
    if (score >= 75) return "text-blue-600 bg-blue-500/10 border-blue-500/20"
    if (score >= 60) return "text-yellow-600 bg-yellow-500/10 border-yellow-500/20"
    return "text-orange-600 bg-orange-500/10 border-orange-500/20"
  }

  return (
    <Card className="overflow-hidden border-[var(--color-border)] bg-[var(--color-surface-elevated)] transition-all hover:shadow-lg">
      <div className="grid gap-6 md:grid-cols-[400px_1fr]">
        {/* Image Gallery */}
        <div className="relative">
          <div className="relative aspect-[3/2] overflow-hidden bg-[var(--color-background)]">
            <img
              src={home.images[currentImageIndex] || "/placeholder.svg"}
              alt={`${home.address} - Image ${currentImageIndex + 1}`}
              className="h-full w-full object-cover"
            />

            {/* Image Navigation */}
            {home.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                  {home.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-1.5 w-1.5 rounded-full transition-all ${
                        index === currentImageIndex ? "w-4 bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Match Score Badge */}
            <div className="absolute right-2 top-2">
              <Badge className={`gap-1.5 ${getScoreColor(home.score)}`}>
                <Star className="h-3.5 w-3.5 fill-current" />
                {home.matchPercentage}% Match
              </Badge>
            </div>
          </div>
        </div>

        {/* Home Details */}
        <div className="flex flex-col p-6">
          {/* Header */}
          <div className="mb-4">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">{home.address}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {home.city}, {home.state} {home.zip}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">${home.price.toLocaleString()}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {home.source}
                </Badge>
              </div>
            </div>

            {/* Property Stats */}
            <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)]">
              <div className="flex items-center gap-1.5">
                <Bed className="h-4 w-4" />
                <span>
                  {home.bedrooms} bed{home.bedrooms !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath className="h-4 w-4" />
                <span>
                  {home.bathrooms} bath{home.bathrooms !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Maximize className="h-4 w-4" />
                <span>{home.squareFeet.toLocaleString()} sq ft</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>Built {home.yearBuilt}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>{home.propertyType}</span>
              </div>
            </div>
          </div>

          {/* Match Score Progress */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">Match Score</span>
              <span className="text-sm font-bold text-[var(--color-text-primary)]">{home.score}/100</span>
            </div>
            <Progress value={home.matchPercentage} className="h-2" />
          </div>

          {/* LLM Analysis */}
          <div className="mb-4 rounded-lg bg-[var(--color-background)] p-4">
            <h4 className="mb-2 text-sm font-semibold text-[var(--color-text-primary)]">AI Analysis</h4>
            <p className="text-pretty text-sm leading-relaxed text-[var(--color-text-secondary)]">{home.llmAnalysis}</p>
          </div>

          {/* Pros and Cons */}
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-green-600" />
                <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Pros</h4>
              </div>
              <ul className="space-y-1">
                {home.pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-green-600" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-2 flex items-center gap-2">
                <ThumbsDown className="h-4 w-4 text-red-600" />
                <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Cons</h4>
              </div>
              <ul className="space-y-1">
                {home.cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-600" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Button */}
          <Button className="mt-auto w-full gap-2" asChild>
            <a href={home.listingUrl} target="_blank" rel="noopener noreferrer">
              View Full Listing
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  )
}
