import { useCallback, useRef } from "react"
import { useMouse, useSpecviz, useWheel } from "./specviz"
import { useAnimationFrame } from "./hooks"
import { magnitude } from "./vector2"
import Playhead from "./playhead"
import Annotation from "./annotation"

const NOOP = () => {}

function Navigator(props: {
  imageUrl: string,
}) {
  const { annotations, input, mouseup, mouseRect, scroll, zoom, toolState, transportState } = useSpecviz()
  const containerRef = useRef<SVGSVGElement>(null)
  const maskRef = useRef<SVGPathElement>(null)

  useAnimationFrame(useCallback(
    () => {
      maskRef.current!.setAttribute("d", `
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
    [maskRef, scroll, zoom]
  ))

  const onMouse = useMouse({
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
      [input, scroll, zoom, toolState]
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
      [input, mouseup, mouseRect, scroll, zoom, toolState]
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
        href={props.imageUrl}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      />
      {Array.from(annotations.values()).map(a =>
        <Annotation key={a.id} annotation={a}  />
      )}
      <path
        ref={maskRef}
        className="mask"
        d=""
      />
      <Playhead />
    </svg>
  </div>

}

export default Navigator
