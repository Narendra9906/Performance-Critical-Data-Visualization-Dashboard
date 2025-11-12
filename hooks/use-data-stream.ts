"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { DataPoint } from "@/lib/types"
import { generateStreamData } from "@/lib/data-generator"

interface UseDataStreamOptions {
  initialData: DataPoint[]
  updateInterval?: number
  maxDataPoints?: number
}

export function useDataStream({ initialData, updateInterval = 100, maxDataPoints = 10000 }: UseDataStreamOptions) {
  const [data, setData] = useState<DataPoint[]>(initialData)
  const dataRef = useRef<DataPoint[]>(initialData)
  const intervalRef = useRef<NodeJS.Timeout>()

  const addDataPoint = useCallback(
    (point: DataPoint) => {
      dataRef.current = [...dataRef.current.slice(-maxDataPoints + 1), point]
      setData([...dataRef.current])
    },
    [maxDataPoints],
  )

  useEffect(() => {
    let currentTime = Date.now()

    intervalRef.current = setInterval(() => {
      currentTime += updateInterval
      const newPoint = generateStreamData(currentTime)
      addDataPoint(newPoint)
    }, updateInterval)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [updateInterval, addDataPoint])

  return { data, addDataPoint }
}
