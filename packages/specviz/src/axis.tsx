import * as R from "react"
import * as _Axis from "./_axis"
import * as Action from "./action"
import * as Hooks from "./hooks"
import * as Plane from "./plane"
import * as Viewport from "./viewport"

export {
  type Axis,
  computeRect,
  computeRectInverse,
  computeTicks,
  computeUnit,
  computeUnitInverse,
  frequency,
  linear,
  nonlinear,
  percent,
  time,
} from "./_axis"

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
      Array.from(_Axis.computeTicks(plane.xaxis, count), ([x, q]) => (
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
      Array.from(_Axis.computeTicks(plane.yaxis, count), ([y, q]) => (
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

export type Context = Record<string, undefined | _Axis.Axis>

const defaultContext: Context = {}

const Context = R.createContext(defaultContext)

export const Provider = Context.Provider

export function useContext() {
  return R.useContext(Context)
}
