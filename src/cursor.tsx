import { RefObject, useCallback, useRef } from "react"
import { taxis } from "./types"
import { useAnimationFrame } from "./hooks"
import { useSpecviz } from "./specviz"
import { formatPercent } from "./stringx"
import { formatUnit } from "./axis"

function Cursor(props: {
  parent: RefObject<SVGGElement>,
  xaxis: taxis,
  yaxis: taxis,
}) {
  const { parent } = props
  const { input, mouseup, unitUp } = useSpecviz()
  const svgLayer = useRef<SVGGElement>(null)
  const svgXline = useRef<SVGLineElement>(null)
  const svgYline = useRef<SVGLineElement>(null)
  const svgText = useRef<SVGTextElement>(null)
  useAnimationFrame(useCallback(
    () => {
      const layer = svgLayer.current!
      const xline = svgXline.current!
      const yline = svgYline.current!
      const text = svgText.current!
      if (input.alt) {
        layer.setAttribute("display", "inline")
        // x line
        if (parent.current == input.focus || props.xaxis == input.xaxis) {
          xline.setAttribute("x1", formatPercent(mouseup.rel.x))
          xline.setAttribute("x2", formatPercent(mouseup.rel.x))
          xline.setAttribute("display", "inline")
        }
        else {
          xline.setAttribute("display", "none")
        }
        // y line
        if (parent.current == input.focus || props.yaxis == input.yaxis) {
          yline.setAttribute("y1", formatPercent(mouseup.rel.y))
          yline.setAttribute("y2", formatPercent(mouseup.rel.y))
          yline.setAttribute("display", "inline")
        }
        else {
          yline.setAttribute("display", "none")
        }
        // text
        text.textContent = `(${formatUnit(props.xaxis, unitUp.x)}, ${formatUnit(props.yaxis, unitUp.y)})`
        if (mouseup.abs.x < .5) {
          text.setAttribute("x", formatPercent(mouseup.rel.x))
          text.setAttribute("text-anchor", "start")
        }
        else {
          text.setAttribute("x", formatPercent(mouseup.rel.x))
          text.setAttribute("text-anchor", "end")
        }
        if (mouseup.abs.y < .5) {
          text.setAttribute("y", formatPercent(mouseup.rel.y + 0.01))
          text.setAttribute("dominant-baseline", "hanging")
        }
        else {
          text.setAttribute("y", formatPercent(mouseup.rel.y - 0.01))
          text.setAttribute("dominant-baseline", "text-top")
        }
      }
      else {
        layer.setAttribute("display", "none")
      }
    },
    [svgXline, svgYline]
  ))

  return <g ref={svgLayer}>
    <line
      ref={svgXline}
      className="cursor-x"
      x1="0"
      y1="0"
      x2="0"
      y2="100%"
    />
    <line
      ref={svgYline}
      className="cursor-y"
      x1="0"
      y1="0"
      x2="100%"
      y2="0"
    />
    <text
      ref={svgText}
      className="cursor-text"
      x="0"
      y="0"
      children="0:00"
    />
  </g>
}

export default Cursor
