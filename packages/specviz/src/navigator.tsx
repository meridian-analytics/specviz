import * as R from "react"
import * as Action from "./action"
import * as Hooks from "./hooks"
import * as Note from "./note"
import Playhead from "./playhead"
import * as Viewport from "./viewport"

export type NavigatorProps = {
  children?: typeof Note.Annotation
  id?: string
  src: string
  svgProps?: React.SVGProps<SVGSVGElement>
}

export default function Navigator(props: NavigatorProps) {
  const action = Action.useContext()
  const note = Note.useContext()
  const ref = R.useRef<null | SVGSVGElement>(null)
  const maskRef = R.useRef<SVGPathElement>(null)
  const viewport = Viewport.useContext()
  const onMouse = Hooks.useMouse(action)
  const dimensions = Hooks.useDimensions(ref)
  Hooks.useWheel(ref, action.onWheel)
  const maskPath = `
    M 0 0
    h 1
    v 1
    h -1
    z
    M ${viewport.state.scroll.x / viewport.state.zoom.x} ${
      viewport.state.scroll.y / viewport.state.zoom.y
    }
    v ${1 / viewport.state.zoom.y}
    h ${1 / viewport.state.zoom.x}
    v ${-1 / viewport.state.zoom.y}
    z
  `
  return (
    <svg
      className="navigator"
      height="100%"
      width="100%"
      preserveAspectRatio="none"
      viewBox="0 0 1 1"
      {...onMouse}
      {...props.svgProps}
      ref={ref}
    >
      <image
        href={props.src}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      />
      {Array.from(note.regions.values(), region => (
        <Note.Annotation
          children={props.children}
          dimensions={dimensions}
          key={region.id}
          region={region}
          selected={note.selection.has(region.id)}
          viewerId={props.id}
        />
      ))}
      <path ref={maskRef} className="mask" d={maskPath} />
      <Playhead />
    </svg>
  )
}
