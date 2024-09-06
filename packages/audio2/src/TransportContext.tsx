import * as R from "react"
import * as AudioContext from "./AudioContext"

export type State = {
  pause: boolean
  seek: number
  timecode: number
}

export type Context = {
  state: State
  hasAudio: boolean
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
  hasAudio: false,
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
  hasAudio?: boolean
}

export function Provider(props: ProviderProps) {
  const audioContext = AudioContext.useContext()
  const [state, setState] = R.useState(() => defaultContext.state)

  const play: Context["play"] = R.useCallback(
    seek => {
      setState(prev => {
        const nextSeek = seek ?? getSeek(prev)
        return {
          pause: false,
          seek: nextSeek,
          timecode: audioContext.currentTime - nextSeek,
        }
      })
    },
    [audioContext],
  )

  const seek: Context["seek"] = R.useCallback(
    seek => {
      setState(prev => {
        const timecode = audioContext.currentTime - seek
        return { ...prev, seek, timecode }
      })
    },
    [audioContext],
  )

  const stop: Context["stop"] = R.useCallback(
    seek => {
      setState(prev => {
        const nextSeek = seek ?? getSeek(prev)
        return {
          pause: true,
          seek: nextSeek,
          timecode: audioContext.currentTime - nextSeek,
        }
      })
    },
    [audioContext],
  )

  const getSeek: Context["getSeek"] = R.useCallback(
    state => {
      return state.pause
        ? state.seek
        : audioContext.currentTime - state.timecode
    },
    [audioContext],
  )

  const value = R.useMemo(
    () => ({
      state,
      hasAudio: props.hasAudio ?? false,
      play,
      seek,
      stop,
      getSeek,
    }),
    [state, props.hasAudio, play, seek, stop, getSeek],
  )

  return <Context.Provider children={props.children} value={value} />
}

export function useContext() {
  return R.useContext(Context)
}
