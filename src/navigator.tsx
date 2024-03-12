import * as R from "react"
import Annotation from "./annotation"
import * as Axis from "./axis"
import * as Hooks from "./hooks"
import Playhead from "./playhead"
import * as Specviz from "./specviz"
import * as Svg from "./svg"
import * as Vector2 from "./vector2"

const NOOP = () => {}

function Navigator(props: {
  src: string
  xaxis: Axis.taxis
  yaxis: Axis.taxis
}) {
  const { src, xaxis, yaxis } = props
  const {
    regions,
    command,
    input,
    mouseup,
    mouseRect,
    scroll,
    zoom,
    toolState,
  } = Specviz.useContext()
  const containerRef = R.useRef<SVGSVGElement>(null)
  const maskRef = R.useRef<SVGPathElement>(null)

  Hooks.useAnimationFrame(
    R.useCallback(() => {
      if (maskRef.current) {
        Svg.setPath(
          maskRef.current,
          `
          M 0 0
          h 1
          v 1
          h -1
          z
          M ${scroll.x / zoom.x} ${scroll.y / zoom.y}
          v ${1 / zoom.y}
          h ${1 / zoom.x}
          v ${-1 / zoom.y}
          z
          `,
        )
      }
    }, [scroll, zoom]),
  )

  const onMouse = Hooks.useMouse({
    onContextMenu: NOOP,
    onMouseDown: NOOP,
    onMouseEnter: NOOP,
    onMouseLeave: NOOP,
    onMouseMove: R.useCallback(
      e => {
        if (input.buttons & 1) {
          command.scroll(
            (e.movementX / e.currentTarget.clientWidth) * zoom.x,
            (e.movementY / e.currentTarget.clientHeight) * zoom.y,
          )
        }
      },
      [command, input, zoom],
    ),
    onMouseUp: R.useCallback(
      e => {
        if (input.buttons & 1) {
          if (
            Vector2.magnitude({ x: mouseRect.width, y: mouseRect.height }) <
            0.01
          ) {
            // click
            switch (toolState) {
              case "annotate":
              case "select":
              case "pan":
                command.scrollTo({
                  x: mouseup.rel.x * zoom.x - 0.5,
                  y: mouseup.rel.y * zoom.y - 0.5,
                })
                break
              case "zoom":
                command.resetView()
                break
            }
          }
        }
      },
      [command, toolState, input, mouseRect, mouseup, zoom],
    ),
  })

  Hooks.useWheel(containerRef, 1)

  return (
    <div className={`navigator ${toolState}`}>
      <svg
        ref={containerRef}
        width="100%"
        height="100%"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        {...onMouse}
      >
        <image
          href={src}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        />
        {Array.from(regions.values(), region => (
          <Annotation
            key={region.id}
            region={region}
            xaxis={xaxis}
            yaxis={yaxis}
          />
        ))}
        <path ref={maskRef} className="mask" d="" />
        <Playhead xaxis={xaxis} yaxis={yaxis} />
      </svg>
    </div>
  )
}

export default Navigator
