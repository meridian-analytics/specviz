import { useCallback, useRef } from "react"
import { useSpecviz } from "./specviz"
import { useAnimationFrame, useClickRect, useWheel } from "./hooks"
import { magnitude } from "./vector2"
import { clamp } from "./mathx"
import Playhead from "./playhead"
import Annotation from "./annotation"

const RESOLUTION = 100

function Navigator(props: {
  height: number,
  imageUrl: string,
}) {
  const { height, imageUrl } = props
  const { annotations, scroll, zoom } = useSpecviz()
  const containerRef = useRef<HTMLDivElement>(null)
  const maskRef = useRef<SVGPathElement>(null)

  useAnimationFrame(useCallback(
    () => {
      const elem = maskRef.current!
      elem.setAttribute("d", `
        M 0 0
        h ${RESOLUTION}
        v ${RESOLUTION}
        h ${-RESOLUTION}
        z
        M ${scroll.x * RESOLUTION / zoom.x} ${scroll.y * RESOLUTION / zoom.y}
        v ${RESOLUTION / zoom.y}
        h ${RESOLUTION / zoom.x}
        v ${-RESOLUTION / zoom.y}
        z
      `)
    },
    [maskRef, scroll, zoom]
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
          scroll.x = -0.5 + rect.x * zoom.x
          scroll.y = -0.5 + rect.y * zoom.y
        }
        else { // drag
          zoom.x = 1 / rect.width
          zoom.y = 1 / rect.height
          scroll.x = -0.5 + (rect.x + rect.width / 2) * zoom.x
          scroll.y = -0.5 + (rect.y + rect.height / 2) * zoom.y
        }
      },
      [scroll, zoom]
    )
  })

  useWheel(
    containerRef,
    useCallback(
      (e: WheelEvent) => {
        e.preventDefault()
        const elem = e.currentTarget as HTMLDivElement
        const dx = e.deltaY / elem.clientHeight
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
    className="navigator"
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
  >
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${RESOLUTION} ${RESOLUTION}`}
      preserveAspectRatio="none"
    >
      <image
        href={imageUrl}
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
