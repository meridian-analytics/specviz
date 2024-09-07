import * as React from "react"
import { clamp } from "./mathx"

export type Context = {
  audioContext: AudioContext
  buffer: AudioBuffer
  fx: Fx
  hasAudio: boolean
  state: State
  transport: Transport
}

export type Fx = {
  hpf?: number
  lpf?: number
  loop?: Loop
}

export type Loop = [number, number]

export type State = {
  pause: boolean
  seek: number
  timecode: number
}

export type Transport = {
  play: (seek?: number) => void
  stop: (seek?: number) => void
  seek: (seek: number) => void
  getSeek: (state: State) => number
}

export function load(url: string): Promise<AudioBuffer> {
  return fetch(url)
    .then(res => {
      if (!res.ok)
        throw Error(`Failed to load audio: ${res.status} ${res.statusText}`)
      return res.arrayBuffer()
    })
    .then(buffer => new AudioContext().decodeAudioData(buffer))
}

const defaultContext: Context = {
  audioContext: new AudioContext(),
  buffer: new AudioBuffer({
    length: 1,
    sampleRate: 44100,
  }),
  fx: {},
  hasAudio: false,
  state: {
    pause: true,
    seek: 0,
    timecode: 0,
  },
  transport: {
    play: () => {
      throw Error("play called outside of context")
    },
    stop: () => {
      throw Error("stop called outside of context")
    },
    seek: () => {
      throw Error("seek called outside of context")
    },
    getSeek: () => {
      throw Error("getSeek called outside of context")
    },
  },
}

const Context = React.createContext(defaultContext)

export type ProviderProps = {
  audioContext?: AudioContext
  buffer: AudioBuffer
  children: React.ReactNode
  fx?: Fx
}

export function Provider(props: ProviderProps) {
  const [state, setState] = React.useState(defaultContext.state)
  const transport: Transport = React.useMemo(
    () => ({
      play: seek => {
        setState(prev => {
          const nextSeek =
            seek ?? // seek or getSeek (inlined)
            (prev.pause
              ? prev.seek
              : defaultContext.audioContext.currentTime - prev.timecode)
          return {
            pause: false,
            seek: nextSeek,
            timecode: defaultContext.audioContext.currentTime - nextSeek,
          }
        })
      },
      seek: seek => {
        setState(prev => {
          const timecode = defaultContext.audioContext.currentTime - seek
          return { ...prev, seek, timecode }
        })
      },
      stop: seek => {
        setState(prev => {
          const nextSeek =
            seek ?? // seek or getSeek (inlined)
            (prev.pause
              ? prev.seek
              : defaultContext.audioContext.currentTime - prev.timecode)
          return {
            pause: true,
            seek: nextSeek,
            timecode: defaultContext.audioContext.currentTime - nextSeek,
          }
        })
      },
      getSeek: state => {
        return state.pause
          ? state.seek
          : defaultContext.audioContext.currentTime - state.timecode
      },
    }),
    [],
  )
  return (
    <Context.Provider
      children={props.children}
      value={{
        audioContext: defaultContext.audioContext,
        buffer: props.buffer,
        fx: props.fx ?? defaultContext.fx,
        hasAudio: true,
        state,
        transport,
      }}
    />
  )
}

export function useContext() {
  return React.useContext(Context)
}

export type TransformFxProps = {
  children: React.ReactNode
  fn: (fx: Fx) => Fx
}

export function TransformFx(props: TransformFxProps) {
  const prev = React.useContext(Context)
  const next = React.useMemo(
    () => ({ ...prev, fx: props.fn(prev.fx) }),
    [prev, props.fn],
  )
  return <Context.Provider children={props.children} value={next} />
}

export default function AudioEffect() {
  const audio = useContext()
  return audio.state.pause ? <React.Fragment /> : <PlayEffect />
}

function PlayEffect() {
  const { audioContext, buffer, fx, state, transport } = useContext()
  React.useEffect(() => {
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
    hpf.frequency.value = clamp(fx.hpf ?? 0, 0, 22050)
    hpf.Q.value = 20
    // lpf
    lpf = audioContext.createBiquadFilter()
    lpf.type = "lowpass"
    lpf.frequency.value = clamp(fx.lpf ?? 22050, 0, 22050)
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
    const seek = audioContext.currentTime - state.timecode
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
    state.timecode,
    transport.play,
    transport.stop,
    fx.hpf,
    fx.lpf,
    fx.loop?.[0],
    fx.loop?.[1],
  ])

  // when seek goes out of bounds, restart loop
  React.useEffect(() => {
    const seek = transport.getSeek(state)
    if (fx.loop && (seek < fx.loop[0] || seek > fx.loop[1])) {
      transport.play(fx.loop[0])
    }
  }, [
    fx.loop,
    fx.loop?.[0],
    fx.loop?.[1],
    state,
    transport.getSeek,
    transport.play,
  ])

  // render empty node
  return <React.Fragment />
}
