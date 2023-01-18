import type { WheelEvent } from "react"
import { useCallback, useId, useMemo, useRef } from "react"
import { useAnimationFrame, useDimensions } from "./hooks"
import { clamp } from "./mathx"
import { useSpecviz } from "./specviz"

function Visualization(props: {
  height: number,
  imageUrl: string,
  duration: number,
}) {
  const id = useId()
  const { height, imageUrl, duration } = props
  const { transportState, scroll, zoom, setScroll, setZoom } = useSpecviz()
  const playheadRef = useRef<SVGLineElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dimensions = useDimensions(containerRef)

  const scrollLimit = useMemo(
    () => ({
      x: dimensions.width * (zoom - 1),
      y: dimensions.height * (zoom - 1),
    }),
    [dimensions.width, dimensions.height, zoom]
  )

  const onWheel = useCallback(
    (e: WheelEvent<HTMLDivElement>) => {
      if (e.altKey) {
        setScroll(s => ({
          x: clamp(s.x + e.deltaX, 0, scrollLimit.x),
          y: clamp(s.y + e.deltaY, 0, scrollLimit.y),
        }))
      }
      if (e.metaKey) {
        setZoom(z => clamp(z + e.deltaY / -100, 1, 2))
        setScroll(s => ({
          x: clamp(s.x, 0, scrollLimit.x),
          y: clamp(s.y, 0, scrollLimit.y),
        }))
      }
    },
    [scrollLimit.x, scrollLimit.y]
  )

  const timeToCoord = useCallback(
    (time: number) => {
      return ((dimensions.width * zoom * time / duration) - scroll.x).toFixed(0)
    },
    [dimensions.width, zoom, duration, scroll.x]
  )

  const onFrame = useCallback(
    () => {
      switch (transportState.type) {
        case "stop":
        case "pause":
          return
        case "play":
          const delta = (Date.now() - transportState.timeRef) / 1000
          const x = timeToCoord(transportState.offset + delta)
          playheadRef.current!.setAttribute("x1", x)
          playheadRef.current!.setAttribute("x2", x)
          break
      }
    },
    [playheadRef, transportState, timeToCoord]
  )

  useAnimationFrame(onFrame, transportState.type === "play")

  return <div
    ref={containerRef}
    style={{height}}
    className="specviz-visualization"
    onWheel={onWheel}
  >
    <svg
      width={dimensions.width}
      height={dimensions.height}
    >
      <defs>
        {/* todo: memoizing image may improve performance  */}
        <image
          id={id}
          preserveAspectRatio="none"
          href={imageUrl}
          width={dimensions.width * zoom}
          height={dimensions.height * zoom}
        />
      </defs>
      <use
        href={`#${id}`}
        x={-scroll.x}
        y={-scroll.y}
      />
      <line
        ref={playheadRef}
        className="specviz-playhead"
        x1={0}
        y1={0}
        x2={0}
        y2={dimensions.height}
      />
    </svg>
  </div>
}

export default Visualization
