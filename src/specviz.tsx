import type { ReactNode, RefObject } from "react"
import { createContext, useContext, useRef, useState } from "react"

type tvector3 = { x: number, y: number, z: number }

type tfunctional<T> = T | ((prevState: T) => T)

type tcontext = {
  scrollZoom: RefObject<tvector3>,
  transport: ttransport,
  transportState: ttransportstate
  setTransport: (func: tfunctional<ttransport>) => void,
  setTransportState: (func: tfunctional<ttransportstate>) => void,
}

type ttransportstate =
  | { type: "play", offset: number, timeRef: number }
  | { type: "stop", offset: number }

type ttransport = {
  play: () => void,
  stop: () => void,
}

const STOP: ttransportstate = { type: "stop", offset: 0 }
const NOOP = () => {}

const SpecvizContext = createContext<tcontext>({
  scrollZoom: { current: { x: 0, y: 0, z: 1 } },
  transport: {
    play: () => { console.error("transport.play called outside of Specviz context") },
    stop: () => { console.error("transport.stop called outside of Specviz context") },
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
