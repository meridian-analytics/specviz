import { useCallback, useRef } from "react"
import { useSpecviz } from "./specviz"
import { useAnimationFrame } from "./hooks"

function Playhead(props: {
  duration: number
}){
  const elem = useRef<SVGLineElement>(null)
  const { transportState } = useSpecviz()

  useAnimationFrame(useCallback(
    () => {
      const ref = elem.current!
      let progress = "0%"
      switch (transportState.type) {
        case "stop":
          progress = (transportState.offset / props.duration * 100).toFixed(2) + "%"
          break
        case "play":
          const delta = (Date.now() - transportState.timeRef) / 1000
          const time = transportState.offset + delta
          progress = (time / props.duration * 100).toFixed(2) + "%"
          break
      }
      ref.setAttribute("x1", progress)
      ref.setAttribute("x2", progress)
    },
    [elem, transportState, props.duration]
  ))

  return <line
    ref={elem}
    className="playhead"
    x1={0}
    y1={0}
    x2={0}
    y2="100%"
  />
}

export default Playhead
