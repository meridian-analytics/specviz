import type { tvector2 } from "./types"

function subtract(a: tvector2, b: tvector2): tvector2 {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  }
}

export { subtract }
