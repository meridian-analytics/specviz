import { useCallback, useRef } from "react"
import { useAnimationFrame, useClickRect, useWheel } from "./hooks"
import { useSpecviz } from "./specviz"
import { magnitude } from "./vector2"
import { percent } from "./mathx"
import { randomBytes } from "./stringx"
import Playhead from "./playhead"
import Annotation from "./annotation"
import { normalize, trect } from "./rect"

function Visualization(props: {
  height: number,
  imageUrl: string,
}) {
  const { height, imageUrl } = props
  const { annotations, duration, mouse, scroll, zoom, toolState, transport, transportState, setAnnotations } = useSpecviz()
  const containerRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<SVGSVGElement>(null)
  const selectionRef = useRef<SVGRectElement>(null)

  useAnimationFrame(useCallback(
    () => {
      const elem = layerRef.current!
      const selection = selectionRef.current!
      let rect: trect
      elem.setAttribute("x", percent(-scroll.x))
      elem.setAttribute("y", percent(-scroll.y))
      elem.setAttribute("width", percent(zoom.x))
      elem.setAttribute("height", percent(zoom.y))
      if (mouse.buttons & 1) {
        rect = normalize({ x: mouse.x, y: mouse.y, width: mouse.width, height: mouse.height })
        selection.setAttribute("display", "inline")
        selection.setAttribute("x", percent(rect.x))
        selection.setAttribute("y", percent(rect.y))
        selection.setAttribute("width", percent(rect.width))
        selection.setAttribute("height", percent(rect.height))
      }
      else {
        selection.setAttribute("display", "none")
      }
    },
    [layerRef, selectionRef, scroll, zoom]
  ))

  const { onMouseDown, onMouseMove, onMouseUp, onMouseLeave, onContextMenu } = useClickRect({
    onContextMenu: useCallback(
      (e, pt) => {
        e.preventDefault() // disable context menu
      },
      []
    ),
    onMouseDown: useCallback(
      (e, pt) => {
        e.preventDefault() // disable native drag
        mouse.buttons = e.buttons
        mouse.x = (scroll.x + pt.x) / zoom.x
        mouse.y = (scroll.y + pt.y) / zoom.y
        mouse.width = 0
        mouse.height = 0
      },
      [mouse, toolState]
    ),
    onMouseMove: useCallback(
      (e, pt) => {
        if (mouse.buttons & 1) {
          mouse.width = (scroll.x + pt.x) / zoom.x - mouse.x
          mouse.height = (scroll.y + pt.y) / zoom.y - mouse.y
          switch (toolState) {
            case "annotate":
            case "select":
            case "zoom":
              break
            case "pan":
              scroll.x -= e.movementX / e.currentTarget.clientWidth
              scroll.y -= e.movementY / e.currentTarget.clientHeight
              break
          }
        }
        else {
          mouse.x = (scroll.x + pt.x) / zoom.x
          mouse.y = (scroll.y + pt.y) / zoom.y
        }
      },
      [mouse, toolState]
    ),
    onMouseUp: useCallback(
      (e, rect) => {
        if (!(mouse.buttons & 1)) return
        mouse.buttons = 0
        if (magnitude({x: rect.width, y: rect.height}) < .01) { // click
          switch (toolState) {
            case "annotate":
            case "pan":
              transport.seek(duration * (scroll.x + rect.x) / zoom.x)
              break
            case "zoom":
              // todo: increment/decrement zoom
              zoom.x += 0.5
              zoom.y += 0.5
              scroll.x += 0.5 * rect.x
              scroll.y += 0.5 * rect.y
              break
            case "select":
              // todo: select annotation
              break
          }
        }
        else { // drag
          const selection = normalize({
            x: mouse.x,
            y: mouse.y,
            width: mouse.width,
            height: mouse.height,
          })
          switch (toolState) {
            case "annotate":
              const id = randomBytes(10)
              setAnnotations(a =>
                new Map(a).set(id, {
                  id,
                  rect: selection,
                  data: {},
                })
              )
              break
            case "select":
              // todo: select annotations
              break
            case "zoom":
              zoom.x = 1 / selection.width
              zoom.y = 1 / selection.height
              scroll.x = -0.5 + (selection.x + selection.width / 2) * zoom.x
              scroll.y = -0.5 + (selection.y + selection.height / 2) * zoom.y
              break
            case "pan":
              scroll.x -= e.movementX / e.currentTarget.clientWidth
              scroll.y -= e.movementY / e.currentTarget.clientHeight
              break
          }
        }
      },
      [mouse, scroll, zoom, toolState, transport, duration]
    ),
    onMouseLeave: useCallback(
      (e, pt) => {
        mouse.buttons = 0
      },
      [mouse, toolState]
    ),
  })

  useWheel(
    containerRef,
    useCallback(
      (e) => {
        e.preventDefault()
        const elem = e.currentTarget as HTMLDivElement
        const dx = e.deltaX / elem.clientWidth
        const dy = e.deltaY / elem.clientHeight
        if (e.altKey) {
          const mx = (mouse.x * zoom.x) - scroll.x
          const my = (mouse.y * zoom.y) - scroll.y
          const zx = zoom.x
          const zy = zoom.y
          zoom.x = zoom.x - dx
          zoom.y = zoom.y - dy
          if (zoom.x != zx) scroll.x = scroll.x - dx * mx
          if (zoom.y != zy) scroll.y = scroll.y - dy * my
        }
        else {
          scroll.x = scroll.x + dx
          scroll.y = scroll.y + dy
        }
      },
      [mouse, scroll, zoom]
    )
  )

  return <div
    ref={containerRef}
    style={{height}}
    className={`visualization ${toolState} ${transportState.type}`}
    onMouseDown={onMouseDown}
    onMouseMove={onMouseMove}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseLeave}
    onContextMenu={onContextMenu}
  >
    <svg
      width="100%"
      height="100%"
    >
      <svg
        ref={layerRef}
        x={0}
        y={0}
        width="100%"
        height="100%"
      >
        <image
          preserveAspectRatio="none"
          href={imageUrl}
          width="100%"
          height="100%"
        />
        {Array.from(annotations.values()).map(a =>
          <Annotation key={a.id} annotation={a} />
        )}
        <rect
          ref={selectionRef}
          className="selection"
          x={0}
          y={0}
          width={0}
          height={0}
          rx="3"
        />
        <Playhead />
      </svg>
    </svg>
  </div>
}

export default Visualization
