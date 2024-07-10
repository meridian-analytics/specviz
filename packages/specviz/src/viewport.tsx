import * as React from "react"
import * as Input from "./input"
import * as Mathx from "./mathx"
import type * as Rect from "./rect"
import type * as Vector2 from "./vector2"

export type Context = {
  state: State
  resetView: () => void
  scroll: (dx: number, dy: number) => void
  scrollTo: (scroll: Scroll) => void
  zoom: (dx: number, dy: number) => void
  zoomArea: (rect: Rect.trect) => void
  zoomPoint: (point: Vector2.tvector2) => void
  zoomScroll: (dx: number, dy: number) => void
}

type State = {
  scroll: Scroll
  zoom: Zoom
}

type Scroll = Vector2.tvector2

type Zoom = Vector2.tvector2

const defaultContext: Context = {
  state: {
    scroll: { x: 0, y: 0 },
    zoom: { x: 1, y: 1 },
  },
  resetView: () => {
    throw new Error("resetView called outside of context")
  },
  scroll: (dx, dy) => {
    throw new Error("scroll called outside of context")
  },
  scrollTo: scroll => {
    throw new Error("scrollTo called outside of context")
  },
  zoom: (dx, dy) => {
    throw new Error("zoom called outside of context")
  },
  zoomArea: rect => {
    throw new Error("zoomArea called outside of context")
  },
  zoomPoint: point => {
    throw new Error("zoomPoint called outside of context")
  },
  zoomScroll: (dx, dy) => {
    throw new Error("zoomScroll called outside of context")
  },
}

const ZOOM_MAX = { x: 10, y: 10 }

const Context = React.createContext(defaultContext)

type ProviderProps = {
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

  const zoomPoint: Context["zoomPoint"] = React.useCallback(point => {
    setState(prev => {
      const rx = point.x * prev.zoom.x - prev.scroll.x
      const ry = point.y * prev.zoom.y - prev.scroll.y
      const zx = Mathx.clamp(prev.zoom.x + 0.5, 1, ZOOM_MAX.x)
      const zy = Mathx.clamp(prev.zoom.y + 0.5, 1, ZOOM_MAX.y)
      return {
        zoom: { x: zx, y: zy },
        scroll: {
          x: Mathx.clamp(point.x * zx - rx, 0, zx - 1),
          y: Mathx.clamp(point.y * zy - ry, 0, zy - 1),
        },
      }
    })
  }, [])

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

  const value = React.useMemo<Context>(
    () => ({
      state,
      resetView,
      scroll,
      scrollTo,
      zoom,
      zoomArea,
      zoomPoint,
      zoomScroll,
    }),
    [state, resetView, scroll, scrollTo, zoom, zoomArea, zoomPoint, zoomScroll],
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
  const context = useContext()
  const value = React.useMemo<Context>(() => {
    const state = props.fn(context.state)
    return { ...context, state }
  }, [context, props.fn])
  return <Context.Provider children={props.children} value={value} />
}
