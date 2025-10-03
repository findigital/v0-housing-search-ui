"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit2, Save, X } from "lucide-react"
import { useState } from "react"

interface SearchCriteria {
  bedrooms: { min: number; max: number }
  bathrooms: { min: number; max: number }
  priceRange: { min: number; max: number }
  squareFeet: { min: number; max: number }
  propertyTypes: string[]
  mustHave: string[]
  niceToHave: string[]
  dealBreakers: string[]
}

interface SearchCriteriaPanelProps {
  criteria: SearchCriteria
  onUpdate: (criteria: SearchCriteria) => void
}

export function SearchCriteriaPanel({ criteria, onUpdate }: SearchCriteriaPanelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedCriteria, setEditedCriteria] = useState(criteria)

  const handleSave = () => {
    onUpdate(editedCriteria)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedCriteria(criteria)
    setIsEditing(false)
  }

  return (
    <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Search Criteria</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">Fine-tune your search parameters</p>
        </div>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel} className="gap-2 bg-transparent">
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Numeric Ranges */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-[var(--color-text-primary)]">Bedrooms</Label>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={editedCriteria.bedrooms.min}
                  onChange={(e) =>
                    setEditedCriteria({
                      ...editedCriteria,
                      bedrooms: { ...editedCriteria.bedrooms, min: Number.parseInt(e.target.value) },
                    })
                  }
                  className="border-[var(--color-border)] bg-[var(--color-background)]"
                />
                <span className="text-[var(--color-text-secondary)]">to</span>
                <Input
                  type="number"
                  value={editedCriteria.bedrooms.max}
                  onChange={(e) =>
                    setEditedCriteria({
                      ...editedCriteria,
                      bedrooms: { ...editedCriteria.bedrooms, max: Number.parseInt(e.target.value) },
                    })
                  }
                  className="border-[var(--color-border)] bg-[var(--color-background)]"
                />
              </div>
            ) : (
              <p className="text-sm text-[var(--color-text-secondary)]">
                {criteria.bedrooms.min} - {criteria.bedrooms.max}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[var(--color-text-primary)]">Bathrooms</Label>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={editedCriteria.bathrooms.min}
                  onChange={(e) =>
                    setEditedCriteria({
                      ...editedCriteria,
                      bathrooms: { ...editedCriteria.bathrooms, min: Number.parseInt(e.target.value) },
                    })
                  }
                  className="border-[var(--color-border)] bg-[var(--color-background)]"
                />
                <span className="text-[var(--color-text-secondary)]">to</span>
                <Input
                  type="number"
                  value={editedCriteria.bathrooms.max}
                  onChange={(e) =>
                    setEditedCriteria({
                      ...editedCriteria,
                      bathrooms: { ...editedCriteria.bathrooms, max: Number.parseInt(e.target.value) },
                    })
                  }
                  className="border-[var(--color-border)] bg-[var(--color-background)]"
                />
              </div>
            ) : (
              <p className="text-sm text-[var(--color-text-secondary)]">
                {criteria.bathrooms.min} - {criteria.bathrooms.max}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[var(--color-text-primary)]">Price Range</Label>
            <p className="text-sm text-[var(--color-text-secondary)]">
              ${criteria.priceRange.min.toLocaleString()} - ${criteria.priceRange.max.toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-[var(--color-text-primary)]">Square Feet</Label>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {criteria.squareFeet.min.toLocaleString()} - {criteria.squareFeet.max.toLocaleString()} sq ft
            </p>
          </div>
        </div>

        {/* Property Types */}
        <div>
          <Label className="mb-2 block text-[var(--color-text-primary)]">Property Types</Label>
          <div className="flex flex-wrap gap-2">
            {criteria.propertyTypes.map((type) => (
              <Badge key={type} variant="secondary">
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Must Have */}
        <div>
          <Label className="mb-2 block text-[var(--color-text-primary)]">Must Have</Label>
          <div className="flex flex-wrap gap-2">
            {criteria.mustHave.map((item) => (
              <Badge key={item} className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* Nice to Have */}
        <div>
          <Label className="mb-2 block text-[var(--color-text-primary)]">Nice to Have</Label>
          <div className="flex flex-wrap gap-2">
            {criteria.niceToHave.map((item) => (
              <Badge key={item} className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* Deal Breakers */}
        <div>
          <Label className="mb-2 block text-[var(--color-text-primary)]">Deal Breakers</Label>
          <div className="flex flex-wrap gap-2">
            {criteria.dealBreakers.map((item) => (
              <Badge key={item} className="bg-red-500/10 text-red-600 hover:bg-red-500/20">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
