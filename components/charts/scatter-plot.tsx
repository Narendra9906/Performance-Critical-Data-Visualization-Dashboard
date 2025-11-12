"use client"

import { useRef, useEffect, useMemo } from "react"
import type { DataPoint } from "@/lib/types"
import { CanvasRenderer, scaleValue } from "@/lib/canvas-utils"

interface ScatterPlotProps {
  data: DataPoint[]
  width: number
  height: number
  color?: string
  yRange?: [number, number]
}

export function ScatterPlot({ data, width, height, color = "#f59e0b", yRange }: ScatterPlotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const yMin = useMemo(() => yRange?.[0] ?? 0, [yRange])
  const yMax = useMemo(() => {
    if (yRange) return yRange[1]
    return Math.max(...data.map((d) => d.value), 100)
  }, [data, yRange])


  const sampledData = useMemo(() => {
    const sampleRate = Math.max(1, Math.floor(data.length / 500))
    return data.filter((_, i) => i % sampleRate === 0)
  }, [data])

  useEffect(() => {
    if (!canvasRef.current || !sampledData.length) return

    const canvas = canvasRef.current
    const renderer = new CanvasRenderer(canvas)
    const padding = 40

    renderer.clear(width, height, "rgba(255, 255, 255, 0.8)")


    renderer.drawLine(padding, height - padding, width - padding, height - padding, "#ccc")
    renderer.drawLine(padding, padding, padding, height - padding, "#ccc")


    const xStart = sampledData[0]?.timestamp ?? 0
    const xEnd = sampledData[sampledData.length - 1]?.timestamp ?? 0

    sampledData.forEach((point) => {
      const x = scaleValue(point.timestamp, xStart, xEnd, padding, width - padding)
      const y = scaleValue(point.value, yMin, yMax, height - padding, padding)

      renderer.drawCircle(x, y, 3, color, undefined)
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
