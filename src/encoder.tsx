import * as R from "react"
import * as Hooks from "./hooks"
import * as T from "./types"

function Encoder(props: {
  state: number
  setState: (nextState: number) => void
  value: number
  unit: string
}) {
  const { state, setState, value, unit } = props
  const { input } = Hooks.useSpecviz()
  const svgRef = R.useRef<SVGSVGElement>(null)
  const min = (5 * Math.PI) / 4
  const max = -Math.PI / 4

  const { x, y } = R.useMemo(() => {
    const rad = min - state * (min - max)
    return { x: (Math.cos(rad) * 4) / 5, y: (-Math.sin(rad) * 4) / 5 }
  }, [state, min, max])

  R.useEffect(() => {
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      const dy = e.deltaY / (input.ctrl ? 10000 : 1000)
      setState(dy)
    }
    if (svgRef.current) {
      svgRef.current.addEventListener("wheel", onWheel, { passive: false })
    }
    return () => {
      if (svgRef.current) {
        svgRef.current.removeEventListener("wheel", onWheel)
      }
    }
  }, [input, setState])

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
  )
}

Encoder.X = function EncoderX(region: T.tregion) {
  const { command, regionCache } = Hooks.useSpecviz()
  const rect = regionCache.get(region.id)
  if (rect == null) {
    return <p>Cache Error</p>
  }
  return (
    <Encoder
      state={rect.x}
      setState={v => command.setRectX(region, v)}
      value={region.x}
      unit={region.xunit}
    />
  )
}

Encoder.X2 = function EncoderX2(region: T.tregion) {
  const { command, regionCache } = Hooks.useSpecviz()
  const rect = regionCache.get(region.id)
  if (rect == null) {
    return <p>Cache Error</p>
  }
  return (
    <Encoder
      state={rect.width}
      setState={v => command.setRectX2(region, v)}
      value={region.width}
      unit={region.xunit}
    />
  )
}

Encoder.Y1 = function EncoderY1(region: T.tregion) {
  const { command, regionCache } = Hooks.useSpecviz()
  const rect = regionCache.get(region.id)
  if (rect == null) {
    return <p>Cache Error</p>
  }
  return (
    <Encoder
      state={1 - rect.y}
      setState={v => command.setRectY1(region, v)}
      value={region.y + region.height}
      unit={region.yunit}
    />
  )
}

Encoder.Y2 = function EncoderY2(region: T.tregion) {
  const { command, regionCache } = Hooks.useSpecviz()
  const rect = regionCache.get(region.id)
  if (rect == null) {
    return <p>Cache Error</p>
  }
  return (
    <Encoder
      state={1 - rect.y - rect.height}
      setState={v => command.setRectY2(region, v)}
      value={region.y}
      unit={region.yunit}
    />
  )
}

export default Encoder
