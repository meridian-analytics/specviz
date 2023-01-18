import { useCallback, useRef } from "react"
import { useSpecviz } from "./specviz"
import { useAnimationFrame, useDimensions } from "./hooks"

function Navigator(props: {
  height: number,
  imageUrl: string,
  mappingHeight: number,
  duration: number,
}) {
  const { height, imageUrl, mappingHeight, duration } = props
  const { scrollZoom, transportState } = useSpecviz()
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
      const { width, height } = dimensions
      const { x, y, z } = scrollZoom.current!
      return `
        M 0 0
        h ${width}
        v ${height}
        h${-width}
        z
        M ${x / z} ${y / mappingHeight * height / z}
        v ${height / z}
        h ${width / z}
        v ${-height / z}
        z
      `
    },
    [scrollZoom, dimensions.width, dimensions.height]
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
