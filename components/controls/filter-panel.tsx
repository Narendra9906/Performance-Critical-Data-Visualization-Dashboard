"use client"

import { useState } from "react"

interface FilterPanelProps {
  categories: string[]
  onFilterChange: (categories: string[]) => void
  aggregation: "1min" | "5min" | "1hour" | "raw"
  onAggregationChange: (agg: "1min" | "5min" | "1hour" | "raw") => void
}

export function FilterPanel({ categories, onFilterChange, aggregation, onAggregationChange }: FilterPanelProps) {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(categories))

  const handleCategoryToggle = (cat: string) => {
    const newSelected = new Set(selectedCategories)
    if (newSelected.has(cat)) {
      newSelected.delete(cat)
    } else {
      newSelected.add(cat)
    }
    setSelectedCategories(newSelected)
    onFilterChange(Array.from(newSelected))
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div>
        <div className="text-sm font-semibold mb-2">Categories</div>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.has(cat)}
                onChange={() => handleCategoryToggle(cat)}
                className="w-4 h-4 border border-border rounded"
              />
              <span className="text-sm">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold mb-2">Aggregation</div>
        <div className="space-y-2">
          {(["raw", "1min", "5min", "1hour"] as const).map((agg) => (
            <label key={agg} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={aggregation === agg}
                onChange={() => onAggregationChange(agg)}
                className="w-4 h-4 border border-border rounded"
              />
              <span className="text-sm capitalize">{agg}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
