import { useCallback, useRef } from "react"
import { useSpecviz } from "./specviz"
import { useAnimationFrame, useClickDelta, useDimensions, useWheel } from "./hooks"
import Playhead from "./playhead"

function Navigator(props: {
  height: number,
  imageUrl: string,
  mappingHeight: number,
  duration: number,
}) {
  const { height, imageUrl, mappingHeight, duration } = props
  const { scrollZoom, setScrollZoom } = useSpecviz()
  const containerRef = useRef<HTMLDivElement>(null)
  const dimensions = useDimensions(containerRef)
  const maskRef = useRef<SVGPathElement>(null)

  useAnimationFrame(useCallback(
    () => {
      const elem = maskRef.current!
      const { x: width, y: height } = dimensions
      const { x: scrollX, y: scrollY, z: zoom } = scrollZoom.current!
      elem.setAttribute("d", `
        M 0 0
        h ${width}
        v ${height}
        h ${-width}
        z
        M ${scrollX / zoom} ${scrollY / mappingHeight * height / zoom}
        v ${height / zoom}
        h ${width / zoom}
        v ${-height / zoom}
        z
      `)
    },
    [maskRef, dimensions, scrollZoom, mappingHeight]
  ))

  useClickDelta(
    containerRef,
    useCallback(
      (pt, delta) => {
        const { x: width, y: height } = dimensions
        const { x: scrollX, y: scrollY, z: zoom } = scrollZoom.current!
        setScrollZoom(
          {
            x: dimensions.x,
            y: mappingHeight,
          },
          {
            x: pt.x * zoom - width / 2,
            y: pt.y / height * mappingHeight * zoom - mappingHeight / 2,
            z: zoom,
          }
        )
      },
      [dimensions, scrollZoom, mappingHeight, setScrollZoom]
    )
  )

  useWheel(
    containerRef,
    useCallback(
      (e: WheelEvent) => {
        e.preventDefault()
        setScrollZoom(
          {
            x: dimensions.x,
            y: mappingHeight,
          },
          state => {
            if (e.altKey)
              return { x: state.x, y: state.y, z: state.z + e.deltaY / 100 }
            else
              return { x: state.x - e.deltaX, y: state.y - e.deltaY, z: state.z }
          }
        )
      },
      [setScrollZoom, dimensions]
    )
  )

  return <div
    ref={containerRef}
    style={{height}}
    className="navigator"
  >
    <svg width="100%" height="100%">
      <image
        href={imageUrl}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      />
      <path
        ref={maskRef}
        className="mask"
        d=""
      />
      <Playhead duration={duration} />
    </svg>
  </div>

}

export default Navigator
