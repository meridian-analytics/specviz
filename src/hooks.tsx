import type { MouseEvent, RefObject } from "react"
import { useEffect, useMemo, useRef } from "react"
import { tvector2, subtract } from "./vector2"
import { trect } from "./rect"

function useAnimationFrame(callback: (frameId: number) => void) {
  useEffect(
    () => {
      let frame: number
      function onFrame(frameId: number) {
        callback(frameId)
        frame = requestAnimationFrame(onFrame)
      }
      frame = requestAnimationFrame(onFrame)
      return () => {
        cancelAnimationFrame(frame)
      }
    },
    [callback]
  )
}

function relativePoint(e: MouseEvent<HTMLElement>) {
  const elem = e.currentTarget
  return {
    x: (e.clientX - elem.offsetLeft) / elem.clientWidth,
    y: (e.clientY - elem.offsetTop) / elem.clientHeight,
  }
}

function useClickRect(listeners: {
  onMouseDown: (e: MouseEvent<HTMLElement>, point: tvector2) => void,
  onMouseMove: (e: MouseEvent<HTMLElement>, point: tvector2) => void,
  onMouseUp: (e: MouseEvent<HTMLElement>, rect: trect) => void,
  onMouseLeave: (e: MouseEvent<HTMLElement>, point: tvector2) => void,
  onContextMenu: (e: MouseEvent<HTMLElement>, point: tvector2) => void,
}) {
  const origin = useRef<tvector2>({ x: 0, y: 0 })
  return useMemo(
    () => ({
      onMouseDown(e: MouseEvent<HTMLElement>) {
        origin.current = relativePoint(e)
        listeners.onMouseDown(e, origin.current)
      },
      onMouseMove(e: MouseEvent<HTMLElement>) {
        listeners.onMouseMove(e, relativePoint(e))
      },
      onMouseUp(e: MouseEvent<HTMLElement>) {
        const delta = subtract(relativePoint(e), origin.current)
        listeners.onMouseUp(e, {x: origin.current.x, y: origin.current.y, width: delta.x, height: delta.y})
      },
      onMouseLeave(e: MouseEvent<HTMLElement>) {
        listeners.onMouseLeave(e, relativePoint(e))
      },
      onContextMenu(e: MouseEvent<HTMLElement>) {
        listeners.onContextMenu?.(e, relativePoint(e))
      }
    }),
    [
      origin,
      listeners.onMouseDown,
      listeners.onMouseMove,
      listeners.onMouseUp,
      listeners.onMouseLeave,
      listeners.onContextMenu
    ]
  )
}

// react uses passive event listeners by default
// to stop propagation, use a non-passive listener
// https://stackoverflow.com/a/67258046
function useWheel(ref: RefObject<HTMLElement>, onWheel: (e: WheelEvent) => void) {
  useEffect(
    () => {
      const elem = ref.current!
      elem.addEventListener("wheel", onWheel, { passive: false })
      return () => {
        elem.removeEventListener("wheel", onWheel)
      }
    },
    [ref, onWheel]
  )
}

export { useAnimationFrame, useClickRect, useWheel }
