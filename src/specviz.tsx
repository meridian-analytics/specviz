import type { tannotation, ttool, ttoolstate, ttransport, ttransportstate, tcontext } from "./types"
import type { tvector2 } from "./vector2"
import { MouseEvent, ReactNode, RefObject, createContext, useContext, useEffect, useMemo, useState } from "react"
import { clamp } from "./mathx"
import { trect, fromPoints } from "./rect"

const ZOOM_MAX: number = 5
const STOP: ttransportstate = { type: "stop", offset: 0 }
const NOOP = () => {}

const SpecvizContext = createContext<tcontext>({
  annotations: new Map(),
  duration: 0,
  input: { buttons: 0 },
  mousedown: { x: 0, y: 0 },
  mouseup: { x: 0, y: 0 },
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

  const input = useMemo(
    () => {
      const i = { buttons: 0 }
      return {
        get buttons() { return i.buttons },
        set buttons(v) { i.buttons = v },
      }
    },
    []
  )

  const zoom = useMemo(
    () => {
      const z = { x: 1, y: 1 }
      return {
        get x() { return z.x },
        get y() { return z.y },
        set x(v) { z.x = clamp(v, 1, ZOOM_MAX) },
        set y(v) { z.y = clamp(v, 1, ZOOM_MAX) },
      }
    },
    []
  )

  const scroll = useMemo(
    () => {
      const s = { x: 0, y: 0 }
      return {
        get x() { return s.x },
        get y() { return s.y },
        set x(v) { s.x = clamp(v, 0, zoom.x - 1) },
        set y(v) { s.y = clamp(v, 0, zoom.y - 1) },
      }
    },
    [zoom]
  )

  const mousedown = useMemo(
    () => {
      const m = { x: 0, y: 0 }
      return {
        get x() { return m.x },
        get y() { return m.y },
        set x(v) { m.x = v },
        set y(v) { m.y = v },
      }
    },
    []
  )

  const mouseup = useMemo(
    () => {
      const m = { x: 0, y: 0 }
      return {
        get x() { return m.x },
        get y() { return m.y },
        set x(v) { m.x = v },
        set y(v) { m.y = v },
      }
    },
    []
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
    input,
    mousedown,
    mouseup,
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

function fromMouse(e: MouseEvent<SVGSVGElement>): tvector2 {
  const elem = e.currentTarget
  const viewport = elem.getBoundingClientRect()
  const bounds = elem.getBBox() // x,y are negative offsets
  // same but without getBBox, but depends on scroll and zoom
  // maybe useful if getBBox is unreliable
  // const mx = ((e.clientX - viewport.x) / viewport.width + scroll.x) / zoom.x
  // const my = ((e.clientY - viewport.y) / viewport.height + scroll.y) / zoom.y
  return {
    x: (e.clientX - viewport.x - bounds.x) / bounds.width,
    y: (e.clientY - viewport.y - bounds.y) / bounds.height
  }
}

function useClickRect(listeners: {
  onMouseDown: (e: MouseEvent<SVGSVGElement>) => void,
  onMouseMove: (e: MouseEvent<SVGSVGElement>, rect: trect) => void,
  onMouseUp: (e: MouseEvent<SVGSVGElement>, rect: trect) => void,
  onMouseLeave: (e: MouseEvent<SVGSVGElement>) => void,
  onContextMenu: (e: MouseEvent<SVGSVGElement>) => void,
}) {
  const { input, mousedown, mouseup } = useSpecviz()
  return useMemo(
    () => {
      return {
        onContextMenu(e: MouseEvent<SVGSVGElement>) {
          e.preventDefault() // disable context menu
          listeners.onContextMenu(e)
        },
        onMouseDown(e: MouseEvent<SVGSVGElement>) {
          e.preventDefault() // disable native drag
          input.buttons = e.buttons
          const pt = fromMouse(e)
          mousedown.x = pt.x
          mousedown.y = pt.y
          mouseup.x = pt.x
          mouseup.y = pt.y
          listeners.onMouseDown(e)
        },
        onMouseMove(e: MouseEvent<SVGSVGElement>) {
          const pt = fromMouse(e)
          if (input.buttons & 1) {
            mouseup.x = pt.x
            mouseup.y = pt.y
          }
          else {
            mousedown.x = pt.x
            mousedown.y = pt.y
            mouseup.x = pt.x
            mouseup.y = pt.y
          }
          listeners.onMouseMove(e, fromPoints(mousedown, mouseup))
        },
        onMouseUp(e: MouseEvent<SVGSVGElement>) {
          listeners.onMouseUp(e, fromPoints(mousedown, mouseup))
          input.buttons = 0
        },
        onMouseLeave(e: MouseEvent<SVGSVGElement>) {
          listeners.onMouseLeave(e)
          input.buttons = 0
        },
      }
    },
    [
      listeners.onMouseDown,
      listeners.onMouseMove,
      listeners.onMouseUp,
      listeners.onMouseLeave,
      listeners.onContextMenu
    ]
  )
}

// react uses passive event listeners by default
// to stop propagation, use a non-passive listener
// https://stackoverflow.com/a/67258046
function useWheel(ref: RefObject<SVGSVGElement>, direction: 1 | -1) {
  const { mousedown, scroll, zoom } = useSpecviz()
  useEffect(
    () => {
      const elem = ref.current!
      function onWheel(e: WheelEvent) {
        e.preventDefault()
        const dx = e.deltaX / elem.clientWidth
        const dy = e.deltaY / elem.clientHeight
        if (e.altKey) {
          const mx = (mousedown.x * zoom.x) - scroll.x
          const my = (mousedown.y * zoom.y) - scroll.y
          zoom.x = zoom.x + dx * direction
          zoom.y = zoom.y + dy * direction
          // bug: navigator scroll offset is incorrect
          scroll.x = (mousedown.x * zoom.x) - mx
          scroll.y = (mousedown.y * zoom.y) - my
        }
        else {
          scroll.x -= dx * direction
          scroll.y -= dy * direction
        }
      }
      elem.addEventListener("wheel", onWheel, { passive: false })
      return () => {
        elem.removeEventListener("wheel", onWheel)
      }
    },
    [ref, scroll, zoom, mousedown, direction]
  )
}

export { Specviz, useClickRect, useSpecviz, useWheel }
