import { taxis } from "./types"
import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import { Specviz, useSpecviz } from "./specviz"
import Visualization from "./visualization"
import Navigator from "./navigator"
import Audio from "./audio"
import { Bindings, Keypress } from "./keybinds"
import { formatHz, formatPercent, formatTimestamp } from "./stringx"
import "./index.css"

type tsegment = {
  audio: string,
  duration: number,
  xaxis: taxis,
  spectrogram: {
    imageUrl: string,
    yaxis: taxis,
  },
  waveform: {
    imageUrl: string,
    yaxis: taxis,
  },
}

const segment1: tsegment = {
  audio: "./audio.wav",
  duration: 44.416,
  xaxis: {
    unit: "seconds",
    intervals: [[0,0], [1, 44.416]],
    format: formatTimestamp,
  },
  spectrogram: {
    imageUrl: "./spectrogram.png",
    yaxis: {
      unit: "hertz",
      intervals: [[0, 20000], [.5, 2000], [1, 0] ],
      format: formatHz,
    },
  },
  waveform: {
    imageUrl: "./waveform.png",
    yaxis: {
      unit: "percent",
      intervals: [[0, 1], [.5, 0], [1, -1]],
      format: formatPercent,
    },
  }
}

const segment2: tsegment = {
  audio: "./audio2.wav",
  duration: 44.416,
  xaxis: {
    unit: "seconds",
    intervals: [[0, 0], [1, 44.416]],
    format: formatTimestamp,
  },
  spectrogram: {
    imageUrl: "./spectrogram2.png",
    yaxis: {
      unit: "hertz",
      intervals: [[0, 20000], [.5, 2000], [1, 0]],
      format: formatHz,
    },
  },
  waveform: {
    imageUrl: "./waveform2.png",
    yaxis: {
      unit: "percent",
      intervals: [[0, 1], [.5, 0], [1, -1]],
      format: formatPercent,
    },
  },
}

function MyComponent() {
  const [data, setData] = useState(segment1)
  return <Specviz duration={data.duration}>
    <Audio url={data.audio} />
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
        <Navigator imageUrl={data.spectrogram.imageUrl} />
        <Visualization
          imageUrl={data.spectrogram.imageUrl}
          xaxis={data.xaxis}
          yaxis={data.spectrogram.yaxis}
        />
        <Visualization
          imageUrl={data.waveform.imageUrl}
          xaxis={data.xaxis}
          yaxis={data.waveform.yaxis}
        />
        <Navigator imageUrl={data.waveform.imageUrl} />
        <MyAudioControls />
      </main>
      <aside>
        <p>annotations</p>
        <MyForm />
      </aside>
    </div>
  </Specviz>
}

function MyAudioControls() {
  const { command, toolState, transport, transportState } = useSpecviz()
  return <p>
    <button
      title="A"
      type="button"
      onClick={_ => command.annotate()}
      className={toolState === "annotate" ? "active" : ""}
      children="Annotate"
    />
    <button
      title="S"
      type="button"
      onClick={_ => command.select()}
      className={toolState === "select" ? "active" : ""}
      children="Select"
    />
    <button
      title="D"
      type="button"
      onClick={_ => command.zoom()}
      className={toolState === "zoom" ? "active" : ""}
      children="Zoom"
    />
    <button
      title="F"
      type="button"
      onClick={_ => command.pan()}
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
    <Keypress bind="a" onKeyDown={command.annotate} />
    <Keypress bind="s" onKeyDown={command.select} />
    <Keypress bind="d" onKeyDown={command.zoom} />
    <Keypress bind="f" onKeyDown={command.pan} />
    <Keypress bind="z" onKeyDown={transport.play} />
    <Keypress bind="x" onKeyDown={transport.stop} />
  </Bindings>
}

function MyForm() {
  const { selection } = useSpecviz()
  return <pre>
    {JSON.stringify(Array.from(selection), null, 2)}
  </pre>
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <div style={{padding: 20, backgroundColor: "#E8FDF5" }}>
      <MyComponent />
    </div>
  </StrictMode>
)
