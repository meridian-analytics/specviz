import { useLayoutEffect, useCallback, useRef } from "react"
import { Image, Layer, Stage } from "react-konva"
import useImage from "use-image"
import { useDimensions } from "./hooks"
import { clamp } from "./mathx"
import { useSpecviz } from "./specviz"

type tprops = {
  height: number,
  imageUrl: string,
}

// scroll reference
// https://dev.to/sip3/how-to-achieve-top-notch-scrolling-performance-using-html5-canvas-k49
//
// zoom reference
// https://stackoverflow.com/questions/52054848/how-to-react-konva-zooming-on-scroll

function Visualization(props: tprops) {
  const { height, imageUrl } = props
  const { scroll, zoom, setScroll, setZoom } = useSpecviz()
  const ref = useRef<HTMLDivElement>(null)
  const dimensions = useDimensions(ref)
  const [imageElem, imageStatus] = useImage(imageUrl)

  const onWheel = useCallback(
    (e: any) => {
      if (e.evt) {
        e.evt.preventDefault()
        if (e.evt.altKey) {
          setScroll(s => ({
            x: clamp(s.x + e.evt.deltaX ?? 0, 0, dimensions.width * (zoom - 1)),
            y: clamp(s.y + e.evt.deltaY ?? 0, 0, dimensions.height * (zoom - 1)),
          }))
        }
        if (e.evt.metaKey) {
          setZoom(z => clamp(z + e.evt.deltaY / -100, 1, 2))
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
      return <div ref={ref} style={{overflow: "auto", height}} className="specviz-canvas">
        <Stage
          width={dimensions.width*zoom}
          height={dimensions.height*zoom}
          onWheel={onWheel}
        >
          <Layer>
            <Image
              image={imageElem}
              width={dimensions.width*zoom}
              height={dimensions.height*zoom}
            />
          </Layer>
        </Stage>
      </div>
  }
}

export default Visualization
