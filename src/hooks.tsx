import { RefObject, useRef } from "react"
import type { tvector2 } from "./types"
import { useCallback, useEffect } from "react"
import { subtract } from "./vector2"

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

function useClickDelta(
  ref: RefObject<HTMLElement>,
  onClick: (e: MouseEvent, pt: tvector2, delta: tvector2) => void
) {
  const origin = useRef<tvector2>({ x: 0, y: 0 })

  const absoluteToRelative = useCallback(
    (pt: tvector2) => {
      const elem = ref.current!
      return {
        x: pt.x - elem.offsetLeft,
        y: pt.y - elem.offsetTop,
      }
    },
    [ref]
  )

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      origin.current = absoluteToRelative({ x: e.clientX, y: e.clientY })
    },
    [origin, absoluteToRelative]
  )

  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      const pt = absoluteToRelative({ x: e.clientX, y: e.clientY })
      onClick(e, pt, subtract(pt, origin.current))
    },
    [origin, absoluteToRelative, onClick]
  )

  useEffect(
    () => {
      const elem = ref.current!
      elem.addEventListener("mousedown", onMouseDown)
      elem.addEventListener("mouseup", onMouseUp)
      return () => {
        elem.removeEventListener("mousedown", onMouseDown)
        elem.removeEventListener("mouseup", onMouseUp)
      }
    },
    [ref, onMouseDown, onMouseUp]
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

export { useAnimationFrame, useClickDelta, useWheel }
