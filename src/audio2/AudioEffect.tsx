import * as R from "react" 
import * as AudioContext from "./AudioContext"
import * as BufferContext from "./BufferContext.js"
import * as FxContext from "./FxContext.js"
import * as TransportContext from "./TransportContext.js"

export default function AudioEffect() {
  const audioContext = AudioContext.useContext()
  const buffer = BufferContext.useContext()
  const fx = FxContext.useContext()
  const transport = TransportContext.useContext()
  R.useEffect(() => {
    // mutable refs
    let source: null | AudioBufferSourceNode = null
    let hpf: null | BiquadFilterNode = null
    let lpf: null | BiquadFilterNode = null
    // handlers
    const onEnd = () => {
      if (fx.loop) {
        transport.play(fx.loop[0])
      }
      else {
        transport.stop(0)
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
    hpf.frequency.value = fx.hpf ?? 0
    hpf.Q.value = 20
    // lpf
    lpf = audioContext.createBiquadFilter()
    lpf.type = "lowpass"
    lpf.frequency.value = fx.lpf ?? 200000
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
    if (fx.loop) {
      const duration = Math.max(0, fx.loop[1] - transport.state.seek)
      source.start(0, transport.state.seek, duration)
    }
    // play
    else {
      source.start(0, transport.state.seek)
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
    transport.play,
    transport.stop,
    transport.state.seek,
    fx.loop?.[0],
    fx.loop?.[1],
  ])
  // render empty node
  return <R.Fragment />
}