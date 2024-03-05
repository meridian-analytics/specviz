import { useMemo } from "react"
import { taxis } from "./axis"
import { useSpecviz } from "./hooks"
import { logical } from "./rect"
import { tregion } from "./types"

function Annotation(props: {
  region: tregion
  xaxis: taxis
  yaxis: taxis
}) {
  const { selection, regionCache } = useSpecviz()
  const lrect = useMemo(() => {
    const rect = regionCache.get(props.region.id)
    if (rect == null) return null
    return logical(
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
