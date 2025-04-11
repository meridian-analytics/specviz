import * as R from "react"
import * as Axis from "./axis"
import * as Func from "./func"
import * as IMap from "./imap"
import * as Plane from "./plane"
import * as Rect from "./rect"
import * as Undo from "./undo"
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

export type FilterFn<T = Properties> = (region: Region<T>) => boolean

export type Context<T = Properties> = {
  canCreate: boolean
  count: number
  regions: RegionState<T>
  selection: SelectionState
  canDelete: (region: Region<T>) => boolean
  canRead: (region: Region<T>) => boolean
  canUpdate: (region: Region<T>) => boolean
  create: (
    region: Region<T>,
    options?: {
      autoSelect?: boolean
    },
  ) => void
  delete: (selection: SelectionState) => void
  deselect: () => void
  move: (
    selection: SelectionState,
    moveFn: R.SetStateAction<Rect.Rect>,
    xaxis?: Axis.Axis,
    yaxis?: Axis.Axis,
  ) => void
  redo?: () => void
  render?: (props: AnnotationProps<T>) => JSX.Element
  reset: (value: RegionState<T>) => void
  select: (
    selectFn: R.SetStateAction<SelectionState>,
    selectionMode?: SelectionMode,
  ) => void
  selectArea: (
    rect: Rect.Rect,
    selectionMode?: SelectionMode,
    xaxis?: Axis.Axis,
    yaxis?: Axis.Axis,
  ) => void
  selectPoint: (
    pt: Vector2.Vector2,
    selectionMode?: SelectionMode,
    xaxis?: Axis.Axis,
    yaxis?: Axis.Axis,
  ) => void
  undo?: () => void
  update: (
    selection: SelectionState,
    updateFn: R.SetStateAction<Region<T>>,
  ) => void
  updateProperties: (
    selection: SelectionState,
    updateFn: R.SetStateAction<T>,
  ) => void
  updateProperty: <K extends keyof T>(
    selection: SelectionState,
    key: K,
    updateFn: R.SetStateAction<T[K]>,
  ) => void
}

export type ProviderProps = {
  canCreate?: Context["canCreate"]
  children: R.ReactNode
  initRegions?: Func.InitialState<Context["regions"]>
  initSelection?: Func.InitialState<Context["selection"]>
  canDelete?: Context["canDelete"]
  canRead?: Context["canRead"]
  canUpdate?: Context["canUpdate"]
  filterFn?: FilterFn
  render?: Context["render"]
}

export function Provider(props: ProviderProps) {
  // contexts
  const axis = Axis.useContext()

  // access control
  const canCreate = props.canCreate ?? defaultContext.canCreate
  const canDelete = props.canDelete ?? defaultContext.canDelete
  const canRead = props.canRead ?? defaultContext.canRead
  const canUpdate = props.canUpdate ?? defaultContext.canUpdate

  // state
  const { state, setState, undo, redo, reset } = useNoteState(() => ({
    regions:
      Func.applyInitialState(props.initRegions) ?? defaultContext.regions,
    selection:
      Func.applyInitialState(props.initSelection) ?? defaultContext.selection,
  }))

  // filter state
  const filteredState = R.useMemo(() => {
    return applyFilter(concatFilter(canRead, props.filterFn), state)
  }, [canRead, state, props.filterFn])

  // commands
  const update: Context["update"] = R.useCallback(
    (selection, fn) => {
      setState(StateMutation.update, prev => {
        return {
          regions: IMap.update(prev.regions, selection, region =>
            canUpdate(region) ? Func.applySetState(fn, region) : region,
          ),
          selection,
        }
      })
    },
    [canUpdate, setState],
  )

  const updateProperties: Context["updateProperties"] = R.useCallback(
    (selection, fn) => {
      update(selection, region => ({
        ...region,
        properties: Func.applySetState(fn, region.properties ?? {}),
      }))
    },
    [update],
  )

  const updateProperty: Context["updateProperty"] = R.useCallback(
    (selection, key, value) => {
      updateProperties(selection, prev => ({
        ...prev,
        [key]: value,
      }))
    },
    [updateProperties],
  )

  const create: Context["create"] = R.useCallback(
    (region, options) => {
      setState(StateMutation.create, prev => {
        if (!canCreate) return prev
        const existing = prev.regions.get(region.id)
        if (existing && !canUpdate(existing)) return prev
        return {
          regions: IMap.set(prev.regions, region.id, region),
          selection: options?.autoSelect
            ? new Set([region.id])
            : prev.selection,
        }
      })
    },
    [canCreate, canUpdate, setState],
  )

  const delete_: Context["delete"] = R.useCallback(
    selection => {
      setState(StateMutation.delete, prev => {
        if (selection.size == 0) return prev
        return {
          regions: IMap.filter(
            prev.regions,
            region => !canDelete(region) || !selection.has(region.id),
          ),
          selection: defaultContext.selection,
        }
      })
    },
    [canDelete, setState],
  )

  const deselect: Context["deselect"] = R.useCallback(() => {
    setState(StateMutation.select, prev => {
      if (prev.selection.size == 0) return prev
      return {
        regions: prev.regions,
        selection: defaultContext.selection,
      }
    })
  }, [setState])

  const move: Context["move"] = R.useCallback(
    (selection, moveFn, xaxis, yaxis) => {
      update(selection, region => {
        const px = xaxis == null || xaxis.unit == region.xunit
        const py = yaxis == null || yaxis.unit == region.yunit
        if (!px && !py) return region
        const ax = axis[region.xunit]
        const ay = axis[region.yunit]
        if (ax == null) throw Error(`axis not found: ${region.xunit}`)
        if (ay == null) throw Error(`axis not found: ${region.yunit}`)
        const rect = Rect.logical2(
          region,
          moveInUnitSpace(region, moveFn, ax, ay),
          px,
          py,
        )
        if (Rect.equal(rect, region)) return region
        return { ...region, ...rect }
      })
    },
    [axis, update],
  )

  const select: Context["select"] = R.useCallback(
    (selection, selectionMode) => {
      setState(StateMutation.select, prev => {
        const filtered = applyFilter(props.filterFn, prev)
        return {
          regions: prev.regions,
          selection: concatSelection(
            filtered.selection,
            Func.applySetState(selection, filtered.selection),
            selectionMode ?? SelectionMode.replace,
          ),
        }
      })
    },
    [props.filterFn, setState],
  )

  const selectByRect = R.useCallback(
    (
      selectFn: (rect: Rect.Rect) => boolean,
      selectionMode?: SelectionMode,
      xaxis?: Axis.Axis,
      yaxis?: Axis.Axis,
    ) => {
      setState(StateMutation.select, prev => {
        const filtered = applyFilter(props.filterFn, prev)
        const next: SelectionState = new Set()
        for (const region of filtered.regions.values()) {
          const x = axis[region.xunit]
          const y = axis[region.yunit]
          if (x == null) throw Error(`axis not found: ${region.xunit}`)
          if (y == null) throw Error(`axis not found: ${region.yunit}`)
          if (
            selectFn(
              Rect.logical(
                Axis.computeRectInverse(x, y, region),
                xaxis?.unit == region.xunit,
                yaxis?.unit == region.yunit,
              ),
            )
          ) {
            next.add(region.id)
          }
        }
        return {
          regions: prev.regions,
          selection: concatSelection(
            filtered.selection,
            next,
            selectionMode ?? SelectionMode.replace,
          ),
        }
      })
    },
    [axis, props.filterFn, setState],
  )

  const selectArea: Context["selectArea"] = R.useCallback(
    (area, selectionMode, xaxis, yaxis) => {
      selectByRect(
        rect => Rect.intersectRect(rect, area) != null,
        selectionMode,
        xaxis,
        yaxis,
      )
    },
    [selectByRect],
  )

  const selectPoint: Context["selectPoint"] = R.useCallback(
    (pt, selectionMode, xaxis, yaxis) => {
      selectByRect(
        rect => Rect.intersectPoint(rect, pt),
        selectionMode,
        xaxis,
        yaxis,
      )
    },
    [selectByRect],
  )

  return (
    <Context.Provider
      children={props.children}
      value={{
        canCreate,
        count: state.regions.size,
        regions: filteredState.regions,
        selection: filteredState.selection,
        canDelete,
        canRead,
        canUpdate,
        create,
        delete: delete_,
        deselect,
        move,
        redo,
        render: props.render,
        reset,
        select,
        selectArea,
        selectPoint,
        undo,
        update,
        updateProperties,
        updateProperty,
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

export type AnnotationProps<T = Properties> = {
  children?: (props: AnnotationProps<T>) => JSX.Element
  dimensions: Vector2.Vector2
  region: Region<T>
  selected?: boolean
  svgProps?: R.SVGProps<SVGSVGElement>
  viewerId?: string
}

// SVG should use a unique key to avoid Chrome cache
export function annotationKey(region: Region, viewport: Viewport.Context) {
  return `${region.id}-${region.x}-${region.y}-${region.width}-${region.height}-${viewport.state.zoom.x}-${viewport.state.zoom.y}`
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

// internals
type State<T = Properties> = {
  regions: RegionState<T>
  selection: SelectionState
}

type UseNoteState<T> = {
  state: State<T>
  setState: (key: StateMutation, fn: R.SetStateAction<State<T>>) => void
  undo?: () => void
  redo?: () => void
  reset: (value: RegionState<T>) => void
}

enum StateMutation {
  create = "create",
  delete = "delete",
  select = "select",
  update = "update",
}

const defaultContext: Context = {
  canCreate: true,
  count: 0,
  regions: new Map(),
  selection: new Set(),
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
  delete() {
    throw Error("delete called outside of context")
  },
  deselect() {
    throw Error("deselect called outside of context")
  },
  move() {
    throw Error("move called outside of context")
  },
  reset() {
    throw Error("render called outside of context")
  },
  select() {
    throw Error("select called outside of context")
  },
  selectArea() {
    throw Error("selectArea called outside of context")
  },
  selectPoint() {
    throw Error("selectPoint called outside of context")
  },
  update() {
    throw Error("update called outside of context")
  },
  updateProperties() {
    throw Error("updateProperties called outside of context")
  },
  updateProperty() {
    throw Error("updateProperty called outside of context")
  },
}

const Context = R.createContext(defaultContext)

function applyFilter<T = Properties>(
  filterFn: undefined | FilterFn<T>,
  state: State<T>,
) {
  if (filterFn == null) return state
  const regions = IMap.filter(state.regions, filterFn)
  return {
    regions,
    selection: new Set(state.selection).intersection(regions),
  }
}

function concatFilter<T = Properties>(
  f: FilterFn<T>,
  g?: FilterFn<T>,
): FilterFn<T> {
  if (g == null) return f
  return r => f(r) && g(r)
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

function equalFn<T>(p: State<T>, q: State<T>) {
  return Object.is(p.regions, q.regions) && Object.is(p.selection, q.selection)
}

function moveInUnitSpace(
  region: Region<Properties>,
  moveFn: R.SetStateAction<Rect.Rect>,
  xaxis: Axis.Axis,
  yaxis: Axis.Axis,
) {
  return Axis.computeRect(
    xaxis,
    yaxis,
    moveFn instanceof Function
      ? moveFn(Axis.computeRectInverse(xaxis, yaxis, region))
      : moveFn,
  )
}

function useNoteState<T>(
  initState: Func.InitialState<State<T>>,
): UseNoteState<T> {
  const [internalState, setInternalState] = R.useState(() =>
    Undo.init(initState, equalFn),
  )
  const timeRef = R.useRef(0)
  const keyRef = R.useRef("")
  const setState: UseNoteState<T>["setState"] = R.useCallback((key, fn) => {
    const now = Date.now()
    const isSelectAction = key == StateMutation.select
    const threshold = isSelectAction ? 5000 : 1000
    const isBelowThreshold = now - timeRef.current < threshold
    const isSameAction = key == keyRef.current
    const preserveUndo = isSameAction && isBelowThreshold
    const preserveRedo = isSelectAction
    timeRef.current = now
    keyRef.current = key
    setInternalState(prev =>
      Undo.setState(
        prev,
        Func.applySetState(fn, prev.state),
        preserveUndo ? prev.undo : undefined,
        preserveRedo ? prev.redo : undefined,
      ),
    )
  }, [])
  const reset: UseNoteState<T>["reset"] = R.useCallback(
    fn =>
      setInternalState(
        Undo.init(
          {
            regions: Func.applyInitialState(fn),
            selection: defaultContext.selection,
          },
          equalFn,
        ),
      ),
    [],
  )
  const undo = R.useCallback(() => setInternalState(Undo.undo), [])
  const redo = R.useCallback(() => setInternalState(Undo.redo), [])
  return {
    state: internalState.state,
    setState,
    undo: internalState.undo ? undo : undefined,
    redo: internalState.redo ? redo : undefined,
    reset,
  }
}
