import { MouseEvent, RefObject, useContext, useEffect, useMemo } from "react"
import { tnullable, tcoord } from "./types.jsx"
import { taxis, computeUnit } from "./axis.jsx"
import { clamp } from "./mathx.jsx"
import { trect, fromPoints } from "./rect.jsx"
import { tvector2 } from "./vector2.jsx"
import SpecvizContext from "./context.jsx"

function useAnimationFrame(callback: (frameId: number) => void) {
  useEffect(
    () => {
      let frame: number
      function onFrame(frameId: number) {
        callback(frameId)
        frame = window.requestAnimationFrame(onFrame)
      }
      frame = window.requestAnimationFrame(onFrame)
      return () => {
        window.cancelAnimationFrame(frame)
      }
    },
    [callback]
  )
}

function useMouse(props: {
  xaxis?: taxis,
  yaxis?: taxis,
  onMouseDown: (e: MouseEvent<SVGSVGElement>) => void,
  onMouseMove: (e: MouseEvent<SVGSVGElement>) => void,
  onMouseUp: (e: MouseEvent<SVGSVGElement>) => void,
  onMouseEnter: (e: MouseEvent<SVGSVGElement>) => void,
  onMouseLeave: (e: MouseEvent<SVGSVGElement>) => void,
  onContextMenu: (e: MouseEvent<SVGSVGElement>) => void,
}) {
  const { input, mousedown, mouseup, mouseRect, unitDown, unitUp, scroll, zoom } = useSpecviz()
  return useMemo(
    () => {
      return {
        onContextMenu(e: MouseEvent<SVGSVGElement>) {
          e.preventDefault() // disable context menu
          props.onContextMenu(e)
        },
        onMouseDown(e: MouseEvent<SVGSVGElement>) {
          e.preventDefault() // disable native drag
          input.buttons = e.buttons
          props.onMouseDown(e)
        },
        onMouseMove(e: MouseEvent<SVGSVGElement>) {
          const elem = e.currentTarget
          const viewport = elem.getBoundingClientRect()
          const x = (e.clientX - viewport.x) / viewport.width
          const y = (e.clientY - viewport.y) / viewport.height
          if (input.buttons & 1) {
            mouseup.rel.x = x
            mouseup.rel.y = y
            mouseup.abs.x = (x + scroll.x) / zoom.x
            mouseup.abs.y = (y + scroll.y) / zoom.y
            if (props.xaxis != null) unitUp.x = computeUnit(props.xaxis, clamp(mouseup.abs.x, 0, 1))
            if (props.yaxis != null) unitUp.y = computeUnit(props.yaxis, clamp(mouseup.abs.y, 0, 1))
          }
          else {
            mousedown.rel.x = mouseup.rel.x = x
            mousedown.rel.y = mouseup.rel.y = y
            mousedown.abs.x = mouseup.abs.x = (x + scroll.x) / zoom.x
            mousedown.abs.y = mouseup.abs.y = (y + scroll.y) / zoom.y
            if (props.xaxis != null) unitDown.x = unitUp.x = computeUnit(props.xaxis, clamp(mousedown.abs.x, 0, 1))
            if (props.yaxis != null) unitDown.y = unitUp.y = computeUnit(props.yaxis, clamp(mousedown.abs.y, 0, 1))
          }
          const rect = fromPoints(mousedown.abs, mouseup.abs)
          mouseRect.x = rect.x
          mouseRect.y = rect.y
          mouseRect.width = rect.width
          mouseRect.height = rect.height
          props.onMouseMove(e)
        },
        onMouseUp(e: MouseEvent<SVGSVGElement>) {
          props.onMouseUp(e)
          input.buttons = 0
        },
        onMouseEnter(e: MouseEvent<SVGSVGElement>) {
          input.focus = e.currentTarget
          if (props.xaxis != null) input.xaxis = props.xaxis
          if (props.yaxis != null) input.yaxis = props.yaxis
          props.onMouseEnter(e)
        },
        onMouseLeave(e: MouseEvent<SVGSVGElement>) {
          props.onMouseLeave(e)
          input.buttons = 0
          input.focus = null
          input.xaxis = null
          input.yaxis = null
        },
      }
    },
    [
      props.xaxis,
      props.yaxis,
      props.onMouseDown,
      props.onMouseMove,
      props.onMouseUp,
      props.onMouseLeave,
      props.onContextMenu
    ]
  )
}

function useMutableVector2() {
  return useMemo<tvector2>(
    () => {
      let x = 0, y = 0
      return {
        get x() { return x },
        get y() { return y },
        set x(v) { x = v },
        set y(v) { y = v },
      }
    },
    []
  )
}

function useMutableCoord() {
  return useMemo<tcoord>(
    () => {
      let absx = 0, absy = 0, relx = 0, rely = 0
      return {
        abs: {
          get x() { return absx },
          set x(v) { absx = v },
          get y() { return absy },
          set y(v) { absy = v },
        },
        rel: {
          get x() { return relx },
          set x(v) { relx = v },
          get y() { return rely },
          set y(v) { rely = v },
        },
      }
    },
    []
  )
}

function useMutableRect() {
  return useMemo<trect>(
    () => {
      let x = 0, y = 0, width = 0, height = 0
      return {
        get x() { return x },
        get y() { return y },
        set x(v) { x = v },
        set y(v) { y = v },
        get width() { return width },
        set width(v) { width = v },
        get height() { return height },
        set height(v) { height = v },
      }
    },
    []
  )
}

// react uses passive event listeners by default
// to stop propagation, use a non-passive listener
// https://stackoverflow.com/a/67258046
function useWheel(ref: RefObject<SVGSVGElement>, direction: 1 | -1) {
  const { command, mousedown, zoom } = useSpecviz()
  useEffect(
    () => {
      const elem = ref.current!
      function onWheel(e: WheelEvent) {
        e.preventDefault()
        const dx = e.deltaX / elem.clientWidth
        const dy = e.deltaY / elem.clientHeight
        if (e.altKey) {
          command.zoom(
            dx * direction,
            dy * direction,
          )
          command.scrollTo({
            x: (mousedown.abs.x * zoom.x) - mousedown.rel.x,
            y: (mousedown.abs.y * zoom.y) - mousedown.rel.y,
          })
        }
        else {
          command.scroll(
            -dx * direction,
            -dy * direction,
          )
        }
      }
      elem.addEventListener("wheel", onWheel, { passive: false })
      return () => {
        elem.removeEventListener("wheel", onWheel)
      }
    },
    [direction]
  )
}

function useSpecviz() {
  return useContext(SpecvizContext)
}

export { useAnimationFrame, useMouse, useMutableVector2, useMutableCoord, useMutableRect, useSpecviz, useWheel }
