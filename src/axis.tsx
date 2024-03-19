import * as R from "react"
import * as Rect from "./rect"
import * as Vector2 from "./vector2"
import * as Viewport from "./viewport"

type taxisunit = "hertz" | "seconds" | "percent"

type taxisformat = (x: number) => string

type taxis = {
  unit: taxisunit
  format: taxisformat
  intervals: Array<[number, number]>
}

/**
 * computeUnit
 * map value from unit space to user space
 */
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

/**
 * computeUnitInverse
 * map value from user space to unit space
 */
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

/**
 * computeRectAux
 * map rect from space to space
 */
function computeRectAux(func: (t: taxis, q: number) => number) {
  return (tx: taxis, ty: taxis, rect: Rect.trect) => {
    const x = func(tx, rect.x)
    const y = func(ty, rect.y)
    return Rect.normalize({
      x,
      y,
      width: func(tx, rect.x + rect.width) - x,
      height: func(ty, rect.y + rect.height) - y,
    })
  }
}

/**
 * computeRect
 * map rect from unit space to user space
 */
const computeRect = computeRectAux(computeUnit)

/**
 * computeRectInverse
 * map rect from user space to unit space
 */
const computeRectInverse = computeRectAux(computeUnitInverse)

/**
 * computeTicks
 * compute the tick marks for the axis
 * returns [unit, uservalue] pairs
 */
function computeTicks(axis: taxis, count: number): [number, number][] {
  const r: [number, number][] = []
  const a = axis.intervals.at(0)
  const b = axis.intervals.at(-1)
  if (a == null || b == null) return r
  // magnitude
  const [min, max] = a[1] < b[1] ? [a[1], b[1]] : [b[1], a[1]]
  const units = Math.abs(max - min)
  const magnitude = Math.log10(units / count)
  const integer = Math.floor(magnitude)
  const decimal = magnitude - integer
  // step
  // 1, 5, 10, 50, 100, 500, 1000, 5000, 10000...
  // 0.5, 0.1, 0.05, 0.01, 0.005, 0.001, 0.0005, 0.0001...
  const step = decimal <= 0.69 ? 5 * 10 ** integer : 1 * 10 ** (integer + 1)
  // ticks
  for (let q = min; q < max; q += step) r.push([computeUnitInverse(axis, q), q])
  return r
}

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

type AxisProps = {
  axis: taxis
  dimensions: Vector2.tvector2
  tickHeight?: number
  tickWidth?: number
}

/**
 * Axis.Horizontal
 * render a horizontal axis
 * - [x] linear and nonlinear axes
 * - [ ] nonlinear ticks evenly spaced
 * - [ ] vertical alignment: bottom (default) or top
 * - [ ] horizontal alignment: left (default) or right
 */
function Horizontal(props: AxisProps) {
  if (props.axis == null) return null
  if (props.dimensions.x <= 0) return null
  if (props.dimensions.y <= 0) return null
  const viewport = Viewport.useContext()
  const X = props.tickWidth ?? 80
  const Y = props.tickHeight ?? 20
  const width = props.dimensions.x * viewport.state.zoom.x
  const height = props.dimensions.y * 1 // fixed zoom
  const count = width / X
  const viewBox = `0 0 ${width / count} ${Y}`
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const ticks = R.useMemo(
    () => computeTicks(props.axis, count),
    [props.axis, Math.floor(count)], // when count integer changes
  )
  return (
    <R.Fragment>
      {Array.from(ticks, ([x, q]) => (
        <svg
          key={q}
          className="axis-tick axis-tick-x"
          x={String(x)}
          y={1 - Y / height}
          width={String(1 / count)}
          height={String(Y / height)}
          viewBox={viewBox}
          preserveAspectRatio="none"
        >
          <line x1="0" y1="0" x2="0" y2={String(Y)} />
          <text x="5" y="5" children={formatUnit(props.axis, q)} />
        </svg>
      ))}
    </R.Fragment>
  )
}

export {
  type AxisProps,
  type taxis,
  computeRect,
  computeRectInverse,
  computeUnit,
  computeUnitInverse,
  formatUnit,
  Horizontal,
  linear,
  nonlinear,
}
