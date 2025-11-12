

export interface Viewport {
  x: number
  y: number
  width: number
  height: number
  zoom: number
}

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D
  private dpr: number

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Failed to get canvas context")

    this.ctx = ctx
    this.dpr = window.devicePixelRatio || 1


    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * this.dpr
    canvas.height = rect.height * this.dpr
    ctx.scale(this.dpr, this.dpr)
  }

  clear(width: number, height: number, bgColor = "#ffffff") {
    this.ctx.fillStyle = bgColor
    this.ctx.fillRect(0, 0, width, height)
  }

  drawLine(x1: number, y1: number, x2: number, y2: number, color = "#000000", width = 1) {
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = width
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.stroke()
  }

  drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    fillColor?: string,
    strokeColor?: string,
    strokeWidth = 1,
  ) {
    if (fillColor) {
      this.ctx.fillStyle = fillColor
      this.ctx.fillRect(x, y, width, height)
    }
    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor
      this.ctx.lineWidth = strokeWidth
      this.ctx.strokeRect(x, y, width, height)
    }
  }

  drawText(
    text: string,
    x: number,
    y: number,
    options: {
      color?: string
      fontSize?: number
      fontFamily?: string
      align?: CanvasTextAlign
    } = {},
  ) {
    const { color = "#000000", fontSize = 12, fontFamily = "Arial", align = "left" } = options

    this.ctx.fillStyle = color
    this.ctx.font = `${fontSize}px ${fontFamily}`
    this.ctx.textAlign = align
    this.ctx.fillText(text, x, y)
  }

  drawCircle(x: number, y: number, radius: number, fillColor?: string, strokeColor?: string) {
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, Math.PI * 2)
    if (fillColor) {
      this.ctx.fillStyle = fillColor
      this.ctx.fill()
    }
    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor
      this.ctx.stroke()
    }
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx
  }
}

export function scaleValue(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin
}

export function getOptimalTickCount(range: number, pixelSize: number): number {
  const targetPixels = 50
  return Math.max(2, Math.floor(pixelSize / targetPixels))
}
