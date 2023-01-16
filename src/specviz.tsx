import type { ReactNode } from "react"
import type { Sound } from "pizzicato"
import { createContext, useContext, useMemo, useState } from "react"

type tvector = { x: number, y: number }

type tfunctional<T> = (t: T) => T

type tnullable<T> = T | null

type tcontext = {
  sound: tnullable<Sound<string>>,
  scroll: tvector,
  transport: ttransport,
  zoom: number,
  setSound: (newSound: tnullable<Sound<string>>) => void,
  setScroll: (func: tfunctional<tvector>) => void,
  setZoom: (func: tfunctional<number>) => void,
}

type ttransport = {
  play: (offset?: number) => void,
  pause: () => void,
  stop: () => void,
}

const SpecvizContext = createContext<tcontext>({
  sound: null,
  scroll: { x: 0, y: 0 },
  transport: {
    play: _ => { console.error("transport.play called outside of Specviz context") },
    pause: () => { console.error("transport.pause called outside of Specviz context") },
    stop: () => { console.error("transport.stop called outside of Specviz context") },
  },
  zoom: 1,
  setSound: _ => { console.error("setSound called outside of Specviz context") },
  setScroll: _ => { console.error("setScroll called outside of Specviz context") },
  setZoom: _ => { console.error("setZoom called outside of Specviz context") },
})

function Specviz(props: { children: ReactNode }) {
  const { children } = props
  const [sound, setSound] = useState<tnullable<Sound<string>>>(null)
  const [scroll, setScroll] = useState<tvector>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const transport = useMemo(
    () => ({
      play: (offset?: number) => {
        if (sound) {
          if (offset != null) {
            sound.play(0, offset)
          }
          else {
            sound.play() // todo: resume at playhead
          }
        }
      },
      pause: () => {
        if (sound) {
          sound.pause()
        }
      },
      stop: () => {
        if (sound) {
          sound.stop()
        }
      },
    }),
    [sound]
  )

  return <SpecvizContext.Provider value={{
    sound,
    scroll,
    transport,
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
