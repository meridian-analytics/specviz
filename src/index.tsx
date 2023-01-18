import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import { Specviz, useSpecviz } from "./specviz"
import Visualization from "./visualization"
import Audio from "./audio"
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

function MyComponent(props: {
  id: number,
}) {
  const [data, setData] = useState(segment1)
  return <Specviz>
    <h3>specviz instance {props.id}</h3>
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
    <Visualization height={200} imageUrl={data.spectrogram} duration={data.duration} />
    <Visualization height={200} imageUrl={data.waveform} duration={data.duration} />
    <Audio url={data.audio} />
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
      onClick={_ => transport.stop()}
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
