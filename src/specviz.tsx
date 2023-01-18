import type { ReactNode } from "react"
import type { Sound } from "pizzicato"
import { createContext, useContext, useMemo, useRef, useState } from "react"

type tvector = { x: number, y: number }

type tfunctional<T> = (t: T) => T

type tnullable<T> = T | null

type tcontext = {
  sound: tnullable<Sound<string>>,
  scroll: tvector,
  transport: ttransport,
  transportState: ttransportstate,
  zoom: number,
  setSound: (newSound: tnullable<Sound<string>>) => void,
  setScroll: (func: tfunctional<tvector>) => void,
  setZoom: (func: tfunctional<number>) => void,
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
  scroll: { x: 0, y: 0 },
  transport: {
    play: _ => { console.error("transport.play called outside of Specviz context") },
    pause: () => { console.error("transport.pause called outside of Specviz context") },
    stop: () => { console.error("transport.stop called outside of Specviz context") },
  },
  transportState: STOP,
  zoom: 1,
  setSound: _ => { console.error("setSound called outside of Specviz context") },
  setScroll: _ => { console.error("setScroll called outside of Specviz context") },
  setZoom: _ => { console.error("setZoom called outside of Specviz context") },
})

function Specviz(props: { children: ReactNode }) {
  const { children } = props
  const [transportState, setTransportState] = useState<ttransportstate>(STOP)
  const [sound, setSound] = useState<tnullable<Sound<string>>>(null)
  const [scroll, setScroll] = useState<tvector>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

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
    scroll,
    transport,
    transportState,
    zoom,
    setSound,
    setScroll,
    setZoom,
  }}>
    {children}
  </SpecvizContext.Provider>
}

function useSpecviz() {
  return useContext(SpecvizContext)
}

export { Specviz, useSpecviz }
