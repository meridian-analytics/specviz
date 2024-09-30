# Basic Audio

This example demonstrates how to load and control playback of an audio file. 
Specviz expects a fully decoded audio buffer and a React loading pattern of 
your choice. The `Audio.load` helper is provided for convenience.
Below is a common `react-router-dom` example.

```tsx
import * as Specviz from "@meridian_cfi/specviz"
import * as ReactRouter from "react-router-dom"

const loader = async () => {
  return {
    audioBuffer: await Specviz.Audio.load("./audio.wav")
  }
}
```

`Specviz.Audio.Provider` provides the audio buffer to the application.

```tsx
function AppProvider(props) {
  const { audioSample } = ReactRouter.useLoaderData()
  return (
    <Specviz.Audio.Provider buffer={audioSample}>
      <...>
        {props.children}
      </...>
    </Specviz.Audio.Provider>
  )
}
```

In your `App`, use the `Specviz.Audio.Effect` component to play the audio.

```tsx
function App() {
  return (
    <>
      <Visualizer />
      <AudioControls />
      <... />
      <Specviz.Audio.Effect />
    </>
  )
}
```

The `Audio` context provides access to the audio state and transport controls.

```tsx
function AudioControls() {
  const audio = Specviz.Audio.useContext()
  return (
    <>
      <button
        children="Rewind"
        onClick={_ => audio.transport.seek(0)}
      />
      <button
        children="Play"
        disabled={!audio.state.pause}
        onClick={_ => audio.transport.play()}
      />
      <button
        children="Stop"
        disabled={audio.state.pause}
        onClick={_ => audio.transport.stop()}
      />
      <... />
    </>
  )
}
```
