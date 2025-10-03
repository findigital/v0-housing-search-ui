"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, Circle, Loader2 } from "lucide-react"

interface Agent {
  id: string
  name: string
  status: "idle" | "working" | "completed" | "error"
  currentTask: string
  output?: string
}

interface WorkflowProgressProps {
  agents: Agent[]
}

const workflowStages = [
  {
    id: "parse",
    title: "Parse Request",
    description: "Extract search criteria from natural language",
    agentId: "parser",
  },
  {
    id: "location",
    title: "Process Location",
    description: "Define geographic boundaries and neighborhoods",
    agentId: "mapbox",
  },
  {
    id: "search",
    title: "Search Listings",
    description: "Scrape properties from multiple sources",
    agentId: "apify",
  },
  {
    id: "evaluate",
    title: "Evaluate Matches",
    description: "Score homes and generate recommendations",
    agentId: "evaluator",
  },
]

export function WorkflowProgress({ agents }: WorkflowProgressProps) {
  const getStageStatus = (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId)
    return agent?.status || "idle"
  }

  return (
    <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6">
      <h3 className="mb-6 text-lg font-semibold text-[var(--color-text-primary)]">Workflow Stages</h3>
      <div className="space-y-4">
        {workflowStages.map((stage, index) => {
          const status = getStageStatus(stage.agentId)
          const agent = agents.find((a) => a.id === stage.agentId)

          return (
            <div key={stage.id} className="relative">
              {index < workflowStages.length - 1 && (
                <div
                  className={`absolute left-5 top-12 h-full w-0.5 ${
                    status === "completed" ? "bg-green-500" : "bg-[var(--color-border)]"
                  }`}
                />
              )}
              <div className="flex gap-4">
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-[var(--color-surface-elevated)]">
                  {status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : status === "working" ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-[var(--color-text-primary)]">{stage.title}</h4>
                    <span
                      className={`text-xs font-medium ${
                        status === "completed"
                          ? "text-green-500"
                          : status === "working"
                            ? "text-blue-500"
                            : "text-gray-400"
                      }`}
                    >
                      {status === "completed" ? "Complete" : status === "working" ? "In Progress" : "Pending"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{stage.description}</p>
                  {agent?.currentTask && status !== "idle" && (
                    <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">{agent.currentTask}</p>
                  )}
                  {agent?.output && (
                    <div className="mt-2 rounded-md bg-[var(--color-background)] p-2">
                      <p className="text-xs text-[var(--color-text-tertiary)]">{agent.output}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
