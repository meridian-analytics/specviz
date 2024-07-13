import * as R from "react"
import * as Axis from "./axis"
import * as Input from "./input"
import * as Mathx from "./mathx"
import * as Plane from "./plane"
import * as Rect from "./rect"
import * as Vector2 from "./vector2"
import * as Viewport from "./viewport"

export function useAnimationFrame(callback: (frameId: number) => void) {
  R.useEffect(() => {
    let frame: number
    function onFrame(frameId: number) {
      callback(frameId)
      frame = window.requestAnimationFrame(onFrame)
    }
    frame = window.requestAnimationFrame(onFrame)
    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [callback])
}

export function useMouseLowLevel(props: {
  onMouseDown?: R.MouseEventHandler<SVGSVGElement>
  onMouseMove?: R.MouseEventHandler<SVGSVGElement>
  onMouseUp?: R.MouseEventHandler<SVGSVGElement>
  onMouseEnter?: R.MouseEventHandler<SVGSVGElement>
  onMouseLeave?: R.MouseEventHandler<SVGSVGElement>
  onContextMenu?: R.MouseEventHandler<SVGSVGElement>
}) {
  const plane = Plane.useContext()
  const input = Input.useContext()
  const viewport = Viewport.useContext()
  const onContextMenu: R.MouseEventHandler<SVGSVGElement> = R.useCallback(
    e => {
      e.preventDefault() // disable context menu
      props.onContextMenu?.(e)
    },
    [props.onContextMenu],
  )
  const onMouseDown: R.MouseEventHandler<SVGSVGElement> = R.useCallback(
    e => {
      e.preventDefault() // disable native drag
      input.input.buttons = e.buttons
      props.onMouseDown?.(e)
    },
    [input.input, props.onMouseDown],
  )
  const onMouseMove: R.MouseEventHandler<SVGSVGElement> = R.useCallback(
    e => {
      const elem = e.currentTarget
      const box = elem.getBoundingClientRect()
      const x = (e.clientX - box.x) / box.width
      const y = (e.clientY - box.y) / box.height
      if (input.input.buttons & 1) {
        input.mouseup.rel.x = x
        input.mouseup.rel.y = y
        input.mouseup.abs.x =
          (x + viewport.state.scroll.x) / viewport.state.zoom.x
        input.mouseup.abs.y =
          (y + viewport.state.scroll.y) / viewport.state.zoom.y
        input.unitUp.x = Axis.computeUnit(
          plane.xaxis,
          Mathx.clamp(input.mouseup.abs.x, 0, 1),
        )
        input.unitUp.y = Axis.computeUnit(
          plane.yaxis,
          Mathx.clamp(input.mouseup.abs.y, 0, 1),
        )
      } else {
        input.mousedown.rel.x = input.mouseup.rel.x = x
        input.mousedown.rel.y = input.mouseup.rel.y = y
        input.mousedown.abs.x = input.mouseup.abs.x =
          (x + viewport.state.scroll.x) / viewport.state.zoom.x
        input.mousedown.abs.y = input.mouseup.abs.y =
          (y + viewport.state.scroll.y) / viewport.state.zoom.y
        input.unitDown.x = input.unitUp.x = Axis.computeUnit(
          plane.xaxis,
          Mathx.clamp(input.mousedown.abs.x, 0, 1),
        )
        input.unitDown.y = input.unitUp.y = Axis.computeUnit(
          plane.yaxis,
          Mathx.clamp(input.mousedown.abs.y, 0, 1),
        )
      }
      props.onMouseMove?.(e)
    },
    [
      input.input,
      input.mousedown,
      input.mouseup,
      plane.xaxis,
      plane.yaxis,
      props.onMouseMove,
      input.unitDown,
      input.unitUp,
      viewport.state.scroll.x,
      viewport.state.scroll.y,
      viewport.state.zoom.x,
      viewport.state.zoom.y,
    ],
  )
  const onMouseUp: R.MouseEventHandler<SVGSVGElement> = R.useCallback(
    e => {
      props.onMouseUp?.(e)
      input.input.buttons = 0
    },
    [input.input, props.onMouseUp],
  )
  const onMouseEnter: R.MouseEventHandler<SVGSVGElement> = R.useCallback(
    e => {
      input.input.focus = e.currentTarget
      if (plane.xaxis != null) input.input.xaxis = plane.xaxis
      if (plane.yaxis != null) input.input.yaxis = plane.yaxis
      props.onMouseEnter?.(e)
    },
    [input.input, plane.xaxis, plane.yaxis, props.onMouseEnter],
  )
  const onMouseLeave: R.MouseEventHandler<SVGSVGElement> = R.useCallback(
    e => {
      props.onMouseLeave?.(e)
      input.input.buttons = 0
      input.input.focus = null
      input.input.xaxis = null
      input.input.yaxis = null
    },
    [input.input, props.onMouseLeave],
  )
  return R.useMemo(() => {
    return {
      onContextMenu,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseEnter,
      onMouseLeave,
    }
  }, [
    onContextMenu,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseEnter,
    onMouseLeave,
  ])
}

export type UseMouseProps = {
  onClick?: (
    unit: Vector2.tvector2,
    rel: Vector2.tvector2,
    abs: Vector2.tvector2,
    xaxis: Axis.taxis,
    yaxis: Axis.taxis,
  ) => void
  onContextMenu?: (
    unit: Vector2.tvector2,
    rel: Vector2.tvector2,
    abs: Vector2.tvector2,
    xaxis: Axis.taxis,
    yaxis: Axis.taxis,
  ) => void
  onRect?: (
    unit: Rect.trect,
    rel: Rect.trect,
    abs: Rect.trect,
    xaxis: Axis.taxis,
    yaxis: Axis.taxis,
  ) => void
  onMove?: (dx: number, dy: number) => void
}

export function useMouse(props: UseMouseProps) {
  const input = Input.useContext()
  const plane = Plane.useContext()
  return useMouseLowLevel({
    onMouseMove: R.useCallback<R.MouseEventHandler<SVGSVGElement>>(
      e => {
        if (input.input.buttons & 1) {
          const dx = e.movementX / e.currentTarget.clientWidth
          const dy = e.movementY / e.currentTarget.clientHeight
          props.onMove?.(dx, dy)
        }
      },
      [input.input, props.onMove],
    ),
    onMouseUp: R.useCallback<R.MouseEventHandler<SVGSVGElement>>(
      e => {
        if (input.input.buttons & 1) {
          const mouseRect = Rect.fromPoints(
            input.mousedown.abs,
            input.mouseup.abs,
          )
          if (Rect.diagonal(mouseRect) < 0.01)
            props.onClick?.(
              input.unitUp,
              input.mouseup.rel,
              input.mouseup.abs,
              plane.xaxis,
              plane.yaxis,
            )
          else
            props.onRect?.(
              Rect.fromPoints(input.unitDown, input.unitUp),
              Rect.fromPoints(input.mousedown.rel, input.mouseup.rel),
              mouseRect,
              plane.xaxis,
              plane.yaxis,
            )
        } else if (input.input.buttons & 2) {
          props.onContextMenu?.(
            input.unitUp,
            input.mouseup.rel,
            input.mouseup.abs,
            plane.xaxis,
            plane.yaxis,
          )
        }
      },
      [
        input.input,
        input.mousedown,
        input.mouseup,
        input.unitDown,
        input.unitUp,
        plane.xaxis,
        plane.yaxis,
        props.onClick,
        props.onContextMenu,
        props.onRect,
      ],
    ),
  })
}

export function useDimensions(ref: R.RefObject<HTMLElement | SVGElement>) {
  const [dimensions, setDimensions] = R.useState(Vector2.zero)
  const getDimensions = R.useRef(function getDimensions() {
    if (ref.current) {
      const box = ref.current.getBoundingClientRect()
      return {
        x: box.width,
        y: box.height,
      }
    }
    return Vector2.zero
  })
  const update = R.useRef(function update() {
    setDimensions(prev => {
      if (ref.current == null) return prev
      const dim = getDimensions.current()
      return prev.x == dim.x && prev.y == dim.y ? prev : dim
    })
  })
  R.useEffect(() => {
    update.current()
  })
  R.useEffect(() => {
    window.addEventListener("resize", update.current)
    return () => {
      window.removeEventListener("resize", update.current)
    }
  }, [])
  return dimensions
}

export function useMutableVector2() {
  return R.useMemo<Vector2.tvector2>(() => {
    let x = 0
    let y = 0
    return {
      get x() {
        return x
      },
      get y() {
        return y
      },
      set x(v) {
        x = v
      },
      set y(v) {
        y = v
      },
    }
  }, [])
}

export function useMutableCoord() {
  return R.useMemo<Input.tcoord>(() => {
    let absx = 0
    let absy = 0
    let relx = 0
    let rely = 0
    return {
      abs: {
        get x() {
          return absx
        },
        set x(v) {
          absx = v
        },
        get y() {
          return absy
        },
        set y(v) {
          absy = v
        },
      },
      rel: {
        get x() {
          return relx
        },
        set x(v) {
          relx = v
        },
        get y() {
          return rely
        },
        set y(v) {
          rely = v
        },
      },
    }
  }, [])
}

export function useMutableRect() {
  return R.useMemo<Rect.trect>(() => {
    let x = 0
    let y = 0
    let width = 0
    let height = 0
    return {
      get x() {
        return x
      },
      get y() {
        return y
      },
      set x(v) {
        x = v
      },
      set y(v) {
        y = v
      },
      get width() {
        return width
      },
      set width(v) {
        width = v
      },
      get height() {
        return height
      },
      set height(v) {
        height = v
      },
    }
  }, [])
}

// react uses passive event listeners by default
// to stop propagation, use a non-passive listener
// https://stackoverflow.com/a/67258046
export function useWheel(ref: R.RefObject<SVGSVGElement>, direction: 1 | -1) {
  const viewport = Viewport.useContext()
  R.useEffect(() => {
    function onWheel(e: WheelEvent) {
      if (ref.current) {
        e.preventDefault()
        const dx = e.deltaX / ref.current.clientWidth
        const dy = e.deltaY / ref.current.clientHeight
        if (e.altKey) {
          viewport.zoomScroll(dx * direction, dy * direction)
        } else {
          viewport.scroll(-dx * direction, -dy * direction)
        }
      }
    }
    if (ref.current) {
      ref.current.addEventListener("wheel", onWheel, { passive: false })
    }
    return () => {
      if (ref.current) {
        ref.current.removeEventListener("wheel", onWheel)
      }
    }
  }, [ref, direction, viewport.scroll, viewport.zoomScroll])
}
