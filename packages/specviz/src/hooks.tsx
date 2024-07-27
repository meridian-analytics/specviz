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
  onMouseDown?: R.MouseEventHandler
  onMouseMove?: R.MouseEventHandler
  onMouseUp?: R.MouseEventHandler
  onMouseEnter?: R.MouseEventHandler
  onMouseLeave?: R.MouseEventHandler
  onContextMenu?: R.MouseEventHandler
}) {
  const plane = Plane.useContext()
  const input = Input.useContext()
  const viewport = Viewport.useContext()
  const onContextMenu: R.MouseEventHandler = R.useCallback(
    e => {
      e.preventDefault() // disable context menu
      props.onContextMenu?.(e)
    },
    [props.onContextMenu],
  )
  const onMouseDown: R.MouseEventHandler = R.useCallback(
    e => {
      e.preventDefault() // disable native drag
      input.input.buttons = e.buttons
      props.onMouseDown?.(e)
    },
    [input.input, props.onMouseDown],
  )
  const onMouseMove: R.MouseEventHandler = R.useCallback(
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
  const onMouseUp: R.MouseEventHandler = R.useCallback(
    e => {
      props.onMouseUp?.(e)
      input.input.buttons = 0
    },
    [input.input, props.onMouseUp],
  )
  const onMouseEnter: R.MouseEventHandler = R.useCallback(
    e => {
      input.input.focus = e.currentTarget
      if (plane.xaxis != null) input.input.xaxis = plane.xaxis
      if (plane.yaxis != null) input.input.yaxis = plane.yaxis
      props.onMouseEnter?.(e)
    },
    [input.input, plane.xaxis, plane.yaxis, props.onMouseEnter],
  )
  const onMouseLeave: R.MouseEventHandler = R.useCallback(
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

export type UseMouseClickHandler = (useMouseEvent: {
  unit: Vector2.tvector2
  rel: Vector2.tvector2
  abs: Vector2.tvector2
  xaxis: Axis.taxis
  yaxis: Axis.taxis
  event: React.MouseEvent
}) => void

export type UseMouseContextMenuHandler = (useMouseEvent: {
  unit: Vector2.tvector2
  rel: Vector2.tvector2
  abs: Vector2.tvector2
  xaxis: Axis.taxis
  yaxis: Axis.taxis
  event: React.MouseEvent
}) => void

export type UseMouseRectHandler = (useMouseEvent: {
  unit: Rect.trect
  rel: Rect.trect
  abs: Rect.trect
  xaxis: Axis.taxis
  yaxis: Axis.taxis
  event: React.MouseEvent
}) => void

export type UseMouseMoveHandler = (useMouseEvent: {
  dx: number
  dy: number
  event: React.MouseEvent
}) => void

export type UseMouseWheelHandler = (useMouseEvent: {
  dx: number
  dy: number
  event: WheelEvent
}) => void

export type UseMouseProps = {
  onClick?: UseMouseClickHandler
  onContextMenu?: UseMouseContextMenuHandler
  onRect?: UseMouseRectHandler
  onMove?: UseMouseMoveHandler
  onWheel?: UseMouseWheelHandler
}

export function useMouse(props: UseMouseProps) {
  const input = Input.useContext()
  const plane = Plane.useContext()
  return useMouseLowLevel({
    onMouseMove: R.useCallback<R.MouseEventHandler>(
      event => {
        if (input.input.buttons & 1) {
          const dx = event.movementX / event.currentTarget.clientWidth
          const dy = event.movementY / event.currentTarget.clientHeight
          props.onMove?.({ dx, dy, event })
        }
      },
      [input.input, props.onMove],
    ),
    onMouseUp: R.useCallback<R.MouseEventHandler>(
      event => {
        if (input.input.buttons & 1) {
          const mouseRect = Rect.fromPoints(
            input.mousedown.abs,
            input.mouseup.abs,
          )
          if (Rect.diagonal(mouseRect) < 0.01)
            props.onClick?.({
              event,
              unit: input.unitUp,
              rel: input.mouseup.rel,
              abs: input.mouseup.abs,
              xaxis: plane.xaxis,
              yaxis: plane.yaxis,
            })
          else
            props.onRect?.({
              event,
              unit: Rect.fromPoints(input.unitDown, input.unitUp),
              rel: Rect.fromPoints(input.mousedown.rel, input.mouseup.rel),
              abs: mouseRect,
              xaxis: plane.xaxis,
              yaxis: plane.yaxis,
            })
        } else if (input.input.buttons & 2) {
          props.onContextMenu?.({
            event,
            unit: input.unitUp,
            rel: input.mouseup.rel,
            abs: input.mouseup.abs,
            xaxis: plane.xaxis,
            yaxis: plane.yaxis,
          })
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

export type UseWheelProps = {
  ref: R.RefObject<SVGElement>
  onWheel?: UseMouseProps["onWheel"]
}

export function useWheel(props: UseWheelProps) {
  const onWheel = R.useCallback(
    (event: WheelEvent) => {
      if (props.ref.current) {
        event.preventDefault()
        const dx = event.deltaX / props.ref.current.clientWidth
        const dy = event.deltaY / props.ref.current.clientHeight
        props.onWheel?.({ dx, dy, event })
      }
    },
    [props.onWheel, props.ref],
  )
  R.useEffect(() => {
    if (props.ref.current) {
      // react uses passive event listeners by default
      // to stop propagation, use a non-passive listener
      // https://stackoverflow.com/a/67258046
      props.ref.current.addEventListener("wheel", onWheel, { passive: false })
    }
    return () => {
      if (props.ref.current) {
        props.ref.current.removeEventListener("wheel", onWheel)
      }
    }
  }, [props.ref, onWheel])
}
