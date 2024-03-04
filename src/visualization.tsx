import { useCallback, useRef } from "react"
import { taxis } from "./axis.jsx"
import { useAnimationFrame, useMouse, useSpecviz, useWheel } from "./hooks.jsx"
import { fromPoints, logical } from "./rect.jsx"
import { hide, show, setRect, setTransform } from "./svg.jsx"
import { magnitude } from "./vector2.jsx"
import Annotation from "./annotation.jsx"
import * as Audio2 from "./audio2"
import Cursor from "./cursor.jsx"
import Playhead from "./playhead.jsx"

const NOOP = () => {}

function Visualization(props: {
  src: string,
  xaxis: taxis,
  yaxis: taxis,
}) {
  const { src, xaxis, yaxis } = props
  const { command, input, mouseup, mouseRect, unitDown, unitUp, scroll, zoom } = useSpecviz()
  const { toolState } = useSpecviz()
  const audio = Audio2.useAudio()
  const { regions } = useSpecviz()
  const { selection } = useSpecviz()
  const svgRoot = useRef<SVGSVGElement>(null)
  const svgLayer = useRef<SVGSVGElement>(null)
  const svgSelection = useRef<SVGRectElement>(null)

  useAnimationFrame(useCallback(
    () => {
      const layer = svgLayer.current!
      const selection = svgSelection.current!
      setTransform(layer, scroll, zoom)
      switch (toolState) {
        case "annotate":
        case "select":
        case "zoom":
          if (input.buttons & 1) {
            show(selection)
            setRect(selection, logical(mouseRect, xaxis === input.xaxis, yaxis === input.yaxis))
          }
          else {
            hide(selection)
          }
          break
        case "pan":
          hide(selection)
          break
      }
    },
    [toolState, xaxis, yaxis]
  ))

  const onMouse = useMouse({
    xaxis: xaxis,
    yaxis: yaxis,
    onContextMenu: NOOP,
    onMouseDown: NOOP,
    onMouseEnter: NOOP,
    onMouseLeave: NOOP,
    onMouseMove: useCallback(
      (e) => {
        if (input.buttons & 1) {
          const dx = e.movementX / e.currentTarget.clientWidth
          const dy = e.movementY / e.currentTarget.clientHeight
          switch (toolState) {
            case "annotate":
            case "select":
            case "zoom":
              break
            case "pan":
              if (selection.size == 0) {
                command.scroll(-dx, -dy)
              }
              else {
                command.moveSelection(dx, dy)
              }
              break
          }
        }
      },
      [command, toolState, selection, xaxis, yaxis]
    ),
    onMouseUp: useCallback(
      (e) => {
        if (input.buttons & 1) {
          if (magnitude({x: mouseRect.width, y: mouseRect.height}) < .01) { // click
            switch (toolState) {
              case "annotate":
                command.deselect()
                break
              case "select":
                command.selectPoint(mouseup.abs)
                break
              case "zoom":
                command.zoomPoint(mouseup.abs)
                break
              case "pan":
                break
            }
          }
          else { // drag
            switch (toolState) {
              case "annotate":
                command.annotate({...mouseRect}, fromPoints(unitDown, unitUp), xaxis, yaxis)
                break
              case "select":
                command.selectArea(mouseRect)
                break
              case "zoom":
                command.zoomArea(mouseRect)
                break
              case "pan":
                break
            }
          }
        }
        if (input.buttons & 2) { // todo: command.seek
          audio.transport.seek(mouseup.abs.x * audio.buffer.duration)
        }
      },
      [
        audio.buffer.duration,
        audio.transport.seek,
        command,
        toolState,
        xaxis,
        yaxis,
      ],
    ),
  })

  useWheel(svgRoot, -1)

  return <div
    className={`visualization ${toolState}`}
  >
    <svg
      ref={svgRoot}
      width="100%"
      height="100%"
      {...onMouse}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
      >
        <g
          ref={svgLayer}
          width="1"
          height="1"
        >
          <image
            preserveAspectRatio="none"
            href={src}
            width="100%"
            height="100%"
          />
          {Array.from(regions.values(), region =>
            <Annotation
              key={region.id}
              region={region}
              xaxis={xaxis}
              yaxis={yaxis}
            />
          )}
          <rect
            ref={svgSelection}
            className="selection"
            x="0"
            y="0"
            width="0"
            height="0"
          />
          <Playhead xaxis={xaxis} yaxis={yaxis} />
        </g>
      </svg>
      <Cursor parent={svgRoot} xaxis={xaxis} yaxis={yaxis} />
    </svg>
  </div>
}

export default Visualization
