import { useCallback, useMemo, useRef } from "react"
import { useDimensions } from "./hooks"
import { clamp } from "./mathx"
import { useSpecviz } from "./specviz"

function Visualization(props: {
  height: number,
  imageUrl: string,
}) {
  const { height, imageUrl } = props
  const { scroll, zoom, setScroll, setZoom } = useSpecviz()
  const ref = useRef<HTMLDivElement>(null)
  const dimensions = useDimensions(ref)

  const scrollLimit = useMemo(
    () => ({
      x: dimensions.width * (zoom - 1),
      y: dimensions.height * (zoom - 1),
    }),
    [dimensions.width, dimensions.height, zoom]
  )

  const onWheel = useCallback(
    (e: any) => {
      if (e.altKey) {
        setScroll(s => ({
          x: clamp(s.x + (e.deltaX ?? 0), 0, scrollLimit.x),
          y: clamp(s.y + (e.deltaY ?? 0), 0, scrollLimit.y),
        }))
      }
      if (e.metaKey) {
        setZoom(z => clamp(z + (e.deltaY ?? 0) / -100, 1, 2))
        setScroll(s => ({
          x: clamp(s.x, 0, scrollLimit.x),
          y: clamp(s.y, 0, scrollLimit.y),
        }))
      }
    },
    [scrollLimit.x, scrollLimit.y]
  )

  return <div
    ref={ref}
    style={{height}}
    className="specviz-visualization"
    onWheel={onWheel}
  >
    <svg
      width={dimensions.width}
      height={dimensions.height}
    >
      <image
        preserveAspectRatio="none"
        href={imageUrl}
        width={dimensions.width * zoom}
        height={dimensions.height * zoom}
        x={-scroll.x}
        y={-scroll.y}
      />
      <line
        stroke="cyan"
        strokeWidth={1}
        x1={20}
        y1={0}
        x2={20}
        y2={dimensions.height}
      />
    </svg>
  </div>
}

export default Visualization
