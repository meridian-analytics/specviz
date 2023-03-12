import { taxis } from "./types"
import { useCallback, useRef } from "react"
import { useAnimationFrame, useMouse, useSpecviz, useWheel } from "./hooks"
import { fromPoints, logical } from "./rect"
import { hide, show, setRect, setTransform } from "./svg"
import { magnitude } from "./vector2"
import Annotation from "./annotation"
import Cursor from "./cursor"
import Playhead from "./playhead"

const NOOP = () => {}

function Visualization(props: {
  imageUrl: string,
  xaxis: taxis,
  yaxis: taxis,
}) {
  const { imageUrl, xaxis, yaxis } = props
  const { command, input, mouseup, mouseRect, unitDown, unitUp, scroll, zoom } = useSpecviz()
  const { toolState, transportState, transport } = useSpecviz()
  const { annotations } = useSpecviz()
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
      [toolState, selection, xaxis, yaxis]
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
          transport.seek(mouseup.abs.x)
        }
      },
      [annotations, toolState, transport, xaxis, yaxis]
    ),
  })

  useWheel(svgRoot, -1)

  return <div
    className={`visualization ${toolState} ${transportState.type}`}
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
            href={imageUrl}
            width="100%"
            height="100%"
          />
          {Array.from(annotations.values()).map(a =>
            <Annotation
              key={a.id}
              annotation={a}
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
