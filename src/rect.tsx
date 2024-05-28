import type * as Vector2 from "./vector2"

type trect = {
  x: number
  y: number
  width: number
  height: number
}

export function diagonal(t: trect): number {
  return Math.sqrt(t.width ** 2 + t.height ** 2)
}

  return {
    x: Math.min(pt1.x, pt2.x),
    y: Math.min(pt1.y, pt2.y),
    width: Math.abs(pt2.x - pt1.x),
    height: Math.abs(pt2.y - pt1.y),
  }
}

function intersectPoint(t: trect, pt: Vector2.tvector2): boolean {
  return (
    pt.x >= t.x &&
    pt.x <= t.x + t.width &&
    pt.y >= t.y &&
    pt.y <= t.y + t.height
  )
}

function intersectRect(a: trect, b: trect): null | trect {
  const x = Math.max(a.x, b.x)
  const y = Math.max(a.y, b.y)
  const width = Math.min(a.x + a.width, b.x + b.width) - x
  const height = Math.min(a.y + a.height, b.y + b.height) - y
  return width <= 0 || height <= 0 ? null : { x, y, width, height }
}

function logical(t: trect, x: boolean, y: boolean): trect {
  return {
    x: x ? t.x : 0,
    y: y ? t.y : 0,
    width: x ? t.width : 1,
    height: y ? t.height : 1,
  }
}

function normalize(t: trect): trect {
  return {
    x: Math.min(t.x, t.x + t.width),
    y: Math.min(t.y, t.y + t.height),
    width: Math.abs(t.width),
    height: Math.abs(t.height),
  }
}

export type { trect }
export { fromPoints, intersectPoint, intersectRect, logical, normalize }
