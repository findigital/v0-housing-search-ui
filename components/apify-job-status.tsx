"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { useEffect, useState } from "react"

interface ApifyJobStatusProps {
  jobId: string | null
}

interface JobStatus {
  status: "READY" | "RUNNING" | "SUCCEEDED" | "FAILED"
  progress: number
  itemsScraped: number
}

export function ApifyJobStatus({ jobId }: ApifyJobStatusProps) {
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!jobId) return

    const pollJobStatus = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        const response = await fetch(`${apiUrl}/api/apify/job/${jobId}/status`)

        if (response.ok) {
          const data = await response.json()
          setJobStatus(data)
          console.log("[v0] Apify job status:", data)
        }
      } catch (err) {
        console.error("[v0] Failed to fetch Apify job status:", err)
      }
    }

    setLoading(true)
    pollJobStatus()

    // Poll every 5 seconds while job is running
    const interval = setInterval(() => {
      if (jobStatus?.status === "RUNNING" || jobStatus?.status === "READY") {
        pollJobStatus()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [jobId, jobStatus?.status])

  if (!jobId) {
    return (
      <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-500/10">
            <Clock className="h-5 w-5 text-gray-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">Apify Actor</p>
            <p className="text-xs text-[var(--color-text-secondary)]">Waiting to start...</p>
          </div>
        </div>
      </Card>
    )
  }

  const getStatusIcon = () => {
    if (!jobStatus) return <Activity className="h-5 w-5 text-blue-500" />

    switch (jobStatus.status) {
      case "SUCCEEDED":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "FAILED":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "RUNNING":
        return <Activity className="h-5 w-5 text-blue-500 animate-pulse" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = () => {
    if (!jobStatus) return "bg-blue-500/10"

    switch (jobStatus.status) {
      case "SUCCEEDED":
        return "bg-green-500/10"
      case "FAILED":
        return "bg-red-500/10"
      case "RUNNING":
        return "bg-blue-500/10"
      default:
        return "bg-gray-500/10"
    }
  }

  const getStatusText = () => {
    if (!jobStatus) return "Loading..."

    switch (jobStatus.status) {
      case "SUCCEEDED":
        return `Scraped ${jobStatus.itemsScraped} listings`
      case "FAILED":
        return "Scraping failed"
      case "RUNNING":
        return `Scraping... ${jobStatus.itemsScraped} found`
      default:
        return "Ready to start"
    }
  }

  return (
    <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getStatusColor()}`}>
          {getStatusIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">Apify Actor</p>
            <Badge variant="outline" className={jobStatus?.status === "SUCCEEDED" ? "border-green-500/20" : ""}>
              {jobStatus?.status || "LOADING"}
            </Badge>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">{getStatusText()}</p>
        </div>
      </div>
    </Card>
  )
}
