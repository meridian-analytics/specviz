# Basic Audio

This example demonstrates how to load and control playback of an audio file. 
Specviz expects a fully decoded audio buffer and a React loading pattern of 
your choice. The `AudioContext.load` helper is provided for convenience.
Below is a common `react-router-dom` example.

```tsx
import * as Specviz from "@specviz/react"
import * as ReactRouter from "react-router-dom"

const loader = async () => {
  return {
    audioBuffer: await Specviz.AudioContext.load("./audio.wav")
  }
}
```

`Specviz.AudioProvider` provides the audio buffer to the application.

```tsx
function AppProvider(props) {
  const { audioSample } = ReactRouter.useLoaderData()
  return (
    <Specviz.AudioProvider buffer={audioSample}>
      <...>
        {props.children}
      </...>
    </Specviz.AudioProvider>
  )
}
```

In your `App`, use the `Specviz.AudioEffect` component to play the audio.

```tsx
function App() {
  return (
    <>
      <Visualizer />
      <AudioControls />
      <... />
      <Specviz.AudioEffect />
    </>
  )
}
```

The `AudioContext` provides access to the audio state and transport controls.

```tsx
function AudioControls() {
  const audio = Specviz.useAudio()
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
