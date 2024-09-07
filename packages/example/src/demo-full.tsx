import * as Specviz from "@specviz/core"
import * as Format from "@specviz/format"
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
  const audioBuffer = await Specviz.AudioContext.load(sample.audio)
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

const initRegions: Specviz.RegionState = new Map([
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
  setFocus: (regionId: null | string) => void
}

const defaultContext: AppContext = {
  focus: null,
  setFocus() {
    throw Error("setFocus called outside of context")
  },
}

const Context = React.createContext(defaultContext)

export function AppProvider(props: { children: React.ReactNode }) {
  const loaderData = RRT.useLoaderData<typeof loader>()
  const [focus, _setFocus] = React.useState<null | string>(null)
  const context: AppContext = React.useMemo(
    () => ({
      focus,
      setFocus: (regionId: null | string) => {
        _setFocus(prev => (prev == regionId ? null : regionId))
      },
    }),
    [focus],
  )
  return (
    <Context.Provider value={context}>
      <Specviz.AudioProvider buffer={loaderData.audioBuffer}>
        <Specviz.InputProvider>
          <AxisProvider>
            <Specviz.RegionProvider
              initRegions={initRegions}
              initSelection={() => new Set(initRegions.keys())}
            >
              <FxProvider>
                <BaseToolProvider>
                  <Specviz.ViewportProvider children={props.children} />
                </BaseToolProvider>
              </FxProvider>
            </Specviz.RegionProvider>
          </AxisProvider>
        </Specviz.InputProvider>
      </Specviz.AudioProvider>
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
      <Specviz.AudioEffect />
    </div>
  )
}

export function AnnotationTool() {
  const loaderData = RRT.useLoaderData<typeof loader>()
  const tool = Specviz.useTool()
  return (
    <div className={`annotation-tool tool-${tool.tool}`}>
      <Specviz.PlaneProvider xaxis="seconds" yaxis="hertz">
        <div className="axis-x">
          <HorizontalAxisToolProvider>
            <Specviz.AxisContext.Horizontal />
          </HorizontalAxisToolProvider>
        </div>
        <div className="spectrogram axis-y">
          <VerticalAxisToolProvider>
            <Specviz.AxisContext.Vertical />
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
              src={loaderData.sample.spectrogram}
            />
          </VisualizationToolProvider>
        </div>
      </Specviz.PlaneProvider>
      <Specviz.ViewportContext.Transform
        fn={state => ({
          scroll: { x: state.scroll.x, y: 0 },
          zoom: { x: state.zoom.x, y: 1 },
        })}
      >
        <Specviz.PlaneProvider xaxis="seconds" yaxis="percent">
          <div className="waveform axis-y">
            <VerticalAxisToolProvider>
              <Specviz.AxisContext.Vertical />
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
                src={loaderData.sample.waveform}
              />
            </VisualizationToolProvider>
          </div>
        </Specviz.PlaneProvider>
      </Specviz.ViewportContext.Transform>
    </div>
  )
}

function Annotations() {
  const region = Specviz.useRegion()
  return (
    <div className="annotations">
      {Array.from(region.selection).map(id => {
        const r = region.regions.get(id)
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

function AnnotationForm(region: Specviz.Region) {
  const app = React.useContext(Context)
  const audio = Specviz.useAudio()
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
  const audio = Specviz.useAudio()
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
  const tool = Specviz.useTool()
  return (
    <div className="tool-controls">
      <button
        title="A"
        type="button"
        onClick={_ => tool.setTool("annotate")}
        className={tool.tool === "annotate" ? "active" : ""}
        children="Annotate"
      />
      <button
        title="S"
        type="button"
        onClick={_ => tool.setTool("select")}
        className={tool.tool === "select" ? "active" : ""}
        children="Select"
      />
      <button
        title="D"
        type="button"
        onClick={_ => tool.setTool("zoom")}
        className={tool.tool === "zoom" ? "active" : ""}
        children="Zoom"
      />
      <button
        title="F"
        type="button"
        onClick={_ => tool.setTool("pan")}
        className={tool.tool === "pan" ? "active" : ""}
        children="Pan"
      />
    </div>
  )
}

function Duration() {
  const audio = Specviz.useAudio()
  const ref = React.useRef<null | HTMLElement>(null)
  Specviz.useAnimationFrame(
    React.useCallback(() => {
      if (ref.current) {
        ref.current.textContent = Format.timestamp(
          audio.transport.getSeek(audio.state),
        )
      }
    }, [audio.transport.getSeek, audio.state]),
  )
  return (
    <div className="audio-duration">
      <span ref={ref}>{Format.timestamp(0)}</span>
      <span>/</span>
      <span>{Format.timestamp(audio.buffer.duration)}</span>
    </div>
  )
}

function AnnotationSvg(props: Specviz.AnnotationProps) {
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
  const audio = Specviz.useAudio()
  const axes: Specviz.Axes = React.useMemo(
    () => ({
      seconds: Specviz.AxisContext.linear(
        loaderData.sample.offset + 0,
        loaderData.sample.offset + audio.buffer.duration,
        "seconds",
        Format.timestamp,
      ),
      hertz: Specviz.AxisContext.linear(20000, 0, "hertz", Format.hz),
      percent: Specviz.AxisContext.nonlinear(
        [
          [0, 1],
          [0.5, 0],
          [1, -1],
        ],
        "percent",
        Format.percent,
      ),
    }),
    [audio.buffer.duration, loaderData.sample.offset],
  )
  return <Specviz.AxisProvider value={axes} children={props.children} />
}

function BaseToolProvider(props: { children: React.ReactNode }) {
  const audio = Specviz.useAudio()
  const actions: Specviz.ToolContext.Actions = React.useMemo(
    () => ({
      onContextMenu: ({ unit, rel, abs, xaxis, yaxis, event }) => {
        // todo: bug if zoomed, when clicking in navigator, gives relative time
        audio.transport.seek(unit.x)
      },
    }),
    [audio.transport.seek],
  )
  return <Specviz.ToolProvider actions={actions} children={props.children} />
}

function FxProvider(props: {
  children: React.ReactNode
}) {
  const app = React.useContext(Context)
  const region = Specviz.useRegion()
  const fn: Specviz.AudioContext.TransformFxProps["fn"] = React.useCallback(
    fxContext => {
      const target = app.focus ? region.regions.get(app.focus) ?? null : null
      return target == null
        ? fxContext
        : {
            hpf: target.yunit === "hertz" ? target.y : undefined,
            lpf:
              target.yunit === "hertz" ? target.y + target.height : undefined,
            loop: [target.x, target.x + target.width],
          }
    },
    [app.focus, region.regions],
  )
  return <Specviz.AudioContext.TransformFx children={props.children} fn={fn} />
}

function NavigatorToolProvider(props: { children: React.ReactNode }) {
  const viewport = Specviz.useViewport()
  const fn: Specviz.ToolContext.TransformProps["fn"] = React.useCallback(
    tool => ({
      onClick: ({ unit, rel, abs, xaxis, yaxis, event }) => {
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
      onMove: ({ dx, dy, event }) => {
        viewport.scroll(dx * viewport.state.zoom.x, dy * viewport.state.zoom.y)
      },
      onWheel: ({ dx, dy, event }) => {
        if (event.altKey) {
          viewport.zoomScroll(dx, dy)
        } else {
          viewport.scroll(-dx, -dy)
        }
      },
    }),
    [
      viewport.resetView,
      viewport.scroll,
      viewport.scrollTo,
      viewport.state.zoom.x,
      viewport.state.zoom.y,
      viewport.zoomScroll,
    ],
  )
  return <Specviz.ToolContext.Transform children={props.children} fn={fn} />
}

function VisualizationToolProvider(props: { children: React.ReactNode }) {
  const region = Specviz.useRegion()
  const viewport = Specviz.useViewport()
  const onWheel: Specviz.UseMouseWheelHandler = React.useCallback(
    ({ dx, dy, event }) => {
      if (event.altKey) {
        viewport.zoomScroll(-dx, -dy)
      } else {
        viewport.scroll(dx, dy)
      }
    },
    [viewport.zoomScroll, viewport.scroll],
  )
  const fn: Specviz.ToolContext.TransformProps["fn"] = React.useCallback(
    tool => {
      switch (tool) {
        case "annotate":
          return {
            onClick: ({ unit, rel, abs, xaxis, yaxis, event }) => {
              region.selectPoint(
                abs,
                Specviz.RegionContext.selectionMode(event),
              )
            },
            onRect: ({ unit, rel, abs, xaxis, yaxis, event }) => {
              region.annotate(unit, xaxis, yaxis)
            },
            onWheel,
          }
        case "select":
          return {
            onClick: ({ unit, rel, abs, xaxis, yaxis, event }) => {
              region.selectPoint(
                abs,
                Specviz.RegionContext.selectionMode(event),
              )
            },
            onRect: ({ unit, rel, abs, xaxis, yaxis, event }) => {
              region.selectArea(abs, Specviz.RegionContext.selectionMode(event))
            },
            onWheel,
          }
        case "zoom":
          return {
            onClick: ({ unit, rel, abs, xaxis, yaxis, event }) => {
              viewport.zoomPoint(
                abs,
                event.ctrlKey || event.metaKey
                  ? Specviz.ZoomDirection.out
                  : Specviz.ZoomDirection.in,
              )
            },
            onRect: ({ unit, rel, abs, xaxis, yaxis, event }) => {
              viewport.zoomArea(abs)
            },
            onWheel,
          }
        case "pan":
          return {
            onMove: ({ dx, dy, event }) => {
              if (region.selection.size == 0) {
                viewport.scroll(-dx, -dy)
              } else {
                region.moveSelection(
                  dx / viewport.state.zoom.x,
                  dy / viewport.state.zoom.y,
                )
              }
            },
            onWheel,
          }
      }
    },
    [
      onWheel,
      region.annotate,
      region.moveSelection,
      region.selectArea,
      region.selectPoint,
      region.selection,
      viewport.scroll,
      viewport.state.zoom.x,
      viewport.state.zoom.y,
      viewport.zoomArea,
      viewport.zoomPoint,
    ],
  )
  return <Specviz.ToolContext.Transform children={props.children} fn={fn} />
}

function HorizontalAxisToolProvider(props: { children: React.ReactNode }) {
  const viewport = Specviz.useViewport()
  const fn: Specviz.ToolContext.TransformProps["fn"] = React.useCallback(
    tool => ({
      onWheel: ({ dx, dy, event }) => {
        if (event.altKey) {
          viewport.zoomScroll(dy, 0)
        } else {
          viewport.zoomScroll(-dy, 0)
        }
      },
    }),
    [viewport.zoomScroll],
  )
  return <Specviz.ToolContext.Transform children={props.children} fn={fn} />
}

function VerticalAxisToolProvider(props: { children: React.ReactNode }) {
  const viewport = Specviz.useViewport()
  const fn: Specviz.ToolContext.TransformProps["fn"] = React.useCallback(
    tool => ({
      onWheel: ({ dx, dy, event }) => {
        if (event.altKey) {
          viewport.zoomScroll(0, dy)
        } else {
          viewport.zoomScroll(0, -dy)
        }
      },
    }),
    [viewport.zoomScroll],
  )
  return <Specviz.ToolContext.Transform children={props.children} fn={fn} />
}

function Keybinds() {
  const app = React.useContext(Context)
  const audio = Specviz.useAudio()
  const region = Specviz.useRegion()
  const tool = Specviz.useTool()
  return (
    <Specviz.Bindings>
      <Specviz.Keypress bind="Backspace" onKeyDown={region.delete} />
      <Specviz.Keypress bind="Escape" onKeyDown={region.deselect} />
      <Specviz.Keypress
        bind="ArrowLeft"
        onKeyDown={e => {
          e.preventDefault()
          region.moveSelection(-0.01, 0)
        }}
      />
      <Specviz.Keypress
        bind="ArrowRight"
        onKeyDown={e => {
          e.preventDefault()
          region.moveSelection(0.01, 0)
        }}
      />
      <Specviz.Keypress
        bind="ArrowUp"
        onKeyDown={e => {
          e.preventDefault()
          region.moveSelection(0, -0.03)
        }}
      />
      <Specviz.Keypress
        bind="ArrowDown"
        onKeyDown={e => {
          e.preventDefault()
          region.moveSelection(0, 0.03)
        }}
      />
      <Specviz.Keypress bind="a" onKeyDown={() => tool.setTool("annotate")} />
      <Specviz.Keypress bind="s" onKeyDown={() => tool.setTool("select")} />
      <Specviz.Keypress bind="d" onKeyDown={() => tool.setTool("zoom")} />
      <Specviz.Keypress bind="f" onKeyDown={() => tool.setTool("pan")} />
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
