// react 18, you might not need an effect
// https://beta.reactjs.org/reference/react/useSyncExternalStore
//
// naive solution, react <= 17
// https://stackoverflow.com/a/60978633

import type { RefObject } from "react"
import { useEffect, useMemo, useSyncExternalStore } from "react"

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
      width: ref.current?.offsetWidth ?? 300,
      height: ref.current?.offsetHeight ?? 200,
    })
  )
  return useMemo<{ width: number, height: number }>(
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

export { useAnimationFrame, useDimensions }
