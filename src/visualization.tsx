import { tannotation, taxis, tselection } from "./types"
import { useCallback, useRef } from "react"
import { useMouse, useSpecviz, useWheel } from "./specviz"
import { useAnimationFrame } from "./hooks"
import { fromPoints, intersectPoint, intersectRect, logical, trect } from "./rect"
import { magnitude } from "./vector2"
import { randomBytes } from "./stringx"
import { clamp } from "./mathx"
import Playhead from "./playhead"
import Annotation from "./annotation"
import Cursor from "./cursor"
import { hide, show, setRect, setTransform } from "./svg"
import { computeRect } from "./axis"

const NOOP = () => {}

function Visualization(props: {
  imageUrl: string,
  xaxis: taxis,
  yaxis: taxis,
}) {
  const { imageUrl, xaxis, yaxis } = props
  const { input, mouseup, mouseRect, unitDown, unitUp, scroll, zoom } = useSpecviz()
  const { toolState, transportState, transport } = useSpecviz()
  const { annotations, setAnnotations } = useSpecviz()
  const { selection, setSelection } = useSpecviz()
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
            case "pan": // drag pan
              if (selection.size == 0) { // todo: command.pan
                scroll.x -= dx
                scroll.y -= dy
              }
              else {
                setAnnotations(prevState => { // todo: command.moveSelection
                  let rect: trect
                  return new Map(Array.from(
                    prevState,
                    ([id, a]) => [
                      id,
                      selection.has(a.id)
                        ? {
                            ...a,
                            rect: rect = {
                              x: clamp(a.rect.x + (xaxis === a.xaxis ? dx : 0), 0, 1 - a.rect.width),
                              y: clamp(a.rect.y + (yaxis === a.yaxis ? dy : 0), 0, 1 - a.rect.height),
                              width: a.rect.width,
                              height: a.rect.height,
                            },
                            unit: computeRect(a.xaxis, a.yaxis, rect),
                          }
                        : a
                    ]
                  ))
                })
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
              case "annotate": // todo: command.deselect
                setSelection(new Set())
                break
              case "select": // todo: command.select
                setSelection(selection => {
                  if (input.ctrl) {
                    const newSelection: tselection = new Set(selection)
                    for (const a of annotations.values()) {
                      if (intersectPoint(logical(a.rect, xaxis === a.xaxis, yaxis === a.yaxis), mouseup.abs)) {
                        if (newSelection.has(a.id)) newSelection.delete(a.id)
                        else newSelection.add(a.id)
                      }
                    }
                    return newSelection
                  }
                  else {
                    const newSelection: tselection = new Set()
                    for (const a of annotations.values()) {
                      if (intersectPoint(logical(a.rect, xaxis === a.xaxis, yaxis === a.yaxis), mouseup.abs)) {
                        newSelection.add(a.id)
                      }
                    }
                    return newSelection
                  }
                })
                break
              case "zoom": // todo: command.zoomPoint
                zoom.x += 0.5
                zoom.y += 0.5
                scroll.x = (mouseup.abs.x * zoom.x) - mouseup.rel.x
                scroll.y = (mouseup.abs.y * zoom.y) - mouseup.rel.y
                break
              case "pan":
                break
            }
          }
          else { // drag
            switch (toolState) {
              case "annotate": // todo: command.annotate
                const id = randomBytes(10)
                const newAnnotation: tannotation = {
                  id,
                  rect: {...mouseRect},
                  unit: fromPoints(unitDown, unitUp),
                  xaxis: xaxis,
                  yaxis: yaxis,
                }
                setAnnotations(a => new Map(a).set(id, newAnnotation))
                setSelection(new Set([newAnnotation.id]))
                break
              case "select": // todo: command.select
                setSelection(s => {
                  if (input.ctrl) {
                    const newSelection: tselection = new Set(s)
                    for (const a of annotations.values()) {
                      if (intersectRect(logical(a.rect, xaxis === a.xaxis, yaxis === a.yaxis), mouseRect)) {
                        if (newSelection.has(a.id)) newSelection.delete(a.id)
                        else newSelection.add(a.id)
                      }
                    }
                    return newSelection
                  }
                  else {
                    const newSelection: tselection = new Set()
                    for (const a of annotations.values()) {
                      if (intersectRect(logical(a.rect, xaxis === a.xaxis, yaxis === a.yaxis), mouseRect)) {
                        newSelection.add(a.id)
                      }
                    }
                    return newSelection
                  }
                })
                break
              case "zoom": // todo: command.zoomRegion
                zoom.x = 1 / mouseRect.width
                zoom.y = 1 / mouseRect.height
                scroll.x = -0.5 + (mouseRect.x + mouseRect.width / 2) * zoom.x
                scroll.y = -0.5 + (mouseRect.y + mouseRect.height / 2) * zoom.y
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
