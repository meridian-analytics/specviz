import * as R from "react"
import * as Axis from "./axis"
import * as Input from "./input"
import * as Mathx from "./math"
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
  unit: Vector2.Vector2
  rel: Vector2.Vector2
  abs: Vector2.Vector2
  xaxis: Axis.Axis
  yaxis: Axis.Axis
  event: React.MouseEvent
}) => void

export type UseMouseContextMenuHandler = (useMouseEvent: {
  unit: Vector2.Vector2
  rel: Vector2.Vector2
  abs: Vector2.Vector2
  xaxis: Axis.Axis
  yaxis: Axis.Axis
  event: React.MouseEvent
}) => void

export type UseMouseRectHandler = (useMouseEvent: {
  unit: Rect.Rect
  rel: Rect.Rect
  abs: Rect.Rect
  xaxis: Axis.Axis
  yaxis: Axis.Axis
  event: React.MouseEvent
}) => void

export type UseMouseMoveHandler = (useMouseEvent: {
  dx: number
  dy: number
  event: React.MouseEvent
  xaxis: Axis.Axis
  yaxis: Axis.Axis
}) => void

export type UseMouseWheelHandler = (useMouseEvent: {
  dx: number
  dy: number
  event: WheelEvent
}) => void

export type UseMouseProps = {
  onClick?: UseMouseClickHandler
  onContextMenu?: UseMouseContextMenuHandler
  onDrag?: UseMouseMoveHandler
  onRect?: UseMouseRectHandler
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
          props.onDrag?.({
            dx,
            dy,
            event,
            xaxis: plane.xaxis,
            yaxis: plane.yaxis,
          })
        }
      },
      [input.input, plane.xaxis, plane.yaxis, props.onDrag],
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

export function useDimensions(
  ref: R.MutableRefObject<null | HTMLElement | SVGElement>,
): Vector2.Vector2 {
  const [state, setState] = R.useState<Vector2.Vector2>(Vector2.zero)
  const observer = R.useMemo(
    () =>
      new ResizeObserver(entries => {
        for (const e of entries) {
          for (const { blockSize: y, inlineSize: x } of e.borderBoxSize) {
            setState(prev => {
              if (prev.x === x && prev.y === y) return prev
              return { x, y }
            })
          }
        }
      }),
    [],
  )
  R.useLayoutEffect(() => {
    if (ref.current) observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [observer, ref])
  return state
}

export function useWheel(
  ref: R.MutableRefObject<null | SVGElement>,
  fn?: UseMouseProps["onWheel"],
) {
  const onWheel = R.useCallback(
    (event: WheelEvent) => {
      if (ref.current) {
        event.preventDefault()
        const dx = event.deltaX / ref.current.clientWidth
        const dy = event.deltaY / ref.current.clientHeight
        fn?.({ dx, dy, event })
      }
    },
    [fn, ref],
  )
  R.useEffect(() => {
    if (ref.current) {
      // react uses passive event listeners by default
      // to stop propagation, use a non-passive listener
      // https://stackoverflow.com/a/67258046
      ref.current.addEventListener("wheel", onWheel, { passive: false })
    }
    return () => {
      if (ref.current) {
        ref.current.removeEventListener("wheel", onWheel)
      }
    }
  }, [ref, onWheel])
}
