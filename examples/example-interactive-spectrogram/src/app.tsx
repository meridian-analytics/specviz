import * as Specviz from "@meridian_cfi/specviz"
import * as React from "react"

type Props = {
  spectrogram: string
  duration: number
}

type Context = {
  spectrogram: string
}

const Context = React.createContext<Context | null>(null)

function useContext() {
  const context = React.useContext(Context)
  if (context == null) throw Error("useContext must be used within a Provider")
  return context
}

export default function (props: Props) {
  return (
    <AppProvider {...props}>
      <App />
    </AppProvider>
  )
}

function AppProvider(props: Props & { children: React.ReactNode }) {
  const axes: Specviz.Axis.Context = React.useMemo(
    () => ({
      seconds: Specviz.Axis.time(0, props.duration),
      hertz: Specviz.Axis.frequency(20000, 0),
    }),
    [props.duration],
  )
  return (
    <Context.Provider value={{ spectrogram: props.spectrogram }}>
      <Specviz.Axis.Provider value={axes}>
        <Specviz.Input.Provider>
          <Specviz.Viewport.Provider children={props.children} />
        </Specviz.Input.Provider>
      </Specviz.Axis.Provider>
    </Context.Provider>
  )
}

function App() {
  const app = useContext()
  const viewport = Specviz.Viewport.useContext()
  const zoomX: Specviz.Action.Handler["onWheel"] = React.useCallback(
    ({ dx, dy, event }) => {
      if (event.altKey) {
        viewport.zoomScroll(dy, 0)
      } else {
        viewport.zoomScroll(-dy, 0)
      }
    },
    [viewport.zoomScroll],
  )
  const zoomY: Specviz.Action.Handler["onWheel"] = React.useCallback(
    ({ dx, dy, event }) => {
      if (event.altKey) {
        viewport.zoomScroll(0, dy)
      } else {
        viewport.zoomScroll(0, -dy)
      }
    },
    [viewport.zoomScroll],
  )
  const pan: Specviz.Action.Handler["onDrag"] = React.useCallback(
    ({ dx, dy, event }) => {
      viewport.scroll(-dx, -dy)
    },
    [viewport.scroll],
  )
  const jump: Specviz.Action.Handler["onClick"] = React.useCallback(
    ({ unit, rel, abs, xaxis, yaxis, event }) => {
      viewport.scrollTo({
        x: rel.x * viewport.state.zoom.x - 0.5,
        y: rel.y * viewport.state.zoom.y - 0.5,
      })
    },
    [viewport.scrollTo, viewport.state.zoom.x, viewport.state.zoom.y],
  )
  return (
    <div
      style={{
        backgroundColor: "cornsilk",
        border: "1px solid burlywood",
        display: "grid",
        gridGap: "1rem",
        gridTemplateColumns: "80px 1fr",
        gridTemplateRows: "40px 400px 20px",
        gridTemplateAreas: `
          ". nav"
          "y viz"
          ". x"
        `,
        margin: "1.5rem 0",
        padding: "1rem",
      }}
    >
      <Specviz.Plane.Provider xaxis="seconds" yaxis="hertz">
        <div style={{ gridArea: "nav" }}>
          <Specviz.Action.Provider onClick={jump}>
            <Specviz.Navigator src={app.spectrogram} />
          </Specviz.Action.Provider>
        </div>
        <div style={{ gridArea: "x", overflow: "hidden" }}>
          <Specviz.Action.Provider onWheel={zoomX}>
            <Specviz.Axis.Horizontal />
          </Specviz.Action.Provider>
        </div>
        <div style={{ gridArea: "y", overflow: "hidden" }}>
          <Specviz.Action.Provider onWheel={zoomY}>
            <Specviz.Axis.Vertical />
          </Specviz.Action.Provider>
        </div>
        <div style={{ gridArea: "viz" }}>
          <Specviz.Action.Provider onDrag={pan}>
            <Specviz.Visualization src={app.spectrogram} />
          </Specviz.Action.Provider>
        </div>
      </Specviz.Plane.Provider>
    </div>
  )
}
