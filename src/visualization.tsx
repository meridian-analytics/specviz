import type { tvector2 } from "./types"
import { useCallback, useRef } from "react"
import { useAnimationFrame, useClickDelta, useDimensions, useWheel } from "./hooks"
import { useSpecviz } from "./specviz"
import { magnitude } from "./vector2"
import Playhead from "./playhead"

function Visualization(props: {
  height: number,
  imageUrl: string,
  duration: number,
}) {
  const { height, imageUrl, duration } = props
  const { scrollZoom, transport, setScrollZoom } = useSpecviz()
  const containerRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<SVGSVGElement>(null)
  const dimensions = useDimensions(containerRef)

  const deriveTimeFromPoint = useCallback(
    (pt: tvector2) => {
      const state = scrollZoom.current!
      return (state.x + pt.x) / dimensions.x / state.z * duration
    },
    [scrollZoom, dimensions, duration]
  )

  useAnimationFrame(useCallback(
    () => {
      setScrollZoom(dimensions, state => state) // reclamp
      const elem = layerRef.current!
      const { x: width, y: height } = dimensions
      const { x: scrollX, y: scrollY, z: scrollZ } = scrollZoom.current!
      elem.setAttribute("x", String(-scrollX))
      elem.setAttribute("y", String(-scrollY))
      elem.setAttribute("width", String(width * scrollZ))
      elem.setAttribute("height", String(height * scrollZ))
    },
    [layerRef, dimensions, scrollZoom, setScrollZoom]
  ))

  useClickDelta(
    containerRef,
    useCallback(
      (pt, delta) => {
        if (magnitude(delta) > 5) {
          // drag: create annotation
        }
        else {
          transport.seek(deriveTimeFromPoint(pt))
        }
      },
      [transport, deriveTimeFromPoint]
    )
  )

  useWheel(
    containerRef,
    useCallback(
      e => {
        e.preventDefault()
        setScrollZoom(dimensions, state => {
          if (e.altKey)
            return { x: state.x, y: state.y, z: state.z - e.deltaY / 100 }
          else
            return { x: state.x + e.deltaX, y: state.y + e.deltaY, z: state.z }
        })
      },
      [setScrollZoom, dimensions]
    )
  )

  return <div
    ref={containerRef}
    style={{height}}
    className="visualization"
  >
    <svg
      width="100%"
      height="100%"
    >
      <svg
        ref={layerRef}
        x={0}
        y={0}
        width={dimensions.x * scrollZoom.current!.z}
        height={dimensions.y * scrollZoom.current!.z}
      >
        <image
          preserveAspectRatio="none"
          href={imageUrl}
          width="100%"
          height="100%"
        />
        <Playhead duration={duration} />
      </svg>
    </svg>
  </div>
}

export default Visualization
