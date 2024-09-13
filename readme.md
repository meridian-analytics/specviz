## <a name="top"></a> specviz-react
* [example](#example)
* [intro](#intro)
* [modules](#modules)
  * [specviz](#specviz)
  * [action](#action)
  * [audio](#audio)
  * [axis](#axis)
  * [input](#input)
  * [plane](#plane)
  * [region](#region)
  * [viewport](#viewport)
* [css styling](#css)
* [utils](#utils)
* [dev](#dev)

## <a name="intro"></a> intro

todo: what is Specviz? 

<small>[back to top](#top)</small>
## <a name="example"></a> example

This repo contains an `example` package to demostrate various features and configurations of Specviz.

To run the examples, change to the package's directory, install the dependecies, and run the `dev` script.

```sh
> cd packages/example
> bun install
> bun dev
```

The example webserver will display the connection URL. In the default case, [http://localhost:5173](http://localhost:5173).

```none
VITE v4.5.2  ready in 205 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

<small>[back to top](#top)</small>
## <a name="modules"></a> modules
### <a name="specviz"></a> specviz

This is the main entry point of the Specviz package. All submodules, components, contexts, hooks and types are accessible through this module. Jump to a submodule: [action](#action), [audio](#audio), [axis](#axis), [input](#input), [plane](#plane), [region](#region), [viewport](#viewport).

```ts
// submodules
module ActionContext
module AudioContext
module AxisContext
module InputContext
module PlaneContext
module RegionContext
module ViewportContext

// components
function AudioEffect(): JSX.Element
function Encoder(props: EncoderProps): JSX.Element
function Navigator(props: NavigatorProps): JSX.Element
function Visualization(props: VisualizationProps): JSX.Element

// context providers
function ActionProvider(props: ActionContext.ProviderProps): JSX.Element
function AudioProvider(props: AudioContext.ProviderProps): JSX.Element
function AxisProvider(props: AxisContext.ProviderProps): JSX.Element
function InputProvider(props: InputContext.ProviderProps): JSX.Element
function PlaneProvider(props: PlaneContext.ProviderProps): JSX.Element
function RegionProvider(props: RegionContext.ProviderProps): JSX.Element
function ViewportProvider(props: ViewportContext.ProviderProps): JSX.Element

// hooks
function useAction(): ActionContext
function useAnimationFrame(callback: (frameId: number) => void): void 
function useAudio(): AudioContext
function useAxis(): AxisContext
function useInput(): InputContext
function usePlane(): PlaneContext
function useRegion(): RegionContext
function useViewport(): ViewportContext

// constants
const version: string

// types
type AnnotationProps = {
  children?: typeof Annotation
  region: Region.Region
  dimensions: Vector2
  selected?: boolean
}

type EncoderProps = {
  state: number
  setState: (nextState: number) => void
  value: number
  unit: string
}

type NavigatorProps = {
  ignoreRegionTransform?: boolean
  src: string
}

type Rect = {
  x: number,
  y: number,
  width: number,
  height: number,
}

type UseMouseClickHandler = (useMouseEvent: {
  unit: Vector2
  rel: Vector2
  abs: Vector2
  xaxis: Axis.Axis
  yaxis: Axis.Axis
  event: React.MouseEvent
}) => void

type UseMouseContextMenuHandler = (useMouseEvent: {
  unit: Vector2
  rel: Vector2
  abs: Vector2
  xaxis: Axis.Axis
  yaxis: Axis.Axis
  event: React.MouseEvent
}) => void

type UseMouseRectHandler = (useMouseEvent: {
  unit: Rect
  rel: Rect
  abs: Rect
  xaxis: Axis.Axis
  yaxis: Axis.Axis
  event: React.MouseEvent
}) => void

type UseMouseMoveHandler = (useMouseEvent: {
  dx: number
  dy: number
  event: React.MouseEvent
}) => void

type UseMouseWheelHandler = (useMouseEvent: {
  dx: number
  dy: number
  event: WheelEvent
}) => void

type UseMouseProps = {
  onClick?: UseMouseClickHandler
  onContextMenu?: UseMouseContextMenuHandler
  onDrag?: UseMouseMoveHandler
  onRect?: UseMouseRectHandler
  onWheel?: UseMouseWheelHandler
}

type VisualizationProps = {
  children?: typeof Annotation
  ignoreRegionTransform?: boolean
  showSelection?: boolean
  src: string
}

type Vector2 = {
  x: number,
  y: number,
}

// aliases
type Action = ActionContext.Action
type Axis = AxisContext.Axis
type Axes = AxisContext.Axes
type Region = Region.Region
type RegionState = Region.RegionState
type RegionValue = Region.RegionValue
type SelectionState = Region.SelectionState
type UserData = Region.UserData
type SelectionMode = Region.SelectionMode
type ZoomDirection = Viewport.ZoomDirection
```

<small>[back to top](#top)</small>
### <a name="action"></a> action

The action module is used to assign Specviz commands to various user actions. This module requires the use of an [input](#input) context. See the `interactive-png` demo for guidance.

```ts
function Provider(props: ProviderProps): JSX.Element

function useContext(): Context

type Action = Required<UseMouseProps>

type Context = UseMouseProps

type ProviderProps = Context & {
  children: React.ReactNode
}
```

<small>[back to top](#top)</small>
### <a name="audio"></a> audio

The audio module provides audio playback, transport controls, and an fx context looping and bandpass frequency filters. See the `basic-audio` demo for guidance.

```ts
function AudioEffect() : JSX.Element
function Provider(props: ProviderProps): JSX.Element
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

type State = {
  pause: boolean
  seek: number
  timecode: number
}

type Transport = {
  play: (seek?: number) => void
  stop: (seek?: number) => void
  seek: (seek: number) => void
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

function computeRect(tx: Axis, ty: Axis, rect: Rect): Rect
function computeRectInverse(tx: Axis, ty: Axis, rect: Rect): Rect
function computeUnit(t: Axis, q: number): number
function computeUnitInverse(t: Axis, q: number): number 
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

type Coord = {
  abs: Vector2
  rel: Vector2
}

type InputState = {
  alt: boolean
  buttons: number
  focus: null | (EventTarget & Element)
  xaxis: null | Axis.Axis
  yaxis: null | Axis.Axis
}

type Context = {
  input: InputState
  mousedown: Coord
  mouseup: Coord
  unitDown: Vector2
  unitUp: Vector2
}

type ProviderProps = {
  children: React.ReactNode
}
```

<small>[back to top](#top)</small>
### <a name="plane"></a> plane

The [axis](#axis) context declares all axes used in your application. The plane module designates particular axes to their respective visulizers and navigators. See the `basic-png` demo for guidance.

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
### <a name="region"></a> region

The region module enables interactive region annotations, selection, modification, and filtering. This module requires [axis](#axis), [input](#input), and [plane](#plane) contexts. See the `full` demo for guidance.

```ts
function Provider(props: ProviderProps): JSX.Element
function Transform(props: TransformProps): JSX.Element

function computeRectInverse(region: Region, axes: Axis.Context): Rect
function selectionMode(event: React.MouseEvent): SelectionMode
function transformFilter(fn: (region: Region) => boolean): TransformProps["fn"]
function useContext(): Context

enum SelectionMode {
  add = "add",
  invert = "invert",
  replace = "replace",
  subtract = "subtract",
}

type Context = {
  annotate: (
    rect: Rect,
    xaxis: Axis.Axis,
    yaxis: Axis.Axis,
    userData?: UserData,
    autoSelect?: boolean,
  ) => void
  canCreate: boolean
  canDelete: (region: Region) => boolean
  canRead: (region: Region) => boolean
  canUpdate: (region: Region) => boolean
  delete: () => void
  deselect: () => void
  moveSelection: (dx: number, dy: number) => void
  regions: RegionState
  selectArea: (rect: Rect, selectionMode?: SelectionMode) => void
  selection: SelectionState
  selectPoint: (pt: Vector2, selectionMode?: SelectionMode) => void
  selectId: (id: string, selectionMode?: SelectionMode) => void
  setRectX: (region: Region, dx: number) => void
  setRectX1: (region: Region, dx: number) => void
  setRectX2: (region: Region, dx: number) => void
  setRectY: (region: Region, dy: number) => void
  setRectY1: (region: Region, dy: number) => void
  setRectY2: (region: Region, dy: number) => void
  setRegions: React.Dispatch<React.SetStateAction<RegionState>>
  setSelection: React.Dispatch<React.SetStateAction<SelectionState>>
  transformedRegions: RegionState
  transformedSelection: SelectionState
  updateRegion: (id: string, region: Region) => void
  updateSelectedRegions: (fn: (region: Region) => Region) => void
}

type ProviderProps = {
  canCreate?: Context["canCreate"]
  canDelete?: Context["canDelete"]
  canRead?: Context["canRead"]
  canUpdate?: Context["canUpdate"]
  children: React.ReactNode
  initRegions?: InitialState<Context["regions"]>
  initSelection?: InitialState<Context["selection"]>
}

type Region = {
  id: string
  x: number
  y: number
  width: number
  height: number
  xunit: string
  yunit: string
} & UserData

type RegionState = Map<Region["id"], Region>

type RegionValue = boolean | number | string | string[]

type SelectionState = Set<Region["id"]>

type TransformProps = {
  children: React.ReactNode
  fn: (regionState: RegionState) => RegionState
}

type UserData = Record<string, RegionValue>
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
  zoomArea: (rect: Rect) => void
  zoomPoint: (point: Vector2, zoomDirection?: ZoomDirection) => void
  zoomScroll: (dx: number, dy: number) => void
}

type ProviderProps = {
  children: React.ReactNode
}

type State = {
  scroll: Vector2
  zoom: Vector2
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
## <a name="dev"></a> dev

See the [example](#example) section to start the development webserver.

Run linter and formatter.

```sh
> bun check
```

```
Checked 42 files in 15ms. No fixes needed.
```

Run typescript compiler for all packages.

```sh
> bun tsc
```

```none
@specviz/core tsc $ tsc
└─ Done in 728 ms
@specviz/format tsc $ tsc
└─ Done in 526 ms
@specviz/example tsc $ tsc
└─ Done in 927 ms
```

<small>[back to top](#top)</small>
