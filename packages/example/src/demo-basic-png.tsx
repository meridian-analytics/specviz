import * as Specviz from "@specviz/core"
import * as Format from "@specviz/format"
import * as React from "react"

export const element = <App />

type Sample = {
  audio: string
  spectrogram: string
  waveform: string
  duration: number
}

const sample: Sample = {
  audio: "./audio.wav",
  spectrogram: "./spectrogram.png",
  waveform: "./waveform.png",
  duration: 44.346,
}

function App() {
  const axes: Specviz.Axes = React.useMemo(
    () => ({
      seconds: Specviz.AxisContext.linear(
        0,
        sample.duration,
        "seconds",
        Format.timestamp,
      ),
      hertz: Specviz.AxisContext.linear(20000, 0, "hertz", Format.hz),
    }),
    [],
  )
  return (
    <Specviz.AxisProvider value={axes}>
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
          padding: "1rem",
        }}
      >
        <Specviz.PlaneProvider xaxis="seconds" yaxis="hertz">
          <div style={{ gridArea: "x" }}>
            <Specviz.AxisContext.Horizontal />
          </div>
          <div style={{ gridArea: "y" }}>
            <Specviz.AxisContext.Vertical />
          </div>
          <div style={{ gridArea: "viz" }}>
            <Specviz.Visualization src={sample.spectrogram} />
          </div>
        </Specviz.PlaneProvider>
      </div>
    </Specviz.AxisProvider>
  )
}
