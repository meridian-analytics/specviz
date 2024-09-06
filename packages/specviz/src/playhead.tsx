import * as R from "react"
import * as Audio2 from "../../audio2/src"
import * as Hooks from "./hooks"
import * as Svg from "./svg"

function Playhead() {
  const line = R.useRef<SVGLineElement>(null)
  const { buffer, transport } = Audio2.useContext()
  Hooks.useAnimationFrame(
    R.useCallback(() => {
      if (line.current && transport.hasAudio) {
        const seek = transport.getSeek(transport.state)
        Svg.setX(line.current, seek / buffer.duration)
        Svg.setY(line.current, 0, 1) // todo: y-axis on spectrograms
        Svg.show(line.current)
      }
    }, [
      buffer.duration,
      transport.getSeek,
      transport.hasAudio,
      transport.state,
    ]),
  )

  return (
    <line
      ref={line}
      className="playhead"
      display="none"
      x1="0"
      y1="0"
      x2="0"
      y2="100%"
    />
  )
}

export default Playhead
