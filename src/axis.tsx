import { trect, normalize } from "./rect.jsx"

type taxisunit = "hertz" | "seconds" | "percent"

type taxisformat = (x: number) => string

type taxis = {
  unit: taxisunit,
  format: taxisformat,
  intervals: Array<[number, number]>,
}

function computeUnit(t: taxis, q: number) {
  const { intervals: s } = t
  if (s.length < 2) return -Infinity
  let ax, ay, bx, by
  let i = 0
  while (i < s.length - 1) {
    [ax, ay] = s[i];
    [bx, by] = s[i + 1]
    if (ax <= q && q <= bx) return ay + (by - ay) * (q - ax) / (bx - ax)
    i += 1
  }
  return -Infinity
}

function computeUnitInverse(t: taxis, q: number): number {
  const s = t.intervals.sort(([ax, ay], [bx, by]) => ay - by) // todo: memoize
  if (s.length < 2) return -Infinity
  let ax, ay, bx, by
  let i = 0
  while (i < s.length - 1) {
    [ax, ay] = s[i];
    [bx, by] = s[i + 1]
    if (ay <= q && q <= by) return ax + (q - ay) * (bx - ax) / (by - ay)
    i += 1
  }
  return -Infinity
}

function computeRect(tx: taxis, ty: taxis, rect: trect) {
  const x = computeUnit(tx, rect.x)
  const y = computeUnit(ty, rect.y)
  return normalize({
    x,
    y,
    width: computeUnit(tx, rect.x + rect.width) - x,
    height: computeUnit(ty, rect.y + rect.height) - y,
  })
}

function formatUnit(t: taxis, q: number) {
  return t.format(q)
}

function linear(min: number, max: number, unit: taxisunit = "percent", format: taxisformat = String): taxis {
  return {
    unit,
    format,
    intervals: [[0, min], [1, max]],
  }
}

function nonlinear(intervals: Array<[number, number]>, unit: taxisunit = "percent", format: taxisformat = String): taxis {
  return {
    unit,
    format,
    intervals,
  }
}

export type { taxis }
export { computeRect, computeUnit, computeUnitInverse, formatUnit, linear, nonlinear }
