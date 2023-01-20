import { useCallback, useRef } from "react"
import { useSpecviz } from "./specviz"
import { useAnimationFrame, useClickDelta, useWheel } from "./hooks"
import Playhead from "./playhead"

const RESOLUTION = 100

function Navigator(props: {
  height: number,
  imageUrl: string,
}) {
  const { height, imageUrl } = props
  const { scrollZoom, setScrollZoom } = useSpecviz()
  const containerRef = useRef<HTMLDivElement>(null)
  const maskRef = useRef<SVGPathElement>(null)

  useAnimationFrame(useCallback(
    () => {
      const elem = maskRef.current!
      const { x, y, z } = scrollZoom.current!
      elem.setAttribute("d", `
        M 0 0
        h ${RESOLUTION}
        v ${RESOLUTION}
        h ${-RESOLUTION}
        z
        M ${x * RESOLUTION / z} ${y * RESOLUTION / z}
        v ${RESOLUTION / z}
        h ${RESOLUTION / z}
        v ${-RESOLUTION / z}
        z
      `)
    },
    [maskRef, scrollZoom]
  ))

  useClickDelta(
    containerRef,
    useCallback(
      (e, pt, delta) => {
        const elem = e.currentTarget as HTMLDivElement
        // todo: center on click
        setScrollZoom(state => ({
          x: pt.x / elem.clientWidth,
          y: pt.y / elem.clientHeight,
          z: state.z,
        }))

      },
      [setScrollZoom]
    )
  )

  useWheel(
    containerRef,
    useCallback(
      (e: WheelEvent) => {
        e.preventDefault()
        const elem = e.currentTarget as HTMLDivElement
        setScrollZoom(state => {
          if (e.altKey)
            return { x: state.x, y: state.y, z: state.z + e.deltaY / 300 }
          else
            return { x: state.x - e.deltaX / elem.clientWidth, y: state.y - e.deltaY / elem.clientHeight, z: state.z }
        })
      },
      [setScrollZoom]
    )
  )

  return <div
    ref={containerRef}
    style={{height}}
    className="navigator"
  >
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${RESOLUTION} ${RESOLUTION}`}
      preserveAspectRatio="none"
    >
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
      <Playhead />
    </svg>
  </div>

}

export default Navigator
