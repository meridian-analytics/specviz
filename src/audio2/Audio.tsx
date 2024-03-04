import * as R from "react" 
import * as AudioContext from "./AudioContext.js"
import * as BufferContext from "./BufferContext.js"
import * as FxContext from "./FxContext.js"
import * as TransportContext from "./TransportContext.js"

export type AudioProps = {
  children: R.ReactNode
  url: string
}

export function Audio(props: AudioProps) {
  return (
    <AudioContext.Provider>
      <BufferContext.Provider url={props.url}>
        <TransportContext.Provider>
          {props.children}
        </TransportContext.Provider>
      </BufferContext.Provider>
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const audioContext = AudioContext.useContext()
  const buffer = BufferContext.useContext()
  const fx = FxContext.useContext()
  const transport = TransportContext.useContext()
  return R.useMemo(() => ({
    audioContext,
    buffer,
    fx,
    transport,
  }), [
    audioContext,
    buffer,
    fx,
    transport,
  ])
}