import * as Specviz from "@specviz/core"
import * as Format from "@specviz/format"
import * as React from "react"
import * as RRT from "react-router-typesafe"

type Sample = {
  audio: string
  spectrogram: string
}

export const element = <AppProvider children={<App />} />

export const loader = RRT.makeLoader(async () => {
  const sample: Sample = {
    audio: "./count_10.flac",
    spectrogram: "./spectrogram_10.png",
  }
  const audioBuffer = await Specviz.AudioContext.load(sample.audio)
  return {
    sample,
    audioBuffer,
  }
})

function AppProvider(props: { children: React.ReactNode }) {
  const loaderData = RRT.useLoaderData<typeof loader>()
  const axes: Specviz.Axes = React.useMemo(
    () => ({
      seconds: Specviz.AxisContext.linear(
        0,
        loaderData.audioBuffer.duration,
        "seconds",
        Format.timestamp,
      ),
      hertz: Specviz.AxisContext.linear(20000, 0, "hertz", Format.hz),
    }),
    [loaderData.audioBuffer.duration],
  )
  return (
    <Specviz.AudioProvider buffer={loaderData.audioBuffer}>
      <Specviz.AxisProvider children={props.children} value={axes} />
    </Specviz.AudioProvider>
  )
}

function App() {
  return (
    <div
      style={{
        backgroundColor: "mintcream",
        display: "grid",
        gridGap: "1rem",
        gridTemplateRows: "60 auto",
        gridTemplateAreas: `
          "controls"
          "viz"
        `,
        padding: "1rem",
      }}
    >
      <AudioControls />
      <Visualizer />
      <Specviz.AudioEffect />
    </div>
  )
}

function AudioControls() {
  const audio = Specviz.useAudio()
  return (
    <div style={{ gridArea: "controls" }}>
      <button
        children="Rewind"
        onClick={_ => audio.transport.seek(0)}
        type="button"
      />
      <button
        children="Play"
        style={audio.state.pause ? {} : { color: "orchid" }}
        onClick={_ => audio.transport.play()}
        title="Z"
        type="button"
      />
      <button
        children="Stop"
        style={audio.state.pause ? { color: "orchid" } : {}}
        onClick={_ => audio.transport.stop()}
        title="X"
        type="button"
      />
    </div>
  )
}

function Visualizer() {
  const loaderData = RRT.useLoaderData<typeof loader>()
  return (
    <div
      style={{
        backgroundColor: "cornsilk",
        border: "1px solid burlywood",
        display: "grid",
        gridArea: "viz",
        gridGap: "1rem",
        gridTemplateColumns: "80px 1fr",
        gridTemplateRows: "400px 20px",
        gridTemplateAreas: `
          "y spec"
          ". x"
        `,
        padding: "1rem",
      }}
    >
      <Specviz.PlaneProvider xaxis="seconds" yaxis="hertz">
        <div style={{ gridArea: "x", overflow: "hidden" }}>
          <Specviz.AxisContext.Horizontal />
        </div>
        <div style={{ gridArea: "y", overflow: "hidden" }}>
          <Specviz.AxisContext.Vertical />
        </div>
        <div style={{ gridArea: "spec" }}>
          <Specviz.Visualization src={loaderData.sample.spectrogram} />
        </div>
      </Specviz.PlaneProvider>
    </div>
  )
}
