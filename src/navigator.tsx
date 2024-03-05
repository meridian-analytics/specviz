import { useCallback, useRef } from "react"
import { taxis } from "./axis.jsx"
import { useAnimationFrame, useMouse, useSpecviz, useWheel } from "./hooks.jsx"
import { magnitude } from "./vector2.jsx"
import { setPath } from "./svg.jsx"
import Playhead from "./playhead.jsx"
import Annotation from "./annotation.jsx"

const NOOP = () => {}

function Navigator(props: {
  src: string,
  xaxis: taxis,
  yaxis: taxis,
}) {
  const { src, xaxis, yaxis } = props
  const { regions, command, input, mouseup, mouseRect, scroll, zoom, toolState } = useSpecviz()
  const containerRef = useRef<SVGSVGElement>(null)
  const maskRef = useRef<SVGPathElement>(null)

  useAnimationFrame(useCallback(
    () => {
      setPath(maskRef.current!, `
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
      `)
    },
    []
  ))

  const onMouse = useMouse({
    onContextMenu: NOOP,
    onMouseDown: NOOP,
    onMouseEnter: NOOP,
    onMouseLeave: NOOP,
    onMouseMove: useCallback(
      (e) => {
        if (input.buttons & 1) {
          command.scroll(
            e.movementX / e.currentTarget.clientWidth * zoom.x,
            e.movementY / e.currentTarget.clientHeight * zoom.y
          )
        }
      },
      [command, toolState]
    ),
    onMouseUp: useCallback(
      (e) => {
        if (input.buttons & 1) {
          if (magnitude({x: mouseRect.width, y: mouseRect.height}) < .01) { // click
            switch (toolState) {
              case "annotate":
              case "select":
              case "pan":
                command.scrollTo({
                  x: mouseup.rel.x * zoom.x - 0.5,
                  y: mouseup.rel.y * zoom.y - 0.5
                })
                break
              case "zoom":
                command.resetView()
                break
            }
          }
        }
      },
      [command, toolState]
    ),
  })

  useWheel(containerRef, 1)

  return <div
    className={`navigator ${toolState}`}
  >
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
      {Array.from(regions.values(), region =>
        <Annotation
          key={region.id}
          region={region}
          xaxis={xaxis}
          yaxis={yaxis}
        />
      )}
      <path
        ref={maskRef}
        className="mask"
        d=""
      />
      <Playhead xaxis={xaxis} yaxis={yaxis} />
    </svg>
  </div>

}

export default Navigator
