import { useCallback, useRef } from "react"
import * as Audio2 from "./audio2"
import { useAnimationFrame } from "./hooks"
import { taxis } from "./axis"
import { setX, setY } from "./svg"

function Playhead(props: {
  xaxis: taxis,
  yaxis: taxis,
}) {
  const line = useRef<SVGLineElement>(null)
  const { buffer, transport } = Audio2.useAudio()
  useAnimationFrame(useCallback(
    () => {
      if (line.current) {
        const seek = transport.getSeek(transport.state)
        setX(line.current, seek / buffer.duration)
        setY(line.current, 0, 1) // todo: y-axis on spectrograms
      }
    },
    [
      buffer.duration,
      transport.getSeek,
      transport.state,
    ]
  ))
  

  return <line
    ref={line}
    className="playhead"
    x1="0"
    y1="0"
    x2="0"
    y2="100%"
  />
}

export default Playhead
