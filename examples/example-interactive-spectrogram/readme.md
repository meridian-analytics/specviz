# Interactive Spectrogram

This example demonstrates how to create an interactive visualization, allowing the user to zoom, pan, and jump to specific locations.

`Specviz.InputProvider` enables interaction and `Specviz.ViewportProvider` allows viewport state to be shared across components.

```tsx
function AppProvider(props) {
  const loaderData = RRT.useLoaderData<typeof loader>()
  const axes = ...
  return (
    <Specviz.AxisProvider value={axes}>
      <Specviz.InputProvider>
        <Specviz.ViewportProvider>
          <...>
            {props.children}
          </...>
        </Specviz.ViewportProvider>
      </Specviz.InputProvider>
    </Specviz.AxisProvider>
  )
}
```

Define the actions for your application.

```tsx
function App() {
  const viewport = Specviz.useViewport()
  const zoomX = ({ dx, dy, event }) => {
    viewport.zoomScroll(-dy, 0)
  }
  const zoomY = ({ dx, dy, event }) => {
    viewport.zoomScroll(0, -dy)
  }
  const pan = ({ dx, dy, event }) => {
    viewport.scroll(-dx, -dy)
  }
  ...
  return <... />
}
```

Assign actions to Specviz components using `Specviz.ActionProvider`.

```tsx
<Specviz.ActionProvider onWheel={zoomX}>
  <Specviz.AxisContext.Horizontal />
</Specviz.ActionProvider>

<Specviz.ActionProvider onWheel={zoomY}>
  <Specviz.AxisContext.Vertical />
</Specviz.ActionProvider>

<Specviz.ActionProvider onDrag={pan}>
  <Specviz.Visualization src={...} />
</Specviz.ActionProvider>
```
