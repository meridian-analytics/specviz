import { Dispatch, SetStateAction, ReactNode, useEffect, useMemo, useState, useCallback } from "react"
import { tregion, tnullable, tcommand, tinput, tselection, ttoolstate, ttransport, ttransportstate } from "./types.jsx"
import { taxis, computeRect, computeRectInverse } from "./axis.jsx"
import { useMutableCoord, useMutableRect, useMutableVector2 } from "./hooks.jsx"
import { clamp } from "./mathx.jsx"
import { trect, intersectPoint, intersectRect, logical } from "./rect.jsx"
import { randomBytes } from "./stringx.jsx"
import { stop } from "./transport.jsx"
import { tvector2 } from "./vector2.jsx"
import SpecvizContext from "./context.jsx"

const ZOOM_MAX: number = 5
const NOOP = () => {}


function Specviz(props: {
  axes: Record<string, taxis>
  regions: Map<string, tregion>
  setRegions: Dispatch<SetStateAction<Map<string, tregion>>>
  children: ReactNode
}) {
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

  const [selection, setSelection] = useState<tselection>(() => new Set())

  const regionCache = useMemo(
    () => new Map(Array.from(
      props.regions.values(),
      r => (
        props.axes[r.xunit] == null && console.error(`Specviz.axes does not specify ${r.xunit}`, props.axes),
        props.axes[r.yunit] == null && console.error(`Specviz.axes does not specify ${r.yunit}`, props.axes),
        [r.id, computeRectInverse(props.axes[r.xunit], props.axes[r.yunit], r)] // bug: r.xunit and r.yunit needs to be compute on *all* axes with the same unit
      ),
    )),
    [props.axes, props.regions],
  )
  
  const updateRegion = useCallback(
    (r: tregion, func: (prev: trect) => trect) => ({
      ...r,
      ...computeRect(
        props.axes[r.xunit],
        props.axes[r.yunit],
        func(regionCache.get(r.id)!)
      ),
    }),
    [regionCache, props.axes],
  )

  const command = useMemo<tcommand>(
    () => ({
      annotate(rect, unit, xaxis, yaxis) {
        const id = randomBytes(10)
        props.setRegions(prev => new Map(prev).set(
          id,
          { id, ...unit, xunit: xaxis.unit, yunit: yaxis.unit }
        ))
        setSelection(new Set([id]))
      },
      delete() {
        props.setRegions(prev => new Map(function *() {
          for (const [id, region] of prev.entries())
            if (!selection.has(id))
              yield [id, region]
        }()))
        setSelection(new Set())
      },
      deselect() {
        setSelection(new Set())
      },
      moveSelection(dx, dy) {
        props.setRegions(prev => new Map(Array.from(
          prev,
          ([id, region]) => {
            if (!selection.has(id)) return [id, region]
            return [id, updateRegion(region, rect => ({
              x: clamp(rect.x + (input.xaxis?.unit == region.xunit ? dx : 0), 0, 1 - rect.width),
              y: clamp(rect.y + (input.yaxis?.unit == region.yunit ? dy : 0), 0, 1 - rect.height),
              width: rect.width,
              height: rect.height,
            }))]
          },
        )))
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
        setSelection(prev => {
          if (input.ctrl) {
            const nextState: tselection = new Set(prev)
            for (const r of props.regions.values()) {
              if (
                intersectRect(
                  logical(
                    regionCache.get(r.id)!,
                    input.xaxis?.unit == r.xunit,
                    input.yaxis?.unit == r.yunit,
                  ),
                  area
                )
              ) {
                if (nextState.has(r.id)) nextState.delete(r.id)
                else nextState.add(r.id)
              }
            }
            return nextState
          }
          else {
            const nextState: tselection = new Set()
            for (const r of props.regions.values()) {
              if (
                intersectRect(
                  logical(
                    regionCache.get(r.id)!,
                    input.xaxis?.unit == r.xunit,
                    input.yaxis?.unit == r.yunit,
                  ),
                  area
                )
              ) {
                nextState.add(r.id)
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
            for (const r of props.regions.values()) {
              if (
                intersectPoint(
                  logical(
                    regionCache.get(r.id)!,
                    input.xaxis?.unit == r.xunit,
                    input.yaxis?.unit == r.yunit,
                  ),
                  pt,
                )
              ) {
                if (nextState.has(r.id)) nextState.delete(r.id)
                else nextState.add(r.id)
              }
            }
            return nextState
          }
          else {
            const nextState: tselection = new Set()
            for (const r of props.regions.values()) {
              if (
                intersectPoint(
                  logical(
                    regionCache.get(r.id)!,
                    input.xaxis?.unit == r.xunit,
                    input.yaxis?.unit == r.yunit,
                  ),
                  pt,
                )
              ) {
                nextState.add(r.id)
              }
            }
            return nextState
          }
        })
      },
      setRectX(region, dx) {
        props.setRegions(prev => new Map(prev).set(region.id, updateRegion(region, rect => ({
          x: clamp(rect.x + dx, 0, 1 - rect.width),
          y: rect.y,
          width: rect.width,
          height: rect.height,
        }))))
      },
      setRectX1(a, dx) {
        // todo: implement
      },
      setRectX2(region, dx) {
        props.setRegions(prev => new Map(prev).set(region.id, updateRegion(region, rect => ({
          x: rect.x,
          y: rect.y,
          width: clamp(rect.width + dx, 0.01, 1 - rect.x),
          height: rect.height,
        }))))
      },
      setRectY(region, dy) {
        props.setRegions(prev => new Map(prev).set(region.id, updateRegion(region, rect => ({
          x: rect.x,
          y: clamp(rect.y + dy, 0, 1 - rect.height),
          width: rect.width,
          height: rect.height,
        }))))
      },
      setRectY1(region, dy) {
        props.setRegions(prev => new Map(prev).set(region.id, updateRegion(region, rect => ({
          x: rect.x,
          y: clamp(rect.y + dy, 0, rect.y + rect.height - 0.01),
          width: rect.width,
          height: clamp(rect.height - Math.max(dy, -rect.y), 0.01, 1 - rect.y),
        }))))
      },
      setRectY2(region, dy) {
        props.setRegions(prev => new Map(prev).set(region.id, updateRegion(region, rect => ({
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: clamp(rect.height + dy, 0.01, 1 - rect.y),
        }))))
      },
      tool(t) {
        setToolState(t)
      },
      zoom(dx, dy) {
        zoom.x += dx
        zoom.y += dy
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
    [props.regions, regionCache, selection, updateRegion]
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
    input,
    mousedown: useMutableCoord(),
    mouseup: useMutableCoord(),
    mouseRect: useMutableRect(),
    unitDown: useMutableVector2(),
    unitUp: useMutableVector2(),
    scroll,
    zoom,
    playhead: useMutableVector2(),
    regions: props.regions,
    regionCache,
    selection,
    command,
    toolState,
    transport,
    transportState,
    setRegions: props.setRegions,
    setSelection,
    setTransport,
    setTransportState,
  }}>
    {props.children}
  </SpecvizContext.Provider>
}

export default Specviz
