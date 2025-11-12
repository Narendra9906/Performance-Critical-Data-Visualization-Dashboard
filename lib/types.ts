

export interface DataPoint {
  timestamp: number
  value: number
  category: string
  metadata?: Record<string, any>
}

export interface ChartConfig {
  type: "line" | "bar" | "scatter" | "heatmap"
  dataKey: string
  color: string
  visible: boolean
  name: string
}

export interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  renderTime: number
  dataProcessingTime: number
  dataPointCount: number
}

export interface DataStats {
  min: number
  max: number
  avg: number
  count: number
}

export interface AggregatedData {
  timestamp: number
  values: Record<string, number>
}

export type TimeAggregation = "1min" | "5min" | "1hour" | "raw"
