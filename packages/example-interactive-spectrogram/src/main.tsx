import * as Specviz from "@specviz/core"
import * as Format from "@specviz/format"
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
    audio: "./audio.wav",
    spectrogram: "./spectrogram.png",
    waveform: "./waveform.png",
    duration: 44.346,
  }
  return { sample }
})

function AppProvider(props: { children: React.ReactNode }) {
  const loaderData = RRT.useLoaderData<typeof loader>()
  const axes: Specviz.Axes = React.useMemo(
    () => ({
      seconds: Specviz.AxisContext.linear(
        0,
        loaderData.sample.duration,
        "seconds",
        Format.timestamp,
      ),
      hertz: Specviz.AxisContext.linear(20000, 0, "hertz", Format.hz),
    }),
    [loaderData.sample.duration],
  )
  return (
    <Specviz.AxisProvider value={axes}>
      <Specviz.InputProvider>
        <Specviz.ViewportProvider children={props.children} />
      </Specviz.InputProvider>
    </Specviz.AxisProvider>
  )
}

function App() {
  const loaderData = RRT.useLoaderData<typeof loader>()
  const viewport = Specviz.useViewport()
  const zoomX: Specviz.Action["onWheel"] = React.useCallback(
    ({ dx, dy, event }) => {
      if (event.altKey) {
        viewport.zoomScroll(dy, 0)
      } else {
        viewport.zoomScroll(-dy, 0)
      }
    },
    [viewport.zoomScroll],
  )
  const zoomY: Specviz.Action["onWheel"] = React.useCallback(
    ({ dx, dy, event }) => {
      if (event.altKey) {
        viewport.zoomScroll(0, dy)
      } else {
        viewport.zoomScroll(0, -dy)
      }
    },
    [viewport.zoomScroll],
  )
  const pan: Specviz.Action["onDrag"] = React.useCallback(
    ({ dx, dy, event }) => {
      viewport.scroll(-dx, -dy)
    },
    [viewport.scroll],
  )
  const jump: Specviz.Action["onClick"] = React.useCallback(
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
        padding: "1rem",
      }}
    >
      <Specviz.PlaneProvider xaxis="seconds" yaxis="hertz">
        <div style={{ gridArea: "nav" }}>
          <Specviz.ActionProvider onClick={jump}>
            <Specviz.Navigator src={loaderData.sample.spectrogram} />
          </Specviz.ActionProvider>
        </div>
        <div style={{ gridArea: "x", overflow: "hidden" }}>
          <Specviz.ActionProvider onWheel={zoomX}>
            <Specviz.AxisContext.Horizontal />
          </Specviz.ActionProvider>
        </div>
        <div style={{ gridArea: "y", overflow: "hidden" }}>
          <Specviz.ActionProvider onWheel={zoomY}>
            <Specviz.AxisContext.Vertical />
          </Specviz.ActionProvider>
        </div>
        <div style={{ gridArea: "viz" }}>
          <Specviz.ActionProvider onDrag={pan}>
            <Specviz.Visualization src={loaderData.sample.spectrogram} />
          </Specviz.ActionProvider>
        </div>
      </Specviz.PlaneProvider>
    </div>
  )
}
