import { StrictMode, useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import { tregion } from "./src/types.jsx"
import { linear, nonlinear } from "./src/axis.jsx"
import { Specviz, Audio, Encoder, Navigator, Visualization, useSpecviz } from "./src/index.jsx"
import { Bindings, Keypress } from "./src/keybinds.jsx"
import { formatHz, formatPercent, formatTimestamp } from "./src/stringx.jsx"
import { useAxes, useRegionState } from "./src/hooks.js"

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
  ["df10e63bc928a9850b6f", {
    "id": "df10e63bc928a9850b6f",
    "x": 5.096308207705192,
    "y": 10743.75,
    "width": 2.5295544388609716,
    "height": 6200,
    "xunit": "seconds",
    "yunit": "hertz"
  }],
  
  ["b77d59d5089b139b2f49", {
    "id": "b77d59d5089b139b2f49",
    "x": 11.233969507191292,
    "y": 4943.75,
    "width": 6.138781151470651,
    "height": 9200,
    "xunit": "seconds",
    "yunit": "hertz",
    "additional": "ok",
    "someField": 1,
  }],
  
  ["81f3bab0f30023a82aa4", {
    "id": "81f3bab0f30023a82aa4",
    "x": 20.81046810348551,
    "y": 9543.75,
    "width": 4.849637109661813,
    "height": 6100,
    "xunit": "seconds",
    "yunit": "hertz",
    "anyField": 123,
  }]
])

function MyComponent() {
  const [data, setData] = useState(segment1)

  const axes = useAxes(() => ({
    seconds: linear(0, 44.416, "seconds", formatTimestamp),
    hertz: linear(20000, 0, "hertz", formatHz),
    percent: nonlinear([[0, 1], [.5, 0], [1, -1]], "percent", formatPercent),
  }))

  const [regions, setRegions] = useRegionState(initRegions)

  return <Specviz
    axes={axes}
    regions={regions}
    setRegions={setRegions}
  >
    <Audio src={data.audio} duration={data.duration} />
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
      <p>{data.audio} ({data.duration} seconds)</p>
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
  </Specviz>
}

function MyAudioControls() {
  const { command, toolState, transport, transportState } = useSpecviz()
  return <p>
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
    <br/>
    <button
      title="Z"
      type="button"
      onClick={_ => transport.play()}
      className={transportState.type === "play" ? "active" : ""}
      children="Play"
    />
    <button
      title="X"
      type="button"
      onClick={_ => transport.stop()}
      className={transportState.type === "stop" ? "active" : ""}
      children="Stop"
    />
  </p>
}

function MyKeybinds() {
  const { command, transport } = useSpecviz()
  return <Bindings>
    <Keypress bind="Backspace" onKeyDown={command.delete} />
    <Keypress bind="Escape" onKeyDown={command.deselect} />
    <Keypress bind="ArrowLeft" onKeyDown={e => { e.preventDefault(); command.moveSelection(-.01, 0) }} />
    <Keypress bind="ArrowRight" onKeyDown={e => { e.preventDefault(); command.moveSelection(.01, 0) }} />
    <Keypress bind="ArrowUp" onKeyDown={e => { e.preventDefault(); command.moveSelection(0, -.03) }} />
    <Keypress bind="ArrowDown" onKeyDown={e => { e.preventDefault(); command.moveSelection(0, .03) }} />
    <Keypress bind="a" onKeyDown={() => command.tool("annotate")} />
    <Keypress bind="s" onKeyDown={() => command.tool("select")} />
    <Keypress bind="d" onKeyDown={() => command.tool("zoom")} />
    <Keypress bind="f" onKeyDown={() => command.tool("pan")} />
    <Keypress bind="z" onKeyDown={transport.play} />
    <Keypress bind="x" onKeyDown={transport.stop} />
  </Bindings>
}

function MyAnnotations() {
  const { regions, selection } = useSpecviz()
  return selection.size > 0
    ? <aside>
        {Array.from(selection).map((id, key) =>
          <MyForm key={key} {...regions.get(id) as tregion} />
        )}
      </aside>
    : <></>
}

function MyForm(region: tregion ) {
  const { transport } = useSpecviz()
  return <div className="annotation-form">
    <div className="title">
      <div>{region.id}</div>
      <button
        type="button"
        onClick={event => {
          event.preventDefault()
          transport.loop(region.id)
        }}
        children="loop"
      />
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
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <div style={{padding: 20, backgroundColor: "#E8FDF5" }}>
      <MyComponent />
    </div>
  </StrictMode>
)
