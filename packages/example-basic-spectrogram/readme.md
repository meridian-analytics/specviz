# Basic Spectrogram

This example demonstrates how to render an image and axes.

In your application provider, use `Specviz.AxisProvider` to provide the axes.

```tsx
import * as Specviz from "specviz-react"
import * as Format from "specviz-react/format"

function AppProvider(props) {
  const axes = React.useMemo(
    () => ({
      seconds: ...
      hertz: ...
      decibels: ...
      myaxis: ...
    }),
    [],
  )
  return (
    <Specviz.AxisProvider value={axes}>
      <...>
        {props.children}
      </...>
    </Specviz.AxisProvider>
  )
}
```

To create the axes, `AxisContext.linear` and `AxisContext.nonlinear` are
provided. The `Format` module contains common formatting functions.

```tsx
function AppProvider(props) {
  const axes = React.useMemo(
    () => ({
      seconds: Specviz.AxisContext.linear(0, 60, "seconds", Format.timestamp),
      hertz: Specviz.AxisContext.linear(20000, 0, "hertz", Format.hz),
    }),
    [],
  )
  return ...
}
```

Finally, use the `Specviz.PlaneProvider` to designate particular axes to the
visualization.

```tsx
function App() {
  return (
    <Specviz.PlaneProvider xaxis="seconds" yaxis="hertz">
      <div>
        <Specviz.AxisContext.Horizontal />
      </div>
      <div>
        <Specviz.AxisContext.Vertical />
      </div>
      <div>
        <Specviz.Visualization src="./spectrogram.png" />
      </div>
    </Specviz.PlaneProvider>
  )
}
```