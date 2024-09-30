import * as Specviz from "@meridian_cfi/specviz"
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
  const audioBuffer = await Specviz.Audio.load(sample.audio)
  return {
    sample,
    audioBuffer,
  }
})

function AppProvider(props: { children: React.ReactNode }) {
  const loaderData = RRT.useLoaderData<typeof loader>()
  const axes: Specviz.Axis.Context = React.useMemo(
    () => ({
      seconds: Specviz.Axis.time(0, loaderData.audioBuffer.duration),
      hertz: Specviz.Axis.frequency(20000, 0),
    }),
    [loaderData.audioBuffer.duration],
  )
  return (
    <Specviz.Audio.Provider buffer={loaderData.audioBuffer}>
      <Specviz.Axis.Provider children={props.children} value={axes} />
    </Specviz.Audio.Provider>
  )
}

function App() {
  return (
    <>
      <Visualizer />
      <AudioControls />
      <Specviz.Audio.Effect />
    </>
  )
}

function AudioControls() {
  const audio = Specviz.Audio.useContext()
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
      <Specviz.Plane.Provider xaxis="seconds" yaxis="hertz">
        <div style={{ gridArea: "x", overflow: "hidden" }}>
          <Specviz.Axis.Horizontal />
        </div>
        <div style={{ gridArea: "y", overflow: "hidden" }}>
          <Specviz.Axis.Vertical />
        </div>
        <div style={{ gridArea: "spec" }}>
          <Specviz.Visualization src={loaderData.sample.spectrogram} />
        </div>
      </Specviz.Plane.Provider>
    </div>
  )
}
