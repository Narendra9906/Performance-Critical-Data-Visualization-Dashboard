"use client"

import { useRef, useEffect, useMemo } from "react"
import type { DataPoint } from "@/lib/types"
import { CanvasRenderer, scaleValue } from "@/lib/canvas-utils"

interface BarChartProps {
  data: DataPoint[]
  width: number
  height: number
  color?: string
  yRange?: [number, number]
}

export function BarChart({ data, width, height, color = "#10b981", yRange }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const yMin = useMemo(() => yRange?.[0] ?? 0, [yRange])
  const yMax = useMemo(() => {
    if (yRange) return yRange[1]
    return Math.max(...data.map((d) => d.value), 100)
  }, [data, yRange])

  const sampledData = useMemo(() => {
    const sampleRate = Math.max(1, Math.floor(data.length / 100))
    return data.filter((_, i) => i % sampleRate === 0)
  }, [data])

  useEffect(() => {
    if (!canvasRef.current || !sampledData.length) return

    const canvas = canvasRef.current
    const renderer = new CanvasRenderer(canvas)
    const padding = 40
    const chartWidth = width - 2 * padding
    const chartHeight = height - 2 * padding

    renderer.clear(width, height, "rgba(255, 255, 255, 0.8)")

    // Draw axes
    renderer.drawLine(padding, height - padding, width - padding, height - padding, "#ccc")
    renderer.drawLine(padding, padding, padding, height - padding, "#ccc")

    // Draw bars
    const barWidth = (chartWidth / sampledData.length) * 0.8
    const spacing = chartWidth / sampledData.length

    sampledData.forEach((point, i) => {
      const x = padding + i * spacing + spacing * 0.1
      const barHeight = scaleValue(point.value, yMin, yMax, 0, chartHeight)
      const y = height - padding - barHeight

      renderer.drawRect(x, y, barWidth, barHeight, color)
    })
  }, [sampledData, width, height, color, yMin, yMax])

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
