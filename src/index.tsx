import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import { Specviz, useSpecviz } from "./specviz"
import Visualization from "./visualization"
import Navigator from "./navigator"
import Audio from "./audio"
import { Bindings, Keypress } from "./keybinds"
import "./index.css"

const segment1 = {
  audio: "./audio.wav",
  duration: 44.416,
  spectrogram: "./spectrogram.png",
  waveform: "./waveform.png",
}

const segment2 = {
  audio: "./audio2.wav",
  duration: 44.416,
  spectrogram: "./spectrogram2.png",
  waveform: "./waveform2.png",
}

function MyComponent() {
  const [data, setData] = useState(segment1)
  return <Specviz duration={data.duration}>
    <h3>specviz-react</h3>
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
    <Navigator imageUrl={data.spectrogram} />
    <Visualization imageUrl={data.spectrogram} />
    <Visualization imageUrl={data.waveform} />
    <Navigator imageUrl={data.waveform} />
    <Audio url={data.audio} />
    <MyAudioControls />
    <MyKeybinds />
  </Specviz>
}

function MyAudioControls() {
  const { tool, toolState, transport, transportState } = useSpecviz()
  return <p>
    <button
      title="A"
      type="button"
      onClick={_ => tool.annotate()}
      className={toolState === "annotate" ? "active" : ""}
      children="Annotate"
    />
    <button
      title="S"
      type="button"
      onClick={_ => tool.select()}
      className={toolState === "select" ? "active" : ""}
      children="Select"
    />
    <button
      title="D"
      type="button"
      onClick={_ => tool.zoom()}
      className={toolState === "zoom" ? "active" : ""}
      children="Zoom"
    />
    <button
      title="F"
      type="button"
      onClick={_ => tool.pan()}
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
  const { tool, transport } = useSpecviz()
  return <Bindings>
    <Keypress bind="a" onKeyDown={tool.annotate} />
    <Keypress bind="s" onKeyDown={tool.select} />
    <Keypress bind="d" onKeyDown={tool.zoom} />
    <Keypress bind="f" onKeyDown={tool.pan} />
    <Keypress bind="z" onKeyDown={transport.play} />
    <Keypress bind="x" onKeyDown={transport.stop} />
  </Bindings>
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <div style={{padding: 20, backgroundColor: "#E8FDF5" }}>
      <MyComponent />
    </div>
  </StrictMode>
)
