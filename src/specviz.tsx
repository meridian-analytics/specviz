import type { ReactNode, RefObject } from "react"
import type { Sound } from "pizzicato"
import { createContext, useContext, useMemo, useRef, useState } from "react"

type tvector3 = { x: number, y: number, z: number }

type tnullable<T> = T | null

type tcontext = {
  sound: tnullable<Sound<string>>,
  scrollZoom: RefObject<tvector3>,
  transport: ttransport,
  transportState: ttransportstate,
  setSound: (newSound: tnullable<Sound<string>>) => void,
}

type ttransportstate =
  | { type: "play", offset: number, timeRef: number }
  | { type: "pause", offset: number }
  | { type: "stop", offset: number }

type ttransport = {
  play: (offset?: number) => void,
  pause: () => void,
  stop: () => void,
}

const STOP: ttransportstate = { type: "stop", offset: 0 }
const NOOP = () => {}

const SpecvizContext = createContext<tcontext>({
  sound: null,
  scrollZoom: { current: { x: 0, y: 0, z: 1 } },
  transport: {
    play: _ => { console.error("transport.play called outside of Specviz context") },
    pause: () => { console.error("transport.pause called outside of Specviz context") },
    stop: () => { console.error("transport.stop called outside of Specviz context") },
  },
  transportState: STOP,
  setSound: _ => { console.error("setSound called outside of Specviz context") },
})

function Specviz(props: { children: ReactNode }) {
  const { children } = props
  const [transportState, setTransportState] = useState<ttransportstate>(STOP)
  const [sound, setSound] = useState<tnullable<Sound<string>>>(null)
  const scrollZoom = useRef<tvector3>({ x: 0, y: 0, z: 1 })

  const transport = useMemo(
    () => {
      if (sound == null) {
        return {
          play: NOOP,
          pause: NOOP,
          stop: NOOP,
        }
      }
      else switch (transportState.type) {
        case "stop":
        case "pause":
          return {
            play: (offset?: number) => {
              if (offset == null) {
                sound.play(0, transportState.offset)
                setTransportState({ type: "play", offset: transportState.offset, timeRef: Date.now() })
              }
              else {
                sound.play(0, offset)
                setTransportState({ type: "play", offset, timeRef: Date.now() })
              }
            },
            pause: NOOP,
            stop: NOOP
          }
        case "play":
          return {
            play: NOOP,
            pause: () => {
              sound.pause()
              setTransportState({ type: "pause", offset: transportState.offset + (Date.now() - transportState.timeRef) / 1000 })
            },
            stop: () => {
              sound.stop()
              setTransportState(STOP)
            }
          }
      }
    },
    [sound, transportState]
  )

  return <SpecvizContext.Provider value={{
    sound,
    scrollZoom,
    transport,
    transportState,
    setSound,
  }}>
    {children}
  </SpecvizContext.Provider>
}

function useSpecviz() {
  return useContext(SpecvizContext)
}

export { Specviz, useSpecviz }
