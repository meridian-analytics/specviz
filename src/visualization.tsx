import type { tvector2 } from "./types"
import { useCallback, useRef } from "react"
import { useAnimationFrame, useClickDelta, useDimensions, useWheel } from "./hooks"
import { useSpecviz } from "./specviz"
import { magnitude } from "./vector2"

function Visualization(props: {
  height: number,
  imageUrl: string,
  duration: number,
}) {
  const { height, imageUrl, duration } = props
  const { scrollZoom, transport, transportState, setScrollZoom } = useSpecviz()
  const containerRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<SVGSVGElement>(null)
  const playheadRef = useRef<SVGLineElement>(null)
  const dimensions = useDimensions(containerRef)

  const derivePlayheadFromTime = useCallback(
    (time: number) => {
      return (time / duration * 100).toFixed(2) + "%"
    },
    [duration]
  )

  const deriveTimeFromPoint = useCallback(
    (pt: tvector2) => {
      const ref = scrollZoom.current!
      return (ref.x + pt.x) / dimensions.x / ref.z * duration
    },
    [scrollZoom, dimensions, duration]
  )

  const updatePlayhead = useCallback(
    () => {
      const ref = playheadRef.current!
      switch (transportState.type) {
        case "stop":
          return
        case "play":
          const delta = (Date.now() - transportState.timeRef) / 1000
          const progress = derivePlayheadFromTime(transportState.offset + delta)
          ref.setAttribute("x1", progress)
          ref.setAttribute("x2", progress)
          return
      }
    },
    [playheadRef, transportState, derivePlayheadFromTime]
  )

  const updateLayer = useCallback(
    () => {
      const elem = layerRef.current!
      const { x: width, y: height } = dimensions
      const { x: scrollX, y: scrollY, z: scrollZ } = scrollZoom.current!
      elem.setAttribute("x", String(-scrollX))
      elem.setAttribute("y", String(-scrollY))
      elem.setAttribute("width", String(width * scrollZ))
      elem.setAttribute("height", String(height * scrollZ))
    },
    [layerRef, dimensions, scrollZoom]
  )

  useAnimationFrame(useCallback(
    () => {
      setScrollZoom(dimensions, state => state)
      updateLayer()
      updatePlayhead()
    },
    [setScrollZoom, updateLayer, updatePlayhead]
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
        setScrollZoom(dimensions, state => ({
          x: state.x + e.deltaX,
          y: state.y + e.deltaY,
          z: state.z
        }))
      },
      [setScrollZoom, dimensions]
    )
  )

  return <div
    ref={containerRef}
    style={{height}}
    className="specviz-visualization"
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
        <line
          ref={playheadRef}
          className="specviz-playhead"
          x1={derivePlayheadFromTime(transportState.offset)}
          y1={0}
          x2={derivePlayheadFromTime(transportState.offset)}
          y2="100%"
        />
      </svg>
    </svg>
  </div>
}

export default Visualization
