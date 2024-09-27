import * as Specviz from "@specviz/react"
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
      seconds: Specviz.AxisContext.time(0, loaderData.audioBuffer.duration),
      hertz: Specviz.AxisContext.frequency(20000, 0),
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
    <>
      <Visualizer />
      <AudioControls />
      <Specviz.AudioEffect />
    </>
  )
}

function AudioControls() {
  const audio = Specviz.useAudio()
  return (
    <div
      style={{
        marginTop: "1rem",
      }}
    >
      <button
        children="Rewind"
        onClick={_ => audio.transport.seek(0)}
        type="button"
      />
      <button
        children="Play"
        onClick={_ => audio.transport.play()}
        style={audio.state.pause ? {} : { color: "orchid" }}
        type="button"
      />
      <button
        children="Stop"
        onClick={_ => audio.transport.stop()}
        style={audio.state.pause ? { color: "orchid" } : {}}
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
