import { useCallback, useRef } from "react"
import { useSpecviz } from "./specviz"
import { useAnimationFrame } from "./hooks"

function Playhead() {
  const svgLine = useRef<SVGLineElement>(null)
  const { playhead } = useSpecviz()

  useAnimationFrame(useCallback(
    () => {
      const line = svgLine.current!
      line.setAttribute("x1", String(playhead.x))
      line.setAttribute("x2", String(playhead.x))
    },
    [svgLine]
  ))

  return <line
    ref={svgLine}
    className="playhead"
    x1="0"
    y1="0"
    x2="0"
    y2="100%"
  />
}

export default Playhead
