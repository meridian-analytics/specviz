import * as R from "react"
import * as Audio from "./audio"
import * as Hooks from "./hooks"
import * as Svg from "./svg"

export default function Playhead() {
  const line = R.useRef<SVGLineElement>(null)
  const audio = Audio.useContext()
  Hooks.useAnimationFrame(
    R.useCallback(() => {
      if (line.current && audio.buffer) {
        const seek = audio.transport.getSeek(audio.state)
        Svg.setX(line.current, seek / audio.buffer.duration)
        Svg.setY(line.current, 0, 1) // todo: y-axis on spectrograms
        Svg.show(line.current)
      }
    }, [audio.buffer, audio.state, audio.transport.getSeek]),
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
