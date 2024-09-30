export type Vector2 = { x: number; y: number }

export const zero: Vector2 = { x: 0, y: 0 }

/** todo: unused */
export function magnitude(a: Vector2): number {
  return Math.sqrt(a.x * a.x + a.y * a.y)
}

export function mutable(x = 0, y = 0): Vector2 {
  let _x = x
  let _y = y
  return {
    get x() {
      return _x
    },
    get y() {
      return _y
    },
    set x(v) {
      _x = v
    },
    set y(v) {
      _y = v
    },
  }
}

/** todo: unused */
export function subtract(a: Vector2, b: Vector2): Vector2 {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  }
}
