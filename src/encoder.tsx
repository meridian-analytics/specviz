import { useEffect, useMemo, useRef } from "react"
import { useSpecviz } from "./specviz"

function Encoder(props: {
  state: number,
  setState: (nextState: number) => void,
  value: number,
  unit: string,
}) {
  const { state, setState, value, unit } = props
  const { input } = useSpecviz()
  const svgRef = useRef<SVGSVGElement>(null)
  const min = 5*Math.PI/4
  const max = -Math.PI/4

  const { x, y } = useMemo(
    () => {
      const rad = min - state * (min - max)
      return { x: Math.cos(rad) * 4/5, y: -Math.sin(rad) * 4/5}
    },
    [state]
  )

  useEffect(
    () => {
      const elem = svgRef.current!
      function onWheel(e: WheelEvent) {
        e.preventDefault()
        const dy = e.deltaY / (input.ctrl ? 10000 : 1000)
        setState(dy)
      }
      elem.addEventListener("wheel", onWheel, { passive: false })
      return () => {
        elem.removeEventListener("wheel", onWheel)
      }
    },
    [setState]
  )

  return <svg
    ref={svgRef}
    width="60"
    height="60"
    viewBox="-1.1 -1.1 2.2 2.2">
    <path className="encoder" d={`
      M ${Math.cos(min)} ${-Math.sin(min)}
      A 1 1 0 1 1 ${Math.cos(max)} ${-Math.sin(max)}
    `} />
    <circle
      className="encoder-marker"
      cx={x}
      cy={y}
      r="0.10"
    />
    <text
      className="encoder-text"
      textAnchor="middle"
      x="0"
      y="0.15"
      children={value.toFixed(2)}
    />
    <text
      className="encoder-text"
      textAnchor="middle"
      x="0"
      y="0.45"
      children={unit}
    />
  </svg>
}

export default Encoder
