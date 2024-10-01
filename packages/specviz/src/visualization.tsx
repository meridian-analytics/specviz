import * as R from "react"
import * as Action from "./action"
import Cursor from "./cursor"
import * as Hooks from "./hooks"
import * as Input from "./input"
import * as Note from "./note"
import * as Plane from "./plane"
import Playhead from "./playhead"
import * as Rect from "./rect"
import * as Svg from "./svg"
import * as Viewport from "./viewport"

export type VisualizationProps = {
  children?: typeof Note.Annotation
  id?: string
  ignoreRegionTransform?: boolean
  showSelection?: boolean
  src: string
  svgProps?: React.SVGProps<SVGSVGElement>
}

export default function Visualization(props: VisualizationProps) {
  const ref = R.useRef<null | SVGSVGElement>(null)
  const note = Note.useContext()
  const action = Action.useContext()
  const viewport = Viewport.useContext()
  const dimensions = Hooks.useDimensions(ref)
  const onMouse = Hooks.useMouse(action)
  Hooks.useWheel(ref, action.onWheel)

  const translate = `translate(${-viewport.state.scroll.x}, ${-viewport.state
    .scroll.y})`
  const scale = `scale(${viewport.state.zoom.x}, ${viewport.state.zoom.y})`
  const transform = `${translate} ${scale}`
  return (
    <svg
      className="visualization"
      height="100%"
      width="100%"
      {...onMouse}
      {...props.svgProps}
      ref={ref}
    >
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
              ? note.regions
              : note.transformedRegions
            ).values(),
            r => (
              <Note.Annotation
                key={r.id}
                children={props.children}
                dimensions={dimensions}
                region={r}
                selected={(props.ignoreRegionTransform
                  ? note.selection
                  : note.transformedSelection
                ).has(r.id)}
                viewerId={props.id}
              />
            ),
          )}
          {props.showSelection && <Selection />}
          <Playhead />
        </g>
      </svg>
      <Cursor parent={ref} />
    </svg>
  )
}

function Selection() {
  const svgRef = R.useRef<SVGRectElement>(null)
  const input = Input.useContext()
  const plane = Plane.useContext()
  Hooks.useAnimationFrame(
    R.useCallback(() => {
      if (svgRef.current) {
        if (input.input.buttons & 1) {
          Svg.show(svgRef.current)
          Svg.setRect(
            svgRef.current,
            Rect.logical(
              Rect.fromPoints(input.mousedown.abs, input.mouseup.abs), // input.mouseRect,
              plane.xaxis === input.input.xaxis,
              plane.yaxis === input.input.yaxis,
            ),
          )
        } else {
          Svg.hide(svgRef.current)
        }
      }
    }, [plane.xaxis, plane.yaxis, input.input, input.mousedown, input.mouseup]),
  )
  return (
    <rect ref={svgRef} className="selection" x="0" y="0" width="0" height="0" />
  )
}
