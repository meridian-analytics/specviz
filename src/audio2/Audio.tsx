import * as R from "react"
import * as AudioContext from "./AudioContext"
import * as BufferContext from "./BufferContext"
import * as FxContext from "./FxContext"
import * as TransportContext from "./TransportContext"

export type AudioProps = {
  children: R.ReactNode
  url: string
}

export function Audio(props: AudioProps) {
  return (
    <AudioContext.Provider>
      <BufferContext.Provider url={props.url}>
        <TransportContext.Provider children={props.children} />
      </BufferContext.Provider>
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const audioContext = AudioContext.useContext()
  const buffer = BufferContext.useContext()
  const fx = FxContext.useContext()
  const transport = TransportContext.useContext()
  return R.useMemo(
    () => ({
      audioContext,
      buffer,
      fx,
      transport,
    }),
    [audioContext, buffer, fx, transport],
  )
}
