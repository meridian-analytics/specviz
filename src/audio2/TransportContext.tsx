import * as R from "react"
import * as AudioContext from "./AudioContext.js"
import AudioEffect, * as AE from "./AudioEffect.js"

export type State = {
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

export type Context = {
  state: State
  play: () => void
  stop: () => void
  seek: (seek: number) => void
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
}

const Context = R.createContext(defaultContext)

export interface FxContext {
  hpf?: number
  lpf?: number
  loop?: [number, number]
}

type ProviderProps = {
  fx: R.Context<FxContext>
  children: R.ReactNode
}

export function Provider(props: ProviderProps) {
  const audioContext = AudioContext.useContext()
  const [state, setState] = R.useState(defaultContext.state)

  const audioFx = R.useContext(props.fx)

  const onEnd: AE.AudioEffectProps["onEnd"] = () => {
    setState(prev => {
      return { ...prev, pause: true, seek: 0 }
    })
  }

  const derivedLoop: AE.AudioEffectProps["loop"] = audioFx.loop
    ? [audioFx.loop[0], audioFx.loop[1], () => {
      setState(prev => {
        if (prev.pause || !audioFx.loop) return prev
        const timecode = audioContext.currentTime - audioFx.loop[0]
        return { ...prev, seek: audioFx.loop[0], timecode }
      })
    }]
    : undefined

  const derivedHpf: AE.AudioEffectProps["hpf"] = audioFx.hpf ?? 0

  const derivedLpf: AE.AudioEffectProps["lpf"] = audioFx.lpf ?? 24000

  const derivedSeek: State["seek"] = state.pause
    ? state.seek
    : audioContext.currentTime - state.timecode

  const derivedSafeSeek: State["seek"] = derivedLoop
    ? clampLoop(derivedSeek, derivedLoop[0], derivedLoop[1])
    : derivedSeek

  const derivedTimecode: State["timecode"] =
    audioContext.currentTime - derivedSafeSeek
  
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
      return { ...prev, seek, timecode }
    })
  }

  const stop: Context["stop"] = () => {
    setState(prev => {
      if (prev.pause) return prev
      const timecode = audioContext.currentTime
      const seek = timecode - derivedTimecode
      return {
        ...prev,
        pause: true,
        seek,
        timecode,
      }
    })
  }

  return (
    <Context.Provider
      value={{
        play,
        seek,
        state: {
          pause: state.pause,
          seek: derivedSafeSeek,
          timecode: derivedTimecode,
        },
        stop,
      }}
    >
      {!state.pause && (
        <AudioEffect
          seek={derivedSafeSeek}
          hpf={derivedHpf}
          lpf={derivedLpf}
          loop={derivedLoop}
          onEnd={onEnd}
        />
      )}
      {props.children}
    </Context.Provider>
  )
}

export function useContext() {
  return R.useContext(Context)
}
