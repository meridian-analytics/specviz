import * as R from "react"
import * as Action from "./action"
import Annotation from "./annotation"
import * as Hooks from "./hooks"
import Playhead from "./playhead"
import * as Region from "./region"
import * as Viewport from "./viewport"

export type NavigatorProps = {
  ignoreRegionTransform?: boolean
  src: string
}

export default function Navigator(props: NavigatorProps) {
  const region = Region.useContext()
  const action = Action.useContext()
  const containerRef = R.useRef<SVGSVGElement>(null)
  const maskRef = R.useRef<SVGPathElement>(null)
  const viewport = Viewport.useContext()
  const onMouse = Hooks.useMouse(action)
  const dimensions = Hooks.useDimensions(containerRef)
  Hooks.useWheel({ ref: containerRef, onWheel: action.onWheel })
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
      ref={containerRef}
      width="100%"
      height="100%"
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      {...onMouse}
    >
      <image
        href={props.src}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      />
      {Array.from(
        (props.ignoreRegionTransform
          ? region.regions
          : region.transformedRegions
        ).values(),
        region => (
          <Annotation dimensions={dimensions} key={region.id} region={region} />
        ),
      )}
      <path ref={maskRef} className="mask" d={maskPath} />
      <Playhead />
    </svg>
  )
}
