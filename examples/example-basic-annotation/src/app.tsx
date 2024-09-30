import * as Specviz from "@meridian_cfi/specviz"
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
  const audioBuffer = await Specviz.Audio.load(sample.audio)
  const regions: Specviz.Note.RegionState = new Map([
    [
      "22a3b37a-178b-4f8f-9e01-8f2612be2b0f",
      {
        id: "22a3b37a-178b-4f8f-9e01-8f2612be2b0f",
        x: 5.910473607859945,
        y: 2375,
        width: 0.8597052520523558,
        height: 4050,
        xunit: "seconds",
        yunit: "hertz",
      },
    ],
    [
      "b56c65fd-c0fc-44c4-9540-90ca509f5bb3",
      {
        id: "b56c65fd-c0fc-44c4-9540-90ca509f5bb3",
        x: 12.60901036343455,
        y: 2425,
        width: 1.9701578692866484,
        height: 8050.000000000002,
        xunit: "seconds",
        yunit: "hertz",
      },
    ],
    [
      "85e5a2b2-ca8b-4e4d-9e19-458f3cbb1de4",
      {
        id: "85e5a2b2-ca8b-4e4d-9e19-458f3cbb1de4",
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
  const axes: Specviz.Axis.Context = React.useMemo(
    () => ({
      seconds: Specviz.Axis.time(0, loaderData.audioBuffer.duration),
      hertz: Specviz.Axis.frequency(20000, 0),
    }),
    [loaderData.audioBuffer.duration],
  )
  return (
    <Specviz.Audio.Provider buffer={loaderData.audioBuffer}>
      <Specviz.Axis.Provider value={axes}>
        <Specviz.Input.Provider>
          <Specviz.Note.Provider
            children={props.children}
            initRegions={loaderData.regions}
          />
        </Specviz.Input.Provider>
      </Specviz.Axis.Provider>
    </Specviz.Audio.Provider>
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
      <Specviz.Audio.Effect />
    </div>
  )
}

function AudioControls() {
  const audio = Specviz.Audio.useContext()
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
  const note = Specviz.Note.useContext()
  const viewport = Specviz.Viewport.useContext()
  const annotate: Specviz.Action.Handler["onRect"] = React.useCallback(
    ({ unit, rel, abs, xaxis, yaxis, event }) => {
      if (note.selection.size == 0)
        note.create({
          ...unit,
          id: crypto.randomUUID(),
          xunit: xaxis.unit,
          yunit: yaxis.unit,
        })
    },
    [note.create, note.selection],
  )
  const select: Specviz.Action.Handler["onClick"] = React.useCallback(
    ({ unit, rel, abs, xaxis, yaxis, event }) => {
      note.selectPoint(abs, Specviz.Note.selectionMode(event))
    },
    [note.selectPoint],
  )
  const move: Specviz.Action.Handler["onDrag"] = React.useCallback(
    ({ dx, dy, event }) => {
      if (note.selection.size > 0)
        note.moveSelection(
          dx / viewport.state.zoom.x,
          dy / viewport.state.zoom.y,
        )
    },
    [note.moveSelection, note.selection, viewport.state.zoom],
  )
  const remove: Specviz.Action.Handler["onContextMenu"] = React.useCallback(
    ({ unit, rel, abs, xaxis, yaxis, event }) => {
      note.deleteSelection()
    },
    [note.deleteSelection],
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
      <Specviz.Plane.Provider xaxis="seconds" yaxis="hertz">
        <div style={{ gridArea: "x", overflow: "hidden" }}>
          <Specviz.Axis.Horizontal />
        </div>
        <div style={{ gridArea: "y", overflow: "hidden" }}>
          <Specviz.Axis.Vertical />
        </div>
        <div style={{ gridArea: "spec" }}>
          <Specviz.Action.Provider
            onClick={select}
            onContextMenu={remove}
            onDrag={move}
            onRect={annotate}
          >
            <Specviz.Visualization
              showSelection={note.selection.size == 0}
              src={loaderData.sample.spectrogram}
            />
          </Specviz.Action.Provider>
        </div>
      </Specviz.Plane.Provider>
    </div>
  )
}

function Annotations() {
  const note = Specviz.Note.useContext()
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
          regions: Array.from(note.regions),
          selection: Array.from(note.selection),
        },
        null,
        2,
      )}
    </pre>
  )
}
