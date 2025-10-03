"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, MapPin, Home, CheckCircle2, Loader2, Search, ChevronRight, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import type { SearchHistoryItem } from "@/lib/types"

interface SearchHistoryProps {
  onViewSearch: (id: string) => void
}

export function SearchHistory({ onViewSearch }: SearchHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [history, setHistory] = useState<SearchHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        console.log("[v0] Fetching search history")
        const data = await api.getSearchHistory()
        setHistory(data)
        console.log("[v0] Loaded", data.length, "searches")
      } catch (err) {
        console.error("[v0] Failed to fetch history:", err)
        setError(err instanceof Error ? err.message : "Failed to load history")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const filteredHistory = history.filter(
    (item) =>
      item.request.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusIcon = (status: SearchHistoryItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "in_progress":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: SearchHistoryItem["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "in_progress":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "failed":
        return "bg-red-500/10 text-red-600 border-red-500/20"
    }
  }

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 text-center">
        <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-[var(--color-text-tertiary)]" />
        <p className="text-[var(--color-text-secondary)]">Loading search history...</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 text-center">
        <AlertCircle className="mx-auto mb-2 h-8 w-8 text-red-500" />
        <p className="text-red-600">{error}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="mb-2 text-2xl font-bold text-[var(--color-text-primary)]">Search History</h2>
        <p className="text-[var(--color-text-secondary)]">View and revisit your previous housing searches</p>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
        <Input
          placeholder="Search by location or request..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] pl-10 text-[var(--color-text-primary)]"
        />
      </div>

      {/* Stats */}
      {history.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Search className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">{history.length}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Total Searches</p>
              </div>
            </div>
          </Card>

          <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Home className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {history.reduce((sum, item) => sum + item.homesFound, 0)}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">Homes Discovered</p>
              </div>
            </div>
          </Card>

          <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <CheckCircle2 className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {history.filter((item) => item.status === "completed").length}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">Completed</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* History List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 text-center">
            <Search className="mx-auto mb-2 h-8 w-8 text-[var(--color-text-tertiary)]" />
            <p className="text-[var(--color-text-secondary)]">
              {history.length === 0 ? "No searches yet" : "No searches found matching your query"}
            </p>
          </Card>
        ) : (
          filteredHistory.map((item) => (
            <Card
              key={item.id}
              className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 transition-all hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">{getStatusIcon(item.status)}</div>

                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="mb-1 text-balance font-medium leading-snug text-[var(--color-text-primary)]">
                        {item.request}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-text-secondary)]">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{formatTimestamp(item.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {item.status.replace("_", " ")}
                    </Badge>
                  </div>

                  {/* Stats */}
                  {item.status === "completed" && (
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 rounded-md bg-[var(--color-background)] px-3 py-1.5">
                        <Home className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                        <span className="text-sm text-[var(--color-text-secondary)]">
                          {item.homesFound} homes found
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-md bg-[var(--color-background)] px-3 py-1.5">
                        <span className="text-sm text-[var(--color-text-secondary)]">{item.budget}</span>
                      </div>
                    </div>
                  )}

                  {/* Action */}
                  <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3">
                    <p className="text-xs text-[var(--color-text-tertiary)]">Search ID: {item.id}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewSearch(item.id)}
                      className="gap-2 text-[var(--color-primary)]"
                    >
                      View Results
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
