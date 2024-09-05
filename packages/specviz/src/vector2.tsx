export type tvector2 = { x: number; y: number }

export const zero: tvector2 = { x: 0, y: 0 }

/** todo: unused */
export function magnitude(a: tvector2): number {
  return Math.sqrt(a.x * a.x + a.y * a.y)
}

/** todo: unused */
export function subtract(a: tvector2, b: tvector2): tvector2 {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  }
}
