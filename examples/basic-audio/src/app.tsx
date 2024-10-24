import * as Specviz from "@meridiancfi/specviz"
import * as React from "react"

type Props = {
  audio: string
  spectrogram: string
}

type Context = {
  spectrogram: string
}

export default function (props: Props) {
  return (
    <AppProvider {...props}>
      <App />
    </AppProvider>
  )
}

const Context = React.createContext<Context | null>(null)

function useContext() {
  const context = React.useContext(Context)
  if (context == null)
    throw Error("useContext must be called within a Provider")
  return context
}

function AppProvider(props: Props & { children: React.ReactNode }) {
  const [audioBuffer, setAudioBuffer] = React.useState<null | AudioBuffer>(null)
  const axes: Specviz.Axis.Context = React.useMemo(
    () => ({
      seconds: Specviz.Axis.time(0, audioBuffer?.duration ?? 60),
      hertz: Specviz.Axis.frequency(20000, 0),
    }),
    [audioBuffer],
  )
  React.useEffect(() => {
    Specviz.Audio.load(props.audio).then(setAudioBuffer)
  }, [props.audio])
  if (audioBuffer == null) return "Loading audio..."
  return (
    <Context.Provider value={{ spectrogram: props.spectrogram }}>
      <Specviz.Audio.Provider buffer={audioBuffer}>
        <Specviz.Axis.Provider children={props.children} value={axes} />
      </Specviz.Audio.Provider>
    </Context.Provider>
  )
}

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        margin: "1.5rem 0",
      }}
    >
      <Visualizer />
      <AudioControls />
      <Specviz.Audio.Effect />
    </div>
  )
}

function AudioControls() {
  const audio = Specviz.Audio.useContext()
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
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
  const app = useContext()
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
          <Specviz.Visualization src={app.spectrogram} />
        </div>
      </Specviz.Plane.Provider>
    </div>
  )
}
