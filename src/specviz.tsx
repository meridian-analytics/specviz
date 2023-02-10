import type { tannotation, taxis, tnullable, tcommand, tcoord, ttoolstate, ttransport, ttransportstate, tcontext } from "./types"
import type { tvector2 } from "./vector2"
import { MouseEvent, ReactNode, RefObject, createContext, useContext, useEffect, useMemo, useState } from "react"
import { clamp } from "./mathx"
import { trect, fromPoints } from "./rect"

const ZOOM_MAX: number = 5
const STOP: ttransportstate = { type: "stop", progress: 0 }
const NOOP = () => {}

const SpecvizContext = createContext<tcontext>({
  annotations: new Map(),
  duration: 0,
  input: { buttons: 0, alt: false, ctrl: false, focus: null, xaxis: null, yaxis: null },
  mousedown: { abs: { x: 0, y: 0 }, rel: { x: 0, y: 0 } },
  mouseup: { abs: { x: 0, y: 0 }, rel: { x: 0, y: 0 } },
  mouseRect: { x: 0, y: 0, width: 0, height: 0 },
  scroll: { x: 0, y: 0 },
  zoom: { x: 0, y: 0 },
  playhead: { x: 0, y: 0 },
  selection: new Set(),
  command: {
    annotate: () => { console.error("command.annotate called outside of Specviz context") },
    select: () => { console.error("command.select called outside of Specviz context") },
    zoom: () => { console.error("command.zoom called outside of Specviz context") },
    pan: () => { console.error("command.pan called outside of Specviz context") },
    delete: () => { console.error("command.delete called outside of Specviz context") },
  },
  toolState: "annotate",
  transport: {
    play: () => { console.error("transport.play called outside of Specviz context") },
    stop: () => { console.error("transport.stop called outside of Specviz context") },
    seek: () => { console.error("transport.seek called outside of Specviz context") },
  },
  transportState: STOP,
  setAnnotations: _ => { console.error("setAnnotations called outside of Specviz context") },
  setSelection: _ => { console.error("setSelection called outside of Specviz context") },
  setTransport: _ => { console.error("setTransport called outside of Specviz context") },
  setTransportState: _ => { console.error("setTransportState called outside of Specviz context") },
})

function Specviz(props: {
  duration: number,
  children: ReactNode,
}) {
  const [annotations, setAnnotations] = useState<Map<string, tannotation>>(new Map())
  const [selection, setSelection] = useState<Set<tannotation>>(new Set())
  const input = useMemo(
    () => {
      let buttons = 0
      let alt = false
      let ctrl = false
      let focus: tnullable<SVGSVGElement> = null
      let xaxis: tnullable<taxis> = null
      let yaxis: tnullable<taxis> = null
      return {
        get buttons() { return buttons },
        set buttons(v) { buttons = v },
        get alt() { return alt },
        set alt(v) { alt = v },
        get ctrl() { return ctrl },
        set ctrl(v) { ctrl = v },
        get focus() { return focus },
        set focus(v) { focus = v },
        get xaxis() { return xaxis },
        set xaxis(v) { xaxis = v },
        get yaxis() { return yaxis },
        set yaxis(v) { yaxis = v },
      }
    },
    []
  )

  const zoom = useMemo<tvector2>(
    () => {
      let x = 1, y = 1
      return {
        get x() { return x },
        get y() { return y },
        set x(v) { x = clamp(v, 1, ZOOM_MAX) },
        set y(v) { y = clamp(v, 1, ZOOM_MAX) },
      }
    },
    []
  )

  const scroll = useMemo<tvector2>(
    () => {
      let x = 0, y = 0
      return {
        get x() { return x },
        get y() { return y },
        set x(v) { x = clamp(v, 0, zoom.x - 1) },
        set y(v) { y = clamp(v, 0, zoom.y - 1) },
      }
    },
    [zoom]
  )

  const command = useMemo<tcommand>(
    () => ({
      annotate: () => setToolState("annotate"),
      select: () => setToolState("select"),
      zoom: () => setToolState("zoom"),
      pan: () => setToolState("pan"),
      delete: () => {
        setAnnotations(a => {
          const result = new Map(a)
          for (const a of selection)
            result.delete(a.id)
          return result
        })
        setSelection(new Set())
      }
    }),
    [selection]
  )

  const [toolState, setToolState] = useState<ttoolstate>("annotate")

  const [transport, setTransport] = useState<ttransport>({
    play: NOOP,
    stop: NOOP,
    seek: NOOP,
  })

  const [transportState, setTransportState] = useState<ttransportstate>(STOP)

  // todo: expose via command and keybind
  useEffect(
    () => {
      function onKeyDown(e: KeyboardEvent) {
        if (e.key == "Alt") {
          input.alt = true
        }
        else if (e.key == "Control") {
          input.ctrl = true
        }
      }
      function onKeyUp(e: KeyboardEvent) {
        if (e.key == "Alt") {
          input.alt = false
        }
        else if (e.key == "Control") {
          input.ctrl = false
        }
      }
      window.addEventListener("keydown", onKeyDown)
      window.addEventListener("keyup", onKeyUp)
      return () => {
        window.removeEventListener("keydown", onKeyDown)
        window.removeEventListener("keyup", onKeyUp)
      }
    },
    []
  )

  return <SpecvizContext.Provider value={{
    annotations,
    duration: props.duration,
    input,
    mousedown: useMutableCoord(),
    mouseup: useMutableCoord(),
    mouseRect: useMutableRect(),
    scroll,
    zoom,
    playhead: useMutableVector2(),
    selection: selection,
    command,
    toolState,
    transport,
    transportState,
    setAnnotations,
    setSelection,
    setTransport,
    setTransportState,
  }}>
    {props.children}
  </SpecvizContext.Provider>
}

function useSpecviz() {
  return useContext(SpecvizContext)
}

function useMouse(listeners: {
  onMouseDown: (e: MouseEvent<SVGSVGElement>) => void,
  onMouseMove: (e: MouseEvent<SVGSVGElement>) => void,
  onMouseUp: (e: MouseEvent<SVGSVGElement>) => void,
  onMouseEnter: (e: MouseEvent<SVGSVGElement>) => void,
  onMouseLeave: (e: MouseEvent<SVGSVGElement>) => void,
  onContextMenu: (e: MouseEvent<SVGSVGElement>) => void,
}) {
  const { input, mousedown, mouseup, mouseRect, scroll, zoom } = useSpecviz()
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
          listeners.onMouseDown(e)
        },
        onMouseMove(e: MouseEvent<SVGSVGElement>) {
          const elem = e.currentTarget
          const viewport = elem.getBoundingClientRect()
          const x = (e.clientX - viewport.x) / viewport.width
          const y = (e.clientY - viewport.y) / viewport.height
          if (input.buttons & 1) {
            mouseup.rel.x = x
            mouseup.rel.y = y
            mouseup.abs.x = (x + scroll.x) / zoom.x
            mouseup.abs.y = (y + scroll.y) / zoom.y
          }
          else {
            mousedown.rel.x = mouseup.rel.x = x
            mousedown.rel.y = mouseup.rel.y = y
            mousedown.abs.x = mouseup.abs.x = (x + scroll.x) / zoom.x
            mousedown.abs.y = mouseup.abs.y = (y + scroll.y) / zoom.y
          }
          const rect = fromPoints(mousedown.abs, mouseup.abs)
          mouseRect.x = rect.x
          mouseRect.y = rect.y
          mouseRect.width = rect.width
          mouseRect.height = rect.height
          listeners.onMouseMove(e)
        },
        onMouseUp(e: MouseEvent<SVGSVGElement>) {
          listeners.onMouseUp(e)
          input.buttons = 0
        },
        onMouseEnter(e: MouseEvent<SVGSVGElement>) {
          input.focus = e.currentTarget
          listeners.onMouseEnter(e)
        },
        onMouseLeave(e: MouseEvent<SVGSVGElement>) {
          listeners.onMouseLeave(e)
          input.buttons = 0
          input.focus = null
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

function useMutableVector2() {
  return useMemo<tvector2>(
    () => {
      let x = 0, y = 0
      return {
        get x() { return x },
        get y() { return y },
        set x(v) { x = v },
        set y(v) { y = v },
      }
    },
    []
  )
}

function useMutableCoord() {
  return useMemo<tcoord>(
    () => {
      let absx = 0, absy = 0, relx = 0, rely = 0
      return {
        abs: {
          get x() { return absx },
          set x(v) { absx = v },
          get y() { return absy },
          set y(v) { absy = v },
        },
        rel: {
          get x() { return relx },
          set x(v) { relx = v },
          get y() { return rely },
          set y(v) { rely = v },
        },
      }
    },
    []
  )
}

function useMutableRect() {
  return useMemo<trect>(
    () => {
      let x = 0, y = 0, width = 0, height = 0
      return {
        get x() { return x },
        get y() { return y },
        set x(v) { x = v },
        set y(v) { y = v },
        get width() { return width },
        set width(v) { width = v },
        get height() { return height },
        set height(v) { height = v },
      }
    },
    []
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
          zoom.x = zoom.x + dx * direction
          zoom.y = zoom.y + dy * direction
          scroll.x = (mousedown.abs.x * zoom.x) - mousedown.rel.x
          scroll.y = (mousedown.abs.y * zoom.y) - mousedown.rel.y
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

export { Specviz, useMouse, useSpecviz, useWheel }
