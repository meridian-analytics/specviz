import * as R from "react"
import * as Hooks from "./hooks"
import * as Plane from "./plane"
import * as Rect from "./rect"
import * as Tool from "./tool"
import * as Viewport from "./viewport"

type taxisformat = (x: number) => string

type taxis = {
  unit: string
  format: taxisformat
  intervals: Array<[number, number]>
}

/**
 * computeUnit
 * map value from unit space to user space
 */
function computeUnit(t: taxis, q: number) {
  if (t == null) return Number.NEGATIVE_INFINITY
  const { intervals: s } = t
  if (s.length < 2) return Number.NEGATIVE_INFINITY
  let ax: number
  let ay: number
  let bx: number
  let by: number
  let i = 0
  while (i < s.length - 1) {
    // biome-ignore lint/style/noNonNullAssertion: s[i] is not null
    ;[ax, ay] = s[i]!
    // biome-ignore lint/style/noNonNullAssertion: s[i + 1] is not null
    ;[bx, by] = s[i + 1]!
    if (ax <= q && q <= bx) return ay + ((by - ay) * (q - ax)) / (bx - ax)
    i += 1
  }
  return Number.NEGATIVE_INFINITY
}

/**
 * computeUnitInverse
 * map value from user space to unit space
 */
function computeUnitInverse(t: taxis, q: number): number {
  if (t == null) return Number.NEGATIVE_INFINITY
  const s = [...t.intervals].sort(([ax, ay], [bx, by]) => ay - by) // todo: memoize
  if (s.length < 2) return Number.NEGATIVE_INFINITY
  let ax: number
  let ay: number
  let bx: number
  let by: number
  let i = 0
  while (i < s.length - 1) {
    // biome-ignore lint/style/noNonNullAssertion: s[i] is not null
    ;[ax, ay] = s[i]!
    // biome-ignore lint/style/noNonNullAssertion: s[i + 1] is not null
    ;[bx, by] = s[i + 1]!
    if (ay <= q && q <= by) return ax + ((bx - ax) * (q - ay)) / (by - ay)
    i += 1
  }
  return Number.NEGATIVE_INFINITY
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
  if (count <= 0) return r
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
  unit?: string,
  format?: taxisformat,
): taxis {
  return {
    unit: unit ?? "units",
    format: format ?? String,
    intervals: [
      [0, min],
      [1, max],
    ],
  }
}

function nonlinear(
  intervals: Array<[number, number]>,
  unit?: string,
  format?: taxisformat,
): taxis {
  return {
    unit: unit ?? "units",
    format: format ?? String,
    intervals,
  }
}

type AxisProps = {
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
  const svgRoot = R.useRef<SVGSVGElement>(null)
  const plane = Plane.useContext()
  const dimensions = Hooks.useDimensions(svgRoot)
  const tool = Tool.useContext()
  const viewport = Viewport.useContext()
  Hooks.useWheel({ ref: svgRoot, onWheel: tool.actions.onWheel })
  const X = props.tickWidth ?? 80
  const Y = props.tickHeight ?? 20
  const width = dimensions.x * viewport.state.zoom.x
  const height = dimensions.y * 1 // fixed zoom
  const count = width / X
  const viewBox = `0 0 ${width / Math.max(1, count)} ${Y}`
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const ticks = R.useMemo(
    () =>
      Array.from(computeTicks(plane.xaxis, count), ([x, q]) => (
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
          <line x1="1" y1="0" x2="1" y2={String(Y)} />
          <text x="5" y="5" children={formatUnit(plane.xaxis, q)} />
        </svg>
      )),
    [
      height,
      Math.floor(count), // when count integer changes
      plane.xaxis,
      viewBox,
      Y,
    ],
  )
  const axisTranslate = `translate(${-viewport.state.scroll.x}, 0)`
  const axisScale = `scale(${viewport.state.zoom.x}, 1)`
  const axisTransform = `${axisTranslate} ${axisScale}`
  return (
    <svg
      ref={svgRoot}
      width="100%"
      height="100%"
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      overflow="visible"
    >
      <g transform={axisTransform} children={ticks} />
    </svg>
  )
}

/** Axis.Vertical */
function Vertical(props: AxisProps) {
  const svgRoot = R.useRef<SVGSVGElement>(null)
  const plane = Plane.useContext()
  const dimensions = Hooks.useDimensions(svgRoot)
  const tool = Tool.useContext()
  const viewport = Viewport.useContext()
  Hooks.useWheel({ ref: svgRoot, onWheel: tool.actions.onWheel })
  const X = props.tickWidth ?? 80
  const Y = props.tickHeight ?? 20
  const width = dimensions.x * 1 // fixed zoom
  const height = dimensions.y * viewport.state.zoom.y
  const count = height / Y
  const viewBox = `0 0 ${X} ${height / Math.max(1, count)}`
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const ticks = R.useMemo(
    () =>
      Array.from(computeTicks(plane.yaxis, count), ([y, q]) => (
        <svg
          key={q}
          className="axis-tick axis-tick-y"
          x={String(0)}
          y={String(y)}
          width={String(X / width)}
          height={String(1 / count)}
          viewBox={viewBox}
          preserveAspectRatio="none"
        >
          <line x1={String(X * 0.9)} y1="0" x2={String(X)} y2="0" />
          <text x="5" y="0" children={formatUnit(plane.yaxis, q)} />
        </svg>
      )),
    [
      Math.floor(count), // when count integer changes
      plane.yaxis,
      viewBox,
      width,
      X,
    ],
  )
  const axisTranslate = `translate(0, ${-viewport.state.scroll.y})`
  const axisScale = `scale(1, ${viewport.state.zoom.y})`
  const axisTransform = `${axisTranslate} ${axisScale}`
  return (
    <svg
      ref={svgRoot}
      width="100%"
      height="100%"
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      overflow="visible"
    >
      <g transform={axisTransform} children={ticks} />
    </svg>
  )
}

type Axes = Record<string, undefined | taxis>

export type Context = Axes

const defaultContext: Context = {}

const Context = R.createContext(defaultContext)

const Provider = Context.Provider

function useContext() {
  return R.useContext(Context)
}

export {
  type Axes,
  type AxisProps,
  type Context,
  type taxis,
  computeRect,
  computeRectInverse,
  computeUnit,
  computeUnitInverse,
  formatUnit,
  Horizontal,
  linear,
  nonlinear,
  Provider,
  useContext,
  Vertical,
}
