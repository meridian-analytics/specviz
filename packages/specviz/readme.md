## <a name="top"></a> @meridian_cfi/specviz

* [modules](#modules)
  * [specviz](#specviz)
  * [action](#action)
  * [audio](#audio)
  * [axis](#axis)
  * [input](#input)
  * [note](#note)
  * [plane](#plane)
  * [viewport](#viewport)
* [css styling](#css)
* [utils](#utils)

## <a name="modules"></a> modules
### <a name="specviz"></a> specviz

This is the main entry point of the Specviz package. All submodules, components, contexts, hooks and types are accessible through this module. Jump to a submodule: [action](#action), [audio](#audio), [axis](#axis), [input](#input), [note](#note), [plane](#plane), [viewport](#viewport).

```ts
// submodules
module Action
module Audio
module Axis
module Input
module Note
module Plane
module Viewport

// components
function Encoder(props: EncoderProps): JSX.Element
function Navigator(props: NavigatorProps): JSX.Element
function Visualization(props: VisualizationProps): JSX.Element

// hooks
function useAnimationFrame(callback: (frameId: number) => void): void 

// constants
const version: string

// types
type EncoderProps = {
  state: number
  setState: (nextState: number) => void
  value: number
  unit: string
}

type NavigatorProps = {
  children?: (props: Note.AnnotationProps) => JSX.Element
  id?: string
  ignoreRegionTransform?: boolean
  src: string
}

type VisualizationProps = {
  children?: (props: Note.AnnotationProps) => JSX.Element
  id?: string
  ignoreRegionTransform?: boolean
  showSelection?: boolean
  src: string
}
```

<small>[back to top](#top)</small>
### <a name="action"></a> action

The action module is used to assign Specviz commands to various user actions. This module requires the use of an [input](#input) context. See the `interactive-png` demo for guidance.

```ts
function Provider(props: ProviderProps): JSX.Element

function useContext(): Context

type Handler = {
  onClick: (useMouseEvent: {
    unit: Vector2.Vector2
    rel: Vector2.Vector2
    abs: Vector2.Vector2
    xaxis: Axis.Axis
    yaxis: Axis.Axis
    event: React.MouseEvent
  }) => void
  onContextMenu: (useMouseEvent: {
    unit: Vector2.Vector2
    rel: Vector2.Vector2
    abs: Vector2.Vector2
    xaxis: Axis.Axis
    yaxis: Axis.Axis
    event: React.MouseEvent
  }) => void
  onDrag: (useMouseEvent: {
    unit: Rect.Rect
    rel: Rect.Rect
    abs: Rect.Rect
    xaxis: Axis.Axis
    yaxis: Axis.Axis
    event: React.MouseEvent
  }) => void
  onRect: UseMouseRectHandler(useMouseEvent: {
    dx: number
    dy: number
    event: React.MouseEvent
  }) => void
  onWheel: (useMouseEvent: {
    dx: number
    dy: number
    event: React.MouseEvent
  }) => void
}

type Context = UseMouseProps

type ProviderProps = Context & {
  children: React.ReactNode
}
```

<small>[back to top](#top)</small>
### <a name="audio"></a> audio

The audio module provides audio playback, transport controls, and an fx context for looping and bandpass frequency filters. See the `basic-audio` demo for guidance.

```ts
function Effect() : JSX.Element
function Provider(props: ProviderProps): JSX.Element
function Seek(props: SeekProps): JSX.Element
function TransformFx(props: TransformFxProps): JSX.Element

function load(url: string): Promise<AudioBuffer>
function useContext(): Context

type Context = {
  audioContext: AudioContext
  buffer: AudioBuffer
  fx: Fx
  hasAudio: boolean
  state: State
  transport: Transport
}

type Fx = {
  hpf?: number
  lpf?: number
  loop?: Loop
}

type Loop = [number, number]

type SeekProps = {
  format?: FormatFn
}

type State = {
  pause: boolean
  seek: number
  timecode: number
}

type Transport = {
  play: (seek?: number) => void
  stop: (seek?: number) => void
  seek: (seek: React.SetStateAction<number>) => void
  getSeek: (state: State) => number
}

type ProviderProps = {
  audioContext?: AudioContext
  buffer: AudioBuffer
  children: React.ReactNode
  fx?: Fx
}

type TransformFxProps = {
  children: React.ReactNode
  fn: (fx: Fx) => Fx
}
```

<small>[back to top](#top)</small>
### <a name="axis"></a> axis

The axis module supplies axes to the visualizers and are essential for almost all Specviz applications. See the `basic-png` demo for guidance.

```ts
const Provider: React.Provider<Context>

function Horizontal(props: AxisProps): JSX.Element
function Vertical(props: AxisProps): JSX.Element

function linear(
  min: number,
  max: number,
  unit?: string,
  format?: FormatFn,
): Axis

function nonlinear(
  intervals: Array<[number, number]>,
  unit?: string,
  format?: FormatFn,
): Axis

function time(
  min: number,
  max: number,
  unit = "seconds",
  format: FormatFn = Format.timestamp,
): Axis 

function frequency(
  min: number,
  max: number,
  unit = "hertz",
  format: FormatFn = Format.hz,
): Axis 

function percent(
  min: number,
  max: number,
  unit = "percent",
  format: FormatFn = Format.percent,
): Axis

function formatUnit(t: Axis, q: number): string
function useContext(): Context

type Axis = {
  unit: string
  format: FormatFn
  intervals: Array<[number, number]>
}

type AxisProps = {
  tickHeight?: number
  tickWidth?: number
}

type Context = Record<string, undefined | Axis>
```

<small>[back to top](#top)</small>
### <a name="input"></a> input

The input module is required to create interactive applications that rely on user input. See the `interative-png` demo for guidance.

```ts
function Provider(props: ProviderProps): JSX.Element

function useContext(): Context

type Context = {
  input: State
  mousedown: Coord.Coord
  mouseup: Coord.Coord
  unitDown: Vector2.Vector2
  unitUp: Vector2.Vector2
}

type ProviderProps = {
  children: React.ReactNode
}

type State = {
  alt: boolean
  buttons: number
  focus: null | (EventTarget & Element)
  xaxis: null | Axis.Axis
  yaxis: null | Axis.Axis
}
```

<small>[back to top](#top)</small>
### <a name="note"></a> note

The note module enables interactive annotations, selection, modification, and filtering. This module requires [axis](#axis), [input](#input), and [plane](#plane) contexts. See the `full` demo for guidance.

```ts
function Provider(props: ProviderProps): JSX.Element
function Transform(props: TransformProps): JSX.Element

function selectionMode(event: React.MouseEvent): SelectionMode
function useContext<T = Properties>(): Context<T>

enum SelectionMode {
  add = "add",
  invert = "invert",
  replace = "replace",
  subtract = "subtract",
}

type AnnotationProps<T = Properties> = {
  children?: (props: AnnotationProps<T>) => JSX.Element
  dimensions: Vector2.Vector2
  region: Region<T>
  selected?: boolean
  svgProps?: R.SVGProps<SVGSVGElement>
  viewerId?: string
}

type Context<T = Properties> = {
  canCreate: boolean
  regions: RegionState<T>
  selection: SelectionState
  transformedRegions: RegionState<T>
  transformedSelection: SelectionState
  canDelete: (region: Region<T>) => boolean
  canRead: (region: Region<T>) => boolean
  canUpdate: (region: Region<T>) => boolean
  create: (
    region: Region<T>,
    options?: {
      autoSelect?: boolean
    },
  ) => void
  deleteSelection: () => void
  deselect: () => void
  moveSelection: (dx: number, dy: number) => void
  render?: (props: AnnotationProps<T>) => JSX.Element
  selectArea: (rect: Rect.Rect, selectionMode?: SelectionMode) => void
  selectId: (id: string, selectionMode?: SelectionMode) => void
  selectPoint: (pt: Vector2.Vector2, selectionMode?: SelectionMode) => void
  setRectX: (region: Region<T>, dx: number) => void
  setRectX1: (region: Region<T>, dx: number) => void
  setRectX2: (region: Region<T>, dx: number) => void
  setRectY: (region: Region<T>, dy: number) => void
  setRectY1: (region: Region<T>, dy: number) => void
  setRectY2: (region: Region<T>, dy: number) => void
  setRegions: R.Dispatch<R.SetStateAction<RegionState<T>>>
  setSelection: R.Dispatch<R.SetStateAction<SelectionState>>
  updateRegion: (id: string, fn: R.SetStateAction<Region<T>>) => void
  updateRegionProperties: (
    id: string,
    fn: R.SetStateAction<undefined | T>,
  ) => void
  updateSelectedRegions: (fn: R.SetStateAction<Region<T>>) => void
}

type Properties = Record<string, unknown>

type ProviderProps = {
  canCreate?: Context["canCreate"]
  canDelete?: Context["canDelete"]
  canRead?: Context["canRead"]
  canUpdate?: Context["canUpdate"]
  children: React.ReactNode
  initRegions?: InitialState<Context["regions"]>
  initSelection?: InitialState<Context["selection"]>
  render?: Context["render"]
}

type Region<T = Properties> = {
  id: string
  x: number
  y: number
  width: number
  height: number
  xunit: string
  yunit: string
  properties?: T
}

type RegionState<T = Properties> = Map<Region["id"], Region<T>>

type SelectionState = Set<Region["id"]>

type TransformProps = {
  children: React.ReactNode
  fn: (regionState: RegionState) => RegionState
}
```

<small>[back to top](#top)</small>
### <a name="plane"></a> plane

The plane module designates particular axes to their respective visulizers and navigators. Use the [axis](#axis) context to declares all axes used in your application. See the `basic-png` demo for guidance.

```ts
function Provider(props: ProviderProps): JSX.Element

function useContext(): Context

type Context = {
  xaxis: Axis.Axis
  yaxis: Axis.Axis
}

type ProviderProps = {
  children: React.ReactNode
  xaxis: string
  yaxis: string
}
```

<small>[back to top](#top)</small>
### <a name="viewport"></a> viewport

The viewport module enables interactive zoom and pan of visualizers and axes. This module requires the use of an [input](#input) context. See the `interactive-png` demo for guidance.

```ts
function Provider(props: ProviderProps): JSX.Element
function Transform(props: TransformProps): JSX.Element

function useContext(): Context

enum ZoomDirection {
  in = "in",
  out = "out",
}

type Context = {
  state: State
  resetView: () => void
  scroll: (dx: number, dy: number) => void
  scrollTo: (scroll: Scroll) => void
  zoom: (dx: number, dy: number) => void
  zoomArea: (rect: Rect.Rect) => void
  zoomPoint: (point: Vector2.Vector2, zoomDirection?: ZoomDirection) => void
  zoomScroll: (dx: number, dy: number) => void
}

type ProviderProps = {
  children: React.ReactNode
}

type State = {
  scroll: Vector2.Vector2
  zoom: Vector2.Vector2
}

type TransformProps = {
  children: React.ReactNode
  fn: (state: State) => State
}
```

<small>[back to top](#top)</small>
## <a name="css"></a> css styling

Specviz uses SVG components and all styling is done through CSS. See the [MDN: SVG and CSS guide](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_and_CSS) for information on the available properties.

The following selectors are available to apply styling to specific Specviz components. Reference the demo styles located in `public/specviz.css`.

```css
.annotation
.annotation
.annotation-selected
.axis-tick
.axis-x
.axis-y
.cursor-x
.cursor-y
.cursor-text
.encoder
.encoder-marker
.encoder-text
.mask
.playhead
.selection
```

<small>[back to top](#top)</small>
## <a name="utils"></a> utils

### <a name="format"></a> format

String formatters for numeric values.

```ts
function formatHz(value: number): string
function formatPercent(value: number): string
function formatTimestamp(value: number): string
```

### <a name="keybinds"></a> keybinds

Optional module for configuring simple keybinds to Specviz commands and transport controls.

```ts
function Bindings(props: { children: ReactNode }): JSX.Element

function Keypress(props: {
  bind: string,
  onKeyDown?: (e: KeyboardEvent) => void,
  onKeyUp?: (e: KeyboardEvent) => void,
}): JSX.Element
```

<small>[back to top](#top)</small>
