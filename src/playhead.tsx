import { useCallback, useRef } from "react"
import { useAnimationFrame, useSpecviz } from "./hooks.jsx"
import { tannotation, taxis } from "./types.jsx"
import { setX, setY } from "./svg.jsx"
import { logical, trect } from "./rect.jsx"

function Playhead(props: {
  xaxis: taxis,
  yaxis: taxis,
}) {
  const { xaxis, yaxis } = props
  const { annotations, playhead, transportState } = useSpecviz()
  const svgLine = useRef<SVGLineElement>(null)

  useAnimationFrame(useCallback(
    () => {
      const line = svgLine.current!
      let focus: tannotation | undefined
      let rect: trect
      switch (transportState.type) {
        case "stop":
        case "play":
          setX(line, playhead.x)
          setY(line, 0, 1)
          break
        case "loop":
          focus = annotations.get(transportState.annotation.id) // todo: antipattern?
          if (focus == null) return
          rect = logical(focus.rect, xaxis === focus.xaxis, yaxis === focus.yaxis)
          setX(line, playhead.x)
          setY(line, rect.y, rect.y + rect.height)
          break
      }
    },
    [annotations, transportState]
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
