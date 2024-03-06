import * as R from "react"
import * as Audio2 from "./audio2"
import * as Axis from "./axis"
import * as Hooks from "./hooks"
import * as Svg from "./svg"

function Playhead(props: {
  xaxis: Axis.taxis
  yaxis: Axis.taxis
}) {
  const line = R.useRef<SVGLineElement>(null)
  const { buffer, transport } = Audio2.useAudio()
  Hooks.useAnimationFrame(
    R.useCallback(() => {
      if (line.current) {
        const seek = transport.getSeek(transport.state)
        Svg.setX(line.current, seek / buffer.duration)
        Svg.setY(line.current, 0, 1) // todo: y-axis on spectrograms
      }
    }, [buffer.duration, transport.getSeek, transport.state]),
  )

  return <line ref={line} className="playhead" x1="0" y1="0" x2="0" y2="100%" />
}

export default Playhead
