import { useEffect } from "react"

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

export { useAnimationFrame }
