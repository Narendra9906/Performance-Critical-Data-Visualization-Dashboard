"use client"

import { useState, useMemo } from "react"
import { LineChart } from "@/components/charts/line-chart"
import { BarChart } from "@/components/charts/bar-chart"
import { ScatterPlot } from "@/components/charts/scatter-plot"
import { Heatmap } from "@/components/charts/heatmap"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { FilterPanel } from "@/components/controls/filter-panel"
import { TimeRangeSelector } from "@/components/controls/time-range-selector"
import { DataTable } from "@/components/data-table"
import { useDataStream } from "@/hooks/use-data-stream"
import { usePerformanceMonitor } from "@/hooks/use-performance-monitor"
import { generateInitialData } from "@/lib/data-generator"
import type { PerformanceMetrics } from "@/lib/types"

const INITIAL_DATA_POINTS = 5000

export default function DashboardPage() {
  const now = Date.now()
  const initialData = useMemo(() => generateInitialData(INITIAL_DATA_POINTS, now), [now])

  const { data } = useDataStream({
    initialData,
    updateInterval: 100,
    maxDataPoints: 10000,
  })

  const metrics = usePerformanceMonitor()

  const [selectedCategories, setSelectedCategories] = useState<string[]>(["metric-a", "metric-b", "metric-c"])

  const [timeRange, setTimeRange] = useState<[number, number]>([now - 3600000, now + 600000])

  const [aggregation, setAggregation] = useState<"1min" | "5min" | "1hour" | "raw">("raw")

  const filteredData = useMemo(() => {
    return data.filter(
      (point) =>
        selectedCategories.includes(point.category) &&
        point.timestamp >= timeRange[0] &&
        point.timestamp <= timeRange[1],
    )
  }, [data, selectedCategories, timeRange])

  const categories = useMemo(() => Array.from(new Set(data.map((d) => d.category))), [data])

  const metricsWithCount: PerformanceMetrics = {
    ...metrics,
    dataPointCount: data.length,
  }

  const chartHeight = 300
  const chartWidth = 600

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Performance Dashboard</h1>
          <p className="text-muted-foreground">Real-time visualization of 10,000+ data points at 60fps</p>
        </header>


        <div className="mb-6">
          <PerformanceMonitor metrics={metricsWithCount} />
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FilterPanel
            categories={categories}
            onFilterChange={setSelectedCategories}
            aggregation={aggregation}
            onAggregationChange={setAggregation}
          />
          <TimeRangeSelector
            onRangeChange={(start, end) => setTimeRange([start, end])}
            currentStart={timeRange[0]}
            currentEnd={timeRange[1]}
          />
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Line Chart</h2>
            <LineChart data={filteredData} width={chartWidth} height={chartHeight} color="#3b82f6" xRange={timeRange} />
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Bar Chart</h2>
            <BarChart data={filteredData} width={chartWidth} height={chartHeight} color="#10b981" />
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Scatter Plot</h2>
            <ScatterPlot data={filteredData} width={chartWidth} height={chartHeight} color="#f59e0b" />
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Heatmap</h2>
            <Heatmap data={filteredData} width={chartWidth} height={chartHeight} categories={selectedCategories} />
          </div>
        </div>

      
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Data Table (Virtual Scrolling)</h2>
          <DataTable data={filteredData} pageSize={50} />
        </div>
      </div>
    </div>
  )
}
