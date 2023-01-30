import { taxis } from "./types"
import { useCallback, useMemo, useRef } from "react"
import { useClickRect, useSpecviz, useWheel } from "./specviz"
import { useAnimationFrame } from "./hooks"
import { trect } from "./rect"
import { magnitude } from "./vector2"
import { tformat, randomBytes } from "./stringx"
import Playhead from "./playhead"
import Annotation from "./annotation"
import Cursor from "./cursor"

const NOOP = () => {}
const NOSELECTION = { x: 0, y: 0, width: 0, height: 0 }

function fscale(scale: taxis, q: number) {
  if (scale.length < 2) return -Infinity
    let ax, ay, bx, by
    let i = 0
    while (i < scale.length - 1) {
      [ax, ay] = scale[i];
      [bx, by] = scale[i + 1]
      if (q <= bx) {
        return ay + (by - ay) * (q - ax) / (bx - ax)
      }
      i += 1
    }
    return -Infinity
}

function Visualization(props: {
  imageUrl: string,
  xaxis: taxis,
  yaxis: taxis,
  xformat?: tformat,
  yformat?: tformat,
}) {
  const { annotations, input, mouseup, scroll, zoom, toolState, transport, transportState, setAnnotations } = useSpecviz()
  const selectionRect = useRef<trect>(NOSELECTION)
  const svgRoot = useRef<SVGSVGElement>(null)
  const svgLayer = useRef<SVGSVGElement>(null)
  const svgSelection = useRef<SVGRectElement>(null)
  const xformat = useMemo(() => props.xformat || String, [props.xformat])
  const yformat = useMemo(() => props.yformat || String, [props.yformat])
  const fx = useCallback((q: number) => xformat(fscale(props.xaxis, q)), [props.xaxis, xformat])
  const fy = useCallback((q: number) => yformat(fscale(props.yaxis, q)), [props.yaxis, yformat])

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

  const { onMouseDown, onMouseMove, onMouseUp, onMouseLeave, onContextMenu } = useClickRect({
    onContextMenu: NOOP,
    onMouseDown: NOOP,
    onMouseLeave: NOOP,
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
              case "select": // todo: select annotation
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
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onContextMenu={onContextMenu}
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
      <Cursor fx={fx} fy={fy} />
    </svg>
  </div>
}

export default Visualization
