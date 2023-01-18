import { useCallback, useEffect, useRef } from "react"
import { useAnimationFrame, useDimensions } from "./hooks"
import { clamp } from "./mathx"
import { useSpecviz } from "./specviz"

function Visualization(props: {
  height: number,
  imageUrl: string,
  duration: number,
}) {
  const { height, imageUrl, duration } = props
  const { transportState, scrollZoom } = useSpecviz()
  const containerRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<SVGSVGElement>(null)
  const playheadRef = useRef<SVGLineElement>(null)
  const dimensions = useDimensions(containerRef)

  const derivePlayheadProgress = useCallback(
    (time: number) => {
      return (time / duration * 100).toFixed(2) + "%"
    },
    [duration]
  )

  const updateScrollZoom = useCallback(
    (x: number, y: number, z: number) => {
      const state = scrollZoom.current!
      const layer = layerRef.current!
      const xLimit = dimensions.width * (state.z - 1)
      const yLimit = dimensions.height * (state.z - 1)
      state.x = clamp(state.x + x, 0, xLimit)
      state.y = clamp(state.y + y, 0, yLimit)
      state.z = clamp(state.z + z, 1, 2)
      layer.setAttribute("x", String(-state.x))
      layer.setAttribute("y", String(-state.y))
      layer.setAttribute("width", String(dimensions.width * state.z))
      layer.setAttribute("height", String(dimensions.height * state.z))
    },
    [scrollZoom, dimensions.width, dimensions.height]
  )

  const updatePlayhead = useCallback(
    () => {
      const ref = playheadRef.current!
      switch (transportState.type) {
        case "stop":
          return
        case "play":
          const delta = (Date.now() - transportState.timeRef) / 1000
          const progress = derivePlayheadProgress(transportState.offset + delta)
          ref.setAttribute("x1", progress)
          ref.setAttribute("x2", progress)
          return
      }
    },
    [playheadRef, transportState, derivePlayheadProgress]
  )

  const onWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      if (e.altKey) updateScrollZoom(e.deltaX, e.deltaY, 0) // scroll
      if (e.metaKey) updateScrollZoom(0, 0, e.deltaY / -100) // zoom
    },
    [updateScrollZoom]
  )

  // react uses passive event listeners by default
  // to stop propagation, use a non-passive listener
  // https://stackoverflow.com/a/67258046
  useEffect(
    () => {
      const container = containerRef.current!
      container.addEventListener("wheel", onWheel, { passive: false })
      return () => {
        container.removeEventListener("wheel", onWheel)
      }
    },
    [containerRef, onWheel]
  )

  useAnimationFrame(useCallback(
    () => {
      updateScrollZoom(0, 0, 0)
      updatePlayhead()
    },
    [updateScrollZoom, updatePlayhead]
  ))

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
        width={dimensions.width * scrollZoom.current!.z}
        height={dimensions.height * scrollZoom.current!.z}
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
          x1={derivePlayheadProgress(transportState.offset)}
          y1={0}
          x2={derivePlayheadProgress(transportState.offset)}
          y2="100%"
        />
      </svg>
    </svg>
  </div>
}

export default Visualization
