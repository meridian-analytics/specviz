import * as R from "react"
import * as AudioContext from "./AudioContext.js"
import * as FxContext from "./FxContext.js"
import AudioEffect from "./AudioEffect.js"

export type State = {
  pause: boolean
  seek: number
  timecode: number
}

function clampLoop(seek: number, loop: [number, number]) {
  return (
    // left bound
    seek < loop[0]
      ? loop[0]
      : // right bound
        seek > loop[1]
        ? loop[0]
        : // in bound
          seek
  )
}

export type Context = {
  state: State
  play: (seek?: number) => void
  stop: (seek?: number) => void
  seek: (seek: number) => void
  getSeek: (state: State) => number
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
  const fx = FxContext.useContext()
  const [state, setState] = R.useState(() => defaultContext.state)
  
  const play: Context["play"] = seek => {
    setState(prev => {
      const nextSeek = seek ?? getSeek(prev)
      return {
        pause: false,
        seek: nextSeek,
        timecode: audioContext.currentTime - nextSeek,
      }
    })
  }

  const seek: Context["seek"] = seek => {
    setState(prev => {
      const timecode = audioContext.currentTime - seek
      return { ...prev, seek, timecode }
    })
  }

  const stop: Context["stop"] = seek => {
    setState(prev => {
      const nextSeek = seek ?? getSeek(prev)
      return {
        pause: true,
        seek: nextSeek,
        timecode: audioContext.currentTime - nextSeek,
      }
    })
  }

  const getSeek: Context["getSeek"] = state => {
    return state.pause
      ? state.seek
      : fx.loop
        ? clampLoop(audioContext.currentTime - state.timecode, fx.loop)
        : audioContext.currentTime - state.timecode
  }

  const derivedSeek = getSeek(state)

  return (
    <Context.Provider
      value={{
        play,
        seek,
        state: {
          ...state,
          seek: derivedSeek,
          timecode: audioContext.currentTime - derivedSeek,
        },  
        stop,
        getSeek,
      }}
    >
      {!state.pause && (
        <AudioEffect />
      )}
      {props.children}
    </Context.Provider>
  )
}

export function useContext() {
  return R.useContext(Context)
}
