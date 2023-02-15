import { RefObject, useCallback, useRef } from "react"
import { taxis } from "./types"
import { useAnimationFrame } from "./hooks"
import { useSpecviz } from "./specviz"
import { formatPercent } from "./stringx"
import { formatUnit } from "./axis"
import { hide, show, setAnchor, setText, setX, setY } from "./svg"

function Cursor(props: {
  parent: RefObject<SVGGElement>,
  xaxis: taxis,
  yaxis: taxis,
}) {
  const { parent, xaxis, yaxis } = props
  const { input, mouseup, unitUp } = useSpecviz()
  const svgLayer = useRef<SVGGElement>(null)
  const svgXline = useRef<SVGLineElement>(null)
  const svgYline = useRef<SVGLineElement>(null)
  const svgText = useRef<SVGTextElement>(null)
  useAnimationFrame(useCallback(
    () => {
      const layer = svgLayer.current!
      if (input.alt) {
        const xline = svgXline.current!
        const yline = svgYline.current!
        const text = svgText.current!
        let x: string
        let y: string
        show(layer)
        // x line
        if (parent.current == input.focus || xaxis == input.xaxis) {
          x = formatUnit(xaxis, unitUp.x)
          setX(xline, mouseup.rel.x, undefined, formatPercent)
          show(xline)
        }
        else {
          x = ""
          hide(xline)
        }
        // y line
        if (parent.current == input.focus || yaxis == input.yaxis) {
          y = formatUnit(yaxis, unitUp.y)
          setY(yline, mouseup.rel.y, undefined, formatPercent)
          show(yline)
        }
        else {
          y = ""
          hide(yline)
        }
        // text
        setText(text, x && y ? `(${x}, ${y})` : x || y)
        setAnchor(text, mouseup.rel, formatPercent)
      }
      else {
        hide(layer)
      }
    },
    [xaxis, yaxis]
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
