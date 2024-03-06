import * as R from "react"
import * as Axis from "./axis"
import SpecvizContext from "./context"
import * as Hooks from "./hooks"
import * as Mathx from "./mathx"
import * as Rect from "./rect"
import * as Stringx from "./stringx"
import * as T from "./types"
import * as Vector2 from "./vector2"

const ZOOM_MAX: number = 5

function Specviz(props: {
  axes: Record<string, Axis.taxis>
  regions: Map<string, T.tregion>
  setRegions: R.Dispatch<R.SetStateAction<Map<string, T.tregion>>>
  children: R.ReactNode
}) {
  const input = R.useMemo<T.tinput>(() => {
    let buttons = 0
    let alt = false
    let ctrl = false
    let focus: T.tnullable<SVGSVGElement> = null
    let xaxis: T.tnullable<Axis.taxis> = null
    let yaxis: T.tnullable<Axis.taxis> = null
    return {
      get buttons() {
        return buttons
      },
      set buttons(v) {
        buttons = v
      },
      get alt() {
        return alt
      },
      set alt(v) {
        alt = v
      },
      get ctrl() {
        return ctrl
      },
      set ctrl(v) {
        ctrl = v
      },
      get focus() {
        return focus
      },
      set focus(v) {
        focus = v
      },
      get xaxis() {
        return xaxis
      },
      set xaxis(v) {
        xaxis = v
      },
      get yaxis() {
        return yaxis
      },
      set yaxis(v) {
        yaxis = v
      },
    }
  }, [])

  const zoom = R.useMemo<Vector2.tvector2>(() => {
    let x = 1
    let y = 1
    return {
      get x() {
        return x
      },
      get y() {
        return y
      },
      set x(v) {
        x = Mathx.clamp(v, 1, ZOOM_MAX)
      },
      set y(v) {
        y = Mathx.clamp(v, 1, ZOOM_MAX)
      },
    }
  }, [])

  const scroll = R.useMemo<Vector2.tvector2>(() => {
    let x = 0
    let y = 0
    return {
      get x() {
        return x
      },
      get y() {
        return y
      },
      set x(v) {
        x = Mathx.clamp(v, 0, zoom.x - 1)
      },
      set y(v) {
        y = Mathx.clamp(v, 0, zoom.y - 1)
      },
    }
  }, [zoom])

  const [selection, setSelection] = R.useState<T.tselection>(() => new Set())

  // biome-ignore lint/correctness/useExhaustiveDependencies: props.regions and props.axes specified
  const regionCache = R.useMemo(
    () =>
      new Map(
        Array.from(props.regions.values(), r => {
          const x = props.axes[r.xunit]
          const y = props.axes[r.yunit]
          if (x == null) {
            console.error(
              `Specviz.axes does not specify ${r.xunit}`,
              props.axes,
            )
          }
          if (y == null) {
            console.error(
              `Specviz.axes does not specify ${r.yunit}`,
              props.axes,
            )
          }
          return [r.id, Axis.computeRectInverse(x, y, r)] // bug: r.xunit and r.yunit needs to be compute on *all* axes with the same unit
        }),
      ),
    [props.regions, props.axes],
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: regionCache and props.axes specified
  const updateRegion = R.useCallback(
    (p: T.tregion, func: (prev: Rect.trect) => Rect.trect) => {
      const q = regionCache.get(p.id)
      if (q == null) return p
      return {
        ...p,
        ...Axis.computeRect(props.axes[p.xunit], props.axes[p.yunit], func(q)),
      }
    },
    [regionCache, props.axes],
  )

  const command = R.useMemo<T.tcommand>(
    () => ({
      annotate(rect, unit, xaxis, yaxis) {
        const id = Stringx.randomBytes(10)
        props.setRegions(prev =>
          new Map(prev).set(id, {
            id,
            ...unit,
            xunit: xaxis.unit,
            yunit: yaxis.unit,
          }),
        )
        setSelection(new Set([id]))
      },
      delete() {
        props.setRegions(
          prev =>
            new Map(
              (function* () {
                for (const [id, region] of prev.entries())
                  if (!selection.has(id)) yield [id, region]
              })(),
            ),
        )
        setSelection(new Set())
      },
      deselect() {
        setSelection(new Set())
      },
      moveSelection(dx, dy) {
        props.setRegions(
          prev =>
            new Map(
              Array.from(prev, ([id, region]) => {
                if (!selection.has(id)) return [id, region]
                return [
                  id,
                  updateRegion(region, rect => ({
                    x: Mathx.clamp(
                      rect.x + (input.xaxis?.unit == region.xunit ? dx : 0),
                      0,
                      1 - rect.width,
                    ),
                    y: Mathx.clamp(
                      rect.y + (input.yaxis?.unit == region.yunit ? dy : 0),
                      0,
                      1 - rect.height,
                    ),
                    width: rect.width,
                    height: rect.height,
                  })),
                ]
              }),
            ),
        )
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
            const nextState: T.tselection = new Set(prev)
            for (const r of props.regions.values()) {
              const u = regionCache.get(r.id)
              if (
                u &&
                Rect.intersectRect(
                  Rect.logical(
                    u,
                    input.xaxis?.unit == r.xunit,
                    input.yaxis?.unit == r.yunit,
                  ),
                  area,
                )
              ) {
                if (nextState.has(r.id)) nextState.delete(r.id)
                else nextState.add(r.id)
              }
            }
            return nextState
          }
          const nextState: T.tselection = new Set()
          for (const r of props.regions.values()) {
            const u = regionCache.get(r.id)
            if (
              u &&
              Rect.intersectRect(
                Rect.logical(
                  u,
                  input.xaxis?.unit == r.xunit,
                  input.yaxis?.unit == r.yunit,
                ),
                area,
              )
            ) {
              nextState.add(r.id)
            }
          }
          return nextState
        })
      },
      selectPoint(pt) {
        setSelection(prevState => {
          if (input.ctrl) {
            const nextState: T.tselection = new Set(prevState)
            for (const r of props.regions.values()) {
              const u = regionCache.get(r.id)
              if (
                u &&
                Rect.intersectPoint(
                  Rect.logical(
                    u,
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
          const nextState: T.tselection = new Set()
          for (const r of props.regions.values()) {
            const u = regionCache.get(r.id)
            if (
              u &&
              Rect.intersectPoint(
                Rect.logical(
                  u,
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
        })
      },
      setRectX(region, dx) {
        props.setRegions(prev =>
          new Map(prev).set(
            region.id,
            updateRegion(region, rect => ({
              x: Mathx.clamp(rect.x + dx, 0, 1 - rect.width),
              y: rect.y,
              width: rect.width,
              height: rect.height,
            })),
          ),
        )
      },
      setRectX1(a, dx) {
        // todo: implement
      },
      setRectX2(region, dx) {
        props.setRegions(prev =>
          new Map(prev).set(
            region.id,
            updateRegion(region, rect => ({
              x: rect.x,
              y: rect.y,
              width: Mathx.clamp(rect.width + dx, 0.01, 1 - rect.x),
              height: rect.height,
            })),
          ),
        )
      },
      setRectY(region, dy) {
        props.setRegions(prev =>
          new Map(prev).set(
            region.id,
            updateRegion(region, rect => ({
              x: rect.x,
              y: Mathx.clamp(rect.y + dy, 0, 1 - rect.height),
              width: rect.width,
              height: rect.height,
            })),
          ),
        )
      },
      setRectY1(region, dy) {
        props.setRegions(prev =>
          new Map(prev).set(
            region.id,
            updateRegion(region, rect => ({
              x: rect.x,
              y: Mathx.clamp(rect.y + dy, 0, rect.y + rect.height - 0.01),
              width: rect.width,
              height: Mathx.clamp(
                rect.height - Math.max(dy, -rect.y),
                0.01,
                1 - rect.y,
              ),
            })),
          ),
        )
      },
      setRectY2(region, dy) {
        props.setRegions(prev =>
          new Map(prev).set(
            region.id,
            updateRegion(region, rect => ({
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: Mathx.clamp(rect.height + dy, 0.01, 1 - rect.y),
            })),
          ),
        )
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
        scroll.x = pt.x * zoom.x - rx
        scroll.y = pt.y * zoom.y - ry
      },
    }),
    [
      props.regions,
      props.setRegions,
      regionCache,
      selection,
      updateRegion,
      input,
      scroll,
      zoom,
    ],
  )

  const [toolState, setToolState] = R.useState<T.ttoolstate>("annotate")

  // todo: expose via command and keybind
  R.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key == "Alt") {
        input.alt = true
      } else if (e.key == "Control") {
        input.ctrl = true
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key == "Alt") {
        input.alt = false
      } else if (e.key == "Control") {
        input.ctrl = false
      }
    }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [input])

  return (
    <SpecvizContext.Provider
      value={{
        input,
        mousedown: Hooks.useMutableCoord(),
        mouseup: Hooks.useMutableCoord(),
        mouseRect: Hooks.useMutableRect(),
        unitDown: Hooks.useMutableVector2(),
        unitUp: Hooks.useMutableVector2(),
        scroll,
        zoom,
        playhead: Hooks.useMutableVector2(),
        regions: props.regions,
        regionCache,
        selection,
        command,
        toolState,
        setRegions: props.setRegions,
        setSelection,
      }}
    >
      {props.children}
    </SpecvizContext.Provider>
  )
}

export default Specviz
