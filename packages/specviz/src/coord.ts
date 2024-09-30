import type * as Vector2 from "./vector2"

export type Coord = {
  abs: Vector2.Vector2
  rel: Vector2.Vector2
}

export function mutable(absx = 0, absy = 0, relx = 0, rely = 0): Coord {
  let _absx = absx
  let _absy = absy
  let _relx = relx
  let _rely = rely
  return {
    abs: {
      get x() {
        return _absx
      },
      set x(v) {
        _absx = v
      },
      get y() {
        return _absy
      },
      set y(v) {
        _absy = v
      },
    },
    rel: {
      get x() {
        return _relx
      },
      set x(v) {
        _relx = v
      },
      get y() {
        return _rely
      },
      set y(v) {
        _rely = v
      },
    },
  }
}
