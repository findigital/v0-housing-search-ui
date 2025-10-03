"use client"

import { useState } from "react"
import { HousingRequestForm } from "@/components/housing-request-form"
import { AgentDashboard } from "@/components/agent-dashboard"
import { SearchHistory } from "@/components/search-history"
import { Button } from "@/components/ui/button"
import { Home, History, Plus } from "lucide-react"

type View = "new-search" | "active-search" | "history"

export default function Page() {
  const [view, setView] = useState<View>("new-search")
  const [activeSearchId, setActiveSearchId] = useState<string | null>(null)

  const handleSearchStart = (searchId: string) => {
    setActiveSearchId(searchId)
    setView("active-search")
  }

  const handleViewHistory = (searchId: string) => {
    setActiveSearchId(searchId)
    setView("active-search")
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)]">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Housing Search AI</h1>
                <p className="text-xs text-[var(--color-text-tertiary)]">Intelligent property discovery</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={view === "new-search" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("new-search")}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Search
              </Button>
              <Button
                variant={view === "history" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("history")}
                className="gap-2"
              >
                <History className="h-4 w-4" />
                History
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {view === "new-search" && <HousingRequestForm onSearchStart={handleSearchStart} />}
        {view === "active-search" && activeSearchId && <AgentDashboard searchId={activeSearchId} />}
        {view === "history" && <SearchHistory onViewSearch={handleViewHistory} />}
      </main>
    </div>
  )
}
