import { tnullable } from "./types"
import type { tvector2 } from "./vector2"

type trect = {
  x: number,
  y: number,
  width: number,
  height: number,
}

function fromPoints(pt1: tvector2, pt2: tvector2): trect {
  return {
    x: Math.min(pt1.x, pt2.x),
    y: Math.min(pt1.y, pt2.y),
    width: Math.abs(pt2.x - pt1.x),
    height: Math.abs(pt2.y - pt1.y),
  }
}

function intersectPoint(t: trect, pt: tvector2): boolean {
  return pt.x >= t.x
    && pt.x <= t.x + t.width
    && pt.y >= t.y
    && pt.y <= t.y + t.height
}

function intersectRect(a: trect, b: trect): tnullable<trect> {
  const x = Math.max(a.x, b.x)
  const y = Math.max(a.y, b.y)
  const width = Math.min(a.x + a.width, b.x + b.width) - x
  const height = Math.min(a.y + a.height, b.y + b.height) - y
  return width <= 0 || height <= 0 ? null : { x, y, width, height }
}

export type { trect }
export { fromPoints, intersectPoint, intersectRect }
