import * as Specviz from "@meridian_cfi/specviz"
import * as Format from "@meridian_cfi/specviz/format"
import * as React from "react"
import * as RRT from "react-router-typesafe"

export const element = <AppProvider children={<App />} />

export const loader = RRT.makeLoader(async () => {
  const sample: Sample = {
    audio: "./audio.wav",
    spectrogram: "./spectrogram.png",
    waveform: "./waveform.png",
    offset: 0,
  }
  const audioBuffer = await Specviz.Audio.load(sample.audio)
  return {
    sample,
    audioBuffer,
  }
})

type Sample = {
  audio: string
  spectrogram: string
  waveform: string
  offset: number
}

const initRegions: Specviz.Note.RegionState = new Map([
  [
    "df10e63bc928a9850b6f",
    {
      id: "df10e63bc928a9850b6f",
      x: 5.096308207705192,
      y: 10743.75,
      width: 2.5295544388609716,
      height: 6200,
      xunit: "seconds",
      yunit: "hertz",
      additional: "sample one",
      someField: 1,
    },
  ],

  [
    "b77d59d5089b139b2f49",
    {
      id: "b77d59d5089b139b2f49",
      x: 11.233969507191292,
      y: 4943.75,
      width: 6.138781151470651,
      height: 9200,
      xunit: "seconds",
      yunit: "hertz",
      additional: "sample two",
      someField: 2,
    },
  ],

  [
    "81f3bab0f30023a82aa4",
    {
      id: "81f3bab0f30023a82aa4",
      x: 20.81046810348551,
      y: 9543.75,
      width: 4.849637109661813,
      height: 6100,
      xunit: "seconds",
      yunit: "hertz",
      additional: "sample three",
      someField: 3,
    },
  ],
])

type AppContext = {
  focus: null | string
  tool: "annotate" | "select" | "zoom" | "move"
  setFocus: (regionId: null | string) => void
  setTool: (t: AppContext["tool"]) => void
}

const defaultContext: AppContext = {
  focus: null,
  tool: "annotate",
  setFocus() {
    throw Error("setFocus called outside of context")
  },
  setTool() {
    throw Error("setTool called outside of context")
  },
}

const Context = React.createContext(defaultContext)

export function AppProvider(props: { children: React.ReactNode }) {
  const loaderData = RRT.useLoaderData<typeof loader>()
  const [focus, _setFocus] = React.useState<AppContext["focus"]>(null)
  const [tool, setTool] = React.useState<AppContext["tool"]>("annotate")
  const context: AppContext = React.useMemo(
    () => ({
      focus,
      tool,
      setFocus: (regionId: null | string) => {
        _setFocus(prev => (prev == regionId ? null : regionId))
      },
      setTool,
    }),
    [focus, tool],
  )
  return (
    <Context.Provider value={context}>
      <Specviz.Audio.Provider buffer={loaderData.audioBuffer}>
        <Specviz.Input.Provider>
          <AxisProvider>
            <Specviz.Note.Provider
              initRegions={initRegions}
              initSelection={() => new Set(initRegions.keys())}
            >
              <FxProvider>
                <BaseToolProvider>
                  <Specviz.Viewport.Provider children={props.children} />
                </BaseToolProvider>
              </FxProvider>
            </Specviz.Note.Provider>
          </AxisProvider>
        </Specviz.Input.Provider>
      </Specviz.Audio.Provider>
    </Context.Provider>
  )
}

export default function App() {
  return (
    <div id="app">
      <link rel="stylesheet" href="./demo-full.css" />
      <AnnotationTool />
      <Annotations />
      <Controls />
      <Keybinds />
      <Specviz.Audio.Effect />
    </div>
  )
}

export function AnnotationTool() {
  const loaderData = RRT.useLoaderData<typeof loader>()
  const app = React.useContext(Context)
  const showSelection = app.tool != "move"
  return (
    <div className={`annotation-tool tool-${app.tool}`}>
      <Specviz.Plane.Provider xaxis="seconds" yaxis="hertz">
        <div className="axis-x">
          <HorizontalAxisToolProvider>
            <Specviz.Axis.Horizontal />
          </HorizontalAxisToolProvider>
        </div>
        <div className="spectrogram axis-y">
          <VerticalAxisToolProvider>
            <Specviz.Axis.Vertical />
          </VerticalAxisToolProvider>
        </div>
        <div className="spectrogram navigator">
          <NavigatorToolProvider>
            <Specviz.Navigator src={loaderData.sample.spectrogram} />
          </NavigatorToolProvider>
        </div>
        <div className="spectrogram visualization">
          <VisualizationToolProvider>
            <Specviz.Visualization
              children={AnnotationSvg}
              showSelection={showSelection}
              src={loaderData.sample.spectrogram}
            />
          </VisualizationToolProvider>
        </div>
      </Specviz.Plane.Provider>
      <Specviz.Viewport.Transform
        fn={state => ({
          scroll: { x: state.scroll.x, y: 0 },
          zoom: { x: state.zoom.x, y: 1 },
        })}
      >
        <Specviz.Plane.Provider xaxis="seconds" yaxis="percent">
          <div className="waveform axis-y">
            <VerticalAxisToolProvider>
              <Specviz.Axis.Vertical />
            </VerticalAxisToolProvider>
          </div>
          <div className="waveform navigator">
            <NavigatorToolProvider>
              <Specviz.Navigator src={loaderData.sample.waveform} />
            </NavigatorToolProvider>
          </div>
          <div className="waveform visualization">
            <VisualizationToolProvider>
              <Specviz.Visualization
                children={AnnotationSvg}
                showSelection={showSelection}
                src={loaderData.sample.waveform}
              />
            </VisualizationToolProvider>
          </div>
        </Specviz.Plane.Provider>
      </Specviz.Viewport.Transform>
    </div>
  )
}

function Annotations() {
  const note = Specviz.Note.useContext()
  return (
    <div className="annotations">
      {Array.from(note.selection).map(id => {
        const r = note.regions.get(id)
        if (r == null) return <AnnotationFormStaleSelection id={id} />
        return <AnnotationForm key={id} {...r} />
      })}
    </div>
  )
}

function AnnotationFormStaleSelection(props: { id: string }) {
  return (
    <div className="annotation-form">
      <div className="title">
        {props.id} is selected but not found in the region context
      </div>
    </div>
  )
}

function AnnotationForm(region: Specviz.Note.Region) {
  const app = React.useContext(Context)
  const audio = Specviz.Audio.useContext()
  return (
    <div className="annotation-form">
      <div className="title">
        <h3>{region.id}</h3>
        {!audio.state.pause && app.focus && app.focus == region.id ? (
          <button
            type="button"
            onClick={() => {
              audio.transport.stop()
              app.setFocus(null)
            }}
            children="stop"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              app.setFocus(region.id)
              audio.transport.play()
            }}
            children="play"
          />
        )}
      </div>
      <div className="encoders">
        <div>
          <Specviz.Encoder.X {...region} />
          Offset
        </div>
        <div>
          <Specviz.Encoder.X2 {...region} />
          Duration
        </div>
        <div>
          <Specviz.Encoder.Y1 {...region} />
          LPF
        </div>
        <div>
          <Specviz.Encoder.Y2 {...region} />
          HPF
        </div>
      </div>
      <pre>{JSON.stringify(region, null, 2)}</pre>
    </div>
  )
}

function Controls() {
  return (
    <div className="controls">
      <AudioControls />
      <Duration />
      <ToolControls />
    </div>
  )
}

function AudioControls() {
  const app = React.useContext(Context)
  const audio = Specviz.Audio.useContext()
  return (
    <div className="audio-controls">
      <button
        type="button"
        onClick={_ => audio.transport.seek(0)}
        children="Rewind"
      />
      <button
        title="Z"
        type="button"
        onClick={_ => audio.transport.play()}
        className={!audio.state.pause ? "active" : ""}
        children="Play"
      />
      <button
        title="X"
        type="button"
        onClick={_ => {
          audio.transport.stop()
          app.setFocus(null)
        }}
        className={audio.state.pause ? "active" : ""}
        children="Stop"
      />
    </div>
  )
}

function ToolControls() {
  const app = React.useContext(Context)
  return (
    <div className="tool-controls">
      <button
        title="A"
        type="button"
        onClick={_ => app.setTool("annotate")}
        className={app.tool === "annotate" ? "active" : ""}
        children="Annotate"
      />
      <button
        title="S"
        type="button"
        onClick={_ => app.setTool("select")}
        className={app.tool === "select" ? "active" : ""}
        children="Select"
      />
      <button
        title="D"
        type="button"
        onClick={_ => app.setTool("zoom")}
        className={app.tool === "zoom" ? "active" : ""}
        children="Zoom"
      />
      <button
        title="F"
        type="button"
        onClick={_ => app.setTool("move")}
        className={app.tool === "move" ? "active" : ""}
        children="Move"
      />
    </div>
  )
}

function Duration() {
  const audio = Specviz.Audio.useContext()
  return (
    <div className="audio-duration">
      <Specviz.Audio.Seek />
      <span>/</span>
      <span>{Format.timestamp(audio.buffer.duration)}</span>
    </div>
  )
}

function AnnotationSvg(props: Specviz.Note.AnnotationProps) {
  const lines = props.selected
    ? [
        props.region.id,
        `${Format.timestamp(props.region.x)} - ${Format.timestamp(
          props.region.x + props.region.width,
        )}`,
        props.region.yunit == "hertz"
          ? `${Format.hz(props.region.y)} - ${Format.hz(
              props.region.y + props.region.height,
            )}`
          : "",
      ]
    : [`${props.region.id.substring(0, 4)}...`]
  return (
    <React.Fragment>
      {lines.map((line, lineno) => (
        <text
          key={String(lineno)}
          x="4"
          y={String(4 + 24 * lineno)}
          children={line}
        />
      ))}
    </React.Fragment>
  )
}

function AxisProvider(props: { children: React.ReactNode }) {
  const loaderData = RRT.useLoaderData<typeof loader>()
  const audio = Specviz.Audio.useContext()
  const axes: Specviz.Axis.Context = React.useMemo(
    () => ({
      seconds: Specviz.Axis.time(
        loaderData.sample.offset + 0,
        loaderData.sample.offset + audio.buffer.duration,
      ),
      hertz: Specviz.Axis.frequency(20000, 0),
      percent: Specviz.Axis.percent(1, -1),
    }),
    [audio.buffer.duration, loaderData.sample.offset],
  )
  return <Specviz.Axis.Provider value={axes} children={props.children} />
}

function BaseToolProvider(props: { children: React.ReactNode }) {
  const audio = Specviz.Audio.useContext()
  const onContextMenu: Specviz.Action.Handler["onContextMenu"] =
    React.useCallback(
      ({ unit, rel, abs, xaxis, yaxis, event }) => {
        // todo: bug if zoomed, when clicking in navigator, gives relative time
        audio.transport.seek(unit.x)
      },
      [audio.transport.seek],
    )
  return (
    <Specviz.Action.Provider
      children={props.children}
      onContextMenu={onContextMenu}
    />
  )
}

function FxProvider(props: {
  children: React.ReactNode
}) {
  const app = React.useContext(Context)
  const note = Specviz.Note.useContext()
  const fn: Specviz.Audio.TransformFxProps["fn"] = React.useCallback(
    fxContext => {
      const target = app.focus ? (note.regions.get(app.focus) ?? null) : null
      return target == null
        ? fxContext
        : {
            hpf: target.yunit === "hertz" ? target.y : undefined,
            lpf:
              target.yunit === "hertz" ? target.y + target.height : undefined,
            loop: [target.x, target.x + target.width],
          }
    },
    [app.focus, note.regions],
  )
  return <Specviz.Audio.TransformFx children={props.children} fn={fn} />
}

function NavigatorToolProvider(props: { children: React.ReactNode }) {
  const app = React.useContext(Context)
  const viewport = Specviz.Viewport.useContext()
  const onClick: Specviz.Action.Handler["onClick"] = React.useCallback(
    ({ unit, rel, abs, xaxis, yaxis, event }) => {
      switch (app.tool) {
        case "annotate":
        case "select":
        case "move":
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
    [
      app.tool,
      viewport.resetView,
      viewport.scrollTo,
      viewport.state.zoom.x,
      viewport.state.zoom.y,
    ],
  )
  const onDrag: Specviz.Action.Handler["onDrag"] = React.useCallback(
    ({ dx, dy, event }) => {
      viewport.scroll(dx * viewport.state.zoom.x, dy * viewport.state.zoom.y)
    },
    [viewport.scroll, viewport.state.zoom.x, viewport.state.zoom.y],
  )
  const onWheel: Specviz.Action.Handler["onWheel"] = React.useCallback(
    ({ dx, dy, event }) => {
      if (event.altKey) {
        viewport.zoomScroll(dx, dy)
      } else {
        viewport.scroll(-dx, -dy)
      }
    },
    [viewport.zoomScroll, viewport.scroll],
  )
  return (
    <Specviz.Action.Provider
      children={props.children}
      onClick={onClick}
      onDrag={onDrag}
      onWheel={onWheel}
    />
  )
}

function VisualizationToolProvider(props: { children: React.ReactNode }) {
  const app = React.useContext(Context)
  const note = Specviz.Note.useContext()
  const viewport = Specviz.Viewport.useContext()
  const onWheel: Specviz.Action.Handler["onWheel"] = React.useCallback(
    ({ dx, dy, event }) => {
      if (event.altKey) {
        viewport.zoomScroll(-dx, -dy)
      } else {
        viewport.scroll(dx, dy)
      }
    },
    [viewport.zoomScroll, viewport.scroll],
  )
  const action: Specviz.Action.Context = React.useMemo(() => {
    switch (app.tool) {
      case "annotate":
        return {
          onClick: ({ unit, rel, abs, xaxis, yaxis, event }) => {
            note.selectPoint(abs, Specviz.Note.selectionMode(event))
          },
          onRect: ({ unit, rel, abs, xaxis, yaxis, event }) => {
            note.create({
              ...unit,
              id: Format.randomBytes(10),
              xunit: xaxis.unit,
              yunit: yaxis.unit,
            })
          },
          onWheel,
        }
      case "select":
        return {
          onClick: ({ unit, rel, abs, xaxis, yaxis, event }) => {
            note.selectPoint(abs, Specviz.Note.selectionMode(event))
          },
          onRect: ({ unit, rel, abs, xaxis, yaxis, event }) => {
            note.selectArea(abs, Specviz.Note.selectionMode(event))
          },
          onWheel,
        }
      case "zoom":
        return {
          onClick: ({ unit, rel, abs, xaxis, yaxis, event }) => {
            viewport.zoomPoint(
              abs,
              event.ctrlKey || event.metaKey
                ? Specviz.Viewport.ZoomDirection.out
                : Specviz.Viewport.ZoomDirection.in,
            )
          },
          onRect: ({ unit, rel, abs, xaxis, yaxis, event }) => {
            viewport.zoomArea(abs)
          },
          onWheel,
        }
      case "move":
        return {
          onDrag: ({ dx, dy, event }) => {
            if (note.selection.size == 0) {
              viewport.scroll(-dx, -dy)
            } else {
              note.moveSelection(
                dx / viewport.state.zoom.x,
                dy / viewport.state.zoom.y,
              )
            }
          },
          onWheel,
        }
    }
  }, [
    onWheel,
    app.tool,
    note.create,
    note.moveSelection,
    note.selectArea,
    note.selectPoint,
    note.selection,
    viewport.scroll,
    viewport.state.zoom.x,
    viewport.state.zoom.y,
    viewport.zoomArea,
    viewport.zoomPoint,
  ])
  return <Specviz.Action.Provider children={props.children} {...action} />
}

function HorizontalAxisToolProvider(props: { children: React.ReactNode }) {
  const viewport = Specviz.Viewport.useContext()
  const onWheel: Specviz.Action.Handler["onWheel"] = React.useCallback(
    ({ dx, dy, event }) => {
      if (event.altKey) {
        viewport.zoomScroll(dy, 0)
      } else {
        viewport.zoomScroll(-dy, 0)
      }
    },
    [viewport.zoomScroll],
  )
  return <Specviz.Action.Provider children={props.children} onWheel={onWheel} />
}

function VerticalAxisToolProvider(props: { children: React.ReactNode }) {
  const viewport = Specviz.Viewport.useContext()
  const onWheel: Specviz.Action.Handler["onWheel"] = React.useCallback(
    ({ dx, dy, event }) => {
      if (event.altKey) {
        viewport.zoomScroll(0, dy)
      } else {
        viewport.zoomScroll(0, -dy)
      }
    },
    [viewport.zoomScroll],
  )
  return <Specviz.Action.Provider children={props.children} onWheel={onWheel} />
}

function Keybinds() {
  const app = React.useContext(Context)
  const audio = Specviz.Audio.useContext()
  const note = Specviz.Note.useContext()
  return (
    <Specviz.Bindings>
      <Specviz.Keypress bind="Backspace" onKeyDown={note.deleteSelection} />
      <Specviz.Keypress bind="Escape" onKeyDown={note.deselect} />
      <Specviz.Keypress
        bind="ArrowLeft"
        onKeyDown={e => {
          e.preventDefault()
          note.moveSelection(-0.01, 0)
        }}
      />
      <Specviz.Keypress
        bind="ArrowRight"
        onKeyDown={e => {
          e.preventDefault()
          note.moveSelection(0.01, 0)
        }}
      />
      <Specviz.Keypress
        bind="ArrowUp"
        onKeyDown={e => {
          e.preventDefault()
          note.moveSelection(0, -0.03)
        }}
      />
      <Specviz.Keypress
        bind="ArrowDown"
        onKeyDown={e => {
          e.preventDefault()
          note.moveSelection(0, 0.03)
        }}
      />
      <Specviz.Keypress bind="a" onKeyDown={() => app.setTool("annotate")} />
      <Specviz.Keypress bind="s" onKeyDown={() => app.setTool("select")} />
      <Specviz.Keypress bind="d" onKeyDown={() => app.setTool("zoom")} />
      <Specviz.Keypress bind="f" onKeyDown={() => app.setTool("move")} />
      <Specviz.Keypress bind="z" onKeyDown={() => audio.transport.play()} />
      <Specviz.Keypress
        bind="x"
        onKeyDown={() => {
          audio.transport.stop()
          app.setFocus(null)
        }}
      />
    </Specviz.Bindings>
  )
}
