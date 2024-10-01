# Basic Annotation

![resources/example-basic-annotation.webp](../../resources/example-basic-annotation.webp)

This example the demonstates how to add annotation capability to your application. Please read `example-basic-spectrogram` and `example-basic-audio` before continuing.

### Your App, Your Data

Specviz is 100% type-safe and extends this safety even to your application's domain-specific data. TypeScript is **not required** but it is highly recommended. Start by defining the type for your user data.

```ts
type UserData = {
  label?: Label
}

enum Label {
  Whale = "🐋",
  Shark = "🦈",
  Pufferfish = "🐡",
  Fish = "🐠",
}
```

To load initial annotations, use `Specviz.Note.RegionState<T>` with your `UserData` type.

```ts
export const loader = RRT.makeLoader(async () => {
  const regions: Specviz.Note.RegionState<UserData> = new Map(
    await fetch("./example-basic-annotation.json").then(r => r.json()),
  )
  ...
  return { regions, ... }
})
```

Specviz makes no assumptions about your application's data. To render your annotations, you will need to write a React component. Here we use `Specviz.Note.AnnotationProps<T>` with our `UserData` to type our component. Use the provided default properties in `props.svgProps` and supply any other text, shapes, or styles as needed.

```ts
function MyAnnotation(props: Specviz.Note.AnnotationProps<UserData>) {
  return (
    <svg {...props.svgProps} cursor="pointer">
      <rect
        fill={props.selected ? "chartreuse" : "violet"}
        fillOpacity="0.7"
        style={{ mixBlendMode: "hue" }}
      />
      <text
        x="8"
        y="8"
        children={props.region.properties?.label ?? "🤷🏽"}
        fontSize="30"
      />
    </svg>
  )
}
```

### Context Provider

Next we will setup our application's context to use our custom data. This is React Context 101.

```ts
type Context = {
  label: Label
  setLabel: (label: Label) => void
}

const defaultContext: Context = {
  label: Label.Whale,
  setLabel: () => {
    throw Error("setLabel not implemented")
  },
}

const Context = React.createContext(defaultContext)
```

In your application's provider, use `Specviz.Note.Provider` to supply the initial regions and annotation component to you application.

```tsx
function AppProvider(props: { children: React.ReactNode }) {
  const loaderData = RRT.useLoaderData<typeof loader>()
  const [label, setLabel] = React.useState(defaultContext.label)
  ...
  return (
    <Context.Provider value={{ label, setLabel }}>
      <...>
        <Specviz.Note.Provider
          initRegions={loaderData.regions}
          render={MyAnnotation}
        >
          {props.children}
        </Specviz.Note.Provider>
      </...>
    </Context.Provider>
  )
}
```

### Basic Controls

`Specviz.Note` and `Specviz.Audio` contain many useful functions. You can create your own buttons to bind them in whatever way will be useful for your application.

```tsx
function NoteControls() {
  const app = React.useContext(Context)
  const note = Specviz.Note.useContext()
  return (
    <>
      <button
        children="Clear Selection"
        disabled={note.selection.size == 0}
        onClick={() => note.setSelection(new Set())}
      />
      <button
        children="Delete"
        disabled={note.selection.size == 0}
        onClick={() => note.deleteSelection()}
      />
    </>
  )
}
```

Here we use `audio.state` to conditionally display a **Play** or **Stop** button.

```tsx
function AudioControls() {
  const app = React.useContext(Context)
  const audio = Specviz.Audio.useContext()
  return (
    <>
      <button
        children="Rewind 5s"
        onClick={() => audio.transport.seek(t => t - 5)}
        title="z"
      />
      {audio.state.pause ? (
        <button
          children="Play"
          onClick={() => audio.transport.play()}
          title="x"
        />
      ) : (
        <button
          children="Stop"
          onClick={() => audio.transport.stop()}
          title="x"
        />
      )}
      <button
        children="Forward 5s"
        onClick={() => audio.transport.seek(t => t + 5)}
        title="c"
      />
    </>
  )
}
```


### Specviz.Action

Specviz does not include default behaviors or keyboard shortcuts. Instead, your application will decide what tools are needed, and when they trigger a particular Specviz action.

We will expand our `Visualizer` used in `example-basic-audio` to add **annotate**, **select**, **move** and **seek**. actions. In general, use `Specviz.Action.Provider` to assign your actions to Specviz components.

```tsx
function Visualizer() {
  ...
  return (
    <...>
      <Specviz.Action.Provider
        onClick={select}
        onContextMenu={seek}
        onDrag={move}
        onRect={annotate}
      >
        <Specviz.Visualization .../>
      </Specviz.Action.Provider>
    </...>
  )
}
```

Let's start writing our `select`, `move` and `seek` actions now.

```tsx
function Visualizer() {
  const loaderData = RRT.useLoaderData<typeof loader>()
  const audio = Specviz.Audio.useContext()
  const note = Specviz.Note.useContext()
  const viewport = Specviz.Viewport.useContext()
  
  const select: Specviz.Action.Handler["onClick"] = React.useCallback(
    ({ unit, rel, abs, xaxis, yaxis, event }) => {
      note.selectPoint(abs, Specviz.Note.selectionMode(event))
    },
    [note.selectPoint],
  )

  const move: Specviz.Action.Handler["onDrag"] = React.useCallback(
    ({ dx, dy, event }) => {
      if (note.selection.size > 0)
        note.moveSelection(
          dx / viewport.state.zoom.x,
          dy / viewport.state.zoom.y,
        )
    },
    [note.moveSelection, note.selection, viewport.state.zoom],
  )

  const seek: Specviz.Action.Handler["onContextMenu"] = React.useCallback(
    ({ unit, rel, abs, xaxis, yaxis, event }) => {
      audio.transport.seek(unit.x)
    },
    [audio.transport.seek],
  )
  ...
}
```

To write the `annotate` action, we will insert our custom `label` found in our application context. The annotation's required `id` field can be generated using any generator or sequence.

```tsx
function Visualizer() {
  const app = React.useContext(Context)
  const note = Specviz.Note.useContext()
  ...
  const annotate: Specviz.Action.Handler["onRect"] = React.useCallback(
    ({ unit, rel, abs, xaxis, yaxis, event }) => {
      if (note.selection.size == 0)
        note.create({
          ...unit,
          id: crypto.randomUUID(),
          xunit: xaxis.unit,
          yunit: yaxis.unit,
          properties: { label: app.label },
        })
    },
    [app.label, note.create, note.selection],
  )
  ...
}
```

### Specviz.Note.useContext

Use `Specviz.Note.useContext<T>` with your `UserData` to access your note context.

```tsx
function AnnotationTable() {
  const note = Specviz.Note.useContext<UserData>()
  return (
    <table>
      <thead>
        <tr>
          <th />
          <th>Id</th>
          <th>Label</th>
          <th>Hz (min)</th>
          <th>Hz (max)</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        {Array.from(note.regions.values(), region => (
          ...
        ))}
      </tbody>
    </table>
  )
}
```

Use other functions like `note.setSelection` and `note.updateRegionProperties` to complete the table.

```tsx
function AnnotationTable() {
  const note = Specviz.Note.useContext<UserData>()
  return (
    <table>
      <thead>...</thead>
      <tbody>
        {Array.from(note.regions.values(), region => (
          <tr key={region.id}>
            <td>
              <input
                type="checkbox"
                checked={note.selection.has(region.id)}
                onChange={event =>
                  note.setSelection(prev => {
                    const next = new Set(prev)
                    if (event.target.checked) next.add(region.id)
                    else next.delete(region.id)
                    return next
                  })
                }
              />
            </td>
            <td>{region.id}</td>
            <td>
              <select
                value={region.properties?.label ?? "🤷🏽"}
                onChange={event =>
                  note.updateRegionProperties(region.id, p => ({
                    ...p,
                    label: event.target.value as Label,
                  }))
                }
                style={{ fontSize: "1rem" }}
              >
                <option value="🤷🏽" children="🤷🏽" />
                {Object.values(Label).map(label => (
                  <option key={label} value={label} children={label} />
                ))}
              </select>
            </td>
            <td>{Format.hz(region.y)}</td>
            <td>{Format.hz(region.y + region.height)}</td>
            <td>{Format.timestamp(region.width)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
```
