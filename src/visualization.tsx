import { useCallback, useRef } from "react"
import Annotation from "./annotation"
import * as Audio2 from "./audio2"
import { taxis } from "./axis"
import Cursor from "./cursor"
import { useAnimationFrame, useMouse, useSpecviz, useWheel } from "./hooks"
import Playhead from "./playhead"
import { fromPoints, logical } from "./rect"
import { hide, setRect, setTransform, show } from "./svg"
import { magnitude } from "./vector2"

const NOOP = () => {}

function Visualization(props: {
  src: string
  xaxis: taxis
  yaxis: taxis
}) {
  const { command, input, mouseup, mouseRect, unitDown, unitUp, scroll, zoom } =
    useSpecviz()
  const { toolState } = useSpecviz()
  const audio = Audio2.useAudio()
  const { regions } = useSpecviz()
  const { selection } = useSpecviz()
  const svgRoot = useRef<SVGSVGElement>(null)
  const svgLayer = useRef<SVGSVGElement>(null)
  const svgSelection = useRef<SVGRectElement>(null)

  useAnimationFrame(
    useCallback(() => {
      if (svgLayer.current && svgSelection.current) {
        setTransform(svgLayer.current, scroll, zoom)
        switch (toolState) {
          case "annotate":
          case "select":
          case "zoom":
            if (input.buttons & 1) {
              show(svgSelection.current)
              setRect(
                svgSelection.current,
                logical(
                  mouseRect,
                  props.xaxis === input.xaxis,
                  props.yaxis === input.yaxis,
                ),
              )
            } else {
              hide(svgSelection.current)
            }
            break
          case "pan":
            hide(svgSelection.current)
            break
        }
      }
    }, [toolState, props.xaxis, props.yaxis, input, mouseRect, scroll, zoom]),
  )

  const onMouse = useMouse({
    xaxis: props.xaxis,
    yaxis: props.yaxis,
    onContextMenu: NOOP,
    onMouseDown: NOOP,
    onMouseEnter: NOOP,
    onMouseLeave: NOOP,
    onMouseMove: useCallback(
      e => {
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
              } else {
                command.moveSelection(dx, dy)
              }
              break
          }
        }
      },
      [command, toolState, input, selection],
    ),
    onMouseUp: useCallback(
      e => {
        if (input.buttons & 1) {
          if (magnitude({ x: mouseRect.width, y: mouseRect.height }) < 0.01) {
            // click
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
          } else {
            // drag
            switch (toolState) {
              case "annotate":
                command.annotate(
                  { ...mouseRect },
                  fromPoints(unitDown, unitUp),
                  props.xaxis,
                  props.yaxis,
                )
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
        if (input.buttons & 2) {
          // todo: command.seek
          audio.transport.seek(mouseup.abs.x * audio.buffer.duration)
        }
      },
      [
        audio.buffer.duration,
        audio.transport.seek,
        command,
        input,
        mouseup,
        mouseRect,
        unitDown,
        unitUp,
        toolState,
        props.xaxis,
        props.yaxis,
      ],
    ),
  })

  useWheel(svgRoot, -1)

  return (
    <div className={`visualization ${toolState}`}>
      <svg ref={svgRoot} width="100%" height="100%" {...onMouse}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
        >
          <g ref={svgLayer} width="1" height="1">
            <image
              preserveAspectRatio="none"
              href={props.src}
              width="100%"
              height="100%"
            />
            {Array.from(regions.values(), region => (
              <Annotation
                key={region.id}
                region={region}
                xaxis={props.xaxis}
                yaxis={props.yaxis}
              />
            ))}
            <rect
              ref={svgSelection}
              className="selection"
              x="0"
              y="0"
              width="0"
              height="0"
            />
            <Playhead xaxis={props.xaxis} yaxis={props.yaxis} />
          </g>
        </svg>
        <Cursor parent={svgRoot} xaxis={props.xaxis} yaxis={props.yaxis} />
      </svg>
    </div>
  )
}

export default Visualization
