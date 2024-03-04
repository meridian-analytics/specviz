import * as R from "react" 
import * as AudioContext from "./AudioContext"
import * as BufferContext from "./BufferContext.js"

export type AudioLoop = [number, number, () => void]

export type AudioEffectProps = {
  seek?: number
  hpf?: number
  lpf?: number
  loop?: AudioLoop
  onEnd?: () => void
}

export default function AudioEffect(props: AudioEffectProps) {
  const audioContext = AudioContext.useContext()
  const buffer = BufferContext.useContext()
  R.useEffect(() => {
    // mutable refs
    let source: null | AudioBufferSourceNode = null
    let hpf: null | BiquadFilterNode = null
    let lpf: null | BiquadFilterNode = null
    // handlers
    const onEnd = () => {
      if (props.loop) {
        props.loop[2]()
      }
      else if (props.onEnd) {
        props.onEnd()
      }
    }
    const cleanup = () => {
      if (source) {
        source.disconnect()
        source = null
      }
      if (lpf) {
        lpf.disconnect()
        lpf = null
      }
      if (hpf) {
        hpf.disconnect()
        hpf = null
      }
    }
    // perform effect
    // hpf
    hpf = audioContext.createBiquadFilter()
    hpf.type = "highpass"
    hpf.frequency.value = props.hpf ?? 0
    hpf.Q.value = 20
    // lpf
    lpf = audioContext.createBiquadFilter()
    lpf.type = "lowpass"
    lpf.frequency.value = props.lpf ?? 200000
    lpf.Q.value = 20
    // source
    source = audioContext.createBufferSource()
    source.buffer = buffer
    source.addEventListener("ended", cleanup)
    source.addEventListener("ended", onEnd)
    // pipeline
    source.connect(lpf)
    lpf.connect(hpf)
    hpf.connect(audioContext.destination)
    // loop
    if (props.loop) {
      const seek = props.seek ?? 0
      const duration = Math.max(0, props.loop[1] - seek)
      source.start(0, seek, duration)
    }
    // play
    else {
      source.start(0, props.seek ?? 0)
    }
    // cleanup
    return () => {
      if (source) {
        source.removeEventListener("ended", onEnd)
        source.removeEventListener("ended", cleanup)
        source.stop()
      }
      cleanup()
    }
  }, [
    audioContext,
    props.seek,
    props.loop?.[0],
    props.loop?.[1],
    props.loop?.[2],
  ])
  // render empty node
  return <R.Fragment />
}