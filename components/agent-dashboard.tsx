"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bot,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Database,
  Map,
  Settings,
  Home,
  TrendingUp,
  Copy,
} from "lucide-react"
import { WorkflowProgress } from "@/components/workflow-progress"
import { MapboxDataView } from "@/components/mapbox-data-view"
import { SearchCriteriaPanel } from "@/components/search-criteria-panel"
import { ApifyJobStatus } from "@/components/apify-job-status"
import { HomeResultsList } from "@/components/home-results-list"
import { api } from "@/lib/api"
import type { AgentStatus, SearchCriteria, MapboxData, AgentUpdate } from "@/lib/types"

interface AgentDashboardProps {
  searchId: string
}

export function AgentDashboard({ searchId }: AgentDashboardProps) {
  const [agents, setAgents] = useState<AgentStatus[]>([
    {
      id: "parser",
      name: "Request Parser",
      status: "idle",
      currentTask: "Waiting to start...",
    },
    {
      id: "mapbox",
      name: "Location Processor",
      status: "idle",
      currentTask: "Waiting for location data...",
    },
    {
      id: "apify",
      name: "Listing Scraper",
      status: "idle",
      currentTask: "Ready to search listings...",
    },
    {
      id: "evaluator",
      name: "Home Evaluator",
      status: "idle",
      currentTask: "Ready to evaluate matches...",
    },
  ])

  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null)
  const [mapboxData, setMapboxData] = useState<MapboxData | null>(null)
  const [duplicatesFound, setDuplicatesFound] = useState(0)
  const [savedToSupabase, setSavedToSupabase] = useState(false)
  const [apifyJobId, setApifyJobId] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    console.log("[v0] Connecting to WebSocket for search:", searchId)

    try {
      const ws = api.createWebSocket(searchId)
      wsRef.current = ws

      ws.onopen = () => {
        console.log("[v0] WebSocket connected")
      }

      ws.onmessage = (event) => {
        try {
          const update: AgentUpdate = JSON.parse(event.data)
          console.log("[v0] Received update:", update.type, update.data)

          switch (update.type) {
            case "agent_update":
              setAgents((prev) =>
                prev.map((agent) =>
                  agent.id === update.data.id
                    ? {
                        ...agent,
                        status: update.data.status,
                        currentTask: update.data.currentTask,
                        output: update.data.output,
                        endTime: update.data.endTime,
                      }
                    : agent,
                ),
              )
              break

            case "criteria_update":
              setSearchCriteria(update.data)
              break

            case "mapbox_update":
              setMapboxData(update.data)
              break

            case "apify_update":
              setApifyJobId(update.data.jobId)
              if (update.data.duplicatesFound !== undefined) {
                setDuplicatesFound(update.data.duplicatesFound)
              }
              break

            case "results_update":
              if (update.data.savedToSupabase) {
                setSavedToSupabase(true)
              }
              break
          }
        } catch (err) {
          console.error("[v0] Failed to parse WebSocket message:", err)
        }
      }

      ws.onerror = (error) => {
        console.error("[v0] WebSocket error:", error)
      }

      ws.onclose = () => {
        console.log("[v0] WebSocket disconnected")
      }

      return () => {
        if (wsRef.current) {
          wsRef.current.close()
        }
      }
    } catch (err) {
      console.error("[v0] Failed to create WebSocket:", err)
    }
  }, [searchId])

  const handleCriteriaUpdate = async (updatedCriteria: SearchCriteria) => {
    try {
      await api.updateSearchCriteria(searchId, updatedCriteria)
      setSearchCriteria(updatedCriteria)
      console.log("[v0] Search criteria updated")
    } catch (err) {
      console.error("[v0] Failed to update criteria:", err)
    }
  }

  const getStatusIcon = (status: AgentStatus["status"]) => {
    switch (status) {
      case "working":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: AgentStatus["status"]) => {
    switch (status) {
      case "working":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "error":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const completedAgents = agents.filter((a) => a.status === "completed").length
  const totalAgents = agents.length
  const overallProgress = (completedAgents / totalAgents) * 100

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Search Progress</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">Search ID: {searchId}</p>
          </div>
          <Badge variant="outline" className="gap-1.5">
            <Bot className="h-3.5 w-3.5" />
            {completedAgents} / {totalAgents} Agents Complete
          </Badge>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 bg-[var(--color-surface-elevated)]">
          <TabsTrigger value="agents" className="gap-2">
            <Bot className="h-4 w-4" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="workflow" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Workflow
          </TabsTrigger>
          <TabsTrigger value="criteria" className="gap-2">
            <Settings className="h-4 w-4" />
            Criteria
          </TabsTrigger>
          <TabsTrigger value="location" className="gap-2">
            <Map className="h-4 w-4" />
            Location
          </TabsTrigger>
          <TabsTrigger value="results" className="gap-2">
            <Home className="h-4 w-4" />
            Results
          </TabsTrigger>
        </TabsList>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {agents.map((agent) => (
              <Card
                key={agent.id}
                className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 transition-all hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getStatusIcon(agent.status)}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-[var(--color-text-primary)]">{agent.name}</h3>
                      <Badge variant="outline" className={getStatusColor(agent.status)}>
                        {agent.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">{agent.currentTask}</p>
                    {agent.output && (
                      <div className="rounded-md bg-[var(--color-background)] p-3">
                        <p className="text-xs text-[var(--color-text-tertiary)]">{agent.output}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Status Indicators */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                  <Copy className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">{duplicatesFound}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">Duplicates Found</p>
                </div>
              </div>
            </Card>

            <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <Database className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">{savedToSupabase ? "✓" : "—"}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">Saved to Supabase</p>
                </div>
              </div>
            </Card>

            <ApifyJobStatus jobId={apifyJobId} />
          </div>
        </TabsContent>

        {/* Workflow Tab */}
        <TabsContent value="workflow">
          <WorkflowProgress agents={agents} />
        </TabsContent>

        {/* Criteria Tab */}
        <TabsContent value="criteria">
          {searchCriteria ? (
            <SearchCriteriaPanel criteria={searchCriteria} onUpdate={handleCriteriaUpdate} />
          ) : (
            <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 text-center">
              <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-[var(--color-text-tertiary)]" />
              <p className="text-[var(--color-text-secondary)]">Extracting search criteria...</p>
            </Card>
          )}
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="location">
          {mapboxData ? (
            <MapboxDataView data={mapboxData} />
          ) : (
            <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 text-center">
              <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-[var(--color-text-tertiary)]" />
              <p className="text-[var(--color-text-secondary)]">Processing location data...</p>
            </Card>
          )}
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results">
          {completedAgents === totalAgents ? (
            <HomeResultsList searchId={searchId} />
          ) : (
            <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 text-center">
              <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-[var(--color-text-tertiary)]" />
              <p className="text-[var(--color-text-secondary)]">Waiting for search to complete...</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
