import * as R from "react"
import * as Action from "./action"
import * as Format from "./format"
import * as Hooks from "./hooks"
import * as Plane from "./plane"
import * as Rect from "./rect"
import * as Viewport from "./viewport"

const notFound = Number.NEGATIVE_INFINITY

export type Axis = {
  unit: string
  format: Format.FormatFn
  stops: [number, number][]
  min: number
  max: number
  invert: boolean
}

function create(
  stops: [number, number][],
  unit = "units",
  format: Format.FormatFn = String,
): Axis {
  const min = stops.at(0)
  const max = stops.at(-1)
  if (min == null || max == null || min === max) {
    throw Error("Axis must have at least two stops")
  }
  // if create is exported, this check is needed
  // if (
  //   stops.reduce(
  //     (acc, s) => (acc <= s[0] ? s[0] : Number.POSITIVE_INFINITY),
  //     0,
  //   ) !== 1
  // ) {
  //   throw Error("Axis stops must be in increasing order from 0. to 1.")
  // }
  return min[1] > max[1]
    ? {
        format: format ?? String,
        invert: true,
        max: min[1],
        min: max[1],
        stops: stops
          .slice()
          .reverse()
          .map(([q, u]) => [1 - q, u]),
        unit,
      }
    : {
        format: format ?? String,
        invert: false,
        max: max[1],
        min: min[1],
        stops,
        unit,
      }
}

function interpolate(axis: Axis, q: number, xy: 0 | 1): number {
  function binarySearch(min: number, max: number) {
    if (min > max) return notFound
    const mid = Math.floor((min + max) / 2)
    const a = axis.stops[mid]
    const b = axis.stops[mid + 1]
    if (a == null || b == null) return notFound
    if (q < a[xy]) return binarySearch(min, mid - 1)
    if (q > b[xy]) return binarySearch(mid + 1, max)
    return xy == 0
      ? a[1] + ((b[1] - a[1]) * (q - a[0])) / (b[0] - a[0]) // y
      : a[0] + ((b[0] - a[0]) * (q - a[1])) / (b[1] - a[1]) // x
  }
  return binarySearch(0, axis.stops.length - 2)
}

/**
 * computeUnit
 * map value from unit space to user space
 */
export function computeUnit(axis: Axis, q: number): number {
  const _q = axis.invert ? 1 - q : q
  return interpolate(axis, _q, 0)
}

/**
 * computeUnitInverse
 * map value from user space to unit space
 */
export function computeUnitInverse(t: Axis, q: number): number {
  const u = interpolate(t, q, 1)
  return u == notFound ? notFound : t.invert ? 1 - u : u
}

type ComputeRectFn = (tx: Axis, ty: Axis, rect: Rect.Rect) => Rect.Rect

/**
 * computeRectAux
 * map rect from space to space
 */
function computeRectAux(func: (t: Axis, q: number) => number): ComputeRectFn {
  return (tx, ty, rect) => {
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
export const computeRect: ComputeRectFn = computeRectAux(computeUnit)

/**
 * computeRectInverse
 * map rect from user space to unit space
 */
export const computeRectInverse: ComputeRectFn =
  computeRectAux(computeUnitInverse)

/**
 * computeTicks
 * compute the tick marks for the axis
 * returns [unit, uservalue] pairs
 */
function computeTicks(axis: Axis, count: number): [number, number][] {
  const r: [number, number][] = []
  if (count <= 0) return r
  // magnitude
  const units = Math.abs(axis.max - axis.min)
  const magnitude = Math.log10(units / count)
  const integer = Math.floor(magnitude)
  const decimal = magnitude - integer
  // step
  // 1, 5, 10, 50, 100, 500, 1000, 5000, 10000...
  // 0.5, 0.1, 0.05, 0.01, 0.005, 0.001, 0.0005, 0.0001...
  const step = decimal <= 0.69 ? 5 * 10 ** integer : 1 * 10 ** (integer + 1)
  // ticks
  for (let q = axis.min; q < axis.max; q += step)
    r.push([computeUnitInverse(axis, q), q])
  return r
}

export function linear(
  min: number,
  max: number,
  unit = "units",
  format: Format.FormatFn = String,
): Axis {
  return create(
    [
      [0, min],
      [1, max],
    ],
    unit,
    format,
  )
}

export function nonlinear(
  units: number[],
  unit = "units",
  format: Format.FormatFn = String,
): Axis {
  const k = units.length - 1
  return create(
    units.map((u, i) => [i / k, u]),
    unit,
    format,
  )
}

export function time(
  min: number,
  max: number,
  unit = "seconds",
  format: Format.FormatFn = Format.timestamp,
): Axis {
  return linear(min, max, unit, format)
}

export function frequency(
  min: number,
  max: number,
  unit = "hertz",
  format: Format.FormatFn = Format.hz,
): Axis {
  return linear(min, max, unit, format)
}

export function percent(
  min: number,
  max: number,
  unit = "percent",
  format: Format.FormatFn = Format.percent,
): Axis {
  return linear(min, max, unit, format)
}

export type AxisProps = {
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
export function Horizontal(props: AxisProps) {
  const ref = R.useRef<null | SVGSVGElement>(null)
  const plane = Plane.useContext()
  const dimensions = Hooks.useDimensions(ref)
  const action = Action.useContext()
  const viewport = Viewport.useContext()
  Hooks.useWheel(ref, action.onWheel)
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
          <text x="5" y="5" children={plane.xaxis.format(q)} />
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
      ref={ref}
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
export function Vertical(props: AxisProps) {
  const ref = R.useRef<SVGSVGElement>(null)
  const plane = Plane.useContext()
  const dimensions = Hooks.useDimensions(ref)
  const action = Action.useContext()
  const viewport = Viewport.useContext()
  Hooks.useWheel(ref, action.onWheel)
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
          <text x="5" y="0" children={plane.yaxis.format(q)} />
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
      ref={ref}
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

export type Context = Record<string, undefined | Axis>

const defaultContext: Context = {}

const Context = R.createContext(defaultContext)

export const Provider = Context.Provider

export function useContext() {
  return R.useContext(Context)
}
