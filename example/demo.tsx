import * as React from "react"
import * as ReactDOM from "react-dom/client"
import * as Reb from "react-error-boundary"
import * as Audio from "../src/audio2"
import * as Axis from "../src/axis"
import * as Focus from "../src/focus"
import * as Format from "../src/format"
import * as Specviz from "../src/index"

type tsegment = {
  audio: string
  spectrogram: string
  waveform: string
}

const segment1: tsegment = {
  audio: "./audio.wav",
  spectrogram: "./spectrogram.png",
  waveform: "./waveform.png",
}

const segment2: tsegment = {
  audio: "./audio2.wav",
  spectrogram: "./spectrogram.png",
  waveform: "./waveform.png",
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
      additional: "ok",
      someField: 1,
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
      anyField: 123,
    },
  ],
])

function Duration() {
  const audio = Audio.useContext()
  return <React.Fragment>({audio.buffer.duration})</React.Fragment>
}

export default function MyApp() {
  const [data, setData] = React.useState(segment1)
  return (
    <Audio.Provider url={data.audio}>
      <div style={{ padding: 20, backgroundColor: "#E8FDF5" }}>
        <h3>specviz-react</h3>
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
      seconds: Axis.linear(
        0,
        audio.buffer.duration,
        "seconds",
        Format.timestamp,
      ),
      hertz: Axis.linear(20000, 0, "hertz", Format.hz),
      percent: Axis.nonlinear(
        [
          [0, 1],
          [0.5, 0],
          [1, -1],
        ],
        "percent",
        Format.percent,
      ),
    }),
    [audio.buffer.duration],
  )
  const [regions, setRegions] = React.useState(initRegions)
  const [selection, setSelection] = React.useState<Specviz.Selection>(new Set())

  return (
    <Specviz.Provider
      axes={axes}
      regions={regions}
      setRegions={setRegions}
      selection={selection}
      setSelection={setSelection}
    >
      <Focus.Provider>
        <div id="app">
          <main>
            <Specviz.Viewport.Provider>
              <MySpectrogram src={props.spectrogram} />
              <MyWaveform src={props.waveform} />
              <MyAudioControls />
            </Specviz.Viewport.Provider>
          </main>
          <MyAnnotations />
        </div>
        <MyKeybinds />
      </Focus.Provider>
    </Specviz.Provider>
  )
}

function MySpectrogram(props: { src: string }) {
  const axis = Axis.useContext()
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
  const axis = Axis.useContext()
  if (axis.seconds == null) throw Error("axis not found: seconds")
  if (axis.percent == null) throw Error("axis not found: percent")
  return (
    <Specviz.Viewport.Transform
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
    </Specviz.Viewport.Transform>
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
  const input = Specviz.useInput()
  const audio = Audio.useContext()
  const focus = Focus.useContext()
  return (
    <p>
      <button
        title="A"
        type="button"
        onClick={_ => input.setToolState("annotate")}
        className={input.toolState === "annotate" ? "active" : ""}
        children="Annotate"
      />
      <button
        title="S"
        type="button"
        onClick={_ => input.setToolState("select")}
        className={input.toolState === "select" ? "active" : ""}
        children="Select"
      />
      <button
        title="D"
        type="button"
        onClick={_ => input.setToolState("zoom")}
        className={input.toolState === "zoom" ? "active" : ""}
        children="Zoom"
      />
      <button
        title="F"
        type="button"
        onClick={_ => input.setToolState("pan")}
        className={input.toolState === "pan" ? "active" : ""}
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
          focus.setFocusRegion(null)
        }}
        className={audio.transport.state.pause ? "active" : ""}
        children="Stop"
      />
    </p>
  )
}

function MyKeybinds() {
  const input = Specviz.useInput()
  const region = Specviz.useRegions()
  const focus = Focus.useContext()
  const audio = Audio.useContext()
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
      <Specviz.Keypress
        bind="a"
        onKeyDown={() => input.setToolState("annotate")}
      />
      <Specviz.Keypress
        bind="s"
        onKeyDown={() => input.setToolState("select")}
      />
      <Specviz.Keypress bind="d" onKeyDown={() => input.setToolState("zoom")} />
      <Specviz.Keypress bind="f" onKeyDown={() => input.setToolState("pan")} />
      <Specviz.Keypress bind="z" onKeyDown={() => audio.transport.play()} />
      <Specviz.Keypress
        bind="x"
        onKeyDown={() => {
          audio.transport.stop()
          focus.setFocusRegion(null)
        }}
      />
    </Specviz.Bindings>
  )
}

function MyAnnotations() {
  const { regions, selection } = Specviz.useRegions()
  return selection.size > 0 ? (
    <aside>
      {Array.from(selection).map(id => (
        <MyForm key={id} {...(regions.get(id) as Specviz.Region)} />
      ))}
    </aside>
  ) : (
    <></>
  )
}

function MyForm(region: Specviz.Region) {
  const audio = Audio.useContext()
  const focus = Focus.useContext()
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
              focus.setFocusRegion(null)
            }}
            children="stop"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              focus.setFocusRegion(region.id)
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
