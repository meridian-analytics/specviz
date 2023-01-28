import { useCallback, useRef } from "react"
import { useSpecviz } from "./specviz"
import { useAnimationFrame } from "./hooks"
import { formatTimestamp } from "./stringx"

function Playhead() {
  const svgLine = useRef<SVGLineElement>(null)
  const svgText = useRef<SVGTextElement>(null)
  const { duration, mouseup, playhead } = useSpecviz()

  useAnimationFrame(useCallback(
    () => {
      const line = svgLine.current!
      const text = svgText.current!
      line.setAttribute("x1", String(playhead.x))
      line.setAttribute("x2", String(playhead.x))
      if (Math.abs(mouseup.x - playhead.x) < 0.01) {
        text.setAttribute("display", "inline")
        text.setAttribute("x", String(playhead.x))
        text.setAttribute("y", String(mouseup.y))
        text.textContent = formatTimestamp(playhead.x * duration)
      }
      else {
        text.setAttribute("display", "none")
      }
    },
    [svgLine, svgText, duration]
  ))

  return <>
    <line
      ref={svgLine}
      className="playhead-line"
      x1="0"
      y1="0"
      x2="0"
      y2="100%"
    />
    <text
      ref={svgText}
      className="playhead-text"
      x="0"
      y="0"
      children="0:00"
    />
  </>
}

export default Playhead
