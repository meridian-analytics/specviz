import { tannotation, taxis, tnullable, tcommand, tinput, tselection, ttoolstate, ttransport, ttransportstate } from "./types"
import { ReactNode, useEffect, useMemo, useState } from "react"
import { computeRect } from "./axis"
import { useMutableCoord, useMutableRect, useMutableVector2 } from "./hooks"
import { clamp } from "./mathx"
import { trect, intersectPoint, intersectRect, logical } from "./rect"
import { randomBytes } from "./stringx"
import { stop } from "./transport"
import { tvector2 } from "./vector2"
import SpecvizContext from "./context"

const ZOOM_MAX: number = 5
const NOOP = () => {}

function Specviz(props: {
  duration: number,
  children: ReactNode,
}) {
  const [annotations, setAnnotations] = useState<Map<string, tannotation>>(new Map())
  const [selection, setSelection] = useState<tselection>(new Set())

  const input = useMemo<tinput>(
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
    []
  )

  const command = useMemo<tcommand>(
    () => ({
      annotate(rect, unit, xaxis, yaxis) {
        const id = randomBytes(10)
        const a: tannotation = { id, rect, unit, xaxis, yaxis }
        setAnnotations(prevState => new Map(prevState).set(id, a))
        setSelection(new Set([a.id]))
      },
      delete() {
        setAnnotations(prevState => {
          const nextState = new Map(prevState)
          for (const id of selection)
            nextState.delete(id)
          return nextState
        })
        setSelection(new Set())
      },
      deselect() {
        setSelection(new Set())
      },
      moveSelection(dx, dy) {
        setAnnotations(prevState => {
          let rect: trect
          return new Map(Array.from(
            prevState,
            ([id, a]) => [
              id,
              selection.has(a.id)
                ? {
                    ...a,
                    rect: rect = {
                      x: clamp(a.rect.x + (input.xaxis == a.xaxis ? dx : 0), 0, 1 - a.rect.width),
                      y: clamp(a.rect.y + (input.yaxis == a.yaxis ? dy : 0), 0, 1 - a.rect.height),
                      width: a.rect.width,
                      height: a.rect.height,
                    },
                    unit: computeRect(a.xaxis, a.yaxis, rect),
                  }
                : a
            ]
          ))
        })
      },
      resetView() {
        zoom.x = 1
        zoom.y = 1
        scroll.x = 0
        scroll.y = 0
      },
      scroll(dx, dy) {
        scroll.x += dx
        scroll.y += dy
      },
      scrollTo(pt) {
        scroll.x = pt.x
        scroll.y = pt.y
      },
      selectArea(area) {
        setSelection(prevState => {
          if (input.ctrl) {
            const nextState: tselection = new Set(prevState)
            for (const a of annotations.values()) {
              if (intersectRect(logical(a.rect, input.xaxis == a.xaxis, input.yaxis == a.yaxis), area)) {
                if (nextState.has(a.id)) nextState.delete(a.id)
                else nextState.add(a.id)
              }
            }
            return nextState
          }
          else {
            const nextState: tselection = new Set()
            for (const a of annotations.values()) {
              if (intersectRect(logical(a.rect, input.xaxis == a.xaxis, input.yaxis == a.yaxis), area)) {
                nextState.add(a.id)
              }
            }
            return nextState
          }
        })
      },
      selectPoint(pt) {
        setSelection(prevState => {
          if (input.ctrl) {
            const nextState: tselection = new Set(prevState)
            for (const a of annotations.values()) {
              if (intersectPoint(logical(a.rect, input.xaxis == a.xaxis, input.yaxis == a.yaxis), pt)) {
                if (nextState.has(a.id)) nextState.delete(a.id)
                else nextState.add(a.id)
              }
            }
            return nextState
          }
          else {
            const nextState: tselection = new Set()
            for (const a of annotations.values()) {
              if (intersectPoint(logical(a.rect, input.xaxis == a.xaxis, input.yaxis == a.yaxis), pt)) {
                nextState.add(a.id)
              }
            }
            return nextState
          }
        })
      },
      setRectX(a, dx) {
        setAnnotations(prevState => {
          const nextState = new Map(prevState)
          const rect: trect = {
            x: clamp(a.rect.x + dx, 0, 1 - a.rect.width),
            y: a.rect.y,
            width: a.rect.width,
            height: a.rect.height,
          }
          return nextState.set(
            a.id,
            { ...a, rect, unit: computeRect(a.xaxis, a.yaxis, rect) }
          )
        })
      },
      setRectY(a, dy) {
        setAnnotations(prevState => {
          const nextState = new Map(prevState)
          const rect: trect = {
            x: a.rect.x,
            y: clamp(a.rect.y + dy, 0, 1 - a.rect.height),
            width: a.rect.width,
            height: a.rect.height,
          }
          return nextState.set(
            a.id,
            { ...a, rect, unit: computeRect(a.xaxis, a.yaxis, rect) }
          )
        })
      },
      setRectWidth(a, dw) {
        setAnnotations(prevState => {
          const nextState = new Map(prevState)
          const rect: trect = {
            x: a.rect.x,
            y: a.rect.y,
            width: clamp(a.rect.width + dw, 0.01, 1 - a.rect.x),
            height: a.rect.height,
          }
          return nextState.set(
            a.id,
            { ...a, rect, unit: computeRect(a.xaxis, a.yaxis, rect) }
          )
        })
      },
      setRectHeight(a, dh) {
        setAnnotations(prevState => {
          const nextState = new Map(prevState)
          const rect: trect = {
            x: a.rect.x,
            y: a.rect.y,
            width: a.rect.width,
            height: clamp(a.rect.height + dh, 0.01, 1 - a.rect.y),
          }
          return nextState.set(
            a.id,
            { ...a, rect, unit: computeRect(a.xaxis, a.yaxis, rect) }
          )
        })
      },
      tool(t) {
        setToolState(t)
      },
      zoomArea(area) {
        zoom.x = 1 / area.width
        zoom.y = 1 / area.height
        scroll.x = -0.5 + (area.x + area.width / 2) * zoom.x
        scroll.y = -0.5 + (area.y + area.height / 2) * zoom.y
      },
      zoomPoint(pt) {
        const rx = pt.x * zoom.x - scroll.x
        const ry = pt.y * zoom.y - scroll.y
        zoom.x += 0.5
        zoom.y += 0.5
        scroll.x = (pt.x * zoom.x) - rx
        scroll.y = (pt.y * zoom.y) - ry
      },
    }),
    [annotations, selection]
  )

  const [toolState, setToolState] = useState<ttoolstate>("annotate")

  const [transport, setTransport] = useState<ttransport>({
    play: NOOP,
    loop: NOOP,
    stop: NOOP,
    seek: NOOP,
  })

  const [transportState, setTransportState] = useState<ttransportstate>(stop(0))

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
    unitDown: useMutableVector2(),
    unitUp: useMutableVector2(),
    scroll,
    zoom,
    playhead: useMutableVector2(),
    selection,
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

export default Specviz
