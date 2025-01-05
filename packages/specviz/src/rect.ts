import * as Mathx from "./math"
import type * as Vector2 from "./vector2"

export type Rect = {
  x: number
  y: number
  width: number
  height: number
}

export const unit: Rect = { x: 0, y: 0, width: 1, height: 1 }

export function equal(a: Rect, b: Rect): boolean {
  return a.x == b.x && a.y == b.y && a.width == b.width && a.height == b.height
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
  return logical2(unit, t, x, y)
}

export function logical2(prev: Rect, next: Rect, x: boolean, y: boolean): Rect {
  if (x && y) return next
  if (x) return { x: next.x, y: prev.y, width: next.width, height: prev.height }
  if (y) return { x: prev.x, y: next.y, width: prev.width, height: next.height }
  return prev
}

export function move(rect: Rect, dx: number, dy: number): Rect {
  return {
    x: Mathx.clamp(rect.x + dx, 0, 1 - rect.width),
    y: Mathx.clamp(rect.y + dy, 0, 1 - rect.height),
    width: rect.width,
    height: rect.height,
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

export function setX(rect: Rect, dx: number): Rect {
  return {
    x: Mathx.clamp(rect.x + dx, 0, 1 - rect.width),
    y: rect.y,
    width: rect.width,
    height: rect.height,
  }
}

export function setX1(rect: Rect, dx: number): Rect {
  return {
    x: Mathx.clamp(rect.x + dx, 0, rect.x + rect.width - 0.01),
    y: rect.y,
    width: Mathx.clamp(rect.width - Math.max(dx, -rect.x), 0.01, 1 - rect.x),
    height: rect.height,
  }
}

export function setX2(rect: Rect, dx: number): Rect {
  return {
    x: rect.x,
    y: rect.y,
    width: Mathx.clamp(rect.width + dx, 0.01, 1 - rect.x),
    height: rect.height,
  }
}

export function setY(rect: Rect, dy: number): Rect {
  return {
    x: rect.x,
    y: Mathx.clamp(rect.y + dy, 0, 1 - rect.height),
    width: rect.width,
    height: rect.height,
  }
}

export function setY1(rect: Rect, dy: number): Rect {
  return {
    x: rect.x,
    y: Mathx.clamp(rect.y + dy, 0, rect.y + rect.height - 0.01),
    width: rect.width,
    height: Mathx.clamp(rect.height - Math.max(dy, -rect.y), 0.01, 1 - rect.y),
  }
}

export function setY2(rect: Rect, dy: number): Rect {
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: Mathx.clamp(rect.height + dy, 0.01, 1 - rect.y),
  }
}
