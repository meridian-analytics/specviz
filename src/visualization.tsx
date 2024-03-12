import * as R from "react"
import Annotation from "./annotation"
import * as Audio2 from "./audio2"
import * as Axis from "./axis"
import Cursor from "./cursor"
import * as Hooks from "./hooks"
import Playhead from "./playhead"
import * as Rect from "./rect"
import * as Specviz from "./specviz"
import * as Svg from "./svg"
import * as Vector2 from "./vector2"

const NOOP = () => {}

function Visualization(props: {
  src: string
  xaxis: Axis.taxis
  yaxis: Axis.taxis
}) {
  const {
    command,
    input,
    mouseup,
    mouseRect,
    regions,
    selection,
    toolState,
    unitDown,
    unitUp,
    scroll,
    zoom,
  } = Specviz.useContext()
  const audio = Audio2.useContext()
  const svgRoot = R.useRef<SVGSVGElement>(null)
  const svgLayer = R.useRef<SVGSVGElement>(null)
  const svgSelection = R.useRef<SVGRectElement>(null)

  Hooks.useAnimationFrame(
    R.useCallback(() => {
      if (svgLayer.current && svgSelection.current) {
        Svg.setTransform(svgLayer.current, scroll, zoom)
        switch (toolState) {
          case "annotate":
          case "select":
          case "zoom":
            if (input.buttons & 1) {
              Svg.show(svgSelection.current)
              Svg.setRect(
                svgSelection.current,
                Rect.logical(
                  mouseRect,
                  props.xaxis === input.xaxis,
                  props.yaxis === input.yaxis,
                ),
              )
            } else {
              Svg.hide(svgSelection.current)
            }
            break
          case "pan":
            Svg.hide(svgSelection.current)
            break
        }
      }
    }, [toolState, props.xaxis, props.yaxis, input, mouseRect, scroll, zoom]),
  )

  const onMouse = Hooks.useMouse({
    xaxis: props.xaxis,
    yaxis: props.yaxis,
    onContextMenu: NOOP,
    onMouseDown: NOOP,
    onMouseEnter: NOOP,
    onMouseLeave: NOOP,
    onMouseMove: R.useCallback(
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
    onMouseUp: R.useCallback(
      e => {
        if (input.buttons & 1) {
          if (
            Vector2.magnitude({ x: mouseRect.width, y: mouseRect.height }) <
            0.01
          ) {
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
                  Rect.fromPoints(unitDown, unitUp),
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

  Hooks.useWheel(svgRoot, -1)

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
