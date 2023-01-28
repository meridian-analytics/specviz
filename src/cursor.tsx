import { useCallback, useRef } from "react"
import { useAnimationFrame } from "./hooks"
import { useSpecviz } from "./specviz"
import { formatPercent } from "./stringx"

function Cursor(props: {
  fx: (x: number) => string,
  fy: (y: number) => string,
}) {
  const { fx, fy } = props
  const { input, mouseup, zoom, scroll } = useSpecviz()
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
        const rx = (mouseup.x * zoom.x) - scroll.x
        const ry = (mouseup.y * zoom.y) - scroll.y
        layer.setAttribute("display", "inline")
        xline.setAttribute("x1", formatPercent(rx))
        xline.setAttribute("x2", formatPercent(rx))
        yline.setAttribute("y1", formatPercent(ry))
        yline.setAttribute("y2", formatPercent(ry))
        text.textContent = `(${fx(rx)}, ${fy(1 - ry)})`
        if (mouseup.x < .5) {
          text.setAttribute("x", formatPercent(rx))
          text.setAttribute("text-anchor", "start")
        }
        else {
          text.setAttribute("x", formatPercent(rx))
          text.setAttribute("text-anchor", "end")
        }
        if (mouseup.y < .5) {
          text.setAttribute("y", formatPercent(ry + 0.01))
          text.setAttribute("dominant-baseline", "hanging")
        }
        else {
          text.setAttribute("y", formatPercent(ry - 0.01))
          text.setAttribute("dominant-baseline", "text-top")
        }
      }
      else {
        layer.setAttribute("display", "none")
      }
    },
    [svgXline, svgYline, mouseup, zoom, scroll, fx, fy]
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
