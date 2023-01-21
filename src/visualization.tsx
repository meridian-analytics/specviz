import { useCallback, useRef } from "react"
import { useAnimationFrame, useClickRect, useWheel } from "./hooks"
import { useSpecviz } from "./specviz"
import { magnitude } from "./vector2"
import { percent } from "./mathx"
import { randomBytes } from "./stringx"
import Playhead from "./playhead"
import Annotation from "./annotation"

function Visualization(props: {
  height: number,
  imageUrl: string,
}) {
  const { height, imageUrl } = props
  const { annotations, duration, scroll, zoom, transport, setAnnotations } = useSpecviz()
  const containerRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<SVGSVGElement>(null)

  useAnimationFrame(useCallback(
    () => {
      const elem = layerRef.current!
      elem.setAttribute("x", percent(-scroll.x))
      elem.setAttribute("y", percent(-scroll.y))
      elem.setAttribute("width", percent(zoom.x))
      elem.setAttribute("height", percent(zoom.y))
    },
    [layerRef, scroll, zoom]
  ))

  const {onMouseDown, onMouseUp} = useClickRect({
    onMouseDown: useCallback(
      (e, origin) => {
        e.preventDefault()
      },
      []
    ),
    onMouseUp: useCallback(
      (e, rect) => {
        if (magnitude({x: rect.width, y: rect.height}) < .01) { // click
          const progress = (scroll.x + rect.x) / zoom.x
          transport.seek(progress * duration)
        }
        else { // drag
          const id = randomBytes(10)
          setAnnotations(a =>
            new Map(a).set(id, {
              id,
              rect: {
                x: (scroll.x + rect.x) / zoom.x,
                y: (scroll.y + rect.y) / zoom.y,
                width: rect.width / zoom.x,
                height: rect.height / zoom.y,
              },
              data: {},
            })
          )
        }

      },
      [scroll, zoom, transport, duration, setAnnotations]
    )
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
    onMouseUp={onMouseUp}
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
          <Annotation key={a.id} annotation={a}  />
        )}
        <Playhead />
      </svg>
    </svg>
  </div>
}

export default Visualization
