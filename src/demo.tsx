import * as R from "react"
import * as ReactDOM from "react-dom/client"
import * as Audio2 from "./audio2"
import { linear, nonlinear } from "./axis"
import * as Focus from "./focus"
import { useAxes, useRegionState } from "./hooks"
import { Encoder, Navigator, Specviz, Visualization, useSpecviz } from "./index"
import { Bindings, Keypress } from "./keybinds"
import { formatHz, formatPercent, formatTimestamp } from "./stringx"
import { tregion } from "./types"

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

const initRegions = new Map([
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
  const audio = Audio2.useAudio()
  return <R.Fragment>({audio.buffer.duration})</R.Fragment>
}

export default function MyComponent() {
  const [data, setData] = R.useState(segment1)

  const axes = useAxes(() => ({
    seconds: linear(0, 44.416, "seconds", formatTimestamp),
    hertz: linear(20000, 0, "hertz", formatHz),
    percent: nonlinear(
      [
        [0, 1],
        [0.5, 0],
        [1, -1],
      ],
      "percent",
      formatPercent,
    ),
  }))

  const [regions, setRegions] = useRegionState(initRegions)

  return (
    <Specviz axes={axes} regions={regions} setRegions={setRegions}>
      <Focus.Provider>
        <Audio2.Audio url={data.audio}>
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
              <Navigator
                src={data.spectrogram}
                xaxis={axes.seconds}
                yaxis={axes.hertz}
              />
              <Visualization
                src={data.spectrogram}
                xaxis={axes.seconds}
                yaxis={axes.hertz}
              />
              <Visualization
                src={data.waveform}
                xaxis={axes.seconds}
                yaxis={axes.percent}
              />
              <Navigator
                src={data.waveform}
                xaxis={axes.seconds}
                yaxis={axes.percent}
              />
              <MyAudioControls />
            </main>
            <MyAnnotations />
          </div>
        </Audio2.Audio>
      </Focus.Provider>
    </Specviz>
  )
}

function MyAudioControls() {
  const { command, toolState } = useSpecviz()
  const audio = Audio2.useAudio()
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
      <pre>{JSON.stringify(audio, null, 2)}</pre>
    </p>
  )
}

function MyKeybinds() {
  const { command } = useSpecviz()
  const focus = Focus.useContext()
  const audio = Audio2.useAudio()
  return (
    <Bindings>
      <Keypress bind="Backspace" onKeyDown={command.delete} />
      <Keypress bind="Escape" onKeyDown={command.deselect} />
      <Keypress
        bind="ArrowLeft"
        onKeyDown={e => {
          e.preventDefault()
          command.moveSelection(-0.01, 0)
        }}
      />
      <Keypress
        bind="ArrowRight"
        onKeyDown={e => {
          e.preventDefault()
          command.moveSelection(0.01, 0)
        }}
      />
      <Keypress
        bind="ArrowUp"
        onKeyDown={e => {
          e.preventDefault()
          command.moveSelection(0, -0.03)
        }}
      />
      <Keypress
        bind="ArrowDown"
        onKeyDown={e => {
          e.preventDefault()
          command.moveSelection(0, 0.03)
        }}
      />
      <Keypress bind="a" onKeyDown={() => command.tool("annotate")} />
      <Keypress bind="s" onKeyDown={() => command.tool("select")} />
      <Keypress bind="d" onKeyDown={() => command.tool("zoom")} />
      <Keypress bind="f" onKeyDown={() => command.tool("pan")} />
      <Keypress bind="z" onKeyDown={() => audio.transport.play()} />
      <Keypress
        bind="x"
        onKeyDown={() => {
          audio.transport.stop()
          focus.setFocusRegion(null)
        }}
      />
    </Bindings>
  )
}

function MyAnnotations() {
  const { regions, selection } = useSpecviz()
  return selection.size > 0 ? (
    <aside>
      {Array.from(selection).map(id => (
        <MyForm key={id} {...(regions.get(id) as tregion)} />
      ))}
    </aside>
  ) : (
    <></>
  )
}

function MyForm(region: tregion) {
  const audio = Audio2.useAudio()
  const focus = Focus.useContext()
  return (
    <div className="annotation-form">
      <div className="title">
        <div>{region.id}</div>
        {focus.region && audio.fx.loop && region.id == focus.region.id ? (
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
          <Encoder.X {...region} />
          Offset
        </div>
        <div>
          <Encoder.X2 {...region} />
          Duration
        </div>
        <div>
          <Encoder.Y1 {...region} />
          LPF
        </div>
        <div>
          <Encoder.Y2 {...region} />
          HPF
        </div>
      </div>
      <pre>{JSON.stringify(region, null, 2)}</pre>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <R.StrictMode>
    <div style={{ padding: 20, backgroundColor: "#E8FDF5" }}>
      <MyComponent />
    </div>
  </R.StrictMode>,
)
