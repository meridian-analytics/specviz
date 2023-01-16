import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Specviz, useSpecviz } from "./specviz"
import Visualization from "./visualization"
import Audio from "./audio"
import "./index.css"

function MyComponent(props: {
  id: number,
}) {
  return <Specviz>
    <h3>specviz instance {props.id}</h3>
    <p>spectrogram</p>
    <Visualization height={200} imageUrl="./spectrogram.png" />
    <p>waveform</p>
    <Visualization height={200} imageUrl="./waveform.png" />
    <Audio url="./audio.wav" />
    <MyAudioControls />
  </Specviz>
}

function MyAudioControls() {
  const { transport } = useSpecviz()
  return <p>
    <button
      type="button"
      onClick={_ => transport.play()}
      children="Play"
    />
    <button
      type="button"
      onClick={_ => transport.pause()}
      children="Stop"
    />
  </p>
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
      <div style={{padding: 20, backgroundColor: "#cff" }}>
        <MyComponent id={1} />
      </div>
      <div style={{padding: 20, backgroundColor: "#fcf" }}>
        <MyComponent id={2} />
      </div>
    </div>
  </StrictMode>
)
