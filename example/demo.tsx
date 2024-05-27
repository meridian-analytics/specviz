import * as React from "react"
import * as ReactDOM from "react-dom/client"
import * as Reb from "react-error-boundary"
import pkg from "../package.json"
import * as Audio from "../src/audio2"
import * as Format from "../src/format"
import * as Specviz from "../src/index"

type tsegment = {
  audio: string
  spectrogram: string
  waveform: string
  offset: number
}

const segment1: tsegment = {
  audio: "./audio.wav",
  spectrogram: "./spectrogram.png",
  waveform: "./waveform.png",
  offset: 0,
}

const segment2: tsegment = {
  audio: "./audio2.wav",
  spectrogram: "./spectrogram.png",
  waveform: "./waveform.png",
  offset: 0,
}

const initRegions: Specviz.Regions = new Map([
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

function Duration() {
  const audio = Audio.useContext()
  return (
    <React.Fragment>
      ({audio.buffer.duration.toFixed(2)} seconds)
    </React.Fragment>
  )
}

export default function MyApp() {
  const [data, setData] = React.useState(segment1)
  return (
    <Audio.Provider url={data.audio}>
      <div style={{ padding: 20, backgroundColor: "#E8FDF5" }}>
        <h3>specviz-react (version {pkg.version})</h3>
        <div className="segments">
          <button
            type="button"
            onClick={_ => setData(segment1)}
            children={segment1.audio}
          />
          <button
            type="button"
            onClick={_ => setData(segment2)}
            children={segment2.audio}
          />
          <p>
            {data.audio} <Duration />
          </p>
        </div>
        <MyVisualizer {...data} />
      </div>
    </Audio.Provider>
  )
}

function MyVisualizer(props: tsegment) {
  const audio = Audio.useContext()
  const axes: Specviz.Axes = React.useMemo(
    () => ({
      seconds: Specviz.AxisContext.linear(
        props.offset + 0,
        props.offset + audio.buffer.duration,
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
    [audio.buffer.duration, props.offset],
  )
  const [regions, setRegions] = React.useState(initRegions)
  const [selection, setSelection] = React.useState<Specviz.Selection>(new Set())

  return (
    <Specviz.InputProvider>
      <Specviz.AxisProvider value={axes}>
        <Specviz.RegionProvider
          regions={regions}
          selection={selection}
          setRegions={setRegions}
          setSelection={setSelection}
        >
          <Specviz.FocusProvider>
            <Specviz.ToolProvider>
              <div id="app">
                <main>
                  <Specviz.ViewportProvider>
                    <MySpectrogram src={props.spectrogram} />
                    <MyWaveform src={props.waveform} />
                    <MyAudioControls />
                  </Specviz.ViewportProvider>
                </main>
                <MyAnnotations />
              </div>
              <MyKeybinds />
            </Specviz.ToolProvider>
          </Specviz.FocusProvider>
        </Specviz.RegionProvider>
      </Specviz.AxisProvider>
    </Specviz.InputProvider>
  )
}

function MySpectrogram(props: { src: string }) {
  const axis = Specviz.useAxis()
  if (axis.seconds == null) throw Error("axis not found: seconds")
  if (axis.hertz == null) throw Error("axis not found: hertz")
  return (
    <React.Fragment>
      <Specviz.Navigator
        src={props.src}
        xaxis={axis.seconds}
        yaxis={axis.hertz}
      />
      <Specviz.Visualization
        children={MyAnnotationSvg}
        src={props.src}
        xaxis={axis.seconds}
        yaxis={axis.hertz}
      />
    </React.Fragment>
  )
}

function MyWaveform(props: { src: string }) {
  const axis = Specviz.useAxis()
  if (axis.seconds == null) throw Error("axis not found: seconds")
  if (axis.percent == null) throw Error("axis not found: percent")
  return (
    <Specviz.ViewportContext.Transform
      fn={state => ({
        scroll: { x: state.scroll.x, y: 0 },
        zoom: { x: state.zoom.x, y: 1 },
      })}
    >
      <Specviz.Visualization
        children={MyAnnotationSvg}
        src={props.src}
        xaxis={axis.seconds}
        yaxis={axis.percent}
      />
      <Specviz.Navigator
        src={props.src}
        xaxis={axis.seconds}
        yaxis={axis.percent}
      />
    </Specviz.ViewportContext.Transform>
  )
}

function MyAnnotationSvg(props: Specviz.AnnotationProps) {
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

function MyAudioControls() {
  const audio = Audio.useContext()
  const focus = Specviz.useFocus()
  const tool = Specviz.useTool()
  return (
    <p>
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
      <br />
      <button
        title="Z"
        type="button"
        onClick={_ => audio.transport.play()}
        className={!audio.transport.state.pause ? "active" : ""}
        children="Play"
      />
      <button
        title="X"
        type="button"
        onClick={_ => {
          audio.transport.stop()
          focus.setFocus(null)
        }}
        className={audio.transport.state.pause ? "active" : ""}
        children="Stop"
      />
    </p>
  )
}

function MyKeybinds() {
  const audio = Audio.useContext()
  const focus = Specviz.useFocus()
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
          focus.setFocus(null)
        }}
      />
    </Specviz.Bindings>
  )
}

function MyAnnotations() {
  const region = Specviz.useRegion()
  return region.selection.size > 0 ? (
    <aside>
      {Array.from(region.selection).map(id => {
        const r = region.regions.get(id)
        if (r == null) return <MyFormStaleSelection id={id} />
        return <MyForm key={id} {...r} />
      })}
    </aside>
  ) : (
    <></>
  )
}

function MyFormStaleSelection(props: { id: string }) {
  return (
    <div className="annotation-form">
      <div className="title">
        {props.id} is selected but not found in the region context
      </div>
    </div>
  )
}

function MyForm(region: Specviz.Region) {
  const audio = Audio.useContext()
  const focus = Specviz.useFocus()
  return (
    <div className="annotation-form">
      <div className="title">
        <div>{region.id}</div>
        {focus.region &&
        !audio.transport.state.pause &&
        region.id == focus.region.id ? (
          <button
            type="button"
            onClick={() => {
              audio.transport.stop()
              focus.setFocus(null)
            }}
            children="stop"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              focus.setFocus(region.id)
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

function Fallback(props: Reb.FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{props.error.message}</pre>
      <button
        type="button"
        onClick={props.resetErrorBoundary}
        children="Try again"
      />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Reb.ErrorBoundary FallbackComponent={Fallback}>
      <MyApp />
    </Reb.ErrorBoundary>
  </React.StrictMode>,
)
