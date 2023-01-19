import type { RefObject } from "react"
import type { tvector2 } from "./types"
import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react"

// react 18, you might not need an effect
// https://beta.reactjs.org/reference/react/useSyncExternalStore
//
// naive solution, react <= 17
// https://stackoverflow.com/a/60978633
function resizeSubscription(callback: (e: Event) => void) {
  window.addEventListener("resize", callback)
  return () => {
    window.removeEventListener("resize", callback)
  }
}

function useDimensions(ref: RefObject<HTMLElement>) {
  const dimensions = useSyncExternalStore(
    resizeSubscription,
    () => JSON.stringify({
      x: ref.current?.offsetWidth ?? 300,
      y: ref.current?.offsetHeight ?? 200,
    })
  )
  return useMemo<tvector2>(
    () => JSON.parse(dimensions),
    [dimensions]
  )
}

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

function useClickPoint(ref: RefObject<HTMLElement>, onClick: (pt: tvector2) => void) {
  const listener = useCallback(
    (e: MouseEvent) => {
      const elem = ref.current!
      onClick({
        x: e.clientX - elem.offsetLeft,
        y: e.clientY - elem.offsetTop,
      })
    },
    [ref, onClick]
  )
  useEffect(
    () => {
      const elem = ref.current!
      elem.addEventListener("click", listener)
      return () => {
        elem.removeEventListener("click", listener)
      }
    },
    [ref, listener]
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

export { useAnimationFrame, useClickPoint, useDimensions, useWheel }
