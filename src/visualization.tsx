import { memo, useLayoutEffect, useCallback, useRef } from "react"
import { Image, Layer, Stage } from "react-konva"
import useImage from "use-image"
import { useDimensions } from "./hooks"
import { clamp } from "./mathx"
import { useSpecviz } from "./specviz"

// scroll reference
// https://dev.to/sip3/how-to-achieve-top-notch-scrolling-performance-using-html5-canvas-k49
//
// zoom reference
// https://stackoverflow.com/questions/52054848/how-to-react-konva-zooming-on-scroll

function Visualization(props: {
  height: number,
  imageUrl: string,
}) {
  const { height, imageUrl } = props
  const { scroll, zoom, setScroll, setZoom } = useSpecviz()
  const ref = useRef<HTMLDivElement>(null)
  const dimensions = useDimensions(ref)
  const [imageElem, imageStatus] = useImage(imageUrl)

  const onWheel = useCallback(
    (e: any) => { // KonvaEventObject<WheelEvent>
      if (e.evt) {
        e.evt.preventDefault()
        if (e.evt.altKey) {
          setScroll(s => ({
            x: clamp(
              s.x + (e.evt.deltaX ?? 0),
              0,
              dimensions.width * (zoom - 1)
            ),
            y: clamp(
              s.y + (e.evt.deltaY ?? 0),
              0,
              dimensions.height * (zoom - 1)
            ),
          }))
        }
        if (e.evt.metaKey) {
          setZoom(z => clamp(
            z + (e.evt.deltaY ?? 0) / -100,
            1,
            2
          ))
        }
      }
    },
    [dimensions.width, dimensions.height, zoom]
  )

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.addEventListener("scroll", onWheel)
    }
    return () => {
      if (ref.current) {
        ref.current.removeEventListener("scroll", onWheel)
      }
    }
  }, [ref, onWheel])

  useLayoutEffect(
    () => {
      if (ref.current) {
        ref.current.scrollTop = scroll.y
        ref.current.scrollLeft = scroll.x
      }
    },
    [ref, scroll.x, scroll.y]
  )

  switch (imageStatus) {
    case "loading":
      return <div>Loading...</div>
    case "failed":
      return <div>Failed to load image</div>
    default:
      return <div ref={ref} style={{position: "relative", overflow: "auto", height}} className="specviz-canvas">
        <Playhead
          width={dimensions.width}
          height={dimensions.height}
          position={10}
        />
        <Canvas
          image={imageElem!}
          width={dimensions.width * zoom}
          height={dimensions.height * zoom}
          onWheel={onWheel}
        />
      </div>
  }
}

function Playhead(props: {
  width: number,
  height: number,
  position: number,
}) {
  const { width, height, position } = props
  return <svg
    style={{position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 3}}
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
  >
    <line
      stroke="cyan"
      strokeWidth={1}
      x1={position}
      y1="0"
      x2={position}
      y2={height}
    />
  </svg>
}

type tcanvasprops = {
  image: HTMLImageElement,
  width: number,
  height: number,
  onWheel: (e: any) => void
}

function canvasEqual(a: tcanvasprops, b: tcanvasprops) {
  return a.image === b.image
    && a.width === b.width
    && a.height === b.height
    && a.onWheel === b.onWheel
}

const Canvas = memo(function Canvas(props: tcanvasprops) {
  const { image, width, height, onWheel } = props
  return <Stage
    width={width}
    height={height}
    onWheel={onWheel}
  >
    <Layer>
      <Image
        image={image}
        width={width}
        height={height}
      />
    </Layer>
  </Stage>
}, canvasEqual)

export default Visualization
