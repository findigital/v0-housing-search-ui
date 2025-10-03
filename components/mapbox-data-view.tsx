"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Maximize2 } from "lucide-react"

interface MapboxDataViewProps {
  data: {
    center: { lat: number; lng: number }
    boundingBox: {
      north: number
      south: number
      east: number
      west: number
    }
    radius: number
    neighborhoods: string[]
  }
}

export function MapboxDataView({ data }: MapboxDataViewProps) {
  return (
    <div className="space-y-4">
      <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Location Data</h3>
          <Badge variant="outline" className="gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {data.radius} mile radius
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-medium text-[var(--color-text-primary)]">Center Point</h4>
              <div className="rounded-md bg-[var(--color-background)] p-3">
                <p className="text-sm text-[var(--color-text-secondary)]">Latitude: {data.center.lat.toFixed(4)}°</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Longitude: {data.center.lng.toFixed(4)}°</p>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium text-[var(--color-text-primary)]">Bounding Box</h4>
              <div className="rounded-md bg-[var(--color-background)] p-3 text-sm text-[var(--color-text-secondary)]">
                <div className="grid grid-cols-2 gap-2">
                  <div>North: {data.boundingBox.north.toFixed(4)}°</div>
                  <div>South: {data.boundingBox.south.toFixed(4)}°</div>
                  <div>East: {data.boundingBox.east.toFixed(4)}°</div>
                  <div>West: {data.boundingBox.west.toFixed(4)}°</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium text-[var(--color-text-primary)]">Target Neighborhoods</h4>
            <div className="flex flex-wrap gap-2">
              {data.neighborhoods.map((neighborhood) => (
                <Badge key={neighborhood} variant="secondary">
                  {neighborhood}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Map Placeholder */}
      <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Map View</h3>
          <Maximize2 className="h-4 w-4 text-[var(--color-text-tertiary)]" />
        </div>
        <div className="flex h-64 items-center justify-center rounded-lg bg-[var(--color-background)]">
          <div className="text-center">
            <MapPin className="mx-auto mb-2 h-8 w-8 text-[var(--color-text-tertiary)]" />
            <p className="text-sm text-[var(--color-text-secondary)]">Map visualization coming soon</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">Integrate with Mapbox GL JS for interactive map</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
