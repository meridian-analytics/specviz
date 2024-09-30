import * as R from "react"
import * as Axis from "./axis"
import * as Input from "./input"
import * as Mathx from "./math"
import * as Plane from "./plane"
import * as Rect from "./rect"
import type * as Vector2 from "./vector2"
import * as Viewport from "./viewport"

export type Properties = Record<string, unknown>

export type Region<T = Properties> = {
  id: string
  x: number
  y: number
  width: number
  height: number
  xunit: string
  yunit: string
  properties?: T
}

export type RegionState<T = Properties> = Map<Region["id"], Region<T>>

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

export type Context<T = Properties> = {
  canCreate: boolean
  regions: RegionState<T>
  selection: SelectionState
  transformedRegions: RegionState<T>
  transformedSelection: SelectionState
  canDelete: (region: Region<T>) => boolean
  canRead: (region: Region<T>) => boolean
  canUpdate: (region: Region<T>) => boolean
  create: (
    region: Region<T>,
    options?: {
      autoSelect?: boolean
    },
  ) => void
  deleteSelection: () => void
  deselect: () => void
  moveSelection: (dx: number, dy: number) => void
  render?: (props: AnnotationProps<T>) => JSX.Element
  selectArea: (rect: Rect.Rect, selectionMode?: SelectionMode) => void
  selectId: (id: string, selectionMode?: SelectionMode) => void
  selectPoint: (pt: Vector2.Vector2, selectionMode?: SelectionMode) => void
  setRectX: (region: Region<T>, dx: number) => void
  setRectX1: (region: Region<T>, dx: number) => void
  setRectX2: (region: Region<T>, dx: number) => void
  setRectY: (region: Region<T>, dy: number) => void
  setRectY1: (region: Region<T>, dy: number) => void
  setRectY2: (region: Region<T>, dy: number) => void
  setRegions: R.Dispatch<R.SetStateAction<RegionState<T>>>
  setSelection: R.Dispatch<R.SetStateAction<SelectionState>>
  updateRegion: (id: string, fn: R.SetStateAction<Region<T>>) => void
  updateRegionProperties: (
    id: string,
    fn: R.SetStateAction<undefined | T>,
  ) => void
  updateSelectedRegions: (fn: R.SetStateAction<Region<T>>) => void
}

const defaultContext: Context = {
  canCreate: true,
  regions: new Map(),
  selection: new Set(),
  transformedRegions: new Map(),
  transformedSelection: new Set(),
  create() {
    throw Error("annotate called outside of context")
  },
  canDelete() {
    return true
  },
  canRead() {
    return true
  },
  canUpdate() {
    return true
  },
  deleteSelection() {
    throw Error("delete called outside of context")
  },
  deselect() {
    throw Error("deselect called outside of context")
  },
  moveSelection() {
    throw Error("moveSelection called outside of context")
  },
  selectArea() {
    throw Error("selectArea called outside of context")
  },
  selectId() {
    throw Error("selectId called outside of context")
  },
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
  updateRegion() {
    throw Error("updateRegion called outside of context")
  },
  updateRegionProperties() {
    throw Error("updateRegionProperties called outside of context")
  },
  updateSelectedRegions() {
    throw Error("updateSelectedRegions called outside of context")
  },
}

const Context = R.createContext(defaultContext)

type InitialState<T> = T | (() => T)

export type ProviderProps = {
  canCreate?: Context["canCreate"]
  children: R.ReactNode
  initRegions?: InitialState<Context["regions"]>
  initSelection?: InitialState<Context["selection"]>
  canDelete?: Context["canDelete"]
  canRead?: Context["canRead"]
  canUpdate?: Context["canUpdate"]
  render?: Context["render"]
}

export function Provider(props: ProviderProps) {
  // contexts
  const { input } = Input.useContext()
  const axis = Axis.useContext()

  // access control
  const canCreate = props.canCreate ?? defaultContext.canCreate
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
    (selectFn: (rect: Rect.Rect) => boolean, selectionMode?: SelectionMode) => {
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
    (p: Region, func: (prev: Rect.Rect) => Rect.Rect) => {
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
  const create: Context["create"] = R.useCallback(
    (region, options) => {
      if (!canCreate) return
      setRegions(prev => new Map(prev).set(region.id, region))
      if (options?.autoSelect) setSelection(new Set([region.id]))
    },
    [canCreate],
  )

  const deleteSelection: Context["deleteSelection"] = R.useCallback(() => {
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
    (id, fn) => {
      setRegions(prev => {
        const region = prev.get(id)
        if (!region) return prev
        if (!canUpdate(region)) return prev
        return new Map(prev).set(id, typeof fn === "function" ? fn(region) : fn)
      })
    },
    [canUpdate],
  )

  const updateRegionProperties: Context["updateRegionProperties"] =
    R.useCallback(
      (id, fn) => {
        updateRegion(id, region => ({
          ...region,
          properties: typeof fn === "function" ? fn(region.properties) : fn,
        }))
      },
      [updateRegion],
    )

  const updateSelectedRegions: Context["updateSelectedRegions"] = R.useCallback(
    fn => {
      setRegions(prev => {
        const next = new Map(prev)
        for (const id of transformedSelection) {
          const region = prev.get(id)
          if (!region) continue
          if (!canUpdate(region)) continue
          next.set(id, typeof fn === "function" ? fn(region) : fn)
        }
        return next
      })
    },
    [canUpdate, transformedSelection],
  )

  return (
    <Context.Provider
      children={props.children}
      value={{
        canCreate,
        regions,
        selection,
        transformedRegions,
        transformedSelection,
        canDelete,
        canRead,
        canUpdate,
        create,
        deleteSelection,
        deselect,
        moveSelection,
        render: props.render,
        selectArea,
        selectId,
        selectPoint,
        setRectX,
        setRectX1,
        setRectX2,
        setRectY,
        setRectY1,
        setRectY2,
        setRegions,
        setSelection,
        updateRegion,
        updateRegionProperties,
        updateSelectedRegions,
      }}
    />
  )
}

export function useContext<T = Properties>() {
  return R.useContext(Context) as Context<T>
}

export function computeRectInverse(region: Region, axes: Axis.Context) {
  const x = axes[region.xunit]
  const y = axes[region.yunit]
  if (x == null) throw Error(`axis not found: ${region.xunit}`)
  if (y == null) throw Error(`axis not found: ${region.yunit}`)
  return Axis.computeRectInverse(x, y, region)
}

export function selectionMode(event: R.MouseEvent): SelectionMode {
  switch (true) {
    case event.ctrlKey || event.metaKey:
      return SelectionMode.invert
    case event.shiftKey:
      return SelectionMode.add
    case event.altKey:
      return SelectionMode.subtract
    default:
      return SelectionMode.replace
  }
}

export type TransformProps = {
  children: R.ReactNode
  fn: (regionState: RegionState) => RegionState
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

export type AnnotationProps<T = Properties> = {
  children?: (props: AnnotationProps<T>) => JSX.Element
  dimensions: Vector2.Vector2
  region: Region<T>
  selected?: boolean
  svgProps?: R.SVGProps<SVGSVGElement>
  viewerId?: string
}

export function Annotation(props: AnnotationProps): JSX.Element {
  const note = useContext()
  const plane = Plane.useContext()
  const viewport = Viewport.useContext()
  const render = props.children ?? note.render
  const svgProps = R.useMemo(() => {
    // compute logical rect
    const lrect = Rect.logical(
      Axis.computeRectInverse(plane.xaxis, plane.yaxis, props.region),
      plane.xaxis.unit == props.region.xunit,
      plane.yaxis.unit == props.region.yunit,
    )
    // rect out of bounds (not on axis)
    if (Number.isNaN(lrect.x)) return null
    if (Number.isNaN(lrect.y)) return null
    if (Number.isNaN(lrect.width)) return null
    if (Number.isNaN(lrect.height)) return null
    // viewbox
    const width = lrect.width * props.dimensions.x * viewport.state.zoom.x
    const height = lrect.height * props.dimensions.y * viewport.state.zoom.y
    const viewBox = `0 0 ${width} ${height}`
    // computed result
    return {
      className: props.selected
        ? "annotation annotation-selected"
        : "annotation",
      fontSize: "12pt",
      height: String(lrect.height),
      preserveAspectRatio: "none",
      viewBox,
      width: String(lrect.width),
      x: String(lrect.x),
      y: String(lrect.y),
    }
  }, [
    plane.xaxis,
    plane.yaxis,
    props.dimensions,
    props.region,
    props.selected,
    viewport.state.zoom,
  ])
  return <>{svgProps && render?.({ ...props, svgProps })}</>
}
