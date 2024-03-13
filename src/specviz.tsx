import * as R from "react"
import * as Axis from "./axis"
import * as Format from "./format"
import * as Hooks from "./hooks"
import * as Mathx from "./mathx"
import * as Rect from "./rect"
import * as T from "./types"
import * as Vector2 from "./vector2"

const ZOOM_MAX: number = 5

export type tcoord = {
  abs: Vector2.tvector2
  rel: Vector2.tvector2
}

type tinput = {
  buttons: number
  alt: boolean
  ctrl: boolean
  focus: null | SVGSVGElement
  xaxis: null | Axis.taxis
  yaxis: null | Axis.taxis
}

type tselection = Set<string>

type ttoolstate = "annotate" | "select" | "zoom" | "pan"

type tcommand = {
  annotate: (
    rect: Rect.trect,
    unit: Rect.trect,
    xaxis: Axis.taxis,
    yaxis: Axis.taxis,
  ) => void
  delete: () => void
  deselect: () => void
  moveSelection: (dx: number, dy: number) => void
  resetView: () => void
  scroll: (dx: number, dy: number) => void
  scrollTo: (pt: Vector2.tvector2) => void
  selectArea: (rect: Rect.trect) => void
  selectPoint: (pt: Vector2.tvector2) => void
  setRectX: (region: T.tregion, dx: number) => void
  setRectX1: (region: T.tregion, dx: number) => void
  setRectX2: (region: T.tregion, dx: number) => void
  setRectY: (region: T.tregion, dy: number) => void
  setRectY1: (region: T.tregion, dy: number) => void
  setRectY2: (region: T.tregion, dy: number) => void
  tool: (toolState: ttoolstate) => void
  zoom: (dx: number, dy: number) => void
  zoomArea: (rect: Rect.trect) => void
  zoomPoint: (pt: Vector2.tvector2) => void
}

type tcontext = {
  input: tinput
  mousedown: tcoord
  mouseup: tcoord
  mouseRect: Rect.trect
  unitDown: Vector2.tvector2
  unitUp: Vector2.tvector2
  scroll: Vector2.tvector2
  zoom: Vector2.tvector2
  regions: Map<string, T.tregion>
  regionCache: Map<string, Rect.trect>
  selection: tselection
  command: tcommand
  toolState: ttoolstate
  setSelection: R.Dispatch<R.SetStateAction<tselection>>
  setRegions: R.Dispatch<R.SetStateAction<Map<string, T.tregion>>>
}

const defaultContext: tcontext = {
  input: {
    buttons: 0,
    alt: false,
    ctrl: false,
    focus: null,
    xaxis: null,
    yaxis: null,
  },
  mousedown: { abs: { x: 0, y: 0 }, rel: { x: 0, y: 0 } },
  mouseup: { abs: { x: 0, y: 0 }, rel: { x: 0, y: 0 } },
  mouseRect: { x: 0, y: 0, width: 0, height: 0 },
  unitDown: { x: 0, y: 0 },
  unitUp: { x: 0, y: 0 },
  scroll: { x: 0, y: 0 },
  zoom: { x: 0, y: 0 },
  regions: new Map(),
  regionCache: new Map(),
  selection: new Set(),
  command: {
    annotate: () => {
      throw Error("command.annotate called outside of Specviz context")
    },
    delete: () => {
      throw Error("command.delete called outside of Specviz context")
    },
    deselect: () => {
      throw Error("command.deselect called outside of Specviz context")
    },
    moveSelection: () => {
      throw Error("command.moveSelection called outside of Specviz context")
    },
    resetView: () => {
      throw Error("command.resetView called outside of Specviz context")
    },
    scroll: () => {
      throw Error("command.scroll called outside of Specviz context")
    },
    scrollTo: () => {
      throw Error("command.scrollTo called outside of Specviz context")
    },
    selectPoint: () => {
      throw Error("command.selectPoint called outside of Specviz context")
    },
    selectArea: () => {
      throw Error("command.selectArea called outside of Specviz context")
    },
    setRectX: () => {
      throw Error("command.setRectX called outside of Specviz context")
    },
    setRectX1: () => {
      throw Error("command.setRectX1 called outside of Specviz context")
    },
    setRectX2: () => {
      throw Error("command.setRectX2 called outside of Specviz context")
    },
    setRectY: () => {
      throw Error("command.setRectY called outside of Specviz context")
    },
    setRectY1: () => {
      throw Error("command.setRectY1 called outside of Specviz context")
    },
    setRectY2: () => {
      throw Error("command.setRectY2 called outside of Specviz context")
    },
    tool: () => {
      throw Error("command.tool called outside of Specviz context")
    },
    zoom: () => {
      throw Error("command.zoom called outside of Specviz context")
    },
    zoomPoint: () => {
      throw Error("command.zoomPoint called outside of Specviz context")
    },
    zoomArea: () => {
      throw Error("command.zoomArea called outside of Specviz context")
    },
  },
  toolState: "annotate",
  setRegions: _ => {
    throw Error("setRegions called outside of Specviz context")
  },
  setSelection: _ => {
    throw Error("setSelection called outside of Specviz context")
  },
}

const Context = R.createContext(defaultContext)

export type ProviderProps = {
  axes: Record<string, Axis.taxis>
  regions: Map<string, T.tregion>
  setRegions: R.Dispatch<R.SetStateAction<Map<string, T.tregion>>>
  children: R.ReactNode
}

export function Provider(props: ProviderProps) {
  const input = R.useMemo<tinput>(() => {
    let buttons = 0
    let alt = false
    let ctrl = false
    let focus: null | SVGSVGElement = null
    let xaxis: null | Axis.taxis = null
    let yaxis: null | Axis.taxis = null
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

  const [selection, setSelection] = R.useState<tselection>(() => new Set())

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

  const command = R.useMemo<tcommand>(
    () => ({
      annotate(rect, unit, xaxis, yaxis) {
        const id = Format.randomBytes(10)
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
            const nextState: tselection = new Set(prev)
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
          const nextState: tselection = new Set()
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
            const nextState: tselection = new Set(prevState)
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
          const nextState: tselection = new Set()
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

  const [toolState, setToolState] = R.useState<ttoolstate>("annotate")

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
    <Context.Provider
      value={{
        input,
        mousedown: Hooks.useMutableCoord(),
        mouseup: Hooks.useMutableCoord(),
        mouseRect: Hooks.useMutableRect(),
        unitDown: Hooks.useMutableVector2(),
        unitUp: Hooks.useMutableVector2(),
        scroll,
        zoom,
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
    </Context.Provider>
  )
}

export function useContext() {
  return R.useContext(Context)
}

export default defaultContext
