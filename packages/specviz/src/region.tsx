import * as R from "react"
import * as Format from "../../format/src"
import * as Axis from "./axis"
import * as Input from "./input"
import * as Mathx from "./mathx"
import * as Rect from "./rect"
import type * as Vector2 from "./vector2"

export type UserData = Record<string, RegionValue>

export type Region = {
  id: string
  x: number
  y: number
  width: number
  height: number
  xunit: string
  yunit: string
} & UserData

export type RegionValue = boolean | number | string | string[]

export type RegionState = Map<Region["id"], Region>

export type SelectionState = Set<Region["id"]>

export enum SelectionMode {
  add = "add",
  invert = "invert",
  replace = "replace",
  subtract = "subtract",
}

function concatSelection(
  prev: SelectionState,
  next: SelectionState,
  selectionMode: SelectionMode,
) {
  switch (selectionMode) {
    case SelectionMode.invert:
      return prev.symmetricDifference(next)
    case SelectionMode.add:
      return prev.union(next)
    case SelectionMode.subtract:
      return prev.difference(next)
    case SelectionMode.replace:
      return next
  }
}

export type Context = {
  annotate: (
    rect: Rect.trect,
    xaxis: Axis.taxis,
    yaxis: Axis.taxis,
    userData?: UserData,
  ) => void
  canCreate: boolean
  canDelete: (region: Region) => boolean
  canRead: (region: Region) => boolean
  canUpdate: (region: Region) => boolean
  delete: () => void
  deselect: () => void
  moveSelection: (dx: number, dy: number) => void
  regions: RegionState
  selectArea: (rect: Rect.trect, selectionMode?: SelectionMode) => void
  selection: SelectionState
  selectPoint: (pt: Vector2.tvector2, selectionMode?: SelectionMode) => void
  selectId: (id: string, selectionMode?: SelectionMode) => void
  setRectX: (region: Region, dx: number) => void
  setRectX1: (region: Region, dx: number) => void
  setRectX2: (region: Region, dx: number) => void
  setRectY: (region: Region, dy: number) => void
  setRectY1: (region: Region, dy: number) => void
  setRectY2: (region: Region, dy: number) => void
  setRegions: R.Dispatch<R.SetStateAction<RegionState>>
  setSelection: R.Dispatch<R.SetStateAction<SelectionState>>
  transformedRegions: RegionState
  transformedSelection: SelectionState
  updateRegion: (id: string, region: Region) => void
  updateSelectedRegions: (fn: (region: Region) => Region) => void
}

const defaultContext: Context = {
  annotate() {
    throw Error("annotate called outside of context")
  },
  canCreate: true,
  canDelete() {
    return true
  },
  canRead() {
    return true
  },
  canUpdate() {
    return true
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
  selectId() {
    throw Error("selectId called outside of context")
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
  updateRegion() {
    throw Error("updateRegion called outside of context")
  },
  updateSelectedRegions() {
    throw Error("updateSelectedRegions called outside of context")
  },
}

const Context = R.createContext(defaultContext)

type InitialState<T> = T | (() => T)

export type ProviderProps = {
  canCreate?: Context["canCreate"]
  canDelete?: Context["canDelete"]
  canRead?: Context["canRead"]
  canUpdate?: Context["canUpdate"]
  children: R.ReactNode
  initRegions?: InitialState<Context["regions"]>
  initSelection?: InitialState<Context["selection"]>
}

export function Provider(props: ProviderProps) {
  // contexts
  const { input } = Input.useContext()
  const axis = Axis.useContext()

  // access control
  const canCreate = props.canCreate ?? true
  const canDelete = props.canDelete ?? defaultContext.canDelete
  const canRead = props.canRead ?? defaultContext.canRead
  const canUpdate = props.canUpdate ?? defaultContext.canUpdate

  // state
  const [regions, setRegions] = R.useState(
    props.initRegions ?? defaultContext.regions,
  )
  const [selection, setSelection] = R.useState(
    props.initSelection ?? defaultContext.selection,
  )

  // computed state
  const transformedRegions = R.useMemo(() => {
    const next = new Map()
    for (const [id, region] of regions) {
      if (canRead(region)) next.set(id, region)
    }
    return next
  }, [canRead, regions])

  const transformedSelection = R.useMemo(
    () => new Set(selection).intersection(transformedRegions),
    [selection, transformedRegions],
  )

  // helpers
  const selectHelper = R.useCallback(
    (
      selectFn: (rect: Rect.trect) => boolean,
      selectionMode?: SelectionMode,
    ) => {
      setSelection(prev => {
        const next: SelectionState = new Set()
        for (const r of regions.values()) {
          const u = computeRectInverse(r, axis)
          if (
            selectFn(
              Rect.logical(
                u,
                input.xaxis?.unit == r.xunit,
                input.yaxis?.unit == r.yunit,
              ),
            )
          ) {
            next.add(r.id)
          }
        }
        return concatSelection(
          prev,
          next,
          selectionMode ?? SelectionMode.replace,
        )
      })
    },
    [axis, input, regions],
  )

  const updateRegionRect = R.useCallback(
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
  const annotate: Context["annotate"] = R.useCallback(
    (rect, xaxis, yaxis, userData) => {
      if (!canCreate) return
      const id = Format.randomBytes(10)
      setRegions(prev =>
        new Map(prev).set(id, {
          ...userData,
          id,
          ...rect,
          xunit: xaxis.unit,
          yunit: yaxis.unit,
        }),
      )
      setSelection(new Set([id]))
    },
    [canCreate],
  )

  const delete_: Context["delete"] = R.useCallback(() => {
    setRegions(prev => {
      const next = new Map()
      for (const [id, region] of prev) {
        if (!selection.has(id) || !canDelete(region)) {
          next.set(id, region)
        }
      }
      return next
    })
    setSelection(new Set())
  }, [canDelete, selection])

  const deselect: Context["deselect"] = R.useCallback(() => {
    setSelection(new Set())
  }, [])

  const moveSelection: Context["moveSelection"] = R.useCallback(
    (dx, dy) => {
      setRegions(
        prev =>
          new Map(
            Array.from(prev, ([id, region]) => {
              if (!selection.has(id) || !canUpdate(region)) return [id, region]
              return [
                id,
                updateRegionRect(region, rect => ({
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
    [canUpdate, input, selection, updateRegionRect],
  )

  const selectArea: Context["selectArea"] = R.useCallback(
    (area, selectionMode) => {
      selectHelper(
        rect => Rect.intersectRect(rect, area) != null,
        selectionMode,
      )
    },
    [selectHelper],
  )

  const selectId: Context["selectId"] = R.useCallback((id, selectionMode) => {
    setSelection(prev => {
      const next = new Set([id])
      return concatSelection(prev, next, selectionMode ?? SelectionMode.replace)
    })
  }, [])

  const selectPoint: Context["selectPoint"] = R.useCallback(
    (pt, selectionMode) => {
      selectHelper(rect => Rect.intersectPoint(rect, pt), selectionMode)
    },
    [selectHelper],
  )

  const setRectX: Context["setRectX"] = R.useCallback(
    (region, dx) => {
      if (!canUpdate(region)) return
      setRegions(prev =>
        new Map(prev).set(
          region.id,
          updateRegionRect(region, rect => ({
            x: Mathx.clamp(rect.x + dx, 0, 1 - rect.width),
            y: rect.y,
            width: rect.width,
            height: rect.height,
          })),
        ),
      )
    },
    [canUpdate, updateRegionRect],
  )
  const setRectX1: Context["setRectX1"] = R.useCallback(() => {
    // todo: implement
  }, [])

  const setRectX2: Context["setRectX2"] = R.useCallback(
    (region, dx) => {
      if (!canUpdate(region)) return
      setRegions(prev =>
        new Map(prev).set(
          region.id,
          updateRegionRect(region, rect => ({
            x: rect.x,
            y: rect.y,
            width: Mathx.clamp(rect.width + dx, 0.01, 1 - rect.x),
            height: rect.height,
          })),
        ),
      )
    },
    [canUpdate, updateRegionRect],
  )

  const setRectY: Context["setRectY"] = R.useCallback(
    (region, dy) => {
      if (!canUpdate(region)) return
      setRegions(prev =>
        new Map(prev).set(
          region.id,
          updateRegionRect(region, rect => ({
            x: rect.x,
            y: Mathx.clamp(rect.y + dy, 0, 1 - rect.height),
            width: rect.width,
            height: rect.height,
          })),
        ),
      )
    },
    [canUpdate, updateRegionRect],
  )

  const setRectY1: Context["setRectY1"] = R.useCallback(
    (region, dy) => {
      if (!canUpdate(region)) return
      setRegions(prev =>
        new Map(prev).set(
          region.id,
          updateRegionRect(region, rect => ({
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
    [canUpdate, updateRegionRect],
  )

  const setRectY2: Context["setRectY2"] = R.useCallback(
    (region, dy) => {
      if (!canUpdate(region)) return
      setRegions(prev =>
        new Map(prev).set(
          region.id,
          updateRegionRect(region, rect => ({
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: Mathx.clamp(rect.height + dy, 0.01, 1 - rect.y),
          })),
        ),
      )
    },
    [canUpdate, updateRegionRect],
  )

  const updateRegion: Context["updateRegion"] = R.useCallback(
    (id, region) => {
      if (!canUpdate(region)) return
      setRegions(prev => new Map(prev).set(id, region))
    },
    [canUpdate],
  )

  const updateSelectedRegions: Context["updateSelectedRegions"] = R.useCallback(
    updateFn => {
      setRegions(
        prev =>
          new Map(
            Array.from(prev, ([id, region]) => {
              if (!transformedSelection.has(id) || !canUpdate(region))
                return [id, region]
              return [id, updateFn(region)]
            }),
          ),
      )
    },
    [canUpdate, transformedSelection],
  )

  // computed context
  const value: Context = R.useMemo(
    () => ({
      annotate,
      canCreate,
      canDelete,
      canRead,
      canUpdate,
      delete: delete_,
      deselect,
      moveSelection,
      regions,
      selectArea,
      selectId,
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
      transformedRegions,
      transformedSelection,
      updateRegion,
      updateSelectedRegions,
    }),
    [
      annotate,
      canCreate,
      canDelete,
      canRead,
      canUpdate,
      delete_,
      deselect,
      moveSelection,
      regions,
      selectArea,
      selectId,
      selection,
      selectPoint,
      setRectX,
      setRectX1,
      setRectX2,
      setRectY,
      setRectY1,
      setRectY2,
      updateRegion,
      updateSelectedRegions,
      transformedRegions,
      transformedSelection,
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
  const prev = useContext()
  const next: Context = R.useMemo(() => {
    const transformedRegions = props.fn(prev.regions)
    const transformedSelection = new Set(prev.selection).intersection(
      transformedRegions,
    )
    return {
      ...prev,
      transformedRegions,
      transformedSelection,
    }
  }, [prev, props.fn])
  return <Context.Provider children={props.children} value={next} />
}

export function transformFilter(fn: (region: Region) => boolean) {
  return (regions: RegionState) => {
    const next = new Map()
    for (const [id, region] of regions) if (fn(region)) next.set(id, region)
    return next
  }
}
