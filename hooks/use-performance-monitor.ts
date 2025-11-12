"use client"

import { useEffect, useRef, useState } from "react"
import type { PerformanceMetrics } from "@/lib/types"
import { FPSCounter, getMemoryUsage } from "@/lib/performance-utils"

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    dataProcessingTime: 0,
    dataPointCount: 0,
  })

  const fpsCounterRef = useRef(new FPSCounter())
  const lastUpdateRef = useRef(Date.now())
  const frameIdRef = useRef<number>()

  useEffect(() => {
    const updateMetrics = () => {
      const now = Date.now()
      const fps = fpsCounterRef.current.update()
      const memory = getMemoryUsage()

      if (now - lastUpdateRef.current > 1000) {
        setMetrics((prev) => ({
          ...prev,
          fps,
          memoryUsage: memory,
        }))
        lastUpdateRef.current = now
      }

      frameIdRef.current = requestAnimationFrame(updateMetrics)
    }

    frameIdRef.current = requestAnimationFrame(updateMetrics)

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
      }
    }
  }, [])

  return metrics
}
