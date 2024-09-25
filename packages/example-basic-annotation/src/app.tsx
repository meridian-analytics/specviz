import * as Format from "@specviz/format"
import * as Specviz from "@specviz/react"
import * as React from "react"
import * as RRT from "react-router-typesafe"

type Sample = {
  audio: string
  spectrogram: string
}

export const element = <AppProvider children={<App />} />

export const loader = RRT.makeLoader(async () => {
  const sample: Sample = {
    audio: "./audio.wav",
    spectrogram: "./spectrogram.png",
  }
  const audioBuffer = await Specviz.AudioContext.load(sample.audio)
  const regions: Specviz.RegionState = new Map([
    [
      "1c88a68879d21eb9e124",
      {
        id: "1c88a68879d21eb9e124",
        x: 5.910473607859945,
        y: 2375,
        width: 0.8597052520523558,
        height: 4050,
        xunit: "seconds",
        yunit: "hertz",
      },
    ],
    [
      "e0659b87ed3464710c0f",
      {
        id: "e0659b87ed3464710c0f",
        x: 12.60901036343455,
        y: 2425,
        width: 1.9701578692866484,
        height: 8050.000000000002,
        xunit: "seconds",
        yunit: "hertz",
      },
    ],
    [
      "72c2cc16ea8f8b902491",
      {
        id: "72c2cc16ea8f8b902491",
        x: 16.012010319475124,
        y: 1675,
        width: 1.6835894519358625,
        height: 12650,
        xunit: "seconds",
        yunit: "hertz",
      },
    ],
  ])
  return {
    audioBuffer,
    sample,
    regions,
  }
})

function AppProvider(props: { children: React.ReactNode }) {
  const loaderData = RRT.useLoaderData<typeof loader>()
  const axes: Specviz.Axes = React.useMemo(
    () => ({
      seconds: Specviz.AxisContext.linear(
        0,
        loaderData.audioBuffer.duration,
        "seconds",
        Format.timestamp,
      ),
      hertz: Specviz.AxisContext.linear(20000, 0, "hertz", Format.hz),
    }),
    [loaderData.audioBuffer.duration],
  )
  return (
    <Specviz.AudioProvider buffer={loaderData.audioBuffer}>
      <Specviz.AxisProvider value={axes}>
        <Specviz.InputProvider>
          <Specviz.RegionProvider
            children={props.children}
            initRegions={loaderData.regions}
          />
        </Specviz.InputProvider>
      </Specviz.AxisProvider>
    </Specviz.AudioProvider>
  )
}

function App() {
  return (
    <div
      style={{
        backgroundColor: "mintcream",
        display: "grid",
        gridGap: "1rem",
        gridTemplateRows: "60 auto",
        gridTemplateAreas: `
          "controls"
          "viz"
          "annotations"
        `,
        padding: "1rem",
      }}
    >
      <AudioControls />
      <Visualizer />
      <Annotations />
      <Specviz.AudioEffect />
    </div>
  )
}

function AudioControls() {
  const audio = Specviz.useAudio()
  return (
    <div style={{ gridArea: "controls" }}>
      <button
        children="Rewind"
        onClick={_ => audio.transport.seek(0)}
        type="button"
      />
      <button
        children="Play"
        style={audio.state.pause ? {} : { color: "orchid" }}
        onClick={_ => audio.transport.play()}
        title="Z"
        type="button"
      />
      <button
        children="Stop"
        style={audio.state.pause ? { color: "orchid" } : {}}
        onClick={_ => audio.transport.stop()}
        title="X"
        type="button"
      />
    </div>
  )
}

function Visualizer() {
  const loaderData = RRT.useLoaderData<typeof loader>()
  const region = Specviz.useRegion()
  const viewport = Specviz.useViewport()
  const annotate: Specviz.Action["onRect"] = React.useCallback(
    ({ unit, rel, abs, xaxis, yaxis, event }) => {
      if (region.selection.size == 0) region.annotate(unit, xaxis, yaxis)
    },
    [region.annotate, region.selection],
  )
  const select: Specviz.Action["onClick"] = React.useCallback(
    ({ unit, rel, abs, xaxis, yaxis, event }) => {
      region.selectPoint(abs, Specviz.RegionContext.selectionMode(event))
    },
    [region.selectPoint],
  )
  const move: Specviz.Action["onDrag"] = React.useCallback(
    ({ dx, dy, event }) => {
      if (region.selection.size > 0)
        region.moveSelection(
          dx / viewport.state.zoom.x,
          dy / viewport.state.zoom.y,
        )
    },
    [region.moveSelection, region.selection, viewport.state.zoom],
  )
  const remove: Specviz.Action["onContextMenu"] = React.useCallback(
    ({ unit, rel, abs, xaxis, yaxis, event }) => {
      region.delete()
    },
    [region.delete],
  )
  return (
    <div
      style={{
        backgroundColor: "cornsilk",
        border: "1px solid burlywood",
        display: "grid",
        gridArea: "viz",
        gridGap: "1rem",
        gridTemplateColumns: "80px 1fr",
        gridTemplateRows: "400px 20px",
        gridTemplateAreas: `
          "y spec"
          ". x"
        `,
        padding: "1rem",
      }}
    >
      <Specviz.PlaneProvider xaxis="seconds" yaxis="hertz">
        <div style={{ gridArea: "x", overflow: "hidden" }}>
          <Specviz.AxisContext.Horizontal />
        </div>
        <div style={{ gridArea: "y", overflow: "hidden" }}>
          <Specviz.AxisContext.Vertical />
        </div>
        <div style={{ gridArea: "spec" }}>
          <Specviz.ActionProvider
            onClick={select}
            onContextMenu={remove}
            onDrag={move}
            onRect={annotate}
          >
            <Specviz.Visualization
              showSelection={region.selection.size == 0}
              src={loaderData.sample.spectrogram}
            />
          </Specviz.ActionProvider>
        </div>
      </Specviz.PlaneProvider>
    </div>
  )
}

function Annotations() {
  const region = Specviz.useRegion()
  return (
    <pre
      style={{
        backgroundColor: "lavenderblush",
        border: "1px solid thistle",
        gridArea: "annotations",
        padding: "1rem",
      }}
    >
      {JSON.stringify(
        {
          regions: Array.from(region.regions),
          selection: Array.from(region.selection),
        },
        null,
        2,
      )}
    </pre>
  )
}
