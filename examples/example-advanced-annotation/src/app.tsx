import * as Specviz from "@meridian_cfi/specviz"
import * as Format from "@meridian_cfi/specviz/format"
import * as React from "react"

type UserData = {
  label?: Label
  comment?: string
}

enum Label {
  Whale = "🐋",
  Shark = "🦈",
  Pufferfish = "🐡",
  Fish = "🐠",
}

type Props = {
  audio: string
  spectrogram: string
  waveform: string
  annotation: string
}

type Context = {
  focus: null | Specviz.Note.Region["id"]
  spectrogram: string
  tool: Tool
  waveform: string
  setFocus: React.Dispatch<React.SetStateAction<Context["focus"]>>
  setTool: React.Dispatch<React.SetStateAction<Context["tool"]>>
}

enum Tool {
  Annotate = "annotate",
  Select = "select",
  Zoom = "zoom",
  Move = "move",
}

export default function (props: Props) {
  return (
    <AppProvider {...props}>
      <App />
    </AppProvider>
  )
}

const Context = React.createContext<null | Context>(null)

function useContext() {
  const context = React.useContext(Context)
  if (context == null) throw Error("useContext must be used within a Provider")
  return context
}

function AppProvider(props: Props & { children: React.ReactNode }) {
  const [focus, setFocus] = React.useState<Context["focus"]>(null)
  const [tool, setTool] = React.useState(Tool.Annotate)
  const [audioBuffer, setAudioBuffer] = React.useState<null | AudioBuffer>(null)
  const [regions, setRegions] =
    React.useState<null | Specviz.Note.RegionState<UserData>>(null)
  const axes: Specviz.Axis.Context = React.useMemo(
    () => ({
      seconds: Specviz.Axis.time(0, audioBuffer?.duration ?? 0),
      hertz: Specviz.Axis.frequency(20000, 0),
      percent: Specviz.Axis.percent(1, -1),
    }),
    [audioBuffer],
  )
  React.useEffect(() => {
    Specviz.Audio.load(props.audio).then(setAudioBuffer)
  }, [props.audio])
  React.useEffect(() => {
    fetch(props.annotation)
      .then(r => r.json())
      .then(entries => setRegions(new Map(entries)))
  }, [props.annotation])
  if (audioBuffer == null) return "Loading audio..."
  if (regions == null) return "Loading regions..."
  return (
    <Context.Provider
      value={{
        focus,
        spectrogram: props.spectrogram,
        tool,
        waveform: props.waveform,
        setFocus,
        setTool,
      }}
    >
      <Specviz.Audio.Provider buffer={audioBuffer}>
        <Specviz.Input.Provider>
          <Specviz.Axis.Provider value={axes}>
            <Specviz.Note.Provider initRegions={regions} render={AnnotationSvg}>
              <FxProvider>
                <BaseToolProvider>
                  <Specviz.Viewport.Provider children={props.children} />
                </BaseToolProvider>
              </FxProvider>
            </Specviz.Note.Provider>
          </Specviz.Axis.Provider>
        </Specviz.Input.Provider>
      </Specviz.Audio.Provider>
    </Context.Provider>
  )
}

function App() {
  return (
    <div id="app">
      <Controls />
      <AnnotationTool />
      <AnnotationTable />
      <Keybinds />
      <Specviz.Audio.Effect />
    </div>
  )
}

function AnnotationTool() {
  const app = useContext()
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
            <Specviz.Navigator src={app.spectrogram} />
          </NavigatorToolProvider>
        </div>
        <div className="spectrogram visualization">
          <VisualizationToolProvider>
            <Specviz.Visualization
              id="spec"
              showSelection={showSelection}
              src={app.spectrogram}
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
              <Specviz.Navigator src={app.waveform} />
            </NavigatorToolProvider>
          </div>
          <div className="waveform visualization">
            <VisualizationToolProvider>
              <Specviz.Visualization
                id="wav"
                showSelection={showSelection}
                src={app.waveform}
              />
            </VisualizationToolProvider>
          </div>
        </Specviz.Plane.Provider>
      </Specviz.Viewport.Transform>
    </div>
  )
}

function AnnotationTable() {
  const note = Specviz.Note.useContext<UserData>()
  return (
    <table className="annotation-table">
      <thead>
        <tr>
          <th>
            <Checkbox
              checked={note.selection.size == note.regions.size}
              indeterminate={
                note.selection.size > 0 &&
                note.selection.size != note.regions.size
              }
              onChange={event =>
                note.setSelection(
                  event.target.checked
                    ? new Set(note.regions.keys())
                    : new Set(),
                )
              }
            />
          </th>
          <th>Id</th>
          <th>Label</th>
          <th>Comment</th>
          <th>Offset</th>
          <th>Duration</th>
          <th>
            Freq
            <br />
            (min)
          </th>
          <th>
            Freq
            <br />
            (max)
          </th>
          <th>Listen</th>
        </tr>
      </thead>
      <tbody>
        {Array.from(note.regions.values(), region => (
          <AnnotationRow key={region.id} region={region} />
        ))}
      </tbody>
    </table>
  )
}

function AnnotationRow(props: { region: Specviz.Note.Region<UserData> }) {
  const app = useContext()
  const audio = Specviz.Audio.useContext()
  const note = Specviz.Note.useContext<UserData>()
  return (
    <tr>
      <td>
        <Checkbox
          checked={note.selection.has(props.region.id)}
          onChange={event =>
            note.setSelection(prev => {
              const next = new Set(prev)
              if (event.target.checked) next.add(props.region.id)
              else next.delete(props.region.id)
              return next
            })
          }
        />
      </td>
      <td>{props.region.id.slice(0, 8)}...</td>
      <td>
        <select
          value={props.region.properties?.label ?? "-"}
          onChange={event =>
            note.updateRegionProperties(props.region.id, p => ({
              ...p,
              label:
                event.target.value == "-"
                  ? undefined
                  : (event.target.value as Label),
            }))
          }
          style={{ fontSize: "1rem" }}
        >
          <option value="-" children="-" />
          {Object.values(Label).map(label => (
            <option key={label} value={label} children={label} />
          ))}
        </select>
      </td>
      <td>
        <input
          value={props.region.properties?.comment ?? ""}
          onChange={event =>
            note.updateRegionProperties(props.region.id, p => ({
              ...p,
              comment: event.target.value,
            }))
          }
          style={{ width: "90%" }}
        />
      </td>
      <td>
        <Specviz.Encoder.X region={props.region} label="s" />
      </td>
      <td>
        <Specviz.Encoder.X2 region={props.region} label="s" />
      </td>
      <td>
        <Specviz.Encoder.Y2
          direction={-1}
          format={v => (v / 1000).toFixed(3)}
          label="kHz"
          region={props.region}
        />
      </td>
      <td>
        <Specviz.Encoder.Y1
          direction={-1}
          format={v => (v / 1000).toFixed(3)}
          label="kHz"
          region={props.region}
        />
      </td>
      <td>
        {!audio.state.pause && app.focus && app.focus == props.region.id ? (
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
              app.setFocus(props.region.id)
              audio.transport.play()
            }}
            children="play"
          />
        )}
      </td>
    </tr>
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
  const app = useContext()
  const audio = Specviz.Audio.useContext()
  return (
    <div className="controls-audio">
      <button
        type="button"
        onClick={_ => audio.transport.seek(0)}
        children="Rewind"
      />
      <button
        type="button"
        onClick={_ => audio.transport.play()}
        className={!audio.state.pause ? "active" : ""}
        children="Play"
      />
      <button
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
  const app = useContext()
  return (
    <div className="controls-tool">
      {Object.entries(Tool).map(([children, tool]) => (
        <button
          key={tool}
          type="button"
          onClick={_ => app.setTool(tool)}
          className={app.tool == tool ? "active" : ""}
          children={children}
        />
      ))}
    </div>
  )
}

function Duration() {
  const audio = Specviz.Audio.useContext()
  return (
    <div className="audio-duration">
      <Specviz.Audio.Seek />
      <span>/</span>
      <span>{Format.timestamp(audio.buffer?.duration ?? 0)}</span>
    </div>
  )
}

function AnnotationSvg(props: Specviz.Note.AnnotationProps<UserData>) {
  const lines =
    props.viewerId == "spec" || props.viewerId == "wav"
      ? [
          props.region.properties?.label ?? "UNK",
          props.region.properties?.comment ?? "",
        ]
      : []
  return (
    <svg {...props.svgProps}>
      <rect />
      {lines.map((line, lineno) => (
        <text
          key={String(lineno)}
          x="4"
          y={String(4 + 24 * lineno)}
          children={line}
        />
      ))}
    </svg>
  )
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
  const app = useContext()
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
  const app = useContext()
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

function VisualizationToolProvider(props: {
  children: React.ReactNode
}) {
  const app = useContext()
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
      case Tool.Annotate:
        return {
          onClick: ({ unit, rel, abs, xaxis, yaxis, event }) => {
            note.selectPoint(abs, Specviz.Note.selectionMode(event))
          },
          onRect: ({ unit, rel, abs, xaxis, yaxis, event }) => {
            note.create(
              yaxis.unit === "hertz"
                ? {
                    ...unit,
                    id: Format.randomBytes(10),
                    xunit: xaxis.unit,
                    yunit: yaxis.unit,
                  }
                : {
                    ...unit,
                    y: 0,
                    height: 20000,
                    id: Format.randomBytes(10),
                    xunit: xaxis.unit,
                    yunit: "hertz",
                  },
            )
          },
          onWheel,
        }
      case Tool.Select:
        return {
          onClick: ({ unit, rel, abs, xaxis, yaxis, event }) => {
            note.selectPoint(abs, Specviz.Note.selectionMode(event))
          },
          onRect: ({ unit, rel, abs, xaxis, yaxis, event }) => {
            note.selectArea(abs, Specviz.Note.selectionMode(event))
          },
          onWheel,
        }
      case Tool.Zoom:
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
      case Tool.Move:
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
  const note = Specviz.Note.useContext()
  return (
    <Specviz.Bindings>
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
    </Specviz.Bindings>
  )
}

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  indeterminate?: boolean
}

function Checkbox({ indeterminate, ...props }: CheckboxProps) {
  const ref = React.useRef<null | HTMLInputElement>(null)
  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate ?? false
    }
  }, [indeterminate])
  return <input {...props} ref={ref} type="checkbox" />
}
