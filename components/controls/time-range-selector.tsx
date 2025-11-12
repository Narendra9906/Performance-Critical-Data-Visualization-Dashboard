"use client"

import { useState } from "react"

interface TimeRangeSelectorProps {
  onRangeChange: (start: number, end: number) => void
  currentStart: number
  currentEnd: number
}

export function TimeRangeSelector({ onRangeChange, currentStart, currentEnd }: TimeRangeSelectorProps) {
  const [start, setStart] = useState(currentStart)
  const [end, setEnd] = useState(currentEnd)

  const handleApply = () => {
    if (start < end) {
      onRangeChange(start, end)
    }
  }

  const presets = [
    { label: "1 hour", offset: 3600000 },
    { label: "6 hours", offset: 21600000 },
    { label: "24 hours", offset: 86400000 },
  ]

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="text-sm font-semibold">Time Range</div>
      <div className="flex gap-2 flex-wrap">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              const now = Date.now()
              setEnd(now)
              setStart(now - preset.offset)
              onRangeChange(now - preset.offset, now)
            }}
            className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:opacity-80"
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium">Start (ms)</label>
        <input
          type="number"
          value={start}
          onChange={(e) => setStart(Number(e.target.value))}
          className="w-full px-2 py-1 border border-border rounded text-sm"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium">End (ms)</label>
        <input
          type="number"
          value={end}
          onChange={(e) => setEnd(Number(e.target.value))}
          className="w-full px-2 py-1 border border-border rounded text-sm"
        />
      </div>
      <button
        onClick={handleApply}
        className="w-full px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:opacity-80 font-medium"
      >
        Apply Range
      </button>
    </div>
  )
}
