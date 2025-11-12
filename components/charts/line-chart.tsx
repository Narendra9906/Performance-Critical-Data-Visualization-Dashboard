"use client"

import { useRef, useEffect, useMemo } from "react"
import type { DataPoint, Viewport } from "@/lib/types"
import { CanvasRenderer, scaleValue } from "@/lib/canvas-utils"

interface LineChartProps {
  data: DataPoint[]
  width: number
  height: number
  color?: string
  xRange?: [number, number]
  yRange?: [number, number]
  viewport?: Viewport
}

export function LineChart({
  data,
  width,
  height,
  color = "#3b82f6",
  xRange,
  yRange,
  viewport = { x: 0, y: 0, width, height, zoom: 1 },
}: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const processedData = useMemo(() => {
    if (!data.length) return []

    const startTime = xRange?.[0] ?? data[0].timestamp
    const endTime = xRange?.[1] ?? data[data.length - 1].timestamp

    return data.filter((d) => d.timestamp >= startTime && d.timestamp <= endTime)
  }, [data, xRange])

  const yMin = useMemo(() => {
    if (yRange) return yRange[0]
    return Math.min(...processedData.map((d) => d.value))
  }, [processedData, yRange])

  const yMax = useMemo(() => {
    if (yRange) return yRange[1]
    return Math.max(...processedData.map((d) => d.value))
  }, [processedData, yRange])

  useEffect(() => {
    if (!canvasRef.current || !processedData.length) return

    const canvas = canvasRef.current
    const renderer = new CanvasRenderer(canvas)
    const padding = 40

    renderer.clear(width, height, "rgba(255, 255, 255, 0.8)")

    renderer.drawLine(padding, height - padding, width - padding, height - padding, "#ccc")
    renderer.drawLine(padding, padding, padding, height - padding, "#ccc")

    if (processedData.length > 1) {
      const xStart = processedData[0].timestamp
      const xEnd = processedData[processedData.length - 1].timestamp
      const xRange = xEnd - xStart || 1

      renderer.getContext().strokeStyle = color
      renderer.getContext().lineWidth = 2
      renderer.getContext().beginPath()

      let isFirst = true
      for (const point of processedData) {
        const x = scaleValue(point.timestamp, xStart, xEnd, padding, width - padding)
        const y = scaleValue(point.value, yMin, yMax, height - padding, padding)

        if (isFirst) {
          renderer.getContext().moveTo(x, y)
          isFirst = false
        } else {
          renderer.getContext().lineTo(x, y)
        }
      }

      renderer.getContext().stroke()
    }


    renderer.drawText(`Min: ${yMin.toFixed(2)}`, padding + 10, padding + 20, { fontSize: 12 })
    renderer.drawText(`Max: ${yMax.toFixed(2)}`, padding + 10, padding + 40, { fontSize: 12 })
  }, [processedData, width, height, color, yMin, yMax])

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
