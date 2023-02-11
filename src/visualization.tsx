import { tannotation, taxis, tselection } from "./types"
import { useCallback, useRef } from "react"
import { useMouse, useSpecviz, useWheel } from "./specviz"
import { useAnimationFrame } from "./hooks"
import { fromPoints, intersectPoint, intersectRect } from "./rect"
import { magnitude } from "./vector2"
import { randomBytes } from "./stringx"
import Playhead from "./playhead"
import Annotation from "./annotation"
import Cursor from "./cursor"

const NOOP = () => {}

function Visualization(props: {
  imageUrl: string,
  xaxis: taxis,
  yaxis: taxis,
}) {
  const { input, mouseup, mouseRect, unitDown, unitUp, scroll, zoom } = useSpecviz()
  const { toolState, transportState, transport } = useSpecviz()
  const { annotations, setAnnotations } = useSpecviz()
  const { setSelection } = useSpecviz()
  const svgRoot = useRef<SVGSVGElement>(null)
  const svgLayer = useRef<SVGSVGElement>(null)
  const svgSelection = useRef<SVGRectElement>(null)

  useAnimationFrame(useCallback(
    () => {
      const layer = svgLayer.current!
      const selection = svgSelection.current!
      layer.setAttribute(
        "transform",
        `translate(${-scroll.x}, ${-scroll.y}) scale(${zoom.x}, ${zoom.y})`
      )
      switch (toolState) {
        case "annotate":
        case "select":
        case "zoom":
          selection.setAttribute("x", String(mouseRect.x))
          selection.setAttribute("y", String(mouseRect.y))
          selection.setAttribute("width", String(mouseRect.width))
          selection.setAttribute("height", String(mouseRect.height))
          selection.setAttribute("display", "inline")
          break
        case "pan":
          selection.setAttribute("display", "none")
          break
      }
    },
    [svgLayer, svgSelection, toolState]
  ))

  const onMouse = useMouse({
    xaxis: props.xaxis,
    yaxis: props.yaxis,
    onContextMenu: NOOP,
    onMouseDown: NOOP,
    onMouseEnter: NOOP,
    onMouseLeave: NOOP,
    onMouseMove: useCallback(
      (e) => {
        if (input.buttons & 1) {
          switch (toolState) {
            case "annotate":
            case "select":
            case "zoom":
              break
            case "pan": // drag pan
              scroll.x -= e.movementX / e.currentTarget.clientWidth
              scroll.y -= e.movementY / e.currentTarget.clientHeight
              break
          }
        }
      },
      [toolState]
    ),
    onMouseUp: useCallback(
      (e) => {
        if (input.buttons & 1) {
          if (magnitude({x: mouseRect.width, y: mouseRect.height}) < .01) { // click
            switch (toolState) {
              case "annotate": // noop
                break
              case "select": // select annotation
                setSelection(selection => {
                  if (input.ctrl) {
                    const newSelection: tselection = new Set(selection)
                    for (const a of annotations.values()) {
                      if (intersectPoint(a.rect, mouseup.abs)) {
                        if (newSelection.has(a)) newSelection.delete(a)
                        else newSelection.add(a)
                      }
                    }
                    return newSelection
                  }
                  else {
                    const newSelection: tselection = new Set()
                    for (const a of annotations.values()) {
                      if (intersectPoint(a.rect, mouseup.abs)) {
                        newSelection.add(a)
                      }
                    }
                    return newSelection
                  }
                })
                break
              case "zoom": // increment zoom to point
                zoom.x += 0.5
                zoom.y += 0.5
                scroll.x = (mouseup.abs.x * zoom.x) - mouseup.rel.x
                scroll.y = (mouseup.abs.y * zoom.y) - mouseup.rel.y
                break
              case "pan": // noop
                break
            }
          }
          else { // drag
            switch (toolState) {
              case "annotate": // create annotation
                const id = randomBytes(10)
                const newAnnotation: tannotation = {
                  id,
                  rect: {...mouseRect},
                  unit: fromPoints(unitDown, unitUp),
                  xaxis: props.xaxis,
                  yaxis: props.yaxis,
                }
                setAnnotations(a => {
                  return new Map(a).set(id, newAnnotation)
                })
                setSelection(s => {
                  return new Set([newAnnotation])
                })
                break
              case "select": // select annotations
                setSelection(() => {
                  const newSelection: tselection = new Set()
                  for (const a of annotations.values()) {
                    if (intersectRect(a.rect, mouseRect)) {
                      newSelection.add(a)
                    }
                  }
                  return newSelection
                })
                break
              case "zoom": // zoom to selection
                zoom.x = 1 / mouseRect.width
                zoom.y = 1 / mouseRect.height
                scroll.x = -0.5 + (mouseRect.x + mouseRect.width / 2) * zoom.x
                scroll.y = -0.5 + (mouseRect.y + mouseRect.height / 2) * zoom.y
                break
              case "pan": // noop
                break
            }
          }
        }
        if (input.buttons & 2) { // jump playhead to point
          transport.seek(mouseup.abs.x)
        }
      },
      [annotations, toolState, transport]
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
            href={props.imageUrl}
            width="100%"
            height="100%"
          />
          {Array.from(annotations.values()).map(a =>
            <Annotation key={a.id} annotation={a} />
          )}
          <rect
            ref={svgSelection}
            className="selection"
            x="0"
            y="0"
            width="0"
            height="0"
          />
          <Playhead />
        </g>
      </svg>
      <Cursor parent={svgRoot} xaxis={props.xaxis} yaxis={props.yaxis} />
    </svg>
  </div>
}

export default Visualization
