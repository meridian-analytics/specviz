import { taxis, tnullable } from "./types"

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

function formatUnit(t: taxis, q: number) {
  return t.format(q)
}

export { computeUnit, formatUnit }
