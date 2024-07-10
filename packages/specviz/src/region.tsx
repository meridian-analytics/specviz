import * as R from "react"
import * as Format from "../../format/src"
import * as Axis from "./axis"
import * as Input from "./input"
import * as Mathx from "./mathx"
import * as Rect from "./rect"
import type * as Vector2 from "./vector2"

export interface Region {
  id: string
  x: number
  y: number
  width: number
  height: number
  xunit: string
  yunit: string
  [key: string]: RegionValue
}

export type RegionValue = boolean | number | string | string[]

export type RegionState = Map<Region["id"], Region>

export type SelectionState = Set<Region["id"]>

export type Context = {
  annotate: (rect: Rect.trect, xaxis: Axis.taxis, yaxis: Axis.taxis) => void
  delete: () => void
  deselect: () => void
  moveSelection: (dx: number, dy: number) => void
  transformedRegions: RegionState
  transformedSelection: SelectionState
  regions: RegionState
  selectArea: (rect: Rect.trect) => void
  selection: SelectionState
  selectPoint: (pt: Vector2.tvector2) => void
  setRectX: (region: Region, dx: number) => void
  setRectX1: (region: Region, dx: number) => void
  setRectX2: (region: Region, dx: number) => void
  setRectY: (region: Region, dy: number) => void
  setRectY1: (region: Region, dy: number) => void
  setRectY2: (region: Region, dy: number) => void
  setRegions: R.Dispatch<R.SetStateAction<RegionState>>
  setSelection: R.Dispatch<R.SetStateAction<SelectionState>>
}

const defaultContext: Context = {
  annotate() {
    throw Error("annotate called outside of context")
  },
  delete() {
    throw Error("delete called outside of context")
  },
  deselect() {
    throw Error("deselect called outside of context")
  },
  moveSelection() {
    throw Error("moveSelection called outside of context")
  },
  regions: new Map(),
  selectArea() {
    throw Error("selectArea called outside of context")
  },
  selection: new Set(),
  selectPoint() {
    throw Error("selectPoint called outside of context")
  },
  setRectX() {
    throw Error("setRectX called outside of context")
  },
  setRectX1() {
    throw Error("setRectX1 called outside of context")
  },
  setRectX2() {
    throw Error("setRectX2 called outside of context")
  },
  setRectY() {
    throw Error("setRectY called outside of context")
  },
  setRectY1() {
    throw Error("setRectY1 called outside of context")
  },
  setRectY2() {
    throw Error("setRectY2 called outside of context")
  },
  setRegions() {
    throw Error("setRegions called outside of context")
  },
  setSelection() {
    throw Error("setSelection called outside of context")
  },
  transformedRegions: new Map(),
  transformedSelection: new Set(),
}

const Context = R.createContext(defaultContext)

type InitialState<T> = T | (() => T)

export type ProviderProps = {
  children: R.ReactNode
  initRegions?: InitialState<Context["regions"]>
  initSelection?: InitialState<Context["selection"]>
}

export function Provider(props: ProviderProps) {
  // contexts
  const { input } = Input.useContext()
  const axis = Axis.useContext()

  // state
  const [regions, setRegions] = R.useState(
    props.initRegions ?? defaultContext.regions,
  )
  const [selection, setSelection] = R.useState(
    props.initSelection ?? defaultContext.selection,
  )

  const updateRegion = R.useCallback(
    (p: Region, func: (prev: Rect.trect) => Rect.trect) => {
      const x = axis[p.xunit]
      const y = axis[p.yunit]
      if (x == null) throw Error(`axis not found: ${p.xunit}`)
      if (y == null) throw Error(`axis not found: ${p.yunit}`)
      return {
        ...p,
        ...Axis.computeRect(x, y, func(Axis.computeRectInverse(x, y, p))),
      }
    },
    [axis],
  )

  // commands
  const annotate: Context["annotate"] = R.useCallback((rect, xaxis, yaxis) => {
    const id = Format.randomBytes(10)
    setRegions(prev =>
      new Map(prev).set(id, {
        id,
        ...rect,
        xunit: xaxis.unit,
        yunit: yaxis.unit,
      }),
    )
    setSelection(new Set([id]))
  }, [])

  const delete_: Context["delete"] = R.useCallback(() => {
    setRegions(
      prev =>
        new Map(
          (function* () {
            for (const [id, region] of prev.entries())
              if (!selection.has(id)) yield [id, region]
          })(),
        ),
    )
    setSelection(new Set())
  }, [selection])

  const deselect: Context["deselect"] = R.useCallback(() => {
    setSelection(new Set())
  }, [])

  const moveSelection: Context["moveSelection"] = R.useCallback(
    (dx, dy) => {
      setRegions(
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
    [input, selection, updateRegion],
  )

  const selectArea: Context["selectArea"] = R.useCallback(
    area => {
      setSelection(prev => {
        if (input.ctrl) {
          const nextState: SelectionState = new Set(prev)
          for (const r of regions.values()) {
            const u = computeRectInverse(r, axis)
            if (
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
        const nextState: SelectionState = new Set()
        for (const r of regions.values()) {
          const u = computeRectInverse(r, axis)
          if (
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
    [axis, input, regions],
  )

  const selectPoint: Context["selectPoint"] = R.useCallback(
    pt => {
      setSelection(prevState => {
        if (input.ctrl) {
          const nextState: SelectionState = new Set(prevState)
          for (const r of regions.values()) {
            const u = computeRectInverse(r, axis)
            if (
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
        const nextState: SelectionState = new Set()
        for (const r of regions.values()) {
          const u = computeRectInverse(r, axis)
          if (
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
    [axis, input, regions],
  )

  const setRectX: Context["setRectX"] = R.useCallback(
    (region, dx) => {
      setRegions(prev =>
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
    [updateRegion],
  )
  const setRectX1: Context["setRectX1"] = R.useCallback(() => {
    // todo: implement
  }, [])

  const setRectX2: Context["setRectX2"] = R.useCallback(
    (region, dx) => {
      setRegions(prev =>
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
    [updateRegion],
  )

  const setRectY: Context["setRectY"] = R.useCallback(
    (region, dy) => {
      setRegions(prev =>
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
    [updateRegion],
  )

  const setRectY1: Context["setRectY1"] = R.useCallback(
    (region, dy) => {
      setRegions(prev =>
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
    [updateRegion],
  )
  const setRectY2: Context["setRectY2"] = R.useCallback(
    (region, dy) => {
      setRegions(prev =>
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
    [updateRegion],
  )

  // computed context
  const value: Context = R.useMemo(
    () => ({
      annotate,
      delete: delete_,
      deselect,
      moveSelection,
      regions,
      selectArea,
      selection,
      selectPoint,
      setRectX,
      setRectX1,
      setRectX2,
      setRectY,
      setRectY1,
      setRectY2,
      setRegions,
      setSelection,
      transformedRegions: regions,
      transformedSelection: selection,
    }),
    [
      annotate,
      delete_,
      deselect,
      moveSelection,
      regions,
      selectArea,
      selection,
      selectPoint,
      setRectX,
      setRectX1,
      setRectX2,
      setRectY,
      setRectY1,
      setRectY2,
    ],
  )

  return <Context.Provider children={props.children} value={value} />
}

export function useContext() {
  return R.useContext(Context)
}

export function computeRectInverse(region: Region, axes: Axis.Context) {
  const x = axes[region.xunit]
  const y = axes[region.yunit]
  if (x == null) throw Error(`axis not found: ${region.xunit}`)
  if (y == null) throw Error(`axis not found: ${region.yunit}`)
  return Axis.computeRectInverse(x, y, region)
}

export type TransformFn = (regionState: RegionState) => RegionState

export type TransformProps = {
  children: R.ReactNode
  fn: TransformFn
}

export function Transform(props: TransformProps) {
  const context = useContext()
  const value = R.useMemo<Context>(() => {
    const transformedRegions = props.fn(context.regions)
    const transformedSelection = new Set(context.selection).intersection(
      transformedRegions,
    )
    return {
      ...context,
      transformedRegions,
      transformedSelection,
    }
  }, [context, props.fn])
  return <Context.Provider children={props.children} value={value} />
}

export function transformFilter(fn: (region: Region) => boolean) {
  return (regions: RegionState) => {
    const next = new Map()
    for (const [id, region] of regions.entries())
      if (fn(region)) next.set(id, region)
    return next
  }
}
