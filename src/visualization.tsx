import { useCallback, useRef } from "react"
import { useAnimationFrame, useClickDelta, useClickRect, useWheel } from "./hooks"
import { useSpecviz } from "./specviz"
import { magnitude } from "./vector2"
import Playhead from "./playhead"
import { percent } from "./mathx"
import { randomBytes } from "./stringx"
import Annotation from "./annotation"

function Visualization(props: {
  height: number,
  imageUrl: string
}) {
  const { height, imageUrl } = props
  const { annotations, duration, scrollZoom, transport, setAnnotations, setScrollZoom } = useSpecviz()
  const containerRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<SVGSVGElement>(null)

  useAnimationFrame(useCallback(
    () => {
      const { x, y, z } = scrollZoom.current!
      const elem = layerRef.current!
      elem.setAttribute("x", percent(-x))
      elem.setAttribute("y", percent(-y))
      elem.setAttribute("width", percent(z))
      elem.setAttribute("height", percent(z))
    },
    [layerRef, scrollZoom, setScrollZoom]
  ))

  const {onMouseDown, onMouseUp} = useClickRect(
    useCallback(
      (e, origin) => {
        console.log("mousedown", origin)
      },
      []
    ),
    useCallback(
      (e, rect) => {
        const state = scrollZoom.current!
        // click
        if (magnitude({x: rect.width, y: rect.height}) < .01) {
          const progress = (state.x + rect.x) / state.z
          transport.seek(progress * duration)
        }
        // drag
        else {
          const id = randomBytes(10)
          setAnnotations(a =>
            new Map(a).set(id, {
              id,
              rect: {
                x: (state.x + rect.x) / state.z,
                y: (state.y + rect.y) / state.z,
                width: rect.width / state.z,
                height: rect.height / state.z,
              },
              data: {},
            })
          )
        }

      },
      [scrollZoom, transport, duration, setAnnotations]
    )
  )

  useWheel(
    containerRef,
    useCallback(
      e => {
        e.preventDefault()
        const elem = e.currentTarget as HTMLDivElement
        setScrollZoom(state => {
          if (e.altKey)
            return { x: state.x, y: state.y, z: state.z - e.deltaY / 300 }
          else
            return { x: state.x + e.deltaX / elem.clientWidth, y: state.y + e.deltaY / elem.clientHeight, z: state.z }
        })
      },
      [setScrollZoom]
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
