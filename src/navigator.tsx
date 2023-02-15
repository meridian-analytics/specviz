import { taxis } from "./types"
import { useCallback, useRef } from "react"
import { useMouse, useSpecviz, useWheel } from "./specviz"
import { useAnimationFrame } from "./hooks"
import { magnitude } from "./vector2"
import Playhead from "./playhead"
import Annotation from "./annotation"
import { setPath } from "./svg"

const NOOP = () => {}

function Navigator(props: {
  imageUrl: string,
  xaxis: taxis,
  yaxis: taxis,
}) {
  const { imageUrl, xaxis, yaxis } = props
  const { annotations, input, mouseup, mouseRect, scroll, zoom, toolState, transportState } = useSpecviz()
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
    xaxis: null,
    yaxis: null,
    onContextMenu: NOOP,
    onMouseDown: NOOP,
    onMouseEnter: NOOP,
    onMouseLeave: NOOP,
    onMouseMove: useCallback(
      (e) => {
        if (input.buttons & 1) {
          scroll.x += e.movementX / e.currentTarget.clientWidth * zoom.x
          scroll.y += e.movementY / e.currentTarget.clientHeight * zoom.y
        }
      },
      [toolState]
    ),
    onMouseUp: useCallback(
      (e) => {
        if (input.buttons & 1) {
          if (magnitude({x: mouseRect.width, y: mouseRect.height}) < .01) { // click
            switch (toolState) {
              case "annotate":
              case "select":
              case "pan":
                scroll.x = mouseup.rel.x * zoom.x - 0.5
                scroll.y = mouseup.rel.y * zoom.y - 0.5
                break
              case "zoom":
                zoom.x = 1
                zoom.y = 1
                scroll.x = 0
                scroll.y = 0
                break
            }
          }
        }
      },
      [toolState]
    ),
  })

  useWheel(containerRef, 1)

  return <div
    className={`navigator ${toolState} ${transportState.type}`}
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
        href={imageUrl}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      />
      {Array.from(annotations.values()).map(a =>
        <Annotation
          key={a.id}
          annotation={a}
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
