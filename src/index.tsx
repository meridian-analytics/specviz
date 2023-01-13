import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"

import { Specviz } from "./specviz"
import Visualization from "./visualization"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div style={{padding: 20, backgroundColor: "#cff" }}>
      <Specviz>
        <h3>specviz instance 1</h3>
        <p>spectrogram</p>
        <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
          <Visualization height={200} imageUrl="./spectrogram.png" />
        <div>
        <p>waveform</p>
        </div>
          <Visualization height={200} imageUrl="./waveform.png" />
        </div>
      </Specviz>
    </div>
    <div style={{padding: 20, backgroundColor: "#fcf" }}>
      <Specviz>
        <h3>specviz instance 2</h3>
        <p>spectrogram</p>
        <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
          <Visualization height={200} imageUrl="./spectrogram.png" />
        <div>
        <p>waveform</p>
        </div>
          <Visualization height={200} imageUrl="./waveform.png" />
        </div>
      </Specviz>
    </div>
  </React.StrictMode>,
)
