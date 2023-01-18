import type { ReactNode } from "react"
import type { tvector3, ttransport, ttransportstate, tcontext } from "./types"
import { createContext, useContext, useRef, useState } from "react"

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
  setTransport: _ => { console.error("setTransport called outside of Specviz context") },
  setTransportState: _ => { console.error("setTransportState called outside of Specviz context") },
})

function Specviz(props: { children: ReactNode }) {
  const { children } = props
  const scrollZoom = useRef<tvector3>({ x: 0, y: 0, z: 1 })
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
    setTransport,
    setTransportState
  }}>
    {children}
  </SpecvizContext.Provider>
}

function useSpecviz() {
  return useContext(SpecvizContext)
}

export { Specviz, useSpecviz }
