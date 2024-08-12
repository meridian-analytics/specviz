import * as R from "react"
import * as Axis from "./axis"
import * as Plane from "./plane"
import * as Rect from "./rect"
import type * as Region from "./region"
import type * as Vector2 from "./vector2"
import * as Viewport from "./viewport"

export type AnnotationProps = {
  children?: typeof Annotation
  region: Region.Region
  dimensions: Vector2.tvector2
  selected?: boolean
}

function Annotation(props: AnnotationProps) {
  const plane = Plane.useContext()
  const viewport = Viewport.useContext()
  // compute logical rect
  const lrect: Rect.trect = R.useMemo(() => {
    return Rect.logical(
      Axis.computeRectInverse(plane.xaxis, plane.yaxis, props.region),
      plane.xaxis.unit == props.region.xunit,
      plane.yaxis.unit == props.region.yunit,
    )
  }, [plane.xaxis, plane.yaxis, props.region])
  // rect out of bounds (not on axis)
  if (Number.isNaN(lrect.x)) return <R.Fragment />
  if (Number.isNaN(lrect.y)) return <R.Fragment />
  if (Number.isNaN(lrect.width)) return <R.Fragment />
  if (Number.isNaN(lrect.height)) return <R.Fragment />
  // viewbox
  const width = lrect.width * props.dimensions.x * viewport.state.zoom.x
  const height = lrect.height * props.dimensions.y * viewport.state.zoom.y
  const viewBox = `0 0 ${width} ${height}`
  return (
    <svg
      key={props.region.id}
      className={
        props.selected ? "annotation annotation-selected" : "annotation"
      }
      x={String(lrect.x)}
      y={String(lrect.y)}
      width={String(lrect.width)}
      height={String(lrect.height)}
      viewBox={viewBox}
      preserveAspectRatio="none"
    >
      <rect width="100%" height="100%" />
      {props.children?.(props)}
    </svg>
  )
}

export default Annotation
