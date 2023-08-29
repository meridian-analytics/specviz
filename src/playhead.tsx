import { useCallback, useRef } from "react"
import { useAnimationFrame, useSpecviz } from "./hooks.jsx"
import { tregion } from "./types.jsx"
import { taxis } from "./axis.jsx"
import { setX, setY } from "./svg.jsx"
import { logical, trect } from "./rect.jsx"

function Playhead(props: {
  xaxis: taxis,
  yaxis: taxis,
}) {
  const { xaxis, yaxis } = props
  const { regions, regionCache, playhead, transportState } = useSpecviz()
  const svgLine = useRef<SVGLineElement>(null)

  useAnimationFrame(useCallback(
    () => {
      const line = svgLine.current!
      let focus: tregion | undefined
      let rect: trect
      switch (transportState.type) {
        case "stop":
        case "play":
          setX(line, playhead.x)
          setY(line, 0, 1)
          break
        case "loop":
          focus = regions.get(transportState.id) // todo: antipattern?
          if (focus == null) return
          rect = logical(
            regionCache.get(transportState.id)!,
            xaxis.unit === focus.xunit,
            yaxis.unit === focus.yunit
          )
          setX(line, playhead.x)
          setY(line, rect.y, rect.y + rect.height)
          break
      }
    },
    [regions, regionCache, transportState]
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
