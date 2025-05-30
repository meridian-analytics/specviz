import * as React from "react"
import * as Input from "./input"
import * as Mathx from "./math"
import type * as Rect from "./rect"
import type * as Vector2 from "./vector2"

export type Context = {
  state: State
  resetView: () => void
  scroll: (dx: number, dy: number) => void
  scrollTo: (scroll: Scroll) => void
  zoom: (dx: number, dy: number) => void
  zoomArea: (rect: Rect.Rect) => void
  zoomPoint: (point: Vector2.Vector2, zoomDirection?: ZoomDirection) => void
  zoomScroll: (dx: number, dy: number) => void
}

type State = {
  scroll: Scroll
  zoom: Zoom
}

type Scroll = Vector2.Vector2

type Zoom = Vector2.Vector2

export enum ZoomDirection {
  out = 0,
  in = 1,
}

const defaultContext: Context = {
  state: {
    scroll: { x: 0, y: 0 },
    zoom: { x: 1, y: 1 },
  },
  resetView: () => {
    throw Error("resetView called outside of context")
  },
  scroll: () => {
    throw Error("scroll called outside of context")
  },
  scrollTo: () => {
    throw Error("scrollTo called outside of context")
  },
  zoom: () => {
    throw Error("zoom called outside of context")
  },
  zoomArea: () => {
    throw Error("zoomArea called outside of context")
  },
  zoomPoint: () => {
    throw Error("zoomPoint called outside of context")
  },
  zoomScroll: () => {
    throw Error("zoomScroll called outside of context")
  },
}

const ZOOM_MAX = { x: 10, y: 10 }

const Context = React.createContext(defaultContext)

export type ProviderProps = {
  children: React.ReactNode
}

export function Provider(props: ProviderProps) {
  const input = Input.useContext()
  const [state, setState] = React.useState(defaultContext.state)

  const resetView: Context["resetView"] = React.useCallback(() => {
    setState(defaultContext.state)
  }, [])

  const scroll: Context["scroll"] = React.useCallback((dx, dy) => {
    setState(prev => ({
      ...prev,
      scroll: {
        x: Mathx.clamp(prev.scroll.x + dx, 0, prev.zoom.x - 1),
        y: Mathx.clamp(prev.scroll.y + dy, 0, prev.zoom.y - 1),
      },
    }))
  }, [])

  const scrollTo: Context["scrollTo"] = React.useCallback(scroll => {
    setState(prev => ({
      ...prev,
      scroll: {
        x: Mathx.clamp(scroll.x, 0, prev.zoom.x - 1),
        y: Mathx.clamp(scroll.y, 0, prev.zoom.y - 1),
      },
    }))
  }, [])

  const zoom: Context["zoom"] = React.useCallback((dx, dy) => {
    setState(prev => ({
      ...prev,
      zoom: {
        x: Mathx.clamp(prev.zoom.x + dx, 1, ZOOM_MAX.x),
        y: Mathx.clamp(prev.zoom.y + dy, 1, ZOOM_MAX.y),
      },
    }))
  }, [])

  const zoomArea: Context["zoomArea"] = React.useCallback(rect => {
    setState(prev => {
      const zx = Mathx.clamp(1 / rect.width, 1, ZOOM_MAX.x)
      const zy = Mathx.clamp(1 / rect.height, 1, ZOOM_MAX.y)
      return {
        zoom: { x: zx, y: zy },
        scroll: {
          x: Mathx.clamp(-0.5 + (rect.x + rect.width / 2) * zx, 0, zx - 1),
          y: Mathx.clamp(-0.5 + (rect.y + rect.height / 2) * zy, 0, zy - 1),
        },
      }
    })
  }, [])

  const zoomPoint: Context["zoomPoint"] = React.useCallback(
    (point, zoomDirection) => {
      setState(prev => {
        const step = zoomDirection == ZoomDirection.out ? -0.5 : 0.5
        const rx = point.x * prev.zoom.x - prev.scroll.x
        const ry = point.y * prev.zoom.y - prev.scroll.y
        const zx = Mathx.clamp(prev.zoom.x + step, 1, ZOOM_MAX.x)
        const zy = Mathx.clamp(prev.zoom.y + step, 1, ZOOM_MAX.y)
        return {
          zoom: { x: zx, y: zy },
          scroll: {
            x: Mathx.clamp(point.x * zx - rx, 0, zx - 1),
            y: Mathx.clamp(point.y * zy - ry, 0, zy - 1),
          },
        }
      })
    },
    [],
  )

  const zoomScroll: Context["zoomScroll"] = React.useCallback(
    (dx, dy) => {
      setState(prev => {
        const zx = Mathx.clamp(prev.zoom.x + dx, 1, ZOOM_MAX.x)
        const zy = Mathx.clamp(prev.zoom.y + dy, 1, ZOOM_MAX.y)
        return {
          zoom: { x: zx, y: zy },
          scroll: {
            x: Mathx.clamp(
              input.mousedown.abs.x * zx - input.mousedown.rel.x,
              0,
              zx - 1,
            ),
            y: Mathx.clamp(
              input.mousedown.abs.y * zy - input.mousedown.rel.y,
              0,
              zy - 1,
            ),
          },
        }
      })
    },
    [input.mousedown.abs, input.mousedown.rel],
  )

  const value: Context = React.useMemo(
    () => ({
      resetView,
      scroll,
      scrollTo,
      state,
      zoom,
      zoomArea,
      zoomPoint,
      zoomScroll,
    }),
    [resetView, scroll, scrollTo, state, zoom, zoomArea, zoomPoint, zoomScroll],
  )

  return <Context.Provider children={props.children} value={value} />
}

export function useContext() {
  return React.useContext(Context)
}

export type TransformProps = {
  children: React.ReactNode
  fn: (state: State) => State
}

export function Transform(props: TransformProps) {
  const prev = useContext()
  const next: Context = React.useMemo(() => {
    const state = props.fn(prev.state)
    return { ...prev, state }
  }, [prev, props.fn])
  return <Context.Provider children={props.children} value={next} />
}
