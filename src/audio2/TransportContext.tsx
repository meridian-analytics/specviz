import * as R from "react"
import * as AudioContext from "./AudioContext.jsx"
import * as BufferContext from "./BufferContext.jsx"

type AudioLoop = [number, number]

export type State = {
  hpf?: number
  loop?: [number, number]
  lpf?: number
  pause: boolean
  seek: number
  timecode: number
}

export function clampLoop(seek: number, start: number, end: number) {
  return (
    // left bound
    seek < start
      ? start
      : // right bound
        seek > end
        ? start
        : // in bound
          seek
  )
}

function AudioEffect() {
  const audioContext = AudioContext.useContext()
  const buffer = BufferContext.useContext()
  const transport = R.useContext(Context)
  R.useEffect(() => {
    // mutable refs
    let source: null | AudioBufferSourceNode = null
    let hpf: null | BiquadFilterNode = null
    let lpf: null | BiquadFilterNode = null
    // handlers
    const onEnd = () => {
      if (transport.state.loop) transport.onLoop(transport.state.loop)
      else transport.onEnd()
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
    if (!transport.state.pause) {
      // hpf
      hpf = audioContext.createBiquadFilter()
      hpf.type = "highpass"
      if (transport.state.hpf) hpf.frequency.value = transport.state.hpf
      // hpf.Q.value = 3
      // lpf
      lpf = audioContext.createBiquadFilter()
      lpf.type = "lowpass"
      if (transport.state.lpf) lpf.frequency.value = transport.state.lpf
      // lpf.Q.value = 3
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
      if (transport.state.loop) {
        const seek = transport.state.seek ?? 0
        const duration = Math.max(0, transport.state.loop[1] - seek)
        source.start(0, seek, duration)
      }
      // play
      else {
        source.start(0, transport.state.seek ?? 0)
      }
    } else {
      // stop
      // (play nothing)
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
    transport,
    transport.state.loop?.[0],
    transport.state.loop?.[1],
  ])

  return <R.Fragment />
}

export type Context = {
  state: State
  play: () => void
  stop: () => void
  loop: (loop: AudioLoop, play?: boolean) => void
  unloop: () => void
  seek: (seek: number) => void
  setHpf: (value: number) => void
  setLpf: (value: number) => void
  onEnd: () => void
  onLoop: (loop: AudioLoop) => void
  getSeek: () => number
}

const defaultContext: Context = {
  state: {
    pause: true,
    seek: 0,
    timecode: 0,
  },
  play() {
    throw Error("play called outside of context")
  },
  stop() {
    throw Error("stop called outside of context")
  },
  seek() {
    throw Error("seek called outside of context")
  },
  loop() {
    throw Error("loop called outside of context")
  },
  unloop() {
    throw Error("unloop called outside of context")
  },
  setHpf() {
    throw Error("setHpf called outside of context")
  },
  setLpf() {
    throw Error("setLpf called outside of context")
  },
  onEnd() {
    throw Error("onEnd called outside of context")
  },
  onLoop() {
    throw Error("onLoop called outside of context")
  },
  getSeek() {
    throw Error("getSeek called outside of context")
  },
}

const Context = R.createContext(defaultContext)

type ProviderProps = {
  children: R.ReactNode
}

export function Provider(props: ProviderProps) {
  const audioContext = AudioContext.useContext()
  const buffer = BufferContext.useContext()
  const [state, setState] = R.useState<Context["state"]>({
    pause: true,
    seek: 0,
    hpf: 0,
    lpf: 20000,
    timecode: 0,
  })

  const loop: Context["loop"] = ([loopStart, loopEnd], autoplay) => {
    if (
      // invalid inputs
      Number.isNaN(loopStart) ||
      Number.isNaN(loopEnd) ||
      // loopStart out of bounds
      loopStart < 0 ||
      loopStart > buffer.duration ||
      // loopEnd out of bounds
      loopEnd < 0 ||
      loopEnd > buffer.duration ||
      // invalid loop
      loopStart >= loopEnd
    ) {
      return
    }
    setState(prev => {
      if (prev.pause) {
        const seek = clampLoop(prev.seek, loopStart, loopEnd)
        return autoplay
          ? {
            ...prev,
            seek,
            loop: [loopStart, loopEnd],
            pause: false,
            timecode: audioContext.currentTime - seek,
          }
          : {
            ...prev,
            seek,
            loop: [loopStart, loopEnd],
          }
      }

      const seek = audioContext.currentTime - prev.timecode
      const safeSeek = clampLoop(seek, loopStart, loopEnd)

      return {
        ...prev,
        loop: [loopStart, loopEnd],
        seek: safeSeek,
        timecode: audioContext.currentTime - safeSeek,
      }
    })
  }

  const onEnd: Context["onEnd"] = () => {
    setState(prev => {
      return { ...prev, pause: true, seek: 0, timecode: 0 }
    })
  }

  const onLoop: Context["onLoop"] = ([start, _end]) => {
    setState(prev => {
      if (prev.pause) return { ...prev, seek: start }
      const timecode = audioContext.currentTime - start
      return { ...prev, seek: start, timecode }
    })
  }

  const play: Context["play"] = () => {
    setState(prev => {
      if (!prev.pause) return prev
      const timecode = audioContext.currentTime - prev.seek
      return { ...prev, pause: false, timecode }
    })
  }

  const seek: Context["seek"] = seek => {
    setState(prev => {
      const timecode = audioContext.currentTime - seek
      const loop =
        prev.loop && prev.loop[0] <= seek && seek <= prev.loop[1]
          ? prev.loop
          : undefined
      return { ...prev, seek, loop, timecode }
    })
  }

  const setHpf: Context["setHpf"] = hpf => {
    setState(prev => {
      if (prev.pause) return { ...prev, hpf }
      const seek = audioContext.currentTime - prev.timecode
      return { ...prev, seek, hpf }
    })
  }

  const setLpf: Context["setLpf"] = lpf => {
    setState(prev => {
      if (prev.pause) return { ...prev, lpf }
      const seek = audioContext.currentTime - prev.timecode
      return { ...prev, seek, lpf }
    })
  }

  const stop: Context["stop"] = () => {
    setState(prev => {
      if (prev.pause) return prev
      const timecode = audioContext.currentTime
      const seek = timecode - prev.timecode
      return {
        ...prev,
        pause: true,
        seek,
        timecode,
      }
    })
  }

  const unloop: Context["unloop"] = () => {
    setState(prev => {
      if (prev.pause)
        return {
          ...prev,
          loop: undefined,
        }
      return {
        ...prev,
        seek: audioContext.currentTime - prev.timecode,
        loop: undefined,
      }
    })
  }

  const getSeek: Context["getSeek"] = () => {
    if (state.pause) return state.seek
    return audioContext.currentTime - state.timecode
  }

  return (
    <Context.Provider
      value={{
        loop,
        onEnd,
        onLoop,
        play,
        seek,
        setHpf,
        setLpf,
        state,
        stop,
        unloop,
        getSeek,
      }}
    >
      <AudioEffect />
      {props.children}
    </Context.Provider>
  )
}

export function useContext() {
  return R.useContext(Context)
}
