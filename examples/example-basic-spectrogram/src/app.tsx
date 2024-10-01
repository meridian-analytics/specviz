import * as Specviz from "@meridian_cfi/specviz"
import * as React from "react"

export const element = <App />

type Sample = {
  audio: string
  spectrogram: string
  waveform: string
  duration: number
}

const sample: Sample = {
  audio: "./audio.flac",
  spectrogram: "./spectrogram.png",
  waveform: "./waveform.png",
  duration: 44.346,
}

function App() {
  const axes: Specviz.Axis.Context = React.useMemo(
    () => ({
      seconds: Specviz.Axis.time(0, sample.duration),
      hertz: Specviz.Axis.frequency(20000, 0),
    }),
    [],
  )
  return (
    <Specviz.Axis.Provider value={axes}>
      <div
        style={{
          backgroundColor: "cornsilk",
          border: "1px solid burlywood",
          display: "grid",
          gridGap: "1rem",
          gridTemplateColumns: "80px 1fr",
          gridTemplateRows: "400px 20px",
          gridTemplateAreas: `
            "y viz"
            ". x"
          `,
          marginTop: "1rem",
          padding: "1rem",
        }}
      >
        <Specviz.Plane.Provider xaxis="seconds" yaxis="hertz">
          <div style={{ gridArea: "x" }}>
            <Specviz.Axis.Horizontal />
          </div>
          <div style={{ gridArea: "y" }}>
            <Specviz.Axis.Vertical />
          </div>
          <div style={{ gridArea: "viz" }}>
            <Specviz.Visualization src={sample.spectrogram} />
          </div>
        </Specviz.Plane.Provider>
      </div>
    </Specviz.Axis.Provider>
  )
}
