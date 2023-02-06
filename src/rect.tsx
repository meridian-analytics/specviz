import type { tvector2 } from "./vector2"

type trect = {
  x: number,
  y: number,
  width: number,
  height: number,
}

function fromPoints(pt1: tvector2, pt2: tvector2): trect {
  return normalize({
    x: pt1.x,
    y: pt1.y,
    width: pt2.x - pt1.x,
    height: pt2.y - pt1.y,
  })
}

function intersectPoint(t: trect, pt: tvector2): boolean {
  const n = normalize(t)
  return pt.x >= n.x
    && pt.x <= n.x + n.width
    && pt.y >= n.y
    && pt.y <= n.y + n.height
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
export { fromPoints, intersectPoint, normalize }
