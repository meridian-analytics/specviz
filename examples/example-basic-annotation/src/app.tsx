import * as Specviz from "@meridian_cfi/specviz"
import * as Format from "@meridian_cfi/specviz/format"
import * as React from "react"
import * as RRT from "react-router-typesafe"

type Sample = {
  audio: string
  spectrogram: string
}

type UserData = {
  label?: Label
}

enum Label {
  Whale = "🐋",
  Shark = "🦈",
  Pufferfish = "🐡",
  Fish = "🐠",
}

export const element = <AppProvider children={<App />} />

export const loader = RRT.makeLoader(async () => {
  const sample: Sample = {
    audio: "./audio.flac",
    spectrogram: "./spectrogram.png",
  }
  const audioBuffer = await Specviz.Audio.load(sample.audio)
  const regions: Specviz.Note.RegionState<UserData> = new Map(
    await fetch("./example-basic-annotation.json").then(r => r.json()),
  )
  return {
    audioBuffer,
    sample,
    regions,
  }
})

type Context = {
  label: Label
  setLabel: (label: Label) => void
}

const defaultContext: Context = {
  label: Label.Whale,
  setLabel: () => {
    throw Error("setLabel not implemented")
  },
}

const Context = React.createContext(defaultContext)

function AppProvider(props: { children: React.ReactNode }) {
  const loaderData = RRT.useLoaderData<typeof loader>()
  const [label, setLabel] = React.useState(defaultContext.label)
  const axes: Specviz.Axis.Context = React.useMemo(
    () => ({
      seconds: Specviz.Axis.time(0, loaderData.audioBuffer.duration),
      hertz: Specviz.Axis.frequency(20000, 0),
    }),
    [loaderData.audioBuffer.duration],
  )
  return (
    <Context.Provider value={{ label, setLabel }}>
      <Specviz.Bindings>
        <Specviz.Audio.Provider buffer={loaderData.audioBuffer}>
          <Specviz.Axis.Provider value={axes}>
            <Specviz.Input.Provider>
              <Specviz.Note.Provider
                children={props.children}
                initRegions={loaderData.regions}
                render={AnnotationSvg}
              />
            </Specviz.Input.Provider>
          </Specviz.Axis.Provider>
        </Specviz.Audio.Provider>
      </Specviz.Bindings>
    </Context.Provider>
  )
}

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      <Visualizer />
      <Controls />
      <AnnotationTable />
      <Specviz.Audio.Effect />
    </div>
  )
}

function Visualizer() {
  const loaderData = RRT.useLoaderData<typeof loader>()
  const app = React.useContext(Context)
  const audio = Specviz.Audio.useContext()
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
          properties: { label: app.label },
        })
    },
    [app.label, note.create, note.selection],
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
  const seek: Specviz.Action.Handler["onContextMenu"] = React.useCallback(
    ({ unit, rel, abs, xaxis, yaxis, event }) => {
      audio.transport.seek(unit.x)
    },
    [audio.transport.seek],
  )
  return (
    <div
      style={{
        backgroundColor: "cornsilk",
        border: "1px solid burlywood",
        display: "grid",
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
            onContextMenu={seek}
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

function Controls() {
  const app = React.useContext(Context)
  const audio = Specviz.Audio.useContext()
  const note = Specviz.Note.useContext()
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
      }}
    >
      <Button
        children="<<"
        onClick={() => audio.transport.seek(t => t - 5)}
        title="z"
      />
      {audio.state.pause ? (
        <Button
          children="Play"
          onClick={() => audio.transport.play()}
          title="x"
        />
      ) : (
        <Button
          children="Stop"
          onClick={() => audio.transport.stop()}
          title="x"
        />
      )}
      <Button
        children=">>"
        onClick={() => audio.transport.seek(t => t + 5)}
        title="c"
      />
      <div style={{ flexGrow: 1 }} />
      <Button
        children="Clear Selection"
        disabled={note.selection.size == 0}
        onClick={() => note.setSelection(new Set())}
        title="Escape"
      />
      <Button
        children="Delete"
        disabled={note.selection.size == 0}
        onClick={() => note.deleteSelection()}
        title="Backspace"
      />
      <div style={{ flexGrow: 1 }} />
      {Object.values(Label).map((label, n) => (
        <Button
          key={label}
          children={label}
          onClick={() => app.setLabel(label)}
          style={{
            fontSize: "1.5rem",
            borderColor: app.label == label ? "orchid" : undefined,
          }}
          title={String(n + 1)}
        />
      ))}
    </div>
  )
}

function AnnotationSvg(props: Specviz.Note.AnnotationProps<UserData>) {
  return (
    <svg {...props.svgProps} cursor="pointer">
      <rect
        width="100%"
        height="100%"
        fill={props.selected ? "chartreuse" : "violet"}
        fillOpacity="0.7"
        style={{ mixBlendMode: "hue" }}
      />
      <text
        x="8"
        y="8"
        children={props.region.properties?.label ?? "🤷🏽"}
        fontSize="30"
      />
    </svg>
  )
}

function AnnotationTable() {
  const note = Specviz.Note.useContext<UserData>()
  return (
    <table
      style={{
        backgroundColor: "lavenderblush",
        border: "1px solid thistle",
        maxHeight: "400px",
        overflow: "auto",
        padding: "1rem",
      }}
    >
      <thead>
        <tr style={{ textAlign: "left" }}>
          <th />
          <th>Id</th>
          <th>Label</th>
          <th>Hz (min)</th>
          <th>Hz (max)</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        {Array.from(note.regions.values(), region => (
          <tr key={region.id}>
            <td>
              <input
                type="checkbox"
                checked={note.selection.has(region.id)}
                onChange={event =>
                  note.setSelection(prev => {
                    const next = new Set(prev)
                    if (event.target.checked) next.add(region.id)
                    else next.delete(region.id)
                    return next
                  })
                }
              />
            </td>
            <td>{region.id}</td>
            <td>
              <select
                value={region.properties?.label ?? "🤷🏽"}
                onChange={event =>
                  note.updateRegionProperties(region.id, p => ({
                    ...p,
                    label: event.target.value as Label,
                  }))
                }
                style={{ fontSize: "1rem" }}
              >
                <option value="🤷🏽" children="🤷🏽" />
                {Object.values(Label).map(label => (
                  <option key={label} value={label} children={label} />
                ))}
              </select>
            </td>
            <td>{Format.hz(region.y)}</td>
            <td>{Format.hz(region.y + region.height)}</td>
            <td>{Format.timestamp(region.width)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Button(
  props: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
    onClick: () => void
  },
) {
  return (
    <>
      <button {...props} title={props.title?.toUpperCase()} type="button" />
      {props.title && props.onClick && (
        <Specviz.Keypress bind={props.title} onKeyDown={props.onClick} />
      )}
    </>
  )
}
