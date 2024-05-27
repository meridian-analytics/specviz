import * as R from "react"
import Annotation from "./annotation"
import * as Hooks from "./hooks"
import * as Input from "./input"
import * as Plane from "./plane"
import Playhead from "./playhead"
import * as Region from "./region"
import * as Tool from "./tool"
import * as Vector2 from "./vector2"
import * as Viewport from "./viewport"

const NOOP = () => {}

function Navigator(props: {
  src: string
}) {
  const plane = Plane.useContext()
  const { input, mouseup, mouseRect } = Input.useContext()
  const region = Region.useContext()
  const tool = Tool.useContext()
  const containerRef = R.useRef<SVGSVGElement>(null)
  const maskRef = R.useRef<SVGPathElement>(null)
  const viewport = Viewport.useContext()
  const onMouse = Hooks.useMouse({
    onContextMenu: NOOP,
    onMouseDown: NOOP,
    onMouseEnter: NOOP,
    onMouseLeave: NOOP,
    onMouseMove: R.useCallback(
      e => {
        if (input.buttons & 1) {
          viewport.scroll(
            (e.movementX / e.currentTarget.clientWidth) * viewport.state.zoom.x,
            (e.movementY / e.currentTarget.clientHeight) *
              viewport.state.zoom.y,
          )
        }
      },
      [input, viewport.scroll, viewport.state.zoom],
    ),
    onMouseUp: R.useCallback(
      e => {
        if (input.buttons & 1) {
          if (
            Vector2.magnitude({ x: mouseRect.width, y: mouseRect.height }) <
            0.01
          ) {
            // click
            switch (tool.tool) {
              case "annotate":
              case "select":
              case "pan":
                viewport.scrollTo({
                  x: mouseup.rel.x * viewport.state.zoom.x - 0.5,
                  y: mouseup.rel.y * viewport.state.zoom.y - 0.5,
                })
                break
              case "zoom":
                viewport.resetView()
                break
            }
          }
        }
      },
      [
        tool.tool,
        input,
        mouseRect,
        mouseup,
        viewport.resetView,
        viewport.scrollTo,
        viewport.state.zoom,
      ],
    ),
  })

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
        {Array.from(region.regions.values(), region => (
          <Annotation
            dimensions={dimensions}
            key={region.id}
            region={region}
            xaxis={plane.xaxis}
            yaxis={plane.yaxis}
          />
        ))}
        <path ref={maskRef} className="mask" d={maskPath} />
        <Playhead />
      </svg>
    </div>
  )
}

export default Navigator
