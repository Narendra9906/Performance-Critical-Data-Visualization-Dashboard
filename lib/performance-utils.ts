

export class FPSCounter {
  private lastTime: number = performance.now()
  private fps = 60
  private frameCount = 0
  private samples: number[] = []
  private maxSamples = 60

  update(): number {
    const now = performance.now()
    const delta = now - this.lastTime
    this.lastTime = now

    if (delta > 0) {
      const currentFps = 1000 / delta
      this.samples.push(currentFps)

      if (this.samples.length > this.maxSamples) {
        this.samples.shift()
      }

      this.fps = this.samples.reduce((a, b) => a + b) / this.samples.length
    }

    this.frameCount++
    return Math.round(this.fps)
  }

  getFPS(): number {
    return Math.round(this.fps)
  }

  reset() {
    this.samples = []
    this.frameCount = 0
    this.lastTime = performance.now()
  }
}

export function getMemoryUsage(): number {
  if (performance.memory) {
    return Math.round((performance.memory.usedJSHeapSize / 1048576) * 100) / 100
  }
  return 0
}

export function measurePerformance<T>(fn: () => T, label = "operation"): { result: T; time: number } {
  const start = performance.now()
  const result = fn()
  const time = performance.now() - start

  if (time > 16.67) {
    console.warn(`[Performance] ${label} took ${time.toFixed(2)}ms`)
  }

  return { result, time }
}
