import type { MouseEvent as ReactMouseEvent, RefObject } from "react"
import type { trect, tvector2 } from "./types"
import { useCallback, useEffect, useRef } from "react"
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

function useClickRect(
  onMouseDown: (e: ReactMouseEvent<HTMLElement>, origin: tvector2) => void,
  onMouseUp: (e: ReactMouseEvent<HTMLElement>, rect: trect) => void,
) {
  const origin = useRef<tvector2>({ x: 0, y: 0 })
  return {
    onMouseDown: useCallback(
      (e: ReactMouseEvent<HTMLElement>) => {
        const elem = e.currentTarget
        origin.current = {
          x: (e.clientX - elem.offsetLeft) / elem.clientWidth,
          y: (e.clientY - elem.offsetTop) / elem.clientHeight,
        }
        onMouseDown(e, origin.current)
      },
      [origin, onMouseDown]
    ),
    onMouseUp: useCallback(
      (e: ReactMouseEvent<HTMLElement>) => {
        const elem = e.currentTarget
        const pt = {
          x: (e.clientX - elem.offsetLeft) / elem.clientWidth,
          y: (e.clientY - elem.offsetTop) / elem.clientHeight,
        }
        const delta = subtract(pt, origin.current)
        onMouseUp(e, {x: origin.current.x, y: origin.current.y, width: delta.x, height: delta.y})
      },
      [origin, onMouseUp]
    )
  }
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

export { useAnimationFrame, useClickRect, useClickDelta, useWheel }
