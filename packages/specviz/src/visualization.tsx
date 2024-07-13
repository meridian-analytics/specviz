import * as R from "react"
import Annotation from "./annotation"
import * as Axis from "./axis"
import Cursor from "./cursor"
import * as Hooks from "./hooks"
import * as Input from "./input"
import * as Plane from "./plane"
import Playhead from "./playhead"
import * as Rect from "./rect"
import * as Region from "./region"
import * as Svg from "./svg"
import * as Tool from "./tool"
import * as Viewport from "./viewport"

export type VisualizationProps = {
  children?: typeof Annotation
  ignoreRegionTransform?: boolean
  src: string
}

export default function Visualization(props: VisualizationProps) {
  const svgRoot = R.useRef<SVGSVGElement>(null)
  const svgSelection = R.useRef<SVGRectElement>(null)
  const input = Input.useContext()
  const plane = Plane.useContext()
  const region = Region.useContext()
  const tool = Tool.useContext()
  const viewport = Viewport.useContext()
  const dimensions = Hooks.useDimensions(svgRoot)

  Hooks.useAnimationFrame(
    R.useCallback(() => {
      if (svgSelection.current) {
        switch (tool.tool) {
          case "annotate":
          case "select":
          case "zoom":
            if (input.input.buttons & 1) {
              Svg.show(svgSelection.current)
              Svg.setRect(
                svgSelection.current,
                Rect.logical(
                  Rect.fromPoints(input.mousedown.abs, input.mouseup.abs), // input.mouseRect,
                  plane.xaxis === input.input.xaxis,
                  plane.yaxis === input.input.yaxis,
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
    }, [
      tool.tool,
      plane.xaxis,
      plane.yaxis,
      input.input,
      input.mousedown,
      input.mouseup,
    ]),
  )

  const onMouse = Hooks.useMouse(tool.actions)

  Hooks.useWheel(svgRoot, -1)

  const translate = `translate(${-viewport.state.scroll.x}, ${-viewport.state
    .scroll.y})`
  const scale = `scale(${viewport.state.zoom.x}, ${viewport.state.zoom.y})`
  const transform = `${translate} ${scale}`

  const axisTranslate = `translate(${-viewport.state.scroll.x}, 0)`
  const axisScale = `scale(${viewport.state.zoom.x}, 1)`
  const axisTransform = `${axisTranslate} ${axisScale}`

  return (
    <div className={`visualization ${tool.tool}`}>
      <svg ref={svgRoot} width="100%" height="100%" {...onMouse}>
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
        <rect
          className="dotted-grid"
          width="100%"
          height="100%"
          fill="url(#dotted-grid)"
        />
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
        >
          <g transform={transform}>
            <image
              preserveAspectRatio="none"
              href={props.src}
              width="100%"
              height="100%"
            />
            {Array.from(
              (props.ignoreRegionTransform
                ? region.regions
                : region.transformedRegions
              ).values(),
              r => (
                <Annotation
                  key={r.id}
                  children={props.children}
                  dimensions={dimensions}
                  region={r}
                  selected={(props.ignoreRegionTransform
                    ? region.selection
                    : region.transformedSelection
                  ).has(r.id)}
                  xaxis={plane.xaxis}
                  yaxis={plane.yaxis}
                />
              ),
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
          <g transform={axisTransform}>
            <Axis.Horizontal axis={plane.xaxis} dimensions={dimensions} />
          </g>
        </svg>
        <Cursor parent={svgRoot} />
      </svg>
    </div>
  )
}
