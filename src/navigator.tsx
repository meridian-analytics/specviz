import { useCallback, useRef } from "react"
import { useSpecviz } from "./specviz"
import { useAnimationFrame, useClickPoint, useDimensions, useWheel } from "./hooks"

function Navigator(props: {
  height: number,
  imageUrl: string,
  mappingHeight: number,
  duration: number,
}) {
  const { height, imageUrl, mappingHeight, duration } = props
  const { scrollZoom, transportState, setScrollZoom } = useSpecviz()
  const containerRef = useRef<HTMLDivElement>(null)
  const dimensions = useDimensions(containerRef)
  const maskRef = useRef<SVGPathElement>(null)
  const playheadRef = useRef<SVGLineElement>(null)

  const derivePlayheadFromTime = useCallback(
    (time: number) => {
      return (time / duration * 100).toFixed(2) + "%"
    },
    [duration]
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

  const mask = useCallback(
    () => {
      const { x: width, y: height } = dimensions
      const { x: scrollX, y: scrollY, z: zoom } = scrollZoom.current!
      return `
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
      `
    },
    [dimensions, scrollZoom]
  )

  const updateMask = useCallback(
    () => {
      const ref = maskRef.current!
      ref.setAttribute("d", mask())
    },
    [maskRef, mask]
  )

  useAnimationFrame(useCallback(
    () => {
      updatePlayhead()
      updateMask()
    },
    [updatePlayhead, updateMask]
  ))

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
              return { x: state.x, y: state.y, z: state.z - e.deltaY / 100 }
            else
              return { x: state.x - e.deltaX, y: state.y - e.deltaY, z: state.z }
          }
        )
      },
      [setScrollZoom, dimensions]
    )
  )

  useClickPoint(
    containerRef,
    useCallback(
      (pt) => {
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

  return <div
    ref={containerRef}
    style={{height}}
    className="specviz-minimap"
  >
    <svg width="100%" height="100%">
      <image
        preserveAspectRatio="none"
        href={imageUrl}
        width="100%"
        height="100%"
      />
      <path
        ref={maskRef}
        className="specviz-minimap-mask"
        d={mask()}
      />
      <line
        ref={playheadRef}
        className="specviz-minimap-playhead"
        x1={derivePlayheadFromTime(transportState.offset)}
        y1={0}
        x2={derivePlayheadFromTime(transportState.offset)}
        y2="100%"
      />
    </svg>
  </div>

}

export default Navigator
