import { taxis, tselection } from "./types"
import { useCallback, useRef } from "react"
import { useClickRect, useSpecviz, useWheel } from "./specviz"
import { useAnimationFrame } from "./hooks"
import { trect, intersectPoint } from "./rect"
import { magnitude } from "./vector2"
import { randomBytes } from "./stringx"
import Playhead from "./playhead"
import Annotation from "./annotation"
import Cursor from "./cursor"

const NOOP = () => {}
const NOSELECTION = { x: 0, y: 0, width: 0, height: 0 }

function Visualization(props: {
  imageUrl: string,
  xaxis: taxis,
  yaxis: taxis,
}) {
  const { input, mouseup, scroll, zoom } = useSpecviz()
  const { toolState, transportState, transport } = useSpecviz()
  const { annotations, setAnnotations } = useSpecviz()
  const { setSelection } = useSpecviz()
  const selectionRect = useRef<trect>(NOSELECTION)
  const svgRoot = useRef<SVGSVGElement>(null)
  const svgLayer = useRef<SVGSVGElement>(null)
  const svgSelection = useRef<SVGRectElement>(null)

  useAnimationFrame(useCallback(
    () => {
      const layer = svgLayer.current!
      const selection = svgSelection.current!
      const rect = selectionRect.current!
      layer.setAttribute(
        "transform",
        `translate(${-scroll.x}, ${-scroll.y}) scale(${zoom.x}, ${zoom.y})`
      )
      selection.setAttribute("x", String(rect.x))
      selection.setAttribute("y", String(rect.y))
      selection.setAttribute("width", String(rect.width))
      selection.setAttribute("height", String(rect.height))
    },
    [svgLayer, svgSelection, scroll, zoom, selectionRect]
  ))

  const onMouse = useClickRect({
    onContextMenu: NOOP,
    onMouseDown: NOOP,
    onMouseEnter: useCallback(
      (e) => {
        input.xaxis = props.xaxis
        input.yaxis = props.yaxis
      },
      [props.xaxis, props.yaxis]
    ),
    onMouseLeave: useCallback(
      (e) => {
        input.xaxis = null
        input.yaxis = null
      },
      []
    ),
    onMouseMove: useCallback(
      (e, rect) => {
        if (input.buttons & 1) {
          switch (toolState) {
            case "annotate":
              selectionRect.current = rect
              break
            case "select":
              selectionRect.current = rect
              break
            case "zoom":
              selectionRect.current = rect
              break
            case "pan": // drag pan
              selectionRect.current = NOSELECTION
              scroll.x -= e.movementX / e.currentTarget.clientWidth
              scroll.y -= e.movementY / e.currentTarget.clientHeight
              break
          }
        }
      },
      [input, scroll, toolState]
    ),
    onMouseUp: useCallback(
      (e, rect) => {
        selectionRect.current = NOSELECTION
        if (input.buttons & 1) {
          if (magnitude({x: rect.width, y: rect.height}) < .01) { // click
            switch (toolState) {
              case "annotate": // noop
                break
              case "select": // select annotation
                setSelection(() => {
                  const newSelection: tselection = new Set()
                  for (const a of annotations.values()) {
                    if (intersectPoint(a.rect, mouseup)) {
                      newSelection.add(a)
                    }
                  }
                  return newSelection
                })
                break
              case "zoom": // increment zoom to point
                const mx = (mouseup.x * zoom.x) - scroll.x
                const my = (mouseup.y * zoom.y) - scroll.y
                zoom.x += 0.5
                zoom.y += 0.5
                scroll.x = (mouseup.x * zoom.x) - mx
                scroll.y = (mouseup.y * zoom.y) - my
                break
              case "pan": // noop
                break
            }
          }
          else { // drag
            switch (toolState) {
              case "annotate": // create annotation
                const id = randomBytes(10)
                setAnnotations(a =>
                  new Map(a).set(id, {
                    id,
                    rect,
                    data: {},
                  })
                )
                break
              case "select": // todo: select annotations
                break
              case "zoom": // zoom to selection
                zoom.x = 1 / rect.width
                zoom.y = 1 / rect.height
                scroll.x = -0.5 + (rect.x + rect.width / 2) * zoom.x
                scroll.y = -0.5 + (rect.y + rect.height / 2) * zoom.y
                break
              case "pan": // noop
                break
            }
          }
        }
        if (input.buttons & 2) { // jump playhead to point
          transport.seek(mouseup.x)
        }
      },
      [input, mouseup, scroll, zoom, toolState, transport]
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
