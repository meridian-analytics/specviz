import * as R from "react"
import * as Axis from "./axis"
import * as Input from "./input"
import * as Region from "./region"

const min = (5 * Math.PI) / 4
const max = -Math.PI / 4

function Encoder(props: {
  state: number
  setState: (nextState: number) => void
  value: number
  unit: string
}) {
  const { input } = Input.useContext()
  const svgRef = R.useRef<SVGSVGElement>(null)

  const { x, y } = R.useMemo(() => {
    const rad = min - props.state * (min - max)
    return { x: (Math.cos(rad) * 4) / 5, y: (-Math.sin(rad) * 4) / 5 }
  }, [props.state])

  R.useEffect(() => {
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      const dy = e.deltaY / (input.ctrl ? 10000 : 1000)
      props.setState(dy)
    }
    if (svgRef.current) {
      svgRef.current.addEventListener("wheel", onWheel, { passive: false })
    }
    return () => {
      if (svgRef.current) {
        svgRef.current.removeEventListener("wheel", onWheel)
      }
    }
  }, [input, props.setState])

  return (
    <svg ref={svgRef} width="60" height="60" viewBox="-1.1 -1.1 2.2 2.2">
      <path
        className="encoder"
        d={`
      M ${Math.cos(min)} ${-Math.sin(min)}
      A 1 1 0 1 1 ${Math.cos(max)} ${-Math.sin(max)}
    `}
      />
      <circle className="encoder-marker" cx={x} cy={y} r="0.10" />
      <text
        className="encoder-text"
        textAnchor="middle"
        x="0"
        y="0.15"
        children={props.value.toFixed(2)}
      />
      <text
        className="encoder-text"
        textAnchor="middle"
        x="0"
        y="0.45"
        children={props.unit}
      />
    </svg>
  )
}

Encoder.X = function EncoderX(region: Region.Region) {
  const regions = Region.useContext()
  const axis = Axis.useContext()
  const rect = Region.computeRectInverse(region, axis)
  return (
    <Encoder
      state={rect.x}
      setState={v => regions.setRectX(region, v)}
      value={region.x}
      unit={region.xunit}
    />
  )
}

Encoder.X2 = function EncoderX2(region: Region.Region) {
  const regions = Region.useContext()
  const axis = Axis.useContext()
  const rect = Region.computeRectInverse(region, axis)
  return (
    <Encoder
      state={rect.width}
      setState={v => regions.setRectX2(region, v)}
      value={region.width}
      unit={region.xunit}
    />
  )
}

Encoder.Y1 = function EncoderY1(region: Region.Region) {
  const regions = Region.useContext()
  const axis = Axis.useContext()
  const rect = Region.computeRectInverse(region, axis)
  return (
    <Encoder
      state={1 - rect.y}
      setState={v => regions.setRectY1(region, v)}
      value={region.y + region.height}
      unit={region.yunit}
    />
  )
}

Encoder.Y2 = function EncoderY2(region: Region.Region) {
  const regions = Region.useContext()
  const axis = Axis.useContext()
  const rect = Region.computeRectInverse(region, axis)
  return (
    <Encoder
      state={1 - rect.y - rect.height}
      setState={v => regions.setRectY2(region, v)}
      value={region.y}
      unit={region.yunit}
    />
  )
}

export default Encoder
