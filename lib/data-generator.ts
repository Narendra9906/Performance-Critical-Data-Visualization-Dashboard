
import type { DataPoint } from "./types"

const SINE_AMPLITUDE = 50
const SINE_FREQUENCY = 0.001
const NOISE_LEVEL = 10

export function generateInitialData(points: number, startTime: number): DataPoint[] {
  const data: DataPoint[] = []
  const categories = ["metric-a", "metric-b", "metric-c"]

  for (let i = 0; i < points; i++) {
    const timestamp = startTime - (points - i - 1) * 100
    const category = categories[i % categories.length]


    const sineValue = SINE_AMPLITUDE * Math.sin(timestamp * SINE_FREQUENCY)
    const noise = (Math.random() - 0.5) * NOISE_LEVEL
    const value = 100 + sineValue + noise

    data.push({
      timestamp,
      value: Math.max(0, value),
      category,
      metadata: { id: i },
    })
  }

  return data
}

export function generateStreamData(currentTime: number): DataPoint {
  const categories = ["metric-a", "metric-b", "metric-c"]
  const category = categories[Math.floor(Math.random() * categories.length)]

  const sineValue = SINE_AMPLITUDE * Math.sin(currentTime * SINE_FREQUENCY)
  const noise = (Math.random() - 0.5) * NOISE_LEVEL
  const value = 100 + sineValue + noise

  return {
    timestamp: currentTime,
    value: Math.max(0, value),
    category,
    metadata: { isNew: true },
  }
}


export function aggregateData(
  data: DataPoint[],
  aggregation: "1min" | "5min" | "1hour" | "raw",
): Map<number, Record<string, number>> {
  if (aggregation === "raw") {
    const result = new Map<number, Record<string, number>>()
    data.forEach((point) => {
      const existing = result.get(point.timestamp) || {}
      existing[point.category] = point.value
      result.set(point.timestamp, existing)
    })
    return result
  }

  const intervalMs = aggregation === "1min" ? 60000 : aggregation === "5min" ? 300000 : 3600000
  const result = new Map<number, Record<string, number[]>>()

  data.forEach((point) => {
    const bucket = Math.floor(point.timestamp / intervalMs) * intervalMs
    const existing = result.get(bucket) || {}
    if (!existing[point.category]) {
      existing[point.category] = []
    }
    existing[point.category].push(point.value)
    result.set(bucket, existing)
  })


  const averages = new Map<number, Record<string, number>>()
  result.forEach((values, timestamp) => {
    const averaged: Record<string, number> = {}
    Object.keys(values).forEach((key) => {
      const vals = values[key]
      averaged[key] = vals.reduce((a, b) => a + b) / vals.length
    })
    averages.set(timestamp, averaged)
  })

  return averages
}


export function calculateStats(values: number[]) {
  if (!values.length) return { min: 0, max: 0, avg: 0, count: 0 }

  let min = values[0]
  let max = values[0]
  let sum = 0

  for (let i = 0; i < values.length; i++) {
    const val = values[i]
    if (val < min) min = val
    if (val > max) max = val
    sum += val
  }

  return {
    min,
    max,
    avg: sum / values.length,
    count: values.length,
  }
}
