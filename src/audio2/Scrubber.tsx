import * as R from "react"
import * as Audio from "./Audio.jsx"

export default function Scrubber() {
  const audio = Audio.useAudio()
  const [staleSeek, setStaleSeek] = R.useState(0)
  R.useEffect(() => {
    setStaleSeek(audio.transport.state.seek)
    const interval = setInterval(() => {
      if (audio.transport.state.pause) {
        setStaleSeek(audio.transport.state.seek)
      } else {
        setStaleSeek(audio.audioContext.currentTime - audio.transport.state.timecode)
      }
    }, 100)
    return () => {
      clearInterval(interval)
    }
  }, [
    audio.audioContext,
    audio.transport.state.seek,
    audio.transport.state.pause,
    audio.transport.state.timecode,
  ])
  return (
    <input
    type="range"
      min={0}
      max={audio.buffer.duration}
      value={staleSeek}
      step={0.001}
      onChange={e => audio.transport.seek(Number(e.target.value))}
    />
  )
}