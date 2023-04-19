## <a name="top"></a> specviz-react

* [components](#components)
* [hooks](#hooks)
* [types](#types)
* [css styling](#css)
* [axis module](#axis)
* [format module](#format)
* [keybinds module](#keybinds)
* [data serialization](#serialization)
* [default bindings](#default-bindings)
* [features roadmap](#roadmap)

### <a name="components"></a> components

**&lt;Specviz&gt;**

Context boundary for a single instance of specviz. All children have access to the shared context.

```ts
Specviz(props: {
  initAnnotations?: Map<string, tannotation>,
  children: ReactNode,
})
```

```jsx
<Specviz>
  …
</Specviz>
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
<Specviz>
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
import { Specviz, Visualization } from "specviz-react"
import { linear } from "specviz-react/axis"
import { formatHz, formatTimestamp } from "specviz-react/format"

const xaxis = linear(0, 60, "seconds", formatTimestamp)
const yaxis = linear(20000, 0, "hertz", formatHz)

<Specviz>
  <Visualization
    src="path/to/spectrogram.png"
    xaxis={xaxis}
    yaxis={yaxis}
  />
  …
</Specviz>
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
import { Specviz, Navigator, Visualization } from "specviz-react"
import { linear } from "specviz-react/axis"
import { formatHz, formatTimestamp } from "specviz-react/format"

const xaxis = linear(0, 60, "seconds", formatTimestamp)
const yaxis = linear(20000, 0, "hertz", formatHz)

<Specviz>
  <Navigator
    src="path/to/spectrogram.png"
    xaxis={xaxis}
    yaxis={yaxis}
  />
  <Visualization
    src="path/to/spectrogram.png"
    xaxis={xaxis}
    yaxis={yaxis}
  />
  …
</Specviz>
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

```jsx
import { Encoder, useSpecviz } from "specviz-react"

function EditAnnotation({ annotation }) {
  const { command } = useSpecviz()
  return <div className="myform">
    <div className="encoders">
      <div>
        <Encoder
          state={annotation.rect.x}
          setState={v => command.setRectX(annotation, v)}
          value={annotation.unit.x}
          unit={annotation.xaxis.unit}
        />
        Offset
      </div>
      …
    </div>
  </div>
}
```

<small>[back to top](#top)</small>
### <a name="hooks"></a> hooks

**useSpecviz()**

Access the Specviz context from a child component.

```ts
useSpecviz(): SpecvizContext
```

```jsx
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
  annotations: Map<string, tannotation>,
  command: tcommand,
  toolState: ttoolstate,
  transport: ttransport,
  setAnnotations: (func: tfunctional<Map<string, tannotation>>) => void,
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
  setRectX: (annotation: tannotation, dx: number) => void,
  setRectX1: (annotation: tannotation, dx: number) => void,
  setRectX2: (annotation: tannotation, dx: number) => void,
  setRectY: (annotation: tannotation, dy: number) => void,
  setRectY1: (annotation: tannotation, dy: number) => void,
  setRectY2: (annotation: tannotation, dy: number) => void,
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
  loop: (annotation: tannotation) => void,
  stop: () => void,
  seek: (progress: number) => void, // float 0..1
}
```

**annotation**

Specviz records annotation boundaries in a `rect` property in the range of (0,0) to (1,1). The `unit` property is the corresponding unit values as computed from the input axes. Annotations capture the axes of the visualization they are created in. This is important because a time/frequency annotation can render on a spectrogram visualization, but must render differently on a time/amplitude waveform visualization.

```ts
type tannotation = {
  id: string,
  rect: trect,
  unit: trect,
  xaxis: taxis,
  yaxis: taxis,
}
```

Here is an example annotation created from the `command.annotate` command. Note the (0,0) origin is located in the top-left of the visualization and navigator components -

```ts
{
  id: "9315126e8d674e0b42b7",
  rect: {
    x: .25,
    y: .25,
    width: .5,
    height: .5,
  },
  unit: {
    x: 15,
    y: 2500,
    width: 30,
    height: 10000,
  },
  xaxis: {
    unit: "seconds",
    intervals: [[0,0], [1,60]], // 0 - 60 seconds
    format: String
  },
  yaxis: {
    unit: "hertz",
    intervals: [[0, 20000], [1, 0]], // 0 - 20,000 hz
    format: String,
  }
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
### <a name="#serialization"></a> data serialization UNSTABLE API

To save annotations for later recall, use `serializeAnnotations`.

```jsx
function MyComponent() {
  const { annotations } = useSpecviz()
  function onSubmit(event) {
    event.preventDefault()
    const mydata = serializeAnnotations(annotations)
    console.log(JSON.stringify(mydata, null, 2))
  })
  return <form onSubmit={onSubmit}>
    …
  </form>
}
```

To be usable within Specviz, annotations need to be reinserted into an axis context. Use `deserializeAnnotations` to properly recall saved data.

```jsx
import { Specviz, deserializeAnnotations } from "specviz-react"
import { linear, nonlinear } from "specviz-react/axis"
import { formatHz, formatTimestamp, formatPercent } from "specviz-react/format"
import serialdata from "mydata.json"

const axisTime = linear(0, 44.416, "seconds", formatTimestamp)
const axisHertz = linear(20000, 0, "hertz", formatHz)
const amplitudeAxis = nonlinear([[0, 1], [.5, 0], [1, -1]], "percent", formatPercent)

const mydata = deserializeAnnotations(serialdata, new Map([
  ["seconds", axisTime],
  ["hertz", axisHertz],
  ["percent", amplitudeAxis],
]))

<Specviz initAnnotations={mydata}>
  …
</Specviz>
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
- [ ] bug: audio sometimes does not stop on unmount
- [ ] bug: y-axis encoders behave "inverted"
