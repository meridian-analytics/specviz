import type { ReactNode } from "react"
import type { tannotation, tmouse, ttool, ttoolstate, ttransport, ttransportstate, tcontext } from "./types"
import type { tvector2 } from "./vector2"
import { createContext, useContext, useMemo, useRef, useState } from "react"
import { clamp } from "./mathx"

const ZOOM_MAX: number = 5
const STOP: ttransportstate = { type: "stop", offset: 0 }
const NOOP = () => {}

const SpecvizContext = createContext<tcontext>({
  annotations: new Map(),
  duration: 0,
  mouse: { buttons: 0, x: 0, y: 0, width: 0, height: 0 },
  scroll: { x: 0, y: 0 },
  zoom: { x: 0, y: 0 },
  tool: {
    annotate: () => { console.error("tool.annotate called outside of Specviz context") },
    select: () => { console.error("tool.select called outside of Specviz context") },
    zoom: () => { console.error("tool.zoom called outside of Specviz context") },
    pan: () => { console.error("tool.pan called outside of Specviz context") },
  },
  toolState: "annotate",
  transport: {
    play: () => { console.error("transport.play called outside of Specviz context") },
    stop: () => { console.error("transport.stop called outside of Specviz context") },
    seek: () => { console.error("transport.seek called outside of Specviz context") },
  },
  transportState: STOP,
  setAnnotations: _ => { console.error("setAnnotations called outside of Specviz context") },
  setTransport: _ => { console.error("setTransport called outside of Specviz context") },
  setTransportState: _ => { console.error("setTransportState called outside of Specviz context") },
})

function Specviz(props: {
  duration: number,
  children: ReactNode,
}) {
  const [annotations, setAnnotations] = useState<Map<string, tannotation>>(new Map())
  const mouseRef = useRef<tmouse>({ buttons: 0, x: 0, y: 0, width: 0, height: 0 })
  const scrollRef = useRef<tvector2>({ x: 0, y: 0 })
  const zoomRef = useRef<tvector2>({ x: 1, y: 1 })

  const mouse = useMemo(
    () => {
      const m = mouseRef.current!
      return {
        get buttons() { return m.buttons },
        get x() { return m.x },
        get y() { return m.y },
        get width() { return m.width },
        get height() { return m.height },
        set buttons(v) { m.buttons = v },
        set x(v) { m.x = v },
        set y(v) { m.y = v },
        set width(v) { m.width = v },
        set height(v) { m.height = v },
      }
    },
    [mouseRef]
  )

  const scroll = useMemo(
    () => {
      const s = scrollRef.current!
      const z = zoomRef.current!
      return {
        get x() { return s.x },
        get y() { return s.y },
        set x(v) { s.x = clamp(v, 0, z.x - 1) },
        set y(v) { s.y = clamp(v, 0, z.y - 1) },
      }
    },
    [scrollRef, zoomRef]
  )

  const zoom = useMemo(
    () => {
      const s = scrollRef.current!
      const z = zoomRef.current!
      return {
        get x() { return z.x },
        get y() { return z.y },
        set x(v) {
          z.x = clamp(v, 1, ZOOM_MAX)
          s.x = clamp(s.x, 0, z.x - 1)
        },
        set y(v) {
          z.y = clamp(v, 1, ZOOM_MAX)
          s.y = clamp(s.y, 0, z.y - 1)
        },
      }
    },
    [scrollRef, zoomRef]
  )

  const tool = useMemo<ttool>(
    () => ({
      annotate: () => setToolState("annotate"),
      select: () => setToolState("select"),
      zoom: () => setToolState("zoom"),
      pan: () => setToolState("pan"),
    }),
    []
  )

  const [toolState, setToolState] = useState<ttoolstate>("annotate")

  const [transport, setTransport] = useState<ttransport>({
    play: NOOP,
    stop: NOOP,
    seek: NOOP,
  })

  const [transportState, setTransportState] = useState<ttransportstate>(STOP)

  return <SpecvizContext.Provider value={{
    annotations,
    duration: props.duration,
    mouse,
    scroll,
    zoom,
    tool,
    toolState,
    transport,
    transportState,
    setAnnotations,
    setTransport,
    setTransportState,
  }}>
    {props.children}
  </SpecvizContext.Provider>
}

function useSpecviz() {
  return useContext(SpecvizContext)
}

export { Specviz, useSpecviz }
