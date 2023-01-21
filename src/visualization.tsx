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
  const { annotations, duration, mouse, scroll, zoom, transport, setAnnotations } = useSpecviz()
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
      if (mouse.lmb) {
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

  const { onMouseDown, onMouseMove, onMouseUp, onMouseLeave } = useClickRect({
    onMouseDown: useCallback(
      (e, pt) => {
        e.preventDefault()
        mouse.lmb = true
        mouse.x = (scroll.x + pt.x) / zoom.x
        mouse.y = (scroll.y + pt.y) / zoom.y
        mouse.width = 0
        mouse.height = 0
      },
      []
    ),
    onMouseMove: useCallback(
      (e, pt) => {
        if (mouse.lmb) {
          mouse.width = (scroll.x + pt.x) / zoom.x - mouse.x
          mouse.height = (scroll.y + pt.y) / zoom.y - mouse.y
        }
        else {
          mouse.x = (scroll.x + pt.x) / zoom.x
          mouse.y = (scroll.y + pt.y) / zoom.y
        }
      },
      []
    ),
    onMouseUp: useCallback(
      (e, rect) => {
        if (!mouse.lmb) return
        mouse.lmb = false
        if (magnitude({x: mouse.width, y: mouse.height}) < .01) { // click
          const progress = (scroll.x + mouse.x) / zoom.x
          transport.seek(progress * duration)
        }
        else { // drag
          const id = randomBytes(10)
          setAnnotations(a =>
            new Map(a).set(id, {
              id,
              rect: normalize({
                x: mouse.x,
                y: mouse.y,
                width: mouse.width,
                height: mouse.height,
              }),
              data: {},
            })
          )
        }

      },
      [scroll, zoom, transport, duration, setAnnotations]
    ),
    onMouseLeave: useCallback(
      (e, pt) => {
        mouse.lmb = false
      },
      []
    ),
  })

  useWheel(
    containerRef,
    useCallback(
      e => {
        e.preventDefault()
        const elem = e.currentTarget as HTMLDivElement
        const dx = e.deltaX / elem.clientWidth
        const dy = e.deltaY / elem.clientHeight
        if (e.altKey) {
          const zx = zoom.x
          const zy = zoom.y
          zoom.x = zoom.x - dx * 2
          zoom.y = zoom.y - dy * 2
          if (zoom.x != zx) scroll.x = scroll.x - dx
          if (zoom.y != zy) scroll.y = scroll.y - dy
        }
        else {
          scroll.x = scroll.x - dx
          scroll.y = scroll.y - dy
        }
      },
      [scroll, zoom]
    )
  )

  return <div
    ref={containerRef}
    style={{height}}
    className="visualization"
    onMouseDown={onMouseDown}
    onMouseMove={onMouseMove}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseLeave}
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
