import type * as Vector2 from "./vector2"

export type Rect = {
  x: number
  y: number
  width: number
  height: number
}

export function diagonal(t: Rect): number {
  return Math.sqrt(t.width ** 2 + t.height ** 2)
}

export function fromPoints(pt1: Vector2.Vector2, pt2: Vector2.Vector2): Rect {
  return {
    x: Math.min(pt1.x, pt2.x),
    y: Math.min(pt1.y, pt2.y),
    width: Math.abs(pt2.x - pt1.x),
    height: Math.abs(pt2.y - pt1.y),
  }
}

export function intersectPoint(t: Rect, pt: Vector2.Vector2): boolean {
  return (
    pt.x >= t.x &&
    pt.x <= t.x + t.width &&
    pt.y >= t.y &&
    pt.y <= t.y + t.height
  )
}

export function intersectRect(a: Rect, b: Rect): null | Rect {
  const x = Math.max(a.x, b.x)
  const y = Math.max(a.y, b.y)
  const width = Math.min(a.x + a.width, b.x + b.width) - x
  const height = Math.min(a.y + a.height, b.y + b.height) - y
  return width <= 0 || height <= 0 ? null : { x, y, width, height }
}

export function logical(t: Rect, x: boolean, y: boolean): Rect {
  return {
    x: x ? t.x : 0,
    y: y ? t.y : 0,
    width: x ? t.width : 1,
    height: y ? t.height : 1,
  }
}

export function normalize(t: Rect): Rect {
  return {
    x: Math.min(t.x, t.x + t.width),
    y: Math.min(t.y, t.y + t.height),
    width: Math.abs(t.width),
    height: Math.abs(t.height),
  }
}
