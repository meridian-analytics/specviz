type trect = {
  x: number,
  y: number,
  width: number,
  height: number,
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
export { normalize }
