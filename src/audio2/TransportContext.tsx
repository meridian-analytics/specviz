import * as R from "react"
import * as AudioContext from "./AudioContext"
import AudioEffect from "./AudioEffect"
import * as FxContext from "./FxContext"

export type State = {
  pause: boolean
  seek: number
  timecode: number
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
    return state.pause ? state.seek : audioContext.currentTime - state.timecode
  }

  R.useEffect(() => {
    setState(prev => {
      const seek = getSeek(prev)
      if (fx.loop && (seek < fx.loop[0] || seek > fx.loop[1])) {
        return {
          pause: prev.pause,
          seek: fx.loop[0],
          timecode: audioContext.currentTime - fx.loop[0],
        }
      }
      return prev
    })
  }, [audioContext, getSeek, fx.loop, fx.loop?.[0], fx.loop?.[1]])

  return (
    <Context.Provider
      value={{
        play,
        seek,
        state,
        stop,
        getSeek,
      }}
    >
      {!state.pause && <AudioEffect />}
      {props.children}
    </Context.Provider>
  )
}

export function useContext() {
  return R.useContext(Context)
}
