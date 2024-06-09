import * as R from "react"
import * as AudioContext from "./AudioContext"

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
      {props.children}
    </Context.Provider>
  )
}

export function useContext() {
  return R.useContext(Context)
}
