import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import { tannotation } from "./src/types.jsx"
import { taxis, linear, nonlinear } from "./src/axis.jsx"
import { Specviz, Audio, Encoder, Navigator, Visualization, useSpecviz } from "./src/index.jsx"
import { Bindings, Keypress } from "./src/keybinds.jsx"
import { formatHz, formatPercent, formatTimestamp } from "./src/stringx.jsx"

type tsegment = {
  audio: string,
  duration: number,
  xaxis: taxis,
  spectrogram: {
    image: string,
    yaxis: taxis,
  },
  waveform: {
    image: string,
    yaxis: taxis,
  },
}

const segment1: tsegment = {
  audio: "./audio.wav",
  duration: 44.416,
  xaxis: linear(0, 44.416, "seconds", formatTimestamp),
  spectrogram: {
    image: "./spectrogram.png",
    yaxis: linear(20000, 0, "hertz", formatHz),
  },
  waveform: {
    image: "./waveform.png",
    yaxis: nonlinear([[0, 1], [.5, 0], [1, -1]], "percent", formatPercent),
  }
}

const segment2: tsegment = {
  audio: "./audio2.wav",
  duration: 44.416,
  xaxis: linear(0, 44.416, "seconds", formatTimestamp),
  spectrogram: {
    image: "./spectrogram2.png",
    yaxis: linear(20000, 0, "hertz", formatHz),
  },
  waveform: {
    image: "./waveform2.png",
    yaxis: nonlinear([[0, 1], [.5, 0], [1, -1]], "percent", formatPercent),
  },
}

const segment3: tsegment = {
  audio: "./audio.wav",
  duration: 44.416,
  xaxis: linear(0, 44.416, "seconds", formatTimestamp),
  spectrogram: {
    image: "./spectrogram.png",
    yaxis: linear(20000, 0, "hertz", formatHz),
  },
  waveform: {
    image: "./waveform.png",
    yaxis: nonlinear([[0, 1], [.5, 0], [1, -1]], "percent", formatPercent),
  }
}

function MyComponent() {
  const [data, setData] = useState(segment1)
  return <Specviz>
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
      <button
        type="button"
        onClick={_ => setData(segment3)}
        children={`${segment3.audio} (nonlinear)`}
      />
      <p>{data.audio} ({data.duration} seconds)</p>
    </div>
    <div id="app">
      <main>
        <Navigator
          src={data.spectrogram.image}
          xaxis={data.xaxis}
          yaxis={data.spectrogram.yaxis}
        />
        <Visualization
          src={data.spectrogram.image}
          xaxis={data.xaxis}
          yaxis={data.spectrogram.yaxis}
        />
        <Visualization
          src={data.waveform.image}
          xaxis={data.xaxis}
          yaxis={data.waveform.yaxis}
        />
        <Navigator
          src={data.waveform.image}
          xaxis={data.xaxis}
          yaxis={data.waveform.yaxis}
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
  const { annotations, selection } = useSpecviz()
  return selection.size > 0
    ? <aside>
        {Array.from(selection).map((id, key) =>
          <MyForm key={key} annotation={annotations.get(id)!} />
        )}
      </aside>
    : <></>
}

function MyForm(props: { annotation: tannotation }) {
  const { annotation } = props
  const { command, transport } = useSpecviz()
  return <div className="annotation-form">
    <div className="title">
      <div>{annotation.id}</div>
      <button
        type="button"
        onClick={event => {
          event.preventDefault()
          transport.loop(props.annotation)
        }}
        children="loop"
      />
    </div>
    <div className="encoders">
      <div>
        <Encoder
          state={annotation.rect.x}
          setState={v => command.setRectX(annotation, v)}
          value={annotation.unit.x}
          unit={annotation.xaxis.unit}
        />
        Offset
      </div>
      <div>
        <Encoder
          state={annotation.rect.width}
          setState={v => command.setRectX2(annotation, v)}
          value={annotation.unit.width}
          unit={annotation.xaxis.unit}
        />
        Duration
      </div>
      <div>
        {/* todo: axis context */}
        <Encoder
          state={1 - annotation.rect.y - annotation.rect.height}
          setState={v => command.setRectY2(annotation, v)}
          value={annotation.unit.y}
          unit={annotation.yaxis.unit}
        />
        HPF
      </div>
      <div>
        {/* todo: axis context */}
        <Encoder
          state={1 - annotation.rect.y}
          setState={v => command.setRectY1(annotation, v)}
          value={annotation.unit.y + annotation.unit.height}
          unit={annotation.yaxis.unit}
        />
        LPF
      </div>
    </div>
    <pre>{JSON.stringify(annotation, null, 2)}</pre>
  </div>
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <div style={{padding: 20, backgroundColor: "#E8FDF5" }}>
      <MyComponent />
    </div>
  </StrictMode>
)
