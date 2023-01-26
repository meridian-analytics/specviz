import { useCallback, useRef } from "react"
import { useSpecviz } from "./specviz"
import { useAnimationFrame } from "./hooks"
import { percent } from "./mathx"
import { formatTimestamp } from "./stringx"

function Playhead() {
  const svgRoot = useRef<SVGSVGElement>(null)
  const svgText = useRef<SVGTextElement>(null)
  const { mouseup, duration, transportState } = useSpecviz()

  useAnimationFrame(useCallback(
    () => {
      const root = svgRoot.current!
      const text = svgText.current!
      let progress = 0
      switch (transportState.type) {
        case "stop":
          progress = transportState.offset / duration
          root.setAttribute("x", percent(progress))
          if (Math.abs(mouseup.x - progress) < 0.01) {
            text.setAttribute("display", "inline")
            text.setAttribute("y", percent(mouseup.y))
            text.textContent = formatTimestamp(transportState.offset)
          }
          else {
            text.setAttribute("display", "none")
          }
          break
        case "play":
          const delta = (Date.now() - transportState.timeRef) / 1000
          const time = transportState.offset + delta
          progress = time / duration
          root.setAttribute("x", percent(progress))
          if (Math.abs(mouseup.x - progress) < 0.03) {
            text.setAttribute("display", "inline")
            text.setAttribute("y", percent(mouseup.y))
            text.textContent = formatTimestamp(time)
          }
          else {
            text.setAttribute("display", "none")
          }
          break
      }
    },
    [svgRoot, transportState, duration]
  ))

  return <svg
    ref={svgRoot}
    className="playhead"
    x={0}
    y={0}
    height="100%"
  >
    <line
      className="line"
      x1={0}
      y1={0}
      x2={0}
      y2="100%"
    />
    <text
      ref={svgText}
      className="text"
      x={5}
      y={0}
      children="0:00"
    />
  </svg>
}

export default Playhead
