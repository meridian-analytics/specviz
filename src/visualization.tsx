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
import * as Viewport from "./viewport"

const NOOP = () => {}

function Visualization(props: {
  children?: typeof Annotation
  src: string
  xaxis: Axis.taxis
  yaxis: Axis.taxis
}) {
  const viewport = Viewport.useContext()
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
  } = Specviz.useContext()
  const audio = Audio2.useContext()
  const svgRoot = R.useRef<SVGSVGElement>(null)
  const svgSelection = R.useRef<SVGRectElement>(null)
  const dimensions = Hooks.useDimensions(svgRoot)

  Hooks.useAnimationFrame(
    R.useCallback(() => {
      if (svgSelection.current) {
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
    }, [toolState, props.xaxis, props.yaxis, input, mouseRect]),
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
                viewport.scroll(-dx, -dy)
              } else {
                command.moveSelection(dx, dy)
              }
              break
          }
        }
      },
      [command, toolState, input, selection, viewport.scroll],
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
                viewport.zoomPoint(mouseup.abs)
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
                viewport.zoomArea(mouseRect)
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
        viewport.zoomArea,
        viewport.zoomPoint,
      ],
    ),
  })

  Hooks.useWheel(svgRoot, -1)

  const translate = `translate(${-viewport.state.scroll.x}, ${-viewport.state
    .scroll.y})`
  const scale = `scale(${viewport.state.zoom.x}, ${viewport.state.zoom.y})`
  const transform = `${translate} ${scale}`

  const axisTranslate = `translate(${-viewport.state.scroll.x}, 0)`
  const axisScale = `scale(${viewport.state.zoom.x}, 1)`
  const axisTransform = `${axisTranslate} ${axisScale}`

  return (
    <div className={`visualization ${toolState}`}>
      <svg ref={svgRoot} width="100%" height="100%" {...onMouse}>
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="dotted-grid"
              x="5"
              y="5"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="0" cy="0" r="1" fill="black" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotted-grid)" />
        </svg>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
        >
          <g width="1" height="1" transform={transform}>
            <image
              preserveAspectRatio="none"
              href={props.src}
              width="100%"
              height="100%"
            />
            {Array.from(regions.values(), region => (
              <Annotation
                key={region.id}
                children={props.children}
                dimensions={dimensions}
                region={region}
                selected={selection.has(region.id)}
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
          <g transform={axisTransform}>
            <Axis.Horizontal axis={props.xaxis} dimensions={dimensions} />
          </g>
        </svg>
        <Cursor parent={svgRoot} xaxis={props.xaxis} yaxis={props.yaxis} />
      </svg>
    </div>
  )
}

export default Visualization
