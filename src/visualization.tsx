import { useCallback, useEffect, useId, useMemo, useRef } from "react"
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
    (e: WheelEvent) => {
      e.preventDefault()
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

  const onFrame = useCallback(
    () => {
      switch (transportState.type) {
        case "stop":
        case "pause":
          return
        case "play":
          const delta = (Date.now() - transportState.timeRef) / 1000
          const progress = ((transportState.offset + delta) / duration * 100).toFixed(2) + "%"
          playheadRef.current!.setAttribute("x1", progress)
          playheadRef.current!.setAttribute("x2", progress)
          return
      }
    },
    [playheadRef, transportState, duration]
  )

  useAnimationFrame(onFrame, transportState.type === "play")

  return <div
    ref={containerRef}
    style={{height}}
    className="specviz-visualization"
  >
    <svg
      width="100%"
      height="100%"
    >
      <defs>
        {/* todo: memoizing image may improve performance  */}
        <image
          id={id}
          preserveAspectRatio="none"
          href={imageUrl}
          width="100%"
          height="100%"
        />
      </defs>
      <svg
        x={-1 * scroll.x}
        y={-1 * scroll.y}
        width={dimensions.width * zoom}
        height={dimensions.height * zoom}
      >
        <use href={`#${id}`} />
        <line
          ref={playheadRef}
          className="specviz-playhead"
          x1={0}
          y1={0}
          x2={0}
          y2="100%"
        />
      </svg>
    </svg>
  </div>
}

export default Visualization
