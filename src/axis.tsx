import { normalize, trect } from "./rect"

type taxisunit = "hertz" | "seconds" | "percent"

type taxisformat = (x: number) => string

type taxis = {
  unit: taxisunit
  format: taxisformat
  intervals: Array<[number, number]>
}

function computeUnit(t: taxis, q: number) {
  if (t == null) return -Infinity
  const { intervals: s } = t
  if (s.length < 2) return -Infinity
  let ax: number
  let ay: number
  let bx: number
  let by: number
  let i = 0
  while (i < s.length - 1) {
    ;[ax, ay] = s[i]
    ;[bx, by] = s[i + 1]
    if (ax <= q && q <= bx) return ay + ((by - ay) * (q - ax)) / (bx - ax)
    i += 1
  }
  return -Infinity
}

function computeUnitInverse(t: taxis, q: number): number {
  if (t == null) return -Infinity
  const s = [...t.intervals].sort(([ax, ay], [bx, by]) => ay - by) // todo: memoize
  if (s.length < 2) return -Infinity
  let ax: number
  let ay: number
  let bx: number
  let by: number
  let i = 0
  while (i < s.length - 1) {
    ;[ax, ay] = s[i]
    ;[bx, by] = s[i + 1]
    if (ay <= q && q <= by) return ax + ((bx - ax) * (q - ay)) / (by - ay)
    i += 1
  }
  return -Infinity
}

function computeRectAux(func: (t: taxis, q: number) => number) {
  return (tx: taxis, ty: taxis, rect: trect) => {
    const x = func(tx, rect.x)
    const y = func(ty, rect.y)
    return normalize({
      x,
      y,
      width: func(tx, rect.x + rect.width) - x,
      height: func(ty, rect.y + rect.height) - y,
    })
  }
}

const computeRect = computeRectAux(computeUnit)

const computeRectInverse = computeRectAux(computeUnitInverse)

function formatUnit(t: taxis, q: number) {
  return t.format(q)
}

function linear(
  min: number,
  max: number,
  unit: taxisunit = "percent",
  format: taxisformat = String,
): taxis {
  return {
    unit,
    format,
    intervals: [
      [0, min],
      [1, max],
    ],
  }
}

function nonlinear(
  intervals: Array<[number, number]>,
  unit: taxisunit = "percent",
  format: taxisformat = String,
): taxis {
  return {
    unit,
    format,
    intervals,
  }
}

export type { taxis }
export {
  computeRect,
  computeRectInverse,
  computeUnit,
  computeUnitInverse,
  formatUnit,
  linear,
  nonlinear,
}
