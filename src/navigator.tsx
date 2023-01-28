import { useCallback, useRef } from "react"
import { useClickRect, useSpecviz, useWheel } from "./specviz"
import { useAnimationFrame } from "./hooks"
import { magnitude } from "./vector2"
import Playhead from "./playhead"
import Annotation from "./annotation"

const NOOP = () => {}

function Navigator(props: {
  imageUrl: string,
}) {
  const { annotations, input, mouseup, scroll, zoom, toolState, transportState } = useSpecviz()
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

  const {onMouseDown, onMouseMove, onMouseUp, onMouseLeave, onContextMenu} = useClickRect({
    onContextMenu: NOOP,
    onMouseDown: NOOP,
    onMouseLeave: NOOP,
    onMouseMove: useCallback(
      (e, rect) => {
        if (input.buttons & 1) {
          switch (toolState) {
            case "annotate":
            case "select":
              // noop
              break
            case "pan":
              scroll.x += e.movementX / e.currentTarget.clientWidth * zoom.x
              scroll.y += e.movementY / e.currentTarget.clientHeight * zoom.y
              break
            case "zoom":
              break
          }
        }
      },
      [input, scroll, zoom, toolState]
    ),
    onMouseUp: useCallback(
      (e, rect) => {
        if (input.buttons & 1) {
          if (magnitude({x: rect.width, y: rect.height}) < .01) { // click
            switch (toolState) {
              case "annotate":
              case "select":
              case "pan":
                scroll.x = mouseup.x * zoom.x - 0.5
                scroll.y = mouseup.y * zoom.y - 0.5
                break
              case "zoom":
                zoom.x = 1
                zoom.y = 1
                scroll.x = 0
                scroll.y = 0
                break
            }
          }
          else { // drag
            switch (toolState) {
              case "annotate":
              case "select":
              case "pan":
                break
              case "zoom":
                zoom.x = 1 / rect.width
                zoom.y = 1 / rect.height
                scroll.x = -0.5 + (rect.x + rect.width / 2) * zoom.x
                scroll.y = -0.5 + (rect.y + rect.height / 2) * zoom.y
                break
            }
          }
        }
      },
      [input, mouseup, scroll, zoom, toolState]
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
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onContextMenu={onContextMenu}
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
