import * as R from "react"
import * as Audio from "../../audio2/src"
import type * as Hooks from "./hooks"
import * as Region from "./region"
import * as Viewport from "./viewport"

type Tool = "annotate" | "select" | "zoom" | "pan"

type Context = {
  actions: {
    navigator: Hooks.UseMouseProps
    visualization: Hooks.UseMouseProps
  }
  tool: Tool
  setTool: R.Dispatch<R.SetStateAction<Tool>>
}

const defaultContext: Context = {
  actions: {
    navigator: {},
    visualization: {},
  },
  tool: "annotate",
  setTool() {
    throw Error("setTool called outside of context")
  },
}

const Context = R.createContext(defaultContext)

export type ProviderProps = {
  children: R.ReactNode
}

export function Provider(props: ProviderProps) {
  const audio = Audio.useContext()
  const region = Region.useContext()
  const viewport = Viewport.useContext()
  const [tool, setTool] = R.useState(defaultContext.tool)

  const navigatorActions = R.useMemo<Hooks.UseMouseProps>(() => {
    return {
      onClick: (unit, rel, abs, xaxis, yaxis) => {
        switch (tool) {
          case "annotate":
          case "select":
          case "pan":
            viewport.scrollTo({
              x: rel.x * viewport.state.zoom.x - 0.5,
              y: rel.y * viewport.state.zoom.y - 0.5,
            })
            break
          case "zoom":
            viewport.resetView()
            break
        }
      },
      onMove: (dx, dy) => {
        viewport.scroll(dx * viewport.state.zoom.x, dy * viewport.state.zoom.y)
      },
    }
  }, [
    tool,
    viewport.resetView,
    viewport.scroll,
    viewport.scrollTo,
    viewport.state.zoom.x,
    viewport.state.zoom.y,
  ])

  const visualizationActions = R.useMemo<Hooks.UseMouseProps>(() => {
    return {
      onClick: (unit, rel, abs, xaxis, yaxis) => {
        switch (tool) {
          case "annotate":
            region.selectPoint(abs) // new
            break
          case "select":
            region.selectPoint(abs)
            break
          case "zoom":
            viewport.zoomPoint(abs)
            break
          case "pan":
            break
        }
      },
      onContextMenu: (unit, rel, abs, xaxis, yaxis) => {
        audio.transport.seek(unit.x)
      },
      onMove: (dx, dy) => {
        switch (tool) {
          case "annotate":
          case "select":
          case "zoom":
            break
          case "pan":
            if (region.selection.size == 0) {
              viewport.scroll(-dx, -dy)
            } else {
              region.moveSelection(
                dx / viewport.state.zoom.x,
                dy / viewport.state.zoom.y,
              )
            }
            break
        }
      },
      onRect: (unit, rel, abs, xaxis, yaxis) => {
        switch (tool) {
          case "annotate":
            region.annotate(unit, xaxis, yaxis)
            break
          case "select":
            region.selectArea(abs)
            break
          case "zoom":
            viewport.zoomArea(abs)
            break
          case "pan":
            break
        }
      },
    }
  }, [
    audio.transport.seek,
    region.annotate,
    region.moveSelection,
    region.selectArea,
    region.selectPoint,
    region.selection,
    tool,
    viewport.scroll,
    viewport.state.zoom.x,
    viewport.state.zoom.y,
    viewport.zoomArea,
    viewport.zoomPoint,
  ])

  return (
    <Context.Provider
      children={props.children}
      value={{
        actions: {
          navigator: navigatorActions,
          visualization: visualizationActions,
        },
        tool,
        setTool,
      }}
    />
  )
}

export function useContext() {
  return R.useContext(Context)
}
