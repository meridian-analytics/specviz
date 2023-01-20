import type { ReactNode } from "react"
import type { ttransport, ttransportstate, tcontext, tfunctional, tvector2, tvector3 } from "./types"
import { createContext, useCallback, useContext, useRef, useState } from "react"
import { clamp } from "./mathx"

const STOP: ttransportstate = { type: "stop", offset: 0 }
const NOOP = () => {}

const SpecvizContext = createContext<tcontext>({
  scrollZoom: { current: { x: 0, y: 0, z: 1 } },
  transport: {
    play: () => { console.error("transport.play called outside of Specviz context") },
    stop: () => { console.error("transport.stop called outside of Specviz context") },
    seek: () => { console.error("transport.seek called outside of Specviz context") },
  },
  transportState: STOP,
  setScrollZoom: _ => { console.error("setScrollZoom called outside of Specviz context") },
  setTransport: _ => { console.error("setTransport called outside of Specviz context") },
  setTransportState: _ => { console.error("setTransportState called outside of Specviz context") },
})

function Specviz(props: { children: ReactNode }) {
  const { children } = props
  const scrollZoom = useRef<tvector3>({ x: 0, y: 0, z: 1 })

  const setScrollZoom = useCallback(
    (t: tfunctional<tvector3>) => {
      const state = scrollZoom.current!
      if (typeof t === "function") {
        const nextState = t(state)
        state.z = clamp(nextState.z, 1, 2)
        state.x = clamp(nextState.x, 0, state.z - 1)
        state.y = clamp(nextState.y, 0, state.z - 1)
      }
      else {
        state.z = clamp(t.z, 1, 2)
        state.x = clamp(t.x, 0, state.z - 1)
        state.y = clamp(t.y, 0, state.z - 1)
      }
    },
    [scrollZoom]
  )

  const [transport, setTransport] = useState<ttransport>({
    play: NOOP,
    stop: NOOP,
    seek: NOOP,
  })

  const [transportState, setTransportState] = useState<ttransportstate>(STOP)

  return <SpecvizContext.Provider value={{
    scrollZoom,
    transport,
    transportState,
    setScrollZoom,
    setTransport,
    setTransportState,
  }}>
    {children}
  </SpecvizContext.Provider>
}

function useSpecviz() {
  return useContext(SpecvizContext)
}

export { Specviz, useSpecviz }
