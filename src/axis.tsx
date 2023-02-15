import { taxis, tnullable } from "./types"
import { trect, normalize } from "./rect"

function computeUnit(t: tnullable<taxis>, q: number) {
  if (t == null) return q
  const { intervals: s } = t
  if (s.length < 2) return -Infinity
    let ax, ay, bx, by
    let i = 0
    while (i < s.length - 1) {
      [ax, ay] = s[i];
      [bx, by] = s[i + 1]
      if (q <= bx) {
        return ay + (by - ay) * (q - ax) / (bx - ax)
      }
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

export { computeRect, computeUnit, formatUnit }
