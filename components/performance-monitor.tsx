"use client"
import type { PerformanceMetrics } from "@/lib/types"

interface PerformanceMonitorProps {
  metrics: PerformanceMetrics
}

export function PerformanceMonitor({ metrics }: PerformanceMonitorProps) {
  const getFpsColor = (fps: number) => {
    if (fps >= 55) return "text-green-600"
    if (fps >= 30) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-2 text-sm font-mono">
      <div className="flex justify-between">
        <span>FPS:</span>
        <span className={getFpsColor(metrics.fps)}>{metrics.fps.toFixed(0)}</span>
      </div>
      <div className="flex justify-between">
        <span>Memory:</span>
        <span>{metrics.memoryUsage.toFixed(1)} MB</span>
      </div>
      <div className="flex justify-between">
        <span>Data Points:</span>
        <span>{metrics.dataPointCount.toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span>Render Time:</span>
        <span>{metrics.renderTime.toFixed(2)} ms</span>
      </div>
    </div>
  )
}
