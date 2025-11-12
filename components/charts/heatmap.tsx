"use client"

import { useRef, useEffect, useMemo } from "react"
import type { DataPoint } from "@/lib/types"
import { CanvasRenderer } from "@/lib/canvas-utils"

interface HeatmapProps {
  data: DataPoint[]
  width: number
  height: number
  categories?: string[]
}

export function Heatmap({ data, width, height, categories }: HeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const heatmapData = useMemo(() => {
    const uniqueCategories = categories || Array.from(new Set(data.map((d) => d.category)))
    const timeSlots: Record<string, Record<string, number>> = {}

    const timeStep = Math.max(1, Math.floor(data.length / 100))
    const sampleData = data.filter((_, i) => i % timeStep === 0)

    sampleData.forEach((point) => {
      const slot = Math.floor(point.timestamp / 1000).toString()
      if (!timeSlots[slot]) timeSlots[slot] = {}
      timeSlots[slot][point.category] = point.value
    })

    return { categories: uniqueCategories, slots: timeSlots }
  }, [data, categories])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const renderer = new CanvasRenderer(canvas)
    const padding = 60

    renderer.clear(width, height, "rgba(255, 255, 255, 0.8)")

    const { categories: cats, slots } = heatmapData
    const slotArray = Object.entries(slots)

    if (!slotArray.length) return


    const allValues = slotArray.flatMap(([_, values]) => Object.values(values))
    const minVal = Math.min(...allValues)
    const maxVal = Math.max(...allValues)
    const range = maxVal - minVal || 1


    const cellWidth = (width - 2 * padding) / slotArray.length
    const cellHeight = (height - 2 * padding) / cats.length

    function valueToColor(val: number): string {
      const norm = (val - minVal) / range
      const h = (1 - norm) * 240 
      return `hsl(${h}, 100%, 50%)`
    }

    slotArray.forEach(([_, values], slotIdx) => {
      cats.forEach((cat, catIdx) => {
        const val = values[cat] ?? 0
        const color = valueToColor(val)
        const x = padding + slotIdx * cellWidth
        const y = padding + catIdx * cellHeight

        renderer.drawRect(x, y, cellWidth, cellHeight, color)
      })
    })

    cats.forEach((cat, i) => {
      renderer.drawText(cat, 5, padding + i * cellHeight + cellHeight / 2, {
        fontSize: 10,
        align: "left",
      })
    })
  }, [width, height, heatmapData])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-border rounded-lg bg-card"
      style={{ display: "block", margin: "0 auto" }}
    />
  )
}
