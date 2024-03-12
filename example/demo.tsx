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
  duration: number
  spectrogram: string
  waveform: string
}

const segment1: tsegment = {
  audio: "./audio.wav",
  duration: 44.416,
  spectrogram: "./spectrogram.png",
  waveform: "./waveform.png",
}

const segment2: tsegment = {
  audio: "./audio2.wav",
  duration: 44.416,
  spectrogram: "./spectrogram.png",
  waveform: "./waveform.png",
}

const initRegions: Map<string, Specviz.Region> = new Map([
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

export default function MyComponent() {
  const [data, setData] = React.useState(segment1)

  const axes = React.useMemo<Record<string, Specviz.Axis>>(
    () => ({
      seconds: Axis.linear(0, data.duration, "seconds", Format.timestamp),
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
    [data.duration],
  )

  const [regions, setRegions] = React.useState(initRegions)

  return (
    <Specviz.Provider axes={axes} regions={regions} setRegions={setRegions}>
      <Focus.Provider>
        <Audio.Provider url={data.audio}>
          <MyKeybinds />
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
          <div id="app">
            <main>
              <Specviz.Navigator
                src={data.spectrogram}
                xaxis={axes.seconds}
                yaxis={axes.hertz}
              />
              <Specviz.Visualization
                src={data.spectrogram}
                xaxis={axes.seconds}
                yaxis={axes.hertz}
              />
              <Specviz.Visualization
                src={data.waveform}
                xaxis={axes.seconds}
                yaxis={axes.percent}
              />
              <Specviz.Navigator
                src={data.waveform}
                xaxis={axes.seconds}
                yaxis={axes.percent}
              />
              <MyAudioControls />
            </main>
            <MyAnnotations />
          </div>
        </Audio.Provider>
      </Focus.Provider>
    </Specviz.Provider>
  )
}

function MyAudioControls() {
  const { command, toolState } = Specviz.useContext()
  const audio = Audio.useContext()
  const focus = Focus.useContext()
  return (
    <p>
      <button
        title="A"
        type="button"
        onClick={_ => command.tool("annotate")}
        className={toolState === "annotate" ? "active" : ""}
        children="Annotate"
      />
      <button
        title="S"
        type="button"
        onClick={_ => command.tool("select")}
        className={toolState === "select" ? "active" : ""}
        children="Select"
      />
      <button
        title="D"
        type="button"
        onClick={_ => command.tool("zoom")}
        className={toolState === "zoom" ? "active" : ""}
        children="Zoom"
      />
      <button
        title="F"
        type="button"
        onClick={_ => command.tool("pan")}
        className={toolState === "pan" ? "active" : ""}
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
  const { command } = Specviz.useContext()
  const focus = Focus.useContext()
  const audio = Audio.useContext()
  return (
    <Specviz.Bindings>
      <Specviz.Keypress bind="Backspace" onKeyDown={command.delete} />
      <Specviz.Keypress bind="Escape" onKeyDown={command.deselect} />
      <Specviz.Keypress
        bind="ArrowLeft"
        onKeyDown={e => {
          e.preventDefault()
          command.moveSelection(-0.01, 0)
        }}
      />
      <Specviz.Keypress
        bind="ArrowRight"
        onKeyDown={e => {
          e.preventDefault()
          command.moveSelection(0.01, 0)
        }}
      />
      <Specviz.Keypress
        bind="ArrowUp"
        onKeyDown={e => {
          e.preventDefault()
          command.moveSelection(0, -0.03)
        }}
      />
      <Specviz.Keypress
        bind="ArrowDown"
        onKeyDown={e => {
          e.preventDefault()
          command.moveSelection(0, 0.03)
        }}
      />
      <Specviz.Keypress bind="a" onKeyDown={() => command.tool("annotate")} />
      <Specviz.Keypress bind="s" onKeyDown={() => command.tool("select")} />
      <Specviz.Keypress bind="d" onKeyDown={() => command.tool("zoom")} />
      <Specviz.Keypress bind="f" onKeyDown={() => command.tool("pan")} />
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
  const { regions, selection } = Specviz.useContext()
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
      <div style={{ padding: 20, backgroundColor: "#E8FDF5" }}>
        <MyComponent />
      </div>
    </Reb.ErrorBoundary>
  </React.StrictMode>,
)
