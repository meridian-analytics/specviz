type tvector2 = { x: number, y: number }

function magnitude(a: tvector2): number {
  return Math.sqrt(a.x * a.x + a.y * a.y)
}

function subtract(a: tvector2, b: tvector2): tvector2 {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  }
}

export type { tvector2 }
export { magnitude, subtract }
