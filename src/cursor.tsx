import * as R from "react"
import * as Axis from "./axis"
import * as Format from "./format"
import * as Hooks from "./hooks"
import * as Specviz from "./specviz"
import * as Svg from "./svg"

function Cursor(props: {
  parent: R.RefObject<SVGGElement>
  xaxis: Axis.taxis
  yaxis: Axis.taxis
}) {
  const { input, mouseup, unitUp } = Specviz.useContext()
  const svgLayer = R.useRef<SVGGElement>(null)
  const svgXline = R.useRef<SVGLineElement>(null)
  const svgYline = R.useRef<SVGLineElement>(null)
  const svgText = R.useRef<SVGTextElement>(null)
  Hooks.useAnimationFrame(
    R.useCallback(() => {
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
          Svg.show(layer)
          // x line
          if (
            props.parent.current == input.focus ||
            props.xaxis == input.xaxis
          ) {
            x = Axis.formatUnit(props.xaxis, unitUp.x)
            Svg.setX(xline, mouseup.rel.x, undefined, Format.percent)
            Svg.show(xline)
          } else {
            x = ""
            Svg.hide(xline)
          }
          // y line
          if (
            props.parent.current == input.focus ||
            props.yaxis == input.yaxis
          ) {
            y = Axis.formatUnit(props.yaxis, unitUp.y)
            Svg.setY(yline, mouseup.rel.y, undefined, Format.percent)
            Svg.show(yline)
          } else {
            y = ""
            Svg.hide(yline)
          }
          // text
          Svg.setText(text, x && y ? `(${x}, ${y})` : x || y)
          Svg.setAnchor(text, mouseup.rel, Format.percent)
        } else {
          Svg.hide(layer)
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
