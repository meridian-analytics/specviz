import * as Specviz from "@meridian_cfi/specviz"
import * as React from "react"
import * as RRT from "react-router-typesafe"

type Sample = {
  audio: string
  spectrogram: string
  waveform: string
  duration: number
}

export const element = <AppProvider children={<App />} />

export const loader = RRT.makeLoader(async () => {
  const sample: Sample = {
    audio: "./audio.flac",
    spectrogram: "./spectrogram.png",
    waveform: "./waveform.png",
    duration: 44.346,
  }
  return { sample }
})

function AppProvider(props: { children: React.ReactNode }) {
  const loaderData = RRT.useLoaderData<typeof loader>()
  const axes: Specviz.Axis.Context = React.useMemo(
    () => ({
      seconds: Specviz.Axis.time(0, loaderData.sample.duration),
      hertz: Specviz.Axis.frequency(20000, 0),
    }),
    [loaderData.sample.duration],
  )
  return (
    <Specviz.Axis.Provider value={axes}>
      <Specviz.Input.Provider>
        <Specviz.Viewport.Provider children={props.children} />
      </Specviz.Input.Provider>
    </Specviz.Axis.Provider>
  )
}

function App() {
  const loaderData = RRT.useLoaderData<typeof loader>()
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
        marginTop: "1rem",
        padding: "1rem",
      }}
    >
      <Specviz.Plane.Provider xaxis="seconds" yaxis="hertz">
        <div style={{ gridArea: "nav" }}>
          <Specviz.Action.Provider onClick={jump}>
            <Specviz.Navigator src={loaderData.sample.spectrogram} />
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
            <Specviz.Visualization src={loaderData.sample.spectrogram} />
          </Specviz.Action.Provider>
        </div>
      </Specviz.Plane.Provider>
    </div>
  )
}
