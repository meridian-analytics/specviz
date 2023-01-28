import { useCallback, useRef } from "react"
import { useSpecviz } from "./specviz"
import { useAnimationFrame } from "./hooks"
import { formatTimestamp } from "./stringx"

function Playhead() {
  const svgLine = useRef<SVGLineElement>(null)
  const svgText = useRef<SVGTextElement>(null)
  const { mouseup, duration, transportState } = useSpecviz()

  useAnimationFrame(useCallback(
    () => {
      const line = svgLine.current!
      const text = svgText.current!
      let progress = 0
      switch (transportState.type) {
        case "stop":
          progress = transportState.offset / duration
          line.setAttribute("x1", String(progress))
          line.setAttribute("x2", String(progress))
          if (Math.abs(mouseup.x - progress) < 0.01) {
            text.setAttribute("display", "inline")
            text.setAttribute("x", String(progress))
            text.setAttribute("y", String(mouseup.y))
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
          line.setAttribute("x1", String(progress))
          line.setAttribute("x2", String(progress))
          if (Math.abs(mouseup.x - progress) < 0.03) {
            text.setAttribute("display", "inline")
            text.setAttribute("x", String(progress))
            text.setAttribute("y", String(mouseup.y))
            text.textContent = formatTimestamp(time)
          }
          else {
            text.setAttribute("display", "none")
          }
          break
      }
    },
    [svgLine, transportState, duration]
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
