import * as R from "react"
import * as Axis from "./axis"
import * as Rect from "./rect"
import * as Specviz from "./specviz"
import * as T from "./types"
import * as Vector2 from "./vector2"
import * as Viewport from "./viewport"

export type AnnotationProps = {
  children?: typeof Annotation
  region: T.tregion
  dimensions: Vector2.tvector2
  xaxis: Axis.taxis
  yaxis: Axis.taxis
  selected?: boolean
}

function Annotation(props: AnnotationProps) {
  const { regionCache } = Specviz.useContext()
  const viewport = Viewport.useContext()
  const lrect = R.useMemo<null | Rect.trect>(() => {
    const rect = regionCache.get(props.region.id)
    if (rect == null) return null
    return Rect.logical(
      rect,
      props.xaxis.unit == props.region.xunit,
      props.yaxis.unit == props.region.yunit,
    )
  }, [
    props.region.id,
    props.region.xunit,
    props.region.yunit,
    props.xaxis.unit,
    props.yaxis.unit,
    regionCache,
  ])
  if (lrect == null) return <R.Fragment />
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
