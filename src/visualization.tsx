import { useCallback, useRef } from "react"
import { useAnimationFrame, useClickDelta, useWheel } from "./hooks"
import { useSpecviz } from "./specviz"
import { magnitude } from "./vector2"
import Playhead from "./playhead"
import { percent } from "./mathx"

function Visualization(props: {
  height: number,
  imageUrl: string,
  duration: number,
}) {
  const { height, imageUrl, duration } = props
  const { scrollZoom, transport, setScrollZoom } = useSpecviz()
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

  useClickDelta(
    containerRef,
    useCallback(
      (e, pt, delta) => {
        if (magnitude(delta) > 5) {
          // drag: create annotation
        }
        else {
          const state = scrollZoom.current!
          const elem = e.currentTarget as HTMLDivElement
          const progress = (state.x + pt.x / elem.clientWidth) / state.z
          transport.seek(progress * duration)
        }
      },
      [transport, scrollZoom, duration]
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
        <Playhead duration={duration} />
      </svg>
    </svg>
  </div>
}

export default Visualization
