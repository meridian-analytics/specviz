import * as R from "react"
import * as AudioContext from "./AudioContext"
import * as BufferContext from "./BufferContext"
import * as FxContext from "./FxContext"
import * as TransportContext from "./TransportContext"

export default function AudioEffect() {
  const transport = TransportContext.useContext()
  return transport.state.pause ? <R.Fragment /> : <PlayEffect />
}

function PlayEffect() {
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
      } else {
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
    // seek
    const seek = audioContext.currentTime - transport.state.timecode
    // loop
    if (fx.loop) {
      const duration = Math.max(0, fx.loop[1] - seek)
      source.start(0, seek, duration)
    }
    // play
    else {
      source.start(0, seek)
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
    buffer,
    transport.play,
    transport.stop,
    transport.state.timecode,
    fx.hpf,
    fx.lpf,
    fx.loop?.[0],
    fx.loop?.[1],
  ])

  // when seek goes out of bounds, restart loop
  R.useEffect(() => {
    const seek = transport.getSeek(transport.state)
    if (fx.loop && (seek < fx.loop[0] || seek > fx.loop[1])) {
      transport.play(fx.loop[0])
    }
  }, [
    fx.loop,
    fx.loop?.[0],
    fx.loop?.[1],
    transport.getSeek,
    transport.play,
    transport.state,
  ])

  // render empty node
  return <R.Fragment />
}
