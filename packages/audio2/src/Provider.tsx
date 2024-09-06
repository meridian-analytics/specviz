import * as R from "react"
import * as AudioContext from "./AudioContext"
import * as BufferContext from "./BufferContext"
import * as TransportContext from "./TransportContext"

type Context = {
  audioContext: AudioContext.Context
  buffer: BufferContext.Context
  transport: TransportContext.Context
}

export type ProviderProps = {
  children: R.ReactNode
  fallback?: R.ReactNode
  url: string
}

export function Provider(props: ProviderProps) {
  return (
    <AudioContext.Provider>
      <BufferContext.Provider fallback={props.fallback} url={props.url}>
        <TransportContext.Provider children={props.children} hasAudio={true} />
      </BufferContext.Provider>
    </AudioContext.Provider>
  )
}

export function useContext(): Context {
  const audioContext = AudioContext.useContext()
  const buffer = BufferContext.useContext()
  const transport = TransportContext.useContext()
  return R.useMemo(
    () => ({
      audioContext,
      buffer,
      transport,
    }),
    [audioContext, buffer, transport],
  )
}
