import * as R from "react"
import * as Axis from "./axis"
import * as Hooks from "./hooks"
import * as Rect from "./rect"
import * as T from "./types"

function Annotation(props: {
  region: T.tregion
  xaxis: Axis.taxis
  yaxis: Axis.taxis
}) {
  const { selection, regionCache } = Hooks.useSpecviz()
  const lrect = R.useMemo(() => {
    const rect = regionCache.get(props.region.id)
    if (rect == null) return null
    return Rect.logical(
      rect,
      props.xaxis.unit == props.region.xunit,
      props.yaxis.unit == props.region.yunit,
    )
  }, [props, regionCache])
  if (lrect == null) {
    return <></>
  }
  return (
    <rect
      key={props.region.id}
      className={
        selection.has(props.region.id)
          ? "annotation annotation-selected"
          : "annotation"
      }
      x={String(lrect.x)}
      y={String(lrect.y)}
      width={String(lrect.width)}
      height={String(lrect.height)}
    />
  )
}

export default Annotation
