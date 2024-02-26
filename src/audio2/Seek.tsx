import * as R from "react"
import * as Audio from "./Audio.jsx"

export default function Seek() {
  const audio = Audio.useAudio()
  const timeRef = R.useRef<HTMLPreElement>(null)
  useAnimationFrame(() => {
    if (timeRef.current) {
      const seek = audio.audioContext.currentTime - audio.transport.state.timecode
      timeRef.current.textContent = formatTime(seek)
    }
  }, audio.transport.state.pause)
  return <pre ref={timeRef} children={formatTime(audio.transport.state.seek)} />
}

function useAnimationFrame(
  callback: (frameId: number) => void,
  disabled?: boolean,
) {
  R.useEffect(() => {
    if (disabled) return
    let frame: number
    function onFrame(frameId: number) {
      if (!disabled) {
        callback(frameId)
        frame = requestAnimationFrame(onFrame)
      }
    }
    frame = requestAnimationFrame(onFrame)
    return () => {
      cancelAnimationFrame(frame)
    }
  }, [callback, disabled])
}

function formatTime(seconds: number): string {
  return new Date(seconds * 1000).toISOString().slice(11, 23)
}
