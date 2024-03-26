import * as R from "react"
import * as Axis from "./axis"
import * as Input from "./input"
import * as Mathx from "./mathx"
import * as Rect from "./rect"
import * as Vector2 from "./vector2"
import * as Viewport from "./viewport"

function useAnimationFrame(callback: (frameId: number) => void) {
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

function useMouse(props: {
  xaxis?: Axis.taxis
  yaxis?: Axis.taxis
  onMouseDown: (e: R.MouseEvent<SVGSVGElement>) => void
  onMouseMove: (e: R.MouseEvent<SVGSVGElement>) => void
  onMouseUp: (e: R.MouseEvent<SVGSVGElement>) => void
  onMouseEnter: (e: R.MouseEvent<SVGSVGElement>) => void
  onMouseLeave: (e: R.MouseEvent<SVGSVGElement>) => void
  onContextMenu: (e: R.MouseEvent<SVGSVGElement>) => void
}) {
  const { input, mousedown, mouseup, mouseRect, unitDown, unitUp } =
    Input.useContext()
  const viewport = Viewport.useContext()
  return R.useMemo(() => {
    return {
      onContextMenu(e: R.MouseEvent<SVGSVGElement>) {
        e.preventDefault() // disable context menu
        props.onContextMenu(e)
      },
      onMouseDown(e: R.MouseEvent<SVGSVGElement>) {
        e.preventDefault() // disable native drag
        input.buttons = e.buttons
        props.onMouseDown(e)
      },
      onMouseMove(e: R.MouseEvent<SVGSVGElement>) {
        const elem = e.currentTarget
        const box = elem.getBoundingClientRect()
        const x = (e.clientX - box.x) / box.width
        const y = (e.clientY - box.y) / box.height
        if (input.buttons & 1) {
          mouseup.rel.x = x
          mouseup.rel.y = y
          mouseup.abs.x = (x + viewport.state.scroll.x) / viewport.state.zoom.x
          mouseup.abs.y = (y + viewport.state.scroll.y) / viewport.state.zoom.y
          if (props.xaxis != null)
            unitUp.x = Axis.computeUnit(
              props.xaxis,
              Mathx.clamp(mouseup.abs.x, 0, 1),
            )
          if (props.yaxis != null)
            unitUp.y = Axis.computeUnit(
              props.yaxis,
              Mathx.clamp(mouseup.abs.y, 0, 1),
            )
        } else {
          mousedown.rel.x = mouseup.rel.x = x
          mousedown.rel.y = mouseup.rel.y = y
          mousedown.abs.x = mouseup.abs.x =
            (x + viewport.state.scroll.x) / viewport.state.zoom.x
          mousedown.abs.y = mouseup.abs.y =
            (y + viewport.state.scroll.y) / viewport.state.zoom.y
          if (props.xaxis != null)
            unitDown.x = unitUp.x = Axis.computeUnit(
              props.xaxis,
              Mathx.clamp(mousedown.abs.x, 0, 1),
            )
          if (props.yaxis != null)
            unitDown.y = unitUp.y = Axis.computeUnit(
              props.yaxis,
              Mathx.clamp(mousedown.abs.y, 0, 1),
            )
        }
        const rect = Rect.fromPoints(mousedown.abs, mouseup.abs)
        mouseRect.x = rect.x
        mouseRect.y = rect.y
        mouseRect.width = rect.width
        mouseRect.height = rect.height
        props.onMouseMove(e)
      },
      onMouseUp(e: R.MouseEvent<SVGSVGElement>) {
        props.onMouseUp(e)
        input.buttons = 0
      },
      onMouseEnter(e: R.MouseEvent<SVGSVGElement>) {
        input.focus = e.currentTarget
        if (props.xaxis != null) input.xaxis = props.xaxis
        if (props.yaxis != null) input.yaxis = props.yaxis
        props.onMouseEnter(e)
      },
      onMouseLeave(e: R.MouseEvent<SVGSVGElement>) {
        props.onMouseLeave(e)
        input.buttons = 0
        input.focus = null
        input.xaxis = null
        input.yaxis = null
      },
    }
  }, [
    props.xaxis,
    props.yaxis,
    props.onMouseDown,
    props.onMouseEnter,
    props.onMouseMove,
    props.onMouseUp,
    props.onMouseLeave,
    props.onContextMenu,
    input,
    mousedown,
    mouseup,
    mouseRect,
    unitDown,
    unitUp,
    viewport.state.scroll,
    viewport.state.zoom,
  ])
}

function useDimensions(ref: R.RefObject<HTMLElement | SVGElement>) {
  const [dimensions, setDimensions] = R.useState<Vector2.tvector2>(Vector2.zero)
  const getDimensions = R.useRef(() => {
    if (ref.current) {
      const box = ref.current.getBoundingClientRect()
      return {
        x: box.width,
        y: box.height,
      }
    }
    return Vector2.zero
  })
  function update() {
    setDimensions(prev => {
      if (ref.current == null) return prev
      const dim = getDimensions.current()
      return prev.x == dim.x && prev.y == dim.y ? prev : dim
    })
  }
  R.useEffect(() => {
    update()
  })
  R.useEffect(() => {
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("resize", update)
    }
  }, [])
  return dimensions
}

function useMutableVector2() {
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

function useMutableCoord() {
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

function useMutableRect() {
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
function useWheel(ref: R.RefObject<SVGSVGElement>, direction: 1 | -1) {
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

export {
  useAnimationFrame,
  useDimensions,
  useMouse,
  useMutableVector2,
  useMutableCoord,
  useMutableRect,
  useWheel,
}
