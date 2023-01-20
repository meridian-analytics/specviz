import type { MouseEvent, RefObject } from "react"
import type { trect, tvector2 } from "./types"
import { useCallback, useEffect, useRef } from "react"
import { subtract } from "./vector2"
import { normalize } from "./rect"

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

function useClickRect(listeners: {
  onMouseDown: (e: MouseEvent<HTMLElement>, origin: tvector2) => void,
  onMouseUp: (e: MouseEvent<HTMLElement>, rect: trect) => void,
}) {
  const origin = useRef<tvector2>({ x: 0, y: 0 })
  return {
    onMouseDown: useCallback(
      (e: MouseEvent<HTMLElement>) => {
        const elem = e.currentTarget
        origin.current = {
          x: (e.clientX - elem.offsetLeft) / elem.clientWidth,
          y: (e.clientY - elem.offsetTop) / elem.clientHeight,
        }
        listeners.onMouseDown(e, origin.current)
      },
      [origin, listeners.onMouseDown]
    ),
    onMouseUp: useCallback(
      (e: MouseEvent<HTMLElement>) => {
        const elem = e.currentTarget
        const pt = {
          x: (e.clientX - elem.offsetLeft) / elem.clientWidth,
          y: (e.clientY - elem.offsetTop) / elem.clientHeight,
        }
        const delta = subtract(pt, origin.current)
        listeners.onMouseUp(e, normalize({x: origin.current.x, y: origin.current.y, width: delta.x, height: delta.y}))
      },
      [origin, listeners.onMouseUp]
    )
  }
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
