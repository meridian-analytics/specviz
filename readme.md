## <a name="top"></a> specviz-react

* [components](#components)
* [hooks](#hooks)
* [types](#types)
* [css styling](#css)
* [axis module](#axis)
* [format module](#format)
* [keybinds module](#keybinds)
* [default bindings](#default-bindings)
* [features roadmap](#roadmap)

### <a name="components"></a> components

**&lt;Specviz&gt;**

Context boundary for a single instance of specviz. All children have access to the shared context.

```ts
Specviz(props: {
  axes: Record<string, taxis>
  regions: Map<string, tregion>
  setRegions: Dispatch<SetStateAction<Map<string, tregion>>>
  children: ReactNode
})
```

```jsx
import { Specviz, useAxes, useRegionState } from "specviz-react"
import { linear, nonlinear } from "specviz-react/axis"
import * as F from "specviz-react/format"
import DATA from "savedata.json"

function MyComponent() {
  // define axes
  const axes = useAxes(() => ({
    seconds: linear(0, 60, "seconds", F.formatTimestamp),
    hertz: linear(20000, 0, "hertz", F.formatHz),
    // …
  }))

  // state for controlled component
  const [regions, setRegions] = useRegionState(DATA)

  // create specviz context
  return (
    <Specviz axes={axes} regions={regions} setRegions={setRegions}>
      <Navigator
        src="path/to/spectrogram.png"
        xaxis={axes.seconds}
        yaxis={axes.hertz}
      />
      <Visualization
        src="path/to/spectrogram.png"
        xaxis={axes.seconds}
        yaxis={axes.hertz}
      />
    </Specviz>
  )
}
```

**&lt;Audio&gt;**

Load audio into the Specviz context. Currently supports a single audio source. Loading additional sources will override the previous source.

```ts
Audio(props: {
  src: string,
  duration: number,
})
```

```jsx
<Specviz …>
  <Audio src="path/to/source.wav" duration={60} />
  …
</Specviz>
```

**&lt;Visualization&gt;**

Load visualization image and axes into the Specviz context. Annotation data, zoom, and pan position will be synchronized across multiple visualizations.

```ts
Visualization(props: {
  src: string,
  xaxis: taxis,
  yaxis: taxis,
})
```

```jsx
import { Specviz, useAxes, useRegionState } from "specviz-react"
import { linear } from "specviz-react/axis"
import * as F from "specviz-react/format"

function MyComponent() {
  const axes = useAxes(() => ({
    seconds: linear(0, 60, "seconds", F.formatTimestamp),
    hertz: linear(20000, 0, "hertz", F.formatHz),
    // …
  }))

  const [regions, setRegions] = useRegionState()

  return (
    <Specviz axes={axes} regions={regions} setRegions={setRegions}>
      <Visualization
        src="path/to/spectrogram.png"
        xaxis={axes.seconds}
        yaxis={axes.hertz}
      />
    </Specviz>
  )
}
```

**&lt;Navigator&gt;**

Load navigator image and axes into the Specviz context. Similar to Visualization but maintains an overview of the entire image and highlights the currently displayed region.

```ts
Navigator(props: {
  src: string,
  xaxis: taxis,
  yaxis: taxis,
})
```

```jsx
import { Specviz, useAxes, useRegionState } from "specviz-react"
import { linear } from "specviz-react/axis"
import * as F from "specviz-react/format"

function MyComponent() {
  const axes = useAxes(() => ({
    seconds: linear(0, 60, "seconds", F.formatTimestamp),
    hertz: linear(20000, 0, "hertz", F.formatHz),
    // …
  }))

  const [regions, setRegions] = useRegionState()

  return (
    <Specviz axes={axes} regions={regions} setRegions={setRegions}>
      <Navigator
        src="path/to/spectrogram.png"
        xaxis={axes.seconds}
        yaxis={axes.hertz}
      />
      <Visualization
        src="path/to/spectrogram.png"
        xaxis={axes.seconds}
        yaxis={axes.hertz}
      />
    </Specviz>
  )
}
```

**&lt;Encoder&gt;**

Generic component for precision adjustment of values using the mouse wheel.

```ts
Encoder(props: {
  state: number, // float 0 to 1
  setState: (nextState: number) => void, // state effect
  value: number, // unit value to display
  unit: string, // unit of measure
})
```

Region encoders are provided for convenience.

```ts
Encoder.X(props: tregion)
Encoder.X1(props: tregion)
Encoder.X2(props: tregion)
Encoder.Y(props: tregion)
Encoder.Y1(props: tregion)
Encoder.Y2(props: tregion)
```

```jsx
import { Encoder, useSpecviz } from "specviz-react"

function EditAnnotation({ annotation }) {
  const { command } = useSpecviz()
  return <div className="myform">
    <div className="encoders">
      <div><Encoder.X {...region} /> Offset</div>
      <div><Encoder.X2 {...region} /> Duration</div>
      <div><Encoder.Y1 {...region} /> LPF</div>
      <div><Encoder.Y2 {...region} /> HPF</div>
    </div>
  </div>
}
```

<small>[back to top](#top)</small>
### <a name="hooks"></a> hooks

**useAxes()**

```ts
useAxes(props: () => Record<string, taxis>, deps?: DependencyList)
  :Record<string, taxis>
```

```ts
import { useAxes } from "specviz-react"
```

**useRegionState()**

```ts
useRegionState(init?: Map<string, tregion> | (() => Map<string, tregion>))
  :[Map<string, tregion>, Dispatch<SetStateAction<Map<string, tregion>>>]
```

```ts
import { useRegionState } from "specviz-react"
```

**useSpecviz()**

Access the Specviz context from a child component.

```ts
useSpecviz(): SpecvizContext
```

```jsx
import { Specviz, useSpecviz } from "specviz-react"

function MyComponent(props) {
  const { … } = useSpecviz()
  return …
}
```

```jsx
<Specviz>
  <MyComponent />
  …
</Specviz>
```

<small>[back to top](#top)</small>
### <a name="types"></a> types

**context UNSTABLE API**

All state is available in the Specviz context however only select properties are recommended for users at this time.

```ts
type tcontext = {
  command: tcommand
  regions: Map<string, tregion>
  setRegions: Dispatch<SetStateAction<Map<string, tregion>>>
  toolState: ttoolstate
  transport: ttransport
  …
}
```

**command**

Interface for specviz commands.

```ts
type tcommand = {
  annotate: (rect: trect, unit: trect, xaxis: taxis, yaxis: taxis) => void,
  delete: () => void,
  deselect: () => void,
  moveSelection: (dx: number, dy: number) => void,
  resetView: () => void,
  scroll: (dx: number, dy: number) => void,
  scrollTo: (pt: tvector2) => void,
  selectArea: (rect: trect) => void,
  selectPoint: (pt: tvector2) => void,
  setRectX: (region: tregion, dx: number) => void,
  setRectX1: (region: tregion, dx: number) => void,
  setRectX2: (region: tregion, dx: number) => void,
  setRectY: (region: tregion, dy: number) => void,
  setRectY1: (region: tregion, dy: number) => void,
  setRectY2: (region: tregion, dy: number) => void,
  tool: (toolState: ttoolstate) => void,
  zoom: (dx: number, dy: number) => void,
  zoomArea: (rect: trect) => void,
  zoomPoint: (pt: tvector2) => void,
}
```

**transport**

Interface for audio transport controls. `loop` will replay a selected annotation until stopped.

```ts
type ttransport = {
  play: () => void,
  loop: (regionid: number) => void,
  stop: () => void,
  seek: (progress: number) => void, // float 0..1
}
```

**regions**

Regions capture the axes of the visualization they are created in. This is important because a time/frequency region can render on a spectrogram visualization, but must render differently on a time/amplitude waveform visualization. This interface specifies the minimum required fields, however any additional fields may be included.

```ts
interface tregion {
  id: string
  x: number
  y: number
  width: number
  height: number
  xunit: string
  yunit: string
}
```

**axis**

```ts
type taxisunit = "hertz" | "seconds" | "percent"

type taxisformat = (x: number) => string

type taxis = {
  unit: taxisunit,
  format: taxisformat,
  intervals: Array<[number, number]>,
}
```

**rect**

```ts
type trect = {
  x: number,
  y: number,
  width: number,
  height: number,
}
```

**vector2**

```ts
type tvector2 = {
  x: number,
  y: number,
}
```

<small>[back to top](#top)</small>
### <a name="css"></a> css styling

Specviz uses SVG components and all styling is done through CSS. See the [MDN: SVG and CSS guide](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_and_CSS) for information on the available properties.

The following selectors are available to apply styling to specific Specviz components. Reference the demo styles located in `public/index.css`.

```css
.annotation
.annotation-selected
.cursor-x
.cursor-y
.cursor-text
.encoder
.encoder-marker
.encoder-text
.mask
.navigator
.navigator.annotate
.navigator.select
.navigator.zoom
.navigator.pan
.playhead
.playhead-text
.selection
.visualization
.visualization.annotate
.visualization.select
.visualization.zoom
.visualization.pan
```

<small>[back to top](#top)</small>
### <a name="axis"></a> axis module

Axis module for creating axis contexts.

```ts
computeUnit(t: taxis, x: number): number

computeRect(tx: taxis, ty: taxis, r: trect): trect

formatUnit(t: taxis, x: number): string

linear(
  min: number,
  max: number,
  unit: taxisunit = "percent",
  format: taxisformat = String
): taxis

nonlinear(
  intervals: Array<[number, number]>,
  unit: taxisunit = "percent",
  format: taxisformat = String
): taxis
```

```js
import { linear, nonlinear, … } from "specviz-react/axis"
```

<small>[back to top](#top)</small>
### <a name="format"></a> format module

String formatters for numeric values.

```ts
formatHz(value: number): string

formatPercent(value: number): string

formatTimestamp(value: number): string
```

```js
import { formatHz, formatPercent, … } from "specviz-react/format"
```

<small>[back to top](#top)</small>
### <a name="keybinds"></a> keybinds module

Optional module for configuring simple keybinds to Specviz commands and transport controls.

```ts
Bindings(props: {
  children: ReactNode
})

Keypress(props: {
  bind: string,
  onKeyDown?: (e: KeyboardEvent) => void,
  onKeyUp?: (e: KeyboardEvent) => void,
})
```

```ts
import { Bindings, Keypress } from "specviz-react/keybinds"

function MyKeybinds() {
  const { command, transport } = useSpecviz()
  return <Bindings>
    <Keypress bind="Backspace" onKeyDown={command.delete} />
    <Keypress bind="Escape" onKeyDown={command.deselect} />
    <Keypress bind="ArrowLeft" onKeyDown={e => { e.preventDefault(); command.moveSelection(-.01, 0) }} />
    <Keypress bind="ArrowRight" onKeyDown={e => { e.preventDefault(); command.moveSelection(.01, 0) }} />
    <Keypress bind="ArrowUp" onKeyDown={e => { e.preventDefault(); command.moveSelection(0, -.03) }} />
    <Keypress bind="ArrowDown" onKeyDown={e => { e.preventDefault(); command.moveSelection(0, .03) }} />
    <Keypress bind="a" onKeyDown={() => command.tool("annotate")} />
    <Keypress bind="s" onKeyDown={() => command.tool("select")} />
    <Keypress bind="d" onKeyDown={() => command.tool("zoom")} />
    <Keypress bind="f" onKeyDown={() => command.tool("pan")} />
    <Keypress bind="z" onKeyDown={transport.play} />
    <Keypress bind="x" onKeyDown={transport.stop} />
  </Bindings>
}
```

<small>[back to top](#top)</small>
### <a name="default-bindings"></a> default HID bindings

Some actions are currently hard-coded and cannot be reconfigured through the keybinds module. 2-dimensional wheels and trackpads are natively supported. When a 1-dimensional wheel is available, combine with <kbd>shift</kbd> to access the other dimension.

|context|binding|action|
|--|--|--|
|visualizer|right click|seek|
|visualizer|wheel|pan|
|visualizer|<kbd>alt</kbd> + wheel|zoom|
||||
|navigator|left click|pan jump|
|navigator|wheel|pan|
|navigator|<kbd>alt</kbd> + wheel|zoom|

<small>[back to top](#top)</small>
### <a name="roadmap"></a> features roadmap

- [x] visualization: spectrogram
- [x] visualization: waveform
- [x] visualization: zoom
- [x] visualization: pan
- [x] visualization: sync zoom/pan
- [x] visualization: playhead
- [x] visualization: playhead timestamp on hover
- [ ] visualization: frequency/amplitude, time axes
- [ ] visualization: nonlinear freq axis
- [x] visualization: annotation rects
- [x] cursor: hold alt to render cursor
- [x] cursor: coordinate pair
- [x] cursor: nonlinear axes
- [x] cursor: 1-dimensional variant
- [x] audio: playback
- [x] audio: resume at playhead
- [x] audio: preserve playhead on unmount
- [x] audio: seek to location
- [ ] audio: multi-channel audio
- [x] annotation: create
- [x] annotation: playback region
- [x] annotation: playback frequency filter
- [x] annotation: drag selection preview
- [x] annotation: click to select
- [x] annotation: click-drag to select mulitple
- [x] annotation: ctrl-click to add/remove selection
- [x] annotation: 1-dimensional variant
- [x] annotation: click-drag to move
- [x] encoder: adjust annotation region
- [x] encoder: wheel to adjust
- [x] encoder: use axis context
- [x] tools: annotation tool
- [x] tools: selection tool
- [x] tools: zoom tool
- [x] tools: pan tool
- [x] navigator: show visible region
- [x] navigator: playhead
- [x] navigator: wheel to zoom
- [x] navigator: wheel to pan
- [x] navigator: click to jump
- [x] navigator: click + drag zoom to slection
- [x] navigator: annotation rects
- [x] bindings: keyboardevent
- [ ] bindings: mouseevent
- [ ] bindings: wheelevent
- [x] ux: 2-dimensional zoom
- [x] ux: declarative audio/visual loading
- [x] ux: zoom center on cursor
