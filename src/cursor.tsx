import { RefObject, useCallback, useRef } from "react"
import { taxis } from "./axis"
import { formatUnit } from "./axis"
import { useAnimationFrame, useSpecviz } from "./hooks"
import { formatPercent } from "./stringx"
import { hide, setAnchor, setText, setX, setY, show } from "./svg"

function Cursor(props: {
  parent: RefObject<SVGGElement>
  xaxis: taxis
  yaxis: taxis
}) {
  const { input, mouseup, unitUp } = useSpecviz()
  const svgLayer = useRef<SVGGElement>(null)
  const svgXline = useRef<SVGLineElement>(null)
  const svgYline = useRef<SVGLineElement>(null)
  const svgText = useRef<SVGTextElement>(null)
  useAnimationFrame(
    useCallback(() => {
      if (
        svgLayer.current &&
        svgXline.current &&
        svgYline.current &&
        svgText.current &&
        props.parent.current
      ) {
        const layer = svgLayer.current
        if (input.alt) {
          const xline = svgXline.current
          const yline = svgYline.current
          const text = svgText.current
          let x: string
          let y: string
          show(layer)
          // x line
          if (
            props.parent.current == input.focus ||
            props.xaxis == input.xaxis
          ) {
            x = formatUnit(props.xaxis, unitUp.x)
            setX(xline, mouseup.rel.x, undefined, formatPercent)
            show(xline)
          } else {
            x = ""
            hide(xline)
          }
          // y line
          if (
            props.parent.current == input.focus ||
            props.yaxis == input.yaxis
          ) {
            y = formatUnit(props.yaxis, unitUp.y)
            setY(yline, mouseup.rel.y, undefined, formatPercent)
            show(yline)
          } else {
            y = ""
            hide(yline)
          }
          // text
          setText(text, x && y ? `(${x}, ${y})` : x || y)
          setAnchor(text, mouseup.rel, formatPercent)
        } else {
          hide(layer)
        }
      }
    }, [props, input, mouseup, unitUp]),
  )

  return (
    <g ref={svgLayer}>
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
      <text ref={svgText} className="cursor-text" x="0" y="0" children="0:00" />
    </g>
  )
}

export default Cursor
