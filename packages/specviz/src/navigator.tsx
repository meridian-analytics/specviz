import * as R from "react"
import Annotation from "./annotation"
import * as Hooks from "./hooks"
import * as Plane from "./plane"
import Playhead from "./playhead"
import * as Region from "./region"
import * as Tool from "./tool"
import * as Viewport from "./viewport"

export type NavigatorProps = {
  ignoreRegionTransform?: boolean
  src: string
}

export default function Navigator(props: NavigatorProps) {
  const plane = Plane.useContext()
  const region = Region.useContext()
  const tool = Tool.useContext()
  const containerRef = R.useRef<SVGSVGElement>(null)
  const maskRef = R.useRef<SVGPathElement>(null)
  const viewport = Viewport.useContext()
  const onMouse = Hooks.useMouse(tool.actions)

  Hooks.useWheel(containerRef, 1)
  const dimensions = Hooks.useDimensions(containerRef)
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
    <div className={`navigator ${tool.tool}`}>
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
            <Annotation
              dimensions={dimensions}
              key={region.id}
              region={region}
              xaxis={plane.xaxis}
              yaxis={plane.yaxis}
            />
          ),
        )}
        <path ref={maskRef} className="mask" d={maskPath} />
        <Playhead />
      </svg>
    </div>
  )
}
