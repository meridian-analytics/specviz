# Basic Spectrogram

This example demonstrates how to render an image and axes.

In your application provider, use `Specviz.AxisProvider` to provide the axes.

```tsx
import * as Specviz from "@specviz/react"

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

To create the axes, `AxisContext.time` and `AxisContext.frequency` are
used. To create a custom axis, use `AxisContext.linear` and `AxisContext.nonlinear`.

```tsx
function AppProvider(props) {
  const axes = React.useMemo(
    () => ({
      seconds: Specviz.AxisContext.time(0, 60),
      hertz: Specviz.AxisContext.frequency(20000, 0),
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
